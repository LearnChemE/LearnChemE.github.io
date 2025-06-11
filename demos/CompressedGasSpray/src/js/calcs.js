// calcs.js

export function calcAll() {
    const volumeFraction = 0.75;
    const sprayTime = 204;
    const { n0, T0, P0 } = runSimulation(volumeFraction, sprayTime);
}

/**
 * Run the compressed‐gas spray simulation.
 *
 * @param {number} initialVLfrac   initial liquid volume fraction (0…1)
 * @param {number} sprayTime       maximum spray time (s)
 * @param {boolean} stopAtMinus5   if true, stop when T ≤ –5 °C
 * @returns {object}               { time, vL, vV, nL, nV, T, P, P0, T0 }
 */
export function runSimulation(initialVLfrac, sprayTime, stopAtMinus5 = false) {
    const dt = 1;                            // 1 s time step
    const steps = Math.floor(sprayTime / dt);

    // ── CONSTANTS ─────────────────────────────────────────────────────────────
    const Vcan = 0.375;        // L
    const R = 0.08314;      // L·bar/(mol·K)
    const rhoL = 13.57;        // mol/L
    const Hvap = 21.8;         // kJ/mol
    const Cp = 0.0707;       // kJ/(mol·K)
    const Patm = 1.0;          // bar (outside)
    const alpha = 6e-4;         // mol/(bar·s)
    const T0_C = 25;           // °C
    const T0 = T0_C + 273.15;// K

    // initial saturation pressure
    const P0 = Psat(T0);

    // initial liquid/vapor moles
    const VL0 = Vcan * initialVLfrac;
    const nL0 = rhoL * VL0;
    const nV0 = P0 * (Vcan - VL0) / (R * T0);
    let n = nL0 + nV0;   // total moles
    let T = T0;          // current temp (K)

    // ── ARRAYS FOR TIME SERIES ────────────────────────────────────────────────
    const time = [];
    const vL = [], vV = [];
    const nL = [], nV = [];
    const Tarr = [], Parr = [];

    // ── TIME‐MARCHING LOOP ────────────────────────────────────────────────────
    for (let i = 0; i <= steps; i++) {
        const t = i * dt;
        time.push(t);

        // 1) compute current Psat from Antoine eqn
        const P_sat = Psat(T);

        // 2) ODEs
        //    dn/dt = -α (P_sat - Patm)
        const dn_dt = -alpha * (P_sat - Patm);
        //    dT/dt = -(dHvap * dn/dt) / (n * Cp)
        const dT_dt = (Hvap * dn_dt) / (n * Cp);

        // 3) integrate
        n += dn_dt * dt;
        T += dT_dt * dt;

        // 4) recompute pressure
        const P = Psat(T);
        Parr.push(P);
        Tarr.push(T);

        // 5) algebraic volumes & moles
        const VL_cur = (n - Vcan * P / (R * T)) / (rhoL - P / (R * T));
        const VV_cur = Vcan - VL_cur;
        const nL_cur = rhoL * VL_cur;
        const nV_cur = P * VV_cur / (R * T);

        vL.push(VL_cur);
        vV.push(VV_cur);
        nL.push(nL_cur);
        nV.push(nV_cur);

        // 6) stopping criterion
        if (stopAtMinus5 && T <= -5 + 273.15) break;
    }

    return {
        time,
        vL, vV,
        nL, nV,
        T: Tarr,
        P: Parr,
        P0,   // initial saturation pressure (bar)
        T0    // initial temperature (K)
    };
}

function Psat(T) {
    const T_C = T - 273.15;
    const A = 4.23406, B = 896.171, C = 238.3;
    return Math.pow(10, A - B / (T_C + C));
}
