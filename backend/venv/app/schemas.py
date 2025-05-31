from pydantic import BaseModel, EmailStr

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
