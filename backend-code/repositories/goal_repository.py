from typing import List

from sqlalchemy import func
from sqlalchemy.orm import Session

from models.models import Deposit, Goal
from schema.goal_schema import GoalCreateSchema, GoalSchema


def get(db: Session, goal_id: int) -> GoalSchema:
    row = (
        db.query(
            Goal.id.label("id"),
            Goal.name.label("name"),
            Goal.target.label("target"),
            Goal.active.label("active"),
            func.coalesce(func.sum(Deposit.amount), 0).label("amount"),
            Goal.deadline.label("deadline"),
            Goal.createdAt.label("createdAt"),
        )
        .outerjoin(Deposit, Deposit.goal_id == Goal.id)
        .filter(Goal.id == goal_id)
        .group_by(Goal.id)
        .first()
    )
    result = GoalSchema.model_validate(row)
    return result


def list(db: Session, page: int, limit: int) -> List[GoalSchema]:
    rows = (
        db.query(
            Goal.id.label("id"),
            Goal.name.label("name"),
            Goal.target.label("target"),
            Goal.active.label("active"),
            func.coalesce(func.sum(Deposit.amount), 0).label("amount"),
            Goal.deadline.label("deadline"),
            Goal.createdAt.label("createdAt"),
        )
        .outerjoin(Deposit, Deposit.goal_id == Goal.id)
        .group_by(Goal.id)
        .order_by(Goal.createdAt.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    result = [GoalSchema.model_validate(r) for r in rows]
    return result


def count(active: bool, db: Session) -> int:
    return db.query(Goal).filter(Goal.active == active).count()


def create(db: Session, goal: GoalCreateSchema):
    new_goal = Goal(
        name=goal.name,
        target=goal.target,
        deadline=goal.deadline,
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


def update(db: Session, existing_goal: GoalSchema, goal: GoalCreateSchema):
    existing_goal.name = goal.name
    existing_goal.target = goal.target
    existing_goal.deadline = goal.deadline

    db.commit()
    db.refresh(existing_goal)

    return existing_goal


def delete(db: Session, goal: GoalSchema):
    db.delete(goal)
    db.commit()
