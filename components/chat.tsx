'use client'

import { useChat, type Message } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'

import ModelSelector from './model-selector'
import { ChatRequestOptions } from 'ai'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [model, setModel] = useLocalStorage('model', 'gpt-3.5-turbo-16k')
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const {
    messages,
    append,
    reload,
    stop,
    setMessages,
    isLoading,
    input,
    setInput
  } = useChat({
    initialMessages,
    id,
    body: {
      id,
      previewToken
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText)
      }
    },
    onFinish() {
      if (!path.includes('chat')) {
        router.push(`/chat/${id}`)
        router.refresh()
      }
    }
  })

  const chatOptions: ChatRequestOptions = {
    options: {
      body: {
        model: model
      }
    }
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
    <>
      <div className={cn('flex-1 pb-[200px] pt-4 md:pt-10', className)}>
        <div className="mx-auto my-4 flex h-8 -translate-y-4 items-center">
          <ModelSelector model={model} setModel={setModel} />
        </div>
        <div>
          {messages.length ? (
            <>
              <ChatList
                messages={messages}
                isLoading={isLoading}
                editMessage={editMessage}
              />
              <ChatScrollAnchor trackVisibility={isLoading} />
            </>
          ) : (
            <EmptyScreen setInput={setInput} />
          )}
        </div>
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
        chatOptions={chatOptions}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
