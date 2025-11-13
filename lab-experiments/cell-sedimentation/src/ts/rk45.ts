// Adaptive RK45 ODE solver for systems of equations
// --------------------------------------------------

export type ODEFunc = (t: number, y: number[]) => number[];

export interface RK45Result {
  t: number[];
  y: number[][];
}

export interface RK45Options {
  dt?: number;         // initial step size
  atol?: number;       // absolute tolerance
  rtol?: number;       // relative tolerance
  dtMin?: number;      // minimum step size
  dtMax?: number;      // maximum step size
  safety?: number;     // safety factor for adaptive step
}

/**
 * Integrate dy/dt = f(t, y) from t0 to tEnd using adaptive RK45 (Fehlberg). I anticipate this to be horribly inefficient, but benchmark first optimize later.
 * @param f rhs for dyi/dt = f(t, y)
 * @param y0 inital values for y
 * @param t0 initial time
 * @param tEnd final time to end integration
 * @param opts additional options for solver
 * @returns object containing solution { t, y } where y is an array containing each yi array to be matched with t array
 */
export function rk45(
  f: ODEFunc,
  y0: number[],
  t0: number,
  tEnd: number,
  opts: RK45Options = {}
): RK45Result {
  const {
    dt = (tEnd - t0) / 1000,
    atol = 1e-6,
    rtol = 1e-3,
    dtMin = 1e-8,
    dtMax = Math.abs(tEnd - t0) / 5,
    safety = 0.9,
  } = opts;

  // Ai in wikipedia page
  const c2 = 1 / 4,
    c3 = 3 / 8,
    c4 = 12 / 13,
    c5 = 1,
    c6 = 1 / 2;

  //   Bij in wikipedia page
  const a21 = 1 / 4;
  const a31 = 3 / 32, a32 = 9 / 32;
  const a41 = 1932 / 2197, a42 = -7200 / 2197, a43 = 7296 / 2197;
  const a51 = 439 / 216, a52 = -8, a53 = 3680 / 513, a54 = -845 / 4104;
  const a61 = -8 / 27, a62 = 2, a63 = -3544 / 2565, a64 = 1859 / 4104, a65 = -11 / 40;

  // Ci and Ci hat in wikipedia page
  const b1 = 16 / 135, b3 = 6656 / 12825, b4 = 28561 / 56430, b5 = -9 / 50, b6 = 2 / 55; // 5th order weights
  const b1s = 25 / 216, b3s = 1408 / 2565, b4s = 2197 / 4104, b5s = -1 / 5; // 6th order weights

  let t = t0;
  let y = y0.slice();
  let h = dt;

  const tVals = [t];
  const yVals = [y.slice()];

  while (t < tEnd) {
    console.log(`[RK45] h = ${h}`)
    if (h !== h) throw new Error("NaN encountered in h")
    if (t + h > tEnd) h = tEnd - t;

    // Compute Runge-Kutta stages
    const k1 = f(t, y.slice());
    const k2 = f(t + c2 * h, y.map((yi, i) => yi + h * a21 * k1[i]));
    const k3 = f(t + c3 * h, y.map((yi, i) => yi + h * (a31 * k1[i] + a32 * k2[i])));
    const k4 = f(t + c4 * h, y.map((yi, i) => yi + h * (a41 * k1[i] + a42 * k2[i] + a43 * k3[i])));
    const k5 = f(t + c5 * h, y.map((yi, i) => yi + h * (a51 * k1[i] + a52 * k2[i] + a53 * k3[i] + a54 * k4[i])));
    const k6 = f(t + c6 * h, y.map((yi, i) => yi + h * (a61 * k1[i] + a62 * k2[i] + a63 * k3[i] + a64 * k4[i] + a65 * k5[i])));

    // 4th and 5th order estimates
    const y4 = y.map((yi, i) => yi + h * (b1s * k1[i] + b3s * k3[i] + b4s * k4[i] + b5s * k5[i]));
    const y5 = y.map((yi, i) => yi + h * (b1 * k1[i] + b3 * k3[i] + b4 * k4[i] + b5 * k5[i] + b6 * k6[i]));

    // Error estimate and tolerance check
    const err = Math.sqrt(
      y.map((_, i) => Math.pow((y5[i] - y4[i]) / (atol + rtol * Math.abs(y[i])), 2)).reduce((a, b) => a + b, 0) / y.length
    );

    // Accept step if error small enough
    if (err <= 1.0) {
      t += h;
      y = y5;
      tVals.push(t);
      yVals.push(y.slice());
      console.log(`[RK45] h accepted. New time is ${t}`)
    }

    // Adapt timestep
    const scale = safety * Math.pow(1.0 / Math.max(err, 1e-10), 0.25);
    h = Math.min(dtMax, Math.max(dtMin, h * Math.min(4, Math.max(0.1, scale))));
    if (h !== h) throw new Error("I have some strongly worded concerns about this h")

    if (h < dtMin && err > 1.0) {
      console.warn("Step size underflow — integration failed");
      break;
    }
  }

  return { t: tVals, y: yVals };
}
