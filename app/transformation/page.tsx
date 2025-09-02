import type { Metadata } from 'next'
import { TransformationClient } from './TransformationClient'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: "Transformation - AI-Augmented Engineering | VibeCTO.ai",
  description: "Transform your engineering organization with AI-augmented development processes. Accelerate velocity and reduce delivery delays with expert guidance.",
  keywords: ["AI development", "engineering transformation", "development velocity", "AI-augmented engineering", "team scaling"],
  openGraph: {
    title: "Transformation - AI-Augmented Engineering | VibeCTO.ai",
    description: "Transform your engineering organization with AI-augmented development processes. Accelerate velocity and reduce delivery delays with expert guidance.",
    url: "https://vibecto.ai/transformation",
    images: [
      {
        url: '/vibe-cto-og.png',
        width: 1200,
        height: 630,
        alt: 'Transformation - AI-Augmented Engineering | VibeCTO.ai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Transformation - AI-Augmented Engineering | VibeCTO.ai",
    description: "Transform your engineering organization with AI-augmented development processes. Accelerate velocity and reduce delivery delays with expert guidance.",
    images: ['/vibe-cto-og.png'],
  },
  alternates: {
    canonical: "https://vibecto.ai/transformation"
  }
}

export default async function TransformationPage() {
  const posts = await getAllPosts()
  
  // Filter posts for case studies with transformation tag at build time
  const transformationCaseStudies = posts.filter(
    (post) =>
      post.tags.includes("case-study") &&
      post.tags.includes("transformation")
  )
  
  return <TransformationClient posts={transformationCaseStudies} />
}