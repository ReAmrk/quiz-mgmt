from typing import List

from django.shortcuts import render
from ninja import Router, Schema, Form
from datetime import datetime
from .models import Question
from .interfaces import CategoryInterface


router = Router()
categories = CategoryInterface()

class QuestionSchemaIn(Schema):
    question: str
    answer: str
    difficulty: int
    points: int
    category_id: int


class QuestionSchemaOut(Schema):
    id: int
    question: str
    answer: str
    difficulty: int
    points: int
    category: categories.get_category()
    created_at: datetime = None
    updated_at: datetime = None


@router.post("/")
def create_question(request, payload: Form[QuestionSchemaIn]):
    category_data = payload.dict().pop("category", None)
    category_id = category_data.get("id") if category_data else None
    current_user = request.user
    question = Question.objects.create(**payload.dict())
    question.created_by = current_user
    return {"id": question.id}


@router.get("/", response=List[QuestionSchemaOut])
def list_questions(request):
    questions = Question.objects.all()
    return questions


@router.get("/{questions_id}", response=QuestionSchemaOut)
def get_question(request, questions_id: int):
    question = Question.objects.get(id=questions_id)
    return question


@router.put("/{questions_id}")
def update_question(request, questions_id: int, payload: QuestionSchemaIn):
    question = Question.objects.get(id=questions_id)
    for attr, value in payload.dict().items():
        setattr(question, attr, value)
    question.save()
    return {"success": True}


@router.delete("/{questions_id}")
def delete_question(request, questions_id: int):
    question = Question.objects.get(id=questions_id)
    question.delete()
    return {"success": True}