# # backend/services/vision_model.py

# import subprocess
# from config import VISION_MODEL

# def ask_about_image(image_path: str, prompt: str) -> str:
#     try:
#         result = subprocess.run(
#             ["ollama", "run", VISION_MODEL, "-i", image_path],
#             input=prompt.encode(),
#             stdout=subprocess.PIPE,
#             stderr=subprocess.PIPE,
#             timeout=60
#         )
#         response = result.stdout.decode("utf-8").strip()
#         return response or "No meaningful description was returned. Try another image or prompt."
#     except Exception as e:
#         return f"Error: {str(e)}"


# # backend/services/vision_model.py

import base64
import requests
from config import VISION_MODEL

def ask_about_image(image_path: str, prompt: str) -> str:
    with open(image_path, "rb") as img_file:
        image_b64 = base64.b64encode(img_file.read()).decode("utf-8")

    payload = {
        "model": VISION_MODEL,
        "prompt": prompt,
        "images": [image_b64],
        "stream": False
    }

    try:
        response = requests.post("http://localhost:11434/api/generate", json=payload)
        return response.json().get("response", "").strip()
    except Exception as e:
        return f"Vision error: {str(e)}"
