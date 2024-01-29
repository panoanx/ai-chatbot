import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { MobileNav } from '@/components/nav/mobile-nav'

import { UserMenu } from '@/components/user-menu'
import { AuthentikLoginButton } from '@/components/login-button'
import Navbar from './nav/navbar'
import { SidebarToggleButton } from './nav/sidebar-toggle'
import { Settings } from './settings'
import { IconNextChat, IconSeparator } from './ui/icons'

export async function Header() {
  const session = await auth()

  return (
    <header className="supports-backdrop-blur:bg-zinc-100 fixed top-0 z-30 flex h-16 w-full shrink-0 items-center justify-between border-b px-4 backdrop-brightness-[0.97] backdrop-blur shadow">
      <div className="flex items-center">
        {session?.user ? (
          <>
            <MobileNav>
              {/* @ts-ignore */}
              <Navbar />
            </MobileNav>
            <SidebarToggleButton />
          </>
        ) : (
          <Link href="/" target="_blank" rel="nofollow">
            <IconNextChat className="mr-2 h-6 w-6 dark:hidden" inverted />
            <IconNextChat className="mr-2 hidden h-6 w-6 dark:block" />
          </Link>
        )}

        <IconSeparator className="h-6 w-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <Button variant="link" asChild className="-ml-2">
            <Link href="/sign-in?callbackUrl=/">Login</Link>
          </Button>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2">
        <Settings />
      </div>
    </header>
  )
}
