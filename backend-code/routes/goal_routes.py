from typing import Annotated
import uuid

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


@router.get("/count", response_model=int, operation_id='countGoal')
def count(active: Annotated[bool, Query()] = True,
          db: Session = Depends(get_db)):
    return goal_service.count_goal(db, active)


@router.get("/{id}", response_model=GoalSchema, operation_id='getGoal')
def get(id: uuid.UUID, db: Session = Depends(get_db)):
    return goal_service.get_goal(db, id)


@router.get("", response_model=GoalPaginationSchema, operation_id='fetchGoals')
def list(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return goal_service.list_goal(db, page, limit)


@router.post(
    "",
    response_model=GoalSchema,
    status_code=status.HTTP_201_CREATED,
    operation_id='upsertGoal'
)
def upsert(
    goal: GoalCreateSchema,
    db: Session = Depends(get_db),
):
    new_goal = goal_service.upsert_goal(db, goal)
    return GoalSchema(id=new_goal.id, createdAt=new_goal.createdAt,
                      name=new_goal.name, target=new_goal.target,
                      active=new_goal.active,
                      amount=0, deadline=new_goal.deadline)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT,
               operation_id='deleteGoal')
def delete(id: uuid.UUID, db: Session = Depends(get_db)):
    goal_service.delete_goal(db, id)
    return None
