"""Create a Django superuser non-interactively using environment variables.

Set the following environment variables before running:
- SUPERUSER_MATRICULE (required)
- SUPERUSER_PASSWORD (required)
- SUPERUSER_FIRST_NAME (optional)
- SUPERUSER_LAST_NAME (optional)

Example (PowerShell):
  $env:SUPERUSER_MATRICULE = '25GO2279'
  $env:SUPERUSER_PASSWORD = '@kadda17'
  $env:SUPERUSER_FIRST_NAME = 'KEDI'
  $env:SUPERUSER_LAST_NAME = 'Daniel'
  python scripts\create_superuser.py

Security: do not commit real passwords into the repository. Use temporary credentials and rotate after use.
"""
import os
import sys

# Ensure project root is on PATH (run from pvcloud/)
PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_DIR not in sys.path:
    sys.path.insert(0, PROJECT_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'pvcloud.settings')

try:
    import django
    django.setup()
except Exception as e:
    print('Error setting up Django:', e)
    sys.exit(2)

from django.db import IntegrityError

try:
    from core.models import User
except Exception as e:
    print('Cannot import User model from core.models:', e)
    sys.exit(3)

MAT = os.environ.get('SUPERUSER_MATRICULE')
PW = os.environ.get('SUPERUSER_PASSWORD')
FIRST = os.environ.get('SUPERUSER_FIRST_NAME', 'KEDI')
LAST = os.environ.get('SUPERUSER_LAST_NAME', 'Daniel')

if not MAT or not PW:
    print('Environment variables SUPERUSER_MATRICULE and SUPERUSER_PASSWORD are required')
    sys.exit(1)

# Check if user exists
if User.objects.filter(matricule=MAT).exists():
    print(f"User with matricule '{MAT}' already exists. Skipping creation.")
    sys.exit(0)

# Create user
try:
    user = User(matricule=MAT, username=MAT, first_name=FIRST, last_name=LAST,
                role='super_admin', is_staff=True, is_superuser=True)
    user.set_password(PW)
    user.save()
    print(f"Superuser created: matricule={MAT}")
    sys.exit(0)
except IntegrityError as ie:
    print('Integrity error while creating user:', ie)
    sys.exit(4)
except Exception as e:
    print('Unexpected error while creating user:', e)
    sys.exit(5)
