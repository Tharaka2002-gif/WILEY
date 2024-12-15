const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  var contextOptions = {
    ignoreHTTPSErrors: true,
  };

  fs.stat("state.json", (err, stats) => {
    if (err === null) {
      contextOptions['storageState'] = 'state.json';
    }
  });

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  // Load session if available
  fs.stat("session.json", (err, stats) => {
    if (err === null) {
      const sessionStorage = JSON.parse(fs.readFileSync("session.json").toString("utf-8"));
      context.addInitScript(storage => {
        if (window.location.hostname === 'wiley.scienceconnect.io') {
          const entries = JSON.parse(storage);
          for (const [key, value] of Object.entries(entries)) {
            window.sessionStorage.setItem(key, value);
          }
        }
      }, sessionStorage);
    }
  });

  // Navigate to login page
  await page.goto('https://wiley.scienceconnect.io/login');

  // Test with wrong credentials
  const wrongEmail = 'wrong_Email';
  const wrongPassword = 'wrong_password';

  await page.fill('input[name="Email"]', wrongEmail);
  await page.fill('input[name="password"]', wrongPassword);
  await page.click('button[type="submit"]');

  // Wait for navigation or login attempt
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {});

  // Check for login failure indication (e.g., error message)
  const loginFailed = await page.isVisible('selector_for_error_message'); // Replace with actual selector for the error message or failure indication

  if (loginFailed) {
    console.log('Login denied with wrong credentials.');
  } else {
    console.log('Login might have succeeded (unexpected).');
  }

  // Close browser
  await browser.close();
})();
