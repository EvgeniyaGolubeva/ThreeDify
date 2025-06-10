from app import models, database, auth
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import UserCreate
from app import crud
from app.schemas import UserLogin
from app.dependencies import get_current_user
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas import SessionCreate
from app.dependencies import *
from app import crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import UserWithStats

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine) #Създава всички таблици от Models

@app.get("/")
def read_root():
    return {"message": "Connected to PostgreSQL successfully!"}

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
@app.get("/me", response_model=UserWithStats)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    # Compute stats with default fallbacks to avoid crash
    session_count = len(current_user.sessions) if current_user.sessions else 0
    latest = current_user.sessions[-1] if current_user.sessions else None
    accuracy = latest.accuracy if latest else 0.0

    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_admin": current_user.is_admin,
        "session_count": session_count,
        "accuracy": accuracy
    }

#Добавя към базата информация за сесията с упражнения
@app.post("/sessions/save")
def save_session(
    session_data: SessionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print("Incoming session:", session_data)
    print("Authenticated user ID:", current_user.id)
    return crud.create_session(db, current_user.id, session_data)

#Резултати от сесията
@app.get("/results", response_model=list[schemas.SessionOut])
def get_results(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Session).filter(models.Session.user_id == current_user.id).order_by(models.Session.created_at.desc()).all()

#Връща текущите user-и и техните резултати
@app.get("/admin/stats")
def admin_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")

    users = db.query(models.User).all()
    stats = []

    for user in users:
        sessions = db.query(models.Session).filter(models.Session.user_id == user.id).order_by(models.Session.created_at.desc()).all()
        if not sessions:
            continue  

        latest = sessions[0]
        total_tries = sum(s.correct_answers + s.incorrect_answers for s in sessions)

        stats.append({
            "id": user.id,
            "email": user.email,
            "tries": total_tries,
            "accuracy": latest.accuracy,
            "trend": latest.trend,
            "is_admin": user.is_admin
        })

    return stats

#Да направя някого admin може само ако съм вече админ
@app.post("/admin/make_admin/{user_id}")
def make_admin(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_admin:
        return {"message": "User is already an admin"}

    user.is_admin = True
    db.commit()
    return {"message": f"{user.email} is now an admin"}
