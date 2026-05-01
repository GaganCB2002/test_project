from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import get_user_model

from apps.attendance.models import Attendance
from .models import TimeSheet
from .serializers import (
    TimeSheetSerializer,
    TimeSheetCreateSerializer,
    TimeSheetUpdateSerializer,
    WeeklySummarySerializer,
    WorkSessionSerializer,
    BreakSessionSerializer,
    TimeTrackingSummarySerializer
)
from .models import WorkSession, BreakSession

User = get_user_model()


class TimeSheetListView(generics.ListAPIView):
    """View for listing timesheets."""

    serializer_class = TimeSheetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = TimeSheet.objects.filter(user=user)

        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        task_id = self.request.query_params.get('task')

        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if task_id:
            queryset = queryset.filter(task_id=task_id)

        return queryset.order_by('-date', '-start_time')


class TimeSheetCreateView(generics.CreateAPIView):
    """View for creating timesheets."""

    serializer_class = TimeSheetCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        timesheet = serializer.save()

        return Response({
            'message': 'TimeSheet created successfully.',
            'timesheet': TimeSheetSerializer(timesheet).data
        }, status=status.HTTP_201_CREATED)


class TimeSheetUpdateView(generics.RetrieveUpdateDestroyAPIView):
    """View for updating timesheets."""

    serializer_class = TimeSheetUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return TimeSheet.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            'message': 'TimeSheet updated successfully.',
            'timesheet': TimeSheetSerializer(instance).data
        })


class WeeklySummaryView(APIView):
    """View for weekly timesheet summary."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        week_offset = int(request.query_params.get('week', 0))
        today = timezone.now().date()
        start_of_week = today - timedelta(days=today.weekday())
        start_of_week += timedelta(weeks=week_offset)
        end_of_week = start_of_week + timedelta(days=6)

        timesheets = WorkSession.objects.filter(
            user=request.user,
            date__gte=start_of_week,
            date__lte=end_of_week
        )

        total_minutes = timesheets.aggregate(
            total=Sum('worked_minutes')
        )['total'] or 0
        total_break_minutes = timesheets.aggregate(
            total=Sum('total_break_minutes')
        )['total'] or 0

        daily_breakdown = []
        current_date = start_of_week
        while current_date <= end_of_week:
            day_entries = timesheets.filter(date=current_date)
            day_total = day_entries.aggregate(
                total=Sum('worked_minutes')
            )['total'] or 0
            day_break_total = day_entries.aggregate(
                total=Sum('total_break_minutes')
            )['total'] or 0
            daily_breakdown.append({
                'date': current_date.isoformat(),
                'day_name': current_date.strftime('%A'),
                'minutes': day_total,
                'hours': round(day_total / 60, 2),
                'break_minutes': day_break_total,
            })
            current_date += timedelta(days=1)

        data = {
            'user': request.user.get_full_name(),
            'week_start': start_of_week,
            'week_end': end_of_week,
            'total_minutes': total_minutes,
            'total_hours': round(total_minutes / 60, 2),
            'total_break_minutes': total_break_minutes,
            'days_logged': timesheets.values('date').distinct().count(),
            'daily_breakdown': daily_breakdown
        }

        serializer = WeeklySummarySerializer(data)
        return Response(serializer.data)


class TodayTimeSheetView(APIView):
    """View for today's timesheet entries."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        manual_entries = TimeSheet.objects.filter(
            user=request.user,
            date=today
        )
        work_session = WorkSession.objects.filter(
            user=request.user,
            date=today
        ).first()

        serializer = TimeSheetSerializer(manual_entries, many=True)
        total_minutes = manual_entries.aggregate(
            total=Sum('duration_minutes')
        )['total'] or 0

        return Response({
            'date': today,
            'entries': serializer.data,
            'work_session': WorkSessionSerializer(work_session).data if work_session else None,
            'total_minutes': total_minutes,
            'total_hours': round(total_minutes / 60, 2)
        })


class CurrentWorkSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        session = WorkSession.objects.filter(
            user=request.user,
            date=timezone.localdate()
        ).prefetch_related('breaks').first()
        return Response({
            'session': WorkSessionSerializer(session).data if session else None
        })


class StartBreakView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session = WorkSession.objects.filter(
            user=request.user,
            date=timezone.localdate(),
            clock_out__isnull=True
        ).first()
        if not session:
            return Response(
                {'error': 'No active work session found.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if session.breaks.filter(ended_at__isnull=True).exists():
            return Response(
                {'error': 'A break is already active.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        break_session = BreakSession.objects.create(
            work_session=session,
            started_at=timezone.now()
        )
        return Response({
            'message': 'Break started successfully.',
            'break_session': BreakSessionSerializer(break_session).data,
            'session': WorkSessionSerializer(session).data,
        }, status=status.HTTP_201_CREATED)


class EndBreakView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        session = WorkSession.objects.filter(
            user=request.user,
            date=timezone.localdate(),
            clock_out__isnull=True
        ).prefetch_related('breaks').first()
        if not session:
            return Response(
                {'error': 'No active work session found.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        break_session = session.breaks.filter(ended_at__isnull=True).first()
        if not break_session:
            return Response(
                {'error': 'No active break found.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        break_session.ended_at = timezone.now()
        break_session.save()
        session.recalculate()

        return Response({
            'message': 'Break ended successfully.',
            'break_session': BreakSessionSerializer(break_session).data,
            'session': WorkSessionSerializer(session).data,
        })


class TimeTrackingSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        period = request.query_params.get('period', 'weekly')
        today = timezone.localdate()

        if period == 'daily':
            from_date = to_date = today
        elif period == 'monthly':
            from_date = today.replace(day=1)
            next_month = (from_date.replace(day=28) + timedelta(days=4)).replace(day=1)
            to_date = next_month - timedelta(days=1)
        else:
            from_date = today - timedelta(days=today.weekday())
            to_date = from_date + timedelta(days=6)
            period = 'weekly'

        sessions = WorkSession.objects.filter(
            user=request.user,
            date__gte=from_date,
            date__lte=to_date
        ).prefetch_related('breaks').order_by('-date')

        worked_minutes = sessions.aggregate(total=Sum('worked_minutes'))['total'] or 0
        break_minutes = sessions.aggregate(total=Sum('total_break_minutes'))['total'] or 0
        overtime_minutes = sessions.aggregate(total=Sum('overtime_minutes'))['total'] or 0

        attendance_records = Attendance.objects.filter(
            user=request.user,
            date__gte=from_date,
            date__lte=to_date
        )

        attendance_summary = {
            'present': attendance_records.filter(status='PRESENT').count(),
            'absent': attendance_records.filter(status='ABSENT').count(),
            'leave': attendance_records.filter(status='LEAVE').count(),
            'half_day': attendance_records.filter(status='HALF_DAY').count(),
        }

        payload = {
            'period': period,
            'from_date': from_date,
            'to_date': to_date,
            'total_worked_minutes': worked_minutes,
            'total_break_minutes': break_minutes,
            'overtime_minutes': overtime_minutes,
            'attendance_summary': attendance_summary,
            'sessions': WorkSessionSerializer(sessions, many=True).data,
        }
        serializer = TimeTrackingSummarySerializer(payload)
        return Response(serializer.data)
