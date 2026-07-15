from __future__ import annotations
from datetime import datetime
from typing import Optional
from sqlalchemy import (
    UUID,
    Boolean,
    Text,
    BigInteger,
    DateTime,
    ForeignKey,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid
from models.base import Base


class GoalRow(Base):
    __tablename__ = "goals"
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    name: Mapped[str] = mapped_column(
        Text, unique=True, index=True, nullable=False)
    target: Mapped[int] = mapped_column(BigInteger)
    active: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default='true')
    completed: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default='false')
    deadline: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    deposits: Mapped[list["DepositRow"]] = relationship(
        back_populates="goal",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class DepositRow(Base):
    __tablename__ = "deposits"
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        server_default=text("gen_random_uuid()"),
    )
    amount: Mapped[int] = mapped_column(BigInteger)
    note: Mapped[str | None] = mapped_column(
        Text, nullable=True)
    goal_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("goals.id", ondelete="CASCADE"),
        nullable=False,
    )
    goal: Mapped["GoalRow"] = relationship(back_populates="deposits")
