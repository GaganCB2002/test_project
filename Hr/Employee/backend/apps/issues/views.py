from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.utils import timezone
from django.contrib.auth import get_user_model

from core.permissions import IsManagerialUser
from .models import IssueReport
from .serializers import (
    IssueReportSerializer,
    IssueCreateSerializer,
    IssueUpdateSerializer
)

User = get_user_model()


class IssueListView(generics.ListAPIView):
    """View for listing issue reports."""

    serializer_class = IssueReportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = IssueReport.objects.all()

        status_filter = self.request.query_params.get('status')
        severity = self.request.query_params.get('severity')
        category = self.request.query_params.get('category')
        task_id = self.request.query_params.get('task')
        reporter_id = self.request.query_params.get('reporter')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if severity:
            queryset = queryset.filter(severity=severity)
        if category:
            queryset = queryset.filter(category=category)
        if task_id:
            queryset = queryset.filter(task_id=task_id)
        if reporter_id:
            queryset = queryset.filter(reporter_id=reporter_id)

        if self.request.user.role == 'EMPLOYEE':
            queryset = queryset.filter(reporter=self.request.user)

        return queryset.order_by('-created_at')


class IssueCreateView(generics.CreateAPIView):
    """View for creating issue reports."""

    serializer_class = IssueCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        issue = serializer.save()

        return Response({
            'message': 'Issue report created successfully.',
            'issue': IssueReportSerializer(issue).data
        }, status=status.HTTP_201_CREATED)


class IssueDetailView(generics.RetrieveAPIView):
    """View for getting issue details."""

    serializer_class = IssueReportSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        queryset = IssueReport.objects.select_related(
            'reporter',
            'assigned_to',
            'task',
        )
        if self.request.user.role == 'EMPLOYEE':
            queryset = queryset.filter(reporter=self.request.user)
        return queryset


class IssueUpdateView(generics.UpdateAPIView):
    """View for updating issue reports."""

    serializer_class = IssueUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        queryset = IssueReport.objects.select_related(
            'reporter',
            'assigned_to',
            'task',
        )
        if self.request.user.role == 'EMPLOYEE':
            queryset = queryset.filter(reporter=self.request.user)
        return queryset

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        managerial = request.user.role in ['ADMIN', 'HR', 'MANAGER'] or request.user.is_superuser

        if not managerial:
            disallowed_fields = {'status', 'assigned_to'}
            if disallowed_fields.intersection(set(request.data.keys())):
                raise PermissionDenied('Only HR, admin, or managers can update ticket status and assignment.')

        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)

        if serializer.validated_data.get('status') == 'RESOLVED':
            instance.resolved_at = timezone.now()
        elif serializer.validated_data.get('status') == 'CLOSED':
            if not instance.resolved_at:
                instance.resolved_at = timezone.now()
        elif serializer.validated_data.get('status') not in [None, 'RESOLVED', 'CLOSED']:
            instance.resolved_at = None

        serializer.save(resolved_at=instance.resolved_at)

        return Response({
            'message': 'Issue updated successfully.',
            'issue': IssueReportSerializer(instance).data
        })
