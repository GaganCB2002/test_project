import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.accounts.models import User

# List of employees to sync from HR to Django
employees = [
    {
        'email': 'emp@company.com',
        'password': 'emp123',
        'first_name': 'Demo',
        'last_name': 'Employee',
        'role': 'EMPLOYEE',
        'department': 'Engineering',
        'designation': 'Software Engineer'
    },
    {
        'email': 'lead@company.com',
        'password': 'lead123',
        'first_name': 'Demo',
        'last_name': 'Lead',
        'role': 'TECH_LEAD',
        'department': 'Engineering',
        'designation': 'Tech Lead'
    },
    {
        'email': 'marketing@aurahr.com',
        'password': 'marketing123',
        'first_name': 'Marketing',
        'last_name': 'Lead',
        'role': 'MARKETING',
        'department': 'Marketing',
        'designation': 'Marketing Lead'
    }
]

for emp in employees:
    user, created = User.objects.get_or_create(
        email=emp['email'],
        defaults={
            'first_name': emp['first_name'],
            'last_name': emp['last_name'],
            'role': emp['role'],
            'department': emp['department'],
            'designation': emp['designation']
        }
    )
    user.set_password(emp['password'])
    user.save()
    if created:
        print(f"Created and synced user: {emp['email']}")
    else:
        print(f"Updated and synced user: {emp['email']}")
