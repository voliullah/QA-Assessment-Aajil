import { Page, Locator } from '@playwright/test';

/**
 * Handles the homepage interactions including city selection and flight search
 */
export class HomePage {
    readonly page: Page;
    readonly departureDropdown: Locator;
    readonly destinationDropdown: Locator;
    readonly findFlightsButton: Locator;

    // Base URL for the application
    private readonly baseUrl = 'https://blazedemo.com/';

    constructor(page: Page) {
        this.page = page;
        
        // Using XPath for more reliable element targeting
        this.departureDropdown = page.locator('//select[@name="fromPort"]');
        this.destinationDropdown = page.locator('//select[@name="toPort"]');
        this.findFlightsButton = page.locator('//input[@type="submit"]');
    }

    /**
     * Navigates to the application homepage
     */
    async navigate(): Promise<void> {
        await this.page.goto(this.baseUrl);
        await this.waitForPageToLoad();
    }

    /**
     * Waits for the page to be fully loaded and interactive
     */
    private async waitForPageToLoad(): Promise<void> {
        await this.page.waitForSelector('//select[@name="fromPort"]', { 
            timeout: 10000 
        });
    }

    /**
     * Selects departure and destination cities with validation
     * @param departureCity Specific departure city or random if not provided
     * @param destinationCity Specific destination city or random if not provided
     */
    async selectCities(departureCity?: string, destinationCity?: string): Promise<void> {
        if (departureCity) {
            await this.validateAndSelectCity(this.departureDropdown, departureCity, 'departure');
        } else {
            await this.selectRandomCity(this.departureDropdown, 'departure');
        }

        if (destinationCity) {
            await this.validateAndSelectCity(this.destinationDropdown, destinationCity, 'destination');
        } else {
            await this.selectRandomCity(this.destinationDropdown, 'destination');
        }
    }

    /**
     * Validates and selects a specific city from dropdown
     */
    private async validateAndSelectCity(dropdown: Locator, city: string, type: string): Promise<void> {
        const availableCities = await this.getDropdownOptions(dropdown);
        
        if (!availableCities.includes(city)) {
            throw new Error(
                `${type.charAt(0).toUpperCase() + type.slice(1)} city "${city}" not found. ` +
                `Available cities: ${availableCities.join(', ')}`
            );
        }
        
        await dropdown.selectOption(city);
        console.log(`Selected ${type} city: ${city}`);
    }

    /**
     * Selects a random city from the dropdown
     */
    private async selectRandomCity(dropdown: Locator, type: string): Promise<void> {
        const availableCities = await this.getDropdownOptions(dropdown);
        
        if (availableCities.length === 0) {
            throw new Error(`No ${type} cities available in dropdown`);
        }

        const randomIndex = Math.floor(Math.random() * availableCities.length);
        const randomCity = availableCities[randomIndex];
        
        await dropdown.selectOption(randomCity);
        console.log(`Selected random ${type} city: ${randomCity}`);
    }

    /**
     * Extracts all available options from a dropdown (excluding empty values)
     */
    private async getDropdownOptions(dropdown: Locator): Promise<string[]> {
        return await dropdown.locator('//option[@value != ""]').evaluateAll(
            (options: HTMLOptionElement[]) => options.map(option => option.value)
        );
    }

    /**
     * Gets all available departure cities
     */
    async getDepartureCities(): Promise<string[]> {
        return await this.getDropdownOptions(this.departureDropdown);
    }

    /**
     * Gets all available destination cities
     */
    async getDestinationCities(): Promise<string[]> {
        return await this.getDropdownOptions(this.destinationDropdown);
    }

    /**
     * Gets the currently selected departure city
     */
    async getSelectedDepartureCity(): Promise<string> {
        const value = await this.departureDropdown.inputValue();
        return value || 'Not selected';
    }

    /**
     * Gets the currently selected destination city
     */
    async getSelectedDestinationCity(): Promise<string> {
        const value = await this.destinationDropdown.inputValue();
        return value || 'Not selected';
    }

    /**
     * Clicks the find flights button to search for available flights
     */
    async searchFlights(): Promise<void> {
        await this.findFlightsButton.click();
        // Wait for navigation to complete
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Gets all available cities from both dropdowns
     * Useful for debugging and test data generation
     */
    async getAllAvailableCities(): Promise<{ departureCities: string[], destinationCities: string[] }> {
        const [departureCities, destinationCities] = await Promise.all([
            this.getDepartureCities(),
            this.getDestinationCities()
        ]);

        console.log(`Available departure cities: ${departureCities.join(', ')}`);
        console.log(`Available destination cities: ${destinationCities.join(', ')}`);

        return { departureCities, destinationCities };
    }

    /**
     * Validates if a city pair is valid (both cities exist and are different)
     */
    async validateCityPair(departureCity: string, destinationCity: string): Promise<boolean> {
        const [departureCities, destinationCities] = await Promise.all([
            this.getDepartureCities(),
            this.getDestinationCities()
        ]);

        const isValidDeparture = departureCities.includes(departureCity);
        const isValidDestination = destinationCities.includes(destinationCity);
        const areDifferent = departureCity !== destinationCity;

        return isValidDeparture && isValidDestination && areDifferent;
    }
}