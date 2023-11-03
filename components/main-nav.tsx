import * as React from 'react'

import { Button } from '@/components/ui/button'

import { IconSidebar } from '@/components/ui/icons'
import { Skeleton } from './ui/skeleton'
import { SidebarFooter } from './sidebar-footer'
import { ThemeToggle } from './theme-toggle'
import { ClearHistory } from './clear-history'
import { SidebarList } from '@/components/sidebar-list'

import { clearChats } from '@/app/actions'
import { auth } from '@/auth'

export interface SidebarProps {
  children?: React.ReactNode
}

export async function MainNav({ children }: SidebarProps) {
  const session = await auth()
  return (
    <div className="hidden md:w-72 lg:w-[22rem] pt-8 pl-3 md:block flex-grow-0">
      <div className="h-full flex flex-col">
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
    </div>
  )
}
