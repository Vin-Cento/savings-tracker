from uuid import UUID
from repositories.goal_repository_protocol import GoalRepositoryProtocol
from schema.goal_schema import GoalCreateSchema, GoalPaginationSchema, GoalSchema


class GoalNotFoundError(Exception):
    pass


class GoalService:
    def __init__(self, repository: GoalRepositoryProtocol) -> None:
        self.repository = repository

    def add_goal(self, goal: GoalCreateSchema) -> GoalSchema:
        return self.repository.add(goal)

    def get_goal(self, goal_id: UUID) -> GoalSchema | None:
        goal = self.repository.get(goal_id)
        return goal

    def update_goal(self, goal: GoalCreateSchema) -> GoalSchema:
        return self.repository.add(goal)

    def list_goal(self, page, limit) -> GoalPaginationSchema:
        total = self.repository.count({})
        goals = self.repository.fetch(page=page, limit=limit)
        goals_schema = [GoalSchema.model_validate(item) for item in goals]
        return GoalPaginationSchema(
            total=total,
            page=page,
            limit=limit,
            data=goals_schema,
        )
