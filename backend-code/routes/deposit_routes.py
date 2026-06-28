from typing import List, Optional
from fastapi import APIRouter, Body, Depends, Query, status
from sqlalchemy.orm import Session
from datetime import datetime
from sys import maxsize
from database import get_db
from schema.deposit_schema import (DepositCreateSchema,
                                   DepositPaginationSchema,
                                   DepositSchema)
from services import deposit_service

router = APIRouter(
    prefix="/deposit",
    tags=["deposit"],
)


@router.get("/{id}", response_model=DepositSchema)
def get(id: int, db: Session = Depends(get_db)):
    return deposit_service.get_deposit(db, id)


@router.post("/add", response_model=DepositSchema)
def add(deposit: DepositCreateSchema, db: Session = Depends(get_db)):
    return deposit_service.add_deposit(db, deposit)


@router.post("", response_model=DepositPaginationSchema)
def list(id: List[int] = Body(default=[]),
         page: int = Query(1, ge=1, le=maxsize),
         limit: int = Query(10, ge=1, le=maxsize),
         deposit_date: Optional[datetime] = datetime.min,
         db: Session = Depends(get_db)):
    return deposit_service.list_deposit(db, id, page, limit, deposit_date)


@router.post("/total", response_model=int)
def total(goals: List[int], db: Session = Depends(get_db)):
    return deposit_service.get_deposit_total(db, goals)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db)):
    return deposit_service.delete_deposit(db, id)
