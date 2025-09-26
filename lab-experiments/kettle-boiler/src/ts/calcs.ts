
export const FEED_RATE_GAIN = 20; // Gain factor to convert lift to flow rate

/**
 * Calculate saturation temperature (C) from pressure (psi) using Antoine equation
 * @param pressure Pressure in psi
 * @returns Temperature in Celsius
 */
export function calculateSteamTemperature(psig: number): number {
    // Convert psig to bara (1 bar = 14.5038 psi)
    const P = 1 + .068 * psig;

    // Simplified Antoine equation for water/steam
    const [A, B, C] = [4.6543, 1435.264, -64.848]; // Valid for T < 399.94 C;

    // Calculate temperature in Celsius
    const tempC = (B / (A - Math.log10(P))) - C;
    return tempC - 273.15; // Convert K to C
}

