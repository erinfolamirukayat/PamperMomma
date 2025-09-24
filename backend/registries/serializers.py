from rest_framework import serializers
from . import models
from django.utils import timezone
from django.db.models import Sum
from decimal import Decimal



class DefaultServiceSerializer(serializers.ModelSerializer):
    """
    Default serializer for the Service model.
    This serializer is used to convert Service model instances to JSON format and vice versa.
    """
    # total_cost = serializers.DecimalField(
    #     read_only=True,
    #     max_digits=10,
    #     decimal_places=2
    # )
    
    class Meta:
        model = models.DefaultService
        fields = ['name', 'description', 'hours', 'cost_per_hour']
        # all fields are read-only
        read_only_fields = ('created_at', 'updated_at', 'registry')


class DefaultRegistrySerializer(serializers.ModelSerializer):
    """
    Default serializer for the Registry model.
    This serializer is used to convert Registry model instances to JSON format and vice versa.
    """
    services = DefaultServiceSerializer(many=True, required=False, source='default_services')

    class Meta:
        model = models.DefaultRegistry
        exclude = ('default_services', 'created_at', 'updated_at')
        # all fields are read-only
        read_only_fields = ('created_at', 'updated_at')


class ContributionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Contribution model.
    This serializer is used to convert Contribution model instances to JSON format and vice versa.
    """
    class Meta:
        model = models.Contribution
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')


class CreatePaymentIntentSerializer(serializers.Serializer):
    """
    Serializer for validating the data needed to create a Stripe PaymentIntent.
    """
    service_id = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=10.00, help_text="Minimum contribution is $10.00")
    contributor_name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    contributor_email = serializers.EmailField(required=False, allow_blank=True)

class FinalizeWithdrawalSerializer(serializers.Serializer):
    """Serializer for validating the final withdrawal request with OTP."""
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=1.00)
    otp = serializers.CharField(max_length=6)
    device_identity = serializers.CharField(max_length=255)

class InitiateWithdrawalSerializer(serializers.Serializer):
    """Serializer for validating the initiation of a withdrawal."""
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=1.00)

# class VolunteerContributionSerializer(serializers.ModelSerializer):
#     """
#     Serializer for the VolunteerContribution model.
#     This serializer is used to convert VolunteerContribution model instances to JSON format and vice versa.
#     """
#     class Meta:
#         model = models.VolunteerContribution
#         fields = '__all__'
#         read_only_fields = ('created_at', 'volunteer')


class RegistryServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for the RegistryService model.
    This serializer is used to convert RegistryService model instances to JSON format and vice versa.
    """

    is_owned_by_user = serializers.SerializerMethodField()
    total_cost = serializers.DecimalField(
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    total_contributions = serializers.DecimalField(
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    is_completed = serializers.BooleanField(
        read_only=True,
        help_text="Indicates if the service is completed based on contributions."
    )
    is_available = serializers.BooleanField(
        read_only=True,
        help_text="Indicates if the service is available for contributions."
    )
    contributions = ContributionSerializer(many=True, required=False, read_only=True)
    # volunteers = VolunteerContributionSerializer(many=True, required=False, read_only=True)

    class Meta:
        model = models.Service
        exclude = ('registry',)
        read_only_fields = ('created_at', 'updated_at', 'cashed_out')

    def get_is_owned_by_user(self, obj) -> bool:
        """
        Check if the service is owned by the user.
        This method can be overridden in subclasses to implement custom ownership logic.
        """
        return obj.is_owned_by_user(self.context['request'].user)


class ServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for the Service model.
    This serializer is used to convert Service model instances to JSON format and vice versa.
    """
    is_owned_by_user = serializers.SerializerMethodField()
    total_cost = serializers.DecimalField(
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    total_contributions = serializers.DecimalField(
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    is_completed = serializers.BooleanField(
        read_only=True,
        help_text="Indicates if the service is completed based on contributions."
    )
    is_available = serializers.BooleanField(
        read_only=True,
        help_text="Indicates if the service is available for contributions."
    )
    available_withdrawable_amount = serializers.DecimalField(
        read_only=True,
        max_digits=10,
        decimal_places=2,
        help_text="The amount that can be withdrawn from the service."
    )
    contributions = ContributionSerializer(many=True, required=False)
    # volunteers = VolunteerContributionSerializer(many=True, required=False)

    class Meta:
        model = models.Service
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'registry')
    
    def get_is_owned_by_user(self, obj) -> bool:
        """
        Check if the service is owned by the user.
        This method can be overridden in subclasses to implement custom ownership logic.
        """
        return obj.is_owned_by_user(self.context['request'].user)
    

class RegistrySerializer(serializers.ModelSerializer):
    """
    Serializer for the Registry model.
    This serializer is used to convert Registry model instances to JSON format and vice versa.
    """
    services = ServiceSerializer(many=True, required=False)
    payouts_enabled = serializers.SerializerMethodField()
    total_withdrawn = serializers.SerializerMethodField()
    total_fees = serializers.SerializerMethodField()
    stripe_balance = serializers.SerializerMethodField()

    class Meta:
        model = models.Registry
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at',
                            'sharable_id', 'created_by')
    
    def get_payouts_enabled(self, obj) -> bool:
        """
        Check if the registry owner has a Stripe account ID.
        """
        return bool(obj.created_by.stripe_account_id)

    def get_total_withdrawn(self, obj) -> str:
        """Calculates the total amount withdrawn or pending withdrawal for the registry."""
        total = obj.withdrawals.filter(status__in=['pending', 'succeeded']).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        return str(total)

    def get_total_fees(self, obj) -> str:
        """Calculates the total Stripe fees for all successful contributions to the registry."""
        total_fees = models.Contribution.objects.filter(
            service__registry=obj, status='succeeded'
        ).aggregate(total=Sum('fee'))['total'] or Decimal('0.00')
        return str(total_fees)

    def get_stripe_balance(self, obj) -> dict:
        """
        Calculates the user-specific available and pending balances based on contribution data.
        """
        now = timezone.now()

        # Sum of contributions that are now available
        available_contributions = models.Contribution.objects.filter(
            service__registry=obj, status='succeeded', available_on__lte=now
        ).aggregate(total_amount=Sum('amount'), total_fee=Sum('fee'))

        # Sum of contributions that are still pending
        pending_contributions = models.Contribution.objects.filter(
            service__registry=obj, status='succeeded', available_on__gt=now
        ).aggregate(total_amount=Sum('amount'), total_fee=Sum('fee'))

        net_available = (available_contributions['total_amount'] or Decimal('0.00')) - (available_contributions['total_fee'] or Decimal('0.00'))
        net_pending = (pending_contributions['total_amount'] or Decimal('0.00')) - (pending_contributions['total_fee'] or Decimal('0.00'))

        # Total already withdrawn or in the process of being withdrawn
        total_withdrawn = obj.withdrawals.filter(status__in=['pending', 'succeeded']).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')

        true_withdrawable_amount = net_available - total_withdrawn

        return {'available': str(true_withdrawable_amount), 'pending': str(net_pending)}
    
    def create(self, validated_data):
        """
        Override the create method to handle nested service creation.
        This method allows creating a registry with associated services.
        """
        services_data = validated_data.pop('services', [])
        # Create the registry instance
        if 'created_by' not in validated_data:
            validated_data['created_by'] = self.context['request'].user
        registry = models.Registry.objects.create(**validated_data)
        # Create services associated with the registry
        for service_data in services_data:
            models.Service.objects.create(registry=registry, **service_data)
        registry.refresh_from_db()
        return registry


class PublicServiceSerializer(serializers.ModelSerializer):
    """
    Serializer for the Service model.
    """
    is_owned_by_user = serializers.SerializerMethodField()
    total_cost = serializers.DecimalField(
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    total_contributions = serializers.DecimalField(
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    is_completed = serializers.BooleanField(
        read_only=True,
        help_text="Indicates if the service is completed based on contributions."
    )
    is_available = serializers.BooleanField(
        read_only=True,
        help_text="Indicates if the service is available for contributions."
    )

    class Meta:
        model = models.Service
        exclude = []
        read_only_fields = ('created_at', 'updated_at', 'registry', 'cashed_out')
    
    def get_is_owned_by_user(self, obj) -> bool:
        """
        Check if the service is owned by the user.
        This method can be overridden in subclasses to implement custom ownership logic.
        """
        return obj.is_owned_by_user(self.context['request'].user)


class PublicRegistrySerializer(serializers.ModelSerializer):
    """
    Serializer for the Registry model.
    """
    services = PublicServiceSerializer(many=True, required=False)
    owner_first_name = serializers.CharField(source='created_by.first_name', read_only=True)

    class Meta:
        model = models.Registry
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at',
                            'sharable_id', 'created_by'),
    


class SharedRegistrySerializer(serializers.ModelSerializer):
    """
    Serializer for the SharedRegistry model.
    This serializer is used to convert SharedRegistry model instances to JSON format and vice versa.
    """
    registry = PublicRegistrySerializer(read_only=True)
    registry_shareable_id = serializers.CharField(
        write_only=True,
        help_text="Shareable ID of the registry being shared."
    )

    class Meta:
        model = models.SharedRegistry
        exclude = ('shared_with',)
        read_only_fields = ('created_at',)
    
    def create(self, validated_data):
        """
        Override the create method to handle sharing a registry with a user.
        This method allows sharing a registry with another user based on the shareable ID.
        """
        registry_shareable_id = validated_data.pop('registry_shareable_id')
        shared_with = self.context['request'].user
        try:
            registry = models.Registry.objects.get(shareable_id=registry_shareable_id)
        except models.Registry.DoesNotExist:
            raise serializers.ValidationError("Registry with the provided shareable ID does not exist.")
        
        shared_registry, created = models.SharedRegistry.objects.get_or_create(
            registry=registry,
            shared_with=shared_with
        )
        return shared_registry