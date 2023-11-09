// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import { cn } from '@/lib/utils'
import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import React from 'react'
import { Prompt } from 'next/font/google'
import { PromptForm } from './prompt-form'
import { isContext } from 'vm'
import rehypeKatex from 'rehype-katex'

export interface ChatMessageProps {
  message: Message
  index: number
  editMessage?: ({ content, index }: { content: string; index: number }) => void
  isLoading?: boolean,
  isShared?: boolean
}

export function ChatMessage({
  message,
  index,
  editMessage,
  isLoading,
  isShared,
  ...props
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [input, setInput] = React.useState(message.content)

  // subscribe to isEditing. if editing done, update input
  React.useEffect(() => {
    if (!isEditing) {
      setInput(message.content)
    }
  }, [isEditing, message])

  return (
    <div
      className={cn('group relative mb-4 flex items-start md:-ml-12')}
      {...props}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
          message.role === 'user'
            ? 'bg-background'
            : 'bg-primary text-primary-foreground'
        )}
      >
        {message.role === 'user' ? <IconUser /> : <IconOpenAI />}
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        {isEditing && !isShared && editMessage ? (
          <PromptForm
            onSubmit={async value => {
              setIsEditing(false)
              if (editMessage) {
                await editMessage({ content: value, index })
              }
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading || false}
          />
        ) : (
          <MemoizedReactMarkdown
            className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 break-words"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex as any]}
            components={{
              p({ children }) {
                return <p className="mb-2 last:mb-0">{children}</p>
              },
              code({ node, inline, className, children, ...props }) {
                if (children.length) {
                  if (children[0] == '▍') {
                    return (
                      <span className="mt-1 animate-pulse cursor-default">
                        ▍
                      </span>
                    )
                  }

                  children[0] = (children[0] as string).replace('`▍`', '▍')
                }

                const match = /language-(\w+)/.exec(className || '')

                if (inline) {
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={String(children).replace(/\n$/, '')}
                    {...props}
                  />
                )
              }
            }}
          >
            {message.content}
          </MemoizedReactMarkdown>
        )}
        <ChatMessageActions message={message} isEditing={isEditing} setIsEditing={setIsEditing} />
      </div>
    </div>
  )
}
