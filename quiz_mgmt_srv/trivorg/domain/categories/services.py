from .models import Category


class CategoryService:

    @staticmethod
    def get_all_categories(self):
        return Category.objects.all()

    @staticmethod
    def get_category_by_id(self, category_id):
        return Category.objects.get(id=category_id)

    @staticmethod
    def create_category(self, category_name):
        return Category.objects.create(name=category_name)

    @staticmethod
    def update_category(self, category_id, category_name):
        category = Category.objects.get(id=category_id)
        category.name = category_name
        category.save()
        return category

    @staticmethod
    def delete_category(self, category_id):
        category = Category.objects.get(id=category_id)
        category.delete()
        return category_id