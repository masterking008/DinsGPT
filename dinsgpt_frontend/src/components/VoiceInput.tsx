import { useState, useRef } from 'react'
import { Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function VoiceInput({ 
  onTranscript 
}: { 
  onTranscript: (text: string) => void 
}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported] = useState(() => 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
  const recognitionRef = useRef<any>(null)

  const startRecording = () => {
    if (!isSupported) return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    
    recognitionRef.current.continuous = false
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = 'en-US'

    recognitionRef.current.onstart = () => setIsRecording(true)
    recognitionRef.current.onend = () => setIsRecording(false)
    
    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onTranscript(transcript)
    }

    recognitionRef.current.onerror = () => {
      setIsRecording(false)
    }

    recognitionRef.current.start()
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant={isRecording ? "destructive" : "ghost"}
      size="icon"
      onClick={isRecording ? stopRecording : startRecording}
      className={isRecording ? 'animate-pulse' : ''}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  )
}