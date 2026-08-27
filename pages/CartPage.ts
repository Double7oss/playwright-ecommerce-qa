import { Locator, Page } from '@playwright/test'

export class CartPage {
    readonly cartTable: Locator
    readonly proceedToCheckoutLink: Locator

    constructor(private page: Page) {
        this.cartTable = page.locator('#cart_info')
        this.proceedToCheckoutLink = page.getByText('Proceed To Checkout', { exact: true })
    }

    productRow(productName: string) {
        return this.cartTable.locator('tbody tr').filter({ hasText: productName })
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutLink.click()
    }
}
