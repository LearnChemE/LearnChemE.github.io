let iterations = 0;

function iterate() {
  gvs.F_H2_2 = gvs.F_H2_1 + gvs.F_H2_7;
  gvs.F_N2_2 = gvs.F_N2_1 + gvs.F_N2_7;
  gvs.F_CH4_2 = gvs.F_CH4_1 + gvs.F_CH4_7;

  gvs.F_H2_3 = (1 - gvs.X) * gvs.F_H2_2;
  gvs.F_N2_3 = (1 - gvs.X) * gvs.F_N2_2;
  gvs.F_NH3_3 = gvs.X * gvs.F_N2_2;
  gvs.F_CH4_3 = gvs.F_CH4_2;

  gvs.F_NH3_4 = gvs.F_NH3_3;

  gvs.F_H2_5 = gvs.F_H2_3;
  gvs.F_N2_5 = gvs.F_N2_3;
  gvs.F_CH4_5 = gvs.F_CH4_3;

  gvs.F_H2_6 = gvs.F_H2_5 * gvs.R;
  gvs.F_N2_6 = gvs.F_N2_5 * gvs.R;
  gvs.F_CH4_6 = gvs.F_CH4_5 * gvs.R;

  gvs.F_H2_7 = gvs.F_H2_5 * (1 - gvs.R);
  gvs.F_N2_7 = gvs.F_N2_5 * (1 - gvs.R);
  gvs.F_CH4_7 = gvs.F_CH4_5 * (1 - gvs.R);

  iterations++;
  if(iterations < 500) {
    iterate()
  }
}

function calcAll() {
  iterations = 0;
  iterate();
}

module.exports = calcAll;