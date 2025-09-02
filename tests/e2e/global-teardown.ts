import { FullConfig } from '@playwright/test';
import { testDb } from './utils/database';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting E2E test cleanup...');

  try {
    await testDb.cleanup();
    console.log('✅ All test data cleaned up successfully');
  } catch (error) {
    console.error('❌ Error during test cleanup:', error);
    // Don't fail teardown - tests should still be marked as complete
  }

  console.log('🏁 E2E test teardown complete');
}

export default globalTeardown;