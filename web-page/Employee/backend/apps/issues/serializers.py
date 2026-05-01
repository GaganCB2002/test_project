from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import IssueReport

User = get_user_model()


class IssueReportSerializer(serializers.ModelSerializer):
    """Serializer for IssueReport model."""

    reporter = serializers.SerializerMethodField()
    assigned_to = serializers.SerializerMethodField()
    reporter_name = serializers.CharField(
        source='reporter.get_full_name',
        read_only=True
    )
    task_title = serializers.CharField(
        source='task.title',
        read_only=True
    )
    assigned_to_name = serializers.CharField(
        source='assigned_to.get_full_name',
        read_only=True
    )

    class Meta:
        model = IssueReport
        fields = [
            'id', 'category', 'task', 'task_title', 'reporter', 'reporter_name',
            'assigned_to', 'assigned_to_name', 'title', 'description', 'severity', 'status',
            'resolved_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'reporter', 'resolved_at',
            'created_at', 'updated_at'
        ]

    def _serialize_user(self, user):
        if not user:
            return None
        return {
            'id': str(user.id),
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'department': user.department,
            'designation': user.designation,
            'avatar': user.avatar.url if user.avatar else None,
        }

    def get_reporter(self, obj):
        return self._serialize_user(obj.reporter)

    def get_assigned_to(self, obj):
        return self._serialize_user(obj.assigned_to)


class IssueCreateSerializer(serializers.ModelSerializer):
    """Serializer for IssueReport creation."""

    class Meta:
        model = IssueReport
        fields = ['category', 'task', 'title', 'description', 'severity']

    def create(self, validated_data):
        validated_data['reporter'] = self.context['request'].user
        return super().create(validated_data)


class IssueUpdateSerializer(serializers.ModelSerializer):
    """Serializer for IssueReport update."""

    class Meta:
        model = IssueReport
        fields = ['category', 'assigned_to', 'title', 'description', 'severity', 'status']
