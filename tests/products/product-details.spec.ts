import { expect, test } from '@playwright/test'
import { ProductsPage } from '../../pages/ProductsPage'

test.describe('Product details', () => {
    test('opens a product and displays its important information', async ({ page }) => {
        const productsPage = new ProductsPage(page)
        const productName = 'Blue Top'

        await productsPage.goto()
        await expect(productsPage.productCard(productName).first()).toBeVisible()
        await productsPage.openProduct(productName)

        await expect(page).toHaveURL(/\/product_details\/\d+$/)
        await expect(productsPage.productInformation).toBeVisible()
        await expect(productsPage.productInformation.getByRole('heading', { name: productName })).toBeVisible()
        await expect(productsPage.productInformation.getByText(/^Category:/)).toBeVisible()
        await expect(productsPage.productInformation.getByText(/^Rs\.\s*\d+/)).toBeVisible()
        await expect(productsPage.productInformation.getByText(/Availability:/)).toBeVisible()
    })
})
