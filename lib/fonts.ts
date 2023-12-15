import { JetBrains_Mono, Inter, Manrope } from 'next/font/google'

export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
  // display: 'swap'
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
})
