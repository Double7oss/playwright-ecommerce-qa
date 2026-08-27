import { expect, test } from '@playwright/test'
import { CartPage } from '../../pages/CartPage'
import { LoginPage } from '../../pages/LoginPage'
import { ProductsPage } from '../../pages/ProductsPage'
import { buildTestAccount, createTestAccount, deleteTestAccount } from '../../utils/test-accounts'

test('authenticated user can search, add a product, and reach checkout', async ({ page, request }) => {
    const productName = 'Blue Top'
    const user = buildTestAccount('e2e.purchase', {
        name: 'E2E QA User',
        firstName: 'E2E'
    })
    await createTestAccount(request, user)
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
        await expect(page.locator('#address_delivery')).toContainText(`${user.firstName} ${user.lastName}`)
        await expect(page.locator('#address_delivery')).toContainText(user.address)
        await expect(cartPage.productRow(productName)).toBeVisible()
    } finally {
        await deleteTestAccount(request, user)
    }
})
