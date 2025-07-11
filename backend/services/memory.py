# backend/services/memory.py

import os
from config import DATA_DIR, DEFAULT_SYSTEM_PROMPT

def load_persona(user_id):
    path = os.path.join(DATA_DIR, user_id, "persona.json")
    if not os.path.exists(path):
        return DEFAULT_SYSTEM_PROMPT
    with open(path, "r") as f:
        return f.read()

def load_memory(user_id):
    path = os.path.join(DATA_DIR, user_id, "memory.json")
    if not os.path.exists(path):
        return ""
    with open(path, "r") as f:
        return f.read()
