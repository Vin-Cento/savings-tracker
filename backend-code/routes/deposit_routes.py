from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from database import get_db
from schema.deposit_schema import (DepositCreateSchema, DepositGetTotalSchema,
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


@router.get("/goal/{id}", response_model=DepositPaginationSchema)
def list(id: int,
         page: int = Query(1, ge=0),
         limit: int = Query(10, ge=0, le=100000),
         db: Session = Depends(get_db)):
    return deposit_service.list_deposit(db, id, page, limit)


@router.post("", response_model=DepositSchema)
def add(deposit: DepositCreateSchema, db: Session = Depends(get_db)):
    return deposit_service.add_deposit(db, deposit)


@router.get("/total", response_model=int)
def total(depositSumBody: DepositGetTotalSchema,
          db: Session = Depends(get_db)):
    return deposit_service.get_deposit_total(db, depositSumBody)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db)):
    return deposit_service.delete_deposit(db, id)
