from django.urls import path
from .views import (
    NotificationListView,
    MarkAsReadView,
    MarkAllReadView
)

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<uuid:id>/read/', MarkAsReadView.as_view(), name='mark-as-read'),
    path('read-all/', MarkAllReadView.as_view(), name='mark-all-read'),
]
