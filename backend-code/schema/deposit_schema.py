from typing import List
from pydantic import BaseModel
from schema.base_schema import (
    SchemaModel,
    Pagination
)


# Pydantic schema for Goal
class DepositSchema(SchemaModel):
    id: int
    amount: int
    note: str
    goal_id: int

    class Config:
        from_attributes = True


class DepositPaginationSchema(Pagination):
    data: List[DepositSchema] = []
    sum: int = 0


class DepositCreateSchema(BaseModel):
    amount: int
    note: str | None = None
    goal_id: int


class DepositGetTotalSchema(BaseModel):
    goals: List[int]
