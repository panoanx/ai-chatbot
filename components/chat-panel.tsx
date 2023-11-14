import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconShare, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { cn } from '@/lib/utils'
import { ChatRequestOptions } from 'ai'
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
  model?: string
  chatOptions?: ChatRequestOptions
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
  chatOptions
}: ChatPanelProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-transparent to-background/80 duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]'
      )}
    >
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-[55rem] sm:px-4">
        <div className="flex h-12 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="h-8 bg-background py-2 shadow"
            >
              <IconStop className="mr-2 h-8 py-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => reload(chatOptions)}
                  className="h-8 bg-background py-2 shadow"
                >
                  <IconRefresh className="mr-2" />
                  Regenerate
                </Button>
              </div>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-3 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              await append(
                {
                  id,
                  content: value,
                  role: 'user'
                },
                chatOptions
              )
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
