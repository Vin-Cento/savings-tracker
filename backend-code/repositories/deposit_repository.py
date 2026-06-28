from typing import Any, Dict, Optional, Sequence
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, select
from models.models import Deposit
from schema.deposit_schema import DepositCreateSchema


def get(db: Session, where: Dict[str, Any]) -> Optional[Deposit]:
    conditions = []
    for key, value in where.items():
        attr = getattr(Deposit, key)
        if isinstance(value, (list, tuple, set)):  # type: ignore
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)
    if conditions:
        stmt = select(Deposit).where(and_(*conditions))
    else:
        stmt = select(Deposit)
    result = db.execute(stmt).scalars().first()
    return result


def count(db: Session, where: Dict[str, Any]) -> int:
    conditions = []
    for key, value in where.items():
        attr = getattr(Deposit, key)
        if isinstance(value, (list, tuple, set)):  # type: ignore
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)
    if conditions:
        stmt = select(func.count()).where(and_(*conditions))
    else:
        stmt = select(func.count())
    result = db.execute(stmt).scalar_one()
    return result


def total(db: Session, where: Dict[str, Any]) -> int:
    conditions = []
    for key, value in where.items():
        attr = getattr(Deposit, key)
        if isinstance(value, (list, tuple, set)):  # type: ignore
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)
    if conditions:
        stmt = select(func.sum(Deposit.amount)).where(and_(*conditions))
    else:
        stmt = select(func.sum(Deposit.amount))
    result = db.execute(stmt).scalar_one()
    return result


def fetch(db: Session,
          where: Dict[str, Any],
          page: int,
          limit: int) -> Sequence[Deposit]:
    conditions = []
    for key, value in where.items():
        attr = getattr(Deposit, key)
        if isinstance(value, (list, tuple, set)):  # type: ignore
            if len(value) == 0:
                continue
            conditions.append(attr.in_(value))
        else:
            conditions.append(attr == value)
    stmt = select(Deposit)
    if conditions:
        stmt = stmt.where(and_(*conditions))

    stmt = (stmt.order_by(Deposit.createdAt.desc())
            .offset((page - 1) * limit)
            .limit(limit))
    result = db.execute(stmt).scalars().all()
    return result


def add(db: Session, deposit: DepositCreateSchema):
    new_goal = Deposit(
        amount=deposit.amount,
        goal_id=deposit.goal_id,
        note=deposit.note
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


def delete(db: Session, deposit: Deposit):
    db.delete(deposit)
    db.commit()
