// Alternative implementation if glob paths are causing issues
import matter from 'gray-matter';
import React from 'react';

// Explicit imports
import InteractiveDemo from '@/content/posts/interactive-demo';

import examplePostMd from '@/content/posts/example-post.md?raw';

export interface PostMetadata {
  title: string;
  description: string;
  date: string;
  readTime: string;
  featured: boolean;
  type: 'markdown' | 'react';
  tags: string[];
  author: string;
  slug: string;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
}

// Map of slug to content
const markdownPosts: Record<string, string> = {
  'example-post': examplePostMd,
};

const reactPosts: Record<string, React.ComponentType & { metadata?: Partial<PostMetadata> }> = {
  'interactive-demo': InteractiveDemo,
};

export async function getAllPosts(): Promise<PostMetadata[]> {
  const posts: PostMetadata[] = [];

  // Process markdown files
  for (const [slug, content] of Object.entries(markdownPosts)) {
    try {
      const { data } = matter(content);
      posts.push({
        ...data,
        slug,
        type: 'markdown'
      } as PostMetadata);
    } catch (error) {
      console.error(`Error loading markdown post ${slug}:`, error);
    }
  }

  // Process React components
  for (const [slug, component] of Object.entries(reactPosts)) {
    if (component.metadata) {
      posts.push({
        ...component.metadata,
        slug,
        type: 'react'
      } as PostMetadata);
    }
  }

  // Sort by date (newest first) and featured status
  return posts.sort((a, b) => {
    if (a.featured && !b.featured) {return -1;}
    if (!a.featured && b.featured) {return 1;}
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Try markdown first
  if (slug in markdownPosts) {
    try {
      const { data, content } = matter(markdownPosts[slug]);
      return {
        metadata: {
          ...data,
          slug,
          type: 'markdown'
        } as PostMetadata,
        content
      };
    } catch (error) {
      console.error(`Error loading markdown post ${slug}:`, error);
    }
  }

  // Try React component
  if (slug in reactPosts) {
    const component = reactPosts[slug];
    if (component.metadata) {
      return {
        metadata: {
          ...component.metadata,
          slug,
          type: 'react'
        } as PostMetadata,
        content: '' // React components don't have markdown content
      };
    }
  }

  return null;
}

export async function getReactComponent(slug: string) {
  return reactPosts[slug] || null;
}