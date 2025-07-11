# 🧠 DinsGPT Demo Guide

## Quick Demo Commands

### 1. Basic Chat
```
Hello! What can you help me with?
```

### 2. Calculator Tool
```
!calc 15 * 7 + 23
!calc sqrt(144)
!calc sin(pi/2)
```

### 3. Code Execution
```
!code
for i in range(5):
    print(f"Hello {i}")
```

```
!code
import math
print(f"Pi = {math.pi:.4f}")
print(f"E = {math.e:.4f}")
```

### 4. Image Vision
1. Click "Choose File" in Image Vision section
2. Upload any screenshot or image
3. Ask: "What do you see in this image?"
4. Or: "Describe the colors and objects"

### 5. Document Upload & RAG
1. Upload a PDF or text file
2. In chat, ask: "What is this document about?"
3. Or: "Summarize the main points"

### 6. Memory (Login Required)
- Register/login to enable persistent memory
- Chat history and preferences saved per user
- Persona customization available

## Sample Conversations

**Technical Help:**
```
User: How do I center a div in CSS?
Assistant: Here are 3 modern ways to center a div...
```

**Math & Logic:**
```
User: !calc (5^2 + 3^2) / 2
Assistant: 🧮 (5^2 + 3^2) / 2 = 17
```

**Code Analysis:**
```
User: !code
def fibonacci(n):
    if n <= 1: return n
    return fibonacci(n-1) + fibonacci(n-2)
print([fibonacci(i) for i in range(10)])
```

**Image Understanding:**
Upload a screenshot and ask:
```
"What UI framework might this be built with?"
"Are there any accessibility issues visible?"
```