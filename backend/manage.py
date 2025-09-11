#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys
from dotenv import load_dotenv

load_dotenv()


def main():
    """Run administrative tasks."""
    # Automatically detect the environment. Use 'prod' on Render, otherwise 'dev'.
    # Render injects a 'RENDER' environment variable into the build and runtime environments.
    settings_module = 'main.settings.prod' if 'RENDER' in os.environ else 'main.settings.dev'
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', settings_module)
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
