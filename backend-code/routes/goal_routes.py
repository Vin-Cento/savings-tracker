from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from database import get_db
from schema.goal_schema import (
    GoalPaginationSchema,
    GoalSchema,
    GoalCreateSchema,
)
from services import goal_service

router = APIRouter(
    prefix="/goals",
    tags=["goals"],
)


@router.get("/{id}", response_model=GoalSchema)
def get_goal(id: int, db: Session = Depends(get_db)):
    return goal_service.get_goal(db, id)


@router.get("/", response_model=GoalPaginationSchema)
def list_goals(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return goal_service.list_goals(db, page, limit)


@router.post(
    "/",
    response_model=GoalSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_or_update_goal(
    goal: GoalCreateSchema,
    db: Session = Depends(get_db),
):
    return goal_service.create_or_update_goal(db, goal)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(id: int, db: Session = Depends(get_db)):
    goal_service.delete_goal(db, id)
    return None
