import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import HydrationProvider from '@/components/ui/HydrationProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Masdar Eco-Builder | ADEK',
  description: 'A gamified learning adventure about UAE sustainability for Grade 4 students',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <body className="h-full">
        <HydrationProvider>
          {children}
        </HydrationProvider>
      </body>
    </html>
  )
}
