from dataclasses import dataclass
from datetime import datetime
from typing import Optional
from uuid import UUID


@dataclass(frozen=True, slots=True)
class Goal:
    id: UUID
    name: str
    target: int
    amount: int
    createdAt: datetime = datetime.now()
    deadline: Optional[datetime] = None
    active: bool = True
    completed: bool = False
