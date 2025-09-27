from django.core.mail import get_connection, send_mail
from django.conf import settings
from babel.dates import format_timedelta
from datetime import timedelta
from decimal import Decimal
from django.template.loader import render_to_string
import logging

logger = logging.getLogger(__name__)


class EmailDispatcher:
    @staticmethod
    def send_email(subject, template_name, context, recipient_list):
        """
        A generic helper to send an email using an HTML template. This method
        explicitly manages the SMTP connection to prevent `SMTPServerDisconnected`
        errors that can occur from stale, reused connections.
        """
        html_message = render_to_string(template_name, context)
        # Use the connection as a context manager to ensure it's properly opened and closed.
        with get_connection() as connection:
            send_mail(
                subject=subject,
                message='',  # Plain text version, can be empty if html is provided
                html_message=html_message,
                recipient_list=recipient_list,
                from_email=None,
                fail_silently=False,
                connection=connection,
            )

    @staticmethod
    def reset_password_otp(otp: str, email: str, web_data_url: str | None = None) -> None:
        exp_time = getattr(settings, 'OTP_EXPIRATION_TIME', 600)
        # Convert expiration time (seconds) to timedelta
        exp_time_delta = timedelta(seconds=exp_time)
        # Format the duration into human-readable text
        exp_time_text = format_timedelta(exp_time_delta, locale='en_US')
        html_message = f'<p>Your OTP is <strong>{otp}</strong>. It expires in <strong>{exp_time_text}</strong>.</p>'
        if web_data_url:
            html_message += f'<p>Click <a href="{web_data_url}">here</a> to reset your password.</p>'
        EmailDispatcher.send_email(
            subject='Reset Password',
            template_name='emails/simple_message.html',  # A generic template can be used
            context={'message': html_message},
            recipient_list=[email]
        )

    @staticmethod
    def send_withdrawal_verification_otp(otp: str, email: str, amount: Decimal, registry_name: str):
        """
        Sends an email with a one-time password (OTP) for withdrawal verification.
        """
        subject = "Your PamperMomma Withdrawal Verification Code"
        context = {
            'otp': otp,
            'amount': f"{amount:.2f}",
            'registry_name': registry_name,
        }
        logger.info("Got to send_withdrawal_verification_otp")
        EmailDispatcher.send_email(
            subject=subject,
            template_name='emails/withdrawal_verification.html',
            context=context,
            recipient_list=[email]
        )

    @staticmethod
    def verify_email_otp(otp: str, email: str, web_data_url: str | None = None) -> None:
        exp_time = getattr(settings, 'OTP_EXPIRATION_TIME', 600)
        # Convert expiration time (seconds) to timedelta
        exp_time_delta = timedelta(seconds=exp_time)
        # Format the duration into human-readable text
        exp_time_text = format_timedelta(exp_time_delta, locale='en_US')
        html_message = f'<p>Your OTP is <strong>{otp}</strong>. It expires in <strong>{exp_time_text}</strong>.</p>'
        if web_data_url:
            html_message += f'<p>Click <a href="{web_data_url}">here</a> to verify your email.</p>'
        EmailDispatcher.send_email(
            subject='Email Verification',
            template_name='emails/simple_message.html', # A generic template can be used
            context={'message': html_message},
            recipient_list=[email]
        )