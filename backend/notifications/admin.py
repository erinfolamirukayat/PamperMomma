from django.contrib import admin
from .models import GeneralNotification, UserNotification


@admin.register(GeneralNotification)
class GeneralNotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'tag', 'is_active', 'created_at', 'updated_at')
    search_fields = ('title', 'message', 'tag')
    list_filter = ('tag', 'is_active', 'created_at')
    exclude = ('notification_type',)

@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'is_read', 'created_at', 'updated_at')
    search_fields = ('user__email', 'title', 'message')
    list_filter = ('is_read', 'created_at')
    exclude = ('notification_type',)
