from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


class HealthCheckView(APIView):
    """Health check endpoint."""

    permission_classes = []
    authentication_classes = []

    def get(self, request):
        return Response({'status': 'ok'})


class BridgeStatsView(APIView):
    """Bridge stats endpoint for Tech Lead."""

    permission_classes = []
    authentication_classes = []

    def get(self, request):
        # Using lazy imports to avoid circular issues
        from apps.tasks.models import Task
        from apps.issues.models import Issue
        return Response({
            'totalTasks': Task.objects.count(),
            'pendingIssues': Issue.objects.filter(status='PENDING').count()
        })
