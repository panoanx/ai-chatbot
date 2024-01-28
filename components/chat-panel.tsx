import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconShare, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { cn } from '@/lib/utils'
import { ChatRequestOptions, Message } from 'ai'
import ModelSelector from './model-selector'
import { useState } from 'react'
import React from 'react'
export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
  model: string
  setModel: (value: string) => void
  isVision?: boolean
  setIsVision?: (isVision: boolean) => void
  setPromptFormHeight?: (height: number) => void
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  model,
  setModel,
  isVision,
  setIsVision,
  setPromptFormHeight
}: ChatPanelProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent to-background duration-300 ease-in-out animate-in dark:from-transparent dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] peer-[[data-state=open]]:group-[]:2xl:pl-[380px]'
      )}
      
    >
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-[58rem] sm:px-4 xl:pr-10">
        <div className="flex h-12 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="h-8 bg-background py-2 shadow rounded-xl"
            >
              <IconStop className="mr-2 h-8 py-2" />
              Stop generating
            </Button>
          ) : (
            <>
              <div className="inline-flex space-x-2">
                <ModelSelector
                  model={model}
                  setModel={setModel}
                  modelTypes={[
                    ...(isVision ? ['vision'] : [])
                    // ...(ifImage && ['image']),
                    // ...(ifChat && ['chat'])
                  ]}
                  className='rounded-xl'
                />
                {messages?.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => reload()}
                    className="h-8 bg-background py-2 shadow rounded-xl"
                  >
                    <IconRefresh className="mr-2" />
                    Regenerate
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
        <div className="space-y-4 px-4 pt-2 pb-0 md:pb-6">
          <PromptForm
            onSubmit={async ({ text, image_urls }) => {
              await append({
                id,
                content: text,
                image_urls: image_urls,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            setIsVision={setIsVision}
            setPromptFormHeight={setPromptFormHeight}
          />
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
      </div>
    </div>
  )
}
