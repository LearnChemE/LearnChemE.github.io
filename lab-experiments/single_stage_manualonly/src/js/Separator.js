const Separator = require("./shared_separator");

class ManualSeparator extends Separator {
  constructor() {
    super();
  }

  advance() {
    this.advance_proto();
    this.truncateArrays();
    this.updateDOM();
    if(this.emergency) {this.drain(this.level)}
  }

  // createCoords() {
  //   // Multfactor is because y-coordinates are drawn according to left axis, not right
  //   const map = (y1axes, y2axes, value) => {
  //     const frac = (value - y2axes[0]) / (y2axes[1] - y2axes[0]);
  //     const mappedValue = frac * (y1axes[1] - y1axes[0]) + y1axes[0];
  //     return mappedValue;
  //   };

  //   const minMax = (array) => {
  //     let min = array[0];
  //     let max = array[0];
  //     for (let i = 0; i < array.length; i++) {
  //       min = Math.min(array[i], min);
  //       max = Math.max(array[i], max);
  //     }
  //     min *= 0.9;
  //     max *= 1.1;
  //     return [min, max];
  //   }

  //   const coords = (arrIn, arrOut, y1Axes, y2Axes, useMap) => {
  //     let arr = [];
  //     if(useMap) {
  //       for (let i = 0; i < arrIn.length; i++) {
  //         arrOut[i] = [-i, map(y1Axes, y2Axes, arrIn[arrIn.length - i - 1])];
  //       };
  //     } else {
  //       for (let i = 0; i < arrIn.length; i++) {
  //         arrOut[i] = [-i, arrIn[arrIn.length - i - 1]];
  //       };
  //     }
  //   };

  //   // Update axes limits, then convert the values to coordinates, then update the plotted array

  //   let tempMinMax = minMax(this.temperatures);
  //   tempMinMax[0] -= tempMinMax[0] % 10;
  //   tempMinMax[1] += (10 - tempMinMax[1] % 10);
  //   graphics.TPlot.yLims = tempMinMax;
  //   coords(this.temperatures, this.temperatureCoords, 0, 0, false);
  //   graphics.TPlot.funcs[0].update(this.temperatureCoords);

  //   let powerMinMax = minMax(this.powers);
  //   powerMinMax[0] -= powerMinMax[0] % 10; // round down to nearest 10
  //   powerMinMax[1] += (10 - powerMinMax[1] % 10); // round up to nearest 10
  //   graphics.TPlot.rightLims = powerMinMax;
  //   coords(this.powers, this.powerCoords, graphics.TPlot.yLims, graphics.TPlot.rightLims, true);
  //   graphics.TPlot.funcs[1].update(this.powerCoords);

  //   let levelMinMax = minMax(this.levels);
  //   levelMinMax[0] -= levelMinMax[0] % 1;
  //   levelMinMax[1] += (1 - levelMinMax[1] % 1);
  //   graphics.LPlot.yLims = levelMinMax;
  //   coords(this.levels, this.liquidLevelCoords, 0, 0, false);
  //   graphics.LPlot.funcs[0].update(this.liquidLevelCoords);

  //   let flowRateOutMinMax = minMax(this.flowRatesOut);
  //   flowRateOutMinMax[0] -= flowRateOutMinMax[0] % 0.01;
  //   flowRateOutMinMax[1] += (0.01 - flowRateOutMinMax[1] % 0.01);
  //   graphics.LPlot.rightLims = flowRateOutMinMax;
  //   coords(this.flowRatesOut, this.flowRatesOutCoords, graphics.LPlot.yLims, graphics.LPlot.rightLims, true);
  //   graphics.LPlot.funcs[1].update(this.flowRatesOutCoords);

  //   const minIndex = Math.max(0, this.pressures.length - this.pressureAxisLimit);
  //   const maxIndex = this.pressures.length;

  //   let truncatedPressures = this.pressures.slice(minIndex, maxIndex);
  //   let pressureMinMax = minMax(truncatedPressures);
  //   pressureMinMax[0] -= pressureMinMax[0] % 1;
  //   pressureMinMax[1] += (1 - pressureMinMax[1] % 1);
  //   graphics.PPlot.yLims = pressureMinMax;
  //   coords(truncatedPressures, this.pressureCoords, 0, 0, false);
  //   graphics.PPlot.funcs[0].update(this.pressureCoords);

  //   let truncatedLifts = this.lifts.slice(minIndex, maxIndex);
  //   let liftMinMax = minMax(truncatedLifts);
  //   liftMinMax[0] -= liftMinMax[0] % 0.01;
  //   liftMinMax[1] += (0.01 - liftMinMax[1] % 0.01);
  //   graphics.PPlot.rightLims = liftMinMax;
  //   coords(truncatedLifts, this.liftCoords, graphics.PPlot.yLims, graphics.PPlot.rightLims, true);
  //   graphics.PPlot.funcs[1].update(this.liftCoords);

  //   const secondsPassed = this.pressures.length;
  //   const resizeArray = [60, 120, 200, 300, 400, 500, 1000];
  //   let xAxisSize = 60;
  //   for(let i = 0; i < resizeArray.length - 1; i++) {
  //     if(secondsPassed > resizeArray[i]) {
  //       xAxisSize = resizeArray[i + 1]
  //     }
  //   }
  //   const xLims = [-xAxisSize, 0];
  //   const xLimsPressure = [Math.max(-1 * this.pressureAxisLimit, xLims[0]), 0];
  //   graphics.TPlot.xLims = xLims;
  //   graphics.PPlot.xLims = xLimsPressure;
  //   graphics.LPlot.xLims = xLims;
  // }

  PI(args) {
    const Kc = args.Kc;
    const TauI = args.TauI;
    const bias = args.Bias;
    const pv = args.ProcessVal;
    const stpt = args.SetPoint;
    let errs = args.AccumErr;
    const auto = args.Auto;
    let mv = args.MV;
    let dmv = 0;

    const err = stpt - pv;
    errs = errs + err;

    if (!auto) {
      mv = stpt;
      errs = 0;
    }

    mv = Math.max(Number.MIN_VALUE, mv);
    return [mv, errs];
  }

}

function separator() {
  return new ManualSeparator();
}

module.exports = separator;