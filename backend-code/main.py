from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from models.models import Goal
from database import SessionLocal
from schema.goal_schema import GoalSchema, GoalCreateSchema

app = FastAPI()

# Dependency to get DB session


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


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


@app.delete("/goals/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(goal_id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal with id {goal_id} not found"
        )
    db.delete(goal)
    db.commit()
    return None
