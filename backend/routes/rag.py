# backend/routes/rag.py

from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from services.chroma_rag import ingest_document, query_rag

router = APIRouter()



from fastapi import APIRouter
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from services.chroma_rag import query_rag

router = APIRouter()

class RAGQuery(BaseModel):
    user_id: str
    query: str


@router.post("/upload")
async def upload_file(user_id: str = Form(...), file: UploadFile = File(...)):
    filename = file.filename
    content = await file.read()

    result = ingest_document(user_id, filename, content)
    return {"status": "uploaded", "file": filename, "chunks": result}

@router.post("/rag/query")
async def ask_rag(req: RAGQuery):
    response = query_rag(req.user_id, req.query)
    return JSONResponse(content={"response": response})
