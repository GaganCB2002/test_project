import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class File(models.Model):
    """File model for file uploads."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.FileField(upload_to='uploads/%Y/%m/%d/')
    filename = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50, blank=True)
    size = models.BigIntegerField(default=0)
    uploaded_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='uploaded_files'
    )
    related_task = models.ForeignKey(
        'tasks.Task',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='files'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'files'
        ordering = ['-created_at']
        verbose_name = 'File'
        verbose_name_plural = 'Files'

    def __str__(self):
        return f"{self.filename} ({self.file_type})"

    def save(self, *args, **kwargs):
        if self.file and not self.filename:
            self.filename = self.file.name
        if self.file and not self.size:
            self.size = self.file.size
        if self.file:
            extension = self.file.name.split('.')[-1].lower()
            self.file_type = extension
        super().save(*args, **kwargs)
