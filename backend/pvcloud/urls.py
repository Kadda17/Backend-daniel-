from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

# Point d'entrée HTTP du projet Django.
# La racine publique redirige toutes les requêtes vers l'application `core`
# sous le préfixe `api/v1/`, puis les media sont servis en DEBUG.

urlpatterns = [
    path('api/v1/', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
