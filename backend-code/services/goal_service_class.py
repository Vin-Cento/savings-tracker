from typing import Any, Dict, Optional
from uuid import UUID

from sqlalchemy.sql.elements import ColumnElement
from repositories.goal_repository_protocol import GoalRepositoryProtocol
from schema.goal_schema import GoalCreateSchema, GoalPaginationSchema, GoalSchema, GoalUpdateSchema


class GoalNotFoundError(Exception):
    pass


class GoalService:
    def __init__(self, repository: GoalRepositoryProtocol) -> None:
        self.repository = repository

    def add_goal(self, goal: GoalCreateSchema) -> GoalSchema:
        return self.repository.add(goal)

    def count_goal(self, where: Optional[ColumnElement[bool]] = None) -> int:
        return self.repository.count(where)

    def get_goal(self, goal_id: UUID) -> GoalSchema | None:
        return self.repository.get(goal_id)

    def update_goal(self, goal: GoalUpdateSchema) -> GoalSchema | None:
        return self.repository.update(goal)

    def delete_goal(self, goal_id: UUID)-> bool:
        return self.repository.delete(goal_id)

    def list_goal(
        self,
        where: ColumnElement[bool] | None = None,
        *,
        page: int = 1,
        limit: int = 10,
    ) -> GoalPaginationSchema:
        goals = self.repository.fetch(
            where=where,
            page=page,
            limit=limit,
        )
        total = self.repository.count(where)
        return GoalPaginationSchema(
            data=goals,
            total=total,
            page=page,
            limit=limit,
        )
