import { test, expect } from '@playwright/test';

test.describe('Debug Contact Form', () => {
  test('should debug contact form step by step', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    
    console.log('1. Page loaded, title:', await page.title());
    
    // Check if form elements are present
    const nameInput = page.locator('#name');
    const emailInput = page.locator('#email');
    const messageInput = page.locator('#message');
    const selectTrigger = page.locator('[role="combobox"]');
    const submitButton = page.locator('button:has-text("Send Message")');
    
    console.log('2. Form elements present:');
    console.log('   - Name input:', await nameInput.count());
    console.log('   - Email input:', await emailInput.count());
    console.log('   - Message input:', await messageInput.count());
    console.log('   - Select trigger:', await selectTrigger.count());
    console.log('   - Submit button:', await submitButton.count());
    
    // Wait for elements to be visible
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    await expect(messageInput).toBeVisible({ timeout: 5000 });
    
    console.log('3. Basic elements are visible');
    
    // Fill out form slowly
    await nameInput.fill('Test User');
    console.log('4. Filled name');
    
    await emailInput.fill('test@example.com');
    console.log('5. Filled email');
    
    await messageInput.fill('This is a test message');
    console.log('6. Filled message');
    
    // Try to interact with select
    try {
      await selectTrigger.click();
      console.log('7. Clicked select trigger');
      
      // Wait for options to load
      await page.waitForTimeout(2000);
      const options = page.locator('[role="option"]');
      const optionCount = await options.count();
      console.log('8. Found', optionCount, 'select options');
      
      if (optionCount > 0) {
        await options.first().click();
        console.log('9. Selected first option');
      } else {
        // If no options, close the dropdown by clicking elsewhere
        await page.click('body');
        console.log('9. Closed dropdown (no options found)');
      }
    } catch (error) {
      console.log('7. Error with select:', (error as Error).message);
      // Try to close any open dropdown
      await page.press('Escape');
      await page.screenshot({ path: 'debug-select-error.png', fullPage: true });
    }
    
    // Try to submit
    console.log('10. About to submit form');
    await submitButton.click();
    
    // Wait and see what happens
    await page.waitForTimeout(5000);
    console.log('11. Waited 5 seconds after submit');
    
    // Check for any success/error messages
    const successMessage = page.locator('text=Thank');
    const errorMessage = page.locator('text=error, text=Error');
    
    console.log('12. Success messages:', await successMessage.count());
    console.log('13. Error messages:', await errorMessage.count());
    
    // Take final screenshot
    await page.screenshot({ path: 'debug-final-state.png', fullPage: true });
  });
});