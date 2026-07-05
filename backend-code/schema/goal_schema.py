from datetime import datetime
from typing import List, Optional
import uuid
from pydantic import BaseModel, ConfigDict
from schema.base_schema import (
    SchemaModel,
    Pagination
)


# Pydantic schema for Goal
class GoalSchema(SchemaModel):
    id: uuid.UUID
    name: str
    target: int
    active: bool
    amount: int
    deadline: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class GoalPaginationSchema(Pagination):
    data: List[GoalSchema]


class GoalCreateSchema(BaseModel):
    id: uuid.UUID
    name: str
    target: int
    active: Optional[bool] = True
    amount: int = 0
    deadline: Optional[datetime] = None
