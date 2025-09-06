import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import { ResourcesClient } from './ResourcesClient'

export const metadata: Metadata = {
  title: "Resources - Engineering Insights | VibeCTO.ai",
  description: "Discover insights, guides, and resources for AI-augmented engineering and product development.",
  keywords: ["engineering resources", "AI development", "product development", "technical insights"],
  openGraph: {
    title: "Resources - Engineering Insights | VibeCTO.ai",
    description: "Discover insights, guides, and resources for AI-augmented engineering and product development.",
    url: "https://vibecto.ai/resources",
    images: [
      {
        url: '/images/posts/vibe-coding-augmented-engineering.png',
        width: 1200,
        height: 630,
        alt: 'Resources - Engineering Insights | VibeCTO.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Resources - Engineering Insights | VibeCTO.ai",
    description: "Discover insights, guides, and resources for AI-augmented engineering and product development.",
    images: ['/images/posts/vibe-coding-augmented-engineering.png'],
  },
  alternates: {
    canonical: "https://vibecto.ai/resources"
  }
}

export default async function ResourcesPage() {
  const posts = await getAllPosts()
  return <ResourcesClient posts={posts} />
}