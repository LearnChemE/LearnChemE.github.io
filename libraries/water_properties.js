// All calculations are taken from:
// Wagner, W., & Pruß, A. (2002). The IAPWS formulation 1995 for the thermodynamic properties of ordinary water substance for general and scientific use. Journal of physical and chemical reference data, 31(2), 387-535.

// References to equations and tables, e.g. equation (2), refers to the numbered equations and tables in the aforementioned publication.

const Tc = 647.096; // Critical temperature, K
const rho_c = 322; // Critical density, kg/m^3
const R = 0.46151805; // Specific gas constant, kJ/(kg K)

// Hemholtz free energy, equation (4) multiplied by RT
function hemholtz(rho, T) {
  const delta = rho / rho_c;
  const tau = Tc / T;
  // Equation (4)
  const F = R * T * ( phi_0(delta, tau) + phi_r(delta, tau) ); // Specific Hemholtz free energy (kJ / kg)
  return F
}

// Pressure as a function of density (rho, kg/m^3) and temperature (T, K). Returns value in kPa
function pressure(rho, T) {
  const delta = rho / rho_c;
  const tau = Tc / T;
  const P = rho * R * T * p(delta, tau);
  return P
}

// Pressure as a function of density (rho, kg/m^3) and temperature (T, K). Returns value in kPa
function internal_energy(rho, T) {
  const delta = rho / rho_c;
  const tau = Tc / T;
  const U = R * T * u(delta, tau);
  return U
}

// Entropy as a function of density (rho, kg/m^3) and temperature (T, K). Returns value in kJ/kg
function entropy(rho, T) {
  const delta = rho / rho_c;
  const tau = Tc / T;
  const S = R * s(delta, tau);
  return S
}

// Enthalpy as a function of density (rho, kg/m^3) and temperature (T, K). Returns value in kJ/kg
function enthalpy(rho, T) {
  const delta = rho / rho_c;
  const tau = Tc / T;
  const H = R * T * h(delta, tau);
  return H
}

// Internal energy relation divided by RT, Table 3
function u(delta, tau) {
  return ( tau * ( phi_0_tau(delta, tau) + phi_r_tau(delta, tau) ) )
}

// Enthalpy relation divided by RT, Table 3
function h(delta, tau) {
  return (1 + tau * (phi_0_tau(delta, tau) + phi_r_tau(delta, tau)) + delta * phi_r_delta(delta, tau))
}

// Entropy relation divided by R, Table 3
function s(delta, tau) {
  return tau * (phi_0_tau(delta, tau) + phi_r_tau(delta, tau)) - phi_0(delta, tau) - phi_r(delta, tau)
}

// dimensionless Hemholtz free energy divided by RT, ideal component, equation (5)
function phi_0(delta, tau) {
  const n_0_i = [n_0_4, n_0_5, n_0_6, n_0_7, n_0_8];
  const gamma_0_i = [gamma_0_4, gamma_0_5, gamma_0_6, gamma_0_7, gamma_0_8];

  let phi = Math.log(delta) + n_0_1 + n_0_2 * tau + n_0_3 * Math.log(tau);
  for (let i = 0; i < 5; i++) {
    phi += n_0_i[i] * Math.log( 1 - Math.exp( -1 * gamma_0_i[i] * tau ) );
  }
  return phi
}

function phi_0_tau(delta, tau) {
  let phi = 0;

  const n_0_i = [n_0_4, n_0_5, n_0_6, n_0_7, n_0_8];
  const gamma_0_i = [gamma_0_4, gamma_0_5, gamma_0_6, gamma_0_7, gamma_0_8];

  phi += n_0_2 + n_0_3 / tau;

  for (let i = 0; i < 5; i++) {
    phi += n_0_i[i] * gamma_0_i[i] * ( (1 - Math.exp( -1 * gamma_0_i[i] * tau ) )**(-1) - 1);
  }

  return phi
}

