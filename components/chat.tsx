'use client'

import { Message, useChat } from 'ai/react'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from 'usehooks-ts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useContext, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import { usePathname, useRouter } from 'next/navigation'

import { ChatRequestOptions } from 'ai'
import { SettingsContext } from './settings'
import { useAtBottom } from '@/lib/hooks/use-at-bottom'
import { ModelGroupType, modelOptions } from './model-selector'

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
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const { settings, setSettingsWrapper } = useContext(SettingsContext)
  const [model, setModel] = useState(settings.currentChatModel)
  const [promptFormHeight, setPromptFormHeight] = useState(0)
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
    sendExtraMessageFields: true, // for sending image_urls
    body: {
      id,
      previewToken,
      model: model,
      settings: settings
    },
    onResponse(response) {
      if (response.status === 401) {
        toast.error(response.statusText)
      }
    },
    onFinish() {
      if (!path.includes('chat')) {
        router.push(`/chat/${id}`, { shallow: true })
        router.refresh()
      }
    }
  })
  const isVisionMessages = (messages: Message[]) =>
    messages.some(
      message =>
        message.role === 'user' &&
        message.image_urls &&
        message.image_urls.length > 0 &&
        message.image_urls?.every(url => url.trim())
    )
  const [isVision, protectedSetIsVision] = useState(isVisionMessages(messages))
  const [isCurrentVision, setIsCurrentVision] = useState(false)
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      messages.filter(message => message.role === 'user').length > 0
        ? setModel(settings.currentChatModel)
        : setModel(settings.defaultModel)
      return
    }
  }, [isFirstRender, messages, settings])

  useEffect(() => {
    const _isVision = isVisionMessages(messages) || isCurrentVision
    if (isVision !== _isVision) {
      protectedSetIsVision(_isVision)
      if (_isVision === false)
        setModel(settings.currentChatModel ?? settings.defaultModel)
      else if (_isVision === true) {
        const modelTypes = _isVision ? ['vision'] : []
        const modelGroups =
          modelTypes && modelTypes.length > 0
            ? Object.entries(modelOptions).filter(([group]) =>
                modelTypes.includes(group as ModelGroupType)
              )
            : Object.entries(modelOptions)
        const valueExists = (value: string): boolean => {
          return modelGroups.some(([_, group]) =>
            group.models.some((model: any) => model.value === value)
          )
        }
        if (!valueExists(model)) {
          setModel(modelGroups[0][1].models[0].value)
        }
      }
    } else if (isVision === _isVision) {
      if (isVision === false) {
        setSettingsWrapper({ currentChatModel: model })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isCurrentVision, isVision, model])

  async function editMessage({ content = '', image_urls = [''], index = -1 }) {
    if (index === -1) return toast.error('Error editing message')

    setMessages(messages.slice(0, index))
    return await append({
      id,
      content: content,
      image_urls: image_urls,
      role: 'user'
    })
  }
const isAtBottom = useAtBottom(128)
  useEffect(() => {
    if (isAtBottom && !isFirstRender) {
      // console.log(isAtBottom, promptFormHeight)
      window.scrollTo({ top: document.body.offsetHeight, behavior: 'smooth' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promptFormHeight])

  useEffect(() => {
    if (isLoading && !isFirstRender) {
      window.scrollTo({ top: document.body.offsetHeight, behavior: 'instant' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isLoading])

  return (
    <>
      <div
        className={cn('flex-1  pt-4 md:pt-10', className)}
        style={{ paddingBottom: `${promptFormHeight + 80}px` }}
      >
        <div>
          {messages.length ? (
            <>
              <ChatList
                messages={messages}
                isLoading={isLoading}
                editMessage={editMessage}
                setIsCurrentVision={setIsCurrentVision}
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
        model={model}
        setModel={setModel}
        setPromptFormHeight={setPromptFormHeight}
        setIsVision={setIsCurrentVision}
        isVision={isVision}
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
