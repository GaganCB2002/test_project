import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
try:
    u = User.objects.get(email='employee.test@xyz.com')
    u.set_password('Employee@123')
    u.save()
    print("Password for employee.test@xyz.com has been reset to Employee@123")
except User.DoesNotExist:
    print("User employee.test@xyz.com not found.")
except Exception as e:
    print(f"Error: {e}")
