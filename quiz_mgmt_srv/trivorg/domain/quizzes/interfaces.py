from domain.categories.apis import CategorySchemaOut, CategorySchemaChoice


class CategoryInterface:

    def get_category(self):
        return CategorySchemaOut

    def get_category_choice(self):
        return CategorySchemaChoice