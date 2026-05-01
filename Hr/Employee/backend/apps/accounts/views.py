from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging

logger = logging.getLogger('django')

from apps.attendance.models import Attendance
from apps.timesheet.models import WorkSession, BreakSession
from core.permissions import IsHRAdmin
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    ProfileSerializer,
    ChangePasswordSerializer,
    UserSerializer,
    UserCreateSerializer,
    UserUpdateSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """View for user registration."""

    queryset = User.objects.all()
    permission_classes = [IsHRAdmin]
    serializer_class = UserCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response({
            'message': 'Employee account created successfully.',
            'user': UserSerializer(user).data,
        }, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    """View for user login."""

    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request):
        try:
            serializer = LoginSerializer(
                data=request.data,
                context={'request': request}
            )
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
        except Exception as e:
            logger.error(f"Login failure for {request.data.get('email')}: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()
        today = timezone.localdate()

        refresh = RefreshToken.for_user(user)

        attendance, _ = Attendance.objects.get_or_create(
            user=user,
            date=today,
            defaults={
                'login_time': now.time(),
                'status': 'PRESENT',
            }
        )
        if attendance.login_time is None:
            attendance.login_time = now.time()
            attendance.status = 'PRESENT'
            attendance.save(update_fields=['login_time', 'status', 'updated_at'])

        WorkSession.objects.get_or_create(
            user=user,
            date=today,
            defaults={'clock_in': now}
        )

        return Response({
            'message': 'Login successful.',
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    """View for user logout."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            now = timezone.now()
            today = timezone.localdate()
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            attendance = Attendance.objects.filter(
                user=request.user,
                date=today
            ).first()
            if attendance:
                attendance.logout_time = now.time()
                attendance.save(update_fields=['logout_time', 'updated_at'])

            session = WorkSession.objects.filter(
                user=request.user,
                date=today,
                clock_out__isnull=True
            ).prefetch_related('breaks').first()
            if session:
                active_break = session.breaks.filter(ended_at__isnull=True).first()
                if active_break:
                    active_break.ended_at = now
                    active_break.save()
                session.clock_out = now
                session.save(update_fields=['clock_out', 'updated_at'])
                session.recalculate()

            return Response({
                'message': 'Logout successful.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    """View for user profile retrieval and update."""

    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'message': 'Profile updated successfully.',
            'user': serializer.data
        })


class ChangePasswordView(APIView):
    """View for password change."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()

        return Response({
            'message': 'Password changed successfully.'
        }, status=status.HTTP_200_OK)


class UserMeView(generics.RetrieveAPIView):
    """View to get current user info."""

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListView(generics.ListAPIView):
    """View to list all users (for admin/HR)."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsHRAdmin]

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get('role')
        department = self.request.query_params.get('department')

        if role:
            queryset = queryset.filter(role=role)
        if department:
            queryset = queryset.filter(department=department)

        return queryset


class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsHRAdmin]
    lookup_field = 'id'


class UserStatusToggleView(APIView):
    permission_classes = [IsHRAdmin]

    def patch(self, request, id):
        user = generics.get_object_or_404(User, id=id)
        user.is_active = request.data.get('is_active', not user.is_active)
        user.save(update_fields=['is_active', 'updated_at'])
        return Response({
            'message': 'User status updated successfully.',
            'user': UserSerializer(user).data
        })
