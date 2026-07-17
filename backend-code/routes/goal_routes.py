import uuid
from fastapi import APIRouter, Depends, Query, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from starlette.status import HTTP_404_NOT_FOUND
from core.dependencies import GoalServiceDependency, get_session
from schema.goal_schema import (
    GoalPaginationSchema,
    GoalSchema,
    GoalCreateSchema,
    GoalUpdateSchema,
)
from services import goal_service

router = APIRouter(
    prefix="/goals",
    tags=["goals"],
)


class GoalNotFoundError(Exception):
    pass


@router.get("/{id}", response_model=GoalSchema, operation_id="getGoal")
def get_goal(id: uuid.UUID, service: GoalServiceDependency):
    goal = service.get_goal(id)
    if goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal Not Found",
        )
    return goal


@router.get("", response_model=GoalPaginationSchema, operation_id='fetchGoals')
def list(
    service: GoalServiceDependency,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    return service.list_goal(page, limit)


@router.post(
    "",
    response_model=GoalSchema,
    status_code=status.HTTP_201_CREATED,
    operation_id='addGoal'
)
def add(
    service: GoalServiceDependency,
    goal: GoalCreateSchema,
):
    if goal.target < 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Goal target must be greater than zero")

    new_goal = service.add_goal(goal)
    return GoalSchema(id=new_goal.id, createdAt=new_goal.createdAt,
                      name=new_goal.name, target=new_goal.target,
                      active=new_goal.active,
                      completed=new_goal.completed,
                      amount=0, deadline=new_goal.deadline)


@router.put(
    "/{id}",
    response_model=GoalSchema,
    status_code=status.HTTP_201_CREATED,
    operation_id='updateGoal'
)
def update(
    goal: GoalUpdateSchema,
    id: uuid.UUID,
    session: Session = Depends(get_session),
):
    new_goal = goal_service.upsert_goal(session, goal)
    return GoalSchema(id=new_goal.id, createdAt=new_goal.createdAt,
                      name=new_goal.name, target=new_goal.target,
                      active=new_goal.active,
                      completed=new_goal.completed,
                      amount=0, deadline=new_goal.deadline)


@router.post(
    "/bulk",
    response_model=GoalSchema,
    status_code=status.HTTP_201_CREATED,
    operation_id='upsertBulkGoal'
)
def bulk_upsert(
    goal: GoalCreateSchema,
    session: Session = Depends(get_session),
):
    new_goal = goal_service.bulk_upsert_goal(session, goal)
    print(new_goal)
    # return GoalSchema(id=new_goal.id, createdAt=new_goal.createdAt,
    #                   name=new_goal.name, target=new_goal.target,
    #                   active=new_goal.active,
    #                   completed=new_goal.completed,
    #                   amount=0, deadline=new_goal.deadline)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT,
               operation_id='deleteGoal')
def delete(id: uuid.UUID, session: Session = Depends(get_session)):
    goal_service.delete_goal(session, id)
    return None
