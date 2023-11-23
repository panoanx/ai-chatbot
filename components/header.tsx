import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { auth } from '@/lib/auth'
import { clearChats } from '@/app/actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { MobileNav } from '@/components/mobile-nav'
import { SidebarList } from '@/components/sidebar-list'
import {
  IconGitHub,
  IconNextChat,
  IconSeparator,
  IconVercel
} from '@/components/ui/icons'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { UserMenu } from '@/components/user-menu'
import { LoginButton } from '@/components/login-button'
import Navbar from './navbar'
import { SidebarToggleButton } from './sidebar-toggle'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from './ui/label'
import { GearIcon } from '@radix-ui/react-icons'
import { Slider } from './ui/slider'
import { Settings } from './settings'

export async function Header() {
  const session = await auth()

  return (
    <header className="supports-backdrop-blur:bg-background/20 sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/70 to-background/40 px-4 backdrop-blur">
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
