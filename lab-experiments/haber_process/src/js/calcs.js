export function setDefaults() {
  state = {
    ...state,
    T: 573,
    P: 0,
    PSetPoint: 50,
    maxP: 150,
    purging: false,
    purgingTime: 0,
    purge_position: 2,
    takingSample: false,
    takingSampleTime: 0,
    reaction_time: 0,
    tanks: {
      maxP: 150,
      h2: {
        m: 0,
        mSetPoint: 0,
        mFrame: -600,
        P: 150,
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#ff0000",
        label1: "H",
        label2: "2",
      },
      n2: {
        m: 0,
        mSetPoint: 0,
        mFrame: -600,
        P: 150,
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#0000ff",
        label1: "N",
        label2: "2",
      },
      nh3: {
        m: 0,
        mSetPoint: 0,
        mFrame: -600,
        P: 150,
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#00ff00",
        label1: "NH",
        label2: "3",
      },
      he: {
        valvePosition: 0,
        isTurningOn: false,
        isTurningOff: false,
        color: "#ffffff",
        label: "He"
      }
    },
    outlet: {
      yH2: 0.5,
      yN2: 0.3,
      yNH3: 0.2,
    }
  }
}

export function calcAll() {
  state.reaction_time = 0;

  // Much credit to ChatGPT and GitHub Copilot for the code in this file.
  // The code is a numerical solution to the equilibrium constant of the Haber process.
  // The solution from ChatGPT was far from perfect, but it was a good starting point.
  // A lot of time and effort went into this solution, so here it is in all of its beauty.
  // -Neil

  const R = 8.314; // Ideal gas constant - J / (mol * K)
  const DH = -92200; // Enthalpy of reaction - J / mol
  const DS = -198.75; // Entropy of reaction - J / (mol * K)

  // Equilibrium constant for the reaction at the given temperature.
  const keq = Math.exp(-1 * (DH - (state.T * DS)) / (R * state.T));

  // Stoichiometric coefficients for [N2, H2, NH3]
  const gamma = [1, 3, -2];

  const MW_N2 = 28.02; // Molecular weight of N2 - g/mol
  const MW_H2 = 2.02; // Molecular weight of H2 - g/mol
  const MW_NH3 = 17.03; // Molecular weight of NH3 - g/mol

  // Initial moles for N2, H2, and NH3 from the inlet state.
  const nN2 = (state.tanks.n2.m * 60 / 1000) / MW_N2;
  const nH2 = (state.tanks.h2.m * 60 / 1000) / MW_H2;
  const nNH3 = (state.tanks.nh3.m * 60 / 1000) / MW_NH3;

  const nAdd = [nN2, nH2, nNH3];

  // The number of moles at equilibrium = initial number of moles minus the extent
  // of reaction times the stoichiometric coefficient.
  function nEQ(i, x) {
    return nAdd[i] - x * gamma[i];
  }

  // Total moles in the system
  function total(x) {
    return nAdd.reduce((sum, n, i) => sum + nEQ(i, x), 0);
  }

  // The mol fraction of each component in the mixture, as a function of
  // extent of reaction
  function z(i, x) {
    return nEQ(i, x) / total(x);
  }

  // The equilibrium constant as a function of the extent of reaction.
  function k(x) {
    return [0, 1, 2].reduce(
      (prod, i) => prod * Math.pow(z(i, x) * state.P, -1 * gamma[i]),
      1
    );
  }

  // At equilibrium, k(x) = keq.
  // This is the function we want to find the root of.
  function f(x) {
    return k(x) - keq;
  }

  // The bisection method is a numerical method for finding roots of a function.
  // It works by iteratively narrowing down an interval [lower, upper] where the function changes sign.
  // The function must be continuous in the interval, and the initial interval must contain a root.
  // The method is simple and robust, and in this case converges very rapidly.
  function bisection(lower, upper, tol, maxIterations) {
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

  // The minimum extent is a fully-reversed reaction, where all of the ammonia converts to N2 and H2.
  // This is a negative value for x.
  const xMin = gamma[2] * nAdd[2];

  // The maximum extent is limited by the limiting reactant, so for example, if we have
  // 1 mol of N2 and 6 mol of H2, the maximum extent is 1.
  // Likewise, if we have 3 mol of N2 and 3 mol of H2, the maximum extent is also 1 because
  // the stoichiometric coefficient of H2 is 3 and 3 / 3 = 1.
  // This would be a positive value for x.
  const extents = nAdd.map((n, i) => { return n / gamma[i]; });
  const xMax = Math.min(extents[0], extents[1]);

  // There are multiple roots to the equation k(x) = keq, so we need to find all of them.
  // The bisection method is a rapid way of finding a highly accurate solution.
  function findRoots(coarseSteps = 10000, tol = 1e-9, maxIterations = 10000) {
    let roots = [];

    // Step size of the extent of reaction is approximately 1e-4
    const step = (xMax - xMin) / coarseSteps;

    let xPrev = xMin;
    let fPrev = f(xPrev);

    // We check the function at each step to see if it changes sign.
    for (let i = 1; i <= coarseSteps; i++) {
      let xCurr = xMin + i * step;
      let fCurr = f(xCurr);

      // When the function changes sign, we have found a root.
      if (fPrev * fCurr < 0) {
        try {
          // Once we have an interval for the root, we use the bisection method
          // to find the root's exact value.
          let root = bisection(xPrev, xCurr, tol, maxIterations);

          // This is then added to the list of roots.
          roots.push(root);
        } catch (err) {
          console.error("Error in bisection interval [", xPrev, ",", xCurr, "]:", err.message);
        }
      }
      xPrev = xCurr;
      fPrev = fCurr;
    }

    // At the end of this method, we should have between one and three roots.
    return roots;
  }

  let solutionFound = false;

  try {
    // First, we find all of the roots of the equation k(x) = keq.  
    const solutionRoots = findRoots();

    // Then, for each root that we found, we check if it is a valid solution.
    for (let i = 0; i < solutionRoots.length; i++) {
      const x = solutionRoots[i];

      // Equilibrium moles for each species.
      const EQs = [0, 1, 2].map(i => nEQ(i, x));

      // We consider a solution valid if all components are positive.
      // The exception is if one component is negative but very small (greater than -1e-3).
      // In that case, we can consider it as zero.
      if (EQs.every(eq => eq >= -1e-3)) {
        const nN2 = Math.max(EQs[0], 0);
        const nH2 = Math.max(EQs[1], 0);
        const nNH3 = Math.max(EQs[2], 0);

        const yN2 = nN2 / (nN2 + nH2 + nNH3);
        const yH2 = nH2 / (nN2 + nH2 + nNH3);
        const yNH3 = nNH3 / (nN2 + nH2 + nNH3);

        state.outlet.yN2 = yN2;
        state.outlet.yH2 = yH2;
        state.outlet.yNH3 = yNH3;

        solutionFound = true;
        break;
      }
    }

    // If we didn't find a valid solution, the chances are that it was essentially a complete conversion,
    // In which case we can use the maximum extent of reaction.
    if (!solutionFound) {
      const EQs = [0, 1, 2].map(i => nEQ(i, xMax));
      const nN2 = Math.max(EQs[0], 0);
      const nH2 = Math.max(EQs[1], 0);
      const nNH3 = Math.max(EQs[2], 0);

      const yN2 = nN2 / (nN2 + nH2 + nNH3);
      const yH2 = nH2 / (nN2 + nH2 + nNH3);
      const yNH3 = nNH3 / (nN2 + nH2 + nNH3);

      state.outlet.yN2 = yN2;
      state.outlet.yH2 = yH2;
      state.outlet.yNH3 = yNH3;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}