# Supabase Environment Setup Guide

This guide explains how to configure Supabase environments for local development, testing, and Vercel production deployment.

## Overview

The application uses different Supabase configurations for each environment:

- **Local Development**: Uses Supabase CLI local instance (`supabase start`)
- **Testing**: Uses mock data in CI/CD pipelines
- **Production**: Uses Vercel environment variables with hosted Supabase

## Quick Start for Local Development

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Start local Supabase**:
   ```bash
   npm run db:start
   # or directly: supabase start
   ```

3. **Copy environment file**:
   ```bash
   cp .env.example .env.local
   ```
   The example already has the correct local Supabase values.

4. **Run development server**:
   ```bash
   npm run dev:local
   # or: npm run dev (if Supabase is already running)
   ```

## Environment Configurations

### Local Development (.env.local)
```bash
# Local Supabase (via supabase start)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDE3NjkxNTAsImV4cCI6MTk1NzE0NTE1MH0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY0MTc2OTE1MCwiZXhwIjoxOTU3MTQ1MTUwfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q
NODE_ENV=development
```
*These are the standard local Supabase credentials - safe to commit.*

### Production (Vercel Environment Variables)
Set these in your Vercel dashboard:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
NODE_ENV=production
```

## Available Scripts

### Database Management
```bash
# Start local Supabase
npm run db:start

# Stop local Supabase
npm run db:stop

# Reset local database
npm run db:reset

# Apply migrations to local DB
npm run db:migrate

# Generate TypeScript types from local schema
npm run db:types
```

### Development
```bash
# Start dev server with local Supabase
npm run dev:local

# Regular dev server (assumes Supabase is running)
npm run dev
```

## Database Schema Management

### Initial Setup
1. Start local Supabase: `npm run db:start`
2. Your existing migrations in `supabase/migrations/` will be applied automatically
3. Generate types: `npm run db:types`

### Making Schema Changes
1. Create migration: `supabase migration new your_migration_name`
2. Apply locally: `npm run db:migrate`
3. Update types: `npm run db:types`
4. Deploy to production via Supabase dashboard or CLI

## Vercel Deployment

### Setup
1. **Connect to Vercel**: Link your repository to Vercel
2. **Set Environment Variables** in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for server-side operations)

### Configuration
- `vercel.json` is configured with security headers
- Build settings are automatically detected from Next.js
- Environment variables are set per environment (preview/production)

## Testing

### Unit Tests
Tests use mock Supabase data (not local instance):
```bash
npm run test:run
npm run test:coverage
```

### E2E Tests
For E2E tests that need database access:
1. Start local Supabase: `npm run db:start`  
2. Run tests: `npm run test:e2e`

## Troubleshooting

### Local Development Issues

**"Connection failed" errors:**
1. Ensure Docker is running
2. Start Supabase: `npm run db:start`
3. Check if port 54321 is available

**Schema out of sync:**
1. Reset database: `npm run db:reset`
2. Regenerate types: `npm run db:types`

**Migration issues:**
```bash
# Reset and reapply all migrations
npm run db:migrate
```

### Production Issues

**Build failing on Vercel:**
1. Verify environment variables are set in Vercel dashboard
2. Check build logs for missing variables
3. Ensure production Supabase project is accessible

## Migration from Remote to Local Development

If you were previously using a remote Supabase project for development:

1. **Back up your data** (if needed) from the remote project
2. **Update .env.local** to use local settings (already done if using .env.example)
3. **Apply your migrations** to local: `npm run db:start && npm run db:migrate`
4. **Seed data** if needed via Supabase dashboard at http://localhost:54323

## Security Notes

- ✅ Local development credentials are safe to commit (they're demo keys)
- ⚠️ Never commit production credentials
- ✅ Service role keys are only used server-side
- ✅ All environments properly isolated