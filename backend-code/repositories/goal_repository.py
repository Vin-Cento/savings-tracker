from typing import List, Optional

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from models.models import Deposit, Goal
from schema.goal_schema import GoalCreateSchema, GoalSchema
from sqlalchemy import delete as sqlalchemy_delete


def get(db: Session, goal_id: int) -> Optional[GoalSchema]:
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
    if row is None:
        return None

    return GoalSchema.model_validate(row._mapping)


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


def update(db: Session, goal: GoalCreateSchema):
    db_goal = db.get(Goal, goal.id)

    if db_goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal {goal.id} not found",
        )

    db_goal.name = goal.name
    db_goal.target = goal.target
    db_goal.deadline = goal.deadline

    db.commit()
    db.refresh(db_goal)

    return db_goal


def delete(db: Session, goal: GoalSchema):
    print('in delete repo')
    db.execute(sqlalchemy_delete(Goal).where(Goal.id == goal.id))
    db.commit()
