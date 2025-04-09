export function calcAll() {
  const R = 8.314;
  const DH = -92200;
  const DS = -198.75;
  const keq = Math.exp(-1 * (DH - (state.T * DS)) / (R * state.T));

  // Stoichiometric coefficients for [N2, H2, NH3]
  const gamma = [1, 3, -2];

  // Initial moles for N2, H2, and NH3 from the inlet state.
  const nAdd = [state.inlet.nN2, state.inlet.nH2, state.inlet.nNH3];

  function nEQ(i, x) {
    return nAdd[i] - x * gamma[i];
  }

  function total(x) {
    return nAdd.reduce((sum, n, i) => sum + nEQ(i, x), 0);
  }

  function z(i, x) {
    return nEQ(i, x) / total(x);
  }

  function k(x) {
    return [0, 1, 2].reduce(
      (prod, i) => prod * Math.pow(z(i, x) * state.P, -1 * gamma[i]),
      1
    );
  }

  function f(x) {
    return k(x) - keq;
  }

  // --- Bisection Method ---
  function bisection(lower, upper, tol = 1e-15, maxIterations = 50000) {
    let fLower = f(lower);
    let fUpper = f(upper);

    if (fLower * fUpper > 0) {
      throw new Error("No sign change in the given interval.");
    }

    let mid, fMid;
    for (let iter = 0; iter < maxIterations; iter++) {
      mid = (lower + upper) / 2;
      fMid = f(mid);

      if (Math.abs(fMid) < tol) {
        return mid;
      }

      if (fLower * fMid < 0) {
        upper = mid;
        fUpper = fMid;
      } else {
        lower = mid;
        fLower = fMid;
      }
    }
    return mid;
  }

  // --- Find Roots with a Coarse Pre-scan ---
  function findRoots(coarseSteps = 50000, tol = 1e-15, maxIterations = 50000) {
    let roots = [];
    // Change domain if desired; for a forward reaction, you may only scan [0, xMax].
    const xMin = -14;
    const xMax = 14;
    const step = (xMax - xMin) / coarseSteps;

    let xPrev = xMin;
    let fPrev = f(xPrev);
    for (let i = 1; i <= coarseSteps; i++) {
      let xCurr = xMin + i * step;
      let fCurr = f(xCurr);

      if (fPrev * fCurr < 0) {
        try {
          let root = bisection(xPrev, xCurr, tol, maxIterations);
          roots.push(root);
        } catch (err) {
          console.error("Error in bisection interval [", xPrev, ",", xCurr, "]:", err.message);
        }
      }
      xPrev = xCurr;
      fPrev = fCurr;
    }
    return roots;
  }

  // --- Example Usage ---
  try {
    const solutionRoots = findRoots();
    let solutionFound = false;
    for (let i = 0; i < solutionRoots.length; i++) {
      const x = solutionRoots[i];
      // Calculate equilibrium moles for each species.
      const EQs = [0, 1, 2].map(i => nEQ(i, x));

      // Relax the validity test to allow nearly zero values.
      if (EQs.every(eq => eq >= -1e-9)) {
        // Consider the solution valid even if one component is nearly zero.
        state.outlet.nN2 = Math.max(EQs[0], 0);
        state.outlet.nH2 = Math.max(EQs[1], 0);
        state.outlet.nNH3 = Math.max(EQs[2], 0);
        solutionFound = true;
        break; // or handle both solutions as needed
      }
    }
    if (!solutionFound) {
      console.error("No physically valid solution was found.");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}