from typing import List
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import ColumnElement
from models.models import DepositRow, GoalRow
from schema.goal_schema import GoalCreateSchema, GoalSchema, GoalUpdateSchema
from typing import Literal

SortBy = Literal[
    "name",
    "target",
    "amount",
    "deadline",
    "createdAt",
]

SortOrder = Literal["asc", "desc"]


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

    def fetch(
        self,
        where: list[ColumnElement[bool]] | None = None, *,
        page: int = 1, limit: int = 10,
        sort_by: SortBy = "createdAt",
        sort_order: SortOrder = "desc",
    ) -> List[GoalSchema]:

        amount = func.coalesce(
            func.sum(DepositRow.amount), 0
        ).label("amount")

        stmt = (
            self.session.query(
                GoalRow.id.label("id"),
                GoalRow.name.label("name"),
                GoalRow.target.label("target"),
                GoalRow.active.label("active"),
                GoalRow.completed.label("completed"),
                amount,
                GoalRow.deadline.label("deadline"),
                GoalRow.createdAt.label("createdAt"),
            )
            .outerjoin(DepositRow, DepositRow.goal_id == GoalRow.id)
            .group_by(GoalRow.id)
        )

        if where is not None:
            stmt = stmt.filter(*where)

        sort_columns = {
            "name": GoalRow.name,
            "target": GoalRow.target,
            "amount": amount,
            "deadline": GoalRow.deadline,
            "createdAt": GoalRow.createdAt,
        }

        sort_column = sort_columns[sort_by]
        order_by = (
            sort_column.asc()
            if sort_order == "asc"
            else sort_column.desc()
        )

        goal_rows = (
            stmt
            .order_by(order_by)
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
        self.session.commit()
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
        self.session.commit()

        return True

    def update(self, goal: GoalUpdateSchema) -> GoalSchema | None:
        goal_row = self.session.get(GoalRow, goal.id)

        if goal_row is None:
            return None

        goal_row.name = goal.name
        goal_row.target = goal.target
        goal_row.active = goal.active
        goal_row.deadline = goal.deadline
        goal_row.completed = goal.completed

        self.session.commit()
        return self.get(goal.id)

    def count(self, where: list[ColumnElement[bool]] | None = None) -> int:
        stmt = select(func.count()).select_from(GoalRow)
        if where is not None:
            stmt = stmt.filter(*where)
        return self.session.scalar(stmt) or 0
