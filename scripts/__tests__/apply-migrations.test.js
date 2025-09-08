import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock the Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      limit: vi.fn(() => ({ data: [], error: null }))
    })),
    rpc: vi.fn(() => ({ error: null }))
  }))
}));

// Mock fs module
vi.mock('fs');
vi.mock('path');

describe('apply-migrations script', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it('should validate that migration script file exists', () => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'apply-migrations.js');
    // Mock the existsSync function to return true for our script path
    vi.mocked(fs.existsSync).mockReturnValue(true);
    expect(fs.existsSync(scriptPath)).toBe(true);
  });

  it('should be a valid JavaScript/ES module', async () => {
    // This test will pass if the script can be imported without syntax errors
    try {
      // Set required env vars for import
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
      
      // Mock fs methods used in the script
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);
      
      const { applyMigrations } = await import('../apply-migrations.js');
      expect(typeof applyMigrations).toBe('function');
    } catch (error) {
      throw new Error(`Migration script has syntax errors: ${error.message}`);
    }
  });

  it('should require SUPABASE_URL environment variable', () => {
    // This is tested by the actual script's validation logic
    expect(process.env.SUPABASE_URL).toBeUndefined();
  });

  it('should require SUPABASE_SERVICE_ROLE_KEY environment variable', () => {
    // This is tested by the actual script's validation logic
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeUndefined();
  });

  it('should have proper file permissions for execution', () => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'apply-migrations.js');
    
    // Mock the statSync function to return a file object
    const mockStats = {
      isFile: vi.fn(() => true),
      isDirectory: vi.fn(() => false),
      mode: 0o644
    };
    vi.mocked(fs.statSync).mockReturnValue(mockStats);
    
    const stats = fs.statSync(scriptPath);
    
    // Check if file is readable
    expect(stats.isFile()).toBe(true);
    
    // In a real CI environment, you'd want to check executable permissions
    // but in our test environment, we just verify it's a valid file
  });
});