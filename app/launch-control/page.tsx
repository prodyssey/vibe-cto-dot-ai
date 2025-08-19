import type { Metadata } from 'next'
import { LaunchControlClient } from './LaunchControlClient'

export const metadata: Metadata = {
  title: "Launch Control - Scale with Confidence | VibeCTO.ai",
  description: "Expert guidance for scaling your product. Build fast, scale secure with elite AI-augmented engineering and proven processes from seasoned CTOs.",
  keywords: ["CTO services", "tech scaling", "product scaling", "engineering leadership", "AI development team", "fractional CTO"],
  openGraph: {
    title: "Launch Control - Scale with Confidence | VibeCTO.ai",
    description: "Expert guidance for scaling your product. Build fast, scale secure with elite AI-augmented engineering and proven processes from seasoned CTOs.",
    url: "https://vibecto.ai/launch-control",
    images: [
      {
        url: '/vibe-cto-og.png',
        width: 1200,
        height: 630,
        alt: 'Launch Control - Scale with Confidence | VibeCTO.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Launch Control - Scale with Confidence | VibeCTO.ai",
    description: "Expert guidance for scaling your product. Build fast, scale secure with elite AI-augmented engineering and proven processes from seasoned CTOs.",
    images: ['/vibe-cto-og.png'],
  },
  alternates: {
    canonical: "https://vibecto.ai/launch-control"
  }
}

export default function LaunchControlPage() {
  return <LaunchControlClient />
}