import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { FlightSelectionPage } from '../pages/FlightSelectionPage';
import { PurchasePage, UserData } from '../pages/PurchasePage';
import { ConfirmationPage } from '../pages/ConfirmationPage';
import { generateUserData } from '../utils/dataGenerator';
import { validateInputs, sanitizeInput } from '../utils/helpers';

async function purchaseEndToEnd(
    page: Page,
    deptCity?: string,
    desCity?: string, 
    flightSeq?: number
): Promise<{ status: string; price: number; success: boolean; departureCity: string; destinationCity: string }> {
    
    const sanitizedDeptCity = sanitizeInput(deptCity);
    const sanitizedDesCity = sanitizeInput(desCity);
    validateInputs(sanitizedDeptCity, sanitizedDesCity, flightSeq);

    const homePage = new HomePage(page);
    const flightSelectionPage = new FlightSelectionPage(page);
    const purchasePage = new PurchasePage(page);
    const confirmationPage = new ConfirmationPage(page);

    try {
        await homePage.navigate();
        
        if (!sanitizedDeptCity || !sanitizedDesCity) {
            const departureCities = await homePage.getDepartureCities();
            const destinationCities = await homePage.getDestinationCities();
        }

        await homePage.selectCities(sanitizedDeptCity, sanitizedDesCity);
        
        const actualDepartureCity = await homePage.getSelectedDepartureCity();
        const actualDestinationCity = await homePage.getSelectedDestinationCity();

        await homePage.searchFlights();

        await flightSelectionPage.selectFlight(flightSeq);

        const userData: UserData = generateUserData();
        await purchasePage.fillPassengerDetails(userData);
        await purchasePage.completePurchase();

        const validation = await confirmationPage.validatePurchase();
        
        if (!validation.isValid) {
            throw new Error(`Purchase validation failed: ${validation.errors.join(', ')}`);
        }

        const status = await confirmationPage.getStatus();
        const price = await confirmationPage.getPrice();
        const confirmationId = await confirmationPage.getConfirmationId();

        return {
            status,
            price,
            success: true,
            departureCity: actualDepartureCity,
            destinationCity: actualDestinationCity
        };

    } catch (error) {
        throw error;
    }
}

test.describe('Flight Purchase End-to-End Tests', () => {
    test('Scenario 1: Boston, Berlin, flight 2', async ({ page }) => {
        const result = await purchaseEndToEnd(page, 'Boston', 'Berlin', 2);
        expect(result.success).toBe(true);
        expect(result.status).toBe('PendingCapture');
        expect(result.price).toBeGreaterThan(100);
        expect(result.departureCity).toBe('Boston');
        expect(result.destinationCity).toBe('Berlin');
    });

    test('Scenario 2: Random parameters', async ({ page }) => {
        const result = await purchaseEndToEnd(page);
        expect(result.success).toBe(true);
        expect(result.status).toBe('PendingCapture');
        expect(result.price).toBeGreaterThan(100);
        expect(result.departureCity).toBeDefined();
        expect(result.destinationCity).toBeDefined();
        expect(result.departureCity).not.toBe('');
        expect(result.destinationCity).not.toBe('');
    });

    test('Scenario 3: Boston, Boston, 1 - should fail validation', async ({ page }) => {
        try {
            await purchaseEndToEnd(page, 'Boston', 'Boston', 1);
            throw new Error('Test should have failed but passed');
        } catch (error) {
            expect(error instanceof Error).toBe(true);
            expect((error as Error).message).toContain('Departure and destination cities cannot be the same');
        }
    });

    test('Scenario 4: Paris, Berlin, 0 - should fail validation', async ({ page }) => {
        try {
            await purchaseEndToEnd(page, 'Paris', 'Berlin', 0);
            throw new Error('Test should have failed but passed');
        } catch (error) {
            expect(error instanceof Error).toBe(true);
            expect((error as Error).message).toContain('Flight sequence must be greater than 0');
        }
    });

    test('Scenario 5: Paris, London, 1', async ({ page }) => {
        const result = await purchaseEndToEnd(page, 'Paris', 'London', 1);
        expect(result.success).toBe(true);
        expect(result.status).toBe('PendingCapture');
        expect(result.price).toBeGreaterThan(100);
        expect(result.departureCity).toBe('Paris');
        expect(result.destinationCity).toBe('London');
    });

    test('Scenario 1: Boston, Berlin, flight 2 - DEBUG', async ({ page }) => {
        const homePage = new HomePage(page);
        const flightSelectionPage = new FlightSelectionPage(page);
        const purchasePage = new PurchasePage(page);
        const confirmationPage = new ConfirmationPage(page);

        try {
            await homePage.navigate();
            await homePage.selectCities('Boston', 'Berlin');
            await homePage.searchFlights();

            const allFlights = await flightSelectionPage.getAllFlights();
            const selectedFlight = await flightSelectionPage.selectFlight(2);

            const userData: UserData = generateUserData();
            await purchasePage.fillPassengerDetails(userData);
            await purchasePage.completePurchase();

            await confirmationPage.debugConfirmationPage();
            
            const validation = await confirmationPage.validatePurchase();
            const status = await confirmationPage.getStatus();
            const price = await confirmationPage.getPrice();
            const confirmationId = await confirmationPage.getConfirmationId();

            expect(validation.isValid).toBe(true);
            expect(status).toBe('PendingCapture');
            expect(price).toBeGreaterThan(100);

        } catch (error) {
            await page.screenshot({ path: `debug-scenario1-${Date.now()}.png`, fullPage: true });
            throw error;
        }
    });
});