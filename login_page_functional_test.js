const { test, expect } = require('@playwright/test');
const fs = require('fs');

test.describe('Login Page Tests with Session Management', () => {

  test('Test Login with Correct Credentials', async ({ page, context }) => {
    // Context options with storageState if available
    var contextOptions = {
      ignoreHTTPSErrors: true,
    };

    // Check for state.json and apply storage state if it exists
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

    // Fill in login credentials
    const email = 'email'; // Replace with your user name
    const password = 'password'; // Replace with your password

    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for navigation or login attempt
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    // Check for login success or failure
    const loggedIn = await page.isVisible('selector_for_logged_in_element'); // Update with the appropriate selector
    if (loggedIn) {
      console.log('Login successful!');
    } else {
      console.log('Login failed.');
    }
  });

});
