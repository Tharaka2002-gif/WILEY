const { chromium } = require('playwright-chromium');
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

  // Perform login action
  const email = 'email'; // Replace with your user name
  const password = 'password'; // Replace with your password

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for login success or failure
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  // Check if login is successful by checking for the logged-in user element
  const loggedIn = await page.isVisible('selector_for_logged_in_element'); // Update with the appropriate selector
  console.log(loggedIn ? 'Login successful!' : 'Login failed.');

  // Close browser
  await browser.close();
})();
