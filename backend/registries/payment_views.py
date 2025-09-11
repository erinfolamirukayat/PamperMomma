from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from decimal import Decimal
from django.db import transaction
from django.conf import settings
from .models import Service, Contribution
from .serializers import CreatePaymentIntentSerializer
import stripe
import logging


logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='create-payment-intent')
    def create_payment_intent(self, request):
        """
        Creates a Stripe PaymentIntent for a given service and amount.
        """
        serializer = CreatePaymentIntentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        try:
            service = Service.objects.get(id=validated_data['service_id'])
            if not service.is_available():
                return Response({'error': 'This service is no longer available for contributions.'}, status=status.HTTP_400_BAD_REQUEST)

            # Server-side validation to prevent over-funding
            amount_to_contribute = validated_data['amount']
            amount_remaining = service.total_cost() - service.total_contributions()

            if amount_to_contribute > amount_remaining:
                return Response({
                    'error': f'Contribution amount of ${amount_to_contribute:.2f} exceeds the remaining amount of ${amount_remaining:.2f}.'
                }, status=status.HTTP_400_BAD_REQUEST)

            amount_in_cents = int(amount_to_contribute * 100)

            payment_intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency='usd',
                metadata={
                    'service_id': str(service.id),
                    'registry_id': str(service.registry.id),
                }
            )
            return Response({'clientSecret': payment_intent.client_secret})
        except Service.DoesNotExist:
            return Response({'error': 'Service not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the full exception for debugging, but return a generic error to the user.
            logger.error(f"Error creating payment intent for service {validated_data.get('service_id')}: {e}", exc_info=True)
            return Response({'error': 'An unexpected error occurred while creating the payment.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['post'], url_path='stripe-webhook')
    def stripe_webhook(self, request):
        """
        Handles incoming webhooks from Stripe to confirm payments.
        """
        payload = request.body
        sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
        endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        except (ValueError, stripe.error.SignatureVerificationError) as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            service_id = payment_intent['metadata']['service_id']
            amount_received = Decimal(payment_intent['amount_received']) / Decimal('100.0')
            
            # Safely extract contributor details from the charge for record-keeping
            contributor_name = ''
            contributor_email = ''
            charges_data = payment_intent.get('charges', {}).get('data')
            if charges_data and len(charges_data) > 0:
                billing_details = charges_data[0].get('billing_details', {})
                contributor_name = billing_details.get('name', '') if billing_details else ''
                contributor_email = billing_details.get('email', '') if billing_details else ''

            try:
                with transaction.atomic():
                    service = Service.objects.get(id=service_id)
                    contribution, created = Contribution.objects.update_or_create(
                        stripe_payment_intent_id=payment_intent['id'],
                        defaults={
                            'service': service,
                            'amount': amount_received,
                            'contributor_name': contributor_name,
                            'contributor_email': contributor_email,
                            'status': 'succeeded',
                        }
                    )

                    # If this is a new contribution, notify the registry owner.
                    if created:
                        from notifications.models import Notification
                        message = f"{contributor_name or 'An anonymous contributor'} just contributed ${amount_received:.2f} to your '{service.name}' service!"
                        Notification.objects.create(
                            user=service.registry.created_by,
                            message=message,
                            notification_type='contribution'
                        )
            except Service.DoesNotExist:
                # Log this error, as it indicates a problem
                logger.error(f"Stripe Webhook: Service with ID {service_id} not found for payment_intent {payment_intent['id']}.")
                return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                # Catch any other database or logic errors
                logger.error(f"Stripe Webhook: Error processing successful payment_intent {payment_intent['id']}: {e}", exc_info=True)
                # Return a 500 to tell Stripe to retry the webhook
                return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(status=status.HTTP_200_OK)