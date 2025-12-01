
export const FEED_RATE_GAIN = 1.4; // Gain factor to convert lift to flow rate

/**
 * Calculate saturation temperature (C) from pressure (psi) using Antoine equation
 * @param pressure Pressure in psi
 * @returns Temperature in Celsius
 */
export function calculateSteamTemperature(barg: number): number {
    // If less than 0, fake it cooling to room temp
    if (barg < 0) return (100.1 - 25.0) * barg + 100.1;

    // Convert barg to bara
    const P = 1 + barg;

    // Simplified Antoine equation for water/steam
    const [A, B, C] = [4.6543, 1435.264, -64.848]; // Valid for T < 399.94 C;

    // Calculate temperature in Celsius
    const tempC = (B / (A - Math.log10(P))) - C;
    return tempC - 273.15; // Convert K to C
}

/**
 * Calculate saturated pressure (bar) from temperature (K). Valid for T < 399.94 K.
 * @param T Temperature (K)
 * @returns Saturated Pressure (bar absolute)
 */
export function antoines(T: number) {
    const A = 4.6543;
    const B = 1435.264;
    const C = -64.848;
    return 10 ** (A - B / (T + C));
}


/**
 * Calculate enthalpy of vaporization for water at a given temperature
 * @param T temperature (C)
 * @returns deltaHvap (kJ/kg)
 */
export function dHvap(Tc: number) {
    // Equation for heat of vaporization of saturated water
    // Source: https://mychemengmusings.wordpress.com/2019/01/08/handy-equations-to-calculate-heat-of-evaporation-and-condensation-of-water-steam/
    let H_vap = 193.1 - 10950 * Math.log( ( 374 - Tc ) / 647) * ( 374 - Tc )**0.785 / ( 273 + Tc ); // heat of vaporization (kJ/kg)
    return H_vap;
}
