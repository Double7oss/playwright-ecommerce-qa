import { Locator, Page } from '@playwright/test'

export type RegistrationDetails = {
    password: string
    firstName: string
    lastName: string
    address: string
    country: string
    state: string
    city: string
    zipcode: string
    mobileNumber: string
}

export class SignUpPage {
    readonly form: Locator
    readonly nameInput: Locator
    readonly emailInput: Locator
    readonly signupButton: Locator
    readonly existingEmailError: Locator
    readonly accountInformationHeading: Locator
    readonly titleMrRadio: Locator
    readonly passwordInput: Locator
    readonly birthDaySelect: Locator
    readonly birthMonthSelect: Locator
    readonly birthYearSelect: Locator
    readonly firstNameInput: Locator
    readonly lastNameInput: Locator
    readonly addressInput: Locator
    readonly countrySelect: Locator
    readonly stateInput: Locator
    readonly cityInput: Locator
    readonly zipcodeInput: Locator
    readonly mobileNumberInput: Locator
    readonly createAccountButton: Locator

    constructor(private page: Page) {
        this.form = page.locator('form[action="/signup"]')
        this.nameInput = this.form.getByPlaceholder('Name')
        this.emailInput = this.form.getByPlaceholder('Email Address')
        this.signupButton = this.form.getByRole('button', { name: 'Signup' })
        this.existingEmailError = this.form.getByText('Email Address already exist!')
        this.accountInformationHeading = page.getByText('ENTER ACCOUNT INFORMATION')
        this.titleMrRadio = page.getByRole('radio', { name: 'Mr.' })
        this.passwordInput = page.getByLabel('Password *', { exact: true })
        this.birthDaySelect = page.locator('#days')
        this.birthMonthSelect = page.locator('#months')
        this.birthYearSelect = page.locator('#years')
        this.firstNameInput = page.getByLabel('First name *', { exact: true })
        this.lastNameInput = page.getByLabel('Last name *', { exact: true })
        this.addressInput = page.getByLabel('Address * (Street address, P.O. Box, Company name, etc.)', { exact: true })
        this.countrySelect = page.getByLabel('Country *', { exact: true })
        this.stateInput = page.getByLabel('State *', { exact: true })
        this.cityInput = page.getByLabel('City *', { exact: true })
        // The page's Zipcode label is incorrectly associated with the City input.
        this.zipcodeInput = page.locator('#zipcode')
        this.mobileNumberInput = page.getByLabel('Mobile Number *', { exact: true })
        this.createAccountButton = page.getByRole('button', { name: 'Create Account' })
    }

    async open(){
        await this.page.goto('/signup')
    }

    async signUp(name : string, email: string){
        await this.nameInput.fill(name)
        await this.emailInput.fill(email)
        await this.signupButton.click()
    }

    async completeAccountInformation(details: RegistrationDetails) {
        await this.titleMrRadio.check()
        await this.passwordInput.fill(details.password)
        await this.birthDaySelect.selectOption('1')
        await this.birthMonthSelect.selectOption('1')
        await this.birthYearSelect.selectOption('1990')
        await this.firstNameInput.fill(details.firstName)
        await this.lastNameInput.fill(details.lastName)
        await this.addressInput.fill(details.address)
        await this.countrySelect.selectOption({ label: details.country })
        await this.stateInput.fill(details.state)
        await this.cityInput.fill(details.city)
        await this.zipcodeInput.fill(details.zipcode)
        await this.mobileNumberInput.fill(details.mobileNumber)
        await this.createAccountButton.click()
    }
}
