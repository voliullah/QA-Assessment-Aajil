import { Page, Locator } from '@playwright/test';

export interface UserData {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    creditCardNumber: string;
    expiryMonth: string;
    expiryYear: string;
    nameOnCard: string;
}

export class PurchasePage {
    readonly page: Page;
    readonly nameInput: Locator;
    readonly addressInput: Locator;
    readonly cityInput: Locator;
    readonly stateInput: Locator;
    readonly zipCodeInput: Locator;
    readonly cardTypeDropdown: Locator;
    readonly creditCardNumberInput: Locator;
    readonly creditCardMonthInput: Locator;
    readonly creditCardYearInput: Locator;
    readonly nameOnCardInput: Locator;
    readonly purchaseFlightButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.nameInput = page.locator('//input[@id="inputName"]');
        this.addressInput = page.locator('//input[@id="address"]');
        this.cityInput = page.locator('//input[@id="city"]');
        this.stateInput = page.locator('//input[@id="state"]');
        this.zipCodeInput = page.locator('//input[@id="zipCode"]');
        this.cardTypeDropdown = page.locator('//select[@id="cardType"]');
        this.creditCardNumberInput = page.locator('//input[@id="creditCardNumber"]');
        this.creditCardMonthInput = page.locator('//input[@id="creditCardMonth"]');
        this.creditCardYearInput = page.locator('//input[@id="creditCardYear"]');
        this.nameOnCardInput = page.locator('//input[@id="nameOnCard"]');
        this.purchaseFlightButton = page.locator('//input[@type="submit"]');
    }

    async fillPassengerDetails(userData: UserData): Promise<void> {
        await this.nameInput.fill(userData.name);
        await this.addressInput.fill(userData.address);
        await this.cityInput.fill(userData.city);
        await this.stateInput.fill(userData.state);
        await this.zipCodeInput.fill(userData.zipCode);
        await this.cardTypeDropdown.selectOption('visa');
        await this.creditCardNumberInput.fill(userData.creditCardNumber);
        await this.creditCardMonthInput.fill(userData.expiryMonth);
        await this.creditCardYearInput.fill(userData.expiryYear);
        await this.nameOnCardInput.fill(userData.nameOnCard);
    }

    async completePurchase(): Promise<void> {
        await this.purchaseFlightButton.click();
    }
}