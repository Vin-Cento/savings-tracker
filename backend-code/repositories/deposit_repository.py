from typing import List
from uuid import UUID
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from sqlalchemy.sql.elements import ColumnElement
from models.models import DepositRow
from schema.deposit_schema import DepositCreateSchema, DepositSchema


class DepositRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get(self, deposit_id: UUID) -> DepositSchema | None:
        row = (
            self.session.query(
                DepositRow.id.label("id"),
                DepositRow.amount.label("amount"),
                DepositRow.goal_id.label("goal_id"),
                DepositRow.createdAt.label("createdAt"),
            )
            .filter(DepositRow.id == deposit_id)
            .group_by(DepositRow.id)
            .first()
        )
        if row is None:
            return None

        return DepositSchema.model_validate(row._mapping)

    def fetch(self,
              where: list[ColumnElement[bool]] | None = None,
              *, page: int = 1, limit: int = 10
              ) -> List[DepositSchema]:
        stmt = (
            self.session.query(
                DepositRow.id.label("id"),
                DepositRow.amount.label("amount"),
                DepositRow.goal_id.label("goal_id"),
                DepositRow.createdAt.label("createdAt"),
            )
        )

        if where is not None:
            stmt = stmt.filter(*where)

        deposit_rows = (
            stmt
            .order_by(DepositRow.createdAt.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        return [
            DepositSchema.model_validate(deposit_row)
            for deposit_row in deposit_rows
        ]

    def add(self, deposit: DepositCreateSchema) -> DepositSchema:
        row = DepositRow(
            amount=deposit.amount,
            note=deposit.note,
            goal_id=deposit.goal_id,
        )

        self.session.add(row)
        self.session.commit()
        self.session.refresh(row)
        return DepositSchema(
            id=row.id, amount=row.amount, note=row.note,
            createdAt=row.createdAt, goal_id=row.goal_id,
        )

    def count(self, where: list[ColumnElement[bool]] | None = None) -> int:
        stmt = select(func.count()).select_from(DepositRow)
        if where is not None:
            stmt = stmt.filter(*where)
        return self.session.scalar(stmt) or 0

    def total(self, where: list[ColumnElement[bool]] | None = None) -> int:
        stmt = select(
            func.coalesce(func.sum(DepositRow.amount), 0).label("amount")
        ).select_from(DepositRow)
        if where is not None:
            stmt = stmt.filter(*where)
        return self.session.scalar(stmt) or 0
