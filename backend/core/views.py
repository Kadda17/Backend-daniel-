import os
from rest_framework import generics, status, permissions, views
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import get_object_or_404
from django.conf import settings

from .models import Fiche, Candidate
from .models import User
from .serializers import (
    FicheListSerializer, FicheDetailSerializer, FicheScanUploadSerializer, FicheValidateSerializer,
    RegisterSerializer, UserSerializer, ProfileSerializer,
)
from .permissions import IsSuperAdmin, IsScolariteOrSuper, IsOwnerOrStaff, IsChefDepartementOrSuper

# Ce module contient la logique HTTP de l'API REST.
# Il expose les points d'entrée utilisés par le frontend pour :
# - vérifier l'état du backend,
# - s'authentifier via JWT,
# - créer un profil utilisateur,
# - consulter ou modifier les fiches de soutenance,
# - téléverser un scan et lancer un traitement OCR.

class HealthView(views.APIView):
    """Endpoint simple de contrôle de disponibilité du backend.

    Il est principalement utilisé pour vérifier qu'une instance du service
    répond correctement et qu'elle est bien démarrée.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)

# Custom JWT token serializer to use matricule as login field and include role
class MatriculeTokenObtainSerializer(TokenObtainPairSerializer):
    """Serializer JWT personnalisé pour l'authentification par matricule.

    Le login se fait avec le `matricule` au lieu du nom d'utilisateur standard.
    Le token ajoute ensuite des claims métier comme le rôle et le nom complet
    de l'utilisateur, afin de simplifier les contrôles côté frontend.
    """

    username_field = 'matricule'

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Include custom claims
        token['role'] = user.role
        token['matricule'] = user.matricule
        token['full_name'] = user.get_full_name()
        return token

class MatriculeTokenObtainView(TokenObtainPairView):
    serializer_class = MatriculeTokenObtainSerializer

class RegisterView(generics.CreateAPIView):
    """Endpoint d'inscription d'un nouvel utilisateur.

    L'inscription est ouverte à l'ensemble des utilisateurs et crée un compte
    avec le rôle `enseignant` côté serveur, indépendamment de toute logique
    frontale ou client-side. L'API attend dans le payload les informations
    de base du profil : nom, prénom, matricule, département, email et mot
    de passe.
    """

    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'detail': 'Compte créé avec succès. Les informations métier de base ont été enregistrées.',
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)

class ProfileView(generics.RetrieveUpdateAPIView):
    """Vue du profil connecté.

    Elle permet de récupérer les informations de l'utilisateur courant et
    éventuellement de les mettre à jour en gardant une stricte logique
    d'authentification.
    """

    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class FicheListView(generics.ListAPIView):
    """Liste paginée et filtrable des fiches métier.

    Cette vue sert à afficher les fiches sur le tableau de bord. Elle prend
    en charge les filtres par date, salle, année, encadreur et candidat, ainsi
    que la recherche textuelle sur le nom et matricule du candidat.
    """

    queryset = Fiche.objects.select_related('candidat').prefetch_related('jury').all().order_by('-date')
    serializer_class = FicheListSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['date', 'salle', 'candidat__matricule']
    search_fields = ['candidat__last_name', 'candidat__first_name', 'candidat__matricule']
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        # year filter (on date)
        year = self.request.query_params.get('year')
        encadreur = self.request.query_params.get('encadreur')
        candidat = self.request.query_params.get('candidat')
        if year:
            qs = qs.filter(date__year=year)
        if encadreur:
            qs = qs.filter(jury__name__icontains=encadreur)
        if candidat:
            qs = qs.filter(candidat__matricule__icontains=candidat)
        # Students can only see their own fiches
        user = self.request.user
        if user.role == 'student':
            qs = qs.filter(candidat__matricule=user.matricule)
        return qs

class FicheDetailView(generics.RetrieveAPIView):
    """Détail complet d'une fiche.

    La vue récupère une fiche précise avec ses informations détaillées et
    les données de scan si elles existent. L'accès est restreint par la
    permission `IsOwnerOrStaff`, ce qui protège les fiches d'un étudiant
    contre les autres utilisateurs.
    """

    queryset = Fiche.objects.select_related('candidat').prefetch_related('jury').all()
    serializer_class = FicheDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

def _normalize_ocr_payload(text: str) -> dict:
    """Structure le texte OCR brut en un dictionnaire métier exploitable.

    L'objectif est de normaliser les informations de base attendues sur une
    fiche de soutenance : matricule, étudiant, date/heure, département,
    filière, thème, encadreur/rapporteur et mention.
    """

    normalized = {
        'raw_text': text,
        'matricule': None,
        'nom_etudiant': None,
        'date_heure_soutenance': None,
        'departement_filiere': None,
        'theme_soutenance': None,
        'encadreur_rapporteur': None,
        'mention': None,
    }

    lines = [line.strip() for line in text.splitlines() if line.strip()]
    for line in lines:
        lower = line.lower()
        if 'matricule' in lower:
            normalized['matricule'] = line.split(':', 1)[-1].strip() if ':' in line else line
        elif 'nom de l\'etudiant' in lower or 'nom etudiant' in lower:
            normalized['nom_etudiant'] = line.split(':', 1)[-1].strip() if ':' in line else line
        elif 'date' in lower and 'heure' in lower:
            normalized['date_heure_soutenance'] = line.split(':', 1)[-1].strip() if ':' in line else line
        elif 'department' in lower or 'd\xe9partement' in lower or 'filiere' in lower:
            normalized['departement_filiere'] = line.split(':', 1)[-1].strip() if ':' in line else line
        elif 'theme' in lower or 'sujet' in lower:
            normalized['theme_soutenance'] = line.split(':', 1)[-1].strip() if ':' in line else line
        elif 'encadreur' in lower or 'rapporteur' in lower:
            normalized['encadreur_rapporteur'] = line.split(':', 1)[-1].strip() if ':' in line else line
        elif 'mention' in lower:
            normalized['mention'] = line.split(':', 1)[-1].strip() if ':' in line else line

    return normalized

class FicheUploadScanView(views.APIView):
    """Téléversement du scan associé à une fiche.

    Cette vue accepte un fichier PDF ou image, le stocke dans le champ
    `scan_file`, puis tente d'extraire du texte via OCR. Le texte brut est
    ensuite normalisé en un dictionnaire métier exploitable pour les demandes
    de recherche et de traitement ultérieur.
    """

    permission_classes = [permissions.IsAuthenticated, IsChefDepartementOrSuper]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk, format=None):
        fiche = get_object_or_404(Fiche, pk=pk)
        serializer = FicheScanUploadSerializer(fiche, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # run OCR if possible
            extracted = None
            file_path = None
            if fiche.scan_file:
                file_path = fiche.scan_file.path
            if file_path and os.path.exists(file_path):
                try:
                    # Import here to avoid hard dependency if pytesseract isn't installed
                    from pdf2image import convert_from_path
                    import pytesseract
                    from PIL import Image
                    name = file_path.lower()
                    text = ''
                    if name.endswith('.pdf'):
                        pages = convert_from_path(file_path)
                        for p in pages:
                            text += pytesseract.image_to_string(p, lang='eng+fra') + '\n'
                    else:
                        img = Image.open(file_path)
                        text = pytesseract.image_to_string(img, lang='eng+fra')
                    extracted = _normalize_ocr_payload(text)
                    fiche.scan_extracted = extracted
                    fiche.save()
                except Exception as e:
                    # OCR failed; leave extracted as None and return warning
                    return Response({'detail': 'Uploaded but OCR failed', 'error': str(e)}, status=status.HTTP_202_ACCEPTED)
            return Response({'detail': 'Uploaded', 'extracted': extracted}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FicheValidateOCRView(generics.UpdateAPIView):
    """Validation du contenu OCR extrait sur une fiche.

    La scolarité ou le super administrateur peut confirmer ou ajuster la
    structure JSON OCR associée à la fiche. La cible est d'obtenir une
    représentation normalisée des informations attendues pour la recherche.
    """

    queryset = Fiche.objects.all()
    serializer_class = FicheValidateSerializer
    permission_classes = [permissions.IsAuthenticated, IsScolariteOrSuper]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

class FicheScanRetrieveView(views.APIView):
    """Retourne l'URL publique du scan d'une fiche.

    Cette vue ne renvoie pas le binaire du fichier lui-même, mais une URL
    complète permettant au client de l'afficher ou de le télécharger. Elle
    reste sécurisée en s'appuyant sur les permissions d'accès aux fiches.
    """

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def get(self, request, pk, format=None):
        fiche = get_object_or_404(Fiche, pk=pk)
        self.check_object_permissions(request, fiche)
        if not fiche.scan_file:
            return Response({'detail': 'No file'}, status=status.HTTP_404_NOT_FOUND)
        # Let Django serve it via MEDIA in dev; here return URL
        url = request.build_absolute_uri(fiche.scan_file.url)
        return Response({'scan_url': url})
