from typing import List

from ninja import Router, Schema, Form
from .models import Team
from datetime import datetime


router = Router()


class TeamSchemaIn(Schema):
    team_name: str


class TeamSchemaOut(Schema):
    id: int
    team_name: str
    created_at: datetime = None
    updated_at: datetime = None


@router.post("/")
def create_team(request, payload: TeamSchemaIn):
    if request.user.is_authenticated:
        team = Team.objects.create(**payload.dict(), created_by=request.user)
        return {"id": team.id}
    else:
        return {"error": "Please log in"}


@router.get("/", response=List[TeamSchemaOut])
def list_teams(request):
    current_user = request.user
    if current_user.is_superuser:
        teams = Team.objects.all()
    elif current_user.is_authenticated and not current_user.is_superuser:
        teams = Team.objects.filter(created_by=current_user)
    else:
        teams = []
    return teams

@router.get("/{teams_id}", response=TeamSchemaOut)
def get_team(request, teams_id: int):
    try:
        if request.user.is_superuser:
            team = Team.objects.get(id=teams_id)
        elif request.user.is_authenticated and not request.user.is_superuser:
            team = Team.objects.get(id=teams_id, created_by=request.user)
        else:
            team = None
    except Team.DoesNotExist:
        return {"error": "Team not found"}
    return team


@router.put("/{teams_id}")
def update_team(request, teams_id: int, payload: TeamSchemaIn):
    if request.user.is_superuser:
        team = Team.objects.get(id=teams_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        team = Team.objects.get(id=teams_id, created_by=request.user)
    else:
        return {"error": "Unauthorized"}
    for attr, value in payload.dict().items():
        setattr(team, attr, value)
    team.save()
    return {"success": True}


@router.delete("/{teams_id}")
def delete_team(request, teams_id: int):
    if request.user.is_superuser:
        team = Team.objects.get(id=teams_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        team = Team.objects.get(id=teams_id, created_by=request.user)
    else:
        return {"error": "Unauthorized"}
    team.delete()
    return {"success": True}