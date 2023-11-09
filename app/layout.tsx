import { Metadata } from 'next'

import { Toaster } from 'react-hot-toast'

import '@/app/globals.css'
import { fontMono, fontSans } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import React from 'react'
import { auth } from '@/auth'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { MainNav } from '@/components/main-nav'
import MainPanel from '@/components/main-panel'

export const metadata: Metadata = {
  title: {
    default: 'AI Tools for Robotflow',
    template: `%s - AI Tools for Robotflow`
  },
  description:
    'AI Tools for Robotflow. A collection of tools for academic research and development.',
  // themeColor: [
  //   { media: '(prefers-color-scheme: light)', color: 'white' },
  //   { media: '(prefers-color-scheme: dark)', color: 'black' }
  // ],
  icons: {
    icon: '/favicon.ico'
    // shortcut: '/favicon-16x16.png',
    // apple: '/apple-touch-icon.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/KaTeX/0.15.2/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>

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
              <main className="flex flex-col flex-1 bg-muted/50">
                <div className="relative flex h-[calc(100vh_-_theme(spacing.16))] overflow-hidden">
                  {/* @ts-ignore */}
                  <MainNav />
                  <MainPanel>{children}</MainPanel>
                </div>
              </main>
            </div>
          </div>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  )
}
