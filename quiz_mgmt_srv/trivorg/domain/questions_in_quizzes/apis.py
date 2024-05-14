from typing import List
from ninja import Router, Schema, Form
from datetime import datetime
from .models import QuestionInQuiz
from .interfaces import QuestionInterface, QuizInterface


router = Router()
questions = QuestionInterface()
quizzes = QuizInterface()


class QuestionInQuizSchemaIn(Schema):
    question_id: int
    quiz_id: int


class QuestionInQuizSchemaOut(Schema):
    id: int
    question: questions.get_question()
    quiz: quizzes.get_quiz()
    created_at: datetime = None
    updated_at: datetime = None


@router.post("/")
def create_question_in_quiz(request, payload: QuestionInQuizSchemaIn):
    if request.user.is_authenticated:

        existing_question_in_quiz = QuestionInQuiz.objects.filter(question_id=payload.question_id, quiz_id=payload.quiz_id).first()
        if existing_question_in_quiz:
            return {"error": "Question already exists in this quiz"}
        question_in_quiz = QuestionInQuiz.objects.create(**payload.dict())
        return {"id": question_in_quiz.id}
    else:
        return {"error": "Please log in"}


@router.get("/", response=List[QuestionInQuizSchemaOut])
def list_questions_in_quizzes(request):
    current_user = request.user
    if current_user.is_superuser:
        questions_in_quizzes = QuestionInQuiz.objects.all()
    elif current_user.is_authenticated and not current_user.is_superuser:
        questions_in_quizzes = QuestionInQuiz.objects.filter(created_by=current_user)
    else:
        questions_in_quizzes = []
    return questions_in_quizzes


@router.get("/{questions_in_quizzes_id}", response=QuestionInQuizSchemaOut)
def get_question_in_quiz(request, questions_in_quizzes_id: int):
    if request.user.is_superuser:
        question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id, created_by=request.user)
    else:
        question_in_quiz = None
    return question_in_quiz


@router.put("/{questions_in_quizzes_id}")
def update_question_in_quiz(request, questions_in_quizzes_id: int, payload: QuestionInQuizSchemaIn):
    if request.user.is_superuser:
        question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id, created_by=request.user)
    else:
        return {"error": "You do not have permission to update this question in quiz"}
    for attr, value in payload.dict().items():
        setattr(question_in_quiz, attr, value)
    question_in_quiz.save()
    return {"success": True}


@router.delete("/{questions_in_quizzes_id}")
def delete_question_in_quiz(request, questions_in_quizzes_id: int):
    if request.user.is_superuser:
        question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id, created_by=request.user)
    else:
        return {"error": "You do not have permission to delete this question in quiz"}
    question_in_quiz.delete()
    return {"success": True}