// dimensionless Hemholtz free energy divided by RT, real component, equation (6)
function phi_r(delta, tau) {
  let phi = 0;

  // First summed term, equation (6)
  for(let i = 0; i < 7; i++) {
    const d_i = coefficients_residual_real_1[i][2];
    const t_i = coefficients_residual_real_1[i][3];
    const n_i = coefficients_residual_real_1[i][4];
    phi += n_i * delta**d_i * tau**t_i;
  }

  // Second summed term, equation (6)
  for(let i = 7; i < 51; i++) {
    const c_i = coefficients_residual_real_1[i][1];
    const d_i = coefficients_residual_real_1[i][2];
    const t_i = coefficients_residual_real_1[i][3];
    const n_i = coefficients_residual_real_1[i][4];
    phi += n_i * delta**d_i * tau**t_i * Math.exp( -1 * delta**c_i );
  }

  // Third summed term, equation (6)
  for(let i = 0; i < 3; i++) {
    const d_i = coefficients_residual_real_2[i][2];
    const t_i = coefficients_residual_real_2[i][3];
    const n_i = coefficients_residual_real_2[i][4];
    const alpha_i = coefficients_residual_real_2[i][5];
    const Beta_i = coefficients_residual_real_2[i][6];
    const gamma_i = coefficients_residual_real_2[i][7];
    const epsilon_i = coefficients_residual_real_2[i][8];
    phi += n_i * delta**d_i * tau**t_i * Math.exp( -1 * alpha_i * (delta - epsilon_i)**2 - Beta_i * ( tau - gamma_i )**2 );
  }

  // Fourth summed term, equation (6)
  for(let i = 0; i < 2; i++) {
    const a_i = coefficients_residual_real_3[i][1];
    const b_i = coefficients_residual_real_3[i][2];
    const B_i = coefficients_residual_real_3[i][3];
    const n_i = coefficients_residual_real_3[i][4];
    const C_i = coefficients_residual_real_3[i][5];
    const D_i = coefficients_residual_real_3[i][6];
    const A_i = coefficients_residual_real_3[i][7];
    const Beta_i = coefficients_residual_real_3[i][8];

    const Theta = (1 - tau) + A_i * ( (delta - 1)**2 )**(1 / (2 * Beta_i) );
    const Psi = Math.exp( -1 * C_i * (delta - 1)**2 - D_i * (tau - 1)**2 );
    const Delta = Theta**2 + B_i * ( (delta - 1)**2 )**a_i;

    phi += n_i * Delta**b_i * delta * Psi;
  }

  return phi
}

// Pressure relation divided by rho * R * T, Table 3
function p(delta, tau) {
  return ( 1 + delta * phi_r_delta(delta, tau) )
}

function phi_r_tau(delta, tau) {
  let phi = 0;

  for(let i = 0; i < 7; i++) {
    const d_i = coefficients_residual_real_1[i][2];
    const t_i = coefficients_residual_real_1[i][3];
    const n_i = coefficients_residual_real_1[i][4];
    phi += n_i * t_i * delta**d_i * tau**(t_i - 1);
  }

  for(let i = 7; i < 51; i++) {
    const c_i = coefficients_residual_real_1[i][1];
    const d_i = coefficients_residual_real_1[i][2];
    const t_i = coefficients_residual_real_1[i][3];
    const n_i = coefficients_residual_real_1[i][4];
    phi += n_i * t_i * delta**d_i * tau**(t_i - 1) * Math.exp( -1 * delta**c_i );
  }

  for(let i = 0; i < 3; i++) {
    const d_i = coefficients_residual_real_2[i][2];
    const t_i = coefficients_residual_real_2[i][3];
    const n_i = coefficients_residual_real_2[i][4];
    const alpha_i = coefficients_residual_real_2[i][5];
    const Beta_i = coefficients_residual_real_2[i][6];
    const gamma_i = coefficients_residual_real_2[i][7];
    const epsilon_i = coefficients_residual_real_2[i][8];
    phi += (n_i * delta**d_i * tau**t_i * Math.exp( -1 * alpha_i * (delta - epsilon_i)**2 - Beta_i * ( tau - gamma_i )**2 )) * ( t_i / tau - 2 * Beta_i * ( tau - gamma_i ) );
  }

  for(let i = 0; i < 2; i++) {
    const a_i = coefficients_residual_real_3[i][1];
    const b_i = coefficients_residual_real_3[i][2];
    const B_i = coefficients_residual_real_3[i][3];
    const n_i = coefficients_residual_real_3[i][4];
    const C_i = coefficients_residual_real_3[i][5];
    const D_i = coefficients_residual_real_3[i][6];
    const A_i = coefficients_residual_real_3[i][7];
    const Beta_i = coefficients_residual_real_3[i][8];

    const Theta = (1 - tau) + A_i * ( (delta - 1)**2 )**(1 / (2 * Beta_i) );
    const Psi = Math.exp( -1 * C_i * (delta - 1)**2 - D_i * (tau - 1)**2 );
    const Delta = Theta**2 + B_i * ( (delta - 1)**2 )**a_i;

    const dDelta_b_i_dtau = -2 * Theta * b_i * Delta**(b_i - 1);
    const dPsi_dtau = -2 * C_i * (delta - 1) * Psi;

    phi += n_i * delta * (dDelta_b_i_dtau * Psi + Delta**b_i * dPsi_dtau);
  }

  return phi
}

