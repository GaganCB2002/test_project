from django.urls import path
from .views import (
    ChatRoomListView,
    ChatRoomCreateView,
    ChatRoomDetailView,
    MessageListView,
    SendMessageView
)

urlpatterns = [
    path('', ChatRoomListView.as_view(), name='chat-room-list'),
    path('create/', ChatRoomCreateView.as_view(), name='chat-room-create'),
    path('<uuid:id>/', ChatRoomDetailView.as_view(), name='chat-room-detail'),
    path('<uuid:room_id>/messages/', MessageListView.as_view(), name='message-list'),
    path('<uuid:room_id>/send/', SendMessageView.as_view(), name='send-message'),
]
