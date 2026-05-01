from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import ChatRoom, ChatMessage
from .serializers import (
    ChatRoomSerializer,
    ChatRoomCreateSerializer,
    ChatMessageSerializer,
    SendMessageSerializer
)

User = get_user_model()


class ChatRoomListView(generics.ListAPIView):
    """View for listing chat rooms."""

    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ChatRoom.objects.filter(
            participants=self.request.user
        ).order_by('-updated_at')


class ChatRoomCreateView(generics.CreateAPIView):
    """View for creating chat rooms."""

    serializer_class = ChatRoomCreateSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        chat_room = serializer.save()

        return Response({
            'message': 'Chat room created successfully.',
            'chat_room': ChatRoomSerializer(
                chat_room,
                context={'request': request}
            ).data
        }, status=status.HTTP_201_CREATED)


class ChatRoomDetailView(generics.RetrieveAPIView):
    """View for getting chat room details."""

    queryset = ChatRoom.objects.all()
    serializer_class = ChatRoomSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        return ChatRoom.objects.filter(
            participants=self.request.user
        )


class MessageListView(generics.ListAPIView):
    """View for listing messages in a chat room."""

    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        room_id = self.kwargs['room_id']
        return ChatMessage.objects.filter(
            room_id=room_id,
            room__participants=self.request.user
        ).order_by('created_at')


class SendMessageView(APIView):
    """View for sending a message."""

    permission_classes = [IsAuthenticated]

    def post(self, request, room_id):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            chat_room = ChatRoom.objects.get(
                id=room_id,
                participants=request.user
            )
        except ChatRoom.DoesNotExist:
            return Response(
                {'error': 'Chat room not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        message = ChatMessage.objects.create(
            room=chat_room,
            sender=request.user,
            content=serializer.validated_data['content']
        )

        chat_room.updated_at = timezone.now()
        chat_room.save()

        return Response({
            'message': 'Message sent successfully.',
            'chat_message': ChatMessageSerializer(message).data
        }, status=status.HTTP_201_CREATED)
