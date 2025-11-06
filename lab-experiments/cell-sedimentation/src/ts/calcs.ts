
const rho_f = 0.868 // Fluid density (g/cc)
const g = 981 // Gravitational acceleration (cm/s^2)
const mu = 2.15 // Fluid viscosity (mPa.s)

const rho_r = 1.08 // Red cell density (g/cc)
const d_r = 275e-4 // Red cell diameter (cm)
const rho_w = 1.00 // White cell density (g/cc)
const d_w = 550e-4 // White cell diameter (cm)

/**
 * Convert volume fraction to number concentration (#/cc) for particles of diameter dp (cm).
 * @param phi volume fraction of particle
 * @param dp diameter of particle
 */
function concentration(phi: number, dp: number) {
    return 6 * phi / (Math.PI * dp**3);
}
// Wrappers for more concise syntax
export const conc_r = (phi: number) => concentration(phi, d_r);
export const conc_w = (phi: number) => concentration(phi, d_w);


/**
 * Convert concentration (#/cc) to volume fraction for particles of diameter dp (cm).
 * @param conc 
 * @param dp 
 * @returns 
 */
function volume_fraction(conc: number, dp: number) {
    return conc * Math.PI * dp**3 / 6;
}

/**
 * Calculate the settling velocity of an independant particle using Stokes' law.
 * @param d_p 
 * @param rho_p 
 * @returns 
 */
function settling_coeff_g(d_p: number, rho_p: number) {
    const vs = (rho_p - rho_f) * g * d_p**2 / (18 * mu) // m/s
    return vs * 1000 // Convert to mm/s
}

// Average void envelope thickness
function d_Ep(r_conc: number, w_conc: number) {
    if (r_conc + w_conc === 0) return 0;

    const d_avg = (r_conc * d_r + w_conc * d_w)  / (r_conc + w_conc); // Average particle diameter
    const ep = 1.0 - (r_conc + w_conc) * (1 - .4) // Typical packed bed void fraction for spheres
    if (ep >= 1) return 0;

    const pow = (1 - ep) ** (-1/3)
    return d_avg * (pow - 1) // Void envelope thickness
}

// Calculate settling velocities
const Sr_g = settling_coeff_g(d_r, rho_r)
const Sw_g = settling_coeff_g(d_w, rho_w)

// Calculate the effective settling velocity (mm/s) of a mixture of red and white cells.
export function particle_velocities(conc_r: number, conc_w: number) {
    // Convert to volume fractions
    const ph_r = volume_fraction(conc_r, d_r)
    const ph_w = volume_fraction(conc_w, d_w)
    
    const conc_f = 1 - ph_r - ph_w // volume fraction of fluid
    const rho_susp = ph_r * rho_r + ph_w * rho_w + conc_f * rho_f // Suspension density (g/cc)
    const d_ep = d_Ep(ph_r, ph_w) // Average void envelope thickness
    const ep_r = (d_ep > 0) ? 1 - (1 + d_ep / d_r) ** -3 : 1; // Red cell porosity
    const ep_w = (d_ep > 0) ? 1 - (1 + d_ep / d_w) ** -3 : 1; // White cell porosity
    const vrs = Sr_g * (rho_r - rho_susp) / (rho_r - rho_f) * ep_r**4.6 // Red cells hindered settling
    const vws = Sw_g * (rho_w - rho_susp) / (rho_w - rho_f) * ep_w**4.6 // White cells hindered settling
    const vfc = -(ph_r * vrs + ph_w * vws) // Fluid counterflow
    const vrc = vrs + vfc // Red cell velocity
    const vwc = vws + vfc // White cell velocity
    return { red: vrc, white:  vwc } // mm / s
}