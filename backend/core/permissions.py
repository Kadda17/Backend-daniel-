from rest_framework import permissions

# Les permissions contrôlent l'accès aux endpoints selon le rôle métier
# de l'utilisateur authentifié. Elles remplacent la logique de filtrage
# manuelle dans les vues et stabilisent les règles autour des fiches.

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'super_admin')

class IsScolariteOrSuper(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('scolarite', 'super_admin'))

class IsChefDepartementOrSuper(permissions.BasePermission):
    """Permission restreinte aux profils qui doivent gérer le dépôt des scans.

    Conformément au besoin métier, seul le super administrateur ou le chef
    de département est autorisé à ajouter ou manipuler les fiches scannées.
    """

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ('super_admin', 'chef_departement')
        )

class IsOwnerOrStaff(permissions.BasePermission):
    """Object-level: allow students to access only their own fiches; staff roles can view others."""
    def has_object_permission(self, request, view, obj):
        # obj expected to be Fiche
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role in ('super_admin', 'scolarite', 'enseignant', 'chef_departement', 'encadreur', 'jury'):
            return True
        # student: only own fiche
        try:
            # Candidate and User matricules correlate; for simplicity, compare matricule fields
            return hasattr(obj, 'candidat') and obj.candidat.matricule == request.user.matricule
        except Exception:
            return False
