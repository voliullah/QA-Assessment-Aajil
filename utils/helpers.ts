// Input validation for flight search
export function validateInputs(deptCity?: string, desCity?: string, flightSeq?: number): void {
    // Check for same city
    if (deptCity && desCity && deptCity === desCity) {
        throw new Error('Departure and destination cities cannot be the same');
    }
    
    // Validate flight sequence
    if (flightSeq !== undefined && flightSeq < 0) {
        throw new Error('Flight sequence must be a positive integer');
    }
}

// Clean up input strings
export function sanitizeInput(input?: string): string | undefined {
    return input?.trim();
}

// Get random item from array
export function getRandomElement<T>(array: T[]): T {
    if (array.length === 0) {
        throw new Error('Cannot get random element from empty array');
    }
    return array[Math.floor(Math.random() * array.length)];
}