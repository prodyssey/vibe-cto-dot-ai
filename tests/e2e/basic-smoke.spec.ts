import { test, expect } from '@playwright/test';

test.describe('Basic Smoke Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Vibe CTO|CTO/);
  });

  test('should load contact page', async ({ page }) => {
    await page.goto('/contact');
    // Check for contact form presence - look for any form or contact form elements
    await page.waitForLoadState('networkidle');
    const hasForm = await page.locator('form').count() > 0;
    const hasContactForm = await page.locator('[data-testid="contact-form"], .contact-form, input[type="email"]').count() > 0;
    
    if (!hasForm && !hasContactForm) {
      // Take screenshot for debugging
      await page.screenshot({ path: 'debug-contact-page.png' });
      console.log('Page title:', await page.title());
      console.log('Page URL:', page.url());
    }
    
    expect(hasForm || hasContactForm).toBe(true);
  });

  test('should find email subscription form on homepage', async ({ page }) => {
    await page.goto('/');
    // Look for email input
    const emailInput = page.locator('input[type="email"]').first();
    await expect(emailInput).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to adventure game', async ({ page }) => {
    await page.goto('/adventure');
    // Should load without error
    await expect(page).toHaveTitle(/Adventure|Game/);
  });

  test('database connection should work', async ({ page }) => {
    // This will test our database utilities
    const { testDb } = await import('./utils/database');
    const isHealthy = await testDb.healthCheck();
    expect(isHealthy).toBe(true);
  });
});