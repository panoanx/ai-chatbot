'use client'

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

export interface SidebarProps {
  children?: React.ReactNode
}

export function SidebarNav({ children }: SidebarProps) {
  return (
    <>
      <MobileNav>{children}</MobileNav>
    </>
  )
}


function MobileNav({ children }: SidebarProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="-ml-2 h-9 w-9 p-0 md:hidden">
          <IconSidebar className="h-6 w-6" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="inset-y-0 flex h-auto w-[300px] flex-col p-0">
        <SheetHeader className="p-4">
          <SheetTitle className="text-sm">Chat History</SheetTitle>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  )
}

export function MainNav({ children }: SidebarProps) {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        {/* <IconSidebar className="h-6 w-6" /> */}
        <span className="hidden font-bold sm:inline-block">Chat History</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {children}
      </nav>
    </div>
  )
}
