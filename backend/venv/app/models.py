from sqlalchemy import Column, Integer, String
from app.database import Base

#Дефинира базовата структура на таблицата users.
#hashed_password пази криптирана парола.
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
