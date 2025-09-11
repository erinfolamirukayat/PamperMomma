from rest_framework import serializers
from . import models


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
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0.50, help_text="Minimum contribution is $0.50")


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

    class Meta:
        model = models.Registry
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at',
                            'sharable_id', 'created_by')
    
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
        exclude = ['total_withdrawn']
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