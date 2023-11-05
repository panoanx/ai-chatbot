"use client"
import { Button } from './ui/button'
import { IconPlus } from './ui/icons'
import { useRouter } from 'next/navigation'

export default function NewChatButton() {
  const router = useRouter()
  return (
    <Button
      variant="outline"
      className=" font-medium py-2 h-10 w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
      onClick={e => {
        e.preventDefault()
        router.push('/')
      }}
    >
      <IconPlus className="h-4 w-4 -translate-x-2 stroke-2" />
      New Chat
    </Button>
  )
}
