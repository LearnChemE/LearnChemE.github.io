
// Constants
const Cp = 4000;       // J/(kg·K)
const UA = 3400;       // W/K
const V = 10;          // m³
const ΔH = -220000;    // J/mol (exothermic reaction)
const R = 8.314;       // J/(mol·K)
const Ea = 15000;      // Activation energy (J/mol)
const k0 = 0.004;      // Pre-exponential factor (1/s)

// Rate constant calculation
function k(T) {
    return k0 * Math.exp(-Ea * (1/T - 1/298));
}

// ODE system for the CSTR
function derivatives(Ca, T, tau) {
    const rate = (Ca > 0.01) ? k(T) * Ca : 0;
    const dCadt = (2 - Ca) / tau - rate;
    const dTdt = (UA/(V * Cp)) * (300 - T) + (298 - T)/tau - (ΔH/Cp) * rate;
    return [ dCadt, dTdt ];
}
/**
 * Single adaptive Runge–Kutta–Fehlberg (RK45) step.
 *
 * @param {function(number, number|Array): number|Array} f - derivative f(t, y)
 * @param {number|Array} y   - current state
 * @param {number} t         - current time
 * @param {number} h         - current timestep
 * @returns {{
 *   yNext: number|Array,  // 5th order solution
 *   tNext: number,        // new time (t + h)
 *   error: number|Array   // estimate of local truncation error
 * }}
 */
function rk45Step(f, y, t, h) {
  const isArray = Array.isArray(y);

  const add = (a, b) => isArray ? a.map((v, i) => v + b[i]) : a + b;
  const addScaled = (a, b, s) => isArray ? a.map((v, i) => v + s * b[i]) : a + s * b;
  const scale = (a, s) => isArray ? a.map(v => v * s) : a * s;

  // Coefficients for Dormand–Prince RK45 (Butcher tableau)
  const k1 = f(t, y);
  const k2 = f(t + h * 1/4, addScaled(y, k1, h * 1/4));
  const k3 = f(t + h * 3/8, addScaled(y, k1, h * 3/32, k2, h * 9/32));
  const k4 = f(t + h * 12/13, addScaled(y, k1, h * 1932/2197, k2, h * -7200/2197, k3, h * 7296/2197));
  const k5 = f(t + h, addScaled(y, k1, h * 439/216, k2, h * -8, k3, h * 3680/513, k4, h * -845/4104));
  const k6 = f(t + h * 1/2, addScaled(y, k1, h * -8/27, k2, h * 2, k3, h * -3544/2565, k4, h * 1859/4104, k5, h * -11/40));

  // 5th-order estimate
  const y5 = addScaled(y, k1, h * 16/135,
                          k3, h * 6656/12825,
                          k4, h * 28561/56430,
                          k5, h * -9/50,
                          k6, h * 2/55);

  // 4th-order estimate
  const y4 = addScaled(y, k1, h * 25/216,
                          k3, h * 1408/2565,
                          k4, h * 2197/4104,
                          k5, h * -1/5);

  // Error estimate (difference between 4th and 5th order)
  const error = isArray ? y5.map((v, i) => v - y4[i]) : y5 - y4;

  return { yNext: y5, tNext: t + h, error };
}

/**
 * Utility: addScaled with multiple terms
 */
function addScaled(base, ...pairs) {
  const isArray = Array.isArray(base);
  if (isArray) {
    const result = base.slice();
    for (let i = 0; i < pairs.length; i += 2) {
      const vec = pairs[i];
      const s = pairs[i + 1];
      for (let j = 0; j < result.length; j++) {
        result[j] += vec[j] * s;
      }
    }
    return result;
  } else {
    let result = base;
    for (let i = 0; i < pairs.length; i += 2) {
      result += pairs[i] * pairs[i + 1];
    }
    return result;
  }
}

/**
 * Adaptive RK45 integrator
 *
 * @param {function(number, number|Array): number|Array} f - derivative function f(t, y)
 * @param {number|Array} y0   - initial state
 * @param {number} t0         - start time
 * @param {number} tEnd       - end time
 * @param {object} opts       - options { h: initial step, tol: tolerance, hMin, hMax }
 * @returns {{ ts: Array<number>, ys: Array<number|Array>}} solution points
 */
function integrateRK45(f, y0, t0, tEnd, opts = {}) {
  let { h = 0.1, tol = 1e-6, hMin = 1e-6, hMax = 1.0 } = opts;

  let t = t0;
  let y = Array.isArray(y0) ? y0.slice() : y0;
  const solution = { ts: [t], ys: [y] };

  while (t < tEnd) {
    if (t + h > tEnd) h = tEnd - t; // don’t overshoot

    const { yNext, error } = rk45Step(f, y, t, h);

    // compute error norm
    const errNorm = Array.isArray(error)
      ? Math.sqrt(error.reduce((s, e) => s + e * e, 0) / error.length)
      : Math.abs(error);

    // check if within tolerance
    if (errNorm <= tol) {
      // accept step
      t += h;
      y = yNext;
      solution.ts.push(t);
      solution.ys.push(y);

      // adaptive step size update (safety factor 0.9)
      const safety = 0.9;
      const factor = safety * Math.pow(tol / (errNorm || 1e-16), 0.25);
      h = Math.min(hMax, Math.max(hMin, h * factor));
    } else {
      // reject step → shrink h and retry
      const safety = 0.9;
      const factor = safety * Math.pow(tol / (errNorm || 1e-16), 0.25);
      h = Math.max(hMin, h * Math.max(0.1, factor));
      if (h <= hMin) {
        // throw new Error("Step size underflow: cannot maintain tolerance.");
        console.warn(`Step size underflow: cannot maintain tolerance.\nCa:${y[0]}\nT:${y[1]}\nt:${t}`);
        // accept step anyways
        t += h;
        y = yNext;
        solution.ts.push(t);
        solution.ys.push(y);
      }
    }
  }

  return solution;
}


// Solve ODE using Euler's method
function solveODE(Ca0, T0, tau, tMax = 2000, step = 0.1) {
    let T = T0; // Number

    const rhs = (t, y) => { return derivatives( y[0], y[1], tau); };
    
    const sol = integrateRK45(rhs, [Ca0, T0], 0, tMax, {h: step, tol: 1e-2, hMin: step * 1e-8, hMax: step * 10});
    
    const times = sol.ts;
    const Cas = [];
    const Ts  = [];
    sol.ys.forEach(([Ca, T]) => { Cas.push(Ca); Ts.push(T); });
    return { times, Cas, Ts };
}

self.onmessage = (event) => {
    const { Ca0, T0, tau, mode } = event.data;
    if (mode === 'phase1') { // Solve for five different things
        const trajectories = [];
        [ 0.0, 0.5, 1.0, 1.5, 2.0 ].forEach(ca => {
            trajectories.push(solveODE(ca, T0, tau));
        });
        self.postMessage(trajectories);
    }
    else {
        const result = solveODE(Ca0, T0, tau);
        self.postMessage([result]);
    }
}