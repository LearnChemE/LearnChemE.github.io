import type { Profile } from "../types/globals"
import { rk45 } from "./rk45"

const rho_f = 0.868 // Fluid density (g/cc)
const g = 981 // Gravitational acceleration (cm/s^2)
const mu = 2.15 // Fluid viscosity (mPa.s)

const rho_r = 1.08 // Red cell density (g/cc)
const d_r = 275e-4 // Red cell diameter (cm)
const rho_w = 1.00 // White cell density (g/cc)
const d_w = 550e-4 // White cell diameter (cm)

export const TUBE_LENGTH = 305; // mm
export const CONC_ARRAY_SIZE = 500; // points in finite element mesh

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

    // BCs
    cr[0] = 0; cw[0] = 0;
    cr[CONC_ARRAY_SIZE - 1] = cr[CONC_ARRAY_SIZE - 2]; 
    cw[CONC_ARRAY_SIZE - 1] = cw[CONC_ARRAY_SIZE - 2];

    // For advection term
    const crvr = new Array(CONC_ARRAY_SIZE);
    const cwvw = new Array(CONC_ARRAY_SIZE);
    crvr[0] = 0;
    cwvw[0] = 0;
    for (let i=1;i<CONC_ARRAY_SIZE;i++) {
        // Determine velocity
        const { red, white } = particle_velocities(cr[i], cw[i]);
        if (red !== red) throw new Error(`bad red at concentration ${cr[i]} ${cw[i]}`)
        crvr[i] = cr[i] * red;
        cwvw[i] = cw[i] * white;
        if (crvr[i] !== crvr[i]) throw new Error(`crvr err: ${crvr}`)
    }
    crvr[CONC_ARRAY_SIZE-1] = 0;
    cwvw[CONC_ARRAY_SIZE-1] = 0;

    // Advection term
    const adv_r = grad(crvr, dz);
    const adv_w = grad(cwvw, dz);
    for (let i=0;i<CONC_ARRAY_SIZE;i++) {
        if (adv_r !== adv_r) throw new Error(`adv_r error: ${adv_r}`)
    }

    // For diffusion term
    const inner_dif_r = new Array(CONC_ARRAY_SIZE);
    const inner_dif_w = new Array(CONC_ARRAY_SIZE);
    inner_dif_r[0] = 5 * (cr[1] - cr[0]) / dz * (1 - cr[0] / cr_max)**10;
    inner_dif_w[0] = 5 * (cw[1] - cw[0]) / dz * (1 - cw[0] / cw_max)**10;
    for (let i=1;i<CONC_ARRAY_SIZE-1;i++) {
        const dcri = (cr[i+1] - cr[i-1]) / 2 / dz;
        const dcwi = (cw[i+1] - cw[i-1]) / 2 / dz;
        inner_dif_r[i] = 5 * dcri * (1 - cr[i] / cr_max)**10;
        inner_dif_w[i] = 5 * dcwi * (1 - cw[i] / cw_max)**10;
        if (inner_dif_r[i] !== inner_dif_r[i]) throw new Error(`inner_dif_r err: ${inner_dif_r}`)
    }
    inner_dif_r[CONC_ARRAY_SIZE-1] = 5 * (cr[CONC_ARRAY_SIZE-1] - cr[CONC_ARRAY_SIZE-2]) / dz * (1 - cr[CONC_ARRAY_SIZE-1] / cr_max)**10;
    inner_dif_w[CONC_ARRAY_SIZE-1] = 5 * (cw[CONC_ARRAY_SIZE-1] - cw[CONC_ARRAY_SIZE-2]) / dz * (1 - cw[CONC_ARRAY_SIZE-1] / cw_max)**10;

    const dif_r = grad(inner_dif_r, dz);
    const dif_w = grad(inner_dif_w, dz);
    dif_r[0] = dif_r[CONC_ARRAY_SIZE-1] = 0;
    dif_w[0] = dif_w[CONC_ARRAY_SIZE-1] = 0;

    // Results 
    const drdt = new Array(CONC_ARRAY_SIZE);
    const dwdt = new Array(CONC_ARRAY_SIZE);
    drdt[0] = dwdt[0] = 0;
    for (let i=1; i<CONC_ARRAY_SIZE-1;i++) {
        drdt[i] = dif_r[i] - adv_r[i];
        dwdt[i] = dif_w[i] - adv_w[i];
    }
    drdt[CONC_ARRAY_SIZE-1] = -adv_r[CONC_ARRAY_SIZE-1];
    dwdt[CONC_ARRAY_SIZE-1] = -adv_w[CONC_ARRAY_SIZE-1];

    return drdt.concat(dwdt);
}

/**
 * Convolve a 1D numpy array y with a moving average filter of given size.
 * Pads the edges with the first and last values in y to maintain size.
 * @param y array to smooth
 * @param window_size size of kernel
 * @returns smoothed array of same length as y
 */
