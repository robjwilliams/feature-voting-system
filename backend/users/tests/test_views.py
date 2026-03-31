from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from users.models import User


class MeViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='alice', password='pass')

    def test_me_returns_user_data_when_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.user.pk)
        self.assertEqual(response.data['username'], self.user.username)

    def test_me_returns_401_when_unauthenticated(self):
        response = self.client.get('/api/auth/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LoginViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='alice', password='correctpass')

    def test_login_returns_tokens_with_valid_credentials(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'alice',
            'password': 'correctpass',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_returns_401_with_invalid_credentials(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'alice',
            'password': 'wrongpass',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
