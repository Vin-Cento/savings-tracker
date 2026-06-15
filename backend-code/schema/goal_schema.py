from datetime import datetime
from pydantic import BaseModel


class SchemaModel(BaseModel):
    createdAt: datetime


# Pydantic schema for Goal
class GoalSchema(SchemaModel):
    id: int
    name: str
    target: int
    total: int
    active: bool
    deadline: datetime

    class Config:
        orm_mode = True


class GoalCreateSchema(BaseModel):
    name: str
    target: int
