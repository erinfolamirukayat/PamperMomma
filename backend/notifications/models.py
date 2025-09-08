from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model


User = get_user_model()


class Notification(models.Model):
    """
    Represents a notification.
    """
    NOTIFICATION_TYPE_CHOICES = [
        ('general', _('General')),
        ('user', _('User')),
    ]
    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPE_CHOICES,
        verbose_name=_("Notification Type"),
        help_text=_("The type of notification."),
    )
    title = models.CharField(
        max_length=255,
        verbose_name=_("Title"),
        help_text=_("The title of the notification."),
    )
    message = models.TextField(
        verbose_name=_("Message"),
        help_text=_("The content of the notification."),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the notification was created."),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
        help_text=_("The date and time when the notification was last updated."),
    )


class GeneralNotification(Notification):
    """
    Represents a general notification that can be sent to all users.
    """
    TAG_CHOICES = [
        ('info', _('Information')),
        ('alert', _('Alert')),
        ('reminder', _('Reminder')),
    ]
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is Active"),
        help_text=_("Indicates if the notification is currently active."),
    )
    tag = models.CharField(
        max_length=50,
        choices=TAG_CHOICES,
        verbose_name=_("Tag"),
        help_text=_("The tag associated with the notification."),
    )

    class Meta:
        verbose_name = _("General Notification")
        verbose_name_plural = _("General Notifications")
    
    def save(self, *args, **kwargs):
        """
        Override save method to ensure that the notification type is set correctly.
        """
        self.notification_type = 'general'
        super().save(*args, **kwargs)


class UserNotification(Notification):
    """
    Represents a notification that is sent to a specific user.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications",
        verbose_name=_("User"),
        help_text=_("The user to whom the notification is sent."),
    )
    is_read = models.BooleanField(
        default=False,
        verbose_name=_("Is Read"),
        help_text=_("Indicates if the notification has been read by the user."),
    )
    
    class Meta:
        verbose_name = _("User Notification")
        verbose_name_plural = _("User Notifications")
    
    def save(self, *args, **kwargs):
        """
        Override save method to ensure that the notification type is set correctly.
        """
        self.notification_type = 'user'
        super().save(*args, **kwargs)