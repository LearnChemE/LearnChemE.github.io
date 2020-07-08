class Separator {
  constructor() {
    this.columnVolume = 1; // m^3
    this.nV = 16.1886412292951; // moles of vapor in column
    this.nL = 2003.89883140267; // moles of liquid in column
    this.yA = 0.696613452862335; // mole fraction A in vapor
    this.xA = 0.303386547137665; // mole fraction A in liquid
    this.T = 455.361990495356; // Temperature of column
    this.P = 75000; // Pressure in column (Pa)
    this.level = 17.627608479123547; // Liquid level (%)

    /***** USER SPECIFIED *****/
    this.Tin = 400; // Temperature at inlet
    this.xin = 0.5; // mole fraction at inlet
    this.F = 15; // molar flowrate at inlet (mol/s)
    this.autoTemp = false;
    this.autoLevel = false;
    this.autoPressure = false;
    this.speed = 1; // animation speed
    this.codeString = "";

    /**** Control Variables *****/
    this.L = 0.66; // Volumetric flowrate of bottoms (L / sec)
    this.Q = 500000; // heat added
    this.lift = 0.5; // lift of valve

    this.PressureController = {
      auto: false,
      bias: this.lift,
      mv: this.lift,
      Kc: 0,
      Tau: 36000,
      stpt: this.lift,
      tempmv: this.lift,
      tempTau: 36000,
      tempStpt: 75000,
      tempKc: 0,
      error: 0
    };
  
    this.TemperatureController = {
      auto: false,
      bias: this.Q,
      mv: this.Q,
      Kc: 0,
      Tau: 36000,
      stpt: this.Q / 1000,
      tempmv: this.Q,
      tempTau: 36000,
      tempStpt: 500,
      tempKc: 0,
      error: 0
    };
    
    this.LevelController = {
      auto: false,
      bias: this.L,
      mv: this.L,
      Kc: 0,
      Tau: 36000,
      stpt: this.L,
      tempmv: this.L,
      tempTau: 36000,
      tempStpt: 25,
      tempKc: 0,
      error: 0
    };

    /***** Historical Values, 1-D array *****/
    this.Fs = [this.F];
    this.Tins = [this.Tin];
    this.xins = [this.xin];
    this.powers = [this.Q / 1000];
    this.temperatures = [this.T];
    this.Tstpts = [this.TemperatureController.stpt];
    this.levels = [this.level];
    this.flowRatesOut = [this.L];
    this.levelstpts = [this.LevelController.stpt];
    this.pressures = [this.P / 1000];
    this.lifts = [this.lift];
    this.Pstpts = [this.PressureController.stpt];
    this.equations = [""];
    this.TstptScales = [true];
    this.PstptScales = [true];
    this.levelstptScales = [true];

    /***** Coordinates for Above Values, 2-column matrix *****/
    this.powerCoords = [[0, 0]];
    this.temperatureCoords = [[0, 0]];
    this.TstptCoords = [];
    this.liquidLevelCoords = [[0, 0]];
    this.flowRatesOutCoords = [[0, 0]];
    this.levelstptCoords = [];
    this.pressureCoords = [[0, 0]];
    this.liftCoords = [[0, 0]];
    this.PstptCoords = [];

    this.xAxisLimit = 1000;
    this.pressureAxisLimit = 300;

    // Emergency shutoff state
    this.emergency = false;
  }

  advance() {
    const PC = this.PressureController;
    const TC = this.TemperatureController;
    const LC = this.LevelController;

    this.P = this.pressure();

    if(!PC.auto) { PC.stpt = this.lift }

    [this.lift, PC.error] = this.PI({
      Kc: PC.Kc,
      TauI: PC.Tau,
      Bias: PC.bias,
      ProcessVal: this.P,
      MV: this.lift,
      SetPoint: PC.stpt,
      AccumErr: PC.error,
      Auto: PC.auto
    });
    this.lift = Math.min(1, this.lift);
    PC.mv = Number(Number(this.lift).toFixed(2));

    if(!TC.auto) { TC.stpt = this.Q }

    [this.Q, TC.error] = this.PI({
      Kc: TC.Kc,
      TauI: TC.Tau,
      Bias: TC.bias,
      ProcessVal: this.T,
      MV: this.Q,
      SetPoint: TC.stpt,
      AccumErr: TC.error,
      Auto: TC.auto
    });

    this.Q = Math.min(1e6, this.Q);
    TC.mv = this.Q - this.Q % 100;

    this.level = 100 * this.nL / this.density();

    if(this.level >= 95) {this.emergencyShutoff()}

    if(!LC.auto) { LC.stpt = this.L }

    [this.L, LC.error] = this.PI({
      Kc: LC.Kc,
      TauI: LC.Tau,
      Bias: LC.bias,
      ProcessVal: this.level,
      MV: this.L,
      SetPoint: LC.stpt,
      AccumErr: LC.error,
      Auto: LC.auto
    });

    this.L = Math.min(10, this.L);
    LC.mv = Number(Number(this.L).toFixed(2));

    for (let i = 0; i < 4; i++) {
      let dx = this.flash();
      this.nV += 0.25 * dx.dnV;
      this.nL += 0.25 * dx.dnL;
      this.xA += 0.25 * dx.dxA;
      this.yA += 0.25 * dx.dyA;
      this.T += 0.25 * dx.dT;
    }

    this.powers.push(this.Q / 1000);
    this.temperatures.push(this.T);
    this.levels.push(this.level);
    this.flowRatesOut.push(this.L);
    this.pressures.push(this.P / 1000);
    this.lifts.push(this.lift);
    this.Fs.push(this.F);
    this.Tins.push(this.Tin);
    this.xins.push(this.xin);

    if(!TC.auto) { this.Tstpts.push(TC.stpt / 1000) } else { this.Tstpts.push(TC.stpt) }
    if(!PC.auto) { this.Pstpts.push(PC.stpt) } else { this.Pstpts.push(PC.stpt / 1000) }
    this.levelstpts.push(this.LevelController.stpt)

    this.TstptScales.push(!TC.auto);
    this.PstptScales.push(!PC.auto);
    this.levelstptScales.push(!LC.auto);

    this.equations.push(this.codeString);

    if(this.temperatures.length > this.xAxisLimit) { this.powers.shift(); this.temperatures.shift(); this.Tstpts.shift(); this.TstptScales.shift(); this.equations.shift();}
    if(this.levels.length > this.xAxisLimit) { this.levels.shift(); this.flowRatesOut.shift(); this.Pstpts.shift(); this.PstptScales.shift();}
    if(this.pressures.length > this.xAxisLimit) { this.pressures.shift(); this.lifts.shift(); this.levelstpts.shift(); this.levelstptScales.shift();}

    this.updateDOM();

    if(this.emergency) {this.drain(this.level)}
  }

  createCoords() {

    const coords = (arrIn, arrOut) => {
      for (let i = 0; i < arrIn.length; i++) {
        arrOut[i] = [-i, arrIn[arrIn.length - i - 1]];
      };
    };

    // Update axes limits, then convert the values to coordinates, then update the plotted array
    const minMax = (array) => {
      let min = array[0];
      let max = array[0];
      for (let i = 0; i < array.length; i++) {
        min = Math.min(array[i], min);
        max = Math.max(array[i], max);
      }
      if(isNaN(min)) {min = 0}
      if(isNaN(max)) {max = 1}
      return [min, max];
    }

    const TAxisY1 = graphics.TPlot.getOptions().yaxes[0];
    const TAxisY2 = graphics.TPlot.getOptions().yaxes[1];
    const PAxisY1 = graphics.PPlot.getOptions().yaxes[0];
    const PAxisY2 = graphics.PPlot.getOptions().yaxes[1];
    const LAxisY1 = graphics.LPlot.getOptions().yaxes[0];
    const LAxisY2 = graphics.LPlot.getOptions().yaxes[1];

    const minIndex = Math.max(0, this.pressures.length - this.pressureAxisLimit);
    const maxIndex = this.pressures.length;

    let truncatedLifts = this.lifts.slice(minIndex, maxIndex);
    let truncatedPressures = this.pressures.slice(minIndex, maxIndex);

    coords(this.temperatures, this.temperatureCoords);
    coords(this.powers, this.powerCoords);
    coords(this.levels, this.liquidLevelCoords);
    coords(this.flowRatesOut, this.flowRatesOutCoords);
    coords(truncatedLifts, this.liftCoords);
    coords(truncatedPressures, this.pressureCoords);

    let TRange = minMax(this.temperatures);
    const QRange = minMax(this.powers);
    let LRange = minMax(this.levels);
    const BRange = minMax(this.flowRatesOut);
    let PRange = minMax(truncatedPressures);
    const liftRange = minMax(truncatedLifts);

    for(let i = 0; i < this.TstptScales.length; i++) {
      if(!this.TstptScales[i]) {TRange = [ Math.min(this.Tstpts[i], TRange[0]), Math.max(this.Tstpts[i], TRange[1]) ]}
      if(!this.PstptScales[i]) {PRange = [ Math.min(this.Pstpts[i], PRange[0]), Math.max(this.Pstpts[i], PRange[1]) ]}
      if(!this.levelstptScales[i]) {LRange = [ Math.min(this.levelstpts[i], LRange[0]), Math.max(this.levelstpts[i], LRange[1]) ]}
    }

    // const TstptRange = minMax(this.Tstpts);
    // TRange = [Math.min(TstptRange[0], TRange[0]), Math.max(TstptRange[1], TRange[1])];

    // const PstptRange = minMax(this.Pstpts);
    // PRange = [Math.min(PstptRange[0], PRange[0]), Math.max(PstptRange[1], PRange[1])];

    // const levelstptRange = minMax(this.levelstpts);
    // LRange = [Math.min(levelstptRange[0], LRange[0]), Math.max(levelstptRange[1], LRange[1])];

    // The following 7 blocks of code adjust the y-axes based on the minimum and maximum values in each series.

    if(TRange[0] <= TAxisY1.min) { TAxisY1.min = TRange[0] * 0.9 }
    if(TRange[1] >= TAxisY1.max) { TAxisY1.max = TRange[1] * 1.1 }
    if(QRange[0] <= TAxisY2.min) { TAxisY2.min = QRange[0] * 0.9 }
    if(QRange[1] >= TAxisY2.max) { TAxisY2.max = QRange[1] * 1.1 }

    if(TRange[0] / (TAxisY1.min + TAxisY1.max) > 0.5) { TAxisY1.min = TRange[0] * 0.9 }
    if(TRange[1] / (TAxisY1.min + TAxisY1.max) < 0.5) { TAxisY1.max = TRange[1] * 1.1 }
    if(QRange[0] / (TAxisY2.min + TAxisY2.max) > 0.5) { TAxisY2.min = QRange[0] * 0.9 }
    if(QRange[1] / (TAxisY2.min + TAxisY2.max) < 0.5) { TAxisY2.max = QRange[1] * 1.1 }

    if(PRange[0] <= PAxisY1.min) { PAxisY1.min = PRange[0] * 0.9 }
    if(PRange[1] >= PAxisY1.max) { PAxisY1.max = PRange[1] * 1.1 }
    if(liftRange[0] <= PAxisY2.min) { PAxisY2.min = liftRange[0] * 0.9 }
    if(liftRange[1] >= PAxisY2.max) { PAxisY2.max = liftRange[1] * 1.1 }

    if(PRange[0] / (PAxisY1.min + PAxisY1.max) > 0.5) { PAxisY1.min = PRange[0] * 0.9 }
    if(PRange[1] / (PAxisY1.min + PAxisY1.max) < 0.5) { PAxisY1.max = PRange[1] * 1.1 }
    if(liftRange[0] / (PAxisY2.min + PAxisY2.max) > 0.5) { PAxisY2.min = liftRange[0] * 0.9 }
    if(liftRange[1] / (PAxisY2.min + PAxisY2.max) < 0.5) { PAxisY2.max = liftRange[1] * 1.1 }
    
    if(LRange[0] <= LAxisY1.min) { LAxisY1.min = LRange[0] * 0.9 }
    if(LRange[1] >= LAxisY1.max) { LAxisY1.max = LRange[1] * 1.1 }
    if(BRange[0] <= LAxisY2.min) { LAxisY2.min = BRange[0] * 0.9 }
    if(BRange[1] >= LAxisY2.max) { LAxisY2.max = BRange[1] * 1.1 }

    if(LRange[0] / (LAxisY1.min + LAxisY1.max) > 0.5) { LAxisY1.min = LRange[0] * 0.9 }
    if(LRange[1] / (LAxisY1.min + LAxisY1.max) < 0.5) { LAxisY1.max = LRange[1] * 1.1 }
    if(BRange[0] / (LAxisY2.min + LAxisY2.max) > 0.5) { LAxisY2.min = BRange[0] * 0.9 }
    if(BRange[1] / (LAxisY2.min + LAxisY2.max) < 0.5) { LAxisY2.max = BRange[1] * 1.1 }

    const interpolate = (value, y1min, y1max, y2min, y2max) => {
      const out = ((value - y2min) / (y2max - y2min)) * (y1max - y1min) + y1min;
      return out;
    }

    const scaledCoords = (arrIn, arrOut, scaleArr, y1min, y1max, y2min, y2max) => {
      for(let i = 0; i < arrIn.length; i++) {
        if(scaleArr[arrIn.length - i - 1]) { 
          arrOut[i] = [-i, interpolate(arrIn[arrIn.length - i - 1], y1min, y1max, y2min, y2max)];
        } else {
          arrOut[i] = [-i, arrIn[arrIn.length - i - 1]]
        }
      } 
    }

    scaledCoords(this.Tstpts, this.TstptCoords, this.TstptScales, TAxisY1.min, TAxisY1.max, TAxisY2.min, TAxisY2.max);
    scaledCoords(this.Pstpts, this.PstptCoords, this.PstptScales, PAxisY1.min, PAxisY1.max, PAxisY2.min, PAxisY2.max);
    scaledCoords(this.levelstpts, this.levelstptCoords, this.levelstptScales, LAxisY1.min, LAxisY1.max, LAxisY2.min, LAxisY2.max);

    const secondsPassed = this.pressures.length;
    const resizeArray = [60, 120, 200, 300, 400, 500, 1000];
    let xAxisSize = 60;
    for(let i = 0; i < resizeArray.length - 1; i++) {
      if(secondsPassed > resizeArray[i]) {
        xAxisSize = resizeArray[i + 1]
      }
    }
    const xLims = [-xAxisSize, 0];
    const xLimsPressure = [Math.max(-1 * this.pressureAxisLimit, xLims[0]), 0];
    
    graphics.TPlot.getAxes().xaxis.options.min = xLims[0];
    graphics.TPlot.getAxes().xaxis.options.max = xLims[1];
    graphics.PPlot.getAxes().xaxis.options.min = xLimsPressure[0];
    graphics.PPlot.getAxes().xaxis.options.max = xLimsPressure[1];
    graphics.LPlot.getAxes().xaxis.options.min = xLims[0];
    graphics.LPlot.getAxes().xaxis.options.max = xLims[1];

    graphics.TPlot.setData([
      {data : this.TstptCoords, xaxis : 1, yaxis : 1},
      {data : this.temperatureCoords, xaxis : 1, yaxis : 1},
      {data : this.powerCoords,  xaxis : 1, yaxis : 2}
    ]);

    graphics.PPlot.setData([
      {data : this.PstptCoords, xaxis : 1, yaxis : 1},
      {data : this.pressureCoords, xaxis : 1, yaxis : 1},
      {data : this.liftCoords,  xaxis : 1, yaxis : 2}
    ]);

    graphics.LPlot.setData([
      {data : this.levelstptCoords, xaxis : 1, yaxis : 1},
      {data : this.liquidLevelCoords, xaxis : 1, yaxis : 1},
      {data : this.flowRatesOutCoords,  xaxis : 1, yaxis : 2}
    ]);

    graphics.TPlot.setupGrid();
    graphics.PPlot.setupGrid();
    graphics.LPlot.setupGrid();
  }

  // Density of the liquid in column
  density() {
    const rho1 = 10927; // mol/m^3
    const rho2 = 11560;
    const rhoAvg = this.xA * rho1 + rho2 * (1 - this.xA);
    return rhoAvg;
  }

  drain(lvl) {
    if(lvl < 20) {
      this.LevelController.tempmv = 0.66;
      this.PressureController.tempmv = 0.5;
      const iL = document.getElementById("input-lift");
      const iFo = document.getElementById("input-flowRateOut");
      iL.value = "0.5";
      iFo.value = "0.66";
      ["update-PC", "update-LC"].forEach((e) => {
        const button = document.getElementById(e);
        button.click();
      })
      this.emergency = false;
    }
  }

  emergencyShutoff() {
    this.emergency = true;
    const buttons = document.getElementsByClassName('btn manual');
    for(let i = 0; i < buttons.length; i++) {
      buttons[i].click();
    }
    const iL = document.getElementById("input-lift");
    const iFo = document.getElementById("input-flowRateOut");
    const iFi = document.getElementById("input-flowRateIn");
    const iQ = document.getElementById("input-power");
    iL.value = "1";
    iFo.value = "10";
    iFi.value = "15";
    iQ.value = "500";
    this.PressureController.tempmv = 1;
    this.TemperatureController.tempmv = 500000;
    this.LevelController.tempmv = 10;
    ["update-PC", "update-LC", "update-TC", "update-inlet"].forEach((e) => {
      const button = document.getElementById(e);
      button.click();
    })
  }

  flash() {
    const zero = Number.MIN_VALUE;

    this.nV = Math.max(zero, this.nV);
    this.nL = Math.max(zero, this.nL);
    this.yA = Math.min(1, Math.max(zero, this.yA));
    this.xA = Math.min(1, Math.max(zero, this.xA));
    this.T =  Math.max(zero, this.T);
    this.P = this.pressure();

    const D = this.valve(); // distillate flow rate, mol / s
    const B = this.L * this.density() / 1000; // bottoms flow rate, mol / s

    const Cp = 190; // J / mol
    const heatVapA = 43290; // heat of vaporization, J / mol
    const heatVapB = 51000;

    const NA = this.fluxA();
    const NB = this.fluxB();

    let dnV = (NA + NB) - D;
    let dyA = (NA - this.yA * (NA + NB)) / this.nV;
    let dnL = this.F - (NA + NB) - B;
    let dxA = (this.F * (this.xin - this.xA) - NA + this.xA * (NA + NB)) / this.nL;
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
    
    return {
      dnV : d[0],
      dnL : d[1],
      dyA : d[2],
      dxA : d[3],
      dT : d[4]
    }
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

  PI(args) {
    const Kc = args.Kc;
    const tauI = args.TauI;
    const __bias = args.Bias;
    const __pv = args.ProcessVal;
    const __stpt = args.SetPoint;
    let errs = args.AccumErr;
    const __auto = args.Auto;
    let __mv = args.MV;
    const derr = __stpt - __pv;
    errs = errs + derr;
    let dmv = 0;

    const __inputs = [
      "input-temperature",
      "input-temperature-Kc",
      "input-temperature-tau",
      "input-level",
      "input-level-Kc",
      "input-level-tau",
      "input-pressure",
      "input-pressure-Kc",
      "input-pressure-tau",
    ];

    const terminal = document.getElementById("code-output");

    try {

      if(this.codeString === "") {
        function BlankInputException() {
          this.__proto__.name = "BlankInputError";
          this.message = 'Auto mode disabled.';
        }
        throw new BlankInputException()
      }

      const toEval = `dmv = ${this.codeString}`;

      eval(toEval);

      dmv = Number(dmv);

      __mv = Number(__bias) + dmv;

      for(let i = 0; i < __inputs.length; i++) {
        document.getElementById(__inputs[i]).removeAttribute("disabled");
      }
      
      const output = `Valid equation entered:<br>dmv = ${this.codeString}.`;
      terminal.innerHTML = output;

    } catch(e) {
      const errorType = e.__proto__.name;
      const error = `${errorType}:<br>${e.message}`;
      terminal.innerHTML = error;
      if(__auto) {
        const offButtons = document.getElementsByClassName("btn manual");
        for(let i = 0; i < offButtons.length; i++) {
          const button = offButtons[i];
          button.click();
        };
      }
      for(let i = 0; i < __inputs.length; i++) {
        document.getElementById(__inputs[i]).setAttribute("disabled", "true");
      }
    }

    if (!__auto) {
      __mv = __stpt;
      errs = 0;
    }

    __mv = Math.max(1e-12, __mv);
    return [__mv, errs];
  }

  pressure() {
    const R = 8.314;
    let numerator = this.nV * R * this.T;
    let denominator = this.columnVolume - this.nL / this.density();
    denominator = Math.max(denominator, Math.sqrt(Number.MIN_VALUE));
    numerator = Math.max(numerator, Math.sqrt(Number.MIN_VALUE));
    const P = numerator / denominator;
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

  updateDOM() {
    const TemperatureDisplay = document.getElementById("TemperatureTextWrapper").firstElementChild;
    const PressureDisplay = document.getElementById("PressureTextWrapper").firstElementChild;
    const LevelDisplay = document.getElementById("LevelTextWrapper").firstElementChild;
    const LiftDisplay = document.getElementById("input-lift");
    const BottomsDisplay = document.getElementById("input-flowRateOut");
    const PowerDisplay = document.getElementById("input-power");
    const Column = document.getElementById("columnPath");

    const T = Math.round(this.T);
    let red, green, blue;
    if(T > 450) {
      red = 230 + Math.max(0, Math.min(25, 25 * ((T - 450) / 50)));
      green = 230 - (red - 230) * 3;
      blue = 230 - (red - 230) * 3;
    } else {
      blue = 230 + Math.max(0, Math.min(25, 25 * ((450 - T) / 50)));
      green = 230 - (blue - 230);
      red = 230 - (blue - 230);
    }

    const color = `rgb(${red}, ${green}, ${blue})`;
    const P = Number(this.P / 1000).toFixed(1);
    const L = Number(this.level).toPrecision(3);

    const Q = Number(this.Q / 1000).toFixed(1);
    const B = Number(this.L).toPrecision(3);
    const lift = Number(this.lift).toPrecision(3);

    Column.style.fill = color;

    TemperatureDisplay.innerHTML = `${T}&nbsp;K`;
    PressureDisplay.innerHTML = `${P}&nbsp;kPa`;
    LevelDisplay.innerHTML = `${L}&nbsp;%`;

    if(this.TemperatureController.auto) {PowerDisplay.value = `${Q}`}
    if(this.PressureController.auto) {LiftDisplay.value = `${lift}`}
    if(this.LevelController.auto) {BottomsDisplay.value = `${B}`}

    this.adjustLiquidLevel(this.level / 100);
  }

  adjustLiquidLevel(lvl) {
    const actualEmpty = 0.05;
    const actualFull = 0.97;
    const lvlAdj = actualEmpty + (actualFull - actualEmpty) * lvl;
    const ls = document.getElementById("liquidSquiggle");
    const lr = document.getElementById("liquidRect");
    const maxHeight = this.maxLiquidHeight;
    const rectHeightAtLvl = lvlAdj*maxHeight;
    const translateY = maxHeight - rectHeightAtLvl;
    ls.setAttribute("transform", `translate(0, ${translateY})`);
    lr.setAttribute("transform", `translate(0, ${translateY})`);
    lr.setAttribute("height", `${rectHeightAtLvl}`);
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