from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes as drf_permission_classes
from rest_framework.permissions import AllowAny
from decimal import Decimal
from django.db import transaction
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from .models import Service, Contribution
from utilities.email import EmailDispatcher
from .serializers import CreatePaymentIntentSerializer
import stripe
import logging
import json
from datetime import datetime, timezone


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

            amount_to_contribute = validated_data['amount']
            amount_in_cents = int(amount_to_contribute * 100)

            metadata = {
                'service_id': str(service.id),
                'registry_id': str(service.registry.id),
                'amount': str(amount_to_contribute),
                'contributor_name': validated_data.get('contributor_name', ''),
                'contributor_email': validated_data.get('contributor_email', ''),
            }

            payment_intent = stripe.PaymentIntent.create(
                amount=amount_in_cents,
                currency='usd',
                metadata=metadata
            )
            return Response({'clientSecret': payment_intent.client_secret})
        except Service.DoesNotExist:
            return Response({'error': 'Service not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Log the full exception for debugging, but return a generic error to the user.
            logger.error(f"Error creating payment intent for service {validated_data.get('service_id')}: {e}", exc_info=True)
            return Response({'error': 'An unexpected error occurred while creating the payment.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@api_view(['POST'])
@drf_permission_classes([AllowAny])
def stripe_webhook(request):
    """
    Handles incoming webhooks from Stripe to confirm payments.
    This is a standalone view to easily apply @csrf_exempt.
    """
    print("\n--- [WEBHOOK] Received a request from Stripe CLI ---")
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
        print(f"[WEBHOOK] Event constructed successfully. Type: {event.type}")
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        print(f"!!! WEBHOOK SIGNATURE VERIFICATION FAILED: {e}")
        logger.error(f"Webhook signature verification failed: {e}", exc_info=True)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    if event.type == 'charge.succeeded':
        # We now handle everything in the retrieve method to avoid race conditions.
        # This handler can be used in the future for other charge-related events.
        pass

    if event.type == 'payment_intent.succeeded':
        print("\n--- [WEBHOOK] Handling 'payment_intent.succeeded' to create initial contribution record ---")
        payment_intent = event['data']['object']
        payment_intent_id = payment_intent.get('id')
        print(f"[WEBHOOK] PI ID: {payment_intent_id}")

        metadata = payment_intent.get('metadata', {})
        service_id = metadata.get('service_id')
        
        if not service_id:
            logger.warning(f"Webhook 'payment_intent.succeeded' for PI {payment_intent_id} is missing 'service_id' in metadata. Skipping.")
            return Response(status=status.HTTP_200_OK)

        try:
            with transaction.atomic():
                service = Service.objects.get(id=int(service_id))
                
                # Create the initial contribution record. Fee and available_on will be updated later.
                defaults_for_db = {
                    'service': service,
                    'amount': Decimal(payment_intent.get('amount_received', 0)) / Decimal('100.0'),
                    'contributor_name': metadata.get('contributor_name', ''),
                    'contributor_email': metadata.get('contributor_email', ''),
                    'status': 'succeeded',
                }

                contribution, created = Contribution.objects.update_or_create(
                    stripe_payment_intent_id=payment_intent_id,
                    defaults=defaults_for_db
                )
                print(f"[WEBHOOK] Initial contribution record {'created' if created else 'updated'}: ID {contribution.id}")

                if created:
                    from notifications.models import UserNotification
                    message = f"{defaults_for_db['contributor_name'] or 'An anonymous contributor'} just contributed ${defaults_for_db['amount']:.2f} to your '{service.name}' service!"
                    UserNotification.objects.create(
                        user=service.registry.created_by,
                        title="New Contribution Received!",
                        message=message,
                    )
                logger.info(f"Sending contribution notification email to {service.registry.created_by.email}")
                # Send contribution notification email
                try:
                    EmailDispatcher.send_contribution_notification_email(
                        registry_name=service.registry.name,
                        service_name=service.name,
                        contributor_name=metadata.get('contributor_name', 'An anonymous contributor'),
                        amount=Decimal(payment_intent.get('amount_received', 0)) / Decimal('100.0'),
                        user_email=service.registry.created_by.email,
                    )
                except Exception as e:
                    logger.error(f"Failed to send new service notification email for service {service.id}: {e}", exc_info=True)
        except Service.DoesNotExist:
            logger.error(f"Stripe Webhook: Service with ID {service_id} not found for PI {payment_intent_id}.")
            return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Stripe Webhook: Error processing payment_intent.succeeded for PI {payment_intent_id}: {e}", exc_info=True)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(status=status.HTTP_200_OK)