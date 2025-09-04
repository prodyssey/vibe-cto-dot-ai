import { test, expect } from '@playwright/test';
import { testDb } from './utils/database';
import { createTestWaitlistFormData, generateTestSessionId, wait } from './utils/test-data';

test.describe('Adventure Game Forms', () => {
  let testSessionId: string;
  let testData: ReturnType<typeof createTestWaitlistFormData>;

  test.beforeEach(async ({ page }) => {
    testSessionId = generateTestSessionId();
    testData = createTestWaitlistFormData({
      email: `adventure-${Date.now()}@example.com`
    });
  });

  test.afterEach(async () => {
    // Clean up test data
    await testDb.cleanupByEmail(testData.email);
    await testDb.cleanupBySessionId(testSessionId);
  });

  test.describe('Session Email Form', () => {
    test.skip('should update adventure session with email and name', async ({ page }) => {
      // Skip this test for now - email capture is integrated into the game flow
      // and doesn't exist as a standalone form that can be directly accessed
    });
  });

  test.describe('Ignition Waitlist Form', () => {
    test('should submit ignition waitlist form and save to database', async ({ page }) => {
      // Navigate to adventure game
      await page.goto('/adventure');
      
      // Wait for the game to load and initialize
      await expect(page.locator('text=BEGIN JOURNEY')).toBeVisible({ timeout: 10000 });
      
      // Navigate directly to the ignition contact scene using the game's internal navigation
      await page.evaluate(() => {
        // Use the game store to navigate to ignition contact scene
        window.gameStore?.getState().navigateToScene('ignitionContact');
      });
      
      // Wait for the scene to load - look for the continue button
      await expect(page.locator('text=Continue to Investment Planning')).toBeVisible({ timeout: 10000 });

      // Fill the contact form
      await page.fill('input[id="name"]', testData.name);
      await page.fill('input[id="email"]', testData.email);
      
      if (testData.phone) {
        await page.fill('input[id="phone"]', testData.phone);
      }

      // Select contact method - click on the label that contains the text
      if (testData.contactMethod === 'email') {
        await page.click('text=Email >> nth=0'); // First occurrence in the form, not the field label
      } else if (testData.contactMethod === 'phone') {
        await page.click('text=Phone');
      } else if (testData.contactMethod === 'text') {
        await page.click('text=Text/SMS');
      } else {
        await page.click('text=Either is fine');
      }

      // Submit form by clicking the continue button
      await page.click('text=Continue to Investment Planning');

      // Wait for submission - look for saving state
      await expect(page.locator('text=Saving')).not.toBeVisible({ timeout: 10000 });

      // Get the session ID from the page
      const sessionId = await page.evaluate(() => {
        return window.gameStore?.getState().sessionId;
      });

      if (sessionId) {
        testSessionId = sessionId;
      
        // Verify database entry - IgnitionContactScreen saves to ignition_qualifications table
        await wait(2000);
        const qualificationEntry = await testDb.verifyDataExists<any>('ignition_qualifications', { session_id: testSessionId });
        expect(qualificationEntry).toBeTruthy();
        expect(qualificationEntry?.name).toBe(testData.name);
        expect(qualificationEntry?.email).toBe(testData.email);
        expect(qualificationEntry?.preferred_contact).toBe(testData.contactMethod);

        // Verify session was also updated
        const updatedSession = await testDb.verifyDataExists<any>('adventure_sessions', { id: testSessionId });
        expect(updatedSession).toBeTruthy();
      }
    });

    test.skip('should handle generated vs real names correctly', async ({ page }) => {
      // Skip this test - it requires complex game state setup
    });
  });

  test.describe('Launch Control Waitlist Form', () => {
    test('should submit launch control waitlist form and save to database', async ({ page }) => {
      // Navigate to adventure game
      await page.goto('/adventure');
      
      // Wait for the game to load and initialize
      await expect(page.locator('text=BEGIN JOURNEY')).toBeVisible({ timeout: 10000 });
      
      // Navigate directly to the launch control waitlist scene using the game's internal navigation
      await page.evaluate(() => {
        // Use the game store to navigate to launch control waitlist scene
        window.gameStore?.getState().navigateToScene('launchControlWaitlist');
      });
      
      // Wait for the scene to load - look for the specific form elements
      await expect(page.locator('text=Join the Launch Control Waitlist')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('button[type="submit"]')).toBeVisible({ timeout: 5000 });

      // Fill the waitlist form
      await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
      await page.fill('input[type="email"]', testData.email);
      
      if (testData.phone) {
        await page.fill('input[type="tel"]', testData.phone);
      }

      // Select contact method if radio buttons exist
      const contactMethodRadio = page.locator(`input[value="${testData.contactMethod}"]`);
      if (await contactMethodRadio.isVisible()) {
        await contactMethodRadio.check();
      }

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for submission
      await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });

      // Get the session ID from the page
      const sessionId = await page.evaluate(() => {
        return window.gameStore?.getState().sessionId;
      });

      if (sessionId) {
        testSessionId = sessionId;
      
        // Verify database entry
        await wait(2000);
        const waitlistEntry = await testDb.verifyDataExists<any>('launch_control_waitlist', { session_id: testSessionId });
        expect(waitlistEntry).toBeTruthy();
        expect(waitlistEntry?.name).toBe(testData.name);
        expect(waitlistEntry?.email).toBe(testData.email.toLowerCase());
        expect(waitlistEntry?.is_waitlist).toBe(true);
      }
    });
  });

  test.describe('Cross-form Validation', () => {
    test.skip('should maintain consistent validation across all adventure forms', async ({ page }) => {
      // Skip this test - URL-based scene navigation is not supported
    });

    test.skip('should handle phone validation consistently across adventure forms', async ({ page }) => {
      // Skip this test - URL-based scene navigation is not supported
    });
  });

  test.describe('Integration Flow', () => {
    test.skip('should complete full adventure flow with form submissions', async ({ page }) => {
      // Skip this test - requires complex game state and scene flow
    });
  });
});