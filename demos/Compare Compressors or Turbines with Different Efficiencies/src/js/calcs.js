export function setDefaults() {
  const R = 8.314;
  const Cp = (7 / 2) * R; // ≈ 29.099 J/mol·K

  const mode = window.state.mode || "compressor";

  // Default inputs depending on mode
  let T_in, P_in;
  let eta1 = window.state.eta1 ?? 0.7;
  let eta2 = window.state.eta2 ?? 0.7;
  
  if (mode === "turbine") {
    T_in = 550;
    P_in = 10;
  } else {
    // compressor
    T_in = 300;
    P_in = 2;
  }

  window.state = {
    ...window.state, //Preserve canvasSize, frameRate, etc.
    R,
    Cp,
    mode,
    T_in,
    P_in,
    eta1,
    eta2,
    P_out_1: null,
    T_out_1: null,
    outletType: window.state.outletType ?? "pressure",
    outletTarget: window.state.outletTarget ?? (mode === "compressor" ? 15 : 1.4),
    W_1: null,
    P_out_2: null,
    T_out_2: null,
    W_2: null,
  };
}

export function calcAll() {
  // If state is not initialized, set defaults first
  if (!window.state) {
    setDefaults();
  }

  const { R, Cp, T_in, P_in, mode, eta1, eta2 } = window.state;

  const gamma = Cp / (Cp - R);

  // Set pressure and temperature ranges based on device type
  let P_out_range, T_out_range;
  if (mode === "compressor") {
    P_out_range = [10, 20];
    T_out_range = [500, 650];
  } else {
    P_out_range = [0.8, 2];
    T_out_range = [350, 450];
  }

  function calcToutFromEta(T_rev, eta, isCompressor) {
    if (isCompressor) {
      return T_in + (T_rev - T_in) / eta;
    } else {
      return T_in - eta * (T_in - T_rev);
    }
  }

  const { outletType, outletTarget } = window.state;

  let P_out_1, T_out_1, W_1;
  let P_out_2, T_out_2, W_2;

  const isCompressor = mode === "compressor";

  // Compute Box 1 based on outlet type
  if (outletType === "pressure") {
    P_out_1 = outletTarget;
    const T_rev_1 = T_in * Math.pow(P_out_1 / P_in, (gamma - 1) / gamma);
    T_out_1 = calcToutFromEta(T_rev_1, eta1, isCompressor);
    W_1 = (isCompressor ? 1 : -1) * Cp * Math.abs(T_out_1 - T_in);
  } else {
    T_out_1 = outletTarget;
    // Reverse the eta formula to get reversible T
    const T_rev_1 = isCompressor
      ? T_in + (T_out_1 - T_in) * eta1
      : T_in - (T_in - T_out_1) / eta1;
    const P_ratio_1 = Math.pow(T_rev_1 / T_in, gamma / (gamma - 1));
    P_out_1 = P_in * P_ratio_1;

    W_1 = (isCompressor ? 1 : -1) * Cp * Math.abs(T_out_1 - T_in);
  }

  // For Box 2 use max range value as reference
  if (outletType === "pressure") {
    P_out_2 = outletTarget;
    const T_rev_2 = T_in * Math.pow(P_out_2 / P_in, (gamma - 1) / gamma);
    T_out_2 = calcToutFromEta(T_rev_2, eta2, isCompressor);
    W_2 = (isCompressor ? 1 : -1) * Cp * Math.abs(T_out_2 - T_in);
  }
  else {
    T_out_2 = outletTarget;
    const T_rev_2 = isCompressor
      ? T_in + (T_out_2 - T_in) * eta2
      : T_in - (T_in - T_out_2) / eta2;
    const P_ratio_2 = Math.pow(T_rev_2 / T_in, gamma / (gamma - 1));
    P_out_2 = P_in * P_ratio_2;

    W_2 = (isCompressor ? 1 : -1) * Cp * Math.abs(T_out_2 - T_in);
  }

  // Update global state
  if (
    isFinite(P_out_1) && isFinite(T_out_1) && isFinite(W_1) &&
    isFinite(P_out_2) && isFinite(T_out_2) && isFinite(W_2)
  ) {
    window.state = {
      ...window.state,
      P_out_1: +P_out_1.toFixed(2),
      T_out_1: +T_out_1.toFixed(0),
      W_1: +(W_1 / 1000).toFixed(1), // Convert to kJ/mol
      P_out_2: +P_out_2.toFixed(2),
      T_out_2: +T_out_2.toFixed(0),
      W_2: +(W_2 / 1000).toFixed(1), // Convert to kJ/mol
    };
  }
}
