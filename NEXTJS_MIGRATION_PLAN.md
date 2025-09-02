# Next.js Migration Plan: Vite React → Next.js 15+ App Router

## Executive Summary

This document outlines a comprehensive step-by-step plan to migrate the VibeCTO.ai website from Vite-hosted React to **Next.js 15+ using the modern App Router**. The migration will enable backend API routes, static site generation (SSG), server-side rendering (SSR), and improved SEO capabilities while preserving all existing functionality.

> **Important**: This migration specifically targets **Next.js 15+ (latest stable)** with the **App Router architecture**. We will NOT use the legacy Pages Router - this is a modern migration to the current recommended Next.js approach.

## Current Architecture Analysis

### Current Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite with SWC
- **Routing**: React Router v6 (client-side routing)
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **State Management**: React Query, Zustand
- **Styling**: Tailwind CSS with custom glass morphism design
- **Backend**: Supabase (database, auth, storage)
- **Testing**: Vitest + React Testing Library
- **Hosting**: Netlify (static hosting)

### Current Structure
```
src/
├── pages/ (React components, not Next.js pages)
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── sections/ (page sections)
│   └── adventure/ (complex interactive game)
├── lib/ (utilities)
├── hooks/
├── integrations/supabase/
└── content/posts/ (markdown blog posts)
```

### Key Features to Preserve
1. **Interactive Adventure Game**: Complex state management and animations
2. **Marketing Pages**: Landing, Ignition, Launch Control, Transformation
3. **Blog/Resources**: Markdown-based content system
4. **Email Opt-ins**: Multiple forms with Supabase integration
5. **Qualification Forms**: Complex multi-step forms
6. **SEO Optimization**: Current helmet-async setup
7. **Analytics**: Google Analytics integration
8. **Responsive Design**: Mobile-optimized with glass morphism

## Migration Strategy

### Phase 1: Project Setup and Next.js Installation (2-3 hours)

#### Step 1.1: Install Latest Stable Next.js 15+ with App Router
```bash
# Backup current project
cp -r . ../vibe-cto-backup

# Install the LATEST STABLE Next.js 15+ with React 19+
npm install next@latest react@latest react-dom@latest

# Verify versions (should be Next.js 15+ and React 19+)
npm list next react react-dom
```

> **Critical**: We are explicitly using `next@latest` to get Next.js 15+ (latest stable version) with App Router as the default and primary routing system.

#### Step 1.2: Update Package.json Scripts
Replace current scripts with:
```json
{
  "scripts": {
    "dev": "next dev -p 8080",
    "build": "next build",
    "start": "next start -p 8080",
    "lint": "next lint",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "export": "next export"
  }
}
```

#### Step 1.3: Install Additional Dependencies
```bash
# Keep existing dependencies that are Next.js compatible
npm install @tanstack/react-query @radix-ui/* lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install @supabase/supabase-js zod zustand

# Next.js specific additions
npm install next-themes
npm install @next/bundle-analyzer (optional)

# Remove Vite-specific dependencies
npm uninstall vite @vitejs/plugin-react-swc vite-plugin-*
npm uninstall react-router-dom react-helmet-async
```

### Phase 2: Configuration Migration (2-3 hours)

#### Step 2.1: Create next.config.js for Next.js 15+ App Router
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is STABLE and DEFAULT in Next.js 15+ - no experimental flag needed
  // appDir: true is no longer needed - App Router is the default
  
  images: {
    domains: ['zfuokpddfofaneazfrhf.supabase.co'],
    // For static export compatibility
    unoptimized: true
  },
  
  // Enable static export for current hosting setup (if needed)
  output: 'export',
  trailingSlash: true,
  
  // Next.js 15+ specific optimizations
  experimental: {
    // Enable any Next.js 15+ experimental features if needed
    staleTimes: {
      dynamic: 30,
      static: 180
    }
  }
}

