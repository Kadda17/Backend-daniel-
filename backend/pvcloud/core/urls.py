from django.urls import path
from .views import (
    MatriculeTokenObtainView, FicheListView, FicheDetailView,
    FicheUploadScanView, FicheValidateOCRView, FicheScanRetrieveView
)

urlpatterns = [
    path('auth/login/', MatriculeTokenObtainView.as_view(), name='token_obtain_pair'),
    path('fiches/', FicheListView.as_view(), name='fiche-list'),
    path('fiches/<int:pk>/', FicheDetailView.as_view(), name='fiche-detail'),
    path('fiches/<int:pk>/upload_scan/', FicheUploadScanView.as_view(), name='fiche-upload-scan'),
    path('fiches/<int:pk>/validate/', FicheValidateOCRView.as_view(), name='fiche-validate'),
    path('fiches/<int:pk>/scan/', FicheScanRetrieveView.as_view(), name='fiche-scan'),
]
