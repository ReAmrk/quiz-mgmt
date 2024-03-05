from typing import List
from ninja import Router, Schema
from datetime import datetime
from .models import Category


router = Router()


class CategorySchemaIn(Schema):
    category_name: str
    description: str


class CategorySchemaOut(Schema):
    id: int
    category_name: str
    description: str
    created_at: datetime = None
    updated_at: datetime = None


class CategorySchemaChoice(Schema):
    id: int
    name: str


@router.post("/")
def create_category(request, payload: CategorySchemaIn):
    current_user = request.user
    category = Category.objects.create(**payload.dict(), created_by=current_user)
    return {"id": category.id}


@router.get("/", response=List[CategorySchemaOut])
def list_categories(request):
    current_user = request.user
    if current_user.is_superuser:
        categories = Category.objects.all()
    elif current_user.is_authenticated and not current_user.is_superuser:
        categories = Category.objects.filter(created_by=current_user)
    else:
        categories = []
    return categories


@router.get("/{categories_id}", response=CategorySchemaOut)
def get_category(request, categories_id: int):
    if request.user.is_superuser:
        category = Category.objects.get(id=categories_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        category = Category.objects.get(id=categories_id, created_by=request.user)
    else:
        category = None
    return category


@router.put("/{categories_id}")
def update_category(request, categories_id: int, payload: CategorySchemaIn):
    category = Category.objects.get(id=categories_id)
    for attr, value in payload.dict().items():
        setattr(category, attr, value)
    category.save()
    return {"success": True}


@router.delete("/{categories_id}")
def delete_category(request, categories_id: int):
    category = Category.objects.get(id=categories_id)
    category.delete()
    return {"success": True}