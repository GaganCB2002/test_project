from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse, Http404
from django.contrib.auth import get_user_model

from .models import File
from .serializers import FileSerializer, FileUploadSerializer

User = get_user_model()


class FileListView(generics.ListAPIView):
    """View for listing files."""

    serializer_class = FileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = File.objects.filter(uploaded_by=self.request.user)

        file_type = self.request.query_params.get('file_type')
        task_id = self.request.query_params.get('task')

        if file_type:
            queryset = queryset.filter(file_type=file_type)
        if task_id:
            queryset = queryset.filter(related_task_id=task_id)

        return queryset.order_by('-created_at')


class FileUploadView(generics.CreateAPIView):
    """View for uploading files."""

    serializer_class = FileUploadSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file_obj = serializer.save()

        return Response({
            'message': 'File uploaded successfully.',
            'file': FileSerializer(file_obj).data
        }, status=status.HTTP_201_CREATED)


class FileDownloadView(APIView):
    """View for downloading files."""

    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            file_obj = File.objects.get(id=id)
        except File.DoesNotExist:
            return Response(
                {'error': 'File not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if file_obj.uploaded_by != request.user:
            return Response(
                {'error': 'You do not have permission to download this file.'},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            return FileResponse(
                file_obj.file,
                as_attachment=True,
                filename=file_obj.filename
            )
        except FileNotFoundError:
            return Response(
                {'error': 'File not found on server.'},
                status=status.HTTP_404_NOT_FOUND
            )


class FileDeleteView(generics.DestroyAPIView):
    """View for deleting files."""

    queryset = File.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return File.objects.filter(uploaded_by=self.request.user)
