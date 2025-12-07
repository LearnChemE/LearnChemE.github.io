import { rk45 } from "./rk45";
// CSTR calculation module
const V = 1; // volume of tank (L)

// Rate constant is dependent on temperature
const k = (T) => {
  const Ea = 131550; // J/mol
  const R = 8.314; // J/(mol*K)
  const A = 5.38e21; // Pre-exponential factor (L / mol / s)
  return A * Math.exp(-Ea / (R * T));
}

export class CSTR {
  CA = 0; // Concentration of A (mol/L)
  CB = 0; // Concentration of B (mol/L)
  CC = 0; // Concentration of C (mol/L)
  CD = 0; // Concentration of D (mol/L)

  step(Caf, Cbf, vA, vB, T, dt) {
    const y0 = [this.CA, this.CB, this.CC, this.CD];
    const rhs = this._rhs_wrapper(Caf, Cbf, vA, vB, T);
    const result = rk45(rhs, y0, 0, dt);
    const yEnd = result.y[result.y.length - 1];
    this.CA = yEnd[0];
    this.CB = yEnd[1];
    this.CC = yEnd[2];
    this.CD = yEnd[3];
    return { CC: this.CC, CD: this.CD };
  }

  // Factory to create the right-hand side function for RK45
  _rhs_wrapper = (Caf, Cbf, vA, vB, T) => {
    return (t, y) => {
      this.CA = y[0];
      this.CB = y[1];
      this.CC = y[2];
      this.CD = y[3];
      const derivatives = this._rhs(Caf, Cbf, vA, vB, T);
      return [derivatives.dCA_dt, derivatives.dCB_dt, derivatives.dCC_dt, derivatives.dCD_dt];
    }
  }

  _rhs(Caf, Cbf, vA, vB, T) {
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

    // Return derivatives
    return {
      dCA_dt,
      dCB_dt,
      dCC_dt,
      dCD_dt
    };
  }

  reset = () => {
    this.CA = 0;
    this.CB = 0;
    this.CC = 0;
    this.CD = 0;
  }
}
