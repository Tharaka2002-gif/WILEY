Overview

Signup_test.js: 
This Playwright script automates the signup and email verification process on a website. It checks for a saved session (state.json), fills in a signup form, submits it, and then simulates email verification with a code. It logs whether the signup and verification are successful, and closes the browser afterward.

login_page_functional_test.js:
This Playwright script automates the login process with session management. It checks for a saved session (state.json), applies it if available, and loads session data from session.json. The script fills in login credentials, submits the form, and waits for the response. It then checks for a successful login by looking for a specific element on the page and logs the result.

login_negative_test.js:

This Playwright script tests logging in with incorrect credentials while managing session data. It checks for a saved session (state.json) and applies it if available, also loading session data from session.json. The script fills in incorrect login credentials, submits the form, and waits for the response. It then checks for an error message to verify if the login failed, logging the result accordingly.