module.exports = nextConfig
```

> **Important**: In Next.js 15+, the App Router is stable and the default - no `experimental.appDir` flag is needed.

#### Step 2.2: Update Tailwind Configuration for App Router
Update `tailwind.config.ts` content paths for App Router structure:
```typescript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',        // App Router pages and layouts
  './components/**/*.{js,ts,jsx,tsx,mdx}', // Global components
  './lib/**/*.{js,ts,jsx,tsx,mdx}',        // Utility functions with JSX
  // Remove './pages/**/*' - we're using App Router, not Pages Router
],
```

> **Key Change**: We're focusing on `./app/**/*` for the App Router and removing any references to `./pages/**/*` since we're not using the legacy Pages Router.

#### Step 2.3: Create TypeScript Configuration for Next.js
Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*", "./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Phase 3: App Router File Structure Creation (3-4 hours)

#### Step 3.1: Create Next.js 15+ App Router Directory Structure
```
app/                              # App Router root (Next.js 15+ standard)
├── layout.tsx                    # Root layout (REQUIRED in App Router)
├── page.tsx                      # Homepage route (/)
├── globals.css                   # Global styles (moved from src/index.css)
├── loading.tsx                   # Global loading UI (optional)
├── not-found.tsx                 # Global 404 page (optional)
├── error.tsx                     # Global error boundary (optional)
│
├── ignition/                     # Route: /ignition
│   └── page.tsx
├── launch-control/               # Route: /launch-control  
│   └── page.tsx
├── transformation/               # Route: /transformation
│   └── page.tsx
├── adventure/                    # Route: /adventure
│   └── page.tsx
│
├── resources/                    # Route: /resources
│   ├── page.tsx                  # Resources listing
│   └── [slug]/                   # Dynamic route: /resources/[slug]
│       ├── page.tsx              # Individual resource page
│       └── loading.tsx           # Loading UI for dynamic pages
│
└── api/                          # API Routes (App Router style)
    ├── forms/
    │   └── route.ts              # POST /api/forms
    └── analytics/
        └── route.ts              # POST /api/analytics
```

> **App Router Architecture**: This structure follows Next.js 15+ App Router conventions where:
> - Each folder represents a route segment
> - `page.tsx` files make routes publicly accessible
> - `layout.tsx` files create nested layouts
> - API routes use `route.ts` files (not `pages/api/*`)

#### Step 3.2: Move Components
- Keep `components/` directory as-is (Next.js compatible)
- Move `src/lib/` to `lib/`
- Move `src/hooks/` to `hooks/`
- Move `src/integrations/` to `integrations/`
- Update all import paths to remove `/src` prefix

#### Step 3.3: Handle Static Assets
- Keep `public/` directory as-is
- Update image imports to use Next.js `Image` component where beneficial

### Phase 4: App Router Implementation (4-5 hours)

#### Step 4.1: Create Root Layout (Required for App Router)
Create `app/layout.tsx` - **This is REQUIRED in App Router**:
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VibeCTO.ai - From ideas to product',
  description: 'Elite AI augmented engineering and vibe coding guidance',
}

// Root Layout is REQUIRED in App Router - replaces _app.js and _document.js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

> **Critical**: The root `layout.tsx` is **REQUIRED** in App Router and must contain `<html>` and `<body>` tags. It replaces both `_app.js` and `_document.js` from Pages Router.

#### Step 4.2: Create Providers Component
Create `app/providers.tsx`:
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {children}
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  )
}
```

#### Step 4.3: Convert Page Components
Transform each page from `src/pages/*.tsx` to `app/*/page.tsx`:

Example for homepage (`app/page.tsx`):
```typescript
import { Navigation } from '@/components/Navigation'
import { Hero } from '@/components/sections/Hero'
// ... other imports

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      <div className="pt-20">
        <Hero />
        {/* ... other sections */}
      </div>
    </div>
  )
}
```

#### Step 4.4: Update Navigation for App Router
Update `components/Navigation.tsx` for App Router:
- Replace `react-router-dom` with App Router navigation
- Use `next/link` for navigation links  
- Use `next/navigation` hooks for programmatic navigation

**Key App Router Navigation Changes**:
```typescript
// OLD (React Router):
import { useNavigate, Link } from 'react-router-dom'
const navigate = useNavigate()
<Link to="/ignition">Ignition</Link>

// NEW (App Router):
import { useRouter } from 'next/navigation'
import Link from 'next/link'
const router = useRouter()
<Link href="/ignition">Ignition</Link>
```

> **Important**: App Router uses different navigation patterns than React Router. All navigation must be updated to use Next.js 15+ App Router APIs.

### Phase 5: App Router SEO and Metadata (2-3 hours)

#### Step 5.1: Implement App Router Metadata API
Remove `react-helmet-async` and use App Router's built-in Metadata API:

```typescript
// app/ignition/page.tsx
import type { Metadata } from 'next'

