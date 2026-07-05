from typing import List
import uuid
from pydantic import BaseModel, ConfigDict
from schema.base_schema import (
    SchemaModel,
    Pagination
)


# Pydantic schema for Goal
class DepositSchema(SchemaModel):
    id: uuid.UUID
    amount: int
    note: str | None = None
    goal_id: uuid.UUID

    model_config = ConfigDict(from_attributes=True)


class DepositPaginationSchema(Pagination):
    data: List[DepositSchema] = []
    sum: int = 0


class DepositCreateSchema(BaseModel):
    amount: int
    note: str | None = None
    goal_id: uuid.UUID


class DepositGetTotalSchema(BaseModel):
    goals: List[uuid.UUID]
