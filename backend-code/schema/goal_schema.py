from pydantic import BaseModel


# Pydantic schema for Goal
class GoalSchema(BaseModel):
    id: int
    name: str
    target: int

    class Config:
        orm_mode = True


class GoalCreateSchema(BaseModel):
    name: str
    target: int
