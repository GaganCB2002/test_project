from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Sum
from .models import TimeSheet, WorkSession, BreakSession

User = get_user_model()


class TimeSheetSerializer(serializers.ModelSerializer):
    """Serializer for TimeSheet model."""

    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    task_title = serializers.CharField(source='task.title', read_only=True)

    class Meta:
        model = TimeSheet
        fields = [
            'id', 'user', 'user_name', 'task', 'task_title',
            'date', 'start_time', 'end_time', 'duration_minutes',
            'description', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'duration_minutes', 'created_at', 'updated_at']


class BreakSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BreakSession
        fields = [
            'id', 'started_at', 'ended_at', 'duration_minutes',
            'created_at', 'updated_at'
        ]
        read_only_fields = fields


class WorkSessionSerializer(serializers.ModelSerializer):
    breaks = BreakSessionSerializer(many=True, read_only=True)

    class Meta:
        model = WorkSession
        fields = [
            'id', 'date', 'clock_in', 'clock_out', 'total_break_minutes',
            'worked_minutes', 'overtime_minutes', 'breaks',
            'created_at', 'updated_at'
        ]
        read_only_fields = fields


class TimeSheetCreateSerializer(serializers.ModelSerializer):
    """Serializer for TimeSheet creation."""

    class Meta:
        model = TimeSheet
        fields = ['task', 'date', 'start_time', 'end_time', 'description']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class TimeSheetUpdateSerializer(serializers.ModelSerializer):
    """Serializer for TimeSheet update."""

    class Meta:
        model = TimeSheet
        fields = ['task', 'date', 'start_time', 'end_time', 'description']


class WeeklySummarySerializer(serializers.Serializer):
    """Serializer for weekly timesheet summary."""

    user = serializers.CharField()
    week_start = serializers.DateField()
    week_end = serializers.DateField()
    total_minutes = serializers.IntegerField()
    total_hours = serializers.FloatField()
    days_logged = serializers.IntegerField()
    daily_breakdown = serializers.ListField()


class TimeTrackingSummarySerializer(serializers.Serializer):
    period = serializers.CharField()
    from_date = serializers.DateField()
    to_date = serializers.DateField()
    total_worked_minutes = serializers.IntegerField()
    total_break_minutes = serializers.IntegerField()
    overtime_minutes = serializers.IntegerField()
    attendance_summary = serializers.DictField()
    sessions = WorkSessionSerializer(many=True)
