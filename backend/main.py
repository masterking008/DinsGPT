# backend/main.py

from fastapi import FastAPI
from routes import chat, rag, tools, vision
from auth import routes as auth_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include all route modules
app.include_router(chat.router)
app.include_router(rag.router)
app.include_router(vision.router)
app.include_router(tools.router)
app.include_router(auth_routes.router, prefix="/auth")

@app.get("/")
def root():
    return {"status": "DinsGPT backend running"}
