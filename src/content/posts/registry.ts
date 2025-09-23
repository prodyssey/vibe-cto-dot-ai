import dynamic from 'next/dynamic';
import type { PostMetadata } from '@/lib/posts';

export const reactPostComponents = {
  'interactive-demo': dynamic(() => import('./interactive-demo')),
  'idea-to-revenue-machine': dynamic(() => import('./idea-to-revenue-machine')),
} as const;

export const reactPostMetadata: Record<string, PostMetadata> = {
  'interactive-demo': {
    title: "Interactive React Demo Post",
    description: "Example of a dynamic React page with animations and interactive elements",
    date: "2024-12-20",
    readTime: "10 min read",
    featured: false,
    type: "react",
    tags: ["react", "interactive", "demo"],
    author: "Vibe CTO",
    slug: "interactive-demo",
    hidden: true,
  },
  'idea-to-revenue-machine': {
    title: "Idea ➡️ Code ➡️ Revenue?",
    description: "The most common mental model of digital product development is wrong. What's a better one?",
    date: "2025-09-23",
    readTime: "8 min interactive",
    featured: false,
    type: "react",
    tags: ["interactive", "product", "throughput"],
    author: "Craig Sturgis",
    slug: "idea-to-revenue-machine",
    hidden: false,
  },
};

export type ReactPostSlug = keyof typeof reactPostComponents;

export function isReactPost(slug: string): slug is ReactPostSlug {
  return slug in reactPostComponents;
}