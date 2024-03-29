'use client'
import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { Button, buttonVariants } from '@/components/ui/button'
import { IconClose } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { BadgeDollarSign, Send } from 'lucide-react'
import { ImageUploader } from './image-uploader'
import Image from 'next/image'
import { SettingsContext } from './settings'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: ({
    text,
    image_urls
  }: {
    text: string
    image_urls: string[]
  }) => Promise<void>
  isLoading: boolean
  initialImageUrls?: string[]
  setIsVision?: (isVision: boolean) => void
  setPromptFormHeight?: (height: number) => void
  withShadow?: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  initialImageUrls,
  setIsVision,
  setPromptFormHeight,
  withShadow = true
}: PromptProps) {
  const {
    settings: { forgetful },
    setSettingsWrapper
  } = React.useContext(SettingsContext)
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [imageUrls, _setImageUrls] = React.useState<string[]>(
    initialImageUrls || []
  )

  const setImageUrls = React.useCallback((urls: string[]) => {
    const uniqueUrls = Array.from(new Set(urls))
    _setImageUrls(uniqueUrls)
  }, [])

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  React.useEffect(() => {
    if (setIsVision) {
      if (imageUrls && imageUrls.length > 0) {
        setIsVision(true)
      } else {
        setIsVision(false)
      }
    }
  }, [imageUrls, setIsVision])

  React.useEffect(() => {
    if (setPromptFormHeight) {
      if (formRef.current) {
        setPromptFormHeight(formRef.current.clientHeight)
      }
    }
  })

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent) => {
      const items = event.clipboardData.items
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile()
          const reader = new FileReader()
          reader.onload = readerEvent => {
            setImageUrls([...imageUrls, readerEvent.target?.result as string])
          }
          reader.readAsDataURL(blob as Blob)
          break
        }
      }
    },
    [imageUrls, setImageUrls]
  )

  return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) {
          return
        }
        setInput('')
        setImageUrls([])
        await onSubmit({ text: input, image_urls: imageUrls })
      }}
      ref={formRef}
    >
      <div
        className={cn(
          'relative flex max-h-96 w-full z-50 grow flex-row items-center overflow-hidden bg-background pl-10 sm:rounded-[30px] sm:pl-12 sm:border ',
          withShadow && 'sm:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.15)] '
        )}
      >
        <ImageUploader imageUrls={imageUrls} setImageUrls={setImageUrls} />
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={e => {
            if (isLoading || input === '') return
            onKeyDown(e)
          }}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message, or paste a image."
          spellCheck={false}
          onPaste={handlePaste}
          className="max-h-72 min-h-[60px] w-full resize-none bg-transparent px-2 py-3 sm:py-[1.3rem] pr-8 focus-within:outline-none sm:text-sm sm:pr-[90px]"
        />
        <div className="absolute right-0 top-3 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={cn(
                  'rounded-full hidden sm:inline-flex',
                  !forgetful && 'opacity-50'
                )}
                onClick={() => {
                  setSettingsWrapper({ forgetful: !forgetful })
                }}
              >
                <BadgeDollarSign className="pr-0.5 pt-0.5" />
                <span className="sr-only">Forgetful Mode</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forgetful Mode</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                disabled={isLoading || input === ''}
                className="rounded-full"
              >
                <Send className="pr-0.5 pt-0.5" />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
      <div className="mt-2 flex w-full justify-start space-x-2 overflow-auto">
        {imageUrls.map((url, index) => (
          <>
            <div className="relative">
              <Image
                key={index}
                src={url}
                width="0"
                height="0"
                sizes="100vw"
                alt=""
                className="h-auto max-h-32 w-auto rounded shadow-md"
                onLoadingComplete={
                  setPromptFormHeight
                    ? () => {
                        if (formRef.current) {
                          setPromptFormHeight(formRef.current.clientHeight)
                        }
                      }
                    : undefined
                }
              />
              <div className="absolute right-1 top-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full bg-background/60 p-0"
                  onClick={() => {
                    setImageUrls([
                      ...imageUrls.slice(0, index),
                      ...imageUrls.slice(index + 1)
                    ])
                  }}
                >
                  <IconClose className="h-4 w-4 p-0" />
                </Button>
              </div>
            </div>
          </>
        ))}
      </div>
    </form>
  )
}
