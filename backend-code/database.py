from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = (
    "postgresql+psycopg2://servicer:password@localhost/savings_tracker")

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_session():
    with SessionLocal() as session:
        try:
            yield session
        except Exception:
            session.rollback()
            raise
