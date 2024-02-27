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
def create_team(request, payload: Form[TeamSchemaIn]):
    team = Team.objects.create(**payload.dict())
    return {"id": team.id}


@router.get("/", response=List[TeamSchemaOut])
def list_teams(request):
    teams = Team.objects.all()
    return teams


@router.get("/{teams_id}", response=TeamSchemaOut)
def get_team(request, teams_id: int):
    team = Team.objects.get(id=teams_id)
    return team


@router.put("/{teams_id}")
def update_team(request, teams_id: int, payload: TeamSchemaIn):
    team = Team.objects.get(id=teams_id)
    for attr, value in payload.dict().items():
        setattr(team, attr, value)
    team.save()
    return {"success": True}


@router.delete("/{teams_id}")
def delete_team(request, teams_id: int):
    team = Team.objects.get(id=teams_id)
    team.delete()
    return {"success": True}