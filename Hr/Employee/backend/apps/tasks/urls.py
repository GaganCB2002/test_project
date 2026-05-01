from django.urls import path
from .views import (
    TaskListCreateView,
    TaskDetailView,
    TaskProgressUpdateView,
    TaskCommentView,
    MyTasksView,
    ProjectListCreateView,
    ProjectDetailView,
)

urlpatterns = [
    path('', TaskListCreateView.as_view(), name='task-list-create'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<uuid:id>/', ProjectDetailView.as_view(), name='project-detail'),
    path('<uuid:id>/', TaskDetailView.as_view(), name='task-detail'),
    path('<uuid:id>/progress/', TaskProgressUpdateView.as_view(), name='task-progress'),
    path('<uuid:id>/comments/', TaskCommentView.as_view(), name='task-comments'),
    path('my-tasks/', MyTasksView.as_view(), name='my-tasks'),
]
