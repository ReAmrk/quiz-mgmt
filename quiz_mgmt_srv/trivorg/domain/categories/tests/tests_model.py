from django.contrib.auth.models import User
from django.test import TestCase
from ..models import Category


class CategoryModelTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username="testuser", password="password")

        self.category = Category.objects.create(
            category_name='Geography',
            description='Geography Questions',
            created_by=self.user
        )

    def test_create_category(self):
        category = Category.objects.create(category_name='History', description='History Questions', created_by=self.user)
        self.assertEqual(category.id, 2)
        self.assertEqual(str(category), 'History')

    def test_get_category(self):
        category = Category.objects.get(id=self.category.id)
        self.assertEqual(category.category_name, 'Geography')

    def test_edit_category(self):
        category = Category.objects.get(id=self.category.id)
        category.category_name = 'Edited Geography'
        category.description = 'Edited Geography Questions'
        category.save()
        self.assertEqual(category.category_name, 'Edited Geography')
        self.assertEqual(category.description, 'Edited Geography Questions')

    def test_delete_category(self):
        category = Category.objects.get(id=self.category.id)
        category.delete()
        self.assertEqual(Category.objects.count(), 0)