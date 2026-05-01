from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Q
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model

from .models import Attendance, LeaveRequest
from apps.timesheet.models import WorkSession, BreakSession
from .serializers import (
    AttendanceSerializer,
    LoginSerializer,
    LogoutSerializer,
    LeaveRequestSerializer,
    LeaveRequestCreateSerializer,
    LeaveBalanceSerializer
)

User = get_user_model()


class AttendanceListView(generics.ListAPIView):
    """View for listing attendances."""

    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Attendance.objects.filter(user=user)

        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        attendance_status = self.request.query_params.get('status')

        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if attendance_status:
            queryset = queryset.filter(status=attendance_status)

        return queryset.order_by('-date')


class LoginView(APIView):
    """View for attendance login."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        today = serializer.validated_data.get('date', timezone.now().date())
        now = timezone.now()
        login_time = serializer.validated_data.get('login_time', now.time())

        attendance, created = Attendance.objects.get_or_create(
            user=request.user,
            date=today,
            defaults={
                'login_time': login_time,
                'status': 'PRESENT'
            }
        )

        if not created:
            if attendance.login_time is None:
                attendance.login_time = login_time
                attendance.save()
            else:
                return Response({
                    'message': 'Already logged in today.',
                    'attendance': AttendanceSerializer(attendance).data
                }, status=status.HTTP_200_OK)

        session, session_created = WorkSession.objects.get_or_create(
            user=request.user,
            date=today,
            defaults={'clock_in': now}
        )
        if not session_created and session.clock_in is None:
            session.clock_in = now
            session.clock_out = None
            session.save(update_fields=['clock_in', 'clock_out', 'updated_at'])

        return Response({
            'message': 'Logged in successfully.',
            'attendance': AttendanceSerializer(attendance).data,
            'session_active': True,
        }, status=status.HTTP_201_CREATED)


class LogoutView(APIView):
    """View for attendance logout."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        today = timezone.now().date()
        now = timezone.now()
        logout_time = serializer.validated_data.get('logout_time', now.time())

        try:
            attendance = Attendance.objects.get(
                user=request.user,
                date=today
            )
            attendance.logout_time = logout_time
            attendance.save()
        except Attendance.DoesNotExist:
            return Response({
                'error': 'No login record found for today.'
            }, status=status.HTTP_404_NOT_FOUND)

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
            'message': 'Logged out successfully.',
            'attendance': AttendanceSerializer(attendance).data,
            'session_active': False,
        })


class TodayAttendanceView(APIView):
    """View for today's attendance."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()

        try:
            attendance = Attendance.objects.get(
                user=request.user,
                date=today
            )
            serializer = AttendanceSerializer(attendance)
            return Response(serializer.data)
        except Attendance.DoesNotExist:
            return Response({
                'message': 'No attendance record for today.',
                'status': 'NOT_MARKED'
            })


class AttendanceStatsView(APIView):
    """View for attendance statistics."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.localdate()
        month = int(request.query_params.get('month', now.month))
        year = int(request.query_params.get('year', now.year))
        month_start = now.replace(year=year, month=month, day=1)
        if month == 12:
            month_end = month_start.replace(year=year + 1, month=1, day=1) - timedelta(days=1)
        else:
            month_end = month_start.replace(month=month + 1, day=1) - timedelta(days=1)

        total_days = (month_end - month_start).days + 1
        present_days = Attendance.objects.filter(
            user=request.user,
            date__gte=month_start,
            date__lte=month_end,
            status='PRESENT'
        ).count()

        half_days = Attendance.objects.filter(
            user=request.user,
            date__gte=month_start,
            date__lte=month_end,
            status='HALF_DAY'
        ).count()

        absent_days = Attendance.objects.filter(
            user=request.user,
            date__gte=month_start,
            date__lte=month_end,
            status='ABSENT'
        ).count()

        on_leave_days = LeaveRequest.objects.filter(
            user=request.user,
            status='APPROVED',
            start_date__lte=month_end,
            end_date__gte=month_start
        ).count()

        pending_leaves = LeaveRequest.objects.filter(
            user=request.user,
            status='PENDING'
        ).count()

        return Response({
            'month': month_start.strftime('%B %Y'),
            'total_days': total_days,
            'present_days': present_days,
            'half_days': half_days,
            'absent_days': absent_days,
            'on_leave_days': on_leave_days,
            'pending_leaves': pending_leaves,
            'attendance_percentage': round(
                ((present_days + half_days * 0.5) / total_days) * 100, 2
            ) if total_days > 0 else 0
        })


class LeaveRequestListCreateView(generics.ListCreateAPIView):
    """View for listing and creating leave requests."""

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LeaveRequestCreateSerializer
        return LeaveRequestSerializer

    def get_queryset(self):
        queryset = LeaveRequest.objects.filter(user=self.request.user)

        status_filter = self.request.query_params.get('status')
        leave_type = self.request.query_params.get('leave_type')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if leave_type:
            queryset = queryset.filter(leave_type=leave_type)

        return queryset.order_by('-created_at')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        leave_request = serializer.save()

        return Response({
            'message': 'Leave request submitted successfully.',
            'leave_request': LeaveRequestSerializer(leave_request).data
        }, status=status.HTTP_201_CREATED)


class LeaveBalanceView(APIView):
    """View for leave balance."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

        sick_used = LeaveRequest.objects.filter(
            user=request.user,
            status='APPROVED',
            leave_type='SICK',
            start_date__gte=year_start
        ).aggregate(days=Count('id'))['days'] or 0

        casual_used = LeaveRequest.objects.filter(
            user=request.user,
            status='APPROVED',
            leave_type='CASUAL',
            start_date__gte=year_start
        ).aggregate(days=Count('id'))['days'] or 0

        annual_used = LeaveRequest.objects.filter(
            user=request.user,
            status='APPROVED',
            leave_type='ANNUAL',
            start_date__gte=year_start
        ).aggregate(days=Count('id'))['days'] or 0

        unpaid_used = LeaveRequest.objects.filter(
            user=request.user,
            status='APPROVED',
            leave_type='UNPAID',
            start_date__gte=year_start
        ).aggregate(days=Count('id'))['days'] or 0

        SICK_LEAVE_TOTAL = 10
        CASUAL_LEAVE_TOTAL = 10
        ANNUAL_LEAVE_TOTAL = 20

        return Response({
            'sick_leave_used': sick_used,
            'sick_leave_remaining': SICK_LEAVE_TOTAL - sick_used,
            'casual_leave_used': casual_used,
            'casual_leave_remaining': CASUAL_LEAVE_TOTAL - casual_used,
            'annual_leave_used': annual_used,
            'annual_leave_remaining': ANNUAL_LEAVE_TOTAL - annual_used,
            'unpaid_leave_used': unpaid_used
        })
