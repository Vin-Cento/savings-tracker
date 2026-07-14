from typing import Any, Dict, List, Optional
import uuid

from fastapi import HTTPException, status
from sqlalchemy import Row, func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_

from models.models import Deposit, Goal
from schema.goal_schema import GoalCreateSchema, GoalSchema
from sqlalchemy import delete as sqlalchemy_delete
from core.logging import logging
from sqlalchemy.dialects import postgresql

logger = logging.getLogger("goal repo")


def get(db: Session, goal_id: uuid.UUID) -> GoalSchema:
    row = (
        db.query(
            Goal.id.label("id"),
            Goal.name.label("name"),
            Goal.target.label("target"),
            Goal.active.label("active"),
            Goal.completed.label("completed"),
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
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal {goal_id} not found",
        )

    return GoalSchema.model_validate(row._mapping)


def fetch(db: Session, page: int, limit: int) -> List[GoalSchema]:
    rows: list[Row] = (
        db.query(
            Goal.id.label("id"),
            Goal.name.label("name"),
            Goal.target.label("target"),
            Goal.active.label("active"),
            Goal.completed.label("completed"),
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


def count(db: Session, where: Optional[Dict[str, Any]] = None) -> int:
    conditions = []

    if where is None:
        return db.query(Goal).count()

    for key, value in where.items():
        attr = getattr(Goal, key)
        if isinstance(value, (list, tuple, set)):
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)

    stmt = select(func.count()).select_from(Goal)
    if conditions:
        stmt = stmt.where(and_(*conditions))

    compiled = stmt.compile(dialect=postgresql.dialect(),
                            compile_kwargs={"literal_binds": True})
    logger.info("SQL QUERY:\n%s", compiled)

    return db.execute(stmt).scalar_one()


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
    db_goal.deadline = goal.deadline
    db_goal.target = goal.target
    db_goal.completed = goal.completed

    db.commit()
    db.refresh(db_goal)

    return db_goal


def delete(db: Session, goal: GoalSchema):
    db.execute(sqlalchemy_delete(Goal).where(Goal.id == goal.id))
    db.commit()
