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