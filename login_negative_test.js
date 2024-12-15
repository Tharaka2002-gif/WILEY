const { test, expect } = require('@playwright/test');
const fs = require('fs');

test.describe('Login Page Tests with Session Management', () => {

  test('Test Login with Wrong Credentials', async ({ page, context }) => {
    // Context options with storageState if available
    var contextOptions = {
      ignoreHTTPSErrors: true,
    };

    if (fs.existsSync('state.json')) {
      contextOptions['storageState'] = 'state.json';
    }

    await context.close(); // Close default context
    context = await page.context().browser().newContext(contextOptions);
    page = await context.newPage();

    // Load session if available
    if (fs.existsSync('session.json')) {
      const sessionStorage = JSON.parse(fs.readFileSync('session.json', 'utf-8'));
      await context.addInitScript(storage => {
        if (window.location.hostname === 'wiley.scienceconnect.io') {
          const entries = JSON.parse(storage);
          for (const [key, value] of Object.entries(entries)) {
            window.sessionStorage.setItem(key, value);
          }
        }
      }, JSON.stringify(sessionStorage));
    }

    // Navigate to login page
    await page.goto('https://wiley.scienceconnect.io/login');

    // Fill in wrong credentials
    const wrongEmail = 'wrong_Email';
    const wrongPassword = 'wrong_password';

    await page.fill('input[name="Email"]', wrongEmail);
    await page.fill('input[name="password"]', wrongPassword);
    await page.click('button[type="submit"]');

    // Wait for navigation or login attempt
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {});

    // Check for login failure indication
    const loginFailed = await page.isVisible('selector_for_error_message'); // Replace with actual selector for error message

    if (loginFailed) {
      console.log('Login denied with wrong credentials.');
    } else {
      console.log('Login might have succeeded (unexpected).');
    }
  });

});
