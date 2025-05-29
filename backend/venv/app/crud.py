from sqlalchemy.orm import Session
from app import models
from app.schemas import UserCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#Хешира паролата с passlib (bcrypt).
def get_password_hash(password):
    return pwd_context.hash(password)

#Създава User обект със същия имейл, но вече криптирана парола. Записва го в базата.
#Връща създадения потребител с вече зададено id.
def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
