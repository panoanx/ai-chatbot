import { Metadata } from 'next'

import { Toaster } from 'react-hot-toast'
import { SidebarList } from '@/components/sidebar-list'
import { SidebarFooter } from '@/components/sidebar-footer'
import { ThemeToggle } from '@/components/theme-toggle'
import { ClearHistory } from '@/components/clear-history'
import { clearChats } from './actions'

import '@/app/globals.css'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import React from 'react'
import { auth } from '@/auth'
import { ScrollArea } from '@/components/ui/scroll-area'

export const metadata: Metadata = {
  title: {
    default: 'Next.js AI Chatbot',
    template: `%s - Next.js AI Chatbot`
  },
  description: 'An AI-powered chatbot template built with Next.js and Vercel.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

// import { useState } from 'react';

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth()
  // const [showSidebar, setShowSidebar] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Toaster />
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            {/* @ts-ignore */}
            <Header />
            <div className="flex flex-row flex-1">
              <div className="hidden w-80 py-8 pl-3 md:block">
                <React.Suspense
                  fallback={<div className="flex-1 overflow-auto" />}
                >
                  {/* @ts-ignore */}
                  <SidebarList userId={session?.user?.id} />
                </React.Suspense>
                <SidebarFooter>
                  <ThemeToggle />
                  {/* <ClearHistory onClick={() => clearChats()} /> */}
                  {/* <button onClick={() => setShowSidebar(!showSidebar)}>
                {showSidebar ? 'Hide' : 'Show'} Code List
              </button> */}
                </SidebarFooter>
              </div>

              <main className="container flex flex-col flex-1 bg-muted/50">
                {children}
              </main>
            </div>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  )
}
