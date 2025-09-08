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
  // First, try to query the table to see if it exists
  const { error: checkError } = await supabase
    .from('schema_migrations')
    .select('version')
    .limit(1);

  if (!checkError) {
    // Table exists and is accessible
    return;
  }

  if (checkError.message && checkError.message.includes('does not exist')) {
    // Table doesn't exist, try to create it
    console.log('📋 schema_migrations table not found, attempting to create...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Grant necessary permissions
      GRANT SELECT, INSERT ON public.schema_migrations TO anon, authenticated;
    `;

    const { error: createError } = await supabase.rpc('exec', {
      sql: createTableSQL
    });

    if (createError) {
      console.error('❌ Could not create schema_migrations table automatically.');
      console.error('💡 Please create it manually in your Supabase dashboard:');
      console.error('   https://app.supabase.com/project/[your-project]/sql/new');
      console.error('');
      console.error('   SQL to execute:');
      console.error(createTableSQL);
      process.exit(1);
    }

    console.log('✅ Successfully created schema_migrations table');
    return;
  }

  // Some other error occurred
  console.error('❌ Error checking schema_migrations table:', checkError.message);
  throw checkError;
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
  
  try {
    // For now, we'll use a simpler approach and assume the migrations
    // are primarily DDL operations that can be handled by the client
    // In a production environment, you might want to use a direct database connection
    
    // Try to execute using rpc first, with fallback handling
    const { error: migrationError } = await supabase.rpc('exec', {
      sql: sql
    });

    if (migrationError) {
      // If RPC exec doesn't work, log a detailed error and guidance
      console.error(`❌ Error applying migration ${migration.filename}:`, migrationError.message);
      console.error('💡 This might be because the "exec" RPC function is not available.');
      console.error('   Consider applying this migration manually in your Supabase dashboard:');
      console.error('   https://app.supabase.com/project/[your-project]/sql/new');
      console.error('');
      console.error('   Migration SQL:');
      console.error('   ' + sql.split('\n').map(line => '   ' + line).join('\n'));
      throw migrationError;
    }
    
  } catch (error) {
    console.error(`❌ Failed to apply migration ${migration.filename}:`, error.message);
    throw error;
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
 * Attempts to acquire a migration lock to prevent concurrent migrations
 */
async function acquireMigrationLock() {
  const lockId = `migration_lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const lockTimeout = 300000; // 5 minutes
  const lockExpiry = new Date(Date.now() + lockTimeout).toISOString();
  
  try {
    // Try to insert a lock record - this will fail if a lock already exists
    const { error } = await supabase
      .from('schema_migrations')
      .insert({ 
        version: '_MIGRATION_LOCK_', 
        applied_at: lockExpiry
      });

    if (error) {
      // Check if there's an existing lock
      const { data: existingLock } = await supabase
        .from('schema_migrations')
        .select('applied_at')
        .eq('version', '_MIGRATION_LOCK_')
        .single();

      if (existingLock) {
        const lockExpiry = new Date(existingLock.applied_at);
        if (lockExpiry > new Date()) {
          console.log('⏳ Another migration process is running. Waiting...');
          // Wait for the lock to expire or be released
          await new Promise(resolve => setTimeout(resolve, 5000));
          return await acquireMigrationLock(); // Retry
        } else {
          // Lock has expired, remove it and try again
          await releaseMigrationLock();
          return await acquireMigrationLock();
        }
      }
    }

    console.log('🔒 Acquired migration lock');
    return lockId;
  } catch (error) {
    console.log('⚠️  Could not acquire migration lock, proceeding without lock');
    return null;
  }
}

/**
 * Releases the migration lock
 */
async function releaseMigrationLock() {
  try {
    await supabase
      .from('schema_migrations')
      .delete()
      .eq('version', '_MIGRATION_LOCK_');
    console.log('🔓 Released migration lock');
  } catch (error) {
    console.log('⚠️  Could not release migration lock:', error.message);
  }
}

/**
 * Main migration application logic
 */
async function applyMigrations() {
  let lockId = null;
  
  try {
    console.log('🚀 Starting migration process...');
    
    // Ensure schema_migrations table exists
    await ensureSchemaMigrationsTable();
    
    // Try to acquire migration lock
    lockId = await acquireMigrationLock();
    
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
  } finally {
    // Always release the lock, even if migrations failed
    if (lockId) {
      await releaseMigrationLock();
    }
  }
}

// Run the migration process if this script is executed directly
if (process.argv[1] === __filename) {
  applyMigrations();
}

export { applyMigrations };