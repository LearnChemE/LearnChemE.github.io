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
  verbose?: boolean;  // enable verbose logging
  onUnderflow? : () => void; // callback on step size underflow
}

/**
 * Integrate dy/dt = f(t, y) from t0 to tEnd using adaptive RK45 (Dormand-Prince).
 * @param f rhs for dyi/dt = f(t, y)
 * @param y0 initial values for y
 * @param t0 initial time
 * @param tEnd final time to end integration
 * @param opts additional options for solver
 * @returns object containing solution { t, y } where y is an array containing each yi array to be matched with t array
 */
export function rk45_dormand_prince(
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
    verbose = false,
  } = opts;

  // Dormand-Prince coefficients
  // c_i values (nodes)
  const c2 = 1/5, c3 = 3/10, c4 = 4/5, c5 = 8/9, c6 = 1, c7 = 1;

  // a_ij values (Runge-Kutta matrix)
  const a21 = 1/5;
  const a31 = 3/40, a32 = 9/40;
  const a41 = 44/45, a42 = -56/15, a43 = 32/9;
  const a51 = 19372/6561, a52 = -25360/2187, a53 = 64448/6561, a54 = -212/729;
  const a61 = 9017/3168, a62 = -355/33, a63 = 46732/5247, a64 = 49/176, a65 = -5103/18656;
  const a71 = 35/384, a72 = 0, a73 = 500/1113, a74 = 125/192, a75 = -2187/6784, a76 = 11/84;

  // b_i values (5th order solution weights)
  const b1 = 35/384, b3 = 500/1113, b4 = 125/192, b5 = -2187/6784, b6 = 11/84, b7 = 0;
  
  // b*_i values (4th order solution weights for error estimation)
  const bs1 = 5179/57600, bs3 = 7571/16695, bs4 = 393/640, bs5 = -92097/339200, bs6 = 187/2100, bs7 = 1/40;

  let t = t0;
  let y = y0.slice();
  let h = dt;
  let err = 1;

  const tVals = [t];
  const yVals =  [y.slice()];
  // FSAL support: store k1 for reuse between attempts/steps. When a step is
  // accepted we will set `last_k1` to the computed k7 so it can be reused as
  // the k1 of the next step.
  let last_k1: number[] | null = null;

  while (t < tEnd) {
    // if (t > .13517) {
    //   let debug = 1;
    // }
    if (h !== h) {
      throw new Error("NaN encountered in h");
    }
    if (t + h > tEnd) h = tEnd - t;

    try {
      // Compute Runge-Kutta stages (FSAL): reuse last_k1 when available,
      // otherwise compute k1 and keep it so retries don't recompute it.
      let k1: number[];
      if (last_k1) {
        k1 = last_k1;
      } else {
        k1 = f(t, y.slice());
        last_k1 = k1;
      }
      const k2 = f(t + c2 * h, y.map((yi, i) => yi + h * a21 * k1[i]));
      const k3 = f(t + c3 * h, y.map((yi, i) => yi + h * (a31 * k1[i] + a32 * k2[i])));
      const k4 = f(t + c4 * h, y.map((yi, i) => yi + h * (a41 * k1[i] + a42 * k2[i] + a43 * k3[i])));
      const k5 = f(t + c5 * h, y.map((yi, i) => yi + h * (a51 * k1[i] + a52 * k2[i] + a53 * k3[i] + a54 * k4[i])));
      const k6 = f(t + c6 * h, y.map((yi, i) => yi + h * (a61 * k1[i] + a62 * k2[i] + a63 * k3[i] + a64 * k4[i] + a65 * k5[i])));
      const k7 = f(t + c7 * h, y.map((yi, i) => yi + h * (a71 * k1[i] + a72 * k2[i] + a73 * k3[i] + a74 * k4[i] + a75 * k5[i] + a76 * k6[i])));
    
      // 5th order solution
      const y5 = y.map((yi, i) => yi + h * (b1 * k1[i] + b3 * k3[i] + b4 * k4[i] + b5 * k5[i] + b6 * k6[i] + b7 * k7[i]));
      
      // 4th order solution for error estimation
      const y4 = y.map((yi, i) => yi + h * (bs1 * k1[i] + bs3 * k3[i] + bs4 * k4[i] + bs5 * k5[i] + bs6 * k6[i] + bs7 * k7[i]));

      // Error estimate and tolerance check
      const sqe = y.map((_, i) => Math.pow((y5[i] - y4[i]) / (atol + rtol * Math.max(Math.abs(y[i]), Math.abs(y5[i]))), 2));
      const ssqe = sqe.reduce((a, b) => a + b, 0);
      err = Math.sqrt(
        ssqe / y.length
      );

      // Accept step if error small enough
      if (err <= 1.0) {
        t += h;
        if (verbose) console.log(`[RK45] Accepted step to t=${t} with h=${h} (err=${err})`);
        y = y5;
        tVals.push(t);
        yVals.push(y.slice());
        // FSAL: reuse k7 as k1 for the next step (k7 is evaluated at t+h,
        // y5 for Dormand-Prince, so it can serve as the next first stage).
        last_k1 = k7.slice();
      }

      // Adapt timestep (using 5th order method)
      const scale = safety * Math.pow(1.0 / Math.max(err, 1e-10), 0.2); // 1/(p+1) where p=4
      if (scale !== scale) {
        throw new Error("NaN encountered in h adaptation");
      }
      h = Math.min(dtMax, h * Math.min(5, Math.max(0.2, scale)));
    } 
    catch (e) {
      if (verbose) {
        console.error("Error computing RK45 stages at t =", t, "with h =", h, ":", e);
      }
      err = 2;
      h = h * 0.5; // Reduce step size on error
    }

    if (h < dtMin && err > 1.0) {
      if (opts.onUnderflow) {
        opts.onUnderflow();
      }
      else {
        throw new Error("Step size underflow — integration failed");
      }
    }
  }

  return { t: tVals, y: yVals };
}

export default rk45_dormand_prince;