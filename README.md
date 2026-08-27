# Playwright Web QA Portfolio

[![Playwright Tests](https://github.com/Double7oss/playwright-ecommerce-qa/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/Double7oss/playwright-ecommerce-qa/actions/workflows/playwright.yml)

A Playwright + TypeScript QA automation project demonstrating functional, negative, validation, API-assisted, and end-to-end testing against the public [Automation Exercise](https://automationexercise.com/) e-commerce application.

## What This Project Demonstrates

- Positive and negative functional UI scenarios
- Native browser form-validation checks
- Page Object Model with assertions kept visible in tests
- API-assisted creation and cleanup of disposable accounts
- Product listing, search, details, and cart-to-checkout validation
- Independent test execution with controlled data
- GitHub Actions, HTML reporting, screenshots, traces, and retry videos

## Current Coverage

The suite contains 21 logical scenarios and 21 browser executions because one Chromium project is configured:

| Area | Tests | Coverage |
|---|---:|---|
| Authentication | 14 | Signup, login, logout, positive/negative paths, required fields, and email validation |
| Products and search | 4 | Listing, matching and empty search results, and product details |
| End-to-end | 1 | Authentication → search → selection → cart → checkout review |
| Other | 2 | Homepage smoke check and newsletter form validation |

There are no standalone cart tests. Cart name, quantity, price, total, and checkout transition are validated within the E2E journey. Payment is not submitted and no order is completed.

## Architecture

```text
Test Specifications
        ↓
Page Objects
        ↓
Playwright
        ↓
Automation Exercise

API Setup → UI Behavior → API Cleanup
```

Page Objects hold reusable locators and interaction details; behavioral assertions remain visible in the specifications. API-assisted setup creates unique disposable users quickly when registration is not the behavior under test, and cleanup removes those accounts even when practical UI assertions fail.

## QA Approach

- Functional UI, smoke, negative, and native form-validation testing
- Page Object Model without hiding test intent
- Resilient role, label, placeholder, and text locators where supported
- Unique fictional test accounts with API-assisted setup and cleanup
- Independent tests with Playwright auto-waiting and no arbitrary sleeps
- HTML reports, failure screenshots, first-retry traces, and retry-only videos
- Chromium execution locally and in GitHub Actions

## Technology

- Playwright Test 1.62.1
- TypeScript 7.0.2
- Node.js 24 in CI
- GitHub Actions
- npm

## Browser Coverage

The configured project uses Playwright Chromium with the Desktop Chrome device profile. Firefox, WebKit, branded Chrome, mobile, and cross-browser execution are not part of Portfolio V1.

## Project Structure

```text
pages/                    Page Objects
tests/                    Smoke and authentication specifications
tests/products/           Product listing, search, and detail tests
tests/e2e/                Cross-domain checkout journey
utils/test-accounts.ts    Disposable account data and API lifecycle
docs/                     Test plan, test cases, and bug-report log
.github/workflows/        GitHub Actions workflow
playwright.config.ts      Browser, reporter, retry, and evidence settings
```

## Running Locally

Prerequisites: Node.js 20 or newer and npm.

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

Useful commands:

```bash
npm run test:headed
npm run test:ui
npm run test:debug
npm run test:report
npx playwright test tests/e2e/purchase-flow.spec.ts
```

## Reports and Debugging

Playwright generates an HTML report for real executions. Failure screenshots are retained automatically; CI retries additionally collect a trace and video. Generated reports and test results are ignored by Git and uploaded as workflow artifacts where appropriate.

## Key Engineering Decisions

- **Page Object Model:** repeated navigation, locators, and UI interactions are centralized without hiding behavioral assertions.
- **API-assisted setup:** the account API creates controlled preconditions quickly while login, validation, and checkout behavior remain UI-based.
- **Test isolation:** tests create unique data, prepare their own state, and attempt cleanup without depending on execution order.
- **Reliable locators:** roles, labels, placeholders, and visible text are preferred; scoped CSS is used only where application markup requires it.

## CI/CD

[GitHub Actions](https://github.com/Double7oss/playwright-ecommerce-qa/actions/workflows/playwright.yml) runs on pushes to `main` and pull requests targeting `main`. The workflow installs locked dependencies, installs Chromium and Linux browser dependencies, validates TypeScript, executes the suite, always attempts to upload the HTML report, and uploads failure evidence when tests fail.

CI has been verified with a real successful GitHub-hosted run. Generated reports are stored as workflow artifacts rather than committed to the repository.

## QA Documentation

- [Test Plan](docs/TEST_PLAN.md)
- [Automated Test Cases](docs/TEST_CASES.md)
- [Bug Reports](docs/BUG_REPORTS.md)

## Limitations

Portfolio V1 intentionally excludes standalone cart coverage, payment submission, completed orders, cross-browser projects, accessibility, visual regression, performance, and security testing. The suite targets a public external site, so availability and unannounced application changes remain external risks.
