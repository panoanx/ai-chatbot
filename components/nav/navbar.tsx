import { SidebarFooter } from './sidebar-footer'
import { ThemeToggle } from './theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import * as React from 'react'
import { clearChats } from '@/app/actions'
import { auth } from '@/lib/auth'
import { SidebarList } from './sidebar-list'

export default async function Navbar() {
  const session = await auth()
  return (
    <>
      <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
        {/* @ts-ignore */}
        <SidebarList userId={session?.user?.id} />
      </React.Suspense>
      <SidebarFooter>
        <ThemeToggle />
        <ClearHistory clearChats={clearChats} />
      </SidebarFooter>
    </>
  )
}
