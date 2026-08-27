import { APIRequestContext, expect, test } from '@playwright/test'
import { CartPage } from '../../pages/CartPage'
import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'

type E2EUser = {
    name: string
    email: string
    password: string
}

async function createUser(request: APIRequestContext): Promise<E2EUser> {
    const user: E2EUser = {
        name: 'E2E QA User',
        email: `e2e.purchase.${Date.now()}.${Math.random().toString(36).slice(2)}@example.com`,
        password: 'Playwright123!'
    }
    const response = await request.post('/api/createAccount', {
        form: {
            ...user,
            title: 'Mr',
            birth_date: '1',
            birth_month: 'January',
            birth_year: '1990',
            firstname: 'E2E',
            lastname: 'Tester',
            company: 'QA Portfolio',
            address1: '123 Test Street',
            address2: '',
            country: 'United States',
            zipcode: '10001',
            state: 'Test State',
            city: 'Test City',
            mobile_number: '1234567890'
        }
    })

    expect(response.ok()).toBeTruthy()
    expect(await response.json()).toMatchObject({ responseCode: 201 })
    return user
}

async function deleteUser(request: APIRequestContext, user: E2EUser) {
    const response = await request.delete('/api/deleteAccount', {
        form: { email: user.email, password: user.password }
    })

    expect(response.ok()).toBeTruthy()
    expect(await response.json()).toMatchObject({ responseCode: 200 })
}

test('authenticated user can search, add a product, and reach checkout', async ({ page, request }) => {
    const productName = 'Blue Top'
    const user = await createUser(request)
    const loginPage = new LoginPage(page)
    const productsPage = new ProductsPage(page)
    const cartPage = new CartPage(page)

    try {
        await loginPage.open()
        await loginPage.login(user.email, user.password)
        await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible()

        await productsPage.goto()
        await productsPage.searchProduct(productName)
        await expect(productsPage.productCard(productName).first()).toBeVisible()
        await productsPage.openProduct(productName)
        await expect(productsPage.productInformation.getByRole('heading', { name: productName })).toBeVisible()

        const productPrice = await productsPage.productInformation.getByText(/^Rs\.\s*\d+$/).textContent()
        expect(productPrice).not.toBeNull()

        await productsPage.addProductToCart()
        await expect(productsPage.cartModal).toBeVisible()
        await productsPage.viewCartFromModal()

        const cartRow = cartPage.productRow(productName)
        await expect(cartRow).toBeVisible()
        await expect(cartRow.locator('.cart_quantity')).toHaveText('1')
        await expect(cartRow.locator('.cart_price')).toContainText(productPrice!)
        await expect(cartRow.locator('.cart_total')).toContainText(productPrice!)

        await cartPage.proceedToCheckout()

        await expect(page).toHaveURL(/\/checkout$/)
        await expect(page.getByRole('heading', { name: 'Address Details' })).toBeVisible()
        await expect(page.getByRole('heading', { name: 'Review Your Order' })).toBeVisible()
        await expect(page.locator('#address_delivery')).toContainText('E2E Tester')
        await expect(page.locator('#address_delivery')).toContainText('123 Test Street')
        await expect(cartPage.productRow(productName)).toBeVisible()
    } finally {
        await deleteUser(request, user)
    }
})
