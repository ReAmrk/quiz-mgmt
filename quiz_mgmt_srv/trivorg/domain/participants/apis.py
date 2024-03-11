from django.shortcuts import render
from ninja import Router, Schema, Form
from .models import Participant
from datetime import datetime
from typing import List
from .interfaces import TeamInterface

router = Router()
teams = TeamInterface()


class ParticpantSchemaIn(Schema):
    first_name: str
    last_name: str
    email: str
    teams_id: int


class ParticipantSchemaOut(Schema):
    id: int
    first_name: str
    last_name: str
    email: str
    teams: teams.get_teams()
    created_at: datetime = None
    updated_at: datetime = None


@router.post("/")
def create_participant(request, payload: Form[ParticpantSchemaIn]):
    if request.user.is_authenticated:
        participant = Participant.objects.create(**payload.dict())
        return {"id": participant.id}
    else:
        return {"error": "Please log in"}


@router.get("/", response=List[ParticipantSchemaOut])
def list_participants(request):
    if request.user.is_superuser:
        participants = Participant.objects.all()
    elif request.user.is_authenticated and not request.user.is_superuser:
        participants = Participant.objects.filter(created_by=request.user)
    else:
        participants = []
    return participants


@router.get("/{participants_id}", response=ParticipantSchemaOut)
def get_participant(request, participants_id: int):
    if request.user.is_superuser:
        participant = Participant.objects.get(id=participants_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        participant = Participant.objects.get(id=participants_id, created_by=request.user)
    else:
        participant = None
    return participant


@router.put("/{participants_id}")
def update_participant(request, participants_id: int, payload: ParticpantSchemaIn):
    if request.user.is_superuser:
        participant = Participant.objects.get(id=participants_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        participant = Participant.objects.get(id=participants_id, created_by=request.user)
    else:
        return {"success": False, "error": "You are not authorized to update this participant"}
    for attr, value in payload.dict().items():
        setattr(participant, attr, value)
    participant.save()
    return {"success": True}


@router.delete("/{participants_id}")
def delete_participant(request, participants_id: int):
    if request.user.is_superuser:
        participant = Participant.objects.get(id=participants_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        participant = Participant.objects.get(id=participants_id, created_by=request.user)
    else:
        return {"success": False, "error": "You are not authorized to delete this participant"}
    participant.delete()
    return {"success": True}
