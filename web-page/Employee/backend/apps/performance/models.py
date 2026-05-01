import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ProgressLog(models.Model):
    """ProgressLog model for tracking task progress."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.CASCADE,
        related_name='progress_logs'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='progress_logs'
    )
    percentage = models.IntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'progress_logs'
        ordering = ['-created_at']
        verbose_name = 'Progress Log'
        verbose_name_plural = 'Progress Logs'

    def __str__(self):
        return f"{self.task.title} - {self.percentage}% by {self.user.get_full_name()}"
