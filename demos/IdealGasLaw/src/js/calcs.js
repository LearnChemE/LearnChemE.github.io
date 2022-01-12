function constant_P() {
  const dT = gvs.heat_added / gvs.Cp;
  const T = 273 + dT;
  gvs.T = T;
  gvs.V = gvs.n * gvs.R * gvs.T / gvs.P;
  gvs.piston_height = 0.35 * (gvs.V / 0.0224);
}

function constant_V() {
  const dT = gvs.heat_added / gvs.Cv;
  const T = 273 + dT;
  gvs.T = T;
  gvs.P = gvs.n * gvs.R * gvs.T / gvs.V;
}

function adiabatic_reversible() {
  const T = 273 * (gvs.P / 101325)**(gvs.R / gvs.Cp);
  gvs.T = T;
  gvs.V = gvs.n * gvs.R * gvs.T / gvs.P;
  gvs.piston_height = gvs.V / 0.064;
}

function spring() {
  const block_height = 0.753; // the piston_height value corresponding to the blocks
  const extended_height = 0.5; // the piston_height value corresponding to the fully-extended springs
  const k = 3000000; // spring constant, N/m
  let iterations = 0;
  function find_values() {
    gvs.T = 273 + gvs.heat_added / gvs.Cv;
    gvs.P = 101325 + k * (gvs.V - 0.032);
    gvs.V = gvs.n * gvs.R * gvs.T / gvs.P;
    gvs.spring_length = 0.1 - ((gvs.V - 0.032) / 0.032) / ( block_height / extended_height ) * 0.1;
    gvs.piston_height = block_height - (gvs.spring_length / 0.1) * (block_height - extended_height);
    if(iterations < 100) {
      iterations++;
      find_values();
    }
  }
  find_values()
}

function constant_t() {

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