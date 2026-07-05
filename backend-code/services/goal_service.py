import uuid

from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from schema.goal_schema import (GoalCreateSchema,
                                GoalPaginationSchema,
                                GoalSchema)
from repositories import goal_repository


def get_goal(db: Session, goal_id: uuid.UUID):
    goal = goal_repository.get(db, goal_id)

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )

    return goal


def list_goal(db: Session, page: int, limit: int) -> GoalPaginationSchema:
    total = goal_repository.count(db=db, where={})
    goals = goal_repository.fetch(db, page, limit)

    goals_schema = [GoalSchema.model_validate(item) for item in goals]

    return GoalPaginationSchema(
        total=total,
        page=page,
        limit=limit,
        data=goals_schema,
    )


def count_goal(db: Session, active: bool) -> int:
    result = goal_repository.count(db, where={"active": active})
    return result


def upsert_goal(db: Session, goal: GoalCreateSchema):
    if goal.id == uuid.UUID('f84f6b2d-e443-4206-bde2-e64357201a57'):
        return goal_repository.create(db, goal)

    new_goal = goal_repository.update(db, goal)
    return GoalSchema(id=new_goal.id, name=new_goal.name,
                      target=new_goal.target, active=new_goal.active,
                      amount=goal.amount,
                      deadline=new_goal.deadline,
                      createdAt=new_goal.createdAt)


def delete_goal(db: Session, goal_id: uuid.UUID):
    goal = goal_repository.get(db, goal_id)

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal with id {goal_id} not found",
        )

    goal_repository.delete(db, goal)
