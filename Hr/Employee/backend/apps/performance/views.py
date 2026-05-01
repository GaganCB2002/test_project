from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg, Sum, F
from django.utils import timezone
from django.contrib.auth import get_user_model

from apps.tasks.models import Task
from apps.timesheet.models import WorkSession
from apps.attendance.models import Attendance
from .models import ProgressLog
from .serializers import ProgressLogSerializer, PerformanceDashboardSerializer

User = get_user_model()


class PerformanceDashboardView(APIView):
    """View for performance dashboard."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()

        tasks = Task.objects.filter(assigned_to=user)
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='COMPLETED').count()
        in_progress_tasks = tasks.filter(status='IN_PROGRESS').count()
        pending_tasks = tasks.filter(status='PENDING').count()
        overdue_tasks = tasks.filter(
            deadline__lt=now,
            status__in=['PENDING', 'IN_PROGRESS']
        ).count()

        completion_rate = (
            (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        )

        average_progress = tasks.aggregate(
            avg=Avg('progress_percentage')
        )['avg'] or 0

        month_start = timezone.localdate().replace(day=1)
        work_sessions = WorkSession.objects.filter(
            user=user,
            date__gte=month_start,
            date__lte=timezone.localdate()
        )
        attendance_percentage = 0
        attendance_records = Attendance.objects.filter(
            user=user,
            date__gte=month_start,
            date__lte=timezone.localdate()
        )
        total_attendance_days = attendance_records.count()
        if total_attendance_days:
            attendance_percentage = round(
                (
                    attendance_records.filter(status='PRESENT').count()
                    + (attendance_records.filter(status='HALF_DAY').count() * 0.5)
                ) / total_attendance_days * 100,
                2
            )
        on_time_delivery = round(
            (
                tasks.filter(
                    status='COMPLETED',
                    deadline__isnull=False,
                    updated_at__lte=F('deadline')
                ).count() / completed_tasks * 100
            ),
            2
        ) if completed_tasks else 0

        recent_logs = ProgressLog.objects.filter(
            user=user
        ).select_related('task').order_by('-created_at')[:10]

        task_breakdown = {
            'by_status': {
                'pending': pending_tasks,
                'in_progress': in_progress_tasks,
                'review': tasks.filter(status='REVIEW').count(),
                'completed': completed_tasks
            },
            'by_priority': {
                'low': tasks.filter(priority='LOW').count(),
                'medium': tasks.filter(priority='MEDIUM').count(),
                'high': tasks.filter(priority='HIGH').count(),
                'critical': tasks.filter(priority='CRITICAL').count()
            }
        }

        data = {
            'total_tasks': total_tasks,
            'completed_tasks': completed_tasks,
            'total_hours': round((work_sessions.aggregate(total=Sum('worked_minutes'))['total'] or 0) / 60, 2),
            'productivity_score': round(average_progress, 2),
            'attendance_percentage': attendance_percentage,
            'on_time_delivery': on_time_delivery,
            'in_progress_tasks': in_progress_tasks,
            'pending_tasks': pending_tasks,
            'overdue_tasks': overdue_tasks,
            'completion_rate': round(completion_rate, 2),
            'average_progress': round(average_progress, 2),
            'recent_progress_logs': ProgressLogSerializer(
                recent_logs, many=True
            ).data,
            'task_breakdown': task_breakdown
        }

        serializer = PerformanceDashboardSerializer(data)
        return Response(serializer.data)


class ProgressLogListView(generics.ListAPIView):
    """View for listing progress logs."""

    serializer_class = ProgressLogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        task_id = self.request.query_params.get('task')
        user_id = self.request.query_params.get('user')

        queryset = ProgressLog.objects.filter(user=self.request.user)

        if task_id:
            queryset = queryset.filter(task_id=task_id)
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        return queryset.select_related('task').order_by('-created_at')


class ProgressLogCreateView(generics.CreateAPIView):
    """View for creating progress logs."""

    serializer_class = ProgressLogSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        log = serializer.save()

        task = log.task
        task.progress_percentage = log.percentage
        if log.percentage == 100:
            task.status = 'COMPLETED'
        elif log.percentage > 0 and task.status == 'PENDING':
            task.status = 'IN_PROGRESS'
        task.save()

        return Response({
            'message': 'Progress log created successfully.',
            'log': ProgressLogSerializer(log).data
        }, status=status.HTTP_201_CREATED)
