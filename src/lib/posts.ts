import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

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
  hidden?: boolean;
  headerImage?: string;
  headerVideo?: string;
  headerVideoCaptions?: string;
}

export interface Post {
  metadata: PostMetadata;
  content: string;
}

function slugify(filename: string): string {
  return filename
    .replace(/^.*\//, '') // Remove path
    .replace(/\.(md|tsx)$/, '') // Remove extension
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Get the posts directory path
function getPostsDirectory(): string {
  return path.join(process.cwd(), 'src', 'content', 'posts');
}

const REACT_POSTS: Record<string, PostMetadata> = {
  'interactive-demo': {
    title: 'Interactive Demo',
    description: 'An interactive demonstration of concepts',
    date: '2025-01-01',
    readTime: '5 min read',
    featured: false,
    type: 'react',
    tags: ['interactive', 'demo'],
    author: 'Craig Sturgis',
    slug: 'interactive-demo',
    hidden: false,
  },
  'idea-to-revenue-machine': {
    title: 'Idea to Revenue Machine',
    description: 'Interactive factory simulation that turns ideas into features and highlights delivery bottlenecks.',
    date: '2025-01-25',
    readTime: '8 min interactive',
    featured: false,
    type: 'react',
    tags: ['interactive', 'product', 'throughput'],
    author: 'Craig Sturgis',
    slug: 'idea-to-revenue-machine',
    hidden: false,
  },
};

export async function getAllPosts(includeHidden = false): Promise<PostMetadata[]> {
  const posts: PostMetadata[] = [];
  
  try {
    const postsDirectory = getPostsDirectory();
    const fileNames = fs.readdirSync(postsDirectory);
    
    // Process markdown files
    for (const fileName of fileNames) {
      if (fileName.endsWith('.md')) {
        try {
          const filePath = path.join(postsDirectory, fileName);
          const content = fs.readFileSync(filePath, 'utf8');
          const { data } = matter(content);
          const slug = slugify(fileName);
          
          const post = {
            ...data,
            slug,
            type: 'markdown'
          } as PostMetadata;
          
          // Skip hidden posts unless explicitly requested
          if (!includeHidden && post.hidden) {continue;}
          
          posts.push(post);
        } catch (error) {
          console.error(`Error processing ${fileName}:`, error);
        }
      }
    }

    // Process React files - just metadata for now
    for (const fileName of fileNames) {
      if (fileName.endsWith('.tsx')) {
        try {
          const slug = slugify(fileName);
          const post = REACT_POSTS[slug];

          if (!post) {
            continue;
          }

          if (!includeHidden && post.hidden) {continue;}

          posts.push(post);
        } catch (error) {
          console.error(`Error processing React file ${fileName}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Error loading posts:', error);
  }

  // Sort by date (newest first) and featured status
  return posts.sort((a, b) => {
    if (a.featured && !b.featured) {return -1;}
    if (!a.featured && b.featured) {return 1;}
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostBySlug(slug: string, allowHidden = true): Promise<Post | null> {
  try {
    const postsDirectory = getPostsDirectory();
    
    // Try markdown first
    const markdownPath = path.join(postsDirectory, `${slug}.md`);
    if (fs.existsSync(markdownPath)) {
      try {
        const rawContent = fs.readFileSync(markdownPath, 'utf8');
        const { data, content } = matter(rawContent);
        
        const metadata = {
          ...data,
          slug,
          type: 'markdown'
        } as PostMetadata;
        
        // Check if post is hidden and if we should allow it
        if (!allowHidden && metadata.hidden) {
          return null;
        }
        
        return {
          metadata,
          content
        };
      } catch (error) {
        console.error(`Error processing markdown post ${slug}:`, error);
      }
    }

    // Try React component
    const reactPath = path.join(postsDirectory, `${slug}.tsx`);
    if (fs.existsSync(reactPath)) {
      const metadata = REACT_POSTS[slug];

      if (metadata) {
        if (!allowHidden && metadata.hidden) {
          return null;
        }

        return {
          metadata,
          content: '',
        };
      }
    }
  } catch (error) {
    console.error(`Error in getPostBySlug for ${slug}:`, error);
  }

  console.log('Post not found for slug:', slug);
  return null;
}
