import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { ResourcePostClient } from './ResourcePostClient'

interface ResourcePostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: ResourcePostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | VibeCTO.ai'
    }
  }

  return {
    title: `${post.metadata.title} | VibeCTO.ai`,
    description: post.metadata.description,
    keywords: post.metadata.tags,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      url: `https://vibecto.ai/resources/${resolvedParams.slug}`,
      images: post.metadata.headerImage ? [
        {
          url: post.metadata.headerImage,
          width: 1200,
          height: 630,
          alt: post.metadata.title,
        }
      ] : [
        {
          url: '/vibe-cto-og.png',
          width: 1200,
          height: 630,
          alt: post.metadata.title,
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.description,
      images: post.metadata.headerImage ? [post.metadata.headerImage] : ['/vibe-cto-og.png'],
    },
    alternates: {
      canonical: `https://vibecto.ai/resources/${resolvedParams.slug}`
    }
  }
}

export default async function ResourcePostPage({ params }: ResourcePostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug)
  
  if (!post) {
    notFound()
  }

  return <ResourcePostClient post={post} />
}