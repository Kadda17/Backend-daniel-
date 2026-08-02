from django.core.validators import FileExtensionValidator
from rest_framework import serializers
from .models import User, Candidate, JuryMember, Fiche

# Les serializers servent de couche de transformation entre les objets Django
# et les payloads JSON envoyés/retournés par l'API REST.
# Ils permettent aussi de contrôler les champs lisibles et modifiables.

class UserSerializer(serializers.ModelSerializer):
    """Serializer de lecture d'un utilisateur authentifié.

    Il expose les informations minimales nécessaires pour l'interface et
    la navigation sur les fiches de soutenance.
    """

    class Meta:
        model = User
        fields = ('id', 'matricule', 'username', 'first_name', 'last_name', 'email', 'department', 'role')
        read_only_fields = ('id', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    """Serializer dédié à l'inscription d'un nouvel utilisateur.

    La plateforme attend un compte construit à partir du nom, prénom,
    matricule, département, adresse email et mot de passe. La création
    sert également à alimenter le profil utilisateur utilisé pour les
    recherches et les permissions sur les fiches.
    """

    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('matricule', 'username', 'first_name', 'last_name', 'department', 'email', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        # Le nom d'utilisateur interne doit rester unique et stable. S'il n'est
        # pas fourni, on le construit à partir du matricule afin de respecter
        # la logique Django et l'authentification par matricule.
        validated_data['username'] = validated_data.get('username') or validated_data['matricule']
        # Le rôle par défaut est fixé côté serveur pour éviter une falsification
        # depuis le frontend. Cela garde une règle métier simple et centralisée.
        user = User(**validated_data, role='enseignant')
        user.set_password(password)
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    """Serializer de consultation et mise à jour du profil utilisateur.

    Il garde la reconnaissance du rôle et du matricule comme identifiants
    métier stables, tout en laissant le frontend accéder aux informations
    de base du compte.
    """

    class Meta:
        model = User
        fields = ('id', 'matricule', 'username', 'first_name', 'last_name', 'email', 'department', 'role')
        read_only_fields = ('id', 'matricule', 'username', 'role')

class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = ('id', 'matricule', 'last_name', 'first_name', 'department')

class JuryMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = JuryMember
        fields = ('id', 'name', 'role')

class FicheListSerializer(serializers.ModelSerializer):
    """Vue compacte de la fiche utilisée dans la liste.

    Cette sérialisation est optimisée pour afficher plusieurs fiches en une
    seule requête sans exposer les détails lourds comme le scan OCR.
    """

    candidat = CandidateSerializer(read_only=True)
    jury = JuryMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Fiche
        fields = ('id', 'candidat', 'sujet', 'date', 'salle', 'heure', 'note', 'mention', 'jury')

class FicheDetailSerializer(serializers.ModelSerializer):
    """Vue détaillée d'une fiche complète.

    Elle expose les informations de la fiche ainsi que le fichier numérique
    importé et le JSON OCR extrait, qui pourront ensuite être validés par
    le personnel de la scolarité.
    """

    candidat = CandidateSerializer()
    jury = JuryMemberSerializer(many=True)

    class Meta:
        model = Fiche
        fields = ('id', 'candidat', 'sujet', 'date', 'salle', 'heure', 'note', 'mention', 'jury', 'scan_file', 'scan_extracted')
        read_only_fields = ('scan_extracted',)

class FicheScanUploadSerializer(serializers.ModelSerializer):
    """Serializer dédié au téléversement du scan d'une fiche.

    Seuls les formats PDF, PNG et JPG sont autorisés. Le fichier est
    ensuite traité côté serveur par l'OCR pour produire du texte extrait.
    """

    scan_file = serializers.FileField(
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'png', 'jpg', 'jpeg'])]
    )

    class Meta:
        model = Fiche
        fields = ('scan_file',)

class FicheValidateSerializer(serializers.ModelSerializer):
    """Serializer de validation du contenu OCR exploitable.

    Le texte OCR peut être corrigé ou enrichi avant d'être enregistré comme
    contenu validé sur la fiche. Cela permet de vérifier la qualité de
    l'extraction avant sauvegarde finale.
    """

    scan_extracted = serializers.JSONField()

    class Meta:
        model = Fiche
        fields = ('scan_extracted',)
