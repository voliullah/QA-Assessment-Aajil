/**
 * User data interface for flight purchase form
 */
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

/**
 * Generates random user data for flight purchase testing
 * @returns UserData object with randomized values
 */
export function generateUserData(): UserData {
    // Predefined arrays for random selection
    const names = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Maria Garcia', 'David Brown'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
    
    // Select random values from arrays
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomState = states[Math.floor(Math.random() * states.length)];
    
    // Generate and return randomized user data
    return {
        name: randomName,
        address: `${Math.floor(Math.random() * 1000)} Main St`,
        city: randomCity,
        state: randomState,
        zipCode: Math.floor(10000 + Math.random() * 90000).toString(),
        creditCardNumber: Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString(),
        expiryMonth: (Math.floor(Math.random() * 12) + 1).toString().padStart(2, '0'),
        expiryYear: (2025 + Math.floor(Math.random() * 5)).toString(),
        nameOnCard: randomName
    };
}