from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from schema.goal_schema import (GoalCreateSchema,
                                GoalPaginationSchema,
                                GoalSchema)
from repositories import goal_repository


def get_goal(db: Session, goal_id: int):
    goal = goal_repository.get(db, goal_id)

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )

    return goal


def list_goal(db: Session, page: int, limit: int) -> GoalPaginationSchema:
    total = goal_repository.count(db)
    goals = goal_repository.list(db, page, limit)

    goals_schema = [GoalSchema.model_validate(item) for item in goals]

    return GoalPaginationSchema(
        total=total,
        page=page,
        limit=limit,
        data=goals_schema,
    )


def upsert_goal(db: Session, goal: GoalCreateSchema):
    if goal.id == -1:
        existing_goal = goal_repository.get(db, goal.id)

        if existing_goal:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Goal with name '{goal.name}' already exists.",
            )

        return goal_repository.create(db, goal)

    existing_goal = goal_repository.get(db, goal.id)

    if not existing_goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal {goal.id} not found",
        )

    return goal_repository.update(db, existing_goal, goal)


def delete_goal(db: Session, goal_id: int):
    goal = goal_repository.get(db, goal_id)

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal with id {goal_id} not found",
        )

    goal_repository.delete(db, goal)
