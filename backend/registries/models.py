from django.db import models
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
from django.contrib.auth import get_user_model
from accounts.models import TimeStampedBaseModel
 
User = get_user_model()


def generate_shareable_id():
    """
    Generates a unique shareable ID for the registry.
    This can be customized to use any unique identifier generation logic.
    """
    import uuid
    return str(uuid.uuid4())


class Registry(models.Model):
    """
    Represents a registry for a new mother, containing details about the services she needs.
    """
    name = models.CharField(
        max_length=255,
        verbose_name=_("Name"),
        help_text=_("The name of the registry owner."),
    )
    is_first_time = models.BooleanField(
        default=False,
        verbose_name=_("Is First Time Mom"),
        help_text=_("Indicates if this is the first child for the mother."),
    )
    babies_count = models.PositiveIntegerField(
        default=1,
        verbose_name=_("Babies Count"),
        help_text=_("The number of babies the mother has."),
    )
    shareable_id = models.CharField(
        max_length=255,
        unique=True,
        verbose_name=_("Shareable ID"),
        help_text=_("A unique identifier for sharing the registry."),
        default=generate_shareable_id,
        editable=False,
    )
    arrival_date = models.DateField(
        null=True,
        blank=True,
        verbose_name=_("Expected Arrival Date"),
        help_text=_("The expected date of arrival for the baby."),
    )
    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="registries",
        verbose_name=_("Created By"),
        help_text=_("The user who created the registry."),
    )
    thank_you_message = models.TextField(
        blank=True,
        verbose_name=_("Thank You Message"),
        help_text=_("A thank you message for contributors to the registry."),
    )
    welcome_message = models.TextField(
        blank=True,
        verbose_name=_("Welcome Message"),
        help_text=_("A welcome message for the registry."),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the registry was created."),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
        help_text=_("The date and time when the registry was last updated."),
    )

    class Meta:
        verbose_name = "Registry"
        verbose_name_plural = "Registries"
    
    def __str__(self):
        return f"{self.name} - {self.shareable_id}"


class Service(models.Model):
    """
    Represents a service that can be requested in the registry.
    """
    registry = models.ForeignKey(
        Registry,
        on_delete=models.CASCADE,
        related_name="services",
        verbose_name=_("Registry"),
        help_text=_("The registry to which this service belongs."),
    )
    name = models.CharField(
        max_length=255,
        verbose_name=_("Service Name"),
        help_text=_("The name of the service."),
    )
    description = models.TextField(
        blank=True,
        verbose_name=_("Description"),
        help_text=_("A description of the service."),
    )
    hours = models.PositiveIntegerField(
        default=1,
        verbose_name=_("Hours"),
        help_text=_("The number of hours the service will be provided."),
    )
    cost_per_hour = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Cost Per Hour in USD"),
        help_text=_("The cost per hour for the service."),
    )
    # allow_volunteers = models.BooleanField(
    #     default=False,
    #     verbose_name=_("Allow Volunteers"),
    #     help_text=_("Indicates if volunteers can contribute to this service."),
    # )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Is Active"),
        help_text=_("Indicates if the service is currently active."),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the service was created."),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
        help_text=_("The date and time when the service was last updated."),
    )
    # cashed_out = models.BooleanField(
    #     default=False,
    #     verbose_name=_("Cashed Out"),
    #     help_text=_("Indicates if the service has been cashed out."),
    # )
    total_withdrawn = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Total Withdrawn"),
        help_text=_("The total amount withdrawn for this service."),
    )

    class Meta:
        verbose_name = "Service"
        verbose_name_plural = "Services"
    
    def total_cost(self):
        """
        Calculates the total cost of the service based on hours and cost per hour.
        """
        return self.hours * self.cost_per_hour
    
    def total_contributions(self):
        """
        Calculates the total contributions made towards this service.
        This can be overridden in subclasses to implement custom contribution logic.
        """
        # The related_name is 'contributions', so self.contributions will always exist.
        # We filter for successful payments to get the total.
        total = self.contributions.filter(status='succeeded').aggregate(total=models.Sum('amount'))['total']
        return total or Decimal('0.00')
    
    def available_withdrawable_amount(self):
        """
        Calculates the available amount that can be withdrawn for this service.
        This is the total contributions minus the total withdrawn amount.
        """
        return self.total_contributions() - self.total_withdrawn
    
    def is_completed(self):
        """
        Checks if the service is completed based on contributions.
        This can be overridden in subclasses to implement custom completion logic.
        """
        return (self.total_contributions() >= self.total_cost()) and self.is_active
    
    def is_available(self):
        """
        Checks if the service is available for contributions.
        This can be overridden in subclasses to implement custom availability logic.
        """
        return self.is_active and not self.is_completed()
    
    def is_owned_by_user(self, user):
        """
        Checks if the service is owned by the given user.
        This method can be overridden in subclasses to implement custom ownership logic.
        """
        return self.registry.created_by == user
    
    def __str__(self):
        return f"{self.name} for {self.registry.name}"


