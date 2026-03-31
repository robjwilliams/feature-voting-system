from django.db.models import Exists, OuterRef
from django.test import TestCase
from rest_framework.test import APIRequestFactory
from users.models import User
from features.models import Feature
from features.serializers import FeatureSerializer
from votes.models import Vote


class FeatureOrderingTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='alice', password='pass')

    def test_features_ordered_by_vote_count_then_created_at(self):
        f1 = Feature.objects.create(title='First', description='d', author=self.user)
        f2 = Feature.objects.create(title='Second', description='d', author=self.user)
        # Manually bump f2's vote_count so it ranks higher
        Feature.objects.filter(pk=f2.pk).update(vote_count=5)

        features = list(Feature.objects.all())
        self.assertEqual(features[0].pk, f2.pk)
        self.assertEqual(features[1].pk, f1.pk)

    def test_features_with_equal_votes_ordered_by_newest_first(self):
        f1 = Feature.objects.create(title='Older', description='d', author=self.user)
        f2 = Feature.objects.create(title='Newer', description='d', author=self.user)

        features = list(Feature.objects.all())
        self.assertEqual(features[0].pk, f2.pk)
        self.assertEqual(features[1].pk, f1.pk)


class FeatureSerializerComputedFieldsTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.author = User.objects.create_user(username='author', password='pass')
        self.other = User.objects.create_user(username='other', password='pass')
        self.feature = Feature.objects.create(
            title='My Feature', description='desc', author=self.author
        )

    def _serialize(self, user):
        request = self.factory.get('/')
        request.user = user
        feature = Feature.objects.annotate(
            has_voted=Exists(Vote.objects.filter(feature=OuterRef('pk'), user=user))
        ).get(pk=self.feature.pk)
        return FeatureSerializer(feature, context={'request': request}).data

    def test_has_voted_false_when_user_has_not_voted(self):
        data = self._serialize(self.other)
        self.assertFalse(data['has_voted'])

    def test_has_voted_true_when_user_has_voted(self):
        Vote.objects.create(feature=self.feature, user=self.other)
        data = self._serialize(self.other)
        self.assertTrue(data['has_voted'])

    def test_is_author_true_for_author(self):
        data = self._serialize(self.author)
        self.assertTrue(data['is_author'])

    def test_is_author_false_for_other_user(self):
        data = self._serialize(self.other)
        self.assertFalse(data['is_author'])
