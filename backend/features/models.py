from django.db import models
from django.conf import settings


class Feature(models.Model):

    title = models.CharField(max_length=200)
    description = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='features',
    )
    # Denormalized for fast ranking queries — kept in sync via signals in votes/models.py
    vote_count = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-vote_count', '-created_at']

    def __str__(self):
        return self.title
