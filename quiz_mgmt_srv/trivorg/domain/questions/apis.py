from typing import List

from django.db.models import ProtectedError
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from ninja import Router, Schema, Form
from datetime import datetime
from .models import Question
from .interfaces import CategoryInterface


router = Router()
categories = CategoryInterface()


class QuestionSchemaIn(Schema):
    question: str
    answer: str
    difficulty: str
    points: str
    category_id: str


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
def create_question(request, payload: QuestionSchemaIn):
    if request.user.is_authenticated:
        question = Question.objects.create(**payload.dict(), created_by=request.user)
        return {"id": question.id}
    else:
        return {"error": "Not authenticated"}



@router.get("/", response=List[QuestionSchemaOut])
def list_questions(request):
    current_user = request.user
    if current_user.is_superuser:
        questions = Question.objects.all()
    elif current_user.is_authenticated and not current_user.is_superuser:
        questions = Question.objects.filter(created_by=current_user)
    else:
        questions = []
    return questions


@router.get("/{questions_id}", response=QuestionSchemaOut)
def get_question(request, questions_id: int):
    if request.user.is_superuser:
        question = Question.objects.get(id=questions_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        question = Question.objects.get(id=questions_id, created_by=request.user)
    else:
        question = None
    return question


@router.put("/{questions_id}")
def update_question(request, questions_id: int, payload: QuestionSchemaIn):
    if request.user.is_superuser:
        question = Question.objects.get(id=questions_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        question = Question.objects.get(id=questions_id, created_by=request.user)
    else:
        question = None
    if question:
        for attr, value in payload.dict().items():
            setattr(question, attr, value)
        question.save()
        return {"success": True}
    else:
        return {"error": "You are not authorized to update this question"}


@router.delete("/{questions_id}")
def delete_question(request, questions_id: int):
    question = get_object_or_404(Question, id=questions_id)
    if request.user.is_superuser:
        question.delete()
        return JsonResponse({"success": True})
    elif request.user.is_authenticated and not request.user.is_superuser:
        if question.created_by == request.user:
            try:
                question.delete()
                return JsonResponse({"success": True})
            except ProtectedError:
                return JsonResponse(
                    {"error": "Cannot delete the question because it is referenced through protected foreign keys"})
        else:
            return JsonResponse({"error": "You are not authorized to delete this question"})
    else:
        return JsonResponse({"error": "You are not authorized to delete this question"})