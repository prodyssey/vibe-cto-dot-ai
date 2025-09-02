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
    test('should update adventure session with email and name', async ({ page }) => {
      // Create a test adventure session first
      const session = await testDb.createTestAdventureSession('Generated Name');
      testSessionId = session.id;

      // Navigate to adventure game
      await page.goto('/adventure');

      // Mock the session ID in localStorage or sessionStorage
      await page.evaluate((sessionId) => {
        sessionStorage.setItem('adventureSessionId', sessionId);
      }, testSessionId);

      // Navigate to a point where email form is shown
      // This will depend on your game flow - adjust path as needed
      await page.goto('/adventure?scene=email-capture');

      // Fill the email form
      await page.fill('input[type="email"]', testData.email);
      
      // If there's a name field (for generated names)
      const nameInput = page.locator('input[placeholder*="name"], input[id*="name"]');
      if (await nameInput.isVisible()) {
        await nameInput.fill(testData.name);
      }

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for submission
      await expect(page.locator('text=Saving')).not.toBeVisible({ timeout: 10000 });

      // Verify database update
      await wait(2000);
      const updatedSession = await testDb.verifyDataExists<any>('adventure_sessions', { id: testSessionId });
      expect(updatedSession).toBeTruthy();
      expect(updatedSession?.email).toBe(testData.email);
    });
  });

  test.describe('Ignition Waitlist Form', () => {
    test('should submit ignition waitlist form and save to database', async ({ page }) => {
      // Create a test adventure session
      const session = await testDb.createTestAdventureSession();
      testSessionId = session.id;

      // Navigate to adventure game
      await page.goto('/adventure');

      // Mock session ID
      await page.evaluate((sessionId) => {
        sessionStorage.setItem('adventureSessionId', sessionId);
      }, testSessionId);

      // Navigate to ignition path - adjust based on your game flow
      await page.goto('/adventure?scene=ignition-waitlist');

      // Fill the waitlist form
      await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
      await page.fill('input[type="email"]', testData.email);
      
      if (testData.phone) {
        await page.fill('input[type="tel"]', testData.phone);
      }

      // Select contact method
      await page.check(`input[value="${testData.contactMethod}"]`);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for submission
      await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });

      // Verify database entry
      await wait(2000);
      const waitlistEntry = await testDb.verifyDataExists<any>('ignition_waitlist', { session_id: testSessionId });
      expect(waitlistEntry).toBeTruthy();
      expect(waitlistEntry?.player_name).toBe(testData.name);
      expect(waitlistEntry?.contact_method).toBe(testData.contactMethod);

      // Verify session was also updated
      const updatedSession = await testDb.verifyDataExists<any>('adventure_sessions', { id: testSessionId });
      expect(updatedSession).toBeTruthy();
    });

    test('should handle generated vs real names correctly', async ({ page }) => {
      // Create session with generated name
      const session = await testDb.createTestAdventureSession('Generated_Player_123');
      testSessionId = session.id;

      await page.goto('/adventure');
      await page.evaluate((sessionId) => {
        sessionStorage.setItem('adventureSessionId', sessionId);
      }, testSessionId);

      await page.goto('/adventure?scene=ignition-waitlist');

      // For generated names, the form should require real name input
      const nameInput = page.locator('input[placeholder*="name"], input[id*="name"]');
      await expect(nameInput).toBeVisible();
      
      // Should show helper text about providing real name
      await expect(page.locator('text=real name')).toBeVisible();

      await nameInput.fill(testData.name);
      await page.fill('input[type="email"]', testData.email);
      await page.check(`input[value="${testData.contactMethod}"]`);

      await page.click('button[type="submit"]');
      await wait(3000);

      // Verify the real name was saved and generated flag was updated
      const updatedSession = await testDb.verifyDataExists<any>('adventure_sessions', { id: testSessionId });
      expect(updatedSession).toBeTruthy();
      expect(updatedSession?.email).toBe(testData.email);
      expect(updatedSession?.player_name).toBe(testData.name);
      expect(updatedSession?.is_generated_name).toBe(false);
    });
  });

  test.describe('Launch Control Waitlist Form', () => {
    test('should submit launch control waitlist form and save to database', async ({ page }) => {
      // Create a test adventure session
      const session = await testDb.createTestAdventureSession();
      testSessionId = session.id;

      await page.goto('/adventure');
      await page.evaluate((sessionId) => {
        sessionStorage.setItem('adventureSessionId', sessionId);
      }, testSessionId);

      // Navigate to launch control path
      await page.goto('/adventure?scene=launch-control-waitlist');

      // Fill the waitlist form
      await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
      await page.fill('input[type="email"]', testData.email);
      
      if (testData.phone) {
        await page.fill('input[type="tel"]', testData.phone);
      }

      // Select contact method
      await page.check(`input[value="${testData.contactMethod}"]`);

      // Submit form
      await page.click('button[type="submit"]');

      // Wait for submission
      await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });

      // Verify database entry
      await wait(2000);
      const waitlistEntry = await testDb.verifyDataExists<any>('launch_control_waitlist', { session_id: testSessionId });
      expect(waitlistEntry).toBeTruthy();
      expect(waitlistEntry?.name).toBe(testData.name);
      expect(waitlistEntry?.email).toBe(testData.email.toLowerCase());
      expect(waitlistEntry?.is_waitlist).toBe(true);
    });
  });

  test.describe('Cross-form Validation', () => {
    test('should maintain consistent validation across all adventure forms', async ({ page }) => {
      const forms = [
        { scene: 'ignition-waitlist', buttonText: 'Ignition' },
        { scene: 'launch-control-waitlist', buttonText: 'Launch Control' }
      ];

      for (const form of forms) {
        // Create fresh session for each form
        const session = await testDb.createTestAdventureSession();
        const currentSessionId = session.id;

        await page.goto('/adventure');
        await page.evaluate((sessionId) => {
          sessionStorage.setItem('adventureSessionId', sessionId);
        }, currentSessionId);

        await page.goto(`/adventure?scene=${form.scene}`);

        // Test required field validation
        await page.click('button[type="submit"]');

        // Should show validation errors
        await expect(page.locator('input[required]').first()).toBeFocused();

        // Fill minimum required fields
        await page.fill('input[placeholder*="name"], input[id*="name"]', `Test User ${form.scene}`);
        await page.fill('input[type="email"]', `test-${form.scene}-${Date.now()}@example.com`);

        // Submit and verify success
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });

        // Cleanup
        await testDb.cleanupBySessionId(currentSessionId);
      }
    });

    test('should handle phone validation consistently across adventure forms', async ({ page }) => {
      const session = await testDb.createTestAdventureSession();
      testSessionId = session.id;

      await page.goto('/adventure');
      await page.evaluate((sessionId) => {
        sessionStorage.setItem('adventureSessionId', sessionId);
      }, testSessionId);

      await page.goto('/adventure?scene=ignition-waitlist');

      // Fill basic fields
      await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
      await page.fill('input[type="email"]', testData.email);

      // Select phone contact method without providing phone
      await page.check('input[value="phone"]');
      await page.click('button[type="submit"]');

      // Should show phone validation error
      await expect(page.locator('text=required, text=phone')).toBeVisible();

      // Add phone and resubmit
      if (testData.phone) {
        await page.fill('input[type="tel"]', testData.phone);
        await page.click('button[type="submit"]');
        await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Integration Flow', () => {
    test('should complete full adventure flow with form submissions', async ({ page }) => {
      // Create session
      const session = await testDb.createTestAdventureSession('Generated_Name');
      testSessionId = session.id;

      await page.goto('/adventure');
      await page.evaluate((sessionId) => {
        sessionStorage.setItem('adventureSessionId', sessionId);
      }, testSessionId);

      // Step 1: Email capture
      await page.goto('/adventure?scene=email-capture');
      await page.fill('input[type="email"]', testData.email);
      await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
      await page.click('button[type="submit"]');
      await wait(2000);

      // Verify session update
      const updatedSession = await testDb.verifyDataExists<any>('adventure_sessions', { id: testSessionId });
      expect(updatedSession).toBeTruthy();
      expect(updatedSession?.email).toBe(testData.email);
      expect(updatedSession?.player_name).toBe(testData.name);

      // Step 2: Proceed to waitlist form
      await page.goto('/adventure?scene=ignition-waitlist');
      
      // Form should be pre-filled with session data
      await expect(page.locator('input[type="email"]')).toHaveValue(testData.email);
      
      // Add contact method and submit
      if (testData.phone) {
        await page.fill('input[type="tel"]', testData.phone);
      }
      await page.check(`input[value="${testData.contactMethod}"]`);
      await page.click('button[type="submit"]');
      await wait(2000);

      // Verify waitlist entry
      const waitlistEntry = await testDb.verifyDataExists<any>('ignition_waitlist', { session_id: testSessionId });
      expect(waitlistEntry).toBeTruthy();
      expect(waitlistEntry?.player_name).toBe(testData.name);
    });
  });
});