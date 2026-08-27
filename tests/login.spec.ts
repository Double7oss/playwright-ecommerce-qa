import { expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { buildTestAccount, createTestAccount, deleteTestAccount } from '../utils/test-accounts'

test.describe('Login', () => {
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page)
        await loginPage.open()
    })

    test('valid credentials log the user in', async ({ page, request }) => {
        const user = buildTestAccount('login.valid', { name: 'Login QA User' })
        await createTestAccount(request, user)

        try {
            await loginPage.login(user.email, user.password)

            await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible()
            await expect(loginPage.logoutLink).toBeVisible()
        } finally {
            await deleteTestAccount(request, user)
        }
    })

    test('invalid password displays an error', async ({ request }) => {
        const user = buildTestAccount('login.invalid-password', { name: 'Login QA User' })
        await createTestAccount(request, user)

        try {
            await loginPage.login(user.email, 'wrong-password')
            await expect(loginPage.errorMessage).toBeVisible()
        } finally {
            await deleteTestAccount(request, user)
        }
    })

    test('invalid email displays an error', async () => {
        await loginPage.login(`missing.${Date.now()}@example.com`, 'Playwright123!')

        await expect(loginPage.errorMessage).toBeVisible()
    })

    test('empty email is rejected by validation', async () => {
        await loginPage.passwordInput.fill('Playwright123!')
        await loginPage.loginButton.click()

        await expect(loginPage.emailInput).toBeFocused()
        expect(await loginPage.emailInput.evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true)
    })

    test('empty password is rejected by validation', async () => {
        await loginPage.emailInput.fill('qa@example.com')
        await loginPage.loginButton.click()

        await expect(loginPage.passwordInput).toBeFocused()
        expect(await loginPage.passwordInput.evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true)
    })

    test('logout ends the user session', async ({ page, request }) => {
        const user = buildTestAccount('login.logout', { name: 'Login QA User' })
        await createTestAccount(request, user)

        try {
            await loginPage.login(user.email, user.password)
            await expect(loginPage.logoutLink).toBeVisible()

            await loginPage.logout()

            await expect(page).toHaveURL(/\/login$/)
            await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible()
            await expect(loginPage.logoutLink).toBeHidden()
        } finally {
            await deleteTestAccount(request, user)
        }
    })
})
