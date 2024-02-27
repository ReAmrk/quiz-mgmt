from django.shortcuts import render
from ninja import Router, Schema, Form
from .models import Participant
from datetime import datetime
from typing import List

router = Router()


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
    participant = Participant.objects.create(**payload.dict())
    return {"id": participant.id}


@router.get("/", response=List[ParticipantSchemaOut])
def list_participants(request):
    participants = Participant.objects.all()
    return participants


@router.get("/{participants_id}", response=ParticipantSchemaOut)
def get_participant(request, participants_id: int):
    participant = Participant.objects.get(id=participants_id)
    return participant


@router.put("/{participants_id}")
def update_participant(request, participants_id: int, payload: ParticpantSchemaIn):
    participant = Participant.objects.get(id=participants_id)
    for attr, value in payload.dict().items():
        setattr(participant, attr, value)
    participant.save()
    return {"success": True}


@router.delete("/{participants_id}")
def delete_participant(request, participants_id: int):
    participant = Participant.objects.get(id=participants_id)
    participant.delete()
    return {"success": True}
