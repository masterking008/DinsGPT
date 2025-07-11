# 🧠 DinsGPT - Private Offline AI Chatbot

ChatGPT-style assistant with memory, tools, image reasoning — 100% local and secure.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- [Ollama](https://ollama.ai) installed

### Setup
1. **Install Ollama models:**
   ```bash
   ollama pull llama3
   ollama pull llava
   ```

2. **Install dependencies:**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd ../dinsgpt_frontend
   npm install
   ```

3. **Start services:**
   ```bash
   ./start.sh
   ```

4. **Open browser:** http://localhost:5173

## ✨ Features

- 💬 **Chat Interface** - Streaming ChatGPT-style chat
- 🧠 **Memory System** - Remembers user context (login required)
- 👁️ **Image Vision** - Upload images for LLaVA analysis
- 📁 **Document RAG** - Upload PDFs/text for Q&A
- 🧰 **Tools** - Calculator and Python code execution
- 🔐 **Multi-user** - Optional JWT authentication

## 🛠️ Manual Start

**Backend:**
```bash
cd backend
uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
cd dinsgpt_frontend
npm run dev
```

## 📊 API Endpoints

- `POST /chat` - Main chat endpoint
- `POST /upload` - File upload for RAG
- `POST /vision/ask` - Image analysis
- `POST /tool/calc` - Calculator
- `POST /tool/code` - Python execution

## 🔧 Configuration

Edit `backend/config.py` to customize:
- Model names
- System prompts
- Data directories# DinsGPT
# DinsGPT
