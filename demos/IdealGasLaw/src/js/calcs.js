const P_atm = 101325; // atmospheric pressure, Pa
const T_init = 273; // initial temperature, K
const max_spring_length = 0.1; // the length of the spring when Q = 0;

function constant_P() {
  const dT = gvs.heat_added / gvs.Cp;
  const T = T_init + dT;
  gvs.T = T;
  gvs.V = gvs.n * gvs.R * gvs.T / gvs.P;
  gvs.piston_height = 0.35 * (gvs.V / 0.0224);
}

function constant_V() {
  const dT = gvs.heat_added / gvs.Cv;
  const T = T_init + dT;
  gvs.T = T;
  gvs.P = gvs.n * gvs.R * gvs.T / gvs.V;
}

function adiabatic_reversible() {
  const T = T_init * (gvs.P / 101325)**(gvs.R / gvs.Cp);
  gvs.T = T;
  gvs.V = gvs.n * gvs.R * gvs.T / gvs.P;
  gvs.piston_height = gvs.V / 0.064;
}

function spring() {
  const block_height = 0.753; // the piston_height value corresponding to the blocks
  const extended_height = 0.5; // the piston_height value corresponding to the fully-extended springs
  const k = 100000; // spring constant, N/m
  const V_init = 0.03200403956884307; // initial volume, m^3
  let iterations = 0;
  function find_values() {
    gvs.V = (gvs.P - P_atm) * gvs.A**2 / k + V_init;
    gvs.P = gvs.n * gvs.R * gvs.T / gvs.V;
    gvs.T = (gvs.heat_added - P_atm * (gvs.V - V_init) - k * gvs.n * ( gvs.V**2 / 2 - V_init**2 / 2 - V_init * ( gvs.V - V_init ) ) / gvs.A**2 ) / ( gvs.Cv * gvs.n ) + T_init;
    gvs.spring_length = 0.1 - (gvs.V - V_init) / gvs.A;
    gvs.piston_height = block_height - (gvs.spring_length / max_spring_length) * (block_height - extended_height);
    if(iterations < 100) {
      iterations++;
      find_values();
    }
  }
  find_values()
}

function constant_t() {
  gvs.T = T_init;
  gvs.V = gvs.n * gvs.R * gvs.T / gvs.P;
  gvs.piston_height = gvs.V / 0.064;
  gvs.heat_added = gvs.n * gvs.R * gvs.T * Math.log(gvs.V / (gvs.n * gvs.R * T_init / P_atm));
}

module.exports = function calcAll() {
  const mode = gvs.piston_mode;
  switch(mode) {
    case "constant-p":
      constant_P();
    break;

    case "constant-v":
      constant_V();
    break;

    case "adiabatic-reversible":
      adiabatic_reversible();
    break;

    case "spring":
      spring();
    break;

    case "constant-t":
      constant_t();
    break;
  }
}