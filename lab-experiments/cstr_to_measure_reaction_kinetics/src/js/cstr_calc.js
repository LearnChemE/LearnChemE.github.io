// CSTR calculation module
const V = 2; // volume of tank (L)

// Rate constant is dependent on temperature
const k = (T) => {
  const Ea = 33.40e3; // J/mol
  const R = 8.314; // J/(mol*K)
  const A = 5.8e5; // Pre-exponential factor (arbitrary units)
  return A * Math.exp(-Ea / (R * T));
}

export class CSTR {
  CA = 0; // Concentration of A (mol/L)
  CB = 0; // Concentration of B (mol/L)
  CC = 0; // Concentration of C (mol/L)
  CD = 0; // Concentration of D (mol/L)

  step = (Caf, Cbf, vA, vB, T, dt) => {
    // Calculated values

    const nA_in = vA * Caf; // mol/s
    const nB_in = vB * Cbf; // mol/s
    const vdot = vA + vB; // total volumetric flow rate (L/s)
    const k_val = k(T);

    // Overall reaction rate
    const r = k_val * this.CA * this.CB;

    // Differential equations
    const dCA_dt = (nA_in - this.CA * vdot - r * V) / V;
    const dCB_dt = (nB_in - this.CB * vdot - r * V) / V;
    const dCC_dt = (r * V - this.CC * vdot) / V;
    const dCD_dt = (r * V - this.CD * vdot) / V;

    // Update concentrations
    this.CA += dCA_dt * dt;
    this.CB += dCB_dt * dt;
    this.CC += dCC_dt * dt;
    this.CD += dCD_dt * dt;

    return {
      CA: this.CA,
      CB: this.CB,
      CC: this.CC,
      CD: this.CD
    };
  }

  reset = () => {
    this.CA = 0;
    this.CB = 0;
    this.CC = 0;
    this.CD = 0;
  }
}
