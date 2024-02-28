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
def create_question_in_quiz(request, payload: Form[QuestionInQuizSchemaIn]):
    question_in_quiz = QuestionInQuiz.objects.create(**payload.dict())
    return {"id": question_in_quiz.id}


@router.get("/", response=List[QuestionInQuizSchemaOut])
def list_questions_in_quizzes(request):
    questions_in_quizzes = QuestionInQuiz.objects.all()
    return questions_in_quizzes


@router.get("/{questions_in_quizzes_id}", response=QuestionInQuizSchemaOut)
def get_question_in_quiz(request, questions_in_quizzes_id: int):
    question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id)
    return question_in_quiz


@router.put("/{questions_in_quizzes_id}")
def update_question_in_quiz(request, questions_in_quizzes_id: int, payload: QuestionInQuizSchemaIn):
    question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id)
    for attr, value in payload.dict().items():
        setattr(question_in_quiz, attr, value)
    question_in_quiz.save()
    return {"success": True}


@router.delete("/{questions_in_quizzes_id}")
def delete_question_in_quiz(request, questions_in_quizzes_id: int):
    question_in_quiz = QuestionInQuiz.objects.get(id=questions_in_quizzes_id)
    question_in_quiz.delete()
    return {"success": True}