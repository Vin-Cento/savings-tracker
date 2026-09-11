from typing import List, Protocol
from uuid import UUID

from sqlalchemy.sql.elements import ColumnElement

from schema.goal_schema import GoalCreateSchema, GoalSchema, GoalUpdateSchema


class GoalRepositoryProtocol(Protocol):
    def get(self, goal_id: UUID) -> GoalSchema | None:
        ...

    def fetch(
            self,
            where: list[ColumnElement[bool]] | None = None, *,
            page: int = 1,
            limit: int = 10,
            sort_by: str = 'createdAt',
            sort_order: str = 'desc',
    ) -> List[GoalSchema]:
        ...

    def add(self, goal: GoalCreateSchema) -> GoalSchema:
        ...

    def delete(self, goal_id: UUID) -> bool:
        ...

    def update(self, goal: GoalUpdateSchema) -> GoalSchema | None:
        ...

    def count(self, where: list[ColumnElement[bool]] | None = None) -> int:
        ...
