// src/components/FileUpload.tsx

import { useState } from "react"
import axios from "axios"
import { FaFileUpload } from "react-icons/fa"

export default function FileUpload({ onUpload }: { onUpload: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const upload = async () => {
    if (!file) return
    setUploading(true)

    const formData = new FormData()
    formData.append("user_id", "test") // TODO: dynamic later
    formData.append("file", file)

    try {
      await axios.post("http://localhost:8000/upload", formData)
      onUpload()
      alert("✅ Uploaded successfully")
    } catch (err) {
      alert("❌ Upload failed")
    } finally {
      setUploading(false)
      setFile(null)
    }
  }

  return (
    <div className="bg-zinc-800 p-4 rounded-lg">
      <label className="block mb-2 text-sm">Upload PDF or text file</label>
      <input
        type="file"
        accept=".pdf,.txt,.md,.docx"
        onChange={handleFileChange}
        className="text-sm mb-2"
      />
      <button
        onClick={upload}
        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
        disabled={uploading}
      >
        <FaFileUpload className="inline mr-2" />
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  )
}
