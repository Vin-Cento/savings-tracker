from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    Boolean,
    Text,
    BigInteger,
    DateTime,
    ForeignKey,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


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
    active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default='true')
    deadline: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    deposits: Mapped[list["Deposit"]] = relationship(
        back_populates="goal",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class Deposit(Base):
    __tablename__ = "deposits"
    id: Mapped[int] = mapped_column(primary_key=True)
    amount: Mapped[int] = mapped_column(BigInteger)
    note: Mapped[str | None] = mapped_column(
        Text, nullable=True)
    goal_id: Mapped[int] = mapped_column(
        ForeignKey("goals.id", ondelete="CASCADE"),
        nullable=False,
    )
    goal: Mapped["Goal"] = relationship(back_populates="deposits")
