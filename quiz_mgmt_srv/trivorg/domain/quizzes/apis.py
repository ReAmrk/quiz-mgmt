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
    team_limit: str
    quiz_date: str
    is_completed: bool


class QuizSchemaOut(Schema):
    id: int
    quiz_name: str
    description: str
    team_limit: int
    quiz_date: datetime
    is_completed: bool
    category: categories.get_category()
    created_at: datetime = None
    updated_at: datetime = None


@router.post("/")
def create_quiz(request, payload: QuizSchemaIn):
    if request.user.is_authenticated:
        quiz = Quiz.objects.create(**payload.dict(), created_by=request.user)
        return {"id": quiz.id}
    else:
        return {"error": "Please log in"}


@router.get("/", response=List[QuizSchemaOut])
def list_quizzes(request):
    current_user = request.user
    if current_user.is_superuser:
        quizzes = Quiz.objects.all()
    elif current_user.is_authenticated and not current_user.is_superuser:
        quizzes = Quiz.objects.filter(created_by=current_user)
    else:
        quizzes = []
    return quizzes


@router.get("/{quizzes_id}", response=QuizSchemaOut)
def get_quiz(request, quizzes_id: int):
    try:
        if request.user.is_superuser:
            quiz = Quiz.objects.get(id=quizzes_id)
        elif request.user.is_authenticated and not request.user.is_superuser:
            quiz = Quiz.objects.get(id=quizzes_id, created_by=request.user)
        else:
            quiz = None
    except Quiz.DoesNotExist:
        return {"error": "Quiz not found"}
    return quiz


@router.put("/{quizzes_id}")
def update_quiz(request, quizzes_id: int, payload: QuizSchemaIn):
    if request.user.is_superuser:
        quiz = Quiz.objects.get(id=quizzes_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        quiz = Quiz.objects.get(id=quizzes_id, created_by=request.user)
    else:
        return {"error": "You are not authorized to perform this action"}
    for attr, value in payload.dict().items():
        setattr(quiz, attr, value)
    quiz.save()
    return {"success": True}



@router.delete("/{quizzes_id}")
def delete_quiz(request, quizzes_id: int):
    if request.user.is_superuser:
        quiz = Quiz.objects.get(id=quizzes_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        quiz = Quiz.objects.get(id=quizzes_id, created_by=request.user)
    else:
        return {"error": "You are not authorized to perform this action"}
    quiz.delete()
    return {"success": True}