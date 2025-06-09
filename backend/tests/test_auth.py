import pytest
from jose import jwt
from app.auth import create_access_token, verify_token
from fastapi import HTTPException
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"

def test_create_access_token_generates_valid_token():
    data = {"sub": "test@example.com"}
    token = create_access_token(data)
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "test@example.com"

def test_verify_token_returns_correct_email():
    token = create_access_token({"sub": "user@test.com"})
    email = verify_token(token, HTTPException(status_code=401))
    assert email == "user@test.com"

def test_verify_token_raises_error_on_invalid_token():
    with pytest.raises(HTTPException):
        verify_token("invalid.token.here", HTTPException(status_code=401))
