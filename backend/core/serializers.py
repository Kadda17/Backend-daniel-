from django.core.validators import FileExtensionValidator
from rest_framework import serializers
from .models import User, Candidate, JuryMember, Fiche

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'matricule', 'username', 'first_name', 'last_name', 'role')
        read_only_fields = ('id', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('matricule', 'username', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['username'] = validated_data.get('username') or validated_data['matricule']
        user = User(**validated_data, role='enseignant')
        user.set_password(password)
        user.save()
        return user

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'matricule', 'username', 'first_name', 'last_name', 'role')
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
    candidat = CandidateSerializer(read_only=True)
    jury = JuryMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Fiche
        fields = ('id', 'candidat', 'sujet', 'date', 'salle', 'heure', 'note', 'mention', 'jury')

class FicheDetailSerializer(serializers.ModelSerializer):
    candidat = CandidateSerializer()
    jury = JuryMemberSerializer(many=True)

    class Meta:
        model = Fiche
        fields = ('id', 'candidat', 'sujet', 'date', 'salle', 'heure', 'note', 'mention', 'jury', 'scan_file', 'scan_extracted')
        read_only_fields = ('scan_extracted',)

class FicheScanUploadSerializer(serializers.ModelSerializer):
    scan_file = serializers.FileField(
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'png', 'jpg', 'jpeg'])]
    )

    class Meta:
        model = Fiche
        fields = ('scan_file',)

class FicheValidateSerializer(serializers.ModelSerializer):
    # used for validating/modifying extracted OCR fields before persisting
    scan_extracted = serializers.JSONField()

    class Meta:
        model = Fiche
        fields = ('scan_extracted',)
