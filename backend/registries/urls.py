from rest_framework.routers import DefaultRouter
from .views import RegistryViewSet, ServiceViewSet, DefaultRegistryViewSet, DefaultServiceViewSet, PublicRegistryViewSet
from .views import SharedRegistryViewSet, ContributionViewSet
# VolunteerContributionViewSet


router = DefaultRouter()
router.register(r'r', RegistryViewSet, basename='registry')
router.register(r'default', DefaultRegistryViewSet, basename='default-registry')
router.register(r'services/default', DefaultServiceViewSet, basename='default-service')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'shared', SharedRegistryViewSet, basename='shared-registry')
router.register(r'public', PublicRegistryViewSet, basename='public-registry')
# router.register(r'u/contributions', ContributionViewSet, basename='contribution')
# router.register(r'u/volunteers', VolunteerContributionViewSet, basename='volunteer-contribution')


urlpatterns = router.urls
