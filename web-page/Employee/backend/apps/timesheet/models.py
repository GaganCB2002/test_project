import uuid
from datetime import timedelta
from django.db import models
from django.contrib.auth import get_user_model
from apps.tasks.models import Task

User = get_user_model()


class WorkSession(models.Model):
    """Primary daily work session automatically tracked from auth events."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='work_sessions'
    )
    date = models.DateField()
    clock_in = models.DateTimeField()
    clock_out = models.DateTimeField(null=True, blank=True)
    total_break_minutes = models.IntegerField(default=0)
    worked_minutes = models.IntegerField(default=0)
    overtime_minutes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'work_sessions'
        ordering = ['-date', '-clock_in']
        verbose_name = 'Work Session'
        verbose_name_plural = 'Work Sessions'
        unique_together = ['user', 'date']

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.date}"

    def recalculate(self, save=True):
        break_minutes = sum(
            session.duration_minutes for session in self.breaks.all()
        )
        self.total_break_minutes = break_minutes
        if self.clock_in and self.clock_out:
            gross_minutes = max(
                0,
                int((self.clock_out - self.clock_in).total_seconds() / 60)
            )
            self.worked_minutes = max(0, gross_minutes - break_minutes)
            self.overtime_minutes = max(0, self.worked_minutes - (8 * 60))
        else:
            self.worked_minutes = 0
            self.overtime_minutes = 0
        if save:
            self.save(update_fields=[
                'total_break_minutes',
                'worked_minutes',
                'overtime_minutes',
                'updated_at',
            ])


class BreakSession(models.Model):
    """Break periods within a work session."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    work_session = models.ForeignKey(
        WorkSession,
        on_delete=models.CASCADE,
        related_name='breaks'
    )
    started_at = models.DateTimeField()
    ended_at = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'break_sessions'
        ordering = ['-started_at']
        verbose_name = 'Break Session'
        verbose_name_plural = 'Break Sessions'

    def __str__(self):
        return f"Break for {self.work_session.user.get_full_name()} on {self.work_session.date}"

    def save(self, *args, **kwargs):
        if self.started_at and self.ended_at:
            delta = self.ended_at - self.started_at
            self.duration_minutes = max(0, int(delta.total_seconds() / 60))
        super().save(*args, **kwargs)


class TimeSheet(models.Model):
    """TimeSheet model for tracking work hours."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='timesheets'
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='timesheets'
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration_minutes = models.IntegerField(default=0)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'timesheets'
        ordering = ['-date', '-start_time']
        verbose_name = 'TimeSheet'
        verbose_name_plural = 'TimeSheets'

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.date} ({self.duration_minutes} min)"

    def save(self, *args, **kwargs):
        if self.start_time and self.end_time:
            from datetime import datetime, time
            start_dt = datetime.combine(self.date, self.start_time)
            end_dt = datetime.combine(self.date, self.end_time)
            if end_dt < start_dt:
                end_dt = datetime.combine(self.date, time(23, 59, 59))
            delta = end_dt - start_dt
            self.duration_minutes = int(delta.total_seconds() / 60)
        super().save(*args, **kwargs)
