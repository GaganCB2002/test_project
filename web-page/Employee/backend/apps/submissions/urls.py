from django.urls import path
from .views import (
    SubmissionListView,
    SubmissionCreateView,
    SubmissionDetailView
)

urlpatterns = [
    path('', SubmissionListView.as_view(), name='submission-list'),
    path('create/', SubmissionCreateView.as_view(), name='submission-create'),
    path('<uuid:id>/', SubmissionDetailView.as_view(), name='submission-detail'),
]
