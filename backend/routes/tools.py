# backend/routes/tools.py

from fastapi import APIRouter
from pydantic import BaseModel
from services.calculator import evaluate_expression
from services.executor import run_code

router = APIRouter()

class ToolRequest(BaseModel):
    input: str

@router.post("/tool/calc")
async def calculate(req: ToolRequest):
    result = evaluate_expression(req.input)
    return {"result": result}

@router.post("/tool/code")
async def execute(req: ToolRequest):
    output = run_code(req.input)
    return {"output": output}
