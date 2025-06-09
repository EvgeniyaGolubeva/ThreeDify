from app import crud
from app.schemas import UserCreate, SessionCreate
from app.models import User
from sqlalchemy.orm import Session

def test_create_user_hashes_password_and_saves(db_session: Session):
    user = crud.create_user(db_session, UserCreate(email="test@a.bg", password="1234"))
    assert user.email == "test@a.bg"
    assert user.hashed_password != "1234"

def test_verify_password_valid_and_invalid():
    hashed = crud.get_password_hash("mypassword")
    assert crud.verify_password("mypassword", hashed)
    assert not crud.verify_password("wrong", hashed)

def test_authenticate_user_with_correct_credentials(db_session: Session):
    crud.create_user(db_session, UserCreate(email="auth@test.com", password="secret"))
    user = crud.authenticate_user(db_session, "auth@test.com", "secret")
    assert user is not None
    assert user.email == "auth@test.com"

def test_create_session_calculates_accuracy_and_trend(db_session: Session):
    user = crud.create_user(db_session, UserCreate(email="sess@test.com", password="pass"))
    session_data = SessionCreate(correct_answers=8, incorrect_answers=2, duration_seconds=100)
    session = crud.create_session(db_session, user.id, session_data)
    assert 0 <= session.accuracy <= 100
    assert isinstance(session.trend, float)

def test_get_results_for_user_returns_ordered_sessions(db_session: Session):
    user = crud.create_user(db_session, UserCreate(email="res@test.com", password="123"))
    crud.create_session(db_session, user.id, SessionCreate(correct_answers=2, incorrect_answers=1, duration_seconds=50))
    crud.create_session(db_session, user.id, SessionCreate(correct_answers=1, incorrect_answers=1, duration_seconds=40))
    results = crud.get_results_for_user(db_session, user.email)
    assert len(results) == 2
    assert results[0].created_at >= results[1].created_at
