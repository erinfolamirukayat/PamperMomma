"""
Production settings for PamperMomma.

This file should be used when deploying the application to a live environment.
It inherits from dev.py and overrides settings for security, database, and static/media files.
"""

from .dev import *  # Inherit from base settings
import os
import dj_database_url

# SECURITY WARNING: keep the secret key used in production secret!
# The SECRET_KEY is loaded from an environment variable in dev.py

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# Host configuration
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME')
FRONTEND_URL = os.environ.get('FRONTEND_URL')

ALLOWED_HOSTS = []
if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)

# CORS and CSRF settings for production
# This reads the comma-separated string from your Render environment variable
# (e.g., "http://localhost:3000,https://pampermomma.netlify.app")
# and turns it into a list that Django expects.
CORS_ALLOWED_ORIGINS_str = os.environ.get('CORS_ALLOWED_ORIGINS', '')
CORS_ALLOWED_ORIGINS = CORS_ALLOWED_ORIGINS_str.split(',') if CORS_ALLOWED_ORIGINS_str else []

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True  # Allow cookies to be sent with cross-origin requests

# As of Django 4.0, CSRF_TRUSTED_ORIGINS must include the scheme (e.g., 'https://').
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

# Database configuration using Supabase URI.
# This completely overrides the DATABASES dictionary from dev.py.
DATABASES = {
    'default': dj_database_url.config(
        conn_max_age=600,
        ssl_require=True  # Supabase requires SSL connections
    )
}

# Static files (served by WhiteNoise)
STATIC_ROOT = BASE_DIR / "staticfiles"

# File storage configuration using the modern STORAGES setting
STORAGES = {
    "default": {
        "BACKEND": "storages.backends.s3boto3.S3Boto3Storage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME')
AWS_S3_ENDPOINT_URL = os.environ.get('AWS_S3_ENDPOINT_URL')
AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=86400',
    'ACL': 'public-read',
}
AWS_LOCATION = 'media'  # A sub-folder in your bucket
AWS_DEFAULT_ACL = 'public-read'

MEDIA_URL = f'{AWS_S3_ENDPOINT_URL}/{AWS_STORAGE_BUCKET_NAME}/{AWS_LOCATION}/'

# Production security settings
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Logging configuration for production
LOGGING['handlers']['console']['formatter'] = 'simple'
LOGGING['loggers']['django']['level'] = 'INFO'

# Production frontend URLs for emails.
# These override the development defaults and are required for production.
if not FRONTEND_URL:
    raise ImproperlyConfigured("The FRONTEND_URL environment variable must be set in production.")
FRONTEND_PASSWORD_RESET_URL = f"{FRONTEND_URL}/reset-password"
FRONTEND_VERIFY_EMAIL_URL = f"{FRONTEND_URL}/verify-email"

# Channels settings for production
# This overrides the Docker-specific setting from dev.py and uses the
# REDIS_URL provided by cloud environments like Render.
REDIS_URL = os.environ.get('REDIS_URL')
if REDIS_URL:
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [REDIS_URL],
            },
        },
    }

# Firebase settings for production
# This overrides the file-based approach from dev.py.
# The service account key is loaded from a multi-line environment variable.
import json
import firebase_admin
from firebase_admin import credentials

FIREBASE_SERVICE_ACCOUNT_KEY_JSON = os.environ.get('FIREBASE_SERVICE_ACCOUNT_KEY_JSON')

# Initialize Firebase only if the key is present and it hasn't been initialized already
if FIREBASE_SERVICE_ACCOUNT_KEY_JSON and not firebase_admin._apps:
    try:
        cred_json = json.loads(FIREBASE_SERVICE_ACCOUNT_KEY_JSON)
        cred = credentials.Certificate(cred_json)
        firebase_admin.initialize_app(cred)
    except (json.JSONDecodeError, ValueError) as e:
        # In a real production scenario, you would want to log this error.
        print(f"Error initializing Firebase: {e}")

# Stripe settings
STRIPE_SECRET_KEY = os.environ.get('STRIPE_SECRET_KEY')
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET')