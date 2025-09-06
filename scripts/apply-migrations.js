#!/usr/bin/env node

/**
 * Supabase Migration Application Script
 * 
 * This script applies new Supabase migrations during CI builds.
 * It only applies migrations that haven't been applied yet by checking
 * the schema_migrations table.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

/**
 * Ensures the schema_migrations table exists
 */
async function ensureSchemaMigrationsTable() {
  const { error } = await supabase.rpc('exec', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Grant necessary permissions
      GRANT SELECT, INSERT ON public.schema_migrations TO anon, authenticated;
    `
  });

  if (error) {
    // If rpc doesn't work, try direct SQL execution
    const { error: directError } = await supabase.from('schema_migrations').select('version').limit(1);
    if (directError && directError.message.includes('does not exist')) {
      console.log('⚠️  schema_migrations table does not exist. Please create it manually:');
      console.log(`
        CREATE TABLE IF NOT EXISTS public.schema_migrations (
          version VARCHAR(255) PRIMARY KEY,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        GRANT SELECT, INSERT ON public.schema_migrations TO anon, authenticated;
      `);
      process.exit(1);
    }
  }
}

/**
 * Gets list of applied migrations from the database
 */
async function getAppliedMigrations() {
  const { data, error } = await supabase
    .from('schema_migrations')
    .select('version');

  if (error) {
    console.error('❌ Error fetching applied migrations:', error.message);
    throw error;
  }

  return new Set(data.map(row => row.version));
}

/**
 * Gets list of migration files from the filesystem
 */
function getMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log('📁 No migrations directory found at:', MIGRATIONS_DIR);
    return [];
  }

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Ensure chronological order

  return files.map(file => ({
    version: path.parse(file).name,
    filename: file,
    filepath: path.join(MIGRATIONS_DIR, file)
  }));
}

/**
 * Applies a single migration
 */
async function applyMigration(migration) {
  const sql = fs.readFileSync(migration.filepath, 'utf8');
  
  console.log(`📦 Applying migration: ${migration.filename}`);
  
  // Execute the migration SQL
  const { error: migrationError } = await supabase.rpc('exec', {
    sql: sql
  });

  if (migrationError) {
    console.error(`❌ Error applying migration ${migration.filename}:`, migrationError.message);
    throw migrationError;
  }

  // Record the migration as applied
  const { error: recordError } = await supabase
    .from('schema_migrations')
    .insert({ version: migration.version });

  if (recordError) {
    console.error(`❌ Error recording migration ${migration.filename}:`, recordError.message);
    throw recordError;
  }

  console.log(`✅ Successfully applied: ${migration.filename}`);
}

/**
 * Main migration application logic
 */
async function applyMigrations() {
  try {
    console.log('🚀 Starting migration process...');
    
    // Ensure schema_migrations table exists
    await ensureSchemaMigrationsTable();
    
    // Get applied migrations from database
    const appliedMigrations = await getAppliedMigrations();
    console.log(`📊 Found ${appliedMigrations.size} already applied migrations`);
    
    // Get migration files from filesystem
    const migrationFiles = getMigrationFiles();
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    
    // Filter out already applied migrations
    const pendingMigrations = migrationFiles.filter(
      migration => !appliedMigrations.has(migration.version)
    );
    
    if (pendingMigrations.length === 0) {
      console.log('✅ All migrations are already applied. Nothing to do.');
      return;
    }
    
    console.log(`📦 Applying ${pendingMigrations.length} new migrations...`);
    
    // Apply each pending migration in order
    for (const migration of pendingMigrations) {
      await applyMigration(migration);
    }
    
    console.log(`🎉 Successfully applied ${pendingMigrations.length} migrations!`);
    
  } catch (error) {
    console.error('💥 Migration process failed:', error.message);
    process.exit(1);
  }
}

// Run the migration process if this script is executed directly
if (process.argv[1] === __filename) {
  applyMigrations();
}

export { applyMigrations };