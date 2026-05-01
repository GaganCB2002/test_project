from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.contrib.auth import get_user_model

from apps.performance.models import ProgressLog
from core.permissions import IsManagerialUser
from .models import Task, Comment
from .serializers import (
    TaskSerializer,
    TaskCreateSerializer,
    TaskUpdateSerializer,
    TaskDetailSerializer,
    CommentSerializer,
    TaskProgressUpdateSerializer,
    ProjectSerializer,
)
from .models import Project

User = get_user_model()


class TaskListCreateView(generics.ListCreateAPIView):
    """View for listing and creating tasks."""

    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TaskCreateSerializer
        return TaskSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsManagerialUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.select_related(
            'assigned_to',
            'created_by',
            'project',
        ).prefetch_related('comments', 'files')

        status_filter = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')
        assigned_to = self.request.query_params.get('assigned_to')
        created_by = self.request.query_params.get('created_by')
        search = self.request.query_params.get('search')
        project = self.request.query_params.get('project')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if priority:
            queryset = queryset.filter(priority=priority)
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)
        if created_by:
            queryset = queryset.filter(created_by_id=created_by)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        if project:
            queryset = queryset.filter(project_id=project)

        if user.role == 'EMPLOYEE':
            queryset = queryset.filter(
                Q(assigned_to=user) | Q(created_by=user)
            )

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """View for task detail operations."""

    queryset = Task.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return TaskUpdateSerializer
        return TaskDetailSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Task.objects.select_related(
            'assigned_to',
            'created_by',
            'project',
        ).prefetch_related('comments__author', 'files')

        if user.role == 'EMPLOYEE':
            queryset = queryset.filter(
                Q(assigned_to=user) | Q(created_by=user)
            )

        return queryset

    def perform_update(self, serializer):
        if self.request.user.role == 'EMPLOYEE':
            instance = self.get_object()
            disallowed_fields = {'assigned_to', 'project', 'priority', 'deadline'}
            if disallowed_fields.intersection(set(serializer.validated_data.keys())):
                raise PermissionDenied('Employees can update only their task progress, notes, and status.')
            if instance.assigned_to_id != self.request.user.id:
                raise PermissionDenied('You do not have permission to edit this task.')
        serializer.save()


class TaskProgressUpdateView(APIView):
    """View for updating task progress."""

    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, id):
        try:
            task = Task.objects.get(id=id)
        except Task.DoesNotExist:
            return Response(
                {'error': 'Task not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if task.assigned_to != request.user and request.user.role not in ['ADMIN', 'MANAGER']:
            return Response(
                {'error': 'You do not have permission to update this task.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = TaskProgressUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        task.progress_percentage = serializer.validated_data['progress_percentage']

        if task.progress_percentage == 100:
            task.status = 'COMPLETED'
        elif task.progress_percentage > 0 and task.status == 'PENDING':
            task.status = 'IN_PROGRESS'

        task.save()

        ProgressLog.objects.create(
            task=task,
            user=request.user,
            percentage=task.progress_percentage,
            notes=serializer.validated_data.get('notes', '')
        )

        return Response({
            'message': 'Progress updated successfully.',
            'task': TaskSerializer(task).data
        })


class TaskCommentView(generics.CreateAPIView):
    """View for adding comments to tasks."""

    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Comment.objects.filter(task_id=self.kwargs['id'])

    def perform_create(self, serializer):
        task = generics.get_object_or_404(Task, id=self.kwargs['id'])
        serializer.save(author=self.request.user, task=task)


class MyTasksView(generics.ListAPIView):
    """View for listing tasks assigned to current user."""

    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        status_filter = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')

        queryset = Task.objects.filter(assigned_to=user).select_related(
            'assigned_to',
            'created_by',
            'project',
        ).prefetch_related('comments', 'files')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if priority:
            queryset = queryset.filter(priority=priority)

        return queryset.order_by('-created_at')


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsManagerialUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = Project.objects.all()
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if self.request.user.role == 'EMPLOYEE':
            queryset = queryset.filter(tasks__assigned_to=self.request.user).distinct()
        return queryset.order_by('name')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        queryset = Project.objects.select_related('owner').prefetch_related('tasks')
        if self.request.user.role == 'EMPLOYEE':
            queryset = queryset.filter(tasks__assigned_to=self.request.user).distinct()
        return queryset
