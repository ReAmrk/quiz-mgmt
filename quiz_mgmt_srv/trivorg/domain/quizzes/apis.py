from typing import List
from ninja import Router, Schema, Form
from datetime import datetime
from .models import Quiz
from .interfaces import CategoryInterface


router = Router()
categories = CategoryInterface()


class QuizSchemaIn(Schema):
    quiz_name: str
    description: str
    category_id: int


class QuizSchemaOut(Schema):
    id: int
    quiz_name: str
    description: str
    category: categories.get_category()
    created_at: datetime = None
    updated_at: datetime = None


@router.post("/")
def create_quiz(request, payload: Form[QuizSchemaIn]):
    category_data = payload.dict().pop("category", None)
    category_id = category_data.get("id") if category_data else None
    quiz = Quiz.objects.create(**payload.dict())
    return {"id": quiz.id}


@router.get("/", response=List[QuizSchemaOut])
def list_quizzes(request):
    quizzes = Quiz.objects.all()
    return quizzes


@router.get("/{quizzes_id}", response=QuizSchemaOut)
def get_quiz(request, quizzes_id: int):
    quiz = Quiz.objects.get(id=quizzes_id)
    return quiz


@router.put("/{quizzes_id}")
def update_quiz(request, quizzes_id: int, payload: QuizSchemaIn):
    quiz = Quiz.objects.get(id=quizzes_id)
    for attr, value in payload.dict().items():
        setattr(quiz, attr, value)
    quiz.save()
    return {"success": True}


@router.delete("/{quizzes_id}")
def delete_quiz(request, quizzes_id: int):
    quiz = Quiz.objects.get(id=quizzes_id)
    quiz.delete()
    return {"success": True}