#Зарежда URL за базата от .env.
#Създава engine (връзка към Postgres).
#Създава session maker, който по-късно използвам в route-овете.

from dotenv import load_dotenv
import os

load_dotenv()  # Това зарежда .env файла автоматично

DATABASE_URL = os.getenv("DATABASE_URL")

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
