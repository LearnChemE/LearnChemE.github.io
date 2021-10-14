function calcAll() {
  const H_init = gvs.H(gvs.T_rxn, 0);
  const H_final = gvs.H(gvs.T_rxn, 1);
  const H_std_init = gvs.H(298, 0);
  const H_std_final = gvs.H(298, 1);

  gvs.Hrxn = H_final - H_init;
  gvs.H_std_rxn = H_std_final - H_std_init;

  let location;

  if(gvs.position <= 1) {
    location = gvs.position;
    gvs.T = 298 + (gvs.T_rxn - 298) * (1 - location);
    gvs.currentH = gvs.H(gvs.T, 0);

  } else if (gvs.position <= 2) {
    location = gvs.position - 1;
    gvs.T = 298;
    gvs.currentH = gvs.H(298, location);
  } else {
    location = gvs.position - 2;
    gvs.T = 298 + (gvs.T_rxn - 298) * location;
    gvs.currentH = gvs.H(gvs.T, 1);
  }

}

module.exports = { calcAll }