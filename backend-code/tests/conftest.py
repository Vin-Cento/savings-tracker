import pytest

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from core.dependencies import get_session
from models import Base
from repositories.goal_repository_sqlalchemy import GoalRepository
from services.goal_service_class import GoalService


DATABASE_URL = (
    "postgresql+psycopg2://servicer:password@localhost/savings_tracker_test")

engine = create_engine(
    DATABASE_URL,
    poolclass=StaticPool
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)

    session = TestingSessionLocal()

    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_session] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()

@pytest.fixture
def goal_service(db: Session) -> GoalService:
    repository = GoalRepository(db)
    return GoalService(repository)
