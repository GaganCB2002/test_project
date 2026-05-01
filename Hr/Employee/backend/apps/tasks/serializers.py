from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Task, Comment, Project

User = get_user_model()


class UserBriefSerializer(serializers.ModelSerializer):
    """Brief serializer for User (used in task assignments)."""

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role',
            'department', 'designation', 'avatar'
        ]


class CommentSerializer(serializers.ModelSerializer):
    """Serializer for Comment model."""

    author = UserBriefSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'task', 'author', 'content', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TaskSerializer(serializers.ModelSerializer):
    """Serializer for Task model."""

    assigned_to = UserBriefSerializer(read_only=True)
    created_by = UserBriefSerializer(read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_code = serializers.CharField(source='project.code', read_only=True)
    comments_count = serializers.SerializerMethodField()
    attachments_count = serializers.SerializerMethodField()
    deadline_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'assigned_to', 'created_by',
            'project', 'project_name', 'project_code', 'status', 'priority',
            'progress_percentage', 'estimated_hours', 'deadline',
            'comments_count', 'attachments_count', 'deadline_formatted',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_comments_count(self, obj):
        return obj.comments.count()

    def get_attachments_count(self, obj):
        return obj.files.count()

    def get_deadline_formatted(self, obj):
        if obj.deadline:
            return obj.deadline.strftime('%Y-%m-%d %H:%M')
        return None


class TaskCreateSerializer(serializers.ModelSerializer):
    """Serializer for Task creation."""

    class Meta:
        model = Task
        fields = [
            'title', 'description', 'assigned_to', 'priority', 'deadline'
            , 'project', 'estimated_hours'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskUpdateSerializer(serializers.ModelSerializer):
    """Serializer for Task update."""

    class Meta:
        model = Task
        fields = [
            'title', 'description', 'assigned_to', 'project', 'status',
            'priority', 'progress_percentage', 'estimated_hours', 'deadline'
        ]

    def update(self, instance, validated_data):
        assigned_to = validated_data.pop('assigned_to', None)
        if assigned_to is not None:
            instance.assigned_to = assigned_to

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class TaskDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Task with comments."""

    assigned_to = UserBriefSerializer(read_only=True)
    created_by = UserBriefSerializer(read_only=True)
    project_name = serializers.CharField(source='project.name', read_only=True)
    project_code = serializers.CharField(source='project.code', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    attachments = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'assigned_to', 'created_by',
            'project', 'project_name', 'project_code', 'status', 'priority',
            'progress_percentage', 'estimated_hours', 'deadline',
            'comments', 'attachments', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_attachments(self, obj):
        return [
            {
                'id': str(file_obj.id),
                'file': file_obj.file.url if file_obj.file else None,
                'filename': file_obj.filename,
                'file_type': file_obj.file_type,
                'size': file_obj.size,
                'related_task': str(obj.id),
                'created_at': file_obj.created_at,
            }
            for file_obj in obj.files.all().order_by('-created_at')
        ]


class TaskProgressUpdateSerializer(serializers.Serializer):
    """Serializer for updating task progress."""

    progress_percentage = serializers.IntegerField(min_value=0, max_value=100)
    notes = serializers.CharField(required=False, allow_blank=True)


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserBriefSerializer(read_only=True)
    total_tasks = serializers.SerializerMethodField()
    completed_tasks = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'name', 'code', 'description', 'owner', 'status',
            'start_date', 'end_date', 'total_tasks', 'completed_tasks',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_tasks(self, obj):
        return obj.tasks.count()

    def get_completed_tasks(self, obj):
        return obj.tasks.filter(status='COMPLETED').count()
