from pydantic import BaseModel, EmailStr

#input-модел за register endpoint-а.
#EmailStr се грижи автоматично да проверява дали въведеният имейл е валиден.
class UserCreate(BaseModel):
    email: EmailStr
    password: str
