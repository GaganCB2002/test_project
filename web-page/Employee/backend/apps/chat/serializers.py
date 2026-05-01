from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import ChatRoom, ChatMessage

User = get_user_model()


class UserBriefSerializer(serializers.ModelSerializer):
    """Brief serializer for User."""

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'avatar']


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for ChatMessage model."""

    sender = UserBriefSerializer(read_only=True)

    class Meta:
        model = ChatMessage
        fields = ['id', 'room', 'sender', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']


class ChatRoomSerializer(serializers.ModelSerializer):
    """Serializer for ChatRoom model."""

    participants = UserBriefSerializer(many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = [
            'id', 'name', 'type', 'participants', 'related_task',
            'last_message', 'unread_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_last_message(self, obj):
        last_msg = obj.messages.last()
        if last_msg:
            return ChatMessageSerializer(last_msg).data
        return None

    def get_unread_count(self, obj):
        user = self.context.get('request').user
        if user:
            return obj.messages.filter(
                sender__neq=user
            ).exclude(
                chatmessage_read__user=user
            ).count()
        return 0


class ChatRoomCreateSerializer(serializers.ModelSerializer):
    """Serializer for ChatRoom creation."""

    participant_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True
    )

    class Meta:
        model = ChatRoom
        fields = ['name', 'type', 'participant_ids', 'related_task']

    def create(self, validated_data):
        participant_ids = validated_data.pop('participant_ids')
        participants = User.objects.filter(id__in=participant_ids)
        validated_data['created_by'] = self.context['request'].user

        chat_room = ChatRoom.objects.create(**validated_data)
        chat_room.participants.set(participants)
        chat_room.participants.add(self.context['request'].user)
        chat_room.save()

        return chat_room


class SendMessageSerializer(serializers.Serializer):
    """Serializer for sending a message."""

    content = serializers.CharField(required=True)
