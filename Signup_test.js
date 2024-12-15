const { chromium } = require('playwright');
const fs = require('fs').promises;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const contextOptions = { ignoreHTTPSErrors: true };

  try {
    await fs.access("state.json");
    contextOptions.storageState = 'state.json';
  } catch (err) {
    console.log("No state.json found, continuing without it.");
  }

  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  await page.goto('https://wiley.scienceconnect.io/register');

  const userEmail = 'user@example.com';
  const userPassword = 'securePassword123';

  await page.fill('input[name="email"]', userEmail);
  await page.fill('input[name="password"]', userPassword);
  await page.fill('input[name="confirmPassword"]', userPassword);

  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  const isSignupSuccessful = await page.isVisible('.signup-success');
  if (isSignupSuccessful) {
    console.log('Signup successful. Please verify your email.');
    
    const verificationCode = '123456'; // Replace this with dynamically fetched code
    await page.goto('https://wiley.scienceconnect.io/verify-email');
    await page.fill('input[name="verification_code"]', verificationCode);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

    const isVerificationSuccessful = await page.isVisible('.verification-success');
    console.log(isVerificationSuccessful ? 'Verification successful!' : 'Verification failed.');
  } else {
    console.log('Signup failed. Please check the details and try again.');
  }

  await browser.close();
})();
