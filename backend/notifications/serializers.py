from rest_framework import serializers
from . import models


class GeneralNotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for the GeneralNotification model.
    This serializer is used to convert GeneralNotification model instances to JSON format and vice versa.
    """
    class Meta:
        model = models.GeneralNotification
        fields = '__all__'


class UserNotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for the UserNotification model.
    This serializer is used to convert UserNotification model instances to JSON format and vice versa.
    """
    class Meta:
        model = models.UserNotification
        exclude = ('user',)


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Notification model.
    This serializer is used to convert Notification model instances to JSON format and vice versa.
    """
    general_notification = GeneralNotificationSerializer(
        required=False, allow_null=True, source='generalnotification'
    )
    user_notification = UserNotificationSerializer(
        required=False, allow_null=True, source='usernotification'
    )
    class Meta:
        model = models.Notification
        fields = '__all__'