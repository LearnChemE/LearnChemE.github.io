import { type Accessor, type Setter } from "solid-js";

import rk45, { type ODEFunc } from "./rk45";
import { animate } from "./helpers";

export const LENGTH_BED = 20; // cm
const RHO_ZEOLITE = 0.75; // g/cc
const MASS_ZEOLITE = 100; // g
const MM_CO2 = 44.009; // g/mol
const MM_N2 = 14.041; // g/mol
// const R = 83.14; // bar cc / mol / K
const BED_MAX_CAPACITY = MASS_ZEOLITE / 1000 * 2.5; // mols
const DIFFUSIVITY = 1.8e-3 * 60; // m^2/s, diffusivity of CO2 in zeolite

// Spatial info
const N = 101; // number of points in spatial discretization
const E = 4; // number of equations per point (tot pressure, co2 pressure, theta, velocity); stride
const NE = N * E; // number of equations in the system
const NT = NE + 2 * E; // Size of arrays including padding
const x = Array.from({ length: N }).map((_,i) => i * LENGTH_BED / (N - 1)); // spatial points
const dx = x[1] - x[0];

// Geometry
const BED_VOLUME = MASS_ZEOLITE / RHO_ZEOLITE; // cc
const BED_CROSS_SECTION = BED_VOLUME / LENGTH_BED; // cm^2
const BED_RADIUS = Math.sqrt(BED_CROSS_SECTION / Math.PI); // cm
console.log("Radius: ", BED_RADIUS)

// Kinetic parameters
const ka0 = 4.196e0; // min^-1
const ea = 1000; // convert from kJ/mol to K
const kd0 = 8e3;
const ed = 6e3;
function k_val(k0: number, ea: number, T: number) {
  return k0 * Math.exp(-ea / T);
}

export type TVDMethod = "Upwind" | "SuperBee" | "MinMod" | "VanLeer";
const TVD_METHOD: TVDMethod = "MinMod";

function fluxLimiter(r: number, method: TVDMethod) {
    if (method == "SuperBee") {
        return Math.max(0, Math.min(2 * r, 1), Math.min(r, 2))
    }
    else if (method == "MinMod") {
        return Math.max(0, Math.min(1, r))
    }
    else if (method == "VanLeer") {
        return (r + Math.abs(r)) / (1 + Math.abs(r))
    }
    else { // upwind only
        return 0
    }
}

// type BedPoint = [
//   pco2: Number,
//   pn2: Number,
//   th_co2: Number,
//   u: Number
// ]

/**
 * Utility functions for calculations
 */

// Pad the edges of an array with the first and last values to make it easier to calculate derivatives
function pad(y:number[], left: number[], right?: number[]) {
  if (!right) right = Array.from({ length: E }).map((_,i) => {
    const yi = y[NE - E + i];
    return yi;
  });
  // if (right[2] > 0) throw new Error(`Padding right with: ${right}, ${y}`)
  return [ ...left, ...y, ...right ];
}

// Molar mass of the gas mixture based on the mole fraction of CO2
export function molar_mass(x_co2: number) {
  return x_co2 * MM_CO2 + (1 - x_co2) * MM_N2;
}

/**
 * Calculte the velocity of the gas mixture through the bed based on the mass flow rate, mole fraction of CO2, and pressure.
 * @param {Number} mdot Mass flow rate in g/s
 * @param {Number} x_co2 mole fraction of CO2 in the gas mixture
 * @param {Number} P overall pressure in bar
 * @returns velocity in cm/min
 */
function calc_velocity(sccm: number, T: number, P: number) {
    // pv = nrt; Vdot = ndot * RT / P
    const ccm = sccm * (1 / (P + 1)) * (T / 273.15); // cc/min
    return ccm / BED_CROSS_SECTION; // cm/min
}

