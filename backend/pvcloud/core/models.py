from typing import ClassVar

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

class User(AbstractUser):
    ROLE_CHOICES: ClassVar[tuple[tuple[str, str], ...]] = (
        ('super_admin', 'Super administrateur'),
        ('scolarite', 'Scolarité'),
        ('encadreur', 'Encadreur'),
        ('jury', 'Membre du jury'),
        ('student', 'Étudiant'),
    )
    matricule = models.CharField(max_length=64, unique=True)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default='student')

    USERNAME_FIELD = 'matricule'
    REQUIRED_FIELDS: ClassVar[list[str]] = ['username']

    def __str__(self):
        return f"{self.matricule} - {self.get_full_name()}"

class Candidate(models.Model):
    matricule = models.CharField(max_length=64, unique=True)
    last_name = models.CharField(max_length=200)
    first_name = models.CharField(max_length=200)
    department = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.matricule} - {self.last_name} {self.first_name}"

class JuryMember(models.Model):
    ROLE_CHOICES: ClassVar[tuple[tuple[str, str], ...]] = (
        ('encadreur_academique', 'Encadreur académique'),
        ('president', 'Président'),
        ('examinateur', 'Examinateur'),
        ('encadreur_professionnel', 'Encadreur professionnel'),
    )
    name = models.CharField(max_length=300)
    role = models.CharField(max_length=64, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"

class Fiche(models.Model):
    candidat = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='fiches')
    sujet = models.TextField()
    date = models.DateField()
    salle = models.CharField(max_length=100, blank=True)
    heure = models.TimeField(null=True, blank=True)
    note = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True,
                               validators=[MinValueValidator(0), MaxValueValidator(20)])
    mention = models.CharField(max_length=100, blank=True)
    jury = models.ManyToManyField(JuryMember, blank=True, related_name='fiches')
    scan_file = models.FileField(upload_to='scans/', null=True, blank=True)
    scan_extracted = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Fiche {self.candidat} - {self.sujet[:40]}"