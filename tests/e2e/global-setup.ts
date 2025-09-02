import { FullConfig } from '@playwright/test';
import { testDb } from './utils/database';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E test setup...');

  // Check database health
  const isHealthy = await testDb.healthCheck();
  if (!isHealthy) {
    throw new Error('Database health check failed. Please check Supabase connection.');
  }

  console.log('✅ Database connection verified');

  // Clean up any existing test data (in case previous run failed)
  try {
    await testDb.cleanup();
    console.log('🧹 Cleaned up any existing test data');
  } catch (error) {
    console.warn('⚠️ Warning: Could not clean existing test data:', error);
    // Don't fail setup if cleanup fails
  }

  console.log('✨ E2E test setup complete');
}

export default globalSetup;