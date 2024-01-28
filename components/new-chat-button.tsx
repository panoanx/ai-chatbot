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
      className=" h-10 w-full justify-start border shadow-none px-4 py-2 font-medium transition-colors"
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
