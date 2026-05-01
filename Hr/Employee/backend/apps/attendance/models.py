import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Attendance(models.Model):
    """Attendance model for tracking employee attendance."""

    class Status(models.TextChoices):
        PRESENT = 'PRESENT', 'Present'
        ABSENT = 'ABSENT', 'Absent'
        LEAVE = 'LEAVE', 'Leave'
        HALF_DAY = 'HALF_DAY', 'Half Day'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='attendances'
    )
    date = models.DateField()
    login_time = models.TimeField(null=True, blank=True)
    logout_time = models.TimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PRESENT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendances'
        ordering = ['-date']
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendances'
        unique_together = ['user', 'date']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.date} ({self.status})"


class LeaveRequest(models.Model):
    """LeaveRequest model for employee leave requests."""

    class LeaveType(models.TextChoices):
        SICK = 'SICK', 'Sick Leave'
        CASUAL = 'CASUAL', 'Casual Leave'
        ANNUAL = 'ANNUAL', 'Annual Leave'
        UNPAID = 'UNPAID', 'Unpaid Leave'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='leave_requests'
    )
    leave_type = models.CharField(
        max_length=20,
        choices=LeaveType.choices
    )
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )
    reviewed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviewed_leaves'
    )
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leave_requests'
        ordering = ['-created_at']
        verbose_name = 'Leave Request'
        verbose_name_plural = 'Leave Requests'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.leave_type} ({self.status})"

    @property
    def duration_days(self):
        return (self.end_date - self.start_date).days + 1
