# backend/routes/vision.py

from fastapi import APIRouter, File, UploadFile, Form
from services.vision_model import ask_about_image
import tempfile

router = APIRouter()

@router.post("/vision/ask")
async def ask_vision(file: UploadFile = File(...), prompt: str = Form(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp:
        temp.write(await file.read())
        temp_path = temp.name

    result = ask_about_image(temp_path, prompt)
    return {"response": result}