// RHS for advection-diffusion eqn with reaction term
function rhs(_: number, y: number[], dx: number, ka: number, kd: number) {
    const dydt = Array.from({ length: NT }).fill(0) as number[];
    const inv_dx = 1 / dx;
    // const inv_dx2 = inv_dx / dx;

    // Left boundary diffusion term
    let dl;
    if (y[1] != 0 && y[E + 1] != 0) {
        // Calculate central mean mole fraction
        const p_cm = (y[0] + y[E]) / 2;
        const P_cm = (y[1] + y[E + 1]) / 2;
        const y_cm = p_cm / P_cm;
        // Use chain rule to separate gradient for stability
        const dyP = (y[E] - y[0]) / dx;
        const ydP = y_cm * (y[E + 1] - y[1]) / dx;
        const Pdy = dyP - ydP;
        // Use to calculate diffusion at the left boundary
        dl = -DIFFUSIVITY * Pdy * inv_dx;
    } else {
        dl = 0;
    }

    let prevFace = [
        y[0] * y[3] * inv_dx, // p * u
        y[1] * y[3] * inv_dx, // P * u
        dl // dif_p
    ]; // [ adv_p, adv_P, dif_p ]

    for (let i = E; i < NT - E; i += E) {
        const ip = i;
        const iP = i + 1;
        const it = i + 2;
        // const iu = i + 3;

        // Pre allocate variables for clarity
        // Values at relevant centroids
        const p_n = y[ip + E];
        const p_p = y[ip];
        const p_pp= y[ip - E];
        const P_n = y[iP + E];
        const P_p = y[iP];
        const P_pp= y[iP - E];
        // const u_n = y[iu + E];
        // const u_p = y[iu];
        // const u_pp= y[iu - E];

        // TVD
        // Assume forward flow for upwinding
        const rp = (p_p - p_pp) ? (p_n - p_p) / (p_p - p_pp) : 0;
        const rP = (P_p - P_pp) ? (P_n - P_p) / (P_p - P_pp) : 0;
        // const ru = (u_p - u_pp) ? (u_n - u_p) / (u_p - u_pp) : 0;
        // Use for flux limiting
        const rhph = p_p + 1/2 * fluxLimiter(rp, TVD_METHOD) * (p_p - p_pp); // * inv_RT
        const rh   = P_p + 1/2 * fluxLimiter(rP, TVD_METHOD) * (P_p - P_pp); // * inv_RT
        const u    = y[3]; //u_p + 1/2 * fluxLimiter(ru, TVD_METHOD) * (u_p - u_pp);

        // calc next face
        // adv = sum [ S * rh * u * ph ] for each face
        const adv_p = rhph * u * inv_dx
        const adv_P = rh * u * inv_dx
        // const adv_u = u * inv_dx;

        // Diffusion for pco2
        // dif_face = S * rh * DIFFUSIVITY * P * del y since the mole fraction will be diffused, but not total pressure
        // Use chain rule to separate gradient for stability: del (y P) = y del P + P del y
        let dif_p;
        if (P_n != 0 && P_p != 0) {
            const p_cm = (p_n + p_p) / 2;
            const P_cm = (P_n + P_p) / 2;
            const y_cm = p_cm / P_cm;
            // Use chain rule to separate gradient
            const dyP = (p_n - p_p) / dx;
            const ydP = y_cm * (P_n - P_p) / dx;
            const Pdy = dyP - ydP;
            dif_p = -DIFFUSIVITY * Pdy * inv_dx;
        }
        else {
            dif_p = 0;
        }

        // Reaction
        const th = y[it];
        const th_star = 1 - th;

        const ads = ka * y[ip] * th_star;
        const des = kd * th;

        const rxn_p = des - ads; // Pressure changes
        const rxn_t = (ads - des) / BED_MAX_CAPACITY; // Theta changes

        // Sum
        dydt[ip] = (prevFace[0] - adv_p) + (prevFace[2] - dif_p) + rxn_p;
        dydt[iP] = (prevFace[1] - adv_P) + rxn_p;
        dydt[it] = rxn_t;
        // dydt[iu] = (prevFace[0] - adv_u);

        prevFace = [ adv_p, adv_P, dif_p ];
    }

    return dydt;
}

export type BedDescriptor = {
    // Inputs
    tempK: Accessor<number>;
    presBar: Accessor<number>;
    yIn: Accessor<number>;
    flowing: Accessor<boolean>;
    sccm: Accessor<number>;
    // Outputs
    onOut: Setter<{ y: number, u: number }>;
    onUpdate: () => void;
};

export class BedCalc {
    private bed = Array.from({ length: NE }).fill(0) as number[]; // initialize bed with zeros
    private playing = false;

    // Inputs
    private tempK: Accessor<number>;
    private presBar: Accessor<number>;
    private yIn: Accessor<number>;
    private flowing: Accessor<boolean>;
    private sccm: Accessor<number>;
    // Outputs
    private onOut: Setter<{ y: number, u: number }>;
    private onUpdate: () => void;

