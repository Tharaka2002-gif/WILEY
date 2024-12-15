const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;

test.describe('Signup and Email Verification Tests', () => {

  test('Test Signup and Email Verification', async ({ page, context }) => {
    const contextOptions = { ignoreHTTPSErrors: true };

    // Check for state.json and apply storage state if it exists
    try {
      await fs.access('state.json');
      contextOptions.storageState = 'state.json';
    } catch (err) {
      console.log("No state.json found, continuing without it.");
    }

    // Create a new context with the appropriate options
    await context.close(); // Close the default context
    context = await page.context().browser().newContext(contextOptions);
    page = await context.newPage();

    // Navigate to signup page
    await page.goto('https://wiley.scienceconnect.io/register');

    // Fill in the signup form
    const userEmail = 'user@example.com';
    const userPassword = 'securePassword123';

    await page.fill('input[name="email"]', userEmail);
    await page.fill('input[name="password"]', userPassword);
    await page.fill('input[name="confirmPassword"]', userPassword);

    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    // Check if signup was successful
    const isSignupSuccessful = await page.isVisible('.signup-success');
    if (isSignupSuccessful) {
      console.log('Signup successful. Please verify your email.');

      // Simulate email verification process
      const verificationCode = '123456'; // Replace with dynamically fetched code
      await page.goto('https://wiley.scienceconnect.io/verify-email');
      await page.fill('input[name="verification_code"]', verificationCode);
      await page.click('button[type="submit"]');
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

      // Check if verification was successful
      const isVerificationSuccessful = await page.isVisible('.verification-success');
      console.log(isVerificationSuccessful ? 'Verification successful!' : 'Verification failed.');
    } else {
      console.log('Signup failed. Please check the details and try again.');
    }

    // Close the browser
    await page.context().browser().close();
  });

});
