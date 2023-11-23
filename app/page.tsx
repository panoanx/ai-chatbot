import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default async function IndexPage() {
  const session = await auth()
  if (!session?.user) {
    redirect(`/sign-in?callbackUrl=/`)
  }
  const id = nanoid()

  return <Chat id={id} />
}
