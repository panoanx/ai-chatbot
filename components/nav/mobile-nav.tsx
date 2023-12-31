import * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { IconSidebar } from '@/components/ui/icons'
import Link from 'next/link'
import NewChatButton from '../new-chat-button'

export interface SidebarProps {
  children?: React.ReactNode
}

export function MobileNav({ children }: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 h-9 w-9 p-0 lg:hidden">
          <IconSidebar className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className="inset-y-0 flex h-auto w-[300px] flex-col p-0"
        side="left"
      >
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">Chat History</SheetTitle>
        </SheetHeader>
        <div className="mb-2 px-2">
          <NewChatButton />
        </div>
        {children}
      </SheetContent>
    </Sheet>
  )
}
