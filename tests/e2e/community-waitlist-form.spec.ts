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
    
    // Navigate to homepage and open the community waitlist modal
    await page.goto('/');
    
    // First, check if CommunitySection is present. If not, we need to add it to the homepage
    const communityButton = page.locator('button:has-text("Join Community Waitlist")');
    if (await communityButton.isVisible()) {
      // Click the button to open the modal
      await communityButton.click();
      
      // Wait for the modal to open and the form to be visible
      await expect(page.locator('text=Join Community Waitlist').last()).toBeVisible({ timeout: 10000 });
    } else {
      throw new Error('Community Waitlist button not found on homepage. The CommunitySection may need to be added to the page.');
    }
  });

  test.afterEach(async () => {
    // Clean up test data
    await testDb.cleanupByEmail(testData.email);
    await testDb.cleanupBySessionId(testSessionId);
  });

  test('should submit community waitlist form successfully and save to database', async ({ page }) => {
    // Wait for the modal to fully load
    await page.waitForLoadState('networkidle');
    await wait(1000);
    
    // Fill out the form inside the modal
    const modal = page.locator('[role="dialog"]');
    
    // Fill the form fields within the modal
    await modal.locator('input[placeholder*="name"], input[id*="name"]').fill(testData.name);
    await modal.locator('input[type="email"]').fill(testData.email);
    
    if (testData.phone) {
      await modal.locator('input[type="tel"]').fill(testData.phone);
    }

    // Select contact method within the modal
    await modal.locator(`input[value="${testData.contactMethod}"]`).check();

    // Find and click the specific submit button in the modal (not the email subscription button)
    const submitButton = modal.locator('button[type="submit"]').last(); // Use last to get the form submit button
    await submitButton.click();

    // Wait for submission to complete - look for success indication
    await expect(modal.locator('text=Submitting')).toBeVisible();
    await expect(modal.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });

    // Give database time to save
    await wait(2000);

    // Verify data was saved to database
    const savedEntry = await testDb.verifyDataExists<any>('community_waitlist', { email: testData.email.toLowerCase() });
    expect(savedEntry).toBeTruthy();
    expect(savedEntry?.name).toBe(testData.name);
    expect(savedEntry?.email).toBe(testData.email.toLowerCase());
    expect(savedEntry?.preferred_contact).toBe(testData.contactMethod);
    expect(savedEntry?.source).toBe('website-community-section');
    expect(savedEntry?.status).toBe('pending');
  });

  test('should validate required fields', async ({ page }) => {
    // Wait for modal to load
    await page.waitForLoadState('networkidle');
    const modal = page.locator('[role="dialog"]');
    
    // Submit button should be disabled when required fields are empty
    const submitButton = modal.locator('button[type="submit"]').last();
    await expect(submitButton).toBeDisabled();

    // Fill name only
    await modal.locator('input[placeholder*="name"], input[id*="name"]').fill(testData.name);
    // Submit button should still be disabled (email required)
    await expect(submitButton).toBeDisabled();

    // Fill email as well
    await modal.locator('input[type="email"]').fill(testData.email);
    // Now submit button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('should validate email format', async ({ page }) => {
    const modal = page.locator('[role="dialog"]');
    
    await modal.locator('input[placeholder*="name"], input[id*="name"]').fill(testData.name);
    
    // Fill invalid email
    const emailInput = modal.locator('input[type="email"]');
    await emailInput.fill('invalid-email');
    
    // Submit button should be enabled since both fields have content
    const submitButton = modal.locator('button[type="submit"]').last();
    await expect(submitButton).toBeEnabled();
    
    // When we try to submit with invalid email, browser validation should prevent it
    await submitButton.click();
    
    // Check that the form wasn't submitted by verifying we're still in the modal
    await expect(modal).toBeVisible();
    
    // Verify the email input is focused (browser validation behavior)
    await expect(emailInput).toBeFocused();
  });

  test('should validate phone number when phone/text contact method selected', async ({ page }) => {
    const modal = page.locator('[role="dialog"]');
    
    // Fill required fields first
    await modal.locator('input[placeholder*="name"], input[id*="name"]').fill(testData.name);
    await modal.locator('input[type="email"]').fill(testData.email);
    
    // Select phone contact method
    await modal.locator('input[value="phone"]').check();
    
    // Submit button should be disabled when phone is required but not provided
    const submitButton = modal.locator('button[type="submit"]').last();
    await expect(submitButton).toBeDisabled();
    
    // Fill phone number
    await modal.locator('input[type="tel"]').fill(testData.phone || '555-123-4567');
    
    // Now submit button should be enabled
    await expect(submitButton).toBeEnabled();
    
    // Test text/SMS option too
    await modal.locator('input[value="text"]').check();
    await expect(submitButton).toBeEnabled();
    
    // Clear phone and check that button becomes disabled again
    await modal.locator('input[type="tel"]').fill('');
    await expect(submitButton).toBeDisabled();
  });

  test('should handle different contact methods correctly', async ({ page }) => {
    const modal = page.locator('[role="dialog"]');
    
    await modal.locator('input[placeholder*="name"], input[id*="name"]').fill(testData.name);
    await modal.locator('input[type="email"]').fill(testData.email);
    await modal.locator('input[type="tel"]').fill('555-123-4567');
    
    const submitButton = modal.locator('button[type="submit"]').last();
    
    // Test each contact method
    const methods = ['email', 'phone', 'text', 'either'];
    
    for (const method of methods) {
      await modal.locator(`input[value="${method}"]`).check();
      await expect(modal.locator(`input[value="${method}"]`)).toBeChecked();
      
      // All should enable submit button when phone is provided
      await expect(submitButton).toBeEnabled();
    }
    
    // Submit with 'either' method and verify database entry
    await modal.locator('input[value="either"]').check();
    await submitButton.click();
    
    await expect(modal.locator('text=Submitting')).toBeVisible();
    await expect(modal.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });
    
    await wait(2000);
    
    const savedEntry = await testDb.verifyDataExists<any>('community_waitlist', { 
      email: testData.email.toLowerCase() 
    });
    expect(savedEntry).toBeTruthy();
    expect(savedEntry?.preferred_contact).toBe('either');
  });

  test('should handle duplicate email submission', async ({ page }) => {
    const modal = page.locator('[role="dialog"]');
    
    // Submit the form once successfully
    await modal.locator('input[placeholder*="name"], input[id*="name"]').fill(testData.name);
    await modal.locator('input[type="email"]').fill(testData.email);
    await modal.locator('input[value="email"]').check();
    
    const submitButton = modal.locator('button[type="submit"]').last();
    await submitButton.click();
    
    await expect(modal.locator('text=Submitting')).toBeVisible();
    await expect(modal.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });
    
    await wait(2000);
    
    // Navigate back to homepage and open modal again
    await page.goto('/');
    const communityButton = page.locator('button:has-text("Join Community Waitlist")');
    await communityButton.click();
    await expect(page.locator('text=Join Community Waitlist').last()).toBeVisible({ timeout: 10000 });
    
    const newModal = page.locator('[role="dialog"]');
    
    // Try to submit with same email
    await newModal.locator('input[placeholder*="name"], input[id*="name"]').fill('Another Name');
    await newModal.locator('input[type="email"]').fill(testData.email);
    await newModal.locator('input[value="email"]').check();
    
    const newSubmitButton = newModal.locator('button[type="submit"]').last();
    await newSubmitButton.click();
    
    // Should show duplicate email error
    await expect(newModal.locator('text=This email is already on the waitlist')).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state during submission', async ({ page }) => {
    const modal = page.locator('[role="dialog"]');
    
    await modal.locator('input[placeholder*="name"], input[id*="name"]').fill(testData.name);
    await modal.locator('input[type="email"]').fill(testData.email);
    await modal.locator('input[value="email"]').check();
    
    const submitButton = modal.locator('button[type="submit"]').last();
    
    // Click submit and immediately check for loading state
    await submitButton.click();
    
    // Should show submitting text and spinner
    await expect(modal.locator('text=Submitting')).toBeVisible();
    await expect(modal.locator('.animate-spin')).toBeVisible();
    
    // Submit button should be disabled during submission
    await expect(submitButton).toBeDisabled();
    
    // Wait for submission to complete
    await expect(modal.locator('text=Submitting')).not.toBeVisible({ timeout: 10000 });
  });

  test('should reset contact method when phone is cleared', async ({ page }) => {
    const modal = page.locator('[role="dialog"]');
    
    await modal.locator('input[placeholder*="name"], input[id*="name"]').fill(testData.name);
    await modal.locator('input[type="email"]').fill(testData.email);
    
    const phoneInput = modal.locator('input[type="tel"]');
    const phoneRadio = modal.locator('input[value="phone"]');
    const emailRadio = modal.locator('input[value="email"]');
    
    // Fill phone number and select phone contact method
    await phoneInput.fill('555-123-4567');
    await phoneRadio.check();
    await expect(phoneRadio).toBeChecked();
    
    // Clear phone number - should automatically reset to email method
    await phoneInput.fill('');
    
    // Contact method should have automatically changed to email
    await expect(emailRadio).toBeChecked();
    await expect(phoneRadio).not.toBeChecked();
    
    // Test same behavior with text method
    await phoneInput.fill('555-987-6543');
    await modal.locator('input[value="text"]').check();
    await expect(modal.locator('input[value="text"]')).toBeChecked();
    
    // Clear phone again
    await phoneInput.fill('');
    
    // Should reset to email again
    await expect(emailRadio).toBeChecked();
    await expect(modal.locator('input[value="text"]')).not.toBeChecked();
  });
});