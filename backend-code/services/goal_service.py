from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from schema.goal_schema import GoalCreateSchema
from repositories import goal_repository


def get_goal(db: Session, goal_id: int):
    goal = goal_repository.get_goal_by_id(db, goal_id)

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )

    return goal


def list_goals(db: Session, page: int, limit: int):
    total = goal_repository.count_goals(db)
    goals = goal_repository.list_goals(db, page, limit)

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "data": goals,
    }


def create_or_update_goal(db: Session, goal: GoalCreateSchema):
    if goal.id == -1:
        existing_goal = goal_repository.get_goal_by_name(db, goal.name)

        if existing_goal:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Goal with name '{goal.name}' already exists.",
            )

        return goal_repository.create_goal(db, goal)

    existing_goal = goal_repository.get_goal_by_id(db, goal.id)

    if not existing_goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal {goal.id} not found",
        )

    return goal_repository.update_goal(db, existing_goal, goal)


def delete_goal(db: Session, goal_id: int):
    goal = goal_repository.get_goal_by_id(db, goal_id)

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal with id {goal_id} not found",
        )

    goal_repository.delete_goal(db, goal)
