from app import models, database, auth
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import UserCreate
from app import crud
from app.schemas import UserLogin
from app.dependencies import get_current_user
from fastapi.security import OAuth2PasswordRequestForm

app = FastAPI()

models.Base.metadata.create_all(bind=database.engine)

@app.get("/")
def read_root():
    return {"message": "Connected to PostgreSQL successfully!"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Регистрация - извиква create_user() (от crud.py) и го създава ако може да създаде, т.е. имейлът е ок.
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

#Логин - извиква authenticate_user (от crud.py) и, ако резултатът не е null, пуска да влезе.
@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

#Тестова функция за да видиш дали си авторизиран
@app.get("/me")
def read_users_me(current_user: str = Depends(get_current_user)):
    return {"user": current_user}
