from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from . import models, serializers


class RegistryViewSet(viewsets.ModelViewSet):
    """
    A base viewset for registry-related operations.
    This can be extended by other viewsets to implement specific registry functionalities.
    """
    queryset = models.Registry.objects.all()
    serializer_class = serializers.RegistrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override the default queryset to filter registries based on the user's ownership.
        This ensures that users can only access registries they have created.
        """
        return self.queryset.filter(created_by=self.request.user)


class PublicRegistryViewSet(
    viewsets.mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """
    A base viewset for public registry-related operations.
    """
    queryset = models.Registry.objects.all()
    serializer_class = serializers.PublicRegistrySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'shareable_id'


class ServiceViewSet(viewsets.ModelViewSet):
    """
    A base viewset for service-related operations.
    This can be extended by other viewsets to implement specific service functionalities.
    """
    queryset = models.Service.objects.all()
    serializer_class = serializers.ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['registry']

    def get_queryset(self):
        """
        Override the default queryset to filter services based on the user's ownership or shared.
        """
        # return self.queryset.filter(registry__created_by=self.request.user)
        return self.queryset.filter(
            Q(registry__created_by=self.request.user) |
            Q(registry__shared_registry__shared_with=self.request.user)
        ).distinct()

    @action(methods=['get'], detail=True)
    def contributions(self, request, pk=None):
        """
        Custom action to retrieve contributions for the service.
        This can be used to implement functionalities related to contributions.
        """
        service = self.get_object()
        contributions = service.contributions.all()
        serializer = serializers.ContributionSerializer(
            contributions, many=True)
        return Response(serializer.data)

    # @action(methods=['get'], detail=False)
    # def volunteers(self, request):
    #     """
    #     Custom action to retrieve volunteer contributions for the service.
    #     This can be used to implement functionalities related to volunteer contributions.
    #     """
    #     service = self.get_object()
    #     volunteers = service.volunteers.all()
    #     serializer = serializers.VolunteerContributionSerializer(volunteers, many=True)
    #     return Response(serializer.data)


class DefaultRegistryViewSet(
    viewsets.mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    A default viewset for registry operations.
    This can be used as a base for other registry-related viewsets.
    """
    queryset = models.DefaultRegistry.objects.all()
    serializer_class = serializers.DefaultRegistrySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class DefaultServiceViewSet(
    viewsets.mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    """
    A default viewset for service operations.
    This can be used as a base for other service-related viewsets.
    """
    queryset = models.DefaultService.objects.all()
    serializer_class = serializers.DefaultServiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class SharedRegistryViewSet(
    viewsets.mixins.ListModelMixin,
    viewsets.mixins.RetrieveModelMixin,
    viewsets.GenericViewSet
):
    """
    A viewset for shared registries.
    This can be used to implement functionalities related to shared registries.
    """
    queryset = models.SharedRegistry.objects.all()
    serializer_class = serializers.SharedRegistrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override the default queryset to filter shared registries based on the user's shared with.
        """
        return self.queryset.filter(shared_with=self.request.user)

    @extend_schema(
        methods=['get'],
        description="Retrieve a single service from a shared registry.",
        responses={200: serializers.PublicServiceSerializer()}
    )
    @action(methods=['get'], detail=True, url_path='services/(?P<service_pk>[^/.]+)')
    def shared_registry_service(self, request, pk=None, service_pk=None):
        """
        Custom action to retrieve a service from a shared registry.
        """
        shared_registry = self.get_object()
        service = shared_registry.registry.services.filter(
            pk=service_pk).first()
        if not service:
            return Response({'detail': 'Service not found.'}, status=404)

        serializer = serializers.PublicServiceSerializer(
            service, context={'request': request})
        return Response(serializer.data)


class ContributionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A read-only viewset for users to view contributions made to services
    in registries they own. Contributions are created via the Stripe webhook.
    """
    queryset = models.Contribution.objects.all()
    serializer_class = serializers.ContributionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override the default queryset to filter contributions for services
        owned by the requesting user.
        """
        user = self.request.user
        return self.queryset.filter(service__registry__created_by=user)


# class VolunteerContributionViewSet(viewsets.ModelViewSet):
#     """
#     A viewset for users volunteering contributions to a registry services.
#     This can be used to implement functionalities related to volunteer contributions.
#     """
#     queryset = models.VolunteerContribution.objects.all()
#     serializer_class = serializers.VolunteerContributionSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         """
#         Override the default queryset to filter volunteer contributions based on the volunteer.
#         """
#         return self.queryset.filter(volunteer=self.request.user)
