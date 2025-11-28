import { Page, Locator } from '@playwright/test';

/**
 * Represents the flight details extracted from the flight selection table
 */
export interface FlightDetails {
    airline: string;
    price: string;
    flightNumber: string;
}

/**
 * Handles flight selection page interactions and flight data extraction
 */
export class FlightSelectionPage {
    readonly page: Page;
    readonly flightRows: Locator;
    readonly flightTable: Locator;

    constructor(page: Page) {
        this.page = page;
        this.flightTable = page.locator('//table[contains(@class, "table")]');
        this.flightRows = this.flightTable.locator('//tbody/tr');
    }

    /**
     * Selects a flight based on sequence number or randomly if not specified
     * @param flightSequence The flight number to select (1-based index)
     * @returns Details of the selected flight
     * @throws Error if no flights available or invalid sequence
     */
    async selectFlight(flightSequence?: number): Promise<FlightDetails> {
        const flightCount = await this.getAvailableFlightsCount();
        
        if (flightCount === 0) {
            throw new Error('No flights available for the selected route');
        }

        const selectedIndex = this.calculateFlightIndex(flightSequence, flightCount);
        const selectedFlight = await this.getFlightDetails(selectedIndex);
        
        console.log(`Selecting flight ${selectedIndex + 1}: ${selectedFlight.airline} for ${selectedFlight.price}`);

        await this.clickFlightButton(selectedIndex);
        
        return selectedFlight;
    }

    /**
     * Calculates the flight index based on sequence or random selection
     */
    private calculateFlightIndex(flightSequence: number | undefined, totalFlights: number): number {
        if (flightSequence !== undefined) {
            if (flightSequence <= 0) {
                throw new Error('Flight sequence must be greater than 0');
            }
            if (flightSequence > totalFlights) {
                throw new Error(`Flight sequence ${flightSequence} exceeds available flights (${totalFlights})`);
            }
            return flightSequence - 1;
        }
        
        return Math.floor(Math.random() * totalFlights);
    }

    /**
     * Clicks the choose flight button for the specified flight row
     */
    private async clickFlightButton(rowIndex: number): Promise<void> {
        const chooseButton = this.flightRows.nth(rowIndex).locator('//input[@type="submit"]');
        await chooseButton.click();
    }

    /**
     * Extracts flight details from a specific table row
     * @param index Zero-based index of the flight row
     * @returns Flight details including airline, price, and flight number
     */
    async getFlightDetails(index: number): Promise<FlightDetails> {
        const row = this.flightRows.nth(index);
        const cells = await row.locator('td').allTextContents();
        
        // Table structure: [Choose Button, Flight#, Airline, Departs, Arrives, Price]
        return {
            airline: this.safeExtract(cells, 2, 'Airline'),
            price: this.safeExtract(cells, 5, 'Price'),
            flightNumber: this.safeExtract(cells, 1, 'Flight Number')
        };
    }

    /**
     * Safely extracts text from array with bounds checking
     */
    private safeExtract(cells: string[], index: number, fieldName: string): string {
        if (cells.length > index && cells[index]?.trim()) {
            return cells[index].trim();
        }
        console.warn(`Missing ${fieldName} data in flight row`);
        return 'Unknown';
    }

    /**
     * Retrieves details for all available flights
     * Useful for debugging and validation
     */
    async getAllFlights(): Promise<FlightDetails[]> {
        const flightDetails: FlightDetails[] = [];
        const flightCount = await this.getAvailableFlightsCount();
        
        console.log(`Found ${flightCount} available flights:`);
        
        for (let i = 0; i < flightCount; i++) {
            const details = await this.getFlightDetails(i);
            flightDetails.push(details);
            console.log(`  ${i + 1}. ${details.airline} - ${details.price} (${details.flightNumber})`);
        }
        
        return flightDetails;
    }

    /**
     * Returns the number of available flights for current route
     */
    async getAvailableFlightsCount(): Promise<number> {
        return await this.flightRows.count();
    }

    /**
     * Waits for flights to load and be available for selection
     */
    async waitForFlightsToLoad(): Promise<void> {
        await this.page.waitForSelector('//table[contains(@class, "table")]//tbody/tr', {
            timeout: 10000
        });
    }
}