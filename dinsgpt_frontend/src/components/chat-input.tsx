import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Paperclip, Image, Send, X } from "lucide-react"
import VoiceInput from "./VoiceInput"

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  selectedImage: { file: File; url: string } | null
  setSelectedImage: (image: { file: File; url: string } | null) => void
  loading: boolean
  sendMessage: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  imageInputRef: React.RefObject<HTMLInputElement>
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleVoiceTranscript: (transcript: string) => void
}

export function ChatInput({
  input,
  setInput,
  selectedImage,
  setSelectedImage,
  loading,
  sendMessage,
  fileInputRef,
  imageInputRef,
  handleFileUpload,
  handleImageUpload,
  handleVoiceTranscript
}: ChatInputProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {selectedImage && (
        <Card className="mb-4">
          <CardContent className="flex items-center gap-3 p-3">
            <img src={selectedImage.url} alt="preview" className="w-16 h-16 object-cover rounded" />
            <span className="text-sm">Image selected</span>
            <Button variant="ghost" size="sm" onClick={() => setSelectedImage(null)} className="ml-auto">
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="flex items-center gap-2 p-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder={selectedImage ? "Ask about this image..." : "Message DinsGPT..."}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => imageInputRef.current?.click()}>
            <Image className="h-4 w-4" />
          </Button>
          <VoiceInput onTranscript={handleVoiceTranscript} />
          <Button onClick={sendMessage} disabled={loading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
      <input ref={fileInputRef} type="file" hidden accept=".pdf,.txt,.md" onChange={handleFileUpload} />
      <input ref={imageInputRef} type="file" hidden accept="image/*" onChange={handleImageUpload} />
    </div>
  )
}