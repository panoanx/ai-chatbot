'use client'
// Inspired by Chatbot-UI and modified to fit the needs of this project
// @see https://github.com/mckaywrigley/chatbot-ui/blob/main/components/Chat/ChatMessage.tsx

import { Message } from 'ai'
import remarkGfm from 'remark-gfm'
import remarkMath, { Options } from 'remark-math'
import {
  ChatCompletionContentPart,
  ChatCompletionContentPartText
} from 'openai/resources'

import { CodeBlock } from '@/components/ui/codeblock'
import { MemoizedReactMarkdown } from '@/components/markdown'
import { IconOpenAI, IconUser } from '@/components/ui/icons'
import { ChatMessageActions } from '@/components/chat-message-actions'
import React from 'react'
import { Prompt } from 'next/font/google'
import { PromptForm } from './prompt-form'
import { isContext } from 'vm'
import rehypeKatex from 'rehype-katex'
import { cn } from '@/lib/utils'
import Image from 'next/image'
export interface ChatMessageProps {
  message: Message
  index: number
  editMessage?: ({
    content,
    image_urls,
    index
  }: {
    content: string
    image_urls: string[]
    index: number
  }) => void
  isLoading?: boolean
  isShared?: boolean
  setIsCurrentVision?: (isVision: boolean) => void
}

export function ChatMessage({
  message,
  index,
  editMessage,
  isLoading,
  isShared,
  setIsCurrentVision,
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

  const replaceLogic = (content: string) => {
    try {
      return content
        .replace(/\\\((.*?)\\\)/g, '$$ $1 $$')
        .replace(/\\\[(.*?)\\\]/g, '\n$$$$ \n $1 \n $$$$\n')
    } catch (error) {
      console.log('error in replaceLogic', error)
      return content
    }
  }

  // regex to replace \(\) and \[\] with $$ and $$
  const messageParser = (message: Message) => {
    return replaceLogic(message.content)
  }

  const parsedContent = messageParser(message) // : 'string | ChatCompletionContentPart[]'

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
      <div className="ml-2 flex-1 space-y-2 overflow-hidden px-1 sm:ml-4">
        {!isEditing && message.image_urls && message.image_urls.length > 0 && (
          <div className="relative">
            {message.image_urls.map((url, index) => (
              <Image
                key={index}
                src={url}
                width="0"
                height="0"
                sizes="100vw"
                alt=""
                className="h-auto w-auto rounded shadow"
              />
            ))}
          </div>
        )}
        {isEditing && !isShared && editMessage ? (
          <PromptForm
            onSubmit={async ({ text, image_urls }) => {
              setIsEditing(false)
              if (editMessage) {
                await editMessage({ content: text, image_urls, index })
              }
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading || false}
            initialImageUrls={message.image_urls || []}
            setIsVision={setIsCurrentVision}
          />
        ) : (
          <MemoizedReactMarkdown
            className="prose  break-words dark:prose-invert prose-h5:font-medium prose-h6:font-medium prose-p:leading-relaxed"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex as any]}
            components={{
              pre({ children }) {
                return <pre className="not-prose mb-2">{children}</pre>
              },
              // p({ children }) {
              //   return <p className="mb-1 last:mb-0">{children}</p>
              // },
              // ul({ children }) {
              //   return (
              //     <ul className="mb-1 ml-4 list-outside list-disc last:mb-0">
              //       {children}
              //     </ul>
              //   )
              // },
              // ol({ children }) {
              //   return (
              //     <ol className="mb-1 ml-8 list-outside list-decimal last:mb-0">
              //       {children}
              //     </ol>
              //   )
              // },
              // li({ children }) {
              //   return <li className="mb-0.5">{children}</li>
              // },
              // br() {
              //   return <br />
              // },
              img({ src, alt }) {
                return (
                  <div className="relative">
                    <Image
                      src={src || ''}
                      width="0"
                      height="0"
                      sizes="100vw"
                      alt={alt || ''}
                      className="not-prose h-auto w-auto rounded shadow"
                    />
                  </div>
                )
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
                    <code className={cn(className, 'break-all')} {...props}>
                      {children}
                    </code>
                  )
                }

                return (
                  <CodeBlock
                    key={Math.random()}
                    language={(match && match[1]) || ''}
                    value={
                      String(children)
                      // .replace(/\n$/, '')
                    }
                    {...props}
                  />
                )
              }
            }}
          >
            {parsedContent}
          </MemoizedReactMarkdown>
        )}
        <ChatMessageActions
          message={message}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>
    </div>
  )
}
