# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on port 8080 with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server on port 8080
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally (alias for start)

### Testing Commands
- `npm run test` - Run tests in watch mode with Vitest
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report

### Installation
- `npm install` - Install all dependencies (automatically sets up git hooks via husky)

### Git Hooks
The project uses Husky + lint-staged for automated code quality checks:
- **Pre-commit hook**: Automatically runs ESLint on staged TypeScript/JavaScript files
- **Automatic setup**: Git hooks are installed automatically when running `npm install`
- **Performance optimized**: Only runs checks on files that are being committed

## Architecture Overview

This is a React + TypeScript marketing website built with Next.js 15 App Router and styled using Tailwind CSS and shadcn/ui components.

### Key Technical Details
- **Framework**: Next.js 15 with App Router and React 19
- **Build Tool**: Next.js with Turbopack for fast development
- **UI Library**: shadcn/ui (Radix UI primitives + Tailwind)
- **Styling**: Tailwind CSS with custom glass morphism design and animations
- **State Management**: TanStack Query (React Query) + Zustand for game state
- **Database**: Supabase with Row Level Security (RLS)
- **Testing**: Vitest with jsdom environment
- **Path Aliases**: `@/` maps to `./src/` and `@/app` maps to `./app/`

### Project Structure
- `/app/` - Next.js App Router pages and layouts
  - `/app/page.tsx` - Landing page
  - `/app/ignition/` - Educational program page
  - `/app/launch-control/` - Consulting services page
  - `/app/adventure/` - Interactive adventure game
  - `/app/resources/` - Blog/resources section
- `/src/components/ui/` - Reusable shadcn/ui components
- `/src/components/sections/` - Page-specific section components
- `/src/components/adventure/` - Complex adventure game system with scenes, animations, and sound
- `/src/integrations/supabase/` - Supabase client and type definitions
- `/src/lib/utils.ts` - Utility functions (mainly `cn` for classnames)

### Adventure Game Architecture
The adventure game is a complex interactive system with:
- **Scene-based navigation**: Multiple branching paths (Ignition, Launch Control, Transformation)
- **State management**: Zustand store for game state, session tracking
- **Supabase integration**: User sessions, form submissions, progress tracking with RLS
- **Sound system**: Custom sound manager with multiple audio effects
- **Animations**: Custom Tailwind animations and React components
- **Mobile optimization**: Responsive design with mobile-specific components

### Database Integration
- **Supabase**: PostgreSQL with Row Level Security
- **Tables**: adventure_sessions, scene_visits, ignition_waitlist, launch_control_waitlist, etc.
- **RLS Policies**: Session-based access control for user data privacy
- **Type Safety**: Auto-generated TypeScript types from database schema

## Important Context

### Next.js 15 Migration
The project was migrated from Vite to Next.js 15 for better performance and full-stack capabilities. Key changes:
- App Router structure instead of pages router
- Server-side rendering capabilities
- Image optimization (currently disabled for static export compatibility)
- Experimental features enabled (staleTimes for router caching)

### Lovable Platform Integration
This project was created with Lovable.dev. Changes made through the Lovable platform are automatically committed to this repository.

### Design Patterns
- Uses modern React functional components with hooks
- Consistent glass morphism design with dark theme
- Purple/blue gradient accents throughout
- Card-based layouts with subtle borders and backdrop blur effects
- Custom Tailwind animations (twinkle, float, neon, fadeIn, scroll)

### Component Conventions
- All components use TypeScript with strict mode
- UI components from shadcn/ui should be used when available
- Follow existing naming patterns (PascalCase for components, camelCase for functions)
- Maintain consistent spacing using Tailwind classes
- Adventure game components follow modular scene-based architecture