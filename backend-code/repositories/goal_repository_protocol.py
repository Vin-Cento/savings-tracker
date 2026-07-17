from typing import List, Optional, Protocol
from uuid import UUID

from sqlalchemy.sql.elements import ColumnElement

from domain.goal import Goal
from schema.goal_schema import GoalCreateSchema, GoalSchema


class GoalRepositoryProtocol(Protocol):
    def get(self, goal_id: UUID) -> GoalSchema | None:
        ...

    def fetch( self, where: ColumnElement[bool] | None = None,
        *, page: int = 1, limit: int = 10,) -> List[GoalSchema]:
        ...

    def add(self, goal: GoalCreateSchema) -> GoalSchema:
        ...

    def delete(self, goal_id: UUID) -> bool:
        ...

    def update(self, goal: Goal) -> GoalSchema | None:
        ...

    def count(self, where: Optional[ColumnElement[bool]] = None) -> int:
        ...
