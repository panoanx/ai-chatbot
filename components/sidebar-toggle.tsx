'use client'

import React, { useContext, useEffect } from 'react'
import { IconNextChat, IconSidebar } from './ui/icons'
// import { useSidebarState } from '@/lib/hooks/use-sidebar-toggle'/
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

interface SidebarContextProps {
  sidebarState: string
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps>({
  sidebarState: 'open',
  toggleSidebar: () => {}
})

export function SidebarContextProvider({
  children
}: {
  children: React.ReactNode
}) {
  const [sidebarState, setSidebarState] = React.useState('open')

  const toggleSidebar = () => {
    setSidebarState(sidebarState === 'open' ? 'closed' : 'open')
  }

  useEffect(() => {
    setSidebarState('open')
  }, [])

  return (
    <SidebarContext.Provider value={{ sidebarState, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function SidebarToggleButton() {
  const { toggleSidebar } = useContext(SidebarContext)

  return (
    <Button
      variant="ghost"
      className="hidden -ml-2 h-9 w-9 p-0 lg:flex"
      onClick={toggleSidebar}
    >
      <IconSidebar className="h-6 w-6" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

interface SidebarProps {
  children?: React.ReactNode
}

export function MainSidebar({ children }: SidebarProps) {
  const { sidebarState } = useContext(SidebarContext)

  return (
    <div
      className={cn(
        'peer absolute inset-y-0 z-30 hidden h-full -translate-x-full flex-col border-r bg-muted duration-300 ease-in-out data-[state=open]:translate-x-0 dark:bg-zinc-950 lg:flex lg:w-[250px] xl:w-[300px]'
      )}
      data-state={sidebarState}
    >
      {children}
    </div>
  )
}
