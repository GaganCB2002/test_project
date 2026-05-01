from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import WorkSubmission
from .serializers import (
    WorkSubmissionSerializer,
    SubmissionCreateSerializer,
    SubmissionUpdateSerializer
)

User = get_user_model()


class SubmissionListView(generics.ListAPIView):
    """View for listing submissions."""

    serializer_class = WorkSubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = WorkSubmission.objects.all()

        status_filter = self.request.query_params.get('status')
        task_id = self.request.query_params.get('task')
        submitted_by_id = self.request.query_params.get('submitted_by')

        if status_filter:
            queryset = queryset.filter(status=status_filter)
        if task_id:
            queryset = queryset.filter(task_id=task_id)
        if submitted_by_id:
            queryset = queryset.filter(submitted_by_id=submitted_by_id)

        if self.request.user.role == 'EMPLOYEE':
            queryset = queryset.filter(submitted_by=self.request.user)

        return queryset.order_by('-created_at')


class SubmissionCreateView(generics.CreateAPIView):
    """View for creating submissions."""

    serializer_class = SubmissionCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()

        return Response({
            'message': 'Submission created successfully.',
            'submission': WorkSubmissionSerializer(submission).data
        }, status=status.HTTP_201_CREATED)


class SubmissionDetailView(generics.RetrieveUpdateAPIView):
    """View for submission details."""

    queryset = WorkSubmission.objects.all()
    serializer_class = WorkSubmissionSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return SubmissionUpdateSerializer
        return WorkSubmissionSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            data=request.data,
            partial=partial
        )
        serializer.is_valid(raise_exception=True)

        if request.data.get('status'):
            instance.reviewed_by = request.user
            instance.reviewed_at = timezone.now()

        serializer.save()

        return Response({
            'message': 'Submission updated successfully.',
            'submission': WorkSubmissionSerializer(instance).data
        })
