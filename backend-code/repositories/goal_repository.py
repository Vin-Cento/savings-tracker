from typing import Any, Dict, List, Optional
import uuid

from fastapi import HTTPException, status
from sqlalchemy import Row, func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql import and_

from models.models import DepositRow, GoalRow
from schema.goal_schema import GoalCreateSchema, GoalSchema, GoalUpdateSchema
from sqlalchemy import delete as sqlalchemy_delete
from core.logging import logging
from sqlalchemy.dialects import postgresql

logger = logging.getLogger("goal repo")


def get(db: Session, goal_id: uuid.UUID) -> GoalSchema:
    row = (
        db.query(
            GoalRow.id.label("id"),
            GoalRow.name.label("name"),
            GoalRow.target.label("target"),
            GoalRow.active.label("active"),
            GoalRow.completed.label("completed"),
            func.coalesce(func.sum(DepositRow.amount), 0).label("amount"),
            GoalRow.deadline.label("deadline"),
            GoalRow.createdAt.label("createdAt"),
        )
        .outerjoin(DepositRow, DepositRow.goal_id == GoalRow.id)
        .filter(GoalRow.id == goal_id)
        .group_by(GoalRow.id)
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
            GoalRow.id.label("id"),
            GoalRow.name.label("name"),
            GoalRow.target.label("target"),
            GoalRow.active.label("active"),
            GoalRow.completed.label("completed"),
            func.coalesce(func.sum(DepositRow.amount), 0).label("amount"),
            GoalRow.deadline.label("deadline"),
            GoalRow.createdAt.label("createdAt"),
        )
        .outerjoin(DepositRow, DepositRow.goal_id == GoalRow.id)
        .group_by(GoalRow.id)
        .order_by(GoalRow.createdAt.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )
    result = [GoalSchema.model_validate(r) for r in rows]
    return result


def count(db: Session, where: Optional[Dict[str, Any]] = None) -> int:
    conditions = []

    if where is None:
        return db.query(GoalRow).count()

    for key, value in where.items():
        attr = getattr(GoalRow, key)
        if isinstance(value, (list, tuple, set)):
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)

    stmt = select(func.count()).select_from(GoalRow)
    if conditions:
        stmt = stmt.where(and_(*conditions))

    compiled = stmt.compile(dialect=postgresql.dialect(),
                            compile_kwargs={"literal_binds": True})
    logger.info("SQL QUERY:\n%s", compiled)

    return db.execute(stmt).scalar_one()


def create(db: Session, goal: GoalCreateSchema):
    new_goal = GoalRow(
        name=goal.name,
        target=goal.target,
        deadline=goal.deadline,
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


def update(db: Session, goal: GoalUpdateSchema):
    db_goal = db.get(GoalRow, goal.id)

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
    db.execute(sqlalchemy_delete(GoalRow).where(GoalRow.id == goal.id))
    db.commit()
