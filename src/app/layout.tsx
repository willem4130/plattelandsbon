import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { TRPCReactProvider } from '@/trpc/react'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Plattelandsbon — Oom Gerrit',
    template: '%s — Plattelandsbon',
  },
  description: 'Gratis kortingsbonnen voor restaurants, cafes, wellness, overnachtingen en activiteiten in de Achterhoek. Van Winterswijk tot Zutphen — Oom Gerrit kent de beste plekjes.',
  metadataBase: new URL('https://plattelandsbon.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    siteName: 'Plattelandsbon',
    title: 'Plattelandsbon — De beste tips van \u2019t platteland',
    description: 'Gratis kortingsbonnen voor de Achterhoek. Restaurants, wellness, overnachtingen en meer.',
  },
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <TRPCReactProvider>
            {children}
            {modal}
          </TRPCReactProvider>
        </SessionProvider>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
