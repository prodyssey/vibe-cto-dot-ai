import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://vibecto.ai'),
  title: 'VibeCTO.ai - From vibes to product',
  description: 'Elite AI augmented engineering and vibe coding guidance',
  keywords: ['AI development', 'engineering', 'CTO', 'product development'],
  openGraph: {
    title: 'VibeCTO.ai - From vibes to product',
    description: 'Elite AI augmented engineering and vibe coding guidance',
    url: 'https://vibecto.ai',
    siteName: 'VibeCTO.ai',
    images: [
      {
        url: '/vibe-cto-og.png',
        width: 1200,
        height: 630,
        alt: 'VibeCTO.ai - From vibes to product',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VibeCTO.ai - From vibes to product',
    description: 'Elite AI augmented engineering and vibe coding guidance',
    images: ['/vibe-cto-og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Providers>
          <div id="root">{children}</div>
        </Providers>
      </body>
    </html>
  )
}