from django.contrib.auth.models import User
from django.test import TestCase
from ninja_extra.testing import TestClient
from ninja_jwt.tokens import AccessToken
from .. import apis
from ..models import Category


class CategoryAPITest(TestCase):

    def setUp(self):
        self.client = TestClient(apis.router)
        self.user = User.objects.create_user(username="testuser", password="password")
        self.token = AccessToken.for_user(self.user)
        self.category_data = {'category_name': 'Geography', 'description': 'Geography Questions'}

        #
        self.category1 = Category.objects.create(
            category_name='Geography',
            description='Questions about Geography',
            created_by=self.user
        )
        self.category2 = Category.objects.create(
            category_name='History',
            description='Questions about History',
            created_by=self.user
        )

    def test_unauthorized_user(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(response.json(), {"detail": "Unauthorized"})

    def test_get_category(self):
        response = self.client.get("/", headers={"Authorization": f"Bearer {self.token}"})
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json())

    def test_create_category(self):
        response = self.client.post("/", json=self.category_data, headers={"Authorization": f"Bearer {self.token}",
                                                                           'Content-Type': 'application/json'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"id": 3})

    def test_get_created_category(self):
        response = self.client.get(f"/{self.category1.id}", headers={"Authorization": f"Bearer {self.token}"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["category_name"], "Geography")

    def test_edit_category(self):
        self.client.put(f"/{self.category1.id}", json={'category_name': 'Edited Geography', 'description': 'Edited Questions about Geography'},
                                   headers={"Authorization": f"Bearer {self.token}",
                                            'Content-Type': 'application/json'})
        response = self.client.get(f"/{self.category1.id}", headers={"Authorization": f"Bearer {self.token}"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["category_name"], "Edited Geography")

    def test_delete_category(self):
        response = self.client.delete(f"/{self.category2.id}", headers={"Authorization": f"Bearer {self.token}"})
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Category.objects.filter(id=self.category2.id).exists())
