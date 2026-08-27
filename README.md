# Playwright Web QA Portfolio

## Overview

This project demonstrates functional web testing with Playwright and TypeScript against [Automation Exercise](https://automationexercise.com/). The current suite covers authentication, product listing and search, product details, and one cross-domain checkout journey.

## End-to-End Coverage

The suite includes a realistic business journey covering:

**Authentication → Product Search → Product Selection → Cart → Checkout**

The test creates a unique fictional user through the API, logs in through the UI, searches for and selects a product, validates its cart state, and verifies the authenticated checkout review and delivery address. It stops before placing the order and does not submit payment information.

## Running Locally

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

Useful test commands:

```bash
npm run test:headed
npm run test:ui
npm run typecheck
npm run test:report
```

Run only the end-to-end journey:

```bash
npx playwright test tests/e2e/purchase-flow.spec.ts
```

Open the latest HTML report:

```bash
npm run test:report
```

## CI/CD

The GitHub Actions workflow is configured to run on pushes to `main` and pull requests targeting `main`. It installs locked npm dependencies, installs Chromium with its Linux system dependencies, validates TypeScript, and executes the Playwright suite.

Every workflow run attempts to upload the generated HTML report as a GitHub artifact. Failed runs also preserve `test-results`, which may contain failure screenshots and retry traces or videos. Successful and failed executions can be reviewed in the repository's [GitHub Actions history](https://github.com/Double7oss/playwright-ecommerce-qa/actions/workflows/playwright.yml).
