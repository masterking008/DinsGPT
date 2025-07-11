# backend/config.py

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "users")

DEFAULT_SYSTEM_PROMPT = "You are DinsGPT, a helpful, honest, offline AI assistant."
MODEL_NAME = "llama3"
VISION_MODEL = "llava"
