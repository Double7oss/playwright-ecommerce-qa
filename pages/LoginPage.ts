import { Locator, Page } from '@playwright/test'

export class LoginPage {
    readonly form: Locator
    readonly emailInput: Locator
    readonly passwordInput: Locator
    readonly loginButton: Locator
    readonly errorMessage: Locator
    readonly logoutLink: Locator

    constructor(private page: Page) {
        this.form = page.locator('form[action="/login"]')
        this.emailInput = this.form.getByPlaceholder('Email Address')
        this.passwordInput = this.form.getByPlaceholder('Password')
        this.loginButton = this.form.getByRole('button', { name: 'Login' })
        this.errorMessage = this.form.getByText('Your email or password is incorrect!')
        this.logoutLink = page.getByRole('link', { name: 'Logout' })
    }

    async open() {
        await this.page.goto('/login')
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.loginButton.click()
    }

    async logout() {
        await this.logoutLink.click()
    }
}
