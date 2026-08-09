from typing import List, Optional
import uuid
from fastapi import APIRouter, Query
from sqlalchemy import ColumnElement
from datetime import datetime
from sys import maxsize
from core.dependencies import DepositServiceDependency
from models.models import DepositRow
from schema.deposit_schema import (DepositCreateSchema,
                                   DepositPaginationSchema,
                                   DepositSchema)
router = APIRouter(
    prefix="/deposit",
    tags=["deposit"],
)


@router.get("/{id}", response_model=DepositSchema, operation_id='getDeposit')
def get(id: uuid.UUID, service: DepositServiceDependency):
    return service.get_deposit(id)


@router.post("/add", response_model=DepositSchema, operation_id='addDeposit')
def add(deposit: DepositCreateSchema,
        service: DepositServiceDependency,
        ) -> DepositSchema:
    res = service.add_deposit(deposit)
    return DepositSchema(id=res.id, amount=res.amount, note=res.note,
                         goal_id=res.goal_id, createdAt=res.createdAt)


@router.get("", response_model=DepositPaginationSchema,
            operation_id='fetchDeposits')
def fetch_deposit(
    service: DepositServiceDependency,
    goal_id: List[uuid.UUID] = Query(default=[]),
    page: int = Query(1, ge=1, le=maxsize),
    limit: int = Query(10, ge=1, le=maxsize),
    deposit_date: Optional[datetime] = datetime.min,
):
    where: list[ColumnElement[bool]] = []
    if goal_id != []:
        where.append(DepositRow.goal_id.in_(goal_id))
    if deposit_date != None:
        where.append(DepositRow.createdAt >= deposit_date)
    return service.list_deposit(where=where, page=page, limit=limit)


@router.post("/total", response_model=int, operation_id="totalDeposit")
def total(
    service: DepositServiceDependency,
    goals: List[uuid.UUID] = Query(default=[]),
):
    where: list[ColumnElement[bool]] = []
    if goals != []:
        where.append(DepositRow.goal_id.in_(goals))
    return service.total_deposit(where)
