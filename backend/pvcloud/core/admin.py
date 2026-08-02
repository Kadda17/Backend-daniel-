from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Candidate, JuryMember, Fiche

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('matricule', 'username', 'first_name', 'last_name', 'role', 'is_staff')
    search_fields = ('matricule', 'username', 'first_name', 'last_name')
    ordering = ('matricule',)

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ('matricule', 'last_name', 'first_name', 'department')
    search_fields = ('matricule', 'last_name', 'first_name')

@admin.register(JuryMember)
class JuryMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role')

@admin.register(Fiche)
class FicheAdmin(admin.ModelAdmin):
    list_display = ('candidat', 'sujet', 'date', 'salle', 'heure', 'note', 'mention')
    search_fields = ('candidat__matricule', 'candidat__last_name', 'candidat__first_name', 'sujet')
