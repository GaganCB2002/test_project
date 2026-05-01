from django.urls import path
from .views import HealthCheckView, BridgeStatsView

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('tasks/count/', BridgeStatsView.as_view(), name='bridge-stats'),
]
