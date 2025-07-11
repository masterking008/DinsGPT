import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  role: 'user' | 'assistant'
  content: string
  image?: string
}

export default function ChatExport({ messages, chatTitle }: { messages: Message[], chatTitle: string }) {
  const exportAsMarkdown = () => {
    const markdown = messages.map(msg => {
      const role = msg.role === 'user' ? '**You:**' : '**DinsGPT:**'
      return `${role}\n${msg.content}\n`
    }).join('\n')
    
    const blob = new Blob([`# ${chatTitle}\n\n${markdown}`], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_')}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportAsJSON = () => {
    const data = { title: chatTitle, messages, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${chatTitle.replace(/[^a-z0-9]/gi, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (messages.length === 0) return null

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={exportAsMarkdown}
        title="Export as Markdown"
      >
        <Download className="w-3 h-3 mr-1" />
        MD
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={exportAsJSON}
        title="Export as JSON"
      >
        <Download className="w-3 h-3 mr-1" />
        JSON
      </Button>
    </div>
  )
}