let iterations = 0;

function iterate() {
  gvs.F_H2_2 = gvs.F_H2_1 + gvs.F_H2_7;
  gvs.F_N2_2 = gvs.F_N2_1 + gvs.F_N2_7;
  gvs.F_CH4_2 = gvs.F_CH4_1 + gvs.F_CH4_7;

  gvs.F_H2_3 = (1 - gvs.X) * gvs.F_H2_2;
  gvs.F_N2_3 = (1 - gvs.X) * gvs.F_N2_2;
  gvs.F_NH3_3 = gvs.X * gvs.F_N2_2 * 2;
  gvs.F_CH4_3 = gvs.F_CH4_2;

  gvs.F_NH3_4 = gvs.F_NH3_3;

  gvs.F_H2_5 = gvs.F_H2_3;
  gvs.F_N2_5 = gvs.F_N2_3;
  gvs.F_CH4_5 = gvs.F_CH4_3;

  gvs.F_H2_6 = gvs.F_H2_5 * gvs.P;
  gvs.F_N2_6 = gvs.F_N2_5 * gvs.P;
  gvs.F_CH4_6 = gvs.F_CH4_5 * gvs.P;

  gvs.F_H2_7 = gvs.F_H2_5 * (1 - gvs.P);
  gvs.F_N2_7 = gvs.F_N2_5 * (1 - gvs.P);
  gvs.F_CH4_7 = gvs.F_CH4_5 * (1 - gvs.P);

  iterations++;
  if(iterations < 1000) {
    iterate()
  }

  gvs.fraction_lost = gvs.F_H2_6 / gvs.F_H2_1;
  gvs.fraction_CH4 = gvs.F_CH4_2 / gvs.F_CH4_1;
}

function calcAll() {
  iterations = 0;
  iterate();
}

module.exports = calcAll;