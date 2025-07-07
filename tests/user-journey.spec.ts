import { test, expect } from '@playwright/test';

test.describe('Skilla User Journey', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'testpassword123',
    fullName: 'Test User'
  };

  test('complete user journey: signup → login → onboarding → passport', async ({ page }) => {
    // Navigate to signup page
    await page.goto('/signup');
    
    // Fill out signup form
    await page.fill('input[type="text"]', testUser.fullName);
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    
    // Submit signup form
    await page.click('button[type="submit"]');
    
    // Should redirect to login page with success message
    await expect(page).toHaveURL('/login');
    await expect(page.locator('text=Account created')).toBeVisible();
    
    // Login with the new account
    await page.fill('input[type="email"]', testUser.email);
    await page.fill('input[type="password"]', testUser.password);
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Your Professional Skill Passport')).toBeVisible();
    
    // Navigate to onboarding
    await page.click('text=Start Assessment');
    await expect(page).toHaveURL('/onboarding');
    
    // Complete first few questions of onboarding
    await expect(page.locator('text=What is your full name?')).toBeVisible();
    await page.fill('textarea', testUser.fullName);
    await page.click('text=Next');
    
    // Second question
    await expect(page.locator('text=Which business unit do you belong to?')).toBeVisible();
    await page.fill('textarea', 'Engineering');
    await page.click('text=Next');
    
    // Third question
    await expect(page.locator('text=What are your primary technical skills?')).toBeVisible();
    await page.fill('textarea', 'JavaScript, React, TypeScript, Node.js');
    await page.click('text=Next');
    
    // Follow-up question should appear
    await expect(page.locator('text=How many years of experience')).toBeVisible();
    await page.fill('textarea', 'JavaScript: 5 years, React: 3 years, TypeScript: 2 years, Node.js: 4 years');
    await page.click('text=Next');
    
    // Continue through a few more questions
    await page.fill('textarea', 'JavaScript, TypeScript, Python');
    await page.click('text=Next');
    
    // Skip through remaining questions quickly for test
    for (let i = 0; i < 6; i++) {
      await page.fill('textarea', 'Sample response for testing');
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Complete")');
      await nextButton.click();
      
      // Break if we've reached the complete button
      if (await page.locator('button:has-text("Complete")').isVisible()) {
        break;
      }
    }
    
    // Should redirect to passport page
    await expect(page).toHaveURL('/passport');
    await expect(page.locator('text=Your Skill Passport')).toBeVisible();
    
    // Verify passport content
    await expect(page.locator('text=Profile Information')).toBeVisible();
    await expect(page.locator('text=Skills & Competencies')).toBeVisible();
    await expect(page.locator('text=Download JSON')).toBeVisible();
    
    // Test download functionality
    const downloadPromise = page.waitForEvent('download');
    await page.click('text=Download JSON');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.json');
    
    // Navigate back to dashboard
    await page.goto('/');
    await expect(page.locator('text=Complete').first()).toBeVisible();
  });

  test('admin dashboard access', async ({ page }) => {
    // This test assumes there's an admin user in the system
    // In a real test environment, you'd set up test data
    
    await page.goto('/admin/onboarding-status');
    
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL('/login');
    
    // For testing purposes, we'll just verify the page structure
    // In a real test, you'd login as an admin user first
  });

  test('responsive design on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/login');
    
    // Verify mobile layout
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Test navigation to signup
    await page.click('text=Sign up');
    await expect(page).toHaveURL('/signup');
    
    // Verify mobile signup form
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('voice input fallback', async ({ page }) => {
    // Navigate to onboarding (assuming user is logged in)
    await page.goto('/onboarding');
    
    // Check if voice input component is present
    const micButton = page.locator('button:has([data-testid="mic-icon"], [class*="lucide-mic"])');
    
    if (await micButton.isVisible()) {
      // Test microphone button interaction
      await micButton.click();
      
      // Verify textarea is still functional as fallback
      await expect(page.locator('textarea')).toBeVisible();
    }
  });
});