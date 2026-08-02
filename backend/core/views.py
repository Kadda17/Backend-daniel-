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
from .permissions import IsSuperAdmin, IsScolariteOrSuper, IsOwnerOrStaff

class HealthView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, format=None):
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)

# Custom JWT token serializer to use matricule as login field and include role
class MatriculeTokenObtainSerializer(TokenObtainPairSerializer):
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
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'detail': 'Compte créé avec le rôle enseignant côté serveur.',
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class FicheListView(generics.ListAPIView):
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
    queryset = Fiche.objects.select_related('candidat').prefetch_related('jury').all()
    serializer_class = FicheDetailSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

class FicheUploadScanView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsSuperAdmin]
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
                    extracted = {'raw_text': text}
                    fiche.scan_extracted = extracted
                    fiche.save()
                except Exception as e:
                    # OCR failed; leave extracted as None and return warning
                    return Response({'detail': 'Uploaded but OCR failed', 'error': str(e)}, status=status.HTTP_202_ACCEPTED)
            return Response({'detail': 'Uploaded', 'extracted': extracted}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FicheValidateOCRView(generics.UpdateAPIView):
    queryset = Fiche.objects.all()
    serializer_class = FicheValidateSerializer
    permission_classes = [permissions.IsAuthenticated, IsScolariteOrSuper]

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

class FicheScanRetrieveView(views.APIView):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrStaff]

    def get(self, request, pk, format=None):
        fiche = get_object_or_404(Fiche, pk=pk)
        self.check_object_permissions(request, fiche)
        if not fiche.scan_file:
            return Response({'detail': 'No file'}, status=status.HTTP_404_NOT_FOUND)
        # Let Django serve it via MEDIA in dev; here return URL
        url = request.build_absolute_uri(fiche.scan_file.url)
        return Response({'scan_url': url})
