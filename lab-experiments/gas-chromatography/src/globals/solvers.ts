type ObjectiveFunction = (x: number) => number;

interface BisectionOptions {
  /** The acceptable error margin. Defaults to 1e-7. */
  tolerance?: number;
  /** Maximum number of iterations to prevent infinite loops. Defaults to 100. */
  maxIterations?: number;
}

/**
 * Finds the root of a continuous function using the bisection method.
 * 
 * @param func The mathematical function to find the root for
 * @param a The start of the interval
 * @param b The end of the interval
 * @param options Configuration for tolerance and max iterations
 * @returns The approximate x-value where func(x) === 0
 */
export function bisection(
  func: ObjectiveFunction,
  a: number,
  b: number,
  options: BisectionOptions = {}
): number {
  const tolerance = options.tolerance ?? 1e-7;
  const maxIterations = options.maxIterations ?? 100;

  let fa = func(a);
  let fb = func(b);

  // The root must be bracketed by [a, b]
  if (fa * fb > 0) {
    throw new Error(
      `Root is not bracketed: f(${a}) = ${fa} and f(${b}) = ${fb} have the same sign.`
    );
  }
  if (fa === 0) return a;
  if (fb === 0) return b;

  let mid = a;
  let iterations = 0;

  while (Math.abs(b - a) / 2 > tolerance && iterations < maxIterations) {
    mid = (a + b) / 2;
    const fmid = func(mid);

    // Exact root found
    if (fmid === 0) {
      return mid;
    }

    // Determine which sub-interval contains the root
    if (fa * fmid < 0) {
      b = mid;
      fb = fmid; // Optimization: avoid recalculating func(b)
    } else {
      a = mid;
      fa = fmid; // Optimization: avoid recalculating func(a)
    }

    iterations++;
  }

  if (iterations === maxIterations) {
    console.warn(`Warning: Reached maximum iterations (${maxIterations}) before converging to tolerance.`);
  }

  // Return the midpoint of the final interval
  return (a + b) / 2;
}

type Integrand = (x: number) => number;

interface TrapezoidOptions {
  /** 
   * The number of subintervals (trapezoids) to divide the area into. 
   * Higher values increase accuracy but require more computation. 
   * Defaults to 1000. 
   */
  intervals?: number;
}

/**
 * Numerically integrates a function using the trapezoidal rule.
 * 
 * @param func The mathematical function to integrate
 * @param a The lower limit of integration
 * @param b The upper limit of integration
 * @param options Configuration for the number of intervals
 * @returns The approximate definite integral of the function
 */
export function trapezoidalIntegrator(
  func: Integrand,
  a: number,
  b: number,
  options: TrapezoidOptions = {}
): number {
  const n = options.intervals ?? 1000;

  if (n <= 0 || !Number.isInteger(n)) {
    throw new Error("Number of intervals must be a positive integer.");
  }

  if (a === b) {
    return 0;
  }

  // Calculate the width of each trapezoid
  const dx = (b - a) / n;

  const feval = (x: number) => {
    const fx = func(x);
    if (!isFinite(fx)) console.error(`Integration Error: NaN found in evaluation at x=${x}`);
    return fx;
  }
  
  // The formula is: (dx / 2) * [f(x_0) + 2*f(x_1) + ... + 2*f(x_{n-1}) + f(x_n)]
  // We start with the endpoints f(a) and f(b)
  let sum = feval(a) + feval(b);

  // Add 2 * f(x) for all the internal points
  for (let i = 1; i < n; i++) {
    const x = a + i * dx;
    sum += 2 * feval(x);
  }

  return (dx / 2) * sum;
}