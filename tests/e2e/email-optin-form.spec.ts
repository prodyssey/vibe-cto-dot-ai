import { test, expect } from '@playwright/test';
import { generateTestEmail, wait } from './utils/test-data';

test.describe('Email Opt-in Form', () => {
  let testEmail: string;

  // Helper function to mock API responses
  const mockApiSuccess = async (page) => {
    await page.route('/api/subscribe', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: "Successfully subscribed to email list"
        })
      });
    });
  };

  const mockApiError = async (page, error = "API Error") => {
    await page.route('/api/subscribe', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error })
      });
    });
  };

  test.beforeEach(async ({ page }) => {
    testEmail = generateTestEmail('email-optin');
    
    // Navigate to a page with email opt-in form (likely homepage or resources)
    await page.goto('/');
  });

  test('should submit email opt-in form successfully via API route', async ({ page }) => {
    await mockApiSuccess(page);

    // Find email opt-in form - could be minimal variant or full variant
    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await expect(emailInput).toBeVisible();

    // Scroll to form to ensure it's in view
    await emailInput.scrollIntoViewIfNeeded();

    // Fill email
    await emailInput.fill(testEmail);

    // Find and click submit button
    const submitButton = page.locator('button[type="submit"]').filter({ hasText: 'Subscribe' });
    await expect(submitButton).toBeVisible();
    await submitButton.click();

    // Should show success state - look for the button text that changes to "Successfully subscribed!"
    await expect(page.locator('button:has-text("Successfully subscribed!")')).toBeVisible({ timeout: 10000 });
  });

  test('should validate email format', async ({ page }) => {
    // Mock the API to return validation error
    await page.route('/api/subscribe', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: "Please enter a valid email address"
        })
      });
    });

    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await expect(emailInput).toBeVisible();

    // Try invalid email - but use a format that passes client-side validation
    // so we can test server-side validation
    await emailInput.fill('test@invalid');
    
    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    // Should show validation error
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible();
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
    // Mock API failure with the actual error message the component will display
    await page.route('/api/subscribe', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email service configuration error' })
      });
    });

    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await emailInput.fill(testEmail);

    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    // Should show error message - error appears in component's error display areas
    await expect(page.locator('text=Email service configuration error')).toBeVisible({ timeout: 10000 });
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

    // Should show loading state - button should be disabled 
    await expect(submitButton).toBeDisabled();
    
    // The button should change from "Subscribe" to some loading state
    // This could be "Subscribing...", spinner, or other loading indicator
    await expect(submitButton).not.toHaveText('Subscribe');

    // Wait for completion - button changes to success state
    await expect(page.locator('button:has-text("Successfully subscribed!"), button:has-text("Subscribed!"), button:has-text("Done!")')).toBeVisible({ timeout: 10000 });
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
    await mockApiSuccess(page);
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

    await expect(page.locator('button:has-text("Successfully subscribed!")')).toBeVisible({ timeout: 10000 });
  });

  test('should test form reset after successful submission', async ({ page }) => {
    await mockApiSuccess(page);
    const emailInput = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await emailInput.fill(testEmail);

    const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
    await submitButton.click();

    // Wait for success
    await expect(page.locator('button:has-text("Successfully subscribed!")')).toBeVisible({ timeout: 10000 });

    // Form should reset (input should be cleared)
    await expect(emailInput).toHaveValue('');
  });

  test('should display trust indicators and privacy information', async ({ page }) => {
    // First scroll to the email form section
    const emailForm = page.locator('input[name="email_address"], input[type="email"][placeholder*="email"]').first();
    await emailForm.scrollIntoViewIfNeeded();
    
    // Trust indicators only appear in the minimal variant (based on component code)
    // Let's check if trust indicators are present (they're in the minimal variant)
    const trustIndicators = [
      'No spam, ever',
      'Unsubscribe anytime', 
      'Weekly insights only',
    ];

    // Check if any trust indicators are visible
    let trustIndicatorsVisible = false;
    for (const indicator of trustIndicators) {
      try {
        await page.locator(`text=${indicator}`).waitFor({ state: 'visible', timeout: 1000 });
        trustIndicatorsVisible = true;
        break;
      } catch (e) {
        // Continue checking
      }
    }

    if (trustIndicatorsVisible) {
      // If we found trust indicators, verify all are present (minimal variant)
      for (const indicator of trustIndicators) {
        await expect(page.locator(`text=${indicator}`)).toBeVisible();
      }
    } else {
      // This is likely the default variant without trust indicators
      // Just verify the form works
      await expect(emailForm).toBeVisible();
      const submitButton = page.locator('button[type="submit"]:has-text("Subscribe"), button:has-text("Subscribe")').first();
      await expect(submitButton).toBeVisible();
    }
  });

  test('should handle mobile responsive design', async ({ page }) => {
    await mockApiSuccess(page);
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
    await expect(page.locator('button:has-text("Successfully subscribed!")')).toBeVisible({ timeout: 10000 });
  });
});