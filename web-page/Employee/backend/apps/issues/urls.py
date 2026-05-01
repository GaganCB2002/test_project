from django.urls import path
from .views import (
    IssueListView,
    IssueCreateView,
    IssueDetailView,
    IssueUpdateView
)

urlpatterns = [
    path('', IssueListView.as_view(), name='issue-list'),
    path('create/', IssueCreateView.as_view(), name='issue-create'),
    path('<uuid:id>/', IssueDetailView.as_view(), name='issue-detail'),
    path('<uuid:id>/update/', IssueUpdateView.as_view(), name='issue-update'),
]
