# Repository Guidelines

## Project Structure & Module Organization
- `src/`: App code. Key folders: `components/` (reusable UI), `pages/` (route views), `lib/` (utilities), `hooks/`, `config/`, `types/`, `content/`.
- `public/`: Static assets and generated artifacts (e.g., `sitemap.xml`).
- `scripts/`: Maintenance scripts (e.g., `scripts/generate-sitemap.js`).
- `docs/`: Project documentation; `supabase/`: Supabase config; `dist/`: build output.

## Build, Test, and Development Commands
- `npm run dev`: Start Vite dev server.
- `npm run build`: Generate production build (runs sitemap then `vite build`).
- `npm run build:dev`: Development-mode build (useful for local perf testing).
- `npm run preview`: Preview the built app locally.
- `npm run lint`: Run ESLint per `eslint.config.js`.
- `npm test` | `npm run test:run`: Run Vitest; `npm run test:ui` opens the UI.
- `npm run test:coverage`: Run tests with coverage reports.
- `npm run generate-sitemap`: Regenerate `public/sitemap.xml` from route/content.

## Coding Style & Naming Conventions
- Language: TypeScript + React. Import alias `@/` maps to `src/`.
- Components/Pages: PascalCase files (e.g., `src/components/NavBar.tsx`, `src/pages/About.tsx`).
- Hooks: camelCase starting with `use` (e.g., `useFeatureFlag.ts`).
- Utilities: camelCase in `src/lib/`.
- Linting: ESLint with React, TypeScript, a11y plugins. Some TS strict rules are relaxed; prefer `const`, `eqeqeq`, and React key/a11y hygiene per config.
- Styling: Tailwind CSS + shadcn/ui components. Keep class names concise and composable.

## Testing Guidelines
- Framework: Vitest + Testing Library (`jsdom`). Setup in `src/test/setup.ts`.
- Location: Prefer colocated `*.test.ts(x)` near source or under `src/test/`.
- Coverage: Generated via V8; excludes config files and `src/test/` helpers.
- Run: `npm test` during development; `npm run test:coverage` before PRs.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits when possible (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`). Example: `feat(nav): add Services dropdown`.
- PRs: Provide clear description, linked issues (e.g., `Closes #123`), screenshots/GIFs for UI changes, and checklist: builds locally, tests/coverage pass, lint is clean.

## Security & Configuration Tips
- Env: Copy `.env.example` → `.env`; never commit secrets.
- Supabase: Review `SUPABASE_*` docs and RLS audit files; keep anon keys in client only when intended.
- Headers/Hosting: See `netlify.toml` and `SECURITY_HEADERS.md` for recommended defaults.
