from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from models.models import Deposit
from repositories import deposit_repository
from schema.deposit_schema import (DepositCreateSchema,
                                   DepositPaginationSchema,
                                   DepositSchema)


def get_deposit(db: Session, id: int):
    deposit = deposit_repository.get(db, id)

    if not deposit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deposit not found",
        )

    return deposit


def get_deposit_total(db: Session, goal_id: int) -> int:
    deposits = list_deposit(db, goal_id, 1, 10000)
    sum = 0

    for deposit in deposits.data:
        sum += deposit.amount

    return sum


def list_deposit(db: Session,
                 goal_id: int,
                 page: int,
                 limit: int) -> DepositPaginationSchema:
    total = deposit_repository.count(db, goal_id)
    deposits = deposit_repository.list(
        db, goal_id, page, limit)

    deposit_schemas = [DepositSchema.model_validate(item) for item in deposits]
    if not deposits:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Deposit not found",
        )

    return DepositPaginationSchema(
        total=total,
        page=page,
        limit=limit,
        data=deposit_schemas
    )


def add_deposit(db: Session, deposit: DepositCreateSchema):
    return deposit_repository.add(db, deposit)


def delete_deposit(db: Session, id: int):
    pass
