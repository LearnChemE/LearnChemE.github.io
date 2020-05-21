class Separator {
  constructor() {
    this.columnVolume = 1; // m^3
    this.nV = 16.1886412292951; // moles of vapor in column
    this.nL = 2003.89883140267; // moles of liquid in column
    this.yA = 0.696613452862335; // mole fraction A in vapor
    this.xA = 0.303386547137665; // mole fraction A in liquid
    this.T = 455.361990495356; // Temperature of column
    this.P = 75000; // Pressure in column (Pa)

    /***** USER SPECIFIED *****/
    this.Tin = 400; // Temperature at inlet
    this.xin = 0.5; // mole fraction at inlet
    this.F = 15; // molar flowrate at inlet (mol/s)
    this.autoTemp = false;
    this.autoLevel = false;
    this.autoPressure = false;

    /**** Control Variables *****/
    this.L = 0.6597; // Volumetric flowrate of bottoms (L / sec)
    this.Q = 500000; // heat added
    this.lift = 0.5; // lift of valve

    /***** Historical Values, 1-D array *****/
    this.powers = [this.Q / 1000];
    this.temperatures = [this.T];
    this.liquidLevels = [this.nL / this.density()];
    this.flowRates = [this.L];
    this.pressures = [this.P / 1000];
    this.lifts = [this.lift];

    /***** Coordinates for Above Values, 2-column matrix *****/
    this.powerCoords = [[0, 0]];
    this.temperatureCoords = [[0, 0]];
    this.liquidLevelCoords = [[0, 0]];
    this.flowRateCoords = [[0, 0]];
    this.pressureCoords = [[0, 0]];
    this.liftCoords = [[0, 0]];

  }

  advance() {
    this.flash();
    this.powers.push(this.Q / 1000);
    this.temperatures.push(this.T);
    this.liquidLevels.push(this.nL / this.density());
    this.flowRates.push(this.L);
    this.pressures.push(this.P / 1000);
    this.lifts.push(this.lift);

    if(this.temperatures.length > Math.abs(graphics.TPlot.xLims[0])) { this.powers.shift(); this.temperatures.shift(); }
    if(this.liquidLevels.length > Math.abs(graphics.LPlot.xLims[0])) { this.liquidLevels.shift(); this.flowRates.shift(); }
    if(this.pressures.length > Math.abs(graphics.PPlot.xLims[0])) { this.pressures.shift(); this.lifts.shift(); }
  }

  createCoords() {
    // Multfactor is because y-coordinates are drawn according to left axis, not right
    const map = (y1axes, y2axes, value) => {
      const frac = (value - y2axes[0]) / (y2axes[1] - y2axes[0]);
      const mappedValue = frac * (y1axes[1] - y1axes[0]) + y1axes[0];
      return mappedValue;
    };

    const coords = (arrIn, arrOut, y1Axes, y2Axes, useMap) => {
      let arr = [];
      if(useMap) {
        for (let i = 0; i < arrIn.length; i++) {
          arrOut[i] = [-i, map(y1Axes, y2Axes, arrIn[arrIn.length - i - 1])];
        };
      } else {
        for (let i = 0; i < arrIn.length; i++) {
          arrOut[i] = [-i, arrIn[arrIn.length - i - 1]];
        };
      }
    };

    coords(this.powers, this.powerCoords, graphics.TPlot.yLims, graphics.TPlot.rightLims, true);
    graphics.TPlot.funcs[0].update(this.powerCoords);

    coords(this.flowRates, this.flowRateCoords, graphics.LPlot.yLims, graphics.LPlot.rightLims, true);
    graphics.LPlot.funcs[1].update(this.flowRateCoords);

    coords(this.lifts, this.liftCoords, graphics.PPlot.yLims, graphics.PPlot.rightLims, true);
    graphics.PPlot.funcs[1].update(this.liftCoords);

    coords(this.temperatures, this.temperatureCoords, 0, 0, false);
    graphics.TPlot.funcs[1].update(this.temperatureCoords);

    coords(this.liquidLevels, this.liquidLevelCoords, [0, 100], [0, 1], true); // fraction to percent
    graphics.LPlot.funcs[0].update(this.liquidLevelCoords);

    coords(this.pressures, this.pressureCoords, 0, 0, false);
    graphics.PPlot.funcs[0].update(this.pressureCoords);

  }

  // Density of the liquid in column
  density() {
    const rho1 = 10927; // mol/m^3
    const rho2 = 11560;
    const rhoAvg = this.xA * rho1 + rho2 * (1 - this.xA);
    return rhoAvg;
  }

  flash() {
    const zero = Number.MIN_VALUE;

    this.nV = Math.max(zero, this.nV);
    this.nL = Math.max(zero, this.nL);
    this.yA = Math.min(1, Math.max(zero, this.yA));
    this.xA = Math.min(1, Math.max(zero, this.xA));
    this.T =  Math.max(zero, this.T);
    this.P = this.pressure();

    const B = this.L * this.density() / 1000; // bottoms flow rate, mol / s
    const D = this.valve(); // distillate flow rate, mol / s

    const Cp = 190; // J / mol
    const heatVapA = 43290; // heat of vaporization, J / mol
    const heatVapB = 51000;

    const NA = this.fluxA();
    const NB = this.fluxB();

    let dnV = (NA + NB) - D;
    let dnL = this.F - (NA + NB) - B;
    let dyA = (NA - this.yA * D) / this.nV; // modified from original equation to make sense
    let dxA = (this.F * this.xin - NA - B * this.xA) / this.nL; // modified from original equation to make sense
    let dT = (Cp * this.F * ( this.Tin - this.T ) + this.Q - heatVapA * NA - heatVapB * NB) / ( Cp * (this.nV + this.nL) );

    let d = [];
    // No values can go below 0; xA and yA must be less than 1
    [[this.nV, dnV], [this.nL, dnL], [this.yA, dyA], [this.xA, dxA], [this.T, dT]].forEach((pair, i) => {
      let d0;
      if(pair[0] + pair[1] < zero) {
        d0 = 0;
      } else { d0 = pair[1] }
      if(i == 2 || i == 3) {
        if(pair[0] + pair[1] > 1) {
          d0 = 0;
        } else {
          d0 = pair[1]
        }
      }
      d.push(d0);
    });
    
    this.nV += d[0];
    this.nL += d[1];
    this.yA += d[2];
    this.xA += d[3];
    this.T += d[4];
  }

  // Molar flow rate of A from liquid to vapor
  fluxA() {
    const KA = 10; // mol / (sec*m^2)
    const A = 5; // m^2 / m^2
    const NA = this.xA * KA * A * (this.pSatA() * this.xA / this.P - this.yA) * this.nL / this.density();
    return NA;
  }

  // Molar flow rate of B from liquid to vapor
  fluxB() {
    const KB = 6; // mol / (sec*m^2)
    const A = 5; // m^2 / m^2
    const NB = (1 - this.xA) * KB * A * (this.pSatB() * (1 - this.xA) / this.P - (1 - this.yA)) * this.nL / this.density();
    return NB;
  }

  pressure() {
    const R = 8.314;
    const P = this.nV * R * this.T / (this.columnVolume - this.nL / this.density());
    return P;
  }

  pSatA() {
    const A = 4.39031;
    const B = 1254.502;
    const C = -105.246;
    const pSat = 101325 * 10 ** (A - B / (this.T + C));
    return pSat;
  }

  pSatB() {
    const A = 4.34541;
    const B = 1661.858;
    const C = -74.048;
    const pSat = 101325 * 10 ** (A - B / (this.T + C));
    return pSat;
  }

  valve() {
    // returns molar flowrate of distillate (mol / s)
    const D = 0.058834841 * this.lift * Math.sqrt(this.pressure() - 10000);
    return D;
  }
}

function separator(speed) {
  return new Separator();
}

module.exports = separator;