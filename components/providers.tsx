'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarContextProvider } from './sidebar-toggle'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <SidebarContextProvider>{children}</SidebarContextProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
