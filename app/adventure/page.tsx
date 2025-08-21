import type { Metadata } from 'next'
import { AdventureClient } from './AdventureClient'

export const metadata: Metadata = {
  title: "Adventure - Interactive AI Journey | VibeCTO.ai",
  description: "Embark on an interactive adventure to discover how AI-augmented engineering can transform your development journey.",
  keywords: ["interactive adventure", "AI development", "engineering journey", "vibe coding"],
  openGraph: {
    title: "Adventure - Interactive AI Journey | VibeCTO.ai",
    description: "Embark on an interactive adventure to discover how AI-augmented engineering can transform your development journey.",
    url: "https://vibecto.ai/adventure",
    images: [
      {
        url: '/vibe-cto-og.png',
        width: 1200,
        height: 630,
        alt: 'Adventure - Interactive AI Journey | VibeCTO.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Adventure - Interactive AI Journey | VibeCTO.ai",
    description: "Embark on an interactive adventure to discover how AI-augmented engineering can transform your development journey.",
    images: ['/vibe-cto-og.png'],
  },
  alternates: {
    canonical: "https://vibecto.ai/adventure"
  }
}

export default function AdventurePage() {
  return <AdventureClient />
}