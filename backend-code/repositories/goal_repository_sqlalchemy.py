from operator import and_
from typing import Any, Dict, List, Optional
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from domain.goal import Goal
from models.models import DepositRow, GoalRow
from schema.goal_schema import GoalCreateSchema, GoalSchema


class GoalRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, goal_id: UUID) -> GoalSchema | None:
        row = (
            self.session.query(
                GoalRow.id.label("id"),
                GoalRow.name.label("name"),
                GoalRow.target.label("target"),
                GoalRow.active.label("active"),
                GoalRow.completed.label("completed"),
                func.coalesce(func.sum(DepositRow.amount), 0).label("amount"),
                GoalRow.deadline.label("deadline"),
                GoalRow.createdAt.label("createdAt"),
            )
            .outerjoin(DepositRow, DepositRow.goal_id == GoalRow.id)
            .filter(GoalRow.id == goal_id)
            .group_by(GoalRow.id)
            .first()
        )
        if row is None:
            return None

        return GoalSchema.model_validate(row._mapping)

    def fetch(self, page: int, limit: int) -> List[GoalSchema]:
        goal_rows = (
            self.session.query(
                GoalRow.id.label("id"),
                GoalRow.name.label("name"),
                GoalRow.target.label("target"),
                GoalRow.active.label("active"),
                GoalRow.completed.label("completed"),
                func.coalesce(func.sum(DepositRow.amount), 0).label("amount"),
                GoalRow.deadline.label("deadline"),
                GoalRow.createdAt.label("createdAt"),
            )
            .outerjoin(DepositRow, DepositRow.goal_id == GoalRow.id)
            .group_by(GoalRow.id)
            .order_by(GoalRow.createdAt.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )
        return [GoalSchema.model_validate(goal_row) for goal_row in goal_rows]

    def add(self, goal: GoalCreateSchema) -> GoalSchema:
        row = GoalRow(
            name=goal.name,
            target=goal.target,
            active=goal.active,
        )

        self.session.add(row)
        self.session.flush()
        return GoalSchema(
            id=row.id,
            name=row.name,
            active=row.active,
            completed=row.completed,
            target=row.target,
            createdAt=row.createdAt,
            amount=0
        )

    def delete(self, goal_id: UUID) -> bool:
        row = self.session.get(GoalRow, goal_id)

        if row is None:
            return False

        self.session.delete(row)
        self.session.flush()

        return True

    def update(self, goal: Goal) -> GoalSchema | None:
        goal_row = self.session.get(GoalRow, goal.id)

        if goal_row is None:
            return None

        goal_row.name = goal.name
        goal_row.target = goal.target
        goal_row.active = goal.active
        goal_row.deadline = goal.deadline
        goal_row.completed = goal.completed

        self.session.flush()
        return self.get(goal.id)

    def count(self, where: Optional[Dict[str, Any]] = None) -> int:
        conditions = []
        if where is None:
            return self.session.query(GoalRow).count()

        for key, value in where.items():
            attr = getattr(GoalRow, key)
            if isinstance(value, (list, tuple, set)):
                conditions.append(attr.in_(value))
            else:
                conditions.append(attr == value)

        stmt = select(func.count()).select_from(GoalRow)
        if conditions:
            stmt = stmt.where(and_(*conditions))

        return self.session.execute(stmt).scalar_one()
