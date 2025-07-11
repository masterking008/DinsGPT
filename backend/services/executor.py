# backend/services/executor.py

import sys
import io
import traceback

SAFE_BUILTINS = {
    "print": print,
    "range": range,
    "len": len,
    "int": int,
    "float": float,
    "str": str,
    "bool": bool,
    "enumerate": enumerate,
    "zip": zip,
    "min": min,
    "max": max,
    "sum": sum,
    "abs": abs
}

def run_code(code: str) -> str:
    stdout = io.StringIO()
    stderr = io.StringIO()

    try:
        safe_globals = {"__builtins__": SAFE_BUILTINS}
        safe_locals = {}

        sys.stdout = stdout
        sys.stderr = stderr

        exec(code, safe_globals, safe_locals)

        sys.stdout = sys.__stdout__
        sys.stderr = sys.__stderr__

        return stdout.getvalue() or "✅ Code ran successfully with no output."

    except Exception:
        sys.stdout = sys.__stdout__
        sys.stderr = sys.__stderr__
        return "❌ Error:\n" + traceback.format_exc()
