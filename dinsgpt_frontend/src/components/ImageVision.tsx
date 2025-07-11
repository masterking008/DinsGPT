import { useState } from "react"
import axios from "axios"

interface VisionMessage {
  role: "user" | "assistant"
  content: string
  image?: string
}

export default function ImageVision({
  onResponse,
}: {
  onResponse: (msg: VisionMessage) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file || !prompt.trim()) return
    setLoading(true)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("prompt", prompt)

    try {
      const res = await axios.post("http://localhost:8000/vision/ask", formData)

      const reader = new FileReader()
      reader.onloadend = () => {
        // 1. User's image + prompt
        onResponse({
          role: "user",
          content: prompt,
          image: reader.result as string,
        })

        // 2. Assistant's reply
        onResponse({
          role: "assistant",
          content: res.data.response || "❌ No response from model",
        })
      }

      reader.readAsDataURL(file)
    } catch {
      onResponse({
        role: "assistant",
        content: "❌ Image vision request failed.",
      })
    } finally {
      setLoading(false)
      setFile(null)
      setPrompt("")
    }
  }

  return (
    <div className="bg-zinc-800 p-4 rounded-lg space-y-3">
      <p className="text-sm">Upload an image and ask about it</p>

      <input type="file" accept="image/*" onChange={e => e.target.files && setFile(e.target.files[0])} />

      <input
        type="text"
        placeholder="What do you want to ask?"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        className="w-full p-2 text-sm bg-zinc-700 rounded"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-3 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded"
      >
        {loading ? "Analyzing..." : "Send to Vision Model"}
      </button>
    </div>
  )
}
