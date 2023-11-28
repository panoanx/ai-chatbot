'use client'

import { cn } from '@/lib/utils'

interface MainPanelProps {
  children: React.ReactNode
}

export default function MainPanel({ children }: MainPanelProps) {
//   const { sidebarState } = useSidebarState()
  return (
    <div
      className={cn(
        'group w-full pl-0 duration-300 ease-in-out animate-in peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]'
      )}
    >
      {children}
    </div>
  )
}
