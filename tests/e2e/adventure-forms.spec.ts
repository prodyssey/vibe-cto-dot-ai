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
      // Navigate to adventure game
      await page.goto('/adventure');
      
      // Wait for the game to load and initialize
      await expect(page.locator('text=BEGIN JOURNEY')).toBeVisible({ timeout: 10000 });
      
      // Start the adventure to create a session
      await page.click('text=BEGIN JOURNEY');
      
      // Wait for player setup screen and enter a name
      await expect(page.locator('text=Enter your name')).toBeVisible({ timeout: 10000 });
      await page.fill('input[placeholder*="name"], input[type="text"]', 'Test Player');
      await page.click('text=Continue');
      
      // Navigate through the adventure to get to email capture
      // Let's navigate to ignition path to trigger email capture
      await page.evaluate(() => {
        // Navigate to ignition contact scene where email is captured
        window.gameStore?.getState().navigateToScene('ignitionContact');
      });
      
      // Wait for the contact form to appear
      await expect(page.locator('text=Let\'s Connect')).toBeVisible({ timeout: 10000 });
      
      // Fill out the contact form (this captures email)
      await page.fill('input[id="name"]', testData.name);
      await page.fill('input[id="email"]', testData.email);
      
      // Submit the form
      await page.click('text=Continue to Investment Planning');
      
      // Wait for submission
      await expect(page.locator('text=Saving')).not.toBeVisible({ timeout: 10000 });
      
      // Get the session ID
      const sessionId = await page.evaluate(() => {
        return window.gameStore?.getState().sessionId;
      });
      
      if (sessionId) {
        testSessionId = sessionId;
        
        // Verify the session was updated with email
        await wait(2000);
        const sessionData = await testDb.verifyDataExists<any>('adventure_sessions', { id: testSessionId });
        expect(sessionData).toBeTruthy();
        expect(sessionData?.email).toBe(testData.email);
        
        // Also verify the ignition qualification record was created
        const qualificationData = await testDb.verifyDataExists<any>('ignition_qualifications', { session_id: testSessionId });
        expect(qualificationData).toBeTruthy();
        expect(qualificationData?.name).toBe(testData.name);
        expect(qualificationData?.email).toBe(testData.email);
      }
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

    test('should handle generated vs real names correctly', async ({ page }) => {
      // Navigate to adventure game
      await page.goto('/adventure');
      
      // Wait for the game to load and initialize
      await expect(page.locator('text=BEGIN JOURNEY')).toBeVisible({ timeout: 10000 });
      
      // Start the adventure to create a session
      await page.click('text=BEGIN JOURNEY');
      
      // Wait for player setup screen - skip entering name to get generated name
      await expect(page.locator('text=Enter your name')).toBeVisible({ timeout: 10000 });
      
      // Click continue without entering a name to get a generated name
      await page.click('text=Continue');
      
      // The game should generate a random name
      const generatedName = await page.evaluate(() => {
        return window.gameStore?.getState().playerName;
      });
      expect(generatedName).toBeTruthy();
      expect(generatedName).not.toBe('');
      
      // Navigate to a scene that has SessionEmailForm (where real name can be provided)
      // This would typically happen in the booking flow, but we'll simulate it
      await page.evaluate(() => {
        // Navigate to ignition contact - this will eventually lead to email capture
        window.gameStore?.getState().navigateToScene('ignitionContact');
      });
      
      // Wait for the contact form
      await expect(page.locator('text=Let\'s Connect')).toBeVisible({ timeout: 10000 });
      
      // Fill the contact form - using real name this time
      await page.fill('input[id="name"]', testData.name); // Real name
      await page.fill('input[id="email"]', testData.email);
      
      // Submit
      await page.click('text=Continue to Investment Planning');
      await expect(page.locator('text=Saving')).not.toBeVisible({ timeout: 10000 });
      
      // Get session and verify both names are handled correctly
      const sessionId = await page.evaluate(() => {
        return window.gameStore?.getState().sessionId;
      });
      
      if (sessionId) {
        testSessionId = sessionId;
        
        await wait(2000);
        const qualificationData = await testDb.verifyDataExists<any>('ignition_qualifications', { session_id: testSessionId });
        expect(qualificationData).toBeTruthy();
        expect(qualificationData?.name).toBe(testData.name); // Should have real name, not generated
        expect(qualificationData?.email).toBe(testData.email);
        
        // Session might still have the generated name in player_name field
        const sessionData = await testDb.verifyDataExists<any>('adventure_sessions', { id: testSessionId });
        expect(sessionData).toBeTruthy();
        expect(sessionData?.email).toBe(testData.email);
      }
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
    test('should maintain consistent validation across all adventure forms', async ({ page }) => {
      // Navigate to adventure game
      await page.goto('/adventure');
      await expect(page.locator('text=BEGIN JOURNEY')).toBeVisible({ timeout: 10000 });
      await page.click('text=BEGIN JOURNEY');
      
      // Test ignition form validation
      await page.evaluate(() => {
        window.gameStore?.getState().navigateToScene('ignitionContact');
      });
      
      await expect(page.locator('text=Let\'s Connect')).toBeVisible({ timeout: 10000 });
      
      // Try to submit without filling required fields
      const submitButton = page.locator('text=Continue to Investment Planning');
      await expect(submitButton).toBeDisabled();
      
      // Fill name only
      await page.fill('input[id="name"]', testData.name);
      await expect(submitButton).toBeDisabled(); // Still disabled without email
      
      // Fill email
      await page.fill('input[id="email"]', testData.email);
      await expect(submitButton).toBeEnabled(); // Now enabled
      
      // Test phone validation when phone method selected
      await page.click('input[value="phone"]');
      await expect(submitButton).toBeDisabled(); // Disabled because phone required
      
      await page.fill('input[id="phone"]', '555-123-4567');
      await expect(submitButton).toBeEnabled(); // Enabled with phone
      
      // Test Launch Control form has same validation patterns
      await page.evaluate(() => {
        window.gameStore?.getState().navigateToScene('launchControlWaitlist');
      });
      
      await expect(page.locator('text=Join the Launch Control Waitlist')).toBeVisible({ timeout: 10000 });
      
      const lcSubmitButton = page.locator('button[type="submit"]');
      await expect(lcSubmitButton).toBeDisabled(); // Disabled without fields
      
      // Fill required fields
      await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
      await page.fill('input[type="email"]', testData.email);
      await expect(lcSubmitButton).toBeEnabled(); // Enabled with required fields
    });

    test('should handle phone validation consistently across adventure forms', async ({ page }) => {
      await page.goto('/adventure');
      await expect(page.locator('text=BEGIN JOURNEY')).toBeVisible({ timeout: 10000 });
      await page.click('text=BEGIN JOURNEY');
      
      // Test phone validation in ignition form
      await page.evaluate(() => {
        window.gameStore?.getState().navigateToScene('ignitionContact');
      });
      
      await expect(page.locator('text=Let\'s Connect')).toBeVisible({ timeout: 10000 });
      
      await page.fill('input[id="name"]', testData.name);
      await page.fill('input[id="email"]', testData.email);
      
      // Test phone validation logic
      const phoneInput = page.locator('input[id="phone"]');
      const submitButton = page.locator('text=Continue to Investment Planning');
      
      // With email method, phone is optional
      await page.click('input[value="email"]');
      await expect(submitButton).toBeEnabled();
      
      // With phone method, phone is required
      await page.click('input[value="phone"]');
      await expect(submitButton).toBeDisabled();
      
      await phoneInput.fill('555-123-4567');
      await expect(submitButton).toBeEnabled();
      
      // Invalid phone patterns should work but basic validation should exist
      await phoneInput.fill('abc');
      await expect(submitButton).toBeEnabled(); // Form validation is lenient
      
      // Test same patterns in Launch Control
      await page.evaluate(() => {
        window.gameStore?.getState().navigateToScene('launchControlWaitlist');
      });
      
      await expect(page.locator('text=Join the Launch Control Waitlist')).toBeVisible({ timeout: 10000 });
      
      const lcNameInput = page.locator('input[placeholder*="name"], input[id*="name"]');
      const lcEmailInput = page.locator('input[type="email"]');
      const lcPhoneInput = page.locator('input[type="tel"]');
      const lcSubmitButton = page.locator('button[type="submit"]');
      
      await lcNameInput.fill(testData.name);
      await lcEmailInput.fill(testData.email);
      
      // Phone is always optional in launch control form
      await expect(lcSubmitButton).toBeEnabled();
      
      // But can be filled if provided
      if (lcPhoneInput) {
        await lcPhoneInput.fill('555-987-6543');
        await expect(lcSubmitButton).toBeEnabled();
      }
    });
  });

  test.describe('Integration Flow', () => {
    test('should complete full adventure flow with form submissions', async ({ page }) => {
      // Start the full adventure journey
      await page.goto('/adventure');
      await expect(page.locator('text=BEGIN JOURNEY')).toBeVisible({ timeout: 10000 });
      
      // Begin the adventure
      await page.click('text=BEGIN JOURNEY');
      
      // Enter player name
      await expect(page.locator('text=Enter your name')).toBeVisible({ timeout: 10000 });
      await page.fill('input[placeholder*="name"], input[type="text"]', 'Adventure Player');
      await page.click('text=Continue');
      
      // Get session ID for tracking
      const sessionId = await page.evaluate(() => {
        return window.gameStore?.getState().sessionId;
      });
      
      if (sessionId) {
        testSessionId = sessionId;
      }
      
      // Navigate through to ignition path and complete contact form
      await page.evaluate(() => {
        window.gameStore?.getState().navigateToScene('ignitionContact');
      });
      
      await expect(page.locator('text=Let\'s Connect')).toBeVisible({ timeout: 10000 });
      
      // Fill ignition contact form
      await page.fill('input[id="name"]', testData.name);
      await page.fill('input[id="email"]', testData.email);
      await page.fill('input[id="phone"]', testData.phone || '555-123-4567');
      await page.click('input[value="email"]');
      
      // Submit ignition contact
      await page.click('text=Continue to Investment Planning');
      await expect(page.locator('text=Saving')).not.toBeVisible({ timeout: 10000 });
      
      // Verify ignition data was saved
      await wait(2000);
      const ignitionData = await testDb.verifyDataExists<any>('ignition_qualifications', { session_id: testSessionId });
      expect(ignitionData).toBeTruthy();
      expect(ignitionData?.email).toBe(testData.email);
      
      // Now test Launch Control flow
      await page.evaluate(() => {
        window.gameStore?.getState().navigateToScene('launchControlWaitlist');
      });
      
      await expect(page.locator('text=Join the Launch Control Waitlist')).toBeVisible({ timeout: 10000 });
      
      // Fill launch control form with different email to avoid conflicts
      const lcEmail = `lc-${testData.email}`;
      await page.fill('input[placeholder*="name"], input[id*="name"]', testData.name);
      await page.fill('input[type="email"]', lcEmail);
      
      if (testData.phone) {
        const phoneInput = page.locator('input[type="tel"]');
        if (await phoneInput.isVisible()) {
          await phoneInput.fill(testData.phone);
        }
      }
      
      // Submit launch control form
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });
      
      // Verify launch control data was saved
      await wait(2000);
      const lcData = await testDb.verifyDataExists<any>('launch_control_waitlist', { session_id: testSessionId });
      expect(lcData).toBeTruthy();
      expect(lcData?.email).toBe(lcEmail.toLowerCase());
      expect(lcData?.is_waitlist).toBe(true);
      
      // Verify session was updated with adventure progress
      const finalSessionData = await testDb.verifyDataExists<any>('adventure_sessions', { id: testSessionId });
      expect(finalSessionData).toBeTruthy();
      expect(finalSessionData?.email).toBe(testData.email); // Should have ignition email
      
      // Clean up the additional email
      await testDb.cleanupByEmail(lcEmail);
    });
  });
});