from typing import List, Protocol
from uuid import UUID

from sqlalchemy.sql.elements import ColumnElement

from schema.deposit_schema import DepositCreateSchema, DepositSchema


class DepositRepositoryProtocol(Protocol):
    def get(self, deposit_id: UUID) -> DepositSchema | None:
        ...

    def fetch(self, where: list[ColumnElement[bool]] | None = None,
              *, page: int = 1, limit: int = 10,) -> List[DepositSchema]:
        ...

    def add(self, deposit: DepositCreateSchema) -> DepositSchema:
        ...

    def count(self, where: list[ColumnElement[bool]] | None = None) -> int:
        ...

    def total(self, where: list[ColumnElement[bool]] | None = None) -> int:
        ...
