import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class IssueReport(models.Model):
    """IssueReport model for tracking task issues."""

    class Category(models.TextChoices):
        HR = 'HR', 'HR'
        TECHNICAL = 'TECHNICAL', 'Technical'
        PAYROLL = 'PAYROLL', 'Payroll'
        LEAVE = 'LEAVE', 'Leave'
        GENERAL = 'GENERAL', 'General'

    class Severity(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        CRITICAL = 'CRITICAL', 'Critical'

    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        RESOLVED = 'RESOLVED', 'Resolved'
        CLOSED = 'CLOSED', 'Closed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.GENERAL
    )
    task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.CASCADE,
        related_name='issues',
        null=True,
        blank=True
    )
    reporter = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='reported_issues'
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    severity = models.CharField(
        max_length=20,
        choices=Severity.choices,
        default=Severity.MEDIUM
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN
    )
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'issue_reports'
        ordering = ['-created_at']
        verbose_name = 'Issue Report'
        verbose_name_plural = 'Issue Reports'

    def __str__(self):
        return f"{self.category} - {self.title} ({self.severity})"