// App Router Metadata API - much more powerful than React Helmet
export const metadata: Metadata = {
  title: 'Ignition Program - VibeCTO.ai',
  description: 'Educational program for AI-powered development',
  keywords: ['AI development', 'programming', 'engineering'],
  openGraph: {
    title: 'Ignition Program - VibeCTO.ai',
    description: 'Educational program for AI-powered development',
    images: ['/vibe-cto-og.png'],
    url: 'https://vibecto.ai/ignition',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ignition Program - VibeCTO.ai',
    description: 'Educational program for AI-powered development',
    images: ['/vibe-cto-og.png'],
  },
}
```

> **Advantage**: App Router's Metadata API is more powerful than React Helmet and provides better SEO optimization out of the box.

#### Step 5.2: Create Dynamic SEO Component (Optional)
For dynamic metadata based on content:
```typescript
// app/resources/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Fetch post data
  const post = await getPost(params.slug)
  
  return {
    title: `${post.title} - VibeCTO.ai`,
    description: post.description,
  }
}
```

### Phase 6: App Router API Routes (3-4 hours)

#### Step 6.1: Create App Router API Routes
Create `app/api/forms/route.ts` using App Router API conventions:

```typescript
import { NextRequest, NextResponse } from 'next/server'

// App Router API Routes use named exports for HTTP methods
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { formType, data } = body
    
    // Handle different form types
    switch (formType) {
      case 'ignition-qualification':
        // Handle ignition form submission
        const result = await handleIgnitionForm(data)
        return NextResponse.json({ success: true, result })
        
      case 'launch-control-qualification':
        // Handle launch control form submission
        const lcResult = await handleLaunchControlForm(data)
        return NextResponse.json({ success: true, result: lcResult })
        
      default:
        return NextResponse.json({ error: 'Invalid form type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// App Router API Routes can also handle other methods
export async function GET() {
  return NextResponse.json({ message: 'Forms API endpoint' })
}
```

> **App Router API**: Uses `route.ts` files with named exports (`GET`, `POST`, etc.) instead of default exports like Pages Router.

#### Step 6.2: Create Analytics API
Create `app/api/analytics/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Handle analytics events
  // Could integrate with GA4, PostHog, etc.
  return NextResponse.json({ received: true })
}
```

### Phase 7: Blog/Resources Migration (2-3 hours)

#### Step 7.1: Set Up MDX Support
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install gray-matter remark remark-gfm rehype-highlight
```

#### Step 7.2: Create MDX Configuration
Add to `next.config.js`:
```javascript
const withMDX = require('@next/mdx')({
  options: {
    remarkPlugins: [require('remark-gfm')],
    rehypePlugins: [require('rehype-highlight')],
  }
})

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // ... other config
})
```

#### Step 7.3: Create Blog API Functions
Create `lib/blog.ts`:
```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const fileNames = fs.readdirSync(postsDirectory)
  
  const allPostsData = fileNames
    .filter(name => name.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug,
        content,
        ...data
      }
    })
    
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1))
}
```

### Phase 8: Component Updates (4-6 hours)

#### Step 8.1: Update Client Components
Add `'use client'` directive to components that use:
- React hooks (useState, useEffect, etc.)
- Event handlers
- Browser APIs
- Client-side routing

Example:
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function InteractiveComponent() {
  // Component code
}
```

#### Step 8.2: Update Adventure Game
The adventure game will need special attention:
- Add `'use client'` to all interactive components
- Ensure Zustand store works with Next.js
- Test sound manager and animations
- Verify localStorage usage

#### Step 8.3: Update Form Components
- Replace form submission logic to use new API routes
- Update error handling for server-side validation
- Maintain existing UX patterns

### Phase 9: Environment and Configuration (1-2 hours)

#### Step 9.1: Environment Variables
Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://zfuokpddfofaneazfrhf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key (for API routes)
```

#### Step 9.2: Update Supabase Client
Create separate clients for client and server:

`lib/supabase/client.ts`:
```typescript
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
export const supabase = createClientComponentClient()
```

`lib/supabase/server.ts`:
```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
export const createServerClient = () => createServerComponentClient({ cookies })
```

### Phase 10: Testing and Deployment (3-4 hours)

#### Step 10.1: Update Testing Configuration
Update `vitest.config.ts` to handle Next.js:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

#### Step 10.2: Run Tests
```bash
npm run test:run
npm run lint
npm run build
```

#### Step 10.3: Deployment Options

**Option A: Static Export (Current Netlify Setup)**
```javascript
// next.config.js
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  // ... other config
}
```

**Option B: Vercel (Recommended for Full Next.js Features)**
- Deploy to Vercel for automatic optimizations
- Enable API routes and ISR capabilities
- Set up environment variables in Vercel dashboard

**Option C: Self-hosted with Node.js**
- Use `npm run build && npm run start`
- Set up reverse proxy (Nginx)
- Configure PM2 for process management

## Migration Timeline

| Phase | Estimated Time | Dependencies |
|-------|---------------|--------------|
| 1. Project Setup | 2-3 hours | - |
| 2. Configuration | 2-3 hours | Phase 1 |
| 3. File Structure | 3-4 hours | Phase 1-2 |
| 4. Routing | 4-5 hours | Phase 3 |
| 5. SEO/Metadata | 2-3 hours | Phase 4 |
| 6. API Routes | 3-4 hours | Phase 4 |
| 7. Blog/Resources | 2-3 hours | Phase 4 |
| 8. Components | 4-6 hours | Phase 4-7 |
| 9. Environment | 1-2 hours | Phase 8 |
| 10. Testing/Deploy | 3-4 hours | Phase 9 |

**Total Estimated Time: 26-37 hours**

## Risk Assessment and Mitigation

### High Risk Areas
1. **Adventure Game Complexity**: Complex state management and animations
   - **Mitigation**: Test thoroughly, consider breaking into smaller components
   
2. **Form Submissions**: Multiple integration points with Supabase
   - **Mitigation**: Create comprehensive API route tests
   
3. **SEO Impact**: Changing from SPA to potentially SSG/SSR
   - **Mitigation**: Implement proper redirects, maintain URL structure

### Medium Risk Areas
1. **Build Process**: New build system and dependencies
   - **Mitigation**: Keep backup, test builds frequently
   
2. **Performance**: Bundle size and loading times
   - **Mitigation**: Use Next.js bundle analyzer, implement code splitting

### Low Risk Areas
1. **UI Components**: shadcn/ui is Next.js compatible
2. **Styling**: Tailwind CSS works identically
3. **TypeScript**: Minimal changes needed

## Post-Migration Benefits (Next.js 15+ App Router)

### Immediate App Router Benefits
- **Built-in API Routes**: Full-stack capabilities with `route.ts` files
- **Superior SEO**: Server Components + Metadata API for better search rankings
- **Automatic Image Optimization**: Next.js `Image` component with built-in optimizations
- **Better Performance**: Automatic code splitting, prefetching, and caching
- **React 19 Support**: Latest React features and optimizations

### Advanced App Router Capabilities
- **Server Components**: Render on the server for better performance and SEO
- **Streaming**: Progressive UI loading with React Suspense
- **Incremental Static Regeneration**: Hybrid static/dynamic content generation
- **Route Handlers**: Modern API design with Web APIs (Request/Response)
- **Middleware**: Edge middleware for authentication, redirects, etc.
- **Parallel Routes**: Advanced UI patterns with simultaneous route rendering

### Developer Experience Improvements
- **File-based App Router**: Intuitive folder = route structure
- **TypeScript-first**: Better type safety with less configuration
- **Enhanced Dev Tools**: Better error messages and debugging
- **Modern React Patterns**: Server/Client Components, Suspense boundaries
- **Built-in Optimizations**: Automatic bundling, minification, and performance optimizations

> **Key Advantage**: App Router represents the future of Next.js development with modern React patterns and superior performance characteristics.

## Rollback Plan

1. Keep current Vite build in separate branch
2. Maintain current Netlify deployment during migration
3. Test new Next.js build on staging environment
4. Switch DNS/deployment atomically
5. Keep ability to quickly rollback via deployment revert

## Success Criteria

- [ ] All existing pages render correctly
- [ ] Adventure game functions identically  
- [ ] All forms submit successfully
- [ ] SEO metadata is preserved/improved
- [ ] Page load times are equal or better
- [ ] All tests pass
- [ ] Build process completes successfully
- [ ] Mobile responsiveness maintained
- [ ] Analytics continue working

This migration plan provides a systematic approach to converting the VibeCTO.ai website from Vite React to **Next.js 15+ with App Router** while preserving all functionality and gaining access to modern React patterns, superior performance, and full-stack capabilities.

## Next Steps After Reading This Plan

1. **Review and Approve**: Go through each phase and understand the architectural changes
2. **Set Up Development Environment**: Ensure you have Node.js 18.17+ for Next.js 15+
3. **Create Feature Branch**: `git checkout -b feat/nextjs-15-app-router-migration`
4. **Start with Phase 1**: Begin with Next.js 15+ installation and configuration
5. **Test Incrementally**: Test each phase thoroughly before moving to the next

> **Final Note**: This migration takes you from a Vite SPA to a modern Next.js 15+ App Router application - you'll gain server-side capabilities, better SEO, improved performance, and access to the latest React 19 features while maintaining all existing functionality.