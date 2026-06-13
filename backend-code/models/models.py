from __future__ import annotations
from datetime import datetime
from sqlalchemy import (
    Boolean,
    Text,
    BigInteger,
    DateTime,
    ForeignKey,
    func,
    text,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    createdAt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )


class Goal(Base):
    __tablename__ = "goals"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(
        Text, unique=True, index=True, nullable=False)
    target: Mapped[int] = mapped_column(BigInteger)
    total: Mapped[int] = mapped_column(
        BigInteger, nullable=False, server_default="0")
    active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default='true')
    deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=text("(CURRENT_TIMESTAMP + INTERVAL '1 year')")
    )


class Deposit(Base):
    __tablename__ = "deposits"
    id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[int] = mapped_column(BigInteger)
    note: Mapped[str | None] = mapped_column(
        Text, unique=True, index=True, nullable=True)
    goal_id: Mapped[int] = mapped_column(ForeignKey("goals.id"))
