from django.urls import path
from .views import (
    PerformanceDashboardView,
    ProgressLogListView,
    ProgressLogCreateView
)

urlpatterns = [
    path('dashboard/', PerformanceDashboardView.as_view(), name='performance-dashboard'),
    path('logs/', ProgressLogListView.as_view(), name='progress-logs'),
    path('logs/create/', ProgressLogCreateView.as_view(), name='progress-log-create'),
]
