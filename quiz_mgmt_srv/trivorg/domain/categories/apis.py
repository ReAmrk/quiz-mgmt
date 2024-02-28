from typing import List

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import User
from django.shortcuts import render
from ninja import Router, Schema
from ninja.security import django_auth, HttpBearer
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
    category = Category.objects.create(**payload.dict())
    category.created_by = current_user.id
    return {"id": category.id}


@router.get("/", response=List[CategorySchemaOut])
def list_categories(request):
    categories = Category.objects.all()
    return categories


@router.get("/{categories_id}", response=CategorySchemaOut)
def get_category(request, categories_id: int):
    category = Category.objects.get(id=categories_id)
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