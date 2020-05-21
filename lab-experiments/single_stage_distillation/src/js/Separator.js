class Separator {
  constructor() {
    this.columnVolume = 1; // m^3
  }

  // Density of the liquid in column
  density(xA) {
    const rho1 = 10927; // mol/m^3
    const rho2 = 11560;
    const rhoAvg = xA * rho1 + rho2 * (1 - xA);
    return rhoAvg;
  }

  flash(states, inputs) {
    states.nV = Math.max(0, states.nV);
    states.nL = Math.max(0, states.nL);
    states.yA = Math.min(1, Math.max(0, states.yA));
    states.xA = Math.min(1, Math.max(0, states.xA));
    states.T =  Math.max(0, states.T);
    const nV = states.nV;
    const nL = states.nL;
    const yA = states.yA;
    const xA = states.xA;
    const T = states.T;
    const lift = inputs.lift;
    const L = inputs.L * density(xA) / 1000; // bottoms flow rate, m^3 / s
    const F = inputs.F;
    const Q = inputs.Q;
    const xin = inputs.xin;
    const Tin = inputs.Tin;
    const V = valve(states, lift); // vapor flow rate, 
    const Cp = 190; // kJ / mol?
    const heatVapA = 43290; // heat of vaporization, kJ / mol?
    const heatVapB = 51000;
    const P = pressure(T, nV, nL, xA);
    const NA = fluxA(yA, xA, nL, pSatA(T), P);
    const NB = fluxB(yA, xA, nL, pSatB(T), P);

    let dnV = (NA + NB) - V;
    let dnL = F - (NA + NB) - L;
    let dyA = (NA - yA * V) / nV; // modified from original equation to make sense
    let dxA = (F * xin - NA - V * xA) / nL; // modified from original equation to make sense
    let dT = (Cp * F * ( Tin - T ) + Q - heatVapA * NA - heatVapB * NB) / ( Cp * (nV + nL) );


    [[nV, dnV], [nL, dnL], [yA, dyA], [xA, dxA], [T, dT]].forEach((pair, i) => {
      if(pair[0] + pair[1] < 0) {
        
      }
    })
  }

  // Molar flow rate of A from liquid to vapor
  fluxA(yA, xA, nL, pSatA, P) {
    const KA = 10; // mol / (sec*m^2)
    const A = 5; // m^2 / m^2
    const NA = xA * KA * A * (pSatA * xA / P - yA) * nL / density(xA);
    return NA;
  }

  // Molar flow rate of B from liquid to vapor
  fluxB(yA, xA, nL, pSatB, P) {
    const KB = 6; // mol / (sec*m^2)
    const A = 5; // m^2 / m^2
    const NB = (1 - xA) * KB * A * (pSatB * (1 - xA) / P - (1 - yA)) * nL / density(xA);
    return NB;
  }

  pressure(T, nV, nL, xA) {
    const R = 8.314;
    const P = nV * R * T / (this.columnVolume - nL / density(xA));
    return P;
  }

  pSatA(T) {
    const A = 4.39031;
    const B = 1254.502;
    const C = -105.246;
    const pSat = 101325 * 10 ** (A - B / (T + C));
    return pSat;
  }

  pSatB(T) {
    const A = 4.34541;
    const B = 1661.858;
    const C = -74.048;
    const pSat = 101325 * 10 ** (A - B / (T + C));
    return pSat;
  }

  valve(states, lift) {
    // returns volumetric flowrate through distillate valve
    const V = 0.058834841 * lift * Math.sqrt(pressure(states.T, states.nV, states.nL, states.xA) - 10000);
    return V;
  }
}

function separator(speed) {

}

module.exports = separator;