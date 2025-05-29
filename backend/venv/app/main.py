from fastapi import FastAPI
from app import models, database

app = FastAPI()

# Създаване на таблици при стартиране
models.Base.metadata.create_all(bind=database.engine)

@app.get("/")
def read_root():
    return {"message": "Connected to PostgreSQL successfully!"}
