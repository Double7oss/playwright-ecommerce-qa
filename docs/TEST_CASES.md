# Automated Test Cases

All cases below are implemented in the current Playwright suite. Detailed interactions and assertions remain in the test specifications.

| ID | Title | Preconditions | Steps | Expected result | Status |
|---|---|---|---|---|---|
| SMOKE-001 | Load the homepage | Site is reachable | Open `/` | Page title is `Automation Exercise` | Automated |
| AUTH-001 | Login with valid credentials | Disposable account exists | Open login; submit valid credentials | Authenticated username and Logout are visible | Automated |
| AUTH-002 | Reject incorrect password | Disposable account exists | Submit correct email with wrong password | Login error is visible | Automated |
| AUTH-003 | Reject unregistered email | Unique unregistered email | Submit email and password | Login error is visible | Automated |
| AUTH-004 | Require login email | Login page open | Submit password without email | Browser reports missing email | Automated |
| AUTH-005 | Require login password | Login page open | Submit email without password | Browser reports missing password | Automated |
| AUTH-006 | End authenticated session | Disposable account exists | Login; select Logout | Login page returns and authenticated controls disappear | Automated |
| AUTH-007 | Display login and signup forms | Signup/login page open | Inspect both forms | Expected headings, fields, and buttons are visible | Automated |
| AUTH-008 | Validate empty login form sequentially | Signup/login page open | Submit empty; then submit email only | Required email and password validation is enforced | Automated |
| AUTH-009 | Reject malformed login email | Signup/login page open | Submit malformed email | Browser reports email type mismatch | Automated |
| AUTH-010 | Require signup name and email | Signup/login page open | Submit empty; then submit name only | Required name and email validation is enforced | Automated |
| AUTH-011 | Reject malformed signup email | Signup/login page open | Submit name and malformed email | Browser reports email type mismatch | Automated |
| AUTH-012 | Open account-information form | Unique email available | Submit valid initial signup details | Account form opens with name and email populated | Automated |
| AUTH-013 | Complete account registration | Unique generated account | Complete and submit registration form | `Account Created!` is visible; account is cleaned up | Automated |
| AUTH-014 | Reject an existing signup email | API-created account exists | Attempt UI signup with the same email | Actual existing-email error is visible | Automated |
| PROD-001 | Display product listing | Site is reachable | Open `/products` | Heading and at least one product card are visible | Automated |
| PROD-002 | Search for an existing product | Products page open | Search for `Blue Top` | Search section and relevant result are visible | Automated |
| PROD-003 | Search for a missing product | Products page open | Search with a random unmatched term | Search section appears with zero product cards | Automated |
| PROD-004 | Display product details | `Blue Top` is listed | Open its detail page | Name, category, price, and availability are visible | Automated |
| E2E-001 | Reach checkout with an authenticated cart | Disposable account exists | Login; search; open product; add to cart; checkout | Login state, cart name/quantity/price, address, and order review are verified | Automated |
| FORM-001 | Validate newsletter email | Signup/login page open | Submit empty and malformed subscription emails | Native required and email-format validation is enforced | Automated |

Standalone cart scenarios are not part of Portfolio V1. Cart behavior is currently validated by `E2E-001`.
