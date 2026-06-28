from typing import List

from fastapi import status, HTTPException
from sqlalchemy.orm import Session
from repositories import deposit_repository
from schema.deposit_schema import (DepositCreateSchema,
                                   DepositPaginationSchema,
                                   DepositSchema)


def get_deposit(db: Session, id: int):
    deposit = deposit_repository.get(db, {"goal_id": id})
    return deposit


def get_deposit_total(db: Session,
                      goals: List[int]) -> int:
    sum = deposit_repository.total(db, {"goal_id": goals})
    return sum


def list_deposit(db: Session,
                 goal_id: List[int],
                 page: int,
                 limit: int) -> DepositPaginationSchema:
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


def add_deposit(db: Session, deposit: DepositCreateSchema):
    return deposit_repository.add(db, deposit)


def delete_deposit(db: Session, id: int):
    deposit = deposit_repository.get(db, {"id": id})
    if not deposit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deposit not found",
        )
    deposit_repository.delete(db, deposit)
