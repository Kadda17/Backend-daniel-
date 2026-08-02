from django.urls import path
from .views import (
    HealthView, RegisterView, ProfileView, MatriculeTokenObtainView, FicheListView, FicheDetailView,
    FicheUploadScanView, FicheValidateOCRView, FicheScanRetrieveView
)

# Ces routes exposent l'API principale versionnée par le backend.
# Elles découpent les opérations en trois grandes familles :
# - authentification et profil,
# - consultation/modification des fiches,
# - téléversement et validation des scans OCR.

urlpatterns = [
    path('health/', HealthView.as_view(), name='health'),
    path('auth/inscription/', RegisterView.as_view(), name='inscription'),
    path('auth/login/', MatriculeTokenObtainView.as_view(), name='token_obtain_pair'),
    path('auth/profil/', ProfileView.as_view(), name='profil'),
    path('fiches/', FicheListView.as_view(), name='fiche-list'),
    path('fiches/<int:pk>/', FicheDetailView.as_view(), name='fiche-detail'),
    path('fiches/<int:pk>/upload_scan/', FicheUploadScanView.as_view(), name='fiche-upload-scan'),
    path('fiches/<int:pk>/validate/', FicheValidateOCRView.as_view(), name='fiche-validate'),
    path('fiches/<int:pk>/scan/', FicheScanRetrieveView.as_view(), name='fiche-scan'),
]
