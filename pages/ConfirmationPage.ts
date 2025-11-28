import { Page, Locator } from '@playwright/test';

// Expected values for validation - easily configurable
const EXPECTED_STATUS = 'PendingCapture';
const MINIMUM_PRICE = 100.00;

export interface PurchaseValidation {
    isValid: boolean;
    errors: string[];
    actualStatus?: string;
    actualPrice?: number;
}

export class ConfirmationPage {
    readonly page: Page;
    readonly statusElement: Locator;
    readonly priceElement: Locator;
    readonly confirmationIdElement: Locator;

    constructor(page: Page) {
        this.page = page;
        
        // Using XPath for more reliable element targeting
        this.statusElement = page.locator('//td[contains(text(), "Status")]/following-sibling::td');
        this.priceElement = page.locator('//td[contains(text(), "Amount")]/following-sibling::td');
        this.confirmationIdElement = page.locator('//td[contains(text(), "Id")]/following-sibling::td');
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForSelector('//h1[contains(text(), "Thank you for your purchase today!")]', {
            timeout: 30000
        });
    }

    async getStatus(): Promise<string> {
        try {
            const status = await this.statusElement.textContent();
            return status?.trim() || 'Unknown';
        } catch (error) {
            console.log('Failed to get status:', error);
            return 'Unknown';
        }
    }

    async getPrice(): Promise<number> {
        try {
            const priceText = await this.priceElement.textContent();
            
            if (!priceText) {
                console.log('No price text found');
                return 0;
            }

            const priceMatch = priceText.match(/(\d+\.?\d*)/);
            if (priceMatch) {
                return parseFloat(priceMatch[1]);
            }
            
            console.log(`Could not parse price from: "${priceText}"`);
            return 0;
            
        } catch (error) {
            console.log('Error getting price:', error);
            return 0;
        }
    }

    async getConfirmationId(): Promise<string> {
        try {
            const id = await this.confirmationIdElement.textContent();
            return id?.trim() || 'Unknown';
        } catch (error) {
            console.log('Error getting confirmation ID:', error);
            return 'Unknown';
        }
    }

    async validatePurchase(): Promise<PurchaseValidation> {
        await this.waitForPageLoad();

        const errors: string[] = [];
        const status = await this.getStatus();
        const price = await this.getPrice();
        const confirmationId = await this.getConfirmationId();

        console.log(`Purchase validation - ID: ${confirmationId}, Status: ${status}, Price: $${price}`);

        if (status !== EXPECTED_STATUS) {
            errors.push(`Expected status "${EXPECTED_STATUS}" but got "${status}"`);
        }

        if (price <= MINIMUM_PRICE) {
            errors.push(`Price $${price} is not greater than $${MINIMUM_PRICE}`);
        }

        return {
            isValid: errors.length === 0,
            errors,
            actualStatus: status,
            actualPrice: price
        };
    }

    // Add back the exact method name that the test is expecting
    async debugConfirmationPage(): Promise<void> {
        console.log('=== Confirmation Page Debug ===');
        
        try {
            const currentUrl = this.page.url();
            console.log('Current URL:', currentUrl);

            const pageTitle = await this.page.title();
            console.log('Page title:', pageTitle);

            const statusExists = await this.statusElement.isVisible();
            const priceExists = await this.priceElement.isVisible();
            const idExists = await this.confirmationIdElement.isVisible();

            console.log('Element visibility - Status:', statusExists, 'Price:', priceExists, 'ID:', idExists);

            const statusText = await this.statusElement.textContent();
            const priceText = await this.priceElement.textContent();
            const idText = await this.confirmationIdElement.textContent();

            console.log('Actual text - Status:', statusText, 'Price:', priceText, 'ID:', idText);

        } catch (error) {
            console.log('Debug failed:', error);
        }
        
        console.log('=== End Debug ===');
    }
}