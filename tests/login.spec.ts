import { APIRequestContext, expect, test } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

type TestUser = {
    name: string
    email: string
    password: string
}

async function createUser(request: APIRequestContext): Promise<TestUser> {
    const user: TestUser = {
        name: 'Login QA User',
        email: `login.qa.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`,
        password: 'Playwright123!'
    }

    const response = await request.post('/api/createAccount', {
        form: {
            ...user,
            title: 'Mr',
            birth_date: '1',
            birth_month: 'January',
            birth_year: '1990',
            firstname: 'Login',
            lastname: 'Tester',
            company: 'QA',
            address1: '1 Test Street',
            address2: '',
            country: 'United States',
            zipcode: '10001',
            state: 'New York',
            city: 'New York',
            mobile_number: '1234567890'
        }
    })

    expect(response.ok()).toBeTruthy()
    expect(await response.json()).toMatchObject({ responseCode: 201 })
    return user
}

async function deleteUser(request: APIRequestContext, user: TestUser) {
    const response = await request.delete('/api/deleteAccount', {
        form: { email: user.email, password: user.password }
    })

    expect(response.ok()).toBeTruthy()
    expect(await response.json()).toMatchObject({ responseCode: 200 })
}

test.describe('Login', () => {
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page)
        await loginPage.open()
    })

    test('valid credentials log the user in', async ({ page, request }) => {
        const user = await createUser(request)

        try {
            await loginPage.login(user.email, user.password)

            await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible()
            await expect(loginPage.logoutLink).toBeVisible()
        } finally {
            await deleteUser(request, user)
        }
    })

    test('invalid password displays an error', async ({ request }) => {
        const user = await createUser(request)

        try {
            await loginPage.login(user.email, 'wrong-password')
            await expect(loginPage.errorMessage).toBeVisible()
        } finally {
            await deleteUser(request, user)
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
        const user = await createUser(request)

        try {
            await loginPage.login(user.email, user.password)
            await expect(loginPage.logoutLink).toBeVisible()

            await loginPage.logout()

            await expect(page).toHaveURL(/\/login$/)
            await expect(page.getByRole('link', { name: 'Signup / Login' })).toBeVisible()
            await expect(loginPage.logoutLink).toBeHidden()
        } finally {
            await deleteUser(request, user)
        }
    })
})
