from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from models.models import Goal
from database import SessionLocal

app = FastAPI()

# Dependency to get DB session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/goals/", response_model=List[GoalSchema])
async def get_goals(db: Session = Depends(get_db)):
    goals = db.query(Goal).all()
    return goals


@app.post("/goals/", response_model=GoalSchema,
          status_code=status.HTTP_201_CREATED)
def create_goal(goal: GoalCreateSchema, db: Session = Depends(get_db)):
    existing_goal = db.query(Goal).filter(Goal.name == goal.name).first()
    if existing_goal:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Goal with name '{goal.name}' already exists."
        )
    new_goal = Goal(name=goal.name, target=goal.target)
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal
