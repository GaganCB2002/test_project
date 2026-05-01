"""
URL configuration for Employee Dashboard project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from core.views import HealthCheckView, BridgeStatsView

urlpatterns = [
    path('api/health/', HealthCheckView.as_view(), name='health-check'),
    path('api/tasks/count/', BridgeStatsView.as_view(), name='bridge-stats'),
    path('admin/', admin.site.urls),
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/tasks/', include('apps.tasks.urls')),
    path('api/timesheet/', include('apps.timesheet.urls')),
    path('api/attendance/', include('apps.attendance.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/chat/', include('apps.chat.urls')),
    path('api/files/', include('apps.files.urls')),
    path('api/issues/', include('apps.issues.urls')),
    path('api/submissions/', include('apps.submissions.urls')),
    path('api/performance/', include('apps.performance.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
