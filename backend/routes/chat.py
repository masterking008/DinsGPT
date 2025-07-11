# backend/routes/chat.py

from fastapi import APIRouter, Request
from pydantic import BaseModel
from services.ollama_client import generate_response
from services.memory import load_persona, load_memory

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str
    history: list  # list of {"role": "user"/"assistant", "content": "..."}

@router.post("/chat")
async def chat(req: ChatRequest):
    user_id = req.user_id
    history = req.history
    message = req.message

    # Check for tool commands
    if message.startswith("!calc "):
        from services.calculator import evaluate_expression
        expr = message[6:].strip()
        result = evaluate_expression(expr)
        return {"response": f"🧮 {expr} = {result}"}
    
    if message.startswith("!code\n"):
        from services.executor import run_code
        code = message[6:].strip()
        output = run_code(code)
        return {"response": f"🐍 Code Output:\n```\n{output}\n```"}
    
    # Try RAG first for logged-in users
    if user_id != "guest":
        try:
            from services.chroma_rag import query_rag
            rag_response = query_rag(user_id, message)
            if rag_response and len(rag_response.strip()) > 10 and "I don't have information" not in rag_response:
                return {"response": rag_response}
        except Exception:
            pass  # Fall back to normal chat if RAG fails
    
    # Fallback to normal chat with improved system prompt
    if user_id != "guest":
        system_prompt = load_persona(user_id)
        memory = load_memory(user_id)
        enhanced_prompt = f"{system_prompt} {memory}\n\nNote: If the user asks about uploaded documents and you don't have access to them, suggest they try uploading the document again."
        full_history = [{"role": "system", "content": enhanced_prompt}] + history
    else:
        from config import DEFAULT_SYSTEM_PROMPT
        full_history = [{"role": "system", "content": DEFAULT_SYSTEM_PROMPT}] + history
    
    full_history.append({"role": "user", "content": message})
    response = generate_response(full_history)
    return {"response": response}
