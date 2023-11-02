'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'

import { IconSidebar } from '@/components/ui/icons'

export interface SidebarProps {
  children?: React.ReactNode
}

export function MainNav({ children }: SidebarProps) {
  return (
    <div className="items-center hidden md:flex">
      <Button variant="ghost" className="-ml-2 h-9 w-9 p-0">
        <IconSidebar className="h-6 w-6" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className="inset-y-0 flex h-auto w-[300px] flex-col p-0">
        <div className="p-4">
          <div className="text-sm">Chat History</div>
        </div>
        {children}
      </div>
    </div>
  )
}
