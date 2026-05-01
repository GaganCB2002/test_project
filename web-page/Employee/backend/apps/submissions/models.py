import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class WorkSubmission(models.Model):
    """WorkSubmission model for task work submissions."""

    class Status(models.TextChoices):
        PENDING_REVIEW = 'PENDING_REVIEW', 'Pending Review'
        CHANGES_REQUESTED = 'CHANGES_REQUESTED', 'Changes Requested'
        APPROVED = 'APPROVED', 'Approved'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    submitted_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='submissions'
    )
    notes = models.TextField(blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING_REVIEW
    )
    review_notes = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_submissions'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'work_submissions'
        ordering = ['-created_at']
        verbose_name = 'Work Submission'
        verbose_name_plural = 'Work Submissions'

    def __str__(self):
        return f"{self.task.title} - {self.status}"
