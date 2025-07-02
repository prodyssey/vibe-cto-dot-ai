import matter from 'gray-matter';
import React from 'react';

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

// Import all markdown files
const markdownFiles = import.meta.glob('/src/content/posts/*.md', { 
  query: '?raw', 
  import: 'default',
  eager: true
});

// Import all React components
const reactFiles = import.meta.glob('/src/content/posts/*.tsx', {
  eager: false
});

function slugify(filename: string): string {
  return filename
    .replace(/^.*\//, '') // Remove path
    .replace(/\.(md|tsx)$/, '') // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

export async function getAllPosts(): Promise<PostMetadata[]> {
  const posts: PostMetadata[] = [];

  // Process markdown files
  for (const [path, content] of Object.entries(markdownFiles)) {
    try {
      const rawContent = content as string;
      const { data } = matter(rawContent);
      const slug = slugify(path);
      
      posts.push({
        ...data,
        slug,
        type: 'markdown'
      } as PostMetadata);
    } catch (error) {
      console.error(`Error loading markdown file ${path}:`, error);
    }
  }

  // Process React files - load the component to get metadata
  for (const [path, loader] of Object.entries(reactFiles)) {
    try {
      const module = await loader() as { default: React.ComponentType & { metadata?: Partial<PostMetadata> } };
      const component = module.default;
      const slug = slugify(path);
      
      if (component && component.metadata) {
        posts.push({
          ...component.metadata,
          slug,
          type: 'react'
        } as PostMetadata);
      }
    } catch (error) {
      console.error(`Error loading React file ${path}:`, error);
    }
  }

  // Sort by date (newest first) and featured status
  return posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  // Try markdown first
  const markdownPath = `/src/content/posts/${slug}.md`;
  if (markdownPath in markdownFiles) {
    try {
      const rawContent = markdownFiles[markdownPath] as string;
      const { data, content } = matter(rawContent);
      
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
  const reactPath = `/src/content/posts/${slug}.tsx`;
  if (reactPath in reactFiles) {
    try {
      const module = await reactFiles[reactPath]() as { default: React.ComponentType & { metadata?: Partial<PostMetadata> } };
      const component = module.default;
      
      if (component && component.metadata) {
        return {
          metadata: {
            ...component.metadata,
            slug,
            type: 'react'
          } as PostMetadata,
          content: '' // React components don't have markdown content
        };
      }
    } catch (error) {
      console.error(`Error loading React post ${slug}:`, error);
    }
  }

  console.log('Post not found for slug:', slug);
  return null;
}

export async function getReactComponent(slug: string) {
  const reactPath = `/src/content/posts/${slug}.tsx`;
  if (reactPath in reactFiles) {
    try {
      const module = await reactFiles[reactPath]();
      return (module as { default: React.ComponentType }).default;
    } catch (error) {
      console.error(`Error loading React component ${slug}:`, error);
    }
  }
  return null;
}