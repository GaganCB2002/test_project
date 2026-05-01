from django.urls import path
from .consumers import TaskUpdateConsumer

websocket_urlpatterns = [
    path('ws/tasks/', TaskUpdateConsumer.as_asgi()),
]
