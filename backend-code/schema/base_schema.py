from datetime import datetime
from pydantic import BaseModel


class Pagination(BaseModel):
    total: int
    limit: int
    page: int


class SchemaModel(BaseModel):
    createdAt: datetime
