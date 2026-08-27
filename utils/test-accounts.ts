import { APIRequestContext, expect } from '@playwright/test'

export type TestAccount = {
    name: string
    email: string
    password: string
    firstName: string
    lastName: string
    company: string
    address: string
    country: string
    zipcode: string
    state: string
    city: string
    mobileNumber: string
}

export function buildTestAccount(prefix: string, overrides: Partial<TestAccount> = {}): TestAccount {
    return {
        name: 'QA Test User',
        email: `${prefix}.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`,
        password: 'Playwright123!',
        firstName: 'QA',
        lastName: 'Tester',
        company: 'QA Portfolio',
        address: '123 Test Street',
        country: 'United States',
        zipcode: '10001',
        state: 'Test State',
        city: 'Test City',
        mobileNumber: '1234567890',
        ...overrides
    }
}

export async function createTestAccount(request: APIRequestContext, account: TestAccount) {
    const response = await request.post('/api/createAccount', {
        form: {
            name: account.name,
            email: account.email,
            password: account.password,
            title: 'Mr',
            birth_date: '1',
            birth_month: 'January',
            birth_year: '1990',
            firstname: account.firstName,
            lastname: account.lastName,
            company: account.company,
            address1: account.address,
            address2: '',
            country: account.country,
            zipcode: account.zipcode,
            state: account.state,
            city: account.city,
            mobile_number: account.mobileNumber
        }
    })

    expect(response.ok()).toBeTruthy()
    expect(await response.json()).toMatchObject({ responseCode: 201 })
}

export async function deleteTestAccount(
    request: APIRequestContext,
    account: TestAccount,
    options: { allowMissing?: boolean } = {}
) {
    const response = await request.delete('/api/deleteAccount', {
        form: { email: account.email, password: account.password }
    })
    const body = await response.json()

    expect(response.ok()).toBeTruthy()
    expect(options.allowMissing ? [200, 404] : [200]).toContain(body.responseCode)
}
