from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.sql.elements import ColumnElement
from repositories.deposit_repository_protocol import DepositRepositoryProtocol
from repositories.goal_repository_protocol import GoalRepositoryProtocol
from schema.deposit_schema import (
    DepositCreateSchema, DepositPaginationSchema,
    DepositSchema
)
from schema.goal_schema import GoalUpdateSchema


class DepositNotFoundError(Exception):
    pass


class DepositService:
    def __init__(
        self, deposit_repository: DepositRepositoryProtocol,
        goal_repository: GoalRepositoryProtocol
    ) -> None:
        self.deposit_repository = deposit_repository
        self.goal_repository = goal_repository

    def add_deposit(self, deposit: DepositCreateSchema) -> DepositSchema:
        goal = self.goal_repository.get(deposit.goal_id)
        if goal is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Goal Not Found",
            )
        remaining = goal.target - goal.amount - deposit.amount
        if remaining > 0:
            res = self.deposit_repository.add(deposit)
        else:
            goal_schema = (
                GoalUpdateSchema(
                    id=goal.id,
                    name=goal.name,
                    target=goal.target,
                    completed=True
                )
            )
            self.goal_repository.update(goal_schema)
            # remainder is always negative so we are adding
            deposit.amount = deposit.amount + remaining
            res = self.deposit_repository.add(deposit)
        return res

    def count_deposit(self, where: list[ColumnElement[bool]] | None = None) -> int:
        return self.deposit_repository.count(where)

    def get_deposit(self, deposit_id: UUID) -> DepositSchema | None:
        return self.deposit_repository.get(deposit_id)

    def total_deposit(self, where: list[ColumnElement[bool]] | None = None) -> int:
        return self.deposit_repository.total(where)

    def list_deposit(
        self,
        where: list[ColumnElement[bool]] | None = None,
        *,
        page: int = 1,
        limit: int = 10,
    ) -> DepositPaginationSchema:
        deposits = self.deposit_repository.fetch(
            where=where,
            page=page,
            limit=limit,
        )
        total = self.deposit_repository.count(where)
        sum = self.deposit_repository.total(where)
        return DepositPaginationSchema(
            data=deposits,
            total=total,
            sum=sum,
            page=page,
            limit=limit,
        )
