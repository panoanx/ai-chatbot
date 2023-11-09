import { ChatRequestOptions, type Message } from 'ai'

import { Separator } from '@/components/ui/separator'
import { ChatMessage } from '@/components/chat-message'
import { UseChatHelpers } from 'ai/react/dist'
import toast from 'react-hot-toast'

export interface ChatList
  extends Pick<
    UseChatHelpers,
    'append' | 'messages' | 'setMessages' | 'isLoading'
  > {
  id?: string
  chatOptions: ChatRequestOptions
}

export function ChatList({
  messages,
  setMessages,
  append,
  id,
  isLoading,
  chatOptions
}: ChatList) {
  if (!messages.length) {
    return null
  }

  async function editMessage({ content = '', index = -1 }) {
    if (index === -1) return toast.error('Error editing message')

    setMessages(messages.slice(0, index))
    return await append(
      {
        id,
        content: content,
        role: 'user'
      },
      chatOptions
    )
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={index}>
          <ChatMessage
            message={message}
            editMessage={editMessage}
            index={index}
            isLoading={isLoading}
          />
          {index < messages.length - 1 && (
            <Separator className="my-4 md:my-8" />
          )}
        </div>
      ))}
    </div>
  )
}
