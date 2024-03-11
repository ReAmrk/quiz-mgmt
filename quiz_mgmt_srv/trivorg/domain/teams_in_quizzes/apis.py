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
    if request.user.is_authenticated:
        team_in_quiz = TeamInQuiz.objects.create(**payload.dict(), created_by=request.user)
        return {"id": team_in_quiz.id}
    else:
        return {"error": "Please log in"}


@router.get("/", response=List[TeamInQuizSchemaOut])
def list_teams_in_quizzes(request):
    current_user = request.user
    if current_user.is_superuser:
        teams_in_quizzes = TeamInQuiz.objects.all()
    elif current_user.is_authenticated and not current_user.is_superuser:
        teams_in_quizzes = TeamInQuiz.objects.filter(created_by=current_user)
    else:
        teams_in_quizzes = []
    return teams_in_quizzes


@router.get("/{teams_in_quizzes_id}", response=TeamInQuizSchemaOut)
def get_team_in_quiz(request, teams_in_quizzes_id: int):
    try:
        if request.user.is_superuser:
            team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id)
        elif request.user.is_authenticated and not request.user.is_superuser:
            team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id, created_by=request.user)
        else:
            team_in_quiz = None
    except TeamInQuiz.DoesNotExist:
        return {"error": "Team in quiz not found"}
    return team_in_quiz


@router.put("/{teams_in_quizzes_id}")
def update_team_in_quiz(request, teams_in_quizzes_id: int, payload: TeamInQuizSchemaIn):
    if request.user.is_superuser:
        team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id, created_by=request.user)
    else:
        return {"error": "You do not have permission to perform this action"}
    for attr, value in payload.dict().items():
        setattr(team_in_quiz, attr, value)
    team_in_quiz.save()
    return {"success": True}


@router.delete("/{teams_in_quizzes_id}")
def delete_team_in_quiz(request, teams_in_quizzes_id: int):
    if request.user.is_superuser:
        team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        team_in_quiz = TeamInQuiz.objects.get(id=teams_in_quizzes_id, created_by=request.user)
    else:
        return {"error": "You do not have permission to perform this action"}
    team_in_quiz.delete()
    return {"success": True}