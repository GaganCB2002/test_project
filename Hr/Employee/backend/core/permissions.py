from rest_framework.permissions import BasePermission


class IsHRAdmin(BasePermission):
    """Allow access only to HR and admin users."""

    message = 'Only HR or admin users can perform this action.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_superuser or user.role in ['ADMIN', 'HR'])
        )


class IsManagerialUser(BasePermission):
    """Allow access to HR, admin, and manager roles."""

    message = 'Only managerial users can perform this action.'

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (user.is_superuser or user.role in ['ADMIN', 'HR', 'MANAGER'])
        )
