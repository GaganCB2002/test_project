from django.urls import path
from .views import (
    FileListView,
    FileUploadView,
    FileDownloadView,
    FileDeleteView
)

urlpatterns = [
    path('', FileListView.as_view(), name='file-list'),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('<uuid:id>/download/', FileDownloadView.as_view(), name='file-download'),
    path('<uuid:id>/delete/', FileDeleteView.as_view(), name='file-delete'),
]
