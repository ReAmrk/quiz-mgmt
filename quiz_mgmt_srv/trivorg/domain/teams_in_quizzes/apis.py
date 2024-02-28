from typing import List
from ninja import Router, Schema, Form
from datetime import datetime
from .models import TeamInQuiz
from .interfaces import TeamInterface, QuizInterface


router = Router()
teams = TeamInterface()
quizzes = QuizInterface()


class TeamInQuizSchemaIn(Schema):
    team_id: int
    quiz_id: int


class TeamInQuizSchemaOut(Schema):
    id: int
    team: teams.get_team()
    quiz: quizzes.get_quiz()
    created_at: datetime = None
    updated_at: datetime = None


@router.post("/")
def create_team_in_quiz(request, payload: Form[TeamInQuizSchemaIn]):
    team_in_quiz = TeamInQuiz.objects.create(**payload.dict())
    return {"id": team_in_quiz.id}


@router.get("/", response=List[TeamInQuizSchemaOut])
def list_teams_in_quizzes(request):
    teams_in_quizzes = TeamInQuiz.objects.all()
    return teams_in_quizzes


@router.get("/{teams_in_quizzes_id}", response=TeamInQuizSchemaOut)
def get_team_in_quiz(request, teams_in_quizzes_id: int):
    team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id)
    return team_in_quiz


@router.put("/{teams_in_quizzes_id}")
def update_team_in_quiz(request, teams_in_quizzes_id: int, payload: TeamInQuizSchemaIn):
    team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id)
    for attr, value in payload.dict().items():
        setattr(team_in_quiz, attr, value)
    team_in_quiz.save()
    return {"success": True}


@router.delete("/{teams_in_quizzes_id}")
def delete_team_in_quiz(request, teams_in_quizzes_id: int):
    team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id)
    team_in_quiz.delete()
    return {"success": True}