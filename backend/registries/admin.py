from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import (Registry, Service, SharedRegistry, Contribution, DefaultRegistry, DefaultService)


@admin.register(Registry)
class RegistryAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_first_time', 'babies_count', 'shareable_id', 'arrival_date', 'created_by', 'created_at', 'updated_at')
    search_fields = ('name', 'shareable_id', 'created_by__username')
    list_filter = ('is_first_time', 'arrival_date', 'created_at')

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'total_cost', 'is_active', 'created_at', 'updated_at')
    search_fields = ('name', 'registry__name')
    list_filter = ('is_active', 'created_at')

@admin.register(SharedRegistry)
class SharedRegistryAdmin(admin.ModelAdmin):
    list_display = ('registry', 'shared_with', 'created_at')
    search_fields = ('registry__name', 'shared_with__username')
    list_filter = ('created_at',)

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display = ('service', 'contributor', 'amount', 'created_at')
    search_fields = ('service__name', 'contributor__username')
    list_filter = ('created_at',)

# @admin.register(VolunteerContribution)
# class VolunteerContributionAdmin(admin.ModelAdmin):
#     list_display = ('service', 'volunteer', 'timeframe_from', 'timeframe_to', 'created_at')
#     search_fields = ('service__name', 'volunteer__username')
#     list_filter = ('timeframe_from', 'timeframe_to', 'created_at')

@admin.register(DefaultService)
class DefaultServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'total_cost', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('created_at', 'updated_at')

@admin.register(DefaultRegistry)
class DefaultRegistryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('created_at', 'updated_at')
