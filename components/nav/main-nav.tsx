import * as React from 'react'
import { Skeleton } from '../ui/skeleton'
import { SidebarFooter } from './sidebar-footer'
import { ThemeToggle } from './theme-toggle'
import { ClearHistory } from '../clear-history'
import { SidebarList } from './sidebar-list'

import { clearChats } from '@/app/actions'
import { auth } from '@/lib/auth'
import { MainSidebar } from './sidebar-toggle'
import NewChatButton from '../new-chat-button'

export async function MainNav() {
  const session = await auth()
  return (
    <>
      <MainSidebar>
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <h4 className="text-sm font-medium">Chat History</h4>
          </div>
          <div className="mb-4 px-2">
            <NewChatButton />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <React.Suspense
              fallback={
                <div className="space-y-4 p-4">
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
    </>
  )
}
