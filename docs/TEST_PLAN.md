# Test Plan

## Objective

Validate the main public e-commerce journeys in Automation Exercise while demonstrating maintainable Playwright and TypeScript test design, meaningful assertions, controlled test data, and repeatable CI execution.

## Scope

In scope:

- Homepage availability smoke check
- Signup, login, logout, and authentication validation
- Product listing, search, and product details
- Cart state within the end-to-end journey
- Authenticated checkout review without payment submission
- API-assisted creation and deletion of disposable test accounts

Out of scope for Portfolio V1:

- Payment submission and completed orders
- Standalone cart scenario coverage
- Firefox, WebKit, mobile, and branded-browser projects
- Accessibility, visual regression, performance, and security testing
- Email delivery and third-party integrations

## Strategy

- Use focused functional tests for positive, negative, and browser-validation behavior.
- Keep tests independent; each test navigates and prepares its own state.
- Use the public account API for fast, deterministic preconditions and cleanup when registration itself is not under test.
- Use one readable E2E journey to validate transitions across authentication, product search, cart, and checkout.
- Prefer role, label, placeholder, and visible-text locators. Use narrowly scoped CSS selectors where the application lacks suitable accessible markup.

## Environment

- Application: `https://automationexercise.com/`
- Test runner: Playwright Test
- Language: TypeScript
- Configured browser project: Chromium using Playwright's Desktop Chrome device profile
- CI: GitHub-hosted Ubuntu runner with Node.js 24

## Test Types

- Smoke testing
- Functional UI testing
- Positive and negative testing
- Native HTML form-validation testing
- API-assisted UI testing
- End-to-end business-flow testing

## Entry Criteria

- Automation Exercise is reachable.
- Node dependencies and the configured Playwright browser are installed.
- The public account API is available for tests requiring disposable users.

## Exit Criteria

- TypeScript validation succeeds.
- All configured Playwright tests complete without unexpected failures.
- Created accounts are cleaned up where practical.
- HTML reporting and failure evidence are available locally or as CI artifacts.

## Risks and Assumptions

- The suite depends on a public external service and may be affected by outages, rate limiting, advertising, or unannounced UI changes.
- Product assertions use a product currently provided by the application (`Blue Top`).
- Test accounts use unique generated `example.com` addresses and fictional profile data.
- CI intentionally uses one worker to reduce load on the public site; local execution may use several workers.
