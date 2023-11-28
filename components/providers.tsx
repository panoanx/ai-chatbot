'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarContextProvider } from '@/components/nav/sidebar-toggle'
import { SettingsContextProvider } from './settings'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <SidebarContextProvider>
          <SettingsContextProvider>
            {children}
          </SettingsContextProvider>
        </SidebarContextProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
