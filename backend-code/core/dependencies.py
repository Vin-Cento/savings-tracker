from typing import Annotated
from database import get_session
from fastapi import Depends
from sqlalchemy.orm import Session
from repositories.deposit_repository_protocol import DepositRepositoryProtocol
from repositories.deposit_repository import DepositRepository
from repositories.goal_repository_protocol import GoalRepositoryProtocol
from repositories.goal_repository import GoalRepository
from services.deposit_service_class import DepositService
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


def get_deposit_repository(
    db: DatabaseSession,
) -> DepositRepositoryProtocol:
    return DepositRepository(db)


DepositRepositoryDependency = Annotated[
    DepositRepositoryProtocol,
    Depends(get_deposit_repository),
]


def get_deposit_service(
    deposit_repository: DepositRepositoryDependency,
    goal_repository: GoalRepositoryDependency,
) -> DepositService:
    return DepositService(deposit_repository, goal_repository)


DepositServiceDependency = Annotated[
    DepositService,
    Depends(get_deposit_service),
]
