import { test, expect, Page } from '@playwright/test';
import { testDb } from './utils/database';
import { createTestContactFormData, generateTestSessionId, wait } from './utils/test-data';

test.describe('Contact Form', () => {
  let testSessionId: string;
  let testData: ReturnType<typeof createTestContactFormData>;

  test.beforeEach(async ({ page }) => {
    testSessionId = generateTestSessionId();
    testData = createTestContactFormData({
      email: `contact-${Date.now()}@example.com`
    });
    
    // Navigate to contact page
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveTitle(/Contact/);
    
    // Wait for form to be ready
    await expect(page.locator('#name')).toBeVisible();
  });

  test.afterEach(async () => {
    // Clean up test data
    await testDb.cleanupByEmail(testData.email);
  });

  test('should submit contact form successfully and save to database', async ({ page }) => {
    // Fill out the form
    await page.fill('#name', testData.name);
    await page.fill('#email', testData.email);
    
    if (testData.phone) {
      await page.fill('#phone', testData.phone);
    }
    
    if (testData.company) {
      await page.fill('#company', testData.company);
    }

    // Select inquiry type - click the select trigger then the option
    await page.click('[role="combobox"]');
    await page.waitForTimeout(1000); // Wait for options to load
    await page.click('[role="option"]', { timeout: 5000 }); // Select first available option

    // Select preferred contact method
    await page.check(`#${testData.preferredContact}-pref`);

    // Fill message
    await page.fill('#message', testData.message);

    // Submit form
    await page.click('button:has-text("Send Message")');

    // Wait for submission to complete
    await expect(page.locator(`text=Thank You, ${testData.name}!`)).toBeVisible({ timeout: 10000 });

    // Give database time to save
    await wait(2000);

    // Verify data was saved to database (contact form generates its own session ID)
    const savedContact = await testDb.verifyDataExists<any>('contacts', { email: testData.email.toLowerCase() });
    expect(savedContact).toBeTruthy();
    expect(savedContact?.name).toBe(testData.name);
    expect(savedContact?.email).toBe(testData.email.toLowerCase());
    expect(savedContact?.preferred_contact).toBe(testData.preferredContact);
    expect(savedContact?.message).toBe(testData.message);
    expect(savedContact?.source).toBe('contact_form');
    expect(savedContact?.status).toBe('pending');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.click('button:has-text("Send Message")');

    // Should show validation error for name
    await expect(page.locator('text=Please enter your name').first()).toBeVisible();

    // Fill name and try again
    await page.fill('#name', testData.name);
    await page.click('button:has-text("Send Message")');

    // Should show validation error for email
    await expect(page.locator('text=Please enter a valid email address').first()).toBeVisible();

    // Fill email and try again
    await page.fill('#email', testData.email);
    await page.click('button:has-text("Send Message")');

    // Should show validation error for inquiry type
    await expect(page.locator('text=Please select the type of inquiry').first()).toBeVisible();

    // Fill inquiry type and try again
    await page.click('[role="combobox"]');
    await page.waitForTimeout(1000);
    await page.click('[role="option"]', { timeout: 5000 });
    await page.click('button:has-text("Send Message")');

    // Should show validation error for message
    await expect(page.locator('text=Please enter a message').first()).toBeVisible();
  });

  test('should validate phone number when required', async ({ page }) => {
    // Fill basic required fields
    await page.fill('#name', testData.name);
    await page.fill('#email', testData.email);
    await page.click('[role="combobox"]');
    await page.waitForTimeout(1000);
    await page.click('[role="option"]', { timeout: 5000 });
    await page.fill('#message', testData.message);

    // Select phone as preferred contact method
    await page.check('#phone-pref');

    // Try to submit without phone number
    await page.click('button:has-text("Send Message")');

    // Should show validation error for phone
    await expect(page.locator('text=Phone number is required for your selected contact method').first()).toBeVisible();

    // Add phone number
    await page.fill('#phone', testData.phone || '5551234567');

    // Now should submit successfully
    await page.click('button:has-text("Send Message")');
    await expect(page.locator('text=Thank You').first()).toBeVisible({ timeout: 10000 });
  });

  test('should validate email format', async ({ page }) => {
    await page.fill('#name', testData.name);
    await page.fill('#email', 'invalid-email');
    await page.click('[role="combobox"]');
    await page.waitForTimeout(1000);
    await page.click('[role="option"]', { timeout: 5000 });
    await page.fill('#message', testData.message);

    await page.click('button:has-text("Send Message")');

    // Should show validation error for invalid email
    await expect(page.locator('text=Please enter a valid email address').first()).toBeVisible();
  });

  test('should handle different contact methods correctly', async ({ page }) => {
    const contactMethods = [
      { method: 'email', id: 'email-pref' },
      { method: 'text', id: 'text-pref', requiresPhone: true },
      { method: 'either', id: 'either-pref' }
    ];

    for (const { method, id, requiresPhone } of contactMethods) {
      // Reset form
      await page.reload();
      
      const uniqueTestData = createTestContactFormData({
        email: `contact-${method}-${Date.now()}@example.com`,
        preferredContact: method as any
      });

      // Fill form
      await page.fill('#name', uniqueTestData.name);
      await page.fill('#email', uniqueTestData.email);
      await page.click('[role="combobox"]');
      await page.waitForTimeout(1000);
      await page.click('[role="option"]', { timeout: 5000 });
      await page.fill('#message', uniqueTestData.message);

      if (requiresPhone && uniqueTestData.phone) {
        await page.fill('#phone', uniqueTestData.phone);
      }

      // Select contact method
      await page.check(`#${id}`);

      // Submit
      await page.click('button:has-text("Send Message")');
      await expect(page.locator('text=Thank You').first()).toBeVisible({ timeout: 10000 });

      // Verify in database
      await wait(2000);
      const savedContact = await testDb.verifyDataExists<any>('contacts', { email: uniqueTestData.email.toLowerCase() });
      expect(savedContact?.preferred_contact).toBe(method);

      // Cleanup
      await testDb.cleanupByEmail(uniqueTestData.email);
    }
  });

  test('should show loading state during submission', async ({ page }) => {
    // Fill form
    await page.fill('#name', testData.name);
    await page.fill('#email', testData.email);
    await page.click('[role="combobox"]');
    await page.waitForTimeout(1000);
    await page.click('[role="option"]', { timeout: 5000 });
    await page.fill('#message', testData.message);

    // Submit and immediately check for loading state
    await page.click('button:has-text("Send Message")');
    
    // Should show loading state - button text changes and becomes disabled
    await expect(page.locator('text=Sending...')).toBeVisible();
    await expect(page.locator('button:has-text("Sending...")')).toBeDisabled();

    // Wait for completion
    await expect(page.locator('text=Thank You').first()).toBeVisible({ timeout: 10000 });
  });
});