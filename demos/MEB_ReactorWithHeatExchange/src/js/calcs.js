// aceetylene constants
function c_A(T) {
  if(T < 1100) {
    return [
      40.68697,
      40.73279,
      -16.17840,
      3.669741,
      -0.658411,
      210.7067,
      235.0052,
      226.7314,
    ]	
  } else {
    return [
      67.47244,
      11.75110,
      -2.021470,
      0.136195,
      -9.806418,
      185.4550,
      253.5337,
      226.7314,
    ]	
  }
}

// hydrogen constants
function c_H(T) {
  if(T < 1000) {
    return [
      33.066178,
      -11.363417,
      11.432816,
      -2.772874,
      -0.158558,
      -9.980797,
      172.707974,
      0.0,
    ]	
  } else if(T < 2500) {
    return [
      18.563083,
      12.257357,
      -2.859786,
      0.268238,
      1.977990,
      -1.147438,
      156.288133,
      0.0,
    ]	
  } else {
    return [
      43.413560,
      -4.293079,
      1.272428,
      -0.096876,
      -20.533862,
      -38.515158,
      162.081354,
      0.0,
    ]	
  }
}

// ethylene constants
function c_E(T) {
  if(T < 1200) {
    return [
      -6.387880,
      184.4019,
      -112.9718,
      28.49593,
      0.315540,
      48.17332,
      163.1568,
      52.46694,
    ]	
  } else {
    return [
      106.5104,
      13.73260,
      -2.628481,
      0.174595,
      -26.14469,
      -35.36237,
      275.0424,
      52.46694,
    ]	
  }
}

// nitrogen constants
function c_N(T) {
  if(T < 500) {
    return [
      28.98641,
      1.853978,
      -9.647459,
      16.63537,
      0.000117,
      -8.671914,
      226.4168,
      0.0,
    ]	
  } else if(T < 2000) {
    return [
      19.50583,
      19.88705,
      -8.598535,
      1.369784,
      0.527601,
      -4.935202,
      212.3900,
      0.0,
    ]	
  } else {
    return [
      35.51872,
      1.128728,
      -0.196103,
      0.014662,
      -4.553760,
      -18.97091,
      224.9810,
      0.0,
    ]
  }
}

// enthalpy as a function of Shomate Equation constants and temperature (Celsius)
function H(c, T) {
  const t = (T + 273.15) / 1000;
  return -1000 * (c[0]*t + c[1]*t**2 / 2 + c[2]*t**3 / 3 + c[3]*t**4 / 4 - c[4] / t + c[5])
}

gvs.Hrxn = H(c_A(25), 25) + H(c_H(25), 25) - H(c_E(25), 25);

function calcAll(p) {
  if(gvs.mode == "choose temperature") {
    let difference = 1e12;
    for(let X = 0; X < 5000; X++) {
      const heat = X * gvs.Hrxn;
    }
    
  } else if(gvs.mode == "choose extent") {

  }
}

module.exports = calcAll;