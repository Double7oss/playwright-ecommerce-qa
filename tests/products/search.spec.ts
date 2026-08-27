import { expect, test } from '@playwright/test'
import { ProductsPage } from '../../pages/ProductsPage'

test.describe('Product listing and search', () => {
    let productsPage: ProductsPage

    test.beforeEach(async ({ page }) => {
        productsPage = new ProductsPage(page)
        await productsPage.goto()
    })

    test('displays the products listing', async ({ page }) => {
        await expect(page).toHaveURL(/\/products$/)
        await expect(productsPage.allProductsHeading).toBeVisible()
        await expect(productsPage.productCards.first()).toBeVisible()
    })

    test('returns relevant results for an existing product', async () => {
        const searchTerm = 'Blue Top'

        await productsPage.searchProduct(searchTerm)

        await expect(productsPage.searchedProductsHeading).toBeVisible()
        await expect(productsPage.productCards.first()).toBeVisible()
        await expect(productsPage.productCard(searchTerm).first()).toContainText(searchTerm)
    })

    test('displays no product cards for a non-existing product', async () => {
        const searchTerm = `no-product-${Date.now()}-${Math.random().toString(36).slice(2)}`

        await productsPage.searchProduct(searchTerm)

        await expect(productsPage.searchedProductsHeading).toBeVisible()
        await expect(productsPage.productCards).toHaveCount(0)
    })
})
