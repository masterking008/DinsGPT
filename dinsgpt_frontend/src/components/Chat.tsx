import ReactMarkdown from "react-markdown"
import axios from "axios"
import { useState, useRef, useEffect } from "react"
import { Paperclip, Send, Image, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import VoiceInput from "./VoiceInput"
import ChatExport from "./ChatExport"
import MessageSearch from "./MessageSearch"
import { ChatInput } from "./chat-input"

interface Message {
  role: "user" | "assistant"
  content: string
  image?: string
}

export default function Chat({
  messages,
  onUpdateMessages,
  isLoggedIn,
  showSearch = false
}: {
  messages: Message[]
  onUpdateMessages: (messages: Message[]) => void
  isLoggedIn: boolean
  showSearch?: boolean
}) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ file: File; url: string } | null>(null)
  const [highlightedMessage, setHighlightedMessage] = useState<number | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    if (selectedImage) {
      const userMessage = { role: "user" as const, content: input, image: selectedImage.url }
      const loadingMessage = { role: "assistant" as const, content: "🔍 Analyzing image..." }
      onUpdateMessages([...messages, userMessage, loadingMessage])
      
      const formData = new FormData()
      formData.append("file", selectedImage.file)
      formData.append("prompt", input)
      
      setInput("")
      setSelectedImage(null)
      setLoading(true)
      
      try {
        const res = await axios.post("http://localhost:8000/vision/ask", formData, { timeout: 30000 })
        onUpdateMessages([...messages, userMessage, { role: "assistant", content: res.data.response }])
      } catch (error: any) {
        const errorMsg = error.code === 'ECONNABORTED' ? "⏱️ Request timed out - try again" : "❌ Image analysis failed"
        onUpdateMessages([...messages, userMessage, { role: "assistant", content: errorMsg }])
      } finally {
        setLoading(false)
      }
    } else {
      const newMessages = [...messages, { role: "user", content: input }]
      onUpdateMessages(newMessages)
      setInput("")
      setLoading(true)

      try {
        const res = await axios.post("http://localhost:8000/chat", {
          user_id: isLoggedIn ? "user" : "guest",
          message: input,
          history: newMessages,
        }, { timeout: 30000 })

        onUpdateMessages([...newMessages, { role: "assistant", content: res.data.response }])
      } catch (error: any) {
        const errorMsg = error.code === 'ECONNABORTED' ? "⏱️ Request timed out - try again" : "❌ Error reaching backend"
        onUpdateMessages([...newMessages, { role: "assistant", content: errorMsg }])
      } finally {
        setLoading(false)
      }
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    onUpdateMessages([...messages, { role: "assistant", content: `📄 Uploading ${file.name}...` }])

    const formData = new FormData()
    formData.append("user_id", isLoggedIn ? "user" : "guest")
    formData.append("file", file)

    try {
      await axios.post("http://localhost:8000/upload", formData)
      onUpdateMessages([...messages, { role: "assistant", content: `✅ Uploaded ${file.name}` }])
    } catch {
      onUpdateMessages([...messages, { role: "assistant", content: "❌ Upload failed" }])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setSelectedImage({ file, url: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput(prev => prev + (prev ? ' ' : '') + transcript)
  }

  const handleHighlightMessage = (index: number) => {
    setHighlightedMessage(index)
    setTimeout(() => setHighlightedMessage(null), 3000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to DinsGPT</h1>
          <p className="text-muted-foreground">Your private AI assistant</p>
        </div>
        
        <ChatInput 
          input={input}
          setInput={setInput}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          loading={loading}
          sendMessage={sendMessage}
          fileInputRef={fileInputRef}
          imageInputRef={imageInputRef}
          handleFileUpload={handleFileUpload}
          handleImageUpload={handleImageUpload}
          handleVoiceTranscript={handleVoiceTranscript}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {showSearch && (
        <div className="flex-shrink-0 border-b">
          <MessageSearch messages={messages} onHighlight={handleHighlightMessage} />
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 pb-20">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card className={`max-w-2xl ${highlightedMessage === i ? 'ring-2 ring-ring' : ''}`}>
                <CardContent className={`p-3 ${msg.role === "user" ? "bg-primary text-primary-foreground" : ""}`}>
                  {msg.image && <img src={msg.image} alt="uploaded" className="max-w-xs rounded mb-2" />}
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </CardContent>
              </Card>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card><CardContent className="p-3">Thinking...</CardContent></Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t flex-shrink-0 sticky bottom-0 bg-background">
        <ChatInput 
          input={input}
          setInput={setInput}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          loading={loading}
          sendMessage={sendMessage}
          fileInputRef={fileInputRef}
          imageInputRef={imageInputRef}
          handleFileUpload={handleFileUpload}
          handleImageUpload={handleImageUpload}
          handleVoiceTranscript={handleVoiceTranscript}
        />
      </div>
    </div>
  )
}