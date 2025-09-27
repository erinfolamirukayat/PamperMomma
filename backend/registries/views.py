from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Sum
from django.utils import timezone
import stripe
from django.conf import settings
from utilities.email import EmailDispatcher
import logging
from accounts.models import OTPRequest
from drf_spectacular.utils import extend_schema
from . import models, serializers
import threading
from decimal import Decimal
from datetime import datetime

logger = logging.getLogger(__name__)


class RegistryViewSet(viewsets.ModelViewSet):
    """
    A base viewset for registry-related operations.
    This can be extended by other viewsets to implement specific registry functionalities.
    """
    queryset = models.Registry.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Override the default queryset to filter registries based on the user's ownership.
        This ensures that users can only access registries they have created.
        """
        return self.queryset.filter(created_by=self.request.user)

    def get_serializer_class(self):
        """
        Return the appropriate serializer class based on the request action.
        """
        if self.action == 'create':
            return serializers.RegistrySerializer
        return serializers.RegistrySerializer

    def retrieve(self, request, *args, **kwargs):
        """
        Override retrieve to enrich the response with real-time Stripe balance information.
        This method also lazily updates contribution records with fee and availability data.
        """
        instance = self.get_object()

        # --- START of new lazy-loading logic ---
        contributions_to_update = models.Contribution.objects.filter(
            service__registry=instance,
            status='succeeded',
            available_on__isnull=True  # Find contributions that need updating
        )

        updated_contributions = []
        for contrib in contributions_to_update:
            try:
                print(f"[LAZY LOAD] Updating contribution for PI: {contrib.stripe_payment_intent_id}")
                payment_intent = stripe.PaymentIntent.retrieve(contrib.stripe_payment_intent_id)
                charge_id = payment_intent.get('latest_charge')

                if charge_id:
                    charge = stripe.Charge.retrieve(charge_id)
                    balance_transaction_id = charge.get('balance_transaction')
                    if balance_transaction_id:
                        balance_transaction = stripe.BalanceTransaction.retrieve(balance_transaction_id)
                        contrib.fee = Decimal(balance_transaction.fee) / 100
                        if balance_transaction.available_on:
                            contrib.available_on = datetime.fromtimestamp(balance_transaction.available_on, tz=timezone.utc)
                        updated_contributions.append(contrib)
            except Exception as e:
                logger.error(f"Failed to lazily update contribution {contrib.id}: {e}", exc_info=True)
        
        if updated_contributions:
            models.Contribution.objects.bulk_update(updated_contributions, ['fee', 'available_on'])
            print(f"[LAZY LOAD] Bulk updated {len(updated_contributions)} contributions.")
        # --- END of new lazy-loading logic ---

        # The serializer now handles all financial calculations.
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], url_path='create-connect-account')
    def create_stripe_connect_account(self, request):
        """
        Creates a Stripe Express account for the logged-in user and returns an onboarding link.
        If an account already exists, it returns a new login link to manage the account.
        """
        user = request.user
        try:
            # If the user already has a Stripe account, create a login link to manage it.
            if user.stripe_account_id:
                account = stripe.Account.retrieve(user.stripe_account_id)
                # If onboarding is complete, create a login link.
                if account.details_submitted:
                    login_link = stripe.Account.create_login_link(user.stripe_account_id)
                    return Response({'url': login_link.url})

            # If no account or onboarding is incomplete, create a new account or use existing one.
            if not user.stripe_account_id:
                account = stripe.Account.create(
                    type='express',
                    email=user.email,
                    business_type='individual',
                    capabilities={'card_payments': {'requested': True}, 'transfers': {'requested': True}},
                )
                user.stripe_account_id = account.id
                user.save()
            else:
                account = stripe.Account.retrieve(user.stripe_account_id)

            # Construct return and refresh URLs from frontend settings
            from urllib.parse import urljoin
            base_frontend_url = urljoin(settings.FRONTEND_VERIFY_EMAIL_URL, '.')
            return_url = urljoin(base_frontend_url, '/mom/registries?onboarding_return=success')
            refresh_url = urljoin(base_frontend_url, '/mom/registries?onboarding_return=refresh')

            account_link = stripe.AccountLink.create(
                account=account.id,
                refresh_url=refresh_url,
                return_url=return_url,
                type='account_onboarding',
            )
            return Response({'url': account_link.url})
        except stripe.error.StripeError as e:
            return Response({'detail': f"An error occurred with our payment processor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='initiate-withdrawal-verification')
    def initiate_withdrawal_verification(self, request, pk=None):
        """
        Initiates the withdrawal process by sending a verification code to the user's email.
        """
        registry = self.get_object()
        user = request.user

        if registry.created_by != user:
            return Response({"detail": "You do not have permission to withdraw from this registry."}, status=status.HTTP_403_FORBIDDEN)

        try:
            serializer = serializers.InitiateWithdrawalSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            amount = serializer.validated_data['amount']

            # Re-calculate the true withdrawable amount for validation
            now = timezone.now()
            available_contributions = models.Contribution.objects.filter(
                service__registry=registry, status='succeeded', available_on__lte=now
            ).aggregate(total_amount=Sum('amount'), total_fee=Sum('fee'))
            
            net_available = (available_contributions['total_amount'] or Decimal('0.00')) - (available_contributions['total_fee'] or Decimal('0.00'))
            total_withdrawn = registry.withdrawals.filter(status__in=['pending', 'succeeded']).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
            
            available_balance = net_available - total_withdrawn
            
            if amount > available_balance:
                return Response({"detail": f"Withdrawal amount exceeds available balance of ${available_balance:.2f}."}, status=status.HTTP_400_BAD_REQUEST)

            # Generate OTP and device identity token
            otp = OTPRequest.generate_otp()
            device_hashed_token, device_plain_token = OTPRequest.generate_device_token()
            
            # Store the OTP request
            ref_id = f"withdrawal:{registry.id}:{user.id}"
            OTPRequest.objects.create(
                ref=ref_id, otp=otp, device_identity=device_hashed_token
            )

           # Send the email with the OTP
            EmailDispatcher.send_withdrawal_verification_otp(
                otp=otp, email=user.email, amount=amount, registry_name=registry.name
            )

            return Response({'detail': 'Verification code sent.', 'device_identity': device_plain_token}, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error during withdrawal initiation for registry {registry.id}: {e}", exc_info=True)
            # Return a generic error response that will be processed by CORS middleware
            return Response({'detail': 'An unexpected error occurred. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'])
    @transaction.atomic
    def withdraw(self, request, pk=None):
        """
        Allows a registry owner to withdraw available funds to their Stripe account
        after verifying with an OTP.
        """
        registry = self.get_object()
        user = request.user

        if registry.created_by != user:
            return Response({"detail": "You do not have permission to withdraw from this registry."}, status=status.HTTP_403_FORBIDDEN)

        if not user.stripe_account_id:
            return Response({"detail": "No Stripe account is connected. Please set up payouts first."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = serializers.FinalizeWithdrawalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        amount_to_withdraw = serializer.validated_data['amount']
        otp = serializer.validated_data['otp']
        device_identity = serializer.validated_data['device_identity']

        # Verify OTP
        ref_id = f"withdrawal:{registry.id}:{user.id}"
        otp_entry = OTPRequest.objects.filter(ref=ref_id, otp=otp).order_by('-created_at').first()
        if not otp_entry or not otp_entry.is_valid(device_identity):
            return Response({'detail': 'Invalid or expired verification code.'}, status=status.HTTP_400_BAD_REQUEST)

        # Final, definitive balance check before initiating transfer
        now = timezone.now()
        available_contributions = models.Contribution.objects.filter(
            service__registry=registry, status='succeeded', available_on__lte=now
        ).aggregate(total_amount=Sum('amount'), total_fee=Sum('fee'))
        
        net_available = (available_contributions['total_amount'] or Decimal('0.00')) - (available_contributions['total_fee'] or Decimal('0.00'))
        total_withdrawn = registry.withdrawals.filter(status__in=['pending', 'succeeded']).aggregate(total=Sum('amount'))['total'] or Decimal('0.00')
        
        available_balance = net_available - total_withdrawn

        if amount_to_withdraw > available_balance:
            return Response({"detail": f"Withdrawal amount of ${amount_to_withdraw:.2f} exceeds available balance of ${available_balance:.2f}."}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the connected Stripe account is ready for transfers
        try:
            account = stripe.Account.retrieve(user.stripe_account_id)
            if not account.details_submitted or account.capabilities.get('transfers') != 'active':
                return Response({"detail": "Your payout account is not yet ready to receive funds. Please complete your Stripe onboarding or check your account status."}, status=status.HTTP_400_BAD_REQUEST)
        except stripe.error.StripeError as e:
            logger.error(f"Error retrieving Stripe account {user.stripe_account_id}: {e}")
            return Response({"detail": "Could not verify your payout account status. Please try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            # Create a Stripe Transfer to the connected account
            transfer = stripe.Transfer.create(
                amount=int(amount_to_withdraw * 100),  # Amount in cents
                currency="usd",
                destination=user.stripe_account_id,
                description=f"Withdrawal for PamperMomma registry: {registry.name}"
            )

            # Record the withdrawal in our database with a pending status
            withdrawal = models.Withdrawal.objects.create(
                registry=registry,
                amount=amount_to_withdraw,
                status='pending',
                stripe_transfer_id=transfer.id
            )
            return Response({"status": "success", "message": "Withdrawal initiated successfully. It may take a few business days to appear in your account.", "transfer_id": transfer.id}, status=status.HTTP_200_OK)
        except stripe.error.StripeError as e:
            return Response({"detail": f"An error occurred with our payment processor: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

    def create(self, request, *args, **kwargs):
        """
        Override create to support creating multiple services at once.
        """
        is_many = isinstance(request.data, list)
        if not is_many:
            # If not a list, fall back to default single-object creation
            return super().create(request, *args, **kwargs)

        # Get registry from query parameters
        registry_id = request.query_params.get('registry')
        if not registry_id:
            return Response({"detail": "Registry ID is required as a query parameter."}, status=status.HTTP_400_BAD_REQUEST)

        # Verify that the registry exists and belongs to the user
        try:
            registry = models.Registry.objects.get(id=registry_id, created_by=request.user)
        except models.Registry.DoesNotExist:
            return Response({"detail": "Registry not found or you do not have permission."}, status=status.HTTP_404_NOT_FOUND)

        # Use the serializer with many=True
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)

        # Add the registry to each service and perform a bulk create
        services_to_create = [models.Service(registry=registry, **item) for item in serializer.validated_data]
        created_services = models.Service.objects.bulk_create(services_to_create)

        # Re-serialize the created instances to include read-only fields and method fields
        output_serializer = self.get_serializer(instance=created_services, many=True)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        """
        Custom destroy method to ensure only the owner of a registry can delete
        a service, and only if it has no contributions.
        """
        service = self.get_object()

        # Check if the user is the owner of the registry
        if service.registry.created_by != request.user:
            return Response({"detail": "You do not have permission to delete this service."}, status=status.HTTP_403_FORBIDDEN)

        # Check if the service has any contributions
        if service.contributions.exists():
            return Response({"detail": "Cannot delete a service that has contributions."}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_destroy(service)
        return Response(status=status.HTTP_204_NO_CONTENT)

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
    A read-only viewset for listing default services.
    This is used to provide suggestions during the registry creation process.
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
