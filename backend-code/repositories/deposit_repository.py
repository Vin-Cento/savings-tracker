from typing import List, Optional

from sqlalchemy.orm import Session

from models.models import Deposit
from schema.deposit_schema import DepositCreateSchema, DepositSchema


def get(db: Session, goal_id: int) -> Optional[Deposit]:
    return db.query(Deposit).filter(Deposit.goal_id == goal_id).first()


def count(db: Session, goal_id: int) -> int:
    return db.query(Deposit).filter(Deposit.goal_id == goal_id).count()


def list(db: Session,
         goal_id: int,
         page: int,
         limit: int) -> List[Deposit]:
    return (
        db.query(Deposit)
        .filter(Deposit.goal_id == goal_id)
        .order_by(Deposit.createdAt.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )


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


def delete(db: Session, deposit: DepositSchema):
    db.delete(deposit)
    db.commit()
