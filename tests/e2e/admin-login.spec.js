const { test, expect } = require('@playwright/test');

test.describe('Admin Login Flow', () => {
  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('/admin');

    // Fill the login form with invalid credentials
    await page.fill('input[placeholder="Username"]', 'invalid_user');
    await page.fill('input[placeholder="Password"]', 'invalid_password');
    await page.click('button:has-text("Sign In")');

    // It should display an error message
    const errorMessage = page.locator('text=Invalid credentials');
    await expect(errorMessage).toBeVisible();
  });

  // Note: For a real E2E test, we'd use a test environment with a known admin user.
  // The auto-seed logic will trigger on the very first login if the DB is empty.
});
