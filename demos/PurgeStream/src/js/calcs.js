let iterations = 0;

  // X : 0.20,
  // R : 0.03,
  // F_H2_1 : 74.1,
  // F_N2_1 : 24.90,
  // F_CH4_1 : 1.20,
  // F_H2_2 : 330.8,
  // F_N2_2 : 111.2,
  // F_CH4_2 : 40.0,
  // F_H2_3 : 264.6,
  // F_N2_3 : 88.9,
  // F_CH4_3 : 40.0,
  // F_NH3_3 : 44.5,
  // N_NH3_4 : 44.5,
  // F_H2_5 : 264.6,
  // F_N2_5 : 88.9,
  // F_CH4_5 : 40.0,
  // F_H2_6 : 7.94,
  // F_N2_6 : 2.67,
  // F_CH4_6 : 1.20,
  // F_H2_7 : 256.7,
  // F_N2_7 : 86.3,
  // F_CH4_7 : 38.8,

function iterate() {
  


  iterations++;
  if(iterations < 100) {
    iterate()
  }
}

function calcAll() {
  iterations = 0;
  iterate();
}

module.exports = calcAll;