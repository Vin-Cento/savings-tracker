import uuid
from fastapi import APIRouter, Query, status
from fastapi.exceptions import HTTPException
from sqlalchemy import ColumnElement
from core.dependencies import GoalServiceDependency
from schema.goal_schema import (
    GoalPaginationSchema,
    GoalSchema,
    GoalCreateSchema,
    GoalUpdateSchema,
)
from models.models import GoalRow

router = APIRouter(
    prefix="/goals",
    tags=["goals"],
)


class GoalNotFoundError(Exception):
    pass


@router.get("/count", response_model=int, operation_id="countGoal")
def count_goal(service: GoalServiceDependency,
               active: bool | None = Query(None),
               completed: bool | None = Query(None)
               ):
    where: list[ColumnElement[bool]] = []
    if completed != None:
        where.append(GoalRow.completed == completed)
    if active != None:
        where.append(GoalRow.active == active)
    return service.count_goal(where)


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
def fetch_goal(
    service: GoalServiceDependency,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    return service.list_goal(page=page, limit=limit)


@router.post(
    "",
    response_model=GoalSchema,
    status_code=status.HTTP_201_CREATED,
    operation_id='addGoal'
)
def add_goal(
    service: GoalServiceDependency,
    goal: GoalCreateSchema,
):
    if goal.target < 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail="Goal target must be greater than zero")

    return service.add_goal(goal)


@router.put(
    "/{id}",
    response_model=GoalSchema,
    status_code=status.HTTP_201_CREATED,
    operation_id='updateGoal'
)
def update_goal(
    goal: GoalUpdateSchema,
    # id: uuid.UUID,
    service: GoalServiceDependency,
):
    new_goal = service.update_goal(goal)
    if new_goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal Not Found",
        )
    return new_goal


# @router.post(
#     "/bulk",
#     response_model=GoalSchema,
#     status_code=status.HTTP_201_CREATED,
#     operation_id='upsertBulkGoal'
# )
# def bulk_upsert(
#     goal: GoalCreateSchema,
#     session: Session = Depends(get_session),
# ):
#     return goal_service.bulk_upsert_goal(session, goal)


@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id='deleteGoal'
)
def delete_goal(id: uuid.UUID, service: GoalServiceDependency):
    return service.delete_goal(id)
