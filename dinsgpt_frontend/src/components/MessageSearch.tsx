import { useState } from 'react'
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function MessageSearch({ 
  messages, 
  onHighlight 
}: { 
  messages: Message[]
  onHighlight: (index: number) => void 
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<number[]>([])
  const [currentResult, setCurrentResult] = useState(0)

  const search = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const matches: number[] = []
    messages.forEach((msg, index) => {
      if (msg.content.toLowerCase().includes(searchQuery.toLowerCase())) {
        matches.push(index)
      }
    })
    
    setResults(matches)
    setCurrentResult(0)
    if (matches.length > 0) {
      onHighlight(matches[0])
    }
  }

  const nextResult = () => {
    if (results.length === 0) return
    const next = (currentResult + 1) % results.length
    setCurrentResult(next)
    onHighlight(results[next])
  }

  const prevResult = () => {
    if (results.length === 0) return
    const prev = currentResult === 0 ? results.length - 1 : currentResult - 1
    setCurrentResult(prev)
    onHighlight(results[prev])
  }

  return (
    <div className="flex items-center gap-2 p-4 border-b">
      <div className="flex items-center gap-2 flex-1">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            search(e.target.value)
          }}
          placeholder="Search messages..."
          className="flex-1"
        />
        {query && (
          <Button variant="ghost" size="sm" onClick={() => { setQuery(''); setResults([]) }}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {results.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{currentResult + 1} of {results.length}</span>
          <Button variant="ghost" size="sm" onClick={prevResult}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextResult}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}