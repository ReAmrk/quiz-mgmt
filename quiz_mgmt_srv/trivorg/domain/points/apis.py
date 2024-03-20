from typing import List
from ninja import Router, Schema
from datetime import datetime
from .models import Point
from .interfaces import TeamInterface, QuizInterface

router = Router()
team = TeamInterface()
quiz = QuizInterface()


class PointSchemaIn(Schema):
    points: str
    team_id: str
    quiz_id: str


class PointSchemaOut(Schema):
    id: int
    points: int
    team: team.get_team()
    quiz: quiz.get_quiz()
    created_at: datetime = None
    updated_at: datetime = None


@router.post("/")
def create_point(request, payload: PointSchemaIn):
    if request.user.is_authenticated:
        point = Point.objects.create(**payload.dict(), created_by=request.user)
        return {"id": point.id}
    else:
        return {"error": "Please log in"}


@router.get("/", response=List[PointSchemaOut])
def list_points(request):
    current_user = request.user
    if current_user.is_superuser:
        points = Point.objects.all()
    elif current_user.is_authenticated and not current_user.is_superuser:
        points = Point.objects.filter(created_by=current_user)
    else:
        points = []
    return points


@router.get("/{points_id}", response=PointSchemaOut)
def get_point(request, points_id: int):
    if request.user.is_superuser:
        point = Point.objects.get(id=points_id)
    elif request.user.is_authenticated and not request.user.is_superuser:
        point = Point.objects.get(id=points_id, created_by=request.user)
    else:
        point = None
    return point


@router.put("/{points_id}")
def update_point(request, points_id: int, payload: PointSchemaIn):
    if request.user.is_superuser:
        point = Point.objects.get(id=points_id)
        for attr, value in payload.dict().items():
            setattr(point, attr, value)
        point.save()
        return {"success": "Point updated"}
    elif request.user.is_authenticated and not request.user.is_superuser:
        point = Point.objects.get(id=points_id, created_by=request.user)
        for attr, value in payload.dict().items():
            setattr(point, attr, value)
        point.save()
        return {"success": "Point updated"}
    else:
        return {"error": "You don't have permission to update this point"}


@router.delete("/{points_id}")
def delete_point(request, points_id: int):
    if request.user.is_superuser:
        point = Point.objects.get(id=points_id)
        point.delete()
        return {"success": "Point deleted"}
    elif request.user.is_authenticated and not request.user.is_superuser:
        point = Point.objects.get(id=points_id, created_by=request.user)
        point.delete()
        return {"success": "Point deleted"}
    else:
        return {"error": "You don't have permission to delete this point"}