from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User
from features.models import Feature


class FeatureViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.author = User.objects.create_user(username='author', password='pass')
        self.other = User.objects.create_user(username='other', password='pass')
        self.feature = Feature.objects.create(
            title='Test Feature', description='A description', author=self.author
        )

    # --- Authentication ---

    def test_list_requires_authentication(self):
        response = self.client.get('/api/features/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_returns_features_when_authenticated(self):
        self.client.force_authenticate(user=self.author)
        response = self.client.get('/api/features/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    # --- Create ---

    def test_create_sets_author_to_request_user(self):
        self.client.force_authenticate(user=self.author)
        response = self.client.post('/api/features/', {
            'title': 'New Feature',
            'description': 'Details',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['author_username'], self.author.username)

    # --- Update ---

    def test_author_can_patch_own_feature(self):
        self.client.force_authenticate(user=self.author)
        response = self.client.patch(f'/api/features/{self.feature.pk}/', {'title': 'Updated'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated')

    def test_non_author_cannot_patch_feature(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.patch(f'/api/features/{self.feature.pk}/', {'title': 'Hijacked'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # --- Delete ---

    def test_author_can_delete_own_feature(self):
        self.client.force_authenticate(user=self.author)
        response = self.client.delete(f'/api/features/{self.feature.pk}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_non_author_cannot_delete_feature(self):
        self.client.force_authenticate(user=self.other)
        response = self.client.delete(f'/api/features/{self.feature.pk}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
