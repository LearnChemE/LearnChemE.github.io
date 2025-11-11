import { CONC_ARRAY_SIZE } from "./Vials"

const rho_f = 0.868 // Fluid density (g/cc)
const g = 981 // Gravitational acceleration (cm/s^2)
const mu = 2.15 // Fluid viscosity (mPa.s)

const rho_r = 1.08 // Red cell density (g/cc)
const d_r = 275e-4 // Red cell diameter (cm)
const rho_w = 1.00 // White cell density (g/cc)
const d_w = 550e-4 // White cell diameter (cm)

/**
 * Convert volume fraction to number concentration (#/[l]^3) for particles of diameter dp units [l].
 * @param phi volume fraction of particle
 * @param dp diameter of particle
 */
function concentration(phi: number, dp: number) {
    return 6 * phi / (Math.PI * dp**3);
}
// Wrappers for more concise syntax
export const conc_r = (phi: number) => concentration(phi, d_r);
export const conc_w = (phi: number) => concentration(phi, d_w);

const cr_max = conc_r(1);
const cw_max = conc_w(1);

/**
 * Convert concentration (#/cc) to volume fraction for particles of diameter dp (cm).
 * @param conc 
 * @param dp 
 * @returns 
 */
function volume_fraction(conc: number, dp: number) {
    return conc * Math.PI * dp**3 / 6;
}
// Wrappers for more concise syntax
export const phi_r = (phi: number) => volume_fraction(phi, d_r);
export const phi_w = (phi: number) => volume_fraction(phi, d_w);

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

/**
 * Calculate spatial derivative of 1D y mesh with x differential dx
 * @param y array of scalar values
 * @param dx spacing between y values
 * @returns dydx array
 */
export function grad(y: number[], dx: number) {
    const len = y.length;
    if (len < 2) return [0];

    // Generate array and set edges
    const dydx = new Array(len);
    dydx[0] = (y[1] - y[0]) / dx;
    dydx[len-1] = (y[len-1] - y[len-2]) / dx;

    // Calc middle derivs with 2nd order accuracy
    for (let i=1; i<len-1; i++) {
        const left = y[i-1];
        const right= y[i+1];
        dydx[i] = (right - left) / 2 / dx;
    }
    
    return dydx;
}

export function rhs_adv_diff(y: number[], dz: number) {
    // Unpack y
    const cr = y.slice(0,CONC_ARRAY_SIZE); 
    const cw = y.slice(CONC_ARRAY_SIZE);
    // Enforce BCs
    cr[0] = 0; cw[0] = 0;
    cr[CONC_ARRAY_SIZE - 1] = cr[CONC_ARRAY_SIZE - 2]; cw[CONC_ARRAY_SIZE - 1] = cw[CONC_ARRAY_SIZE - 2];

    // Determine velocity
    const vr: number[] = []; 
    const vw: number[] = [];
    cr.forEach((cri: number, i: number) => {
        const { red, white } = particle_velocities(cri, cw[i]);
        vr.push(red);
        vw.push(white);
    });
    vr[0] = 0; vw[0] = 0 // Top is free surface
    vr[-1] = 0; vw[-1] = 0 // Bottom stops flow

    // Diffusion
    const dcr = grad(cr, dz);
    const dcw = grad(cw, dz);
    const dif_r = grad(cr.map((cri, i) => 5 * (1 - cri / cr_max)**10 * dcr[i]), dz);
    const dif_w = grad(cr.map((cwi, i) => 5 * (1 - cwi / cw_max)**10 * dcw[i]), dz);
    dif_r[0] = dif_r[CONC_ARRAY_SIZE - 1] = 0; // no flux
    dif_w[0] = dif_w[CONC_ARRAY_SIZE - 1] = 0; // no flux
    // Advection
    const adv_r = grad(cr.map((cri, i) => cri * vr[i]), dz);
    const adv_w = grad(cw.map((cwi, i) => cwi * vw[i]), dz);

    const drdt = dif_r.map((di, i) => di - adv_r[i]);
    const dwdt = dif_w.map((di, i) => di - adv_w[i]);
    drdt[0]  = 0; dwdt[0]  = 0 // Maintain free surface
    // drdt[-1] = drdt[-2]; dwdt[-1] = dwdt[-2] // 

    return drdt.concat(dwdt);
}