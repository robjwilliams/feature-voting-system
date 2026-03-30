from django.db import models
from django.conf import settings


class Feature(models.Model):
    STATUS_OPEN = 'open'
    STATUS_IN_PROGRESS = 'in_progress'
    STATUS_DONE = 'done'
    STATUS_REJECTED = 'rejected'

    STATUS_CHOICES = [
        (STATUS_OPEN, 'Open'),
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_DONE, 'Done'),
        (STATUS_REJECTED, 'Rejected'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='features',
    )
    # Denormalized for fast ranking queries — kept in sync via signals in votes/models.py
    vote_count = models.IntegerField(default=0, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_OPEN)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-vote_count', '-created_at']

    def __str__(self):
        return self.title
