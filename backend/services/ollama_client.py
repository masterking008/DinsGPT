# backend/services/ollama_client.py

import subprocess
import json
from config import MODEL_NAME

def format_messages(messages):
    formatted = ""
    for msg in messages:
        role = msg["role"]
        content = msg["content"]
        if role == "system":
            formatted += f"<<SYS>> {content} <</SYS>>\n"
        elif role == "user":
            formatted += f"[USER] {content}\n"
        elif role == "assistant":
            formatted += f"[ASSISTANT] {content}\n"
    return formatted

def generate_response(messages):
    prompt = format_messages(messages)
    try:
        result = subprocess.run(
            ["ollama", "run", MODEL_NAME],
            input=prompt.encode(),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=60
        )
        output = result.stdout.decode("utf-8").strip()
        return output
    except Exception as e:
        return f"Error: {str(e)}"