    constructor(desc: BedDescriptor) {
        this.tempK = desc.tempK;
        this.presBar = desc.presBar;
        this.yIn = desc.yIn;
        this.flowing = desc.flowing;
        this.sccm = desc.sccm;
        console.table(desc)
        this.onOut = desc.onOut;
        this.onUpdate = desc.onUpdate;
    }

    public fill() {
        const P = this.presBar();
        const y = this.yIn();
        const T = this.tempK();
        const u = calc_velocity(this.sccm(), T, P);

        // Solve the steady state balance to determine theta
        const ka = k_val(ka0, ea, T);
        const kd = k_val(kd0, ed, T);
        const th = ka * y * P / (ka * y * P + kd);

        for (let i=0; i<NE; i += E) {
            this.bed[i] = P * y;
            this.bed[i + 1] = P;
            this.bed[i + 2] = th;
            this.bed[i + 3] = u;
        }
    }

    public play() {
        if (this.playing) return;
        this.playing = true;
        animate(dt => this.iterate(dt));
    }

    public reset() {
        this.playing = false;
        this.bed = this.bed.fill(0);
        this.onOut({ y: 0, u: 0 });
    }

    private iterate(dt: number) {
        const T = this.tempK();
        const P = this.presBar(); // absolute pressure
        const y = this.yIn();
        const flowing = this.flowing();
        const sccm = (P > 0) ? this.sccm() : 0;

        const out = this.yCO2_out(dt, sccm, T, P, y, flowing);
        this.onOut(out);
        this.onUpdate();
        
        // For animation purposes
        return this.playing;
    }

    /**
     * Calculate the outlet mole fraction of CO2 in a gas mixture
     * after passing through a zeolite membrane.
     *
     * @param {Object} args - The arguments object.
     * @param {number} args.t - The time in seconds.
     * @param {number} args.tStep - The time step in seconds.
     * @param {number} args.sccm - The volumetric flow rate of the gas mixture in sccm.
     * @param {number} args.P - The total pressure of the gas mixture in bar.
     * @param {number} args.T - The temperature of the gas mixture in K.
     * @param {number} args.yCO2 - The mole fraction of CO2 in the gas mixture.
     * @param {boolean} [args.desorbing=false] - Whether the CO2 is desorbing.
     * @param {number} [args.timeOfDesorption=0] - The time of desorption in seconds.
     * @param {number} [args.kd=4.365e-4] - The desorption rate constant in s^-1.
     * @returns {number} - The outlet mole fraction of CO2 in the gas mixture.
     */
    public yCO2_out(dt: number, sccm: number, T: number, P: number, y: number, flowing: boolean) {
        let ul = calc_velocity(sccm, T, P);
        // console.log("Velocity: ", ul.toFixed(5), "cm/min")
        ul = isNaN(ul) ? 0 : ul;
        if (flowing) {
            const left = [ y * P, P, 0, ul ];
            const y0 = pad(this.bed, left);
            this.evolve(dt, T, y0);
        }
        else {
            const rightYP = this.bed[NE - E]
            const rightP = this.bed[NE - E + 1]; // Pressure at the right boundary;
            const u = this.bed[NE - 1] * 0.8;
            const y0 = pad(this.bed, [rightYP, rightP, 0, u], [rightYP, rightP, 0, u]);
            this.evolve(dt, T, y0);
        }

        // return this.bed[NE - E + 3]
        const pc = this.bed[NE - E];
        const pt = this.bed[NE - E + 1];
        const u = this.bed[NE - 1];
        const outlet = pt !== 0 ? pc / pt : 0;
        return { y: Math.max(0, outlet), u };
    }

    private evolve(tstep: number, T: number, y0: number[]) {
        const ka = k_val(ka0, ea, T);
        const kd = k_val(kd0, ed, T);

        const f: ODEFunc = (t: number, y: number[]) => {
            return rhs(t, y, dx, ka, kd);
        };

        const sol = rk45(f, y0, 0, tstep);
        const soly = sol.y.at(-1)!;
        
        this.updateBed(soly);
        // updatePlot();
    }

    private updateBed(y: number[]) {
        for (let i=0; i<NE; i++) {
            this.bed[i] = y[i + E];
        }
    }

    public view(which: "p" | "total pressure" | "theta" | "u" = "p") {
        switch (which) {
            case "p":
                return this.bed.filter((_, i) => i % E === 0);
            case "total pressure":
                return this.bed.filter((_, i) => i % E === 1);
            case "theta":
                return this.bed.filter((_, i) => i % E === 2);
            case "u":
                return this.bed.filter((_, i) => i % E === 3);
        }
    }
}