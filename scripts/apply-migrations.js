#!/usr/bin/env node

/**
 * Supabase Migration Application Script
 * 
 * This script applies new Supabase migrations during CI builds.
 * It uses Supabase CLI functionality to apply only new migrations
 * that haven't been applied yet.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

/**
 * Checks if Supabase CLI is available
 */
function checkSupabaseCLI() {
  try {
    execSync('npx supabase --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
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
 * Main migration application logic
 */
function applyMigrations() {
  try {
    console.log('🚀 Starting migration process...');
    
    // Check if migrations directory exists
    const migrationFiles = getMigrationFiles();
    console.log(`📁 Found ${migrationFiles.length} migration files`);
    
    if (migrationFiles.length === 0) {
      console.log('✅ No migration files found. Nothing to do.');
      return;
    }
    
    // Check if Supabase CLI is available
    if (!checkSupabaseCLI()) {
      console.error('❌ Supabase CLI not found. Installing...');
      try {
        execSync('npm install -g @supabase/cli', { stdio: 'inherit' });
      } catch (error) {
        console.error('💥 Failed to install Supabase CLI:', error.message);
        process.exit(1);
      }
    }
    
    console.log('📦 Applying migrations using Supabase CLI...');
    
    // Set up Supabase CLI environment
    process.env.SUPABASE_URL = SUPABASE_URL;
    process.env.SUPABASE_SERVICE_ROLE_KEY = SUPABASE_SERVICE_ROLE_KEY;
    
    try {
      // Use Supabase CLI to apply migrations
      // This will automatically detect and apply only new migrations
      const result = execSync('npx supabase db push', { 
        stdio: 'pipe',
        encoding: 'utf8',
        cwd: path.join(__dirname, '..')
      });
      
      console.log('✅ Supabase migration output:');
      console.log(result);
      
      console.log('🎉 Successfully applied migrations using Supabase CLI!');
      
    } catch (error) {
      console.error('💥 Supabase CLI migration failed:');
      console.error(error.stdout || error.message);
      
      // Fallback: Log instructions for manual migration
      console.log('');
      console.log('💡 Alternative: Apply migrations manually');
      console.log('   1. Go to your Supabase dashboard');
      console.log('   2. Navigate to SQL Editor');
      console.log('   3. Apply any new migration files from supabase/migrations/');
      
      process.exit(1);
    }
    
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