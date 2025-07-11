# services/auth_service.py
import bcrypt
from datetime import datetime
from typing import Dict
from auth.jwt import create_token

# Temporary in-memory user DB (can be upgraded to SQLite later)
USER_DB: Dict[str, Dict] = {}

def register_user(username: str, password: str):
    if username in USER_DB:
        raise ValueError("Username already exists")
    hashed_pw = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    USER_DB[username] = {
        "password_hash": hashed_pw,
        "created": datetime.utcnow().isoformat(),
    }
    return True

def authenticate_user(username: str, password: str):
    user = USER_DB.get(username)
    if not user:
        return None
    if not bcrypt.checkpw(password.encode(), user["password_hash"].encode()):
        return None
    return create_token(username)

def get_user(username: str):
    return USER_DB.get(username)
