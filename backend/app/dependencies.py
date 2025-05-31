# Общи зависимости (FastAPI Depends). Централизирана логика за достъп до токена и проверка на права.

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.auth import verify_token
from app import models
from app.models import User
from sqlalchemy.orm import Session
from app.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# get_current_user взима потребителя от токена, използвано в защитени ендпойнти.
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_email = verify_token(token, credentials_exception)
    user = db.query(User).filter(User.email == user_email).first()

    if user is None:
        raise credentials_exception

    return user


def get_current_admin_user(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user or not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user
