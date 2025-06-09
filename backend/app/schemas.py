from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

#input-модел за register endpoint-а.
#EmailStr се грижи автоматично да проверява дали въведеният имейл е валиден.
class UserCreate(BaseModel):
    email: EmailStr
    password: str

#input-модел за login endpoint-а.
#EmailStr се грижи автоматично да проверява дали въведеният имейл е валиден.
class UserLogin(BaseModel):
    email: EmailStr
    password: str

#input-модел за сесията с упражнения
class SessionCreate(BaseModel):
    correct_answers: int
    incorrect_answers: int
    duration_seconds: int

#output-модел за резултати от сесията
class SessionOut(BaseModel):
    correct_answers: int
    incorrect_answers: int
    duration_seconds: int
    created_at: datetime
    accuracy: float
    trend: float
    model_config = ConfigDict(from_attributes=True)

#output-модел за админ панела
class UserWithStats(BaseModel):
    id: int
    email: EmailStr
    is_admin: bool
    session_count: int
    accuracy: float
    model_config = ConfigDict(from_attributes=True)
