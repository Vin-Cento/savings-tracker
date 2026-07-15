from typing import Annotated
from database import get_session
from fastapi import Depends
from sqlalchemy.orm import Session
from repositories.goal_repository_protocol import GoalRepositoryProtocol
from repositories.goal_repository_sqlalchemy import GoalRepository
from services.goal_service_class import GoalService

DatabaseSession = Annotated[
    Session,
    Depends(get_session),
]


def get_goal_repository(
    db: DatabaseSession,
) -> GoalRepositoryProtocol:
    return GoalRepository(db)


GoalRepositoryDependency = Annotated[
    GoalRepositoryProtocol,
    Depends(get_goal_repository),
]


def get_goal_service(
    repository: GoalRepositoryDependency,
) -> GoalService:
    return GoalService(repository)


GoalServiceDependency = Annotated[
    GoalService,
    Depends(get_goal_service),
]
