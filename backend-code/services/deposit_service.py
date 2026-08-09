from datetime import datetime
from typing import List, Optional
import uuid

from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from core.dependencies import GoalServiceDependency
from repositories import deposit_repository
from schema.deposit_schema import (DepositCreateSchema,
                                   DepositPaginationSchema,
                                   DepositSchema)
from schema.goal_schema import GoalUpdateSchema


def get_deposit(db: Session, id: uuid.UUID):
    deposit = deposit_repository.get(db, {"goal_id": id})
    return deposit


def get_deposit_total(db: Session,
                      goals: List[int]) -> int:
    sum = deposit_repository.total(db, {"goal_id": goals})
    return sum


def list_deposit(db: Session,
                 goal_id: List[uuid.UUID],
                 page: int,
                 limit: int,
                 deposit_date: Optional[datetime] = datetime.min,
                 ) -> DepositPaginationSchema:
    sum = 0
    total = deposit_repository.count(db, {"goal_id": goal_id})
    deposits = deposit_repository.fetch(
        db, {"goal_id": goal_id}, page, limit)

    deposit_schemas = [DepositSchema.model_validate(item) for item in deposits]

    for deposit in deposits:
        sum += deposit.amount

    return DepositPaginationSchema(
        total=total,
        sum=sum,
        page=page,
        limit=limit,
        data=deposit_schemas
    )


def add_deposit(db: Session, deposit: DepositCreateSchema, goal_service: GoalServiceDependency):
    goal = goal_service.get_goal(deposit.goal_id)
    if goal is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal Not Found",
        )
    remaining = goal.target - goal.amount - deposit.amount
    if remaining > 0:
        res = deposit_repository.add(db, deposit)
    else:
        goal_schema = (
            GoalUpdateSchema(
                id=goal.id,
                name=goal.name,
                target=goal.target,
                completed=True
            )
        )
        goal_service.update_goal(goal_schema)
        # remainder is always negative so we are adding
        deposit.amount = deposit.amount + remaining
        res = deposit_repository.add(db, deposit)
    return res


def delete_deposit(db: Session, id: int):
    deposit = deposit_repository.get(db, {"id": id})
    if not deposit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deposit not found",
        )
    deposit_repository.delete(db, deposit)
