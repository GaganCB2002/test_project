import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ChatRoom(models.Model):
    """ChatRoom model for chat rooms."""

    class Type(models.TextChoices):
        DIRECT = 'DIRECT', 'Direct'
        GROUP = 'GROUP', 'Group'
        TASK = 'TASK', 'Task'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True)
    type = models.CharField(
        max_length=20,
        choices=Type.choices,
        default=Type.DIRECT
    )
    participants = models.ManyToManyField(
        User,
        related_name='chat_rooms'
    )
    related_task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chat_rooms'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat_rooms'
        ordering = ['-updated_at']
        verbose_name = 'Chat Room'
        verbose_name_plural = 'Chat Rooms'

    def __str__(self):
        return f"{self.name or 'Chat'} ({self.type})"

    def save(self, *args, **kwargs):
        if self.type == 'DIRECT' and not self.name:
            participant_names = [
                p.get_full_name() for p in self.participants.all()[:2]
            ]
            self.name = ' & '.join(participant_names)
        super().save(*args, **kwargs)


class ChatMessage(models.Model):
    """ChatMessage model for chat messages."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    room = models.ForeignKey(
        ChatRoom,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='sent_messages'
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']
        verbose_name = 'Chat Message'
        verbose_name_plural = 'Chat Messages'

    def __str__(self):
        return f"{self.sender.get_full_name()}: {self.content[:50]}"
