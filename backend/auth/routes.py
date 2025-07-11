# auth/routes.py
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Dict
from datetime import datetime, timedelta
import bcrypt
import jwt
import os

router = APIRouter()

# Simple in-memory user store (for now)
USER_DB: Dict[str, Dict] = {}
JWT_SECRET = os.environ.get("JWT_SECRET", "supersecret")
JWT_EXPIRY = 7  # days

class UserRegister(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(BaseModel):
    username: str

# Register endpoint
@router.post("/register")
def register(user: UserRegister):
    if user.username in USER_DB:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pw = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt())
    USER_DB[user.username] = {
        "password_hash": hashed_pw.decode(),
        "created": datetime.utcnow().isoformat(),
    }
    return {"message": "User registered successfully"}

# Login endpoint
@router.post("/login")
def login(user: UserLogin):
    stored = USER_DB.get(user.username)
    if not stored:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.checkpw(user.password.encode(), stored["password_hash"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = jwt.encode({
        "sub": user.username,
        "exp": datetime.utcnow() + timedelta(days=JWT_EXPIRY)
    }, JWT_SECRET, algorithm="HS256")

    return {"access_token": token, "token_type": "bearer"}

# Get current user
from fastapi.security import OAuth2PasswordBearer
from fastapi import Request

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        username = payload.get("sub")
        if username is None or username not in USER_DB:
            raise HTTPException(status_code=401, detail="Invalid token")
        return User(username=username)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"username": current_user.username}
