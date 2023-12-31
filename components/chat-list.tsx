import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { UseChatHelpers } from 'ai/react/dist'
import toast from 'react-hot-toast'

interface ChatListProps extends Pick<UseChatHelpers, 'messages' | 'isLoading'> {
  id?: string
  isShared?: boolean
  editMessage?: ({ content, index }: { content: string; index: number }) => void
  setIsCurrentVision?: (isVision: boolean) => void
}

export function ChatList({
  messages,
  isLoading,
  isShared,
  editMessage,
  setIsCurrentVision
}: ChatListProps) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="relative mx-auto sm:max-w-2xl xl:max-w-3xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage
            message={message}
            editMessage={editMessage}
            index={index}
            isLoading={isLoading}
            isShared={isShared}
            setIsCurrentVision={setIsCurrentVision}
          />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
