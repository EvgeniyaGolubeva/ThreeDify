from sqlalchemy.orm import Session
from app import models
from app.schemas import UserCreate
from passlib.context import CryptContext
from app.schemas import SessionCreate
from app.models import Session
import math

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Хешира паролата с passlib (bcrypt).
def get_password_hash(password):
    return pwd_context.hash(password)

#Създава User обект със същия имейл, но вече криптирана парола. Записва го в базата.
#Връща създадения потребител с вече зададено id.
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    is_first_user = db.query(models.User).count() == 0
    db_user = models.User(email=user.email, hashed_password=hashed_password, is_admin=is_first_user)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

#Проверява дали даден стринг след хеширане отоговаря на хешираната парола.
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

#Връща User обект ако login-ът е успешен.
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# Създава сесия с упражнения
def create_session(db: Session, user_id: int, session_data: SessionCreate):
    total = session_data.correct_answers + session_data.incorrect_answers
    raw_accuracy = session_data.correct_answers / total if total > 0 else 0.0
    accuracy = raw_accuracy * min(math.log(total + 1), 2.0) * 50  # гарантира макс 100

    previous_session = (
        db.query(models.Session)
        .filter(models.Session.user_id == user_id)
        .order_by(models.Session.created_at.desc())
        .first()
    )

    prev_accuracy = previous_session.accuracy if previous_session else accuracy
    trend = ((accuracy - prev_accuracy) / prev_accuracy) * 100 if prev_accuracy > 0 else accuracy

    db_session = Session(
        user_id=user_id,
        correct_answers=session_data.correct_answers,
        incorrect_answers=session_data.incorrect_answers,
        duration_seconds=session_data.duration_seconds,
        accuracy=accuracy,
        trend=trend,
    )

    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

#Взима резултати 
def get_results_for_user(db: Session, user_email: str):
    user = db.query(models.User).filter(models.User.email == user_email).first()
    return db.query(models.Session).filter(models.Session.user_id == user.id).order_by(models.Session.created_at.desc()).all()
