from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import File

User = get_user_model()


class FileSerializer(serializers.ModelSerializer):
    """Serializer for File model."""

    uploaded_by_name = serializers.CharField(
        source='uploaded_by.get_full_name',
        read_only=True
    )
    task_title = serializers.CharField(
        source='related_task.title',
        read_only=True
    )
    size_formatted = serializers.SerializerMethodField()

    class Meta:
        model = File
        fields = [
            'id', 'file', 'filename', 'file_type', 'size',
            'size_formatted', 'uploaded_by', 'uploaded_by_name',
            'related_task', 'task_title', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_size_formatted(self, obj):
        size = obj.size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f} {unit}"
            size /= 1024.0
        return f"{size:.1f} TB"


class FileUploadSerializer(serializers.ModelSerializer):
    """Serializer for file upload."""

    class Meta:
        model = File
        fields = ['file', 'related_task']

    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)
