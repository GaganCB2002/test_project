from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Notification
from .serializers import NotificationSerializer


class NotificationListView(generics.ListAPIView):
    """View for listing notifications."""

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Notification.objects.filter(
            recipient=self.request.user
        )

        is_read = self.request.query_params.get('is_read')
        notification_type = self.request.query_params.get('type')

        if is_read is not None:
            queryset = queryset.filter(is_read=is_read.lower() == 'true')
        if notification_type:
            queryset = queryset.filter(type=notification_type)

        return queryset.order_by('-created_at')


class MarkAsReadView(APIView):
    """View for marking a notification as read."""

    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        try:
            notification = Notification.objects.get(
                id=id,
                recipient=request.user
            )
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save()

            return Response({
                'message': 'Notification marked as read.',
                'notification': NotificationSerializer(notification).data
            })
        except Notification.DoesNotExist:
            return Response(
                {'error': 'Notification not found.'},
                status=status.HTTP_404_NOT_FOUND
            )


class MarkAllReadView(APIView):
    """View for marking all notifications as read."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated_count = Notification.objects.filter(
            recipient=request.user,
            is_read=False
        ).update(
            is_read=True,
            read_at=timezone.now()
        )

        return Response({
            'message': f'{updated_count} notifications marked as read.',
            'updated_count': updated_count
        })
