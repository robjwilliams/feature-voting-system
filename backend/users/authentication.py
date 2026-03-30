from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()


class FakeHeaderAuthentication(BaseAuthentication):
    """
    Development-only authentication.

    Reads the X-User-ID header, then looks up or creates a User with that
    value as the username. No passwords. Not for production use.

    To swap in real auth later: replace this class in settings.py
    DEFAULT_AUTHENTICATION_CLASSES with a JWT or session backend.
    """

    def authenticate(self, request):
        user_id = request.META.get('HTTP_X_USER_ID', '').strip()[:36]
        if not user_id:
            raise AuthenticationFailed('X-User-ID header is required.')

        user, _ = User.objects.get_or_create(
            username=user_id,
            defaults={'email': f'{user_id}@fake.local'},
        )
        return (user, None)
