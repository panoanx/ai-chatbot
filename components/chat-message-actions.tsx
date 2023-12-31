'use client'

import { type Message } from 'ai'

import { Button } from '@/components/ui/button'
import { IconCheck, IconClose, IconCopy, IconEdit } from '@/components/ui/icons'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

interface ChatMessageActionsProps extends React.ComponentProps<'div'> {
  message: Message
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export function ChatMessageActions({
  message,
  className,
  isEditing,
  setIsEditing,
  ...props
}: ChatMessageActionsProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(message.content)
  }

  return (
    <div
      className={cn(
        'flex items-center justify-end transition-opacity group-hover:opacity-100 md:absolute md:-right-10 md:-top-2 md:opacity-0',
        className,
        isEditing && 'opacity-100'
      )}
      {...props}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={e => setIsEditing(!isEditing)}
        className={cn(
          'h-8 w-8 p-2',
          message.role === 'assistant' && 'hidden'
        )}
      >
        {isEditing ? <IconClose /> : <IconEdit />}
        <span className="sr-only">Edit Message</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onCopy}
        className={cn(
          'h-8 w-8 p-2',
          message.role !== 'assistant' && 'hidden'
        )}
      >
        {isCopied ? <IconCheck /> : <IconCopy />}
        <span className="sr-only">Copy message</span>
      </Button>
    </div>
  )
}
