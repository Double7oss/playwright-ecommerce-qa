import { Locator, Page } from '@playwright/test'

export class ProductsPage {
    readonly allProductsHeading: Locator
    readonly searchedProductsHeading: Locator
    readonly searchInput: Locator
    readonly searchButton: Locator
    readonly productCards: Locator
    readonly productInformation: Locator
    readonly addToCartButton: Locator
    readonly cartModal: Locator

    constructor(private page: Page) {
        this.allProductsHeading = page.getByRole('heading', { name: 'All Products' })
        this.searchedProductsHeading = page.getByRole('heading', { name: 'Searched Products' })
        this.searchInput = page.getByPlaceholder('Search Product')
        // The icon-only search button has no accessible name on this page.
        this.searchButton = page.locator('#submit_search')
        this.productCards = page.locator('.product-image-wrapper')
        this.productInformation = page.locator('.product-information')
        this.addToCartButton = this.productInformation.getByRole('button', { name: /Add to cart/i })
        // The Bootstrap cart modal is visible but does not expose a dialog role.
        this.cartModal = page.locator('#cartModal')
    }

    async goto() {
        await this.page.goto('/products')
    }

    async searchProduct(searchTerm: string) {
        await this.searchInput.fill(searchTerm)
        await this.searchButton.click()
    }

    productCard(productName: string) {
        return this.productCards.filter({ hasText: productName })
    }

    async openProduct(productName: string) {
        await this.productCard(productName)
            .getByRole('link', { name: 'View Product' })
            .click()
    }

    async addProductToCart() {
        await this.addToCartButton.click()
    }

    async viewCartFromModal() {
        await this.cartModal.getByRole('link', { name: 'View Cart' }).click()
    }
}
