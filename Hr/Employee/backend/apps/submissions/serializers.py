from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone
from .models import WorkSubmission

User = get_user_model()


class WorkSubmissionSerializer(serializers.ModelSerializer):
    """Serializer for WorkSubmission model."""

    submitted_by_name = serializers.CharField(
        source='submitted_by.get_full_name',
        read_only=True
    )
    reviewed_by_name = serializers.CharField(
        source='reviewed_by.get_full_name',
        read_only=True
    )
    task_title = serializers.CharField(
        source='task.title',
        read_only=True
    )

    class Meta:
        model = WorkSubmission
        fields = [
            'id', 'task', 'task_title', 'submitted_by', 'submitted_by_name',
            'notes', 'status', 'review_notes', 'reviewed_by',
            'reviewed_by_name', 'reviewed_at', 'submitted_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'submitted_by', 'reviewed_by', 'reviewed_at',
            'submitted_at', 'created_at', 'updated_at'
        ]


class SubmissionCreateSerializer(serializers.ModelSerializer):
    """Serializer for WorkSubmission creation."""

    class Meta:
        model = WorkSubmission
        fields = ['task', 'notes']

    def create(self, validated_data):
        validated_data['submitted_by'] = self.context['request'].user
        return super().create(validated_data)


class SubmissionUpdateSerializer(serializers.ModelSerializer):
    """Serializer for WorkSubmission update (review)."""

    class Meta:
        model = WorkSubmission
        fields = ['status', 'review_notes']

    def update(self, instance, validated_data):
        status_value = validated_data.get('status')
        if status_value and instance.status != status_value:
            instance.reviewed_by = self.context['request'].user
            instance.reviewed_at = timezone.now()

        return super().update(instance, validated_data)
