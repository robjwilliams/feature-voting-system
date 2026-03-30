from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.conf import settings


class Vote(models.Model):
    feature = models.ForeignKey(
        'features.Feature',
        on_delete=models.CASCADE,
        related_name='votes',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='votes',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [('feature', 'user')]

    def __str__(self):
        return f'{self.user} → {self.feature}'


def _sync_vote_count(feature_id):
    """Recount votes and write to the denormalized field.

    Uses .update() (not .save()) so Feature.updated_at is NOT bumped on votes.
    Import is deferred to avoid circular imports between votes and features.
    """
    from features.models import Feature
    count = Vote.objects.filter(feature_id=feature_id).count()
    Feature.objects.filter(pk=feature_id).update(vote_count=count)


@receiver(post_save, sender=Vote)
def vote_created(sender, instance, created, **kwargs):
    if created:
        _sync_vote_count(instance.feature_id)


@receiver(post_delete, sender=Vote)
def vote_deleted(sender, instance, **kwargs):
    _sync_vote_count(instance.feature_id)
