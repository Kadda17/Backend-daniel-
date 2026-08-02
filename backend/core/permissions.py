from rest_framework import permissions

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'super_admin')

class IsScolariteOrSuper(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role in ('scolarite', 'super_admin'))

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
