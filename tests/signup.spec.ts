import { APIRequestContext, test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { SignUpPage } from '../pages/SignUpPage'

type SignupUser = {
    name: string
    email: string
    password: string
}

function uniqueUser(prefix: string): SignupUser {
    return {
        name: 'Signup QA User',
        email: `${prefix}.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`,
        password: 'Playwright123!'
    }
}

async function createUser(request: APIRequestContext, user: SignupUser) {
    const response = await request.post('/api/createAccount', {
        form: {
            ...user,
            title: 'Mr',
            birth_date: '1',
            birth_month: 'January',
            birth_year: '1990',
            firstname: 'Signup',
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
}

async function deleteUser(request: APIRequestContext, user: SignupUser, allowMissing = false) {
    const response = await request.delete('/api/deleteAccount', {
        form: { email: user.email, password: user.password }
    })
    const body = await response.json()

    expect(response.ok()).toBeTruthy()
    expect(allowMissing ? [200, 404] : [200]).toContain(body.responseCode)
}

test.describe('Signup and login forms', () => {
    let signUpPage: SignUpPage
    let loginPage: LoginPage

    test.beforeEach(async ({ page }) => {
        signUpPage = new SignUpPage(page)
        loginPage = new LoginPage(page)
        await signUpPage.open()
    })

    test('shows both forms and their fields', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible()
        await expect(loginPage.emailInput).toBeVisible()
        await expect(loginPage.passwordInput).toBeVisible()
        await expect(loginPage.loginButton).toBeEnabled()

        await expect(page.getByRole('heading', { name: 'New User Signup!' })).toBeVisible()
        await expect(signUpPage.nameInput).toBeVisible()
        await expect(signUpPage.emailInput).toBeVisible()
        await expect(signUpPage.signupButton).toBeEnabled()
    })

    test('login requires an email and password', async () => {
        await loginPage.loginButton.click()

        await expect(loginPage.emailInput).toBeFocused()
        expect(await loginPage.emailInput.evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true)

        await loginPage.emailInput.fill('qa@example.com')
        await loginPage.loginButton.click()

        await expect(loginPage.passwordInput).toBeFocused()
        expect(await loginPage.passwordInput.evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true)
    })

    test('login rejects an invalid email format', async () => {
        await loginPage.emailInput.fill('not-an-email')
        await loginPage.passwordInput.fill('test-password')
        await loginPage.loginButton.click()

        await expect(loginPage.emailInput).toBeFocused()
        expect(await loginPage.emailInput.evaluate(input => (input as HTMLInputElement).validity.typeMismatch)).toBe(true)
    })

    test('signup requires a name and email', async () => {
        await signUpPage.signupButton.click()

        await expect(signUpPage.nameInput).toBeFocused()
        expect(await signUpPage.nameInput.evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true)

        await signUpPage.nameInput.fill('QA User')
        await signUpPage.signupButton.click()

        await expect(signUpPage.emailInput).toBeFocused()
        expect(await signUpPage.emailInput.evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true)
    })

    test('signup rejects an invalid email format', async () => {
        await signUpPage.nameInput.fill('QA User')
        await signUpPage.emailInput.fill('not-an-email')
        await signUpPage.signupButton.click()

        await expect(signUpPage.emailInput).toBeFocused()
        expect(await signUpPage.emailInput.evaluate(input => (input as HTMLInputElement).validity.typeMismatch)).toBe(true)
    })

    test('valid signup details open the account information form', async ({ page }) => {
        const uniqueEmail = `qa.${Date.now()}@example.com`

        await signUpPage.signUp('QA User', uniqueEmail)

        await expect(page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible()
        await expect(page.getByLabel('Name *', { exact: true })).toHaveValue('QA User')
        await expect(page.getByLabel('Email *', { exact: true })).toHaveValue(uniqueEmail)
    })

    test('creates an account with complete registration details', async ({ page, request }) => {
        const user = uniqueUser('signup.complete')

        await signUpPage.signUp(user.name, user.email)
        await expect(signUpPage.accountInformationHeading).toBeVisible()

        try {
            await signUpPage.completeAccountInformation({
                password: user.password,
                firstName: 'Signup',
                lastName: 'Tester',
                address: '1 Test Street',
                country: 'United States',
                state: 'New York',
                city: 'New York',
                zipcode: '10001',
                mobileNumber: '1234567890'
            })

            await expect(page.getByRole('heading', { name: 'Account Created!' })).toBeVisible()
        } finally {
            await deleteUser(request, user, true)
        }
    })

    test('rejects signup with an existing email', async ({ request }) => {
        const user = uniqueUser('signup.existing')
        await createUser(request, user)

        try {
            await signUpPage.signUp(user.name, user.email)

            await expect(signUpPage.existingEmailError).toBeVisible()
        } finally {
            await deleteUser(request, user)
        }
    })

    test('newsletter subscription requires a valid email', async ({ page }) => {
        const subscriptionEmail = page.getByPlaceholder('Your email address')
        const subscriptionForm = subscriptionEmail.locator('..')

        await subscriptionForm.getByRole('button').click()
        expect(await subscriptionEmail.evaluate(input => (input as HTMLInputElement).validity.valueMissing)).toBe(true)

        await subscriptionEmail.fill('not-an-email')
        await subscriptionForm.getByRole('button').click()
        expect(await subscriptionEmail.evaluate(input => (input as HTMLInputElement).validity.typeMismatch)).toBe(true)
    })
})
