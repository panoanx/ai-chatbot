import { auth } from '@/lib/auth'
import {
  AuthentikLoginButton,
  GoogleLoginButton
} from '@/components/login-button'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  const session = await auth()
  // redirect to home if user is already logged in
  if (session?.user) {
    redirect('/')
  }
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))]  items-center justify-center py-10">
      <div className='flex flex-col space-y-2'>
        <AuthentikLoginButton className="py-5 text-base" />
        <GoogleLoginButton className="py-5 text-base" />
      </div>
    </div>
  )
}