// Residual part of the dimensionless Hemholtz free energy derivative phi^r_delta
function phi_r_delta(delta, tau) {
  let phi = 0;

  // First summed term, phi^r_delta
  for(let i = 0; i < 7; i++) {
    const d_i = coefficients_residual_real_1[i][2];
    const t_i = coefficients_residual_real_1[i][3];
    const n_i = coefficients_residual_real_1[i][4];
    phi += n_i * d_i * (delta**(d_i - 1)) * tau**t_i;
  }

  // Second summed term, phi^r_delta
  for(let i = 7; i < 51; i++) {
    const c_i = coefficients_residual_real_1[i][1];
    const d_i = coefficients_residual_real_1[i][2];
    const t_i = coefficients_residual_real_1[i][3];
    const n_i = coefficients_residual_real_1[i][4];
    phi += n_i * Math.exp( -1 * delta**c_i ) * ( (delta**(d_i - 1)) * (tau**t_i) * (d_i - c_i * delta**c_i) );
  }
  
  // Third summed term, phi^r_delta
  for(let i = 0; i < 3; i++) {
    const d_i = coefficients_residual_real_2[i][2];
    const t_i = coefficients_residual_real_2[i][3];
    const n_i = coefficients_residual_real_2[i][4];
    const alpha_i = coefficients_residual_real_2[i][5];
    const Beta_i = coefficients_residual_real_2[i][6];
    const gamma_i = coefficients_residual_real_2[i][7];
    const epsilon_i = coefficients_residual_real_2[i][8];
    const term_1 = n_i * delta**d_i * tau**t_i * Math.exp( -1 * alpha_i * (delta - epsilon_i)**2 - Beta_i * (tau - gamma_i)**2);
    const term_2 = (d_i / delta - 2 * alpha_i * (delta - epsilon_i));
    phi += term_1 * term_2;
  }
  
   // Fourth summed term, phi^r_delta
  for(let i = 0; i < 2; i++) {
    const a_i = coefficients_residual_real_3[i][1];
    const b_i = coefficients_residual_real_3[i][2];
    const B_i = coefficients_residual_real_3[i][3];
    const n_i = coefficients_residual_real_3[i][4];
    const C_i = coefficients_residual_real_3[i][5];
    const D_i = coefficients_residual_real_3[i][6];
    const A_i = coefficients_residual_real_3[i][7];
    const Beta_i = coefficients_residual_real_3[i][8];

    const Theta = (1 - tau) + A_i * ( (delta - 1)**2 )**(1 / (2 * Beta_i) );
    const Psi = Math.exp( -1 * C_i * (delta - 1)**2 - D_i * (tau - 1)**2 );
    const Delta = Theta**2 + B_i * ( (delta - 1)**2 )**a_i;

    // Derivatives of the distance function and exponential function
    const dPsi_ddelta = -2 * C_i * (delta - 1) * Psi;
    const dDelta_ddelta = (delta - 1) * ( A_i * Theta * (2 / Beta_i) * ((delta - 1)**2)**(1 / (2 * Beta_i) - 1) + 2 * B_i * a_i * ( (delta - 1)**2 )**(a_i - 1) );
    const dDelta_b_i_ddelta = b_i * Delta**(b_i - 1) * dDelta_ddelta;

    phi += n_i * (Delta**b_i * (Psi + delta * dPsi_ddelta) + dDelta_b_i_ddelta * delta * Psi);
  }
  return phi
}

// Numerical values of the coefficients and parameters of the ideal-gas part of the dimensionless Helmholtz free energy
const n_0_1 = -8.3204464837497;
const n_0_2 = 6.6832105275932;
const n_0_3 = 3.00632;
const n_0_4 = 0.012436;
const n_0_5 = 0.97315;
const n_0_6 = 1.27950;
const n_0_7 = 0.96956;
const n_0_8 = 0.24873;
const gamma_0_4 = 1.28728967;
const gamma_0_5 = 3.53734222;
const gamma_0_6 = 7.74073708;
const gamma_0_7 = 9.24437796;
const gamma_0_8 = 27.5075105;

