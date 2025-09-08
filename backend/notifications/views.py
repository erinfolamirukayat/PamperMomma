from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import permissions
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from drf_spectacular.utils import extend_schema
from . import models, serializers


class NotificationViewSet(
    viewsets.mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    """
    A base viewset for notification-related operations.
    This can be extended by other viewsets to implement specific notification functionalities.
    """
    queryset = models.Notification.objects.all()
    serializer_class = serializers.NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override the default queryset to filter notifications based on the user's ownership.
        This ensures that users can only access notifications they have created.
        """
        return self.queryset.filter(Q(usernotification__user=self.request.user) | Q(generalnotification__is_active=True))
