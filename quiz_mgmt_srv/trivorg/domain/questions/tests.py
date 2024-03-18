from django.contrib.auth.models import User
from django.test import Client, TestCase
from ninja_extra.testing import TestClient
from ninja_jwt.tokens import AccessToken
from rest_framework.test import APIClient

from . import apis


class QuestionTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username="testuser", password="password")
        token = AccessToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        self.url = "/api/questions/"

    # def test_unauthorized_user(self):
    #    response = self.client.get(self.url)
    #    assert response.status_code == 401
    #    assert response.json() == {"detail": "Unauthorized"}

    def test_get_questions(self):
        response = self.client.get(self.url)
        print(response.status_code)
        assert response.status_code == 200
        assert response.json() == []

    def test_create_question(self):
        response = self.client.post(self.url, {"question": "What is the capital of France?", "answer": "Paris", "difficulty": "1", "points": "10", "category_id": "1"})
        assert response.status_code == 200
        assert response.json() == {"id": 1}