// Numerical values of the coefficients and parameters of the real part of the dimensionless Helmholtz free energy
// [i, c_i, d_i, t_i, n_i]
const coefficients_residual_real_1 = [
  [1, null, 1, -0.5, 0.12533547935523e-1],
  [2, null, 1, 0.875, 0.78957634722828e1],
  [3, null, 1, 1, -0.87803203303561e1],
  [4, null, 2, 0.5, 0.31802509345418],
  [5, null, 2, 0.75, -0.26145533859358],
  [6, null, 3, 0.375, -0.78199751687981e-2],
  [7, null, 4, 1, 0.88089493102134e-2],
  [8, 1, 1, 4, -0.66856572307965],
  [9, 1, 1, 6, 0.20433810950965],
  [10, 1, 1, 12, -0.66212605039687e-4],
  [11, 1, 2, 1, -0.19232721156002],
  [12, 1, 2, 5, -0.25709043003438],
  [13, 1, 3, 4, 0.16074868486251],
  [14, 1, 4, 2, -0.40092828925807e-1],
  [15, 1, 4, 13, 0.39343422603254e-6],
  [16, 1, 5, 9, -0.75941377088144e-5],
  [17, 1, 7, 3, 0.56250979351888e-3],
  [18, 1, 9, 4, -0.15608652257135e-4],
  [19, 1, 10, 11, 0.11537996422951e-8],
  [20, 1, 11, 4, 0.36582165144204e-6],
  [21, 1, 13, 13, -0.13251180074668e-11],
  [22, 1, 15, 1, -0.62639586912454e-9],
  [23, 2, 1, 7, -0.10793600908932],
  [24, 2, 2, 1, 0.17611491008752e-1],
  [25, 2, 2, 9, 0.22132295167546],
  [26, 2, 2, 10, -0.40247669763528],
  [27, 2, 3, 10, 0.58083399985759],
  [28, 2, 4, 3, 0.49969146990806e-2],
  [29, 2, 4, 7, -0.31358700712549e-1],
  [30, 2, 4, 10, -0.74315929710341],
  [31, 2, 5, 10, 0.47807329915480],
  [32, 2, 6, 6, 0.20527940895948e-1],
  [33, 2, 6, 10, -0.13636435110343],
  [34, 2, 7, 10, 0.14180634400617e-1],
  [35, 2, 9, 1, 0.83326504880713e-2],
  [36, 2, 9, 2, -0.29052336009585e-1],
  [37, 2, 9, 3, 0.38615085574206e-1],
  [38, 2, 9, 4, -0.20393486513704e-1],
  [39, 2, 9, 8, -0.16554050063734e-2],
  [40, 2, 10, 6, 0.19955571979541e-2],
  [41, 2, 10, 9, 0.15870308324157e-3],
  [42, 2, 12, 8, -0.16388568342530e-4],
  [43, 3, 3, 16, 0.43613615723811e-1],
  [44, 3, 4, 22, 0.34994005463765e-1],
  [45, 3, 4, 23, -0.76788197844621e-1],
  [46, 3, 5, 23, 0.22446277332006e-1],
  [47, 4, 14, 10, -0.62689710414685e-4],
  [48, 6, 3, 50, -0.55711118565645e-9],
  [49, 6, 6, 44, -0.19905718354408],
  [50, 6, 6, 46, 0.31777497330738],
  [51, 6, 6, 50, -0.11841182425981]
];

// Numerical values of the coefficients and parameters of the real part of the dimensionless Helmholtz free energy, continued
// [i, c_i, d_i, t_i, n_i, alpha_i, Beta_i, gamma_i, epsilon_i]
const coefficients_residual_real_2 = [
  [52, null, 3, 0, -0.31306260323435e2, 20, 150, 1.21, 1],
  [53, null, 3, 1, 0.31546140237781e2, 20, 150, 1.21, 1],
  [54, null, 3, 4, -0.25213154341695e4, 20, 250, 1.25, 1],
];

// Numerical values of the coefficients and parameters of the real part of the dimensionless Helmholtz free energy, continued
// [i, c_i, d_i, t_i, n_i, C_i, D_i, A_i, Beta_i]
const coefficients_residual_real_3 = [
  [55, 3.5, 0.85, 0.2, -0.14874640856724, 28, 700, 0.32, 0.3],
  [56, 3.5, 0.95, 0.2, 0.31806110878444, 32, 800, 0.32, 0.3],
];

module.exports = { hemholtz, internal_energy, pressure, enthalpy, entropy, Tc, rho_c, R }