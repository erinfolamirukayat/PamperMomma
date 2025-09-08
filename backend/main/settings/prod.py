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
CORS_ALLOWED_ORIGINS = []
if FRONTEND_URL:
    CORS_ALLOWED_ORIGINS.append(FRONTEND_URL)

CORS_ALLOW_ALL_ORIGINS = False
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS

# Database configuration using Supabase URI
DATABASES['default'] = dj_database_url.config(
    conn_max_age=600,
    ssl_require=True  # Supabase requires SSL connections
)

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

# Update frontend URLs for emails to use the production frontend URL
if FRONTEND_URL:
    FRONTEND_PASSWORD_RESET_URL = os.getenv("FRONTEND_PASSWORD_RESET_URL", f"{FRONTEND_URL}/reset-password")
    FRONTEND_VERIFY_EMAIL_URL = os.getenv("FRONTEND_VERIFY_EMAIL_URL", f"{FRONTEND_URL}/verify-email")