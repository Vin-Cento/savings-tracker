from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime
from sys import maxsize
from core.dependencies import GoalServiceDependency, get_session
from schema.deposit_schema import (DepositCreateSchema,
                                   DepositPaginationSchema,
                                   DepositSchema)
from services import deposit_service

router = APIRouter(
    prefix="/deposit",
    tags=["deposit"],
)


@router.get("/{id}", response_model=DepositSchema, operation_id='getDeposit')
def get(id: uuid.UUID, session: Session = Depends(get_session)):
    return deposit_service.get_deposit(session, id)


@router.post("/add", response_model=DepositSchema, operation_id='addDeposit')
def add(deposit: DepositCreateSchema,
        goal_service: GoalServiceDependency,
        session: Session = Depends(get_session),
        ) -> DepositSchema:
    res = deposit_service.add_deposit(session, deposit, goal_service)
    return DepositSchema(id=res.id, amount=res.amount, note=res.note,
                         goal_id=res.goal_id, createdAt=res.createdAt)


@router.get("", response_model=DepositPaginationSchema,
            operation_id='fetchDeposits')
def list(goal_id: List[uuid.UUID] = Query(default=[]),
         page: int = Query(1, ge=1, le=maxsize),
         limit: int = Query(10, ge=1, le=maxsize),
         deposit_date: Optional[datetime] = datetime.min,
         session: Session = Depends(get_session)):
    return deposit_service.list_deposit(session, goal_id, page, limit,
                                        deposit_date)


@router.post("/total", response_model=int, operation_id="totalDeposit")
def total(goals: List[int], session: Session = Depends(get_session)):
    return deposit_service.get_deposit_total(session, goals)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT,
               operation_id="deleteDeposit")
def delete(id: int, session: Session = Depends(get_session)):
    return deposit_service.delete_deposit(session, id)
