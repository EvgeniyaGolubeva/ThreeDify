from app import models, database
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import UserCreate
from app import crud
from app.schemas import UserLogin

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
def login(user: UserLogin, db: Session = Depends(get_db)):
    authenticated_user = crud.authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful!"}
