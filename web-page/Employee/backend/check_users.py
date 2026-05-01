import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User
users = User.objects.all()
print(f"Total Users: {users.count()}")
for u in users:
    print(f"- {u.email} ({u.role})")
