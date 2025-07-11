
# backend/services/calculator.py

import sympy as sp

def evaluate_expression(expr: str) -> str:
    try:
        result = sp.sympify(expr)
        return str(result)
    except Exception as e:
        return f"Math error: {str(e)}"
