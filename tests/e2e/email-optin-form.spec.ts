import { test, expect } from '@playwright/test';
import { generateTestEmail, wait } from './utils/test-data';

test.describe('Email Opt-in Form', () => {
  let testEmail: string;

  test.beforeEach(async ({ page }) => {
    testEmail = generateTestEmail('email-optin');
    
    // Navigate to a page with email opt-in form (likely homepage or resources)
    await page.goto('/');
  });

  test('should submit email opt-in form successfully via API route', async ({ page }) => {
    // Find email opt-in form - could be minimal variant or full variant
    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await expect(emailInput).toBeVisible();

    // Fill email
    await emailInput.fill(testEmail);

    // Find and click submit button
    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    // Wait for loading state
    await expect(submitButton).toBeDisabled();
    
    // Should show success state or message
    await expect(page.locator('text=Subscribed, text=Success')).toBeVisible({ timeout: 10000 });
  });

  test('should validate email format', async ({ page }) => {
    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await expect(emailInput).toBeVisible();

    // Try invalid email
    await emailInput.fill('invalid-email');
    
    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    // Should show validation error
    await expect(page.locator('text=Invalid email')).toBeVisible();
  });

  test('should require email field', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await expect(submitButton).toBeVisible();

    // Try to submit without email
    await submitButton.click();

    // Form should not submit or should show validation
    // The button should either be disabled or show validation error
    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await expect(emailInput).toHaveAttribute('required');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('/api/subscribe', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });

    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await emailInput.fill(testEmail);

    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    // Should show error message
    await expect(page.locator('text=error, text=failed')).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state during submission', async ({ page }) => {
    // Slow down the API call to observe loading state
    await page.route('/api/subscribe', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Successfully subscribed' })
      });
    });

    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await emailInput.fill(testEmail);

    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    // Should show loading state
    await expect(submitButton).toBeDisabled();
    await expect(page.locator('text=Subscribing')).toBeVisible();

    // Wait for completion
    await expect(page.locator('text=Subscribed, text=Success')).toBeVisible({ timeout: 5000 });
  });

  test('should test both minimal and full variants if present', async ({ page }) => {
    // Check if there are multiple email forms on the page
    const emailInputs = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]');
    const count = await emailInputs.count();

    if (count > 1) {
      // Test each variant
      for (let i = 0; i < count; i++) {
        const uniqueEmail = generateTestEmail(`email-optin-${i}`);
        
        const emailInput = emailInputs.nth(i);
        await emailInput.fill(uniqueEmail);

        // Find corresponding submit button (should be a sibling or nearby)
        const submitButton = page.locator('button[type="submit"]').nth(i);
        await submitButton.click();

        // Wait for response
        await wait(3000);

        // Reset for next iteration if needed
        if (i < count - 1) {
          await page.reload();
        }
      }
    }
  });

  test('should handle ConvertKit integration via API route', async ({ page }) => {
    // Mock successful ConvertKit response
    await page.route('/api/subscribe', async (route) => {
      const request = route.request();
      const postData = JSON.parse(request.postData() || '{}');
      
      // Verify request structure
      expect(postData.email).toBe(testEmail);
      expect(postData.source).toBeDefined();
      
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ 
          success: true, 
          message: 'Successfully subscribed to email list',
          subscription: { id: 'test-subscription-id' }
        })
      });
    });

    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await emailInput.fill(testEmail);

    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    await expect(page.locator('text=Subscribed, text=Success')).toBeVisible({ timeout: 10000 });
  });

  test('should test form reset after successful submission', async ({ page }) => {
    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await emailInput.fill(testEmail);

    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    // Wait for success
    await expect(page.locator('text=Subscribed, text=Success')).toBeVisible({ timeout: 10000 });

    // Form should reset (input should be cleared)
    await expect(emailInput).toHaveValue('');
  });

  test('should display trust indicators and privacy information', async ({ page }) => {
    // Check for common trust indicators
    const trustIndicators = [
      'No spam',
      'Unsubscribe anytime',
      'Weekly insights',
    ];

    for (const indicator of trustIndicators) {
      await expect(page.locator(`text=${indicator}`)).toBeVisible();
    }
  });

  test('should handle mobile responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await expect(emailInput).toBeVisible();

    await emailInput.fill(testEmail);

    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await expect(submitButton).toBeVisible();
    
    // Check if mobile-specific text is shown
    const mobileText = page.locator('text=Done!, text=Loading...');
    
    await submitButton.click();
    
    // Form should still work on mobile
    await expect(page.locator('text=Subscribed, text=Success')).toBeVisible({ timeout: 10000 });
  });
});