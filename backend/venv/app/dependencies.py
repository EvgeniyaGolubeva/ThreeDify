# Общи зависимости (FastAPI Depends). Централизирана логика за достъп до токена и проверка на права.

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.auth import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# get_current_user взима потребителя от токена, използвано в защитени ендпойнти.
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return verify_token(token, credentials_exception)
