from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal
import uuid

client = TestClient(app)


def test_register_new_user_returns_200(client):
    email = f"user_{uuid.uuid4()}@test.com"  # уникален имейл
    response = client.post("/register", json={"email": email, "password": "pass123"})
    assert response.status_code == 200
    assert response.json()["email"] == email

def test_register_existing_email_returns_400():
    client.post("/register", json={"email": "exist@test.com", "password": "123"})
    response = client.post("/register", json={"email": "exist@test.com", "password": "123"})
    assert response.status_code == 400

def test_login_success_and_failure():
    client.post("/register", json={"email": "log@test.com", "password": "pass"})
    response_ok = client.post("/login", data={"username": "log@test.com", "password": "pass"})
    assert response_ok.status_code == 200

    response_fail = client.post("/login", data={"username": "log@test.com", "password": "wrong"})
    assert response_fail.status_code == 400

def test_save_session_requires_authentication():
    response = client.post("/sessions/save", json={"correct_answers": 3, "incorrect_answers": 2, "duration_seconds": 60})
    assert response.status_code == 401

def test_get_results_requires_authentication():
    response = client.get("/results")
    assert response.status_code == 401

def test_admin_stats_requires_admin():
    response = client.get("/admin/stats")
    assert response.status_code == 401
