import type { Metadata } from 'next'
import { IgnitionClient } from './IgnitionClient'

export const metadata: Metadata = {
  title: "Ignition - Validate Your Idea Fast | VibeCTO.ai",
  description: "0 to 1 idea validation framework from an expert builder. Get real market validation and a working MVP in weeks, not months. Transform your vision into reality.",
  keywords: ["MVP development", "idea validation", "startup validation", "rapid prototyping", "product validation", "lean startup"],
  openGraph: {
    title: "Ignition - Validate Your Idea Fast | VibeCTO.ai",
    description: "0 to 1 idea validation framework from an expert builder. Get real market validation and a working MVP in weeks, not months. Transform your vision into reality.",
    url: "https://vibecto.ai/ignition",
    images: [
      {
        url: '/vibe-cto-og.png',
        width: 1200,
        height: 630,
        alt: 'Ignition - Validate Your Idea Fast | VibeCTO.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Ignition - Validate Your Idea Fast | VibeCTO.ai",
    description: "0 to 1 idea validation framework from an expert builder. Get real market validation and a working MVP in weeks, not months. Transform your vision into reality.",
    images: ['/vibe-cto-og.png'],
  },
  alternates: {
    canonical: "https://vibecto.ai/ignition"
  }
}

export default function IgnitionPage() {
  return <IgnitionClient />
}