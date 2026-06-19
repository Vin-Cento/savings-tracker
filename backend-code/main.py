from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models.models import Goal
from database import SessionLocal
from schema.goal_schema import GoalPaginationSchema, GoalSchema, GoalCreateSchema
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Dependency to get DB session

origins = [
    "http://localhost:5173",  # Vite React
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/goals/", response_model=GoalPaginationSchema)
async def list(db: Session = Depends(get_db)):
    total = db.query(Goal).count()
    goals = db.query(Goal).order_by(Goal.createdAt.desc()).all()
    return {"total": total, "data": goals}


@app.post("/goals/", response_model=GoalSchema,
          status_code=status.HTTP_201_CREATED)
def create(goal: GoalCreateSchema, db: Session = Depends(get_db)):
    if goal.id == -1:
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
    else:
        # Update existing goal
        existing_goal = db.query(Goal).filter(
            Goal.id == goal.id
        ).first()

        if not existing_goal:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Goal {goal.id} not found"
            )

        existing_goal.name = goal.name
        existing_goal.target = goal.target
        existing_goal.deadline = goal.deadline

        db.commit()
        db.refresh(existing_goal)
        new_goal = existing_goal

    return new_goal


@app.delete("/goals/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete(id: int, db: Session = Depends(get_db)):
    goal = db.query(Goal).filter(Goal.id == id).first()
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Goal with id {id} not found"
        )
    db.delete(goal)
    db.commit()
    return None
