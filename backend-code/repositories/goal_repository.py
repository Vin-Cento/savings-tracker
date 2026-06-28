from typing import List, Optional

from sqlalchemy.orm import Session

from models.models import Goal
from schema.goal_schema import GoalCreateSchema


def get(db: Session, goal_id: int) -> Optional[Goal]:
    return db.query(Goal).filter(Goal.id == goal_id).first()


def count(active: bool, db: Session) -> int:
    return db.query(Goal).filter(Goal.active == active).count()


def list(db: Session, page: int, limit: int) -> List[Goal]:
    return (
        db.query(Goal)
        .order_by(Goal.createdAt.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )


def create(db: Session, goal: GoalCreateSchema):
    new_goal = Goal(
        name=goal.name,
        target=goal.target,
        deadline=goal.deadline,
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


def update(db: Session, existing_goal: Goal, goal: GoalCreateSchema):
    existing_goal.name = goal.name
    existing_goal.target = goal.target
    existing_goal.deadline = goal.deadline

    db.commit()
    db.refresh(existing_goal)

    return existing_goal


def delete(db: Session, goal: Goal):
    db.delete(goal)
    db.commit()