class SharedRegistry(models.Model):
    """
    Represents a registry that has been shared with another user.
    """
    registry = models.ForeignKey(
        Registry,
        on_delete=models.CASCADE,
        related_name="shared_registry",
        verbose_name=_("Registry"),
        help_text=_("The registry that is shared."),
    )
    shared_with = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="shared_registries",
        verbose_name=_("Shared With"),
        help_text=_("The user with whom the registry is shared."),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the registry was shared."),
    )

    class Meta:
        verbose_name = "Shared Registry"
        verbose_name_plural = "Shared Registries"

    def __str__(self):
        return f"{self.registry.name} shared with {self.shared_with.email}"


class Contribution(TimeStampedBaseModel):
    """Represents a financial contribution made towards a service via Stripe."""
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        related_name="contributions",
        verbose_name=_("Service"),
        help_text=_("The service for which the contribution is made."),
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Amount"),
        help_text=_("The amount contributed towards the service."),
    )
    contributor_name = models.CharField(
        max_length=100,
        blank=True,
        verbose_name=_("Contributor Name"),
        help_text=_("The name of the person contributing."),
    )
    contributor_email = models.EmailField(
        blank=True,
        verbose_name=_("Contributor Email"),
        help_text=_("The email of the person contributing."),
    )
    stripe_payment_intent_id = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        null=True,  # Allow null for non-stripe contributions or existing rows
        blank=True, # Allow it to be blank in forms/admin
        verbose_name=_("Stripe Payment Intent ID"),
    )
    status = models.CharField(
        max_length=50,
        default='succeeded',
        verbose_name=_("Status"),
        help_text=_("The status of the payment from Stripe."),
    )

    class Meta:
        verbose_name = "Contribution"
        verbose_name_plural = "Contributions"
    
    def __str__(self):
        service_name = self.service.name if self.service else "a deleted service"
        return f"${self.amount} for {service_name} ({self.status})"


# class VolunteerContribution(models.Model):
#     """Represents a volunteer contribution towards a service in the registry."""
#     service = models.ForeignKey(
#         Service,
#         on_delete=models.CASCADE,
#         related_name="volunteers",
#         verbose_name=_("Service"),
#         help_text=_("The service for which the volunteer contribution is made."),
#     )
#     volunteer = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="volunteer_contributions",
#         verbose_name=_("Volunteer"),
#         help_text=_("The user who volunteered for the service."),
#     )
#     timeframe_from = models.DateTimeField(
#         verbose_name=_("Timeframe From"),
#         help_text=_("The start date and time of the volunteer contribution."),
#     )
#     timeframe_to = models.DateTimeField(
#         verbose_name=_("Timeframe To"),
#         help_text=_("The end date and time of the volunteer contribution."),
#     )
#     created_at = models.DateTimeField(
#         auto_now_add=True,
#         verbose_name=_("Created At"),
#         help_text=_("The date and time when the volunteer contribution was made."),
#     )

#     class Meta:
#         verbose_name = "Volunteer Contribution"
#         verbose_name_plural = "Volunteer Contributions"
    
#     def __str__(self):
#         return f"{self.volunteer.username} volunteered for {self.service.name} from {self.timeframe_from} to {self.timeframe_to}"


class DefaultService(models.Model):
    """
    Represents a default service that can be used in multiple registries.
    This allows for easy management of common services.
    """
    name = models.CharField(
        max_length=255,
        verbose_name=_("Default Service Name"),
        help_text=_("The name of the default service."),
    )
    description = models.TextField(
        blank=True,
        verbose_name=_("Description"),
        help_text=_("A description of the default service."),
    )
    hours = models.PositiveIntegerField(
        default=1,
        verbose_name=_("Hours"),
        help_text=_("The number of hours the default service will be provided."),
    )
    cost_per_hour = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Cost Per Hour in USD"),
        help_text=_("The cost per hour for the default service."),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the default service was created."),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
        help_text=_("The date and time when the default service was last updated."),
    )

    class Meta:
        verbose_name = "Default Service"
        verbose_name_plural = "Default Services"

    def total_cost(self):
        """
        Calculates the total cost of the default service based on hours and cost per hour.
        """
        return self.hours * self.cost_per_hour
    
    def __str__(self):
        return f"{self.name} - {self.hours} hours at {self.cost_per_hour} USD/hour"


class DefaultRegistry(models.Model):
    """
    Represents a default registry that can be used as a template for new registries.
    """
    cover_image = models.ImageField(
        upload_to='default_registries/',
        blank=True,
        null=True,
        verbose_name=_("Cover Image"),
        help_text=_("An optional cover image for the default registry."),
    )
    name = models.CharField(
        max_length=255,
        verbose_name=_("Name"),
        help_text=_("The name of the default registry."),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Created At"),
        help_text=_("The date and time when the default registry was created."),
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_("Updated At"),
        help_text=_("The date and time when the default registry was last updated."),
    )
    default_services = models.ManyToManyField(
        DefaultService,
        related_name="default_registries",
        default=[],
        blank=True,
        verbose_name=_("Services"),
        help_text=_("The default services included in this registry template."),
    )

    class Meta:
        verbose_name = "Default Registry"
        verbose_name_plural = "Default Registries"
    
    def __str__(self):
        return f"{self.name} - Default Registry"