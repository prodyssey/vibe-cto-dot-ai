import { test, expect } from '@playwright/test';
import { testDb } from './utils/database';
import { generateTestEmail, wait } from './utils/test-data';

test.describe('Backend Integration Debug', () => {
  test('should debug contact form backend integration', async ({ page }) => {
    const testEmail = generateTestEmail('backend-debug');
    
    // Listen for console logs and errors
    const logs: string[] = [];
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#name')).toBeVisible();

    // Fill form
    await page.fill('#name', 'Backend Test User');
    await page.fill('#email', testEmail);
    await page.fill('#message', 'Testing backend integration');

    // Select inquiry type
    await page.click('[role="combobox"]');
    await page.waitForTimeout(1000);
    await page.click('[role="option"]', { timeout: 5000 });

    console.log('About to submit form...');

    // Submit form
    await page.click('button:has-text("Send Message")');

    console.log('Form submitted, waiting for response...');

    // Wait for success message
    await expect(page.locator('text=Thank You, Backend Test User!')).toBeVisible({ timeout: 15000 });

    console.log('Success message appeared, checking backend...');

    // Give extra time for backend processing
    await wait(5000);

    // Check database
    console.log('Checking database for saved contact...');
    const savedContact = await testDb.verifyDataExists<any>('contacts', { 
      email: testEmail.toLowerCase() 
    });

    console.log('Database result:', savedContact ? 'Found' : 'Not found');
    
    if (savedContact) {
      console.log('Contact data:', {
        name: savedContact.name,
        email: savedContact.email,
        source: savedContact.source
      });
    } else {
      // Check if there's any contact with a similar email
      const allContacts = await testDb.client
        .from('contacts')
        .select('email, name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      console.log('Recent contacts in database:', allContacts.data);
    }

    // Log any console messages or errors
    console.log('Console logs:', logs.length);
    console.log('Page errors:', errors.length);
    
    if (errors.length > 0) {
      console.log('Errors:', errors);
    }

    // Check for specific backend-related logs
    const backendLogs = logs.filter(log => 
      log.includes('error') || 
      log.includes('fail') || 
      log.includes('success') ||
      log.includes('Supabase') ||
      log.includes('Slack')
    );
    
    if (backendLogs.length > 0) {
      console.log('Backend-related logs:', backendLogs);
    }

    // Cleanup
    if (savedContact) {
      await testDb.cleanupByEmail(testEmail);
    }
  });

  test('should test direct database write', async () => {
    // Test if we can directly write to the database
    const testContact = {
      name: 'Direct Test',
      email: 'direct-test@example.com',
      message: 'Testing direct database access',
      inquiry_type: 'general',
      preferred_contact: 'email',
      source: 'contact_form', // Must match RLS policy requirement
      status: 'pending',
      session_id: crypto.randomUUID(),
    };

    try {
      const inserted = await testDb.insertTestData('contacts', testContact);
      console.log('Direct database write successful:', inserted.name);
      expect(inserted.name).toBe('Direct Test');
    } catch (error) {
      console.error('Direct database write failed:', error);
      throw error;
    }
  });
});