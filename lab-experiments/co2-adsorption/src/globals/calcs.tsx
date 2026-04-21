import { type Accessor, type Setter } from "solid-js";

import rk45, { type ODEFunc } from "./rk45";
import { animate } from "./helpers";

export const LENGTH_BED = 40; // cm
const RHO_ZEOLITE = 0.75; // g/cc
const MASS_ZEOLITE = 4000; // g
const MM_CO2 = 44.009; // g/mol
const MM_N2 = 14.041 // g/mol
const R = 83.14 // bar cc / mol / K
const BED_MAX_CAPACITY = MASS_ZEOLITE / 1000 * 0.85; // mols
const DIFFUSIVITY = 1.8e-1; // m^2/s, diffusivity of CO2 in zeolite
// Spatial info
const N = 51; // number of points in spatial discretization
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
const ka0 = 2.196e4; // min^-1
const ea = 2000; // convert from kJ/mol to K
const kd0 = 8e6;
const ed = 6e3;
function k_val(k0: number, ea: number, T: number) {
  return k0 * Math.exp(-ea / T);
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
function molar_mass(x_co2: number) {
  return x_co2 * MM_CO2 + (1 - x_co2) * MM_N2;
}

/**
 * Calculte the velocity of the gas mixture through the bed based on the mass flow rate, mole fraction of CO2, and pressure.
 * @param {Number} mdot Mass flow rate in g/s
 * @param {Number} x_co2 mole fraction of CO2 in the gas mixture
 * @param {Number} P overall pressure in bar
 * @returns velocity in cm/s
 */
function calc_velocity(mdot: number, x_co2: number, T: number, P: number) {
    // pv = nrt; Vdot = ndot * RT / P
    const ndot = mdot / molar_mass(x_co2) // mol/s
    const q = ndot * R * T / P // cc/s
    return q / BED_CROSS_SECTION // cm/s
}

// RHS for advection-diffusion eqn with reaction term
function rhs(_: number, y: number[], dx: number, ka: number, kd: number) {
  const dydt = Array.from({ length: NT }).fill(0) as number[];
  const inv_dx = 1 / dx;
  const inv_dx2 = inv_dx / dx;

  for (let i = E; i < NT - E; i += E) {
    const ip = i;
    const iP = i + 1;
    const it = i + 2;
    const iu = i + 3;

    // Advection
    const dp = y[ip] - y[ip - E];
    const dP = y[iP] - y[iP - E];
    const du = y[iu] - y[iu - E];
    const adv_p = - y[iu] * dp * inv_dx;
    const adv_P = - y[iu] * dP * inv_dx;
    const adv_u = - y[iu] * du * inv_dx

    // Diffusion
    const d2p = y[ip + E] + y[ip - E] - 2 * y[ip];
    const d2P = y[iP + E] + y[iP - E] - 2 * y[iP];
    const d2u = y[iu + E] + y[iu - E] - 2 * y[iu];
    const dif_p = DIFFUSIVITY * d2p * inv_dx2;
    const dif_P = DIFFUSIVITY * d2P * inv_dx2;
    const dif_u = (DIFFUSIVITY * 1e1) * d2u * inv_dx2;

    // Reaction
    const th = y[it];
    const th_star = 1 - th;

    const ads = ka * y[ip] * th_star;
    const des = kd * th;

    const rxn_p = des - ads; // Pressure changes
    const rxn_t = (ads - des) / BED_MAX_CAPACITY; // Theta changes

    // Sum
    dydt[ip] = dif_p + adv_p + rxn_p;
    dydt[iP] = dif_P + adv_P;
    dydt[iu] = dif_u + adv_u;
    dydt[it] = rxn_t;
  }

  return dydt;
}

export type BedDescriptor = {
    // Inputs
    tempK: Accessor<number>;
    presBar: Accessor<number>;
    yIn: Accessor<number>;
    flowing: Accessor<boolean>;
    mdot: Accessor<number>;
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
    private mdot: Accessor<number>;

    // Outputs
    private onOut: Setter<{ y: number, u: number }>;
    private onUpdate: () => void;

    constructor(desc: BedDescriptor) {
        this.tempK = desc.tempK;
        this.presBar = desc.presBar;
        this.yIn = desc.yIn;
        this.flowing = desc.flowing;
        this.mdot = desc.mdot;
        this.onOut = desc.onOut;
        this.onUpdate = desc.onUpdate;
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
        const mdot = (P > 0) ? this.mdot() : 0;

        const out = this.yCO2_out(dt, mdot, T, P, y, flowing);
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
     * @param {number} args.m - The mass flow rate of the gas mixture in g / s.
     * @param {number} args.P - The total pressure of the gas mixture in bar.
     * @param {number} args.T - The temperature of the gas mixture in K.
     * @param {number} args.yCO2 - The mole fraction of CO2 in the gas mixture.
     * @param {boolean} [args.desorbing=false] - Whether the CO2 is desorbing.
     * @param {number} [args.timeOfDesorption=0] - The time of desorption in seconds.
     * @param {number} [args.kd=4.365e-4] - The desorption rate constant in s^-1.
     * @returns {number} - The outlet mole fraction of CO2 in the gas mixture.
     */
    public yCO2_out(dt: number, mdot: number, T: number, P: number, y: number, flowing: boolean) {
        let ul = calc_velocity(mdot, y, T, P);
        ul = isNaN(ul) ? 0 : ul;
        if (flowing) {
            const left = [ y * P, (1 - y) * P, 0, ul ];
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
        const pn = this.bed[NE - E + 1];
        const u = this.bed[NE - 1];
        const outlet = pc / (pc + pn);
        return { y: (outlet < 0 || isNaN(outlet)) ? 0 : outlet, u };
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