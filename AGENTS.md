# Repository Guidelines

## Project Structure & Module Organization
- The Next.js 15 App Router lives in `app/`; colocate layouts, route handlers, and server actions there, adding `"use client"` only when interactive UI is required.
- Shared modules stay in `src/`: `components/`, `hooks/`, `lib/`, `config/`, `types/`, `integrations/`, plus markdown-driven content in `src/content/`.
- Resources render through `app/resources`, pulling Markdown posts and interactive `.tsx` entries (e.g., `src/content/posts/interactive-demo.tsx`).
- Unit helpers live in `src/test/`; Playwright specs in `tests/e2e/`; assets in `public/`; automation scripts in `scripts/`.

## Build, Test, and Development Commands
- `npm run dev` starts Next with Turbopack; `npm run dev:local` also boots Supabase.
- `npm run build` runs image checks then `next build`; `npm run build:skip-images` skips validation when needed.
- Serve production bundles via `npm run start` or `npm run preview`.
- Asset utilities: `npm run generate-sitemap`, `npm run generate-og-image`, `npm run optimize-images`.
- Quality gates: `npm run lint`, `npm test` / `npm run test:run`, `npm run test:coverage`, `npm run test:ui`.
- End-to-end coverage: `npm run test:e2e` with headed/debug/report variants.

## Coding Style & Naming Conventions
- Prefer server components and TypeScript-first modules; promote to client components only when stateful UI demands.
- Filenames: components/pages in PascalCase, hooks camelCase prefixed with `use`, utilities camelCase; import shared code through the `@/` alias.
- Favor `const`, strict equality, accessible keys, and tight Tailwind stacks. Markdown resources follow the same linted formatting rules.

## Testing Guidelines
- Vitest + Testing Library (`jsdom`) power unit and integration suites from `src/test/setup.ts`.
- Name specs `*.test.ts(x)` and colocate them with the feature; reuse helpers from `src/test/`.
- Run `npm run test:coverage` before a PR and extend Playwright coverage when flows span routes or Supabase interactions.

## Commit & Pull Request Guidelines
- Use Conventional Commits (e.g., `feat(nav): add Services dropdown`).
- Reference the synced GitHub issue and matching Linear ticket (`VIB-123`) in titles or descriptions, e.g., `Closes #456 (VIB-123)`.
- PRs should summarize intent, attach UI screenshots or GIFs when visuals change, and note Supabase schema or env updates.
- Confirm `npm run build`, `npm run lint`, Vitest, and Playwright suites pass before requesting review.

## Security & Configuration Tips
- Copy `.env.example` to `.env`, keep credentials local, and review RLS plus generated types in `supabase/` after schema updates.
- Expose only intentional client `SUPABASE_*` keys, keep Sentry instrumentation (`instrumentation*.ts`) unless debugging, and ship with the headers defined in `netlify.toml` and `SECURITY_HEADERS.md`.
