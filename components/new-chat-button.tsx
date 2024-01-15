'use client'
import { useEffect } from 'react'
import { Button } from './ui/button'
import { IconPlus } from './ui/icons'
import { useRouter } from 'next/navigation'

export default function NewChatButton() {
  const router = useRouter()
  useEffect(() => {
    router.prefetch('/new-chat')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Button
      variant="outline"
      className=" h-10 w-full justify-start bg-zinc-50 px-4 py-2 font-medium shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
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
