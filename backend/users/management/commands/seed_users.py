import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the default user for local development.'

    def handle(self, *args, **options):
        username = os.environ.get('DEFAULT_USER', 'admin')
        password = os.environ.get('DEFAULT_PASSWORD', 'admin')

        if User.objects.filter(username=username).exists():
            self.stdout.write(f'User already exists: {username}')
            return

        User.objects.create_user(username=username, password=password)
        self.stdout.write(self.style.SUCCESS(f'Created user: {username} / {password}'))
