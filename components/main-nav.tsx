import * as React from 'react'

import { Button } from '@/components/ui/button'

import { IconNextChat, IconSidebar } from '@/components/ui/icons'
import { Skeleton } from './ui/skeleton'
import { SidebarFooter } from './sidebar-footer'
import { ThemeToggle } from './theme-toggle'
import { ClearHistory } from './clear-history'
import { SidebarList } from '@/components/sidebar-list'

import { clearChats } from '@/app/actions'
import { auth } from '@/auth'
import { MainSidebar } from './sidebar-toggle'

export async function MainNav() {
  const session = await auth()
  return (
    <MainSidebar>
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4">
          <h4 className="text-sm font-medium">Chat History</h4>
        </div>
        <div className="flex-grow">
          <React.Suspense
            fallback={
              <div className="p-4 space-y-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px]" />
                <Skeleton className="h-4 w-[160px]" />
                <Skeleton className="h-4 w-[160px]" />
              </div>
            }
          >
            {/* @ts-ignore */}
            <SidebarList userId={session?.user?.id} />
          </React.Suspense>
        </div>
        <SidebarFooter className="">
          <ThemeToggle />
          <ClearHistory clearChats={clearChats} />
        </SidebarFooter>
      </div>
    </MainSidebar>
  )
}
