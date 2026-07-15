from typing import Any, Dict, List, Optional, Protocol
from uuid import UUID

from domain.goal import Goal
from schema.goal_schema import GoalCreateSchema, GoalSchema


class GoalRepositoryProtocol(Protocol):
    def get(self, goal_id: UUID) -> GoalSchema | None:
        ...

    def fetch(self, page: int, limit: int) -> List[GoalSchema]:
        ...

    def add(self, goal: GoalCreateSchema) -> GoalSchema:
        ...

    def delete(self, goal_id: UUID) -> bool:
        ...

    def update(self, goal: Goal) -> GoalSchema | None:
        ...

    def count(self, where: Optional[Dict[str, Any]] = None) -> int:
        ...
