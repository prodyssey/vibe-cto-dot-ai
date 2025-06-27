# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
- `npm run dev` - Start development server on port 8080
- `npm run build` - Create production build
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Installation
- `npm install` - Install all dependencies

## Architecture Overview

This is a React + TypeScript marketing website built with Vite and styled using Tailwind CSS and shadcn/ui components.

### Key Technical Details
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast HMR
- **UI Library**: shadcn/ui (Radix UI primitives + Tailwind)
- **Styling**: Tailwind CSS with custom glass morphism design
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)
- **Path Aliases**: `@/` maps to `./src/`

### Project Structure
- `/src/pages/` - Page components (Index, Ignition, LaunchControl)
- `/src/components/ui/` - Reusable shadcn/ui components
- `/src/components/sections/` - Page-specific section components
- `/src/lib/utils.ts` - Utility functions (mainly `cn` for classnames)

### Routing
- `/` - Landing page
- `/ignition` - Educational program page
- `/launch-control` - Consulting services page

## Important Context

### Lovable Platform Integration
This project was created with Lovable.dev. Changes made through the Lovable platform are automatically committed to this repository.

### No Backend
This is a static marketing website with no API integrations or backend services. All content is hardcoded in the components.

### Design Patterns
- Uses modern React functional components with hooks
- Consistent glass morphism design with dark theme
- Purple/blue gradient accents throughout
- Card-based layouts with subtle borders and backdrop blur effects

### Component Conventions
- All components use TypeScript
- UI components from shadcn/ui should be used when available
- Follow existing naming patterns (PascalCase for components, camelCase for functions)
- Maintain consistent spacing using Tailwind classes