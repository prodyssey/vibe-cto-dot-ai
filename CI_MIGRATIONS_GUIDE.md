# Supabase Migrations CI Integration Guide

This document explains how to integrate automatic Supabase migration application into your CI/CD workflows.

## Overview

The migration system ensures that new Supabase migrations are automatically applied during CI builds, but only if they haven't been applied already. This is essential for deploy previews that are pointed at production databases.

## How It Works

1. **Migration Script**: `scripts/apply-migrations.js` reads migration files from `supabase/migrations/`
2. **Tracking**: Uses a `schema_migrations` table to track which migrations have been applied
3. **Safety**: Only applies migrations that haven't been applied yet
4. **CI Integration**: Runs before tests to ensure database schema is up-to-date

## Setup Requirements

### Environment Variables

Add these environment variables to your CI environment:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**⚠️ Important**: Use the **Service Role Key**, not the anon key, as this script needs admin privileges to:
- Create/modify database schema
- Insert records into `schema_migrations` table
- Execute DDL statements

### Database Setup

The script will attempt to create the tracking table automatically, but you may need to create it manually:

```sql
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

GRANT SELECT, INSERT ON public.schema_migrations TO anon, authenticated;
```

## Integration with CI Workflows

### GitHub Actions Integration

Add the migration step to your workflow **before** running tests:

```yaml
name: CI Tests
on: [push, pull_request]

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    # 🆕 Apply Supabase migrations before tests
    - name: Apply Supabase migrations
      run: npm run migrate
      env:
        SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}

    - name: Run tests
      run: npm run test:run
      env:
        VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

    - name: Build project
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

### Recommended Workflow Updates

Update your existing workflows by adding the migration step:

#### For `main-branch-tests.yml`:
```yaml
# Add after "Install dependencies" step
- name: Apply Supabase migrations
  run: npm run migrate
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

#### For `pr-tests.yml`:
```yaml
# Add after "Install dependencies" step in both 'test' and 'test-forms' jobs
- name: Apply Supabase migrations
  run: npm run migrate
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
```

## Usage

### Manual Migration Application

To manually apply migrations:

```bash
# Set environment variables
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Run migrations
npm run migrate
```

### Adding New Migrations

1. Create a new migration file in `supabase/migrations/` with the format: `YYYYMMDDHHMMSS_description.sql`
2. The migration will be automatically applied in the next CI run
3. The script tracks applied migrations, so it's safe to run multiple times

## Migration File Format

Migration files should follow this naming convention:
```
20250906120000_add_new_table.sql
20250906120001_update_existing_table.sql
```

The timestamp prefix ensures chronological order.

## Security Considerations

1. **Service Role Key**: Keep this secret and only use in trusted CI environments
2. **Environment Variables**: Store as encrypted secrets in your CI system
3. **Migration Content**: Review migrations carefully as they execute with admin privileges
4. **Rollback**: This script doesn't handle rollbacks - plan migrations carefully

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**: Script will exit with clear error message
2. **Permission Errors**: Ensure service role key has necessary permissions
3. **Migration Failures**: Check migration SQL syntax and dependencies
4. **Table Creation**: If `schema_migrations` table creation fails, create it manually

### Debugging

Enable verbose logging by modifying the script to log more details:

```bash
# Add DEBUG=1 to see more output
DEBUG=1 npm run migrate
```

### Manual Verification

Check applied migrations:

```sql
SELECT * FROM public.schema_migrations ORDER BY applied_at DESC;
```

## Integration with Deploy Previews

For deploy previews that use the production database:

1. Migrations run automatically before tests
2. Only new migrations are applied
3. Database schema stays consistent across deploys
4. No risk of duplicate migration application

This ensures that your deploy previews have the latest database schema and tests run successfully against the correct database structure.

## Best Practices

1. **Test Migrations**: Test migrations in a staging environment first
2. **Backup Strategy**: Ensure database backups before applying migrations in production
3. **Rollback Plan**: Have a plan for rolling back breaking changes
4. **Review Process**: Review migration files as part of code review
5. **Environment Parity**: Keep staging and production schemas in sync

## Future Enhancements

Potential improvements to consider:

- Add rollback functionality
- Support for migration dependencies
- Dry-run mode for testing
- Integration with Supabase CLI
- Migration validation before application