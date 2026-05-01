from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ProgressLog

User = get_user_model()


class ProgressLogSerializer(serializers.ModelSerializer):
    """Serializer for ProgressLog model."""

    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    task_title = serializers.CharField(
        source='task.title',
        read_only=True
    )

    class Meta:
        model = ProgressLog
        fields = [
            'id', 'task', 'task_title', 'user', 'user_name',
            'percentage', 'notes', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class PerformanceDashboardSerializer(serializers.Serializer):
    """Serializer for performance dashboard."""

    total_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    total_hours = serializers.FloatField()
    productivity_score = serializers.FloatField()
    attendance_percentage = serializers.FloatField()
    on_time_delivery = serializers.FloatField()
    in_progress_tasks = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    overdue_tasks = serializers.IntegerField()
    completion_rate = serializers.FloatField()
    average_progress = serializers.FloatField()
    recent_progress_logs = serializers.ListField()
    task_breakdown = serializers.DictField()
