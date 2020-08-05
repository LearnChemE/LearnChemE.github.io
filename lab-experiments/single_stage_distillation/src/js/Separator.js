const Separator = require("../../../single_stage_manualonly/src/js/shared_separator");

class AutoSeparator extends Separator {
  constructor() {
    super();

    this.codeString = "";

    this.Tstpts = [this.TemperatureController.stpt];
    this.levelstpts = [this.LevelController.stpt];
    this.Pstpts = [this.PressureController.stpt];
    this.equations = [""];
    this.TstptScales = [true];
    this.PstptScales = [true];
    this.levelstptScales = [true];

    this.TstptCoords = [];
    this.levelstptCoords = [];
    this.PstptCoords = [];

  }

  advance() {
    this.advance_proto();

    const PC = this.PressureController;
    const TC = this.TemperatureController;
    const LC = this.LevelController;

    if(!TC.auto) { this.Tstpts.push(TC.stpt / 1000) } else { this.Tstpts.push(TC.stpt) }
    if(!PC.auto) { this.Pstpts.push(PC.stpt) } else { this.Pstpts.push(PC.stpt / 1000) }
    this.levelstpts.push(this.LevelController.stpt)

    this.TstptScales.push(!TC.auto);
    this.PstptScales.push(!PC.auto);
    this.levelstptScales.push(!LC.auto);

    this.equations.push(this.codeString);

    this.truncateArrays();

    if(this.temperatures.length > this.xAxisLimit) {
      this.Tstpts.shift();
      this.TstptScales.shift();
      this.equations.shift();
    }
    
    if(this.pressures.length > this.xAxisLimit) {
      this.Pstpts.shift();
      this.PstptScales.shift();
    }

    if(this.levels.length > this.xAxisLimit) {
      this.levelstpts.shift();
      this.levelstptScales.shift();
    }

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
        const inp = document.getElementById(__inputs[i]);
        inp.removeAttribute("disabled");
        inp.parentElement.classList.remove("disabled");
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
        const inp = document.getElementById(__inputs[i]);
        inp.setAttribute("disabled", "true");
        inp.parentElement.classList.add("disabled")
      }
    }

    if (!__auto) {
      __mv = __stpt;
      errs = 0;
    }

    __mv = Math.max(1e-12, __mv);
    return [__mv, errs];
  }

}

function separator() {
  return new AutoSeparator();
}

module.exports = separator;