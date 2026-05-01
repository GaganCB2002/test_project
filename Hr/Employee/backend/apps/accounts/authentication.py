from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework import exceptions
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomJWTAuthentication(JWTAuthentication):
    """Custom JWT Authentication that works with UUID primary keys."""

    def get_user(self, validated_token):
        """Get user by user_id from validated token."""
        try:
            user_id = validated_token['user_id']
        except KeyError:
            raise exceptions.AuthenticationFailed(
                'Token contained no recognizable user identification'
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed(
                'User not found.'
            )

        if not user.is_active:
            raise exceptions.AuthenticationFailed(
                'User is inactive.'
            )

        return user
