import { Plus, MessageCircle, Trash2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Chat {
  id: string
  title: string
  messages: any[]
}

export default function Sidebar({ 
  chats, 
  activeChat, 
  onSelectChat, 
  onNewChat,
  onDeleteChat,
  isLoggedIn,
  isOpen,
  onToggle
}: {
  chats: Chat[]
  activeChat: string
  onSelectChat: (id: string) => void
  onNewChat: () => void
  onDeleteChat: (id: string) => void
  isLoggedIn: boolean
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <>
      {/* Toggle Button - Fixed position */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className={`fixed top-4 z-50 bg-background border shadow-sm transition-all duration-200 ${
          isOpen ? 'left-72' : 'left-4'
        }`}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 bg-background border-r z-40 transform transition-transform duration-200 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="p-3 border-b">
          <Button 
            onClick={onNewChat} 
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            New chat
          </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`group relative flex items-center rounded-lg mb-1 hover:bg-muted ${
                activeChat === chat.id ? 'bg-muted' : ''
              }`}
            >
              <button
                onClick={() => onSelectChat(chat.id)}
                className="flex-1 flex items-center p-3 text-left text-sm rounded-lg"
              >
                <MessageCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate">{chat.title}</span>
              </button>
              
              {chats.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteChat(chat.id)
                  }}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        {!isLoggedIn && (
          <div className="p-4 border-t">
            <p className="text-xs text-muted-foreground text-center">
              💡 Login to save chat history
            </p>
          </div>
        )}
      </div>
    </>
  )
}