from typing import Any, Dict, Optional, Sequence
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, select
from models.models import DepositRow
from schema.deposit_schema import DepositCreateSchema
from core.logging import logging
from sqlalchemy.dialects import postgresql

logger = logging.getLogger("deposit repo")


def get(db: Session, where: Dict[str, Any]) -> Optional[DepositRow]:
    conditions = []
    for key, value in where.items():
        attr = getattr(DepositRow, key)
        if isinstance(value, (list, tuple, set)):  # type: ignore
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)
    if conditions:
        stmt = select(DepositRow).where(and_(*conditions))
    else:
        stmt = select(DepositRow)
    result = db.execute(stmt).scalars().first()
    return result


def count(db: Session, where: Dict[str, Any]) -> int:
    conditions = []
    for key, value in where.items():
        attr = getattr(DepositRow, key)
        if isinstance(value, (list, tuple, set)):
            if len(value) == 0:
                continue
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)

    stmt = select(func.count()).select_from(DepositRow)
    if conditions:
        stmt = stmt.where(and_(*conditions))

    compiled = stmt.compile(dialect=postgresql.dialect(),
                            compile_kwargs={"literal_binds": True})
    logger.info("SQL QUERY:\n%s", compiled)
    return db.execute(stmt).scalar_one()


def total(db: Session, where: Dict[str, Any]) -> int:
    conditions = []
    for key, value in where.items():
        attr = getattr(DepositRow, key)
        if isinstance(value, (list, tuple, set)):  # type: ignore
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)
    if conditions:
        stmt = select(func.sum(DepositRow.amount)).where(and_(*conditions))
    else:
        stmt = select(func.sum(DepositRow.amount))
    result = db.execute(stmt).scalar_one()
    return result


def fetch(db: Session,
          where: Dict[str, Any],
          page: int,
          limit: int) -> Sequence[DepositRow]:
    conditions = []
    for key, value in where.items():
        attr = getattr(DepositRow, key)
        if isinstance(value, (list, tuple, set)):
            if len(value) == 0:
                continue
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)
    stmt = select(DepositRow)
    if conditions:
        stmt = stmt.where(and_(*conditions))

    stmt = (stmt.order_by(DepositRow.createdAt.desc())
            .offset((page - 1) * limit)
            .limit(limit))
    compiled = stmt.compile(dialect=postgresql.dialect(),
                            compile_kwargs={"literal_binds": True})
    logger.info("SQL QUERY:\n%s", compiled)
    result = db.execute(stmt).scalars().all()
    return result


def add(db: Session, deposit: DepositCreateSchema):
    new_goal = DepositRow(
        amount=deposit.amount,
        goal_id=deposit.goal_id,
        note=deposit.note
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


def delete(db: Session, deposit: DepositRow):
    db.delete(deposit)
    db.commit()
