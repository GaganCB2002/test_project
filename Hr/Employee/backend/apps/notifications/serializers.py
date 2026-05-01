from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model."""

    recipient_name = serializers.CharField(
        source='recipient.get_full_name',
        read_only=True
    )
    sender_name = serializers.CharField(
        source='sender.get_full_name',
        read_only=True
    )
    task_title = serializers.CharField(
        source='related_task.title',
        read_only=True
    )

    class Meta:
        model = Notification
        fields = [
            'id', 'recipient', 'recipient_name', 'sender', 'sender_name',
            'type', 'title', 'message', 'is_read', 'related_task',
            'task_title', 'read_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at'
        ]