export function movingAverageConvolve(y: number[], windowSize: number): number[] {
  if (windowSize < 1) throw new Error("windowSize must be at least 1");
  if (windowSize === 1) return y;

  const padWidth = Math.floor(windowSize / 2);
  const n = y.length;

  // Pad edges with the first and last values
  const padded = [
    ...Array(padWidth).fill(y[0]),
    ...y,
    ...Array(padWidth).fill(y[n - 1])
  ];

  // Precompute kernel weight
  const norm = 1 / windowSize;

  const smoothed: number[] = new Array(n);

  // Perform convolution
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < windowSize; j++) {
      sum += padded[i + j];
    }
    smoothed[i] = sum * norm;
  }

  return smoothed;
}

/**
 * Linearly interpolate points in x to find corresponding points in y using xp and fp
 * @param x x coordinates of resulting points
 * @param xp x coordinates to interpolate between
 * @param fp values corresponding to original xp array
 * @returns f values corresponding to each x
 */
export function interp(x: number | number[], xp: number[], fp: number[]) {
    if (!Array.isArray(x)) x = [x];
    const f = x.map(xi => {
        let nx = xp.length;
        // Make sure we stay in the bounds
        if (xi < xp[0]) {
            console.warn(`interp point ${xi} out of range for x array with min ${xp[0]}`);
            return fp[0];
        }

        // Find the lo and hi indices
        let lo=0, hi=1;
        for (let j=0;j<nx;j++) {
            if (xp[j] <= xi) lo = j;
            else break;
        }

        // Interpolate results
        if (lo === nx-1) {
            console.warn(`interp point ${xi} out of range for x array with min ${xp[nx-1]}`);
            return fp[nx-1];
        }
        hi = lo + 1;
        const fi = fp[lo] + (fp[hi] - fp[lo]) * (xi - xp[lo]) / (xp[hi] - xp[lo]);
        return fi;
    });

    return f;
}

/**
 * 
 * @param y 
 * @param z 
 * @param lo 
 * @param hi 
 * @returns 
 */
export function resize(y: number[], z: number[], lo: number) {
    const cr = y.slice(0, CONC_ARRAY_SIZE);
    const cw = y.slice(CONC_ARRAY_SIZE);

    if (cr.length !== z.length || cw.length !== z.length) throw new Error(`y and z must have same length\ncr:${cr.length}\ncw:${cw.length}\nz:${z.length}`);
    const nz = cr.length;
    const z_hi = z[nz - 1];
    if (z_hi !== 305) throw new Error("double check z my guy");

    // Determine where to start the new coordinate axis
    let min_idx: number | undefined = undefined;
    let sum = 0;
    for (let i=0;i<cr.length;i++) {
        const ph = cr[i] + cw[i];
        sum += ph;
        if (sum < lo) min_idx = i;
        else if (sum >= 2*lo) break;
    }
    if (min_idx === undefined) return { y, z };

    // Determine the new range and construct the new z array
    const lz = z_hi - z[min_idx];
    const z_new = Array.from({ length: nz }, (_,i) => i / (nz-1) * lz + z[min_idx]);

    // Interpolate to get the new f(z) points in the array.
    const cr_new = interp(z_new, z, cr);
    const cw_new = interp(z_new, z, cw);
    
    return { y: cr_new.concat(cw_new), z: z_new };
}


const nz = CONC_ARRAY_SIZE;
const smooth_fsize = 13;
const dt = 20;
export class ProfileSolver {
    private current: Profile;
    private top = 0;

    constructor(xr0: number, xw0: number) {
        // Prepare the initial profile
        const cr0: number[] = new Array(nz).fill(conc_r(xr0));
        const cw0: number[] = new Array(nz).fill(conc_w(xw0));
        cr0[0] = cw0[0] = 0; // Free surface
        this.current = cr0.concat(cw0);

        
    }

    // Spatial helpers
    private lz = () => { return TUBE_LENGTH - this.top; }
    private dz = () => { return this.lz() / (nz - 1); }
    private create_z_arr = () => {
        const dz = this.dz();
        return Array.from({ length: nz }, (_,i) => i * dz);
    }

    // Rhs wrapper
    private rhs = (_: number, y: number[]) => {
        return rhs_adv_diff(y, this.dz());
    };

    /**
     * Calculate one 20 second step for the profile
     * @returns Results at time t + dt
     */
    public calculate_step = () => {
        const sol = rk45(this.rhs, this.current, 0, dt);

        // Extract solution
        let y_cur: Profile = sol.y.at(-1)!;
        let cr_cur = y_cur.slice(0,nz);
        let cw_cur = y_cur.slice(nz);

        // Smooth
        cr_cur = movingAverageConvolve(cr_cur, smooth_fsize);
        cw_cur = movingAverageConvolve(cw_cur, smooth_fsize);
        y_cur = cr_cur.concat(cw_cur);

        // Resize
        const resized = resize(y_cur, this.create_z_arr(), .05);
        this.current = resized.y;
        this.top = resized.z[0];

        return this.current.concat([this.top]);
    }
}
