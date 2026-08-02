from typing import ClassVar

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator

# Ce module représente le modèle de données métier de l'application.
# Il centralise les notions d'utilisateurs, de candidats, de membres du jury
# et des fiches d'évaluation liées à une soutenance ou un examen.

class User(AbstractUser):
    """Utilisateur de l'application, avec un rôle métier distinct.

    Le champ `matricule` sert d'identifiant d'authentification principal,
    le champ `department` mémorise le département de rattachement, et le
    champ `role` pilote les permissions sur les différentes API.
    """
    ROLE_CHOICES: ClassVar[tuple[tuple[str, str], ...]] = (
        ('super_admin', 'Super administrateur'),
        ('scolarite', 'Scolarité'),
        ('enseignant', 'Enseignant'),
        ('chef_departement', 'Chef de département'),
        ('encadreur', 'Encadreur'),
        ('jury', 'Membre du jury'),
        ('student', 'Étudiant'),
    )
    matricule = models.CharField(max_length=64, unique=True)
    department = models.CharField(max_length=200, blank=True)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default='student')

    USERNAME_FIELD = 'matricule'
    REQUIRED_FIELDS: ClassVar[list[str]] = ['username']

    def __str__(self):
        return f"{self.matricule} - {self.get_full_name()}"

class Candidate(models.Model):
    """Candidat associé à une fiche de soutenance.

    Un candidat est l'étudiant dont la fiche de notation est gérée par
    l'application. Son matricule est unique et sert de clé de liaison.
    """

    matricule = models.CharField(max_length=64, unique=True)
    last_name = models.CharField(max_length=200)
    first_name = models.CharField(max_length=200)
    department = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f"{self.matricule} - {self.last_name} {self.first_name}"

class JuryMember(models.Model):
    """Membre du jury ou encadreur mentionné dans une fiche.

    Le rôle indique la fonction exacte du membre de jury sur la fiche
    (président, examinateur, encadreur académique, etc.).
    """

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
    """Fiche métier contenant les informations d'une évaluation.

    Une fiche regroupe le candidat concerné, le sujet, la date, la salle,
    l'heure, la note, la mention ainsi que les membres du jury associés.
    Elle peut aussi stocker le scan numérisé et le texte OCR extrait.
    """

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