import { useState, useEffect } from "react"
import Chat from "./components/Chat"
import Login from "./components/Login"
import ChatExport from "./components/ChatExport"
import Sidebar from "./components/Sidebar"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"

interface ChatSession {
  id: string
  title: string
  messages: any[]
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [chats, setChats] = useState<ChatSession[]>([{ id: '1', title: 'New Chat', messages: [] }])
  const [activeChat, setActiveChat] = useState('1')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  const handleAuth = () => {
    setIsLoggedIn(true)
    setShowLogin(false)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setIsLoggedIn(false)
  }

  const createNewChat = () => {
    const newId = Date.now().toString()
    setChats(prev => [...prev, { id: newId, title: 'New Chat', messages: [] }])
    setActiveChat(newId)
  }

  const deleteChat = (chatId: string) => {
    if (chats.length <= 1) return
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (activeChat === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId)
      setActiveChat(remainingChats[0]?.id || '1')
    }
  }

  const updateChatMessages = (chatId: string, messages: any[]) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, messages, title: messages[0]?.content?.slice(0, 30) || 'New Chat' } : chat
    ))
  }

  const currentChat = chats.find(c => c.id === activeChat) || chats[0]

  if (showLogin) {
    return <Login onAuth={handleAuth} />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        isLoggedIn={isLoggedIn}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="flex items-center justify-between p-4 border-b flex-shrink-0 sticky top-0 bg-background z-10">
          <div className="ml-20 flex items-center gap-2">
            {currentChat.messages.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={() => setShowSearch(!showSearch)}>
                  <Search className="h-4 w-4 mr-2" />
                  {showSearch ? 'Hide' : 'Search'}
                </Button>
                <ChatExport messages={currentChat.messages} chatTitle={currentChat.title} />
              </>
            )}
          </div>
          <div className="flex-1" />
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">Logged in</span>
              <Button onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => setShowLogin(true)}>Login</Button>
          )}
        </header>

        <Chat 
          messages={currentChat.messages}
          onUpdateMessages={(messages) => updateChatMessages(activeChat, messages)}
          isLoggedIn={isLoggedIn}
          showSearch={showSearch}
        />
      </div>
    </div>
  )
}

export default App
