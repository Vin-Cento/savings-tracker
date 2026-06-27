from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.models import Deposit
from schema.deposit_schema import DepositCreateSchema, DepositSchema


def get(db: Session, goal_id: int) -> Optional[Deposit]:
    return db.query(Deposit).filter(Deposit.goal_id == goal_id).first()


def count(db: Session, goal_id: int) -> int:
    if goal_id == -1:
        return db.query(Deposit).count()
    return db.query(Deposit).filter(Deposit.goal_id == goal_id).count()


def sum(db: Session, goal_id: List[int]) -> int:
    if goal_id == []:
        total = db.query(func.sum(Deposit.amount)).scalar()
    else:
        total = db.query(func.sum(Deposit.amount)).filter(
            Deposit.goal_id.in_(goal_id)).scalar()
    return total or 0


def list(db: Session,
         goal_id: int,
         page: int,
         limit: int) -> List[Deposit]:
    if goal_id == -1:
        return (
            db.query(Deposit)
            .order_by(Deposit.createdAt.desc())
            .all()
        )
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
