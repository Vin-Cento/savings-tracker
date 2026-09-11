from uuid import UUID

from sqlalchemy.sql.elements import ColumnElement
from repositories.goal_repository_protocol import GoalRepositoryProtocol
from schema.goal_schema import (
    GoalCreateSchema, GoalPaginationSchema,
    GoalSchema, GoalUpdateSchema
)


class GoalNotFoundError(Exception):
    pass


class GoalService:
    def __init__(self, repository: GoalRepositoryProtocol) -> None:
        self.repository = repository

    def add_goal(self, goal: GoalCreateSchema) -> GoalSchema:
        return self.repository.add(goal)

    def count_goal(self,
                   where: list[ColumnElement[bool]] | None = None) -> int:
        return self.repository.count(where)

    def get_goal(self, goal_id: UUID) -> GoalSchema | None:
        return self.repository.get(goal_id)

    def update_goal(self, goal: GoalUpdateSchema) -> GoalSchema | None:
        return self.repository.update(goal)

    def delete_goal(self, goal_id: UUID) -> bool:
        return self.repository.delete(goal_id)

    def list_goal(
        self,
        where: list[ColumnElement[bool]] | None = None,
        *,
        page: int = 1,
        limit: int = 10,
        sort_by: str = "createdAt",
        sort_order: str = "desc",
    ) -> GoalPaginationSchema:
        goals = self.repository.fetch(
            where=where,
            page=page,
            limit=limit,
            sort_by=sort_by,
            sort_order=sort_order,
        )
        total = self.repository.count(where)
        return GoalPaginationSchema(
            data=goals,
            total=total,
            page=page,
            limit=limit,
        )
