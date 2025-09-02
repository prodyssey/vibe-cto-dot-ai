import { test, expect } from '@playwright/test';
import { testDb } from './utils/database';
import { createTestWaitlistFormData, generateTestSessionId, wait } from './utils/test-data';

test.describe('Community Waitlist Form', () => {
  let testSessionId: string;
  let testData: ReturnType<typeof createTestWaitlistFormData>;

  test.beforeEach(async ({ page }) => {
    testSessionId = generateTestSessionId();
    testData = createTestWaitlistFormData({
      email: `community-${Date.now()}@example.com`
    });
    
    // Navigate to a page that has the community waitlist form
    // Note: Update this path based on where the form is actually displayed
    await page.goto('/');
    
    // Look for the community waitlist form on the page
    await expect(page.locator('text=Join Community Waitlist')).toBeVisible({ timeout: 10000 });
  });

  test.afterEach(async () => {
    // Clean up test data
    await testDb.cleanupByEmail(testData.email);
    await testDb.cleanupBySessionId(testSessionId);
  });

  test('should submit community waitlist form successfully and save to database', async ({ page }) => {
    // Fill out the form
    await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
    await page.fill('input[type="email"]', testData.email);
    
    if (testData.phone) {
      await page.fill('input[type="tel"]', testData.phone);
    }

    // Select contact method
    await page.check(`input[value="${testData.contactMethod}"]`);

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for submission to complete - look for success indication
    await expect(page.locator('text=Submitting')).toBeVisible();
    await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });

    // Give database time to save
    await wait(2000);

    // Verify data was saved to database
    const savedEntry = await testDb.verifyCommunityWaitlistSubmission(testData.email);
    expect(savedEntry).toBeTruthy();
    expect(savedEntry?.name).toBe(testData.name);
    expect(savedEntry?.email).toBe(testData.email.toLowerCase());
    expect(savedEntry?.preferred_contact).toBe(testData.contactMethod);
    expect(savedEntry?.source).toBe('website');
    expect(savedEntry?.status).toBe('pending');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.click('button[type="submit"]');

    // Should show validation error for name
    await expect(page.locator('text=Name is required')).toBeVisible();

    // Fill name and try again
    await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
    await page.click('button[type="submit"]');

    // Should show validation error for email
    await expect(page.locator('text=Email is required')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
    await page.fill('input[type="email"]', 'invalid-email');

    await page.click('button[type="submit"]');

    // Should show validation error for invalid email format
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
  });

  test('should validate phone number when phone/text contact method selected', async ({ page }) => {
    // Fill basic required fields
    await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
    await page.fill('input[type="email"]', testData.email);

    // Select phone as contact method
    await page.check('input[value="phone"]');

    // Try to submit without phone number
    await page.click('button[type="submit"]');

    // Should show validation error for phone
    await expect(page.locator('text=Phone number is required for phone/text contact methods')).toBeVisible();

    // Add phone number
    if (testData.phone) {
      await page.fill('input[type="tel"]', testData.phone);
    }

    // Now should submit successfully
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });

    // Verify submission
    await wait(2000);
    const savedEntry = await testDb.verifyCommunityWaitlistSubmission(testData.email);
    expect(savedEntry).toBeTruthy();
  });

  test('should handle different contact methods correctly', async ({ page }) => {
    const contactMethods = [
      { method: 'email', requiresPhone: false },
      { method: 'phone', requiresPhone: true },
      { method: 'text', requiresPhone: true },
      { method: 'either', requiresPhone: false }
    ];

    for (const { method, requiresPhone } of contactMethods) {
      // Reset form by reloading page
      await page.reload();
      await expect(page.locator('text=Join Community Waitlist')).toBeVisible({ timeout: 10000 });
      
      const uniqueTestData = createTestWaitlistFormData({
        email: `community-${method}-${Date.now()}@example.com`,
        contactMethod: method as any
      });

      // Fill form
      await page.fill('input[placeholder*="name"], input[id*="name"]', uniqueTestData.name);
      await page.fill('input[type="email"]', uniqueTestData.email);

      if (requiresPhone && uniqueTestData.phone) {
        await page.fill('input[type="tel"]', uniqueTestData.phone);
      }

      // Select contact method
      await page.check(`input[value="${method}"]`);

      // Submit
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });

      // Verify in database
      await wait(2000);
      const savedEntry = await testDb.verifyCommunityWaitlistSubmission(uniqueTestData.email);
      expect(savedEntry?.preferred_contact).toBe(method);
      expect(savedEntry?.contact_method).toBe(method);

      // Cleanup
      await testDb.cleanupByEmail(uniqueTestData.email);
    }
  });

  test('should handle duplicate email submission', async ({ page }) => {
    // First submission
    await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
    await page.fill('input[type="email"]', testData.email);
    await page.check(`input[value="${testData.contactMethod}"]`);
    await page.click('button[type="submit"]');
    
    // Wait for first submission to complete
    await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });
    await wait(2000);

    // Verify first submission was saved
    const firstEntry = await testDb.verifyCommunityWaitlistSubmission(testData.email);
    expect(firstEntry).toBeTruthy();

    // Try to submit the same email again
    await page.reload();
    await expect(page.locator('text=Join Community Waitlist')).toBeVisible({ timeout: 10000 });
    
    await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
    await page.fill('input[type="email"]', testData.email);
    await page.check(`input[value="${testData.contactMethod}"]`);
    await page.click('button[type="submit"]');

    // Should show error about duplicate email
    await expect(page.locator('text=This email is already on the waitlist')).toBeVisible();
  });

  test('should show loading state during submission', async ({ page }) => {
    // Fill form
    await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
    await page.fill('input[type="email"]', testData.email);
    await page.check(`input[value="${testData.contactMethod}"]`);

    // Submit and immediately check for loading state
    await page.click('button[type="submit"]');
    
    // Should show loading state
    await expect(page.locator('button[type="submit"]')).toBeDisabled();
    await expect(page.locator('text=Submitting')).toBeVisible();

    // Wait for completion
    await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });
  });

  test('should reset contact method when phone is cleared', async ({ page }) => {
    // Fill form
    await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
    await page.fill('input[type="email"]', testData.email);
    
    // Fill phone and select phone contact method
    if (testData.phone) {
      await page.fill('input[type="tel"]', testData.phone);
      await page.check('input[value="phone"]');
      
      // Verify phone method is selected
      await expect(page.locator('input[value="phone"]')).toBeChecked();
      
      // Clear phone number
      await page.fill('input[type="tel"]', '');
      
      // Contact method should reset to email
      await expect(page.locator('input[value="email"]')).toBeChecked();
    }
  });
});