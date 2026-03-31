from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from features.models import Feature


class VoteToggleViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = User.objects.create_user(username='author', password='pass')
        self.voter = User.objects.create_user(username='voter', password='pass')
        self.feature = Feature.objects.create(
            title='Votable Feature', description='desc', author=self.author
        )
        self.url = f'/api/features/{self.feature.pk}/vote/'

    def test_unauthenticated_vote_returns_401(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_voting_own_feature_returns_403(self):
        self.client.force_authenticate(user=self.author)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_first_vote_creates_vote_and_returns_voted_true(self):
        self.client.force_authenticate(user=self.voter)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['voted'])
        self.assertEqual(response.data['vote_count'], 1)

    def test_second_vote_removes_vote_and_returns_voted_false(self):
        self.client.force_authenticate(user=self.voter)
        self.client.post(self.url)  # vote
        response = self.client.post(self.url)  # unvote
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['voted'])
        self.assertEqual(response.data['vote_count'], 0)
