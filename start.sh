#!/bin/bash

# DinsGPT Startup Script

echo "🧠 Starting DinsGPT..."

# Check if Ollama is running
if ! pgrep -x "ollama" > /dev/null; then
    echo "⚠️  Ollama not running. Please start Ollama first:"
    echo "   ollama serve"
    exit 1
fi

# Check if required models are available
echo "📦 Checking Ollama models..."
if ! ollama list | grep -q "llama3"; then
    echo "⚠️  llama3 model not found. Installing..."
    ollama pull llama3
fi

if ! ollama list | grep -q "llava"; then
    echo "⚠️  llava model not found. Installing..."
    ollama pull llava
fi

# Start backend
echo "🚀 Starting backend..."
cd backend
python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend..."
cd ../dinsgpt_frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ DinsGPT is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait