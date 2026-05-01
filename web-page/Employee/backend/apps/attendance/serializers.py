from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
from .models import Attendance, LeaveRequest

User = get_user_model()


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance model."""

    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'user', 'user_name', 'date', 'login_time',
            'logout_time', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class LoginSerializer(serializers.Serializer):
    """Serializer for attendance login."""

    date = serializers.DateField(required=False)
    login_time = serializers.TimeField(required=False)


class LogoutSerializer(serializers.Serializer):
    """Serializer for attendance logout."""

    logout_time = serializers.TimeField(required=False)


class LeaveRequestSerializer(serializers.ModelSerializer):
    """Serializer for LeaveRequest model."""

    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    reviewed_by_name = serializers.CharField(source='reviewed_by.get_full_name', read_only=True)
    duration_days = serializers.IntegerField(read_only=True)

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'user', 'user_name', 'leave_type', 'start_date',
            'end_date', 'reason', 'status', 'reviewed_by',
            'reviewed_by_name', 'reviewed_at', 'duration_days',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'status', 'reviewed_by', 'reviewed_at',
            'created_at', 'updated_at'
        ]


class LeaveRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for LeaveRequest creation."""

    class Meta:
        model = LeaveRequest
        fields = ['leave_type', 'start_date', 'end_date', 'reason']

    def validate(self, attrs):
        if attrs['end_date'] < attrs['start_date']:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date.'
            })
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class LeaveBalanceSerializer(serializers.Serializer):
    """Serializer for leave balance summary."""

    sick_leave_used = serializers.IntegerField()
    sick_leave_remaining = serializers.IntegerField()
    casual_leave_used = serializers.IntegerField()
    casual_leave_remaining = serializers.IntegerField()
    annual_leave_used = serializers.IntegerField()
    annual_leave_remaining = serializers.IntegerField()
    unpaid_leave_used = serializers.IntegerField()
