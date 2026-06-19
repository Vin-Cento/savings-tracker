from datetime import datetime
from typing import List
from pydantic import BaseModel


class Pagination(BaseModel):
    total: int


class SchemaModel(BaseModel):
    createdAt: datetime


# Pydantic schema for Goal
class GoalSchema(SchemaModel):
    id: int
    name: str
    target: int
    active: bool
    deadline: datetime

    class Config:
        orm_mode = True


class GoalPaginationSchema(Pagination):
    data: List[GoalSchema]


class GoalCreateSchema(BaseModel):
    id: int
    name: str
    target: int
    deadline: datetime
