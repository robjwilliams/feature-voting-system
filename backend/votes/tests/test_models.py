from django.test import TestCase
from django.db import IntegrityError
from users.models import User
from features.models import Feature
from votes.models import Vote


class VoteSignalTest(TestCase):
    def setUp(self):
        self.author = User.objects.create_user(username='author', password='pass')
        self.voter = User.objects.create_user(username='voter', password='pass')
        self.feature = Feature.objects.create(
            title='A Feature', description='desc', author=self.author
        )

    def test_creating_vote_increments_vote_count(self):
        self.assertEqual(self.feature.vote_count, 0)
        Vote.objects.create(feature=self.feature, user=self.voter)
        self.feature.refresh_from_db()
        self.assertEqual(self.feature.vote_count, 1)

    def test_deleting_vote_decrements_vote_count(self):
        vote = Vote.objects.create(feature=self.feature, user=self.voter)
        self.feature.refresh_from_db()
        self.assertEqual(self.feature.vote_count, 1)

        vote.delete()
        self.feature.refresh_from_db()
        self.assertEqual(self.feature.vote_count, 0)

    def test_duplicate_vote_raises_integrity_error(self):
        Vote.objects.create(feature=self.feature, user=self.voter)
        with self.assertRaises(IntegrityError):
            Vote.objects.create(feature=self.feature, user=self.voter)
