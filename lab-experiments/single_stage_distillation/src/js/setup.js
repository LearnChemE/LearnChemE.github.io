function setup(sk, speed) {
  window.graphics = {
    TempColor: 'rgb(255, 0, 0)',
    PowerColor: 'rgb(0, 128, 128)',
    LevelColor: 'rgb(50, 50, 50)',
    FlowrateColor: 'rgb(0, 0, 255)',
    PressureColor: 'rgb(255, 0, 255)',
    LiftColor: 'rgb(0, 220, 0)'
  }

  sk.setup = () => {
    graphics.cnv = sk.createCanvas(1, 1);
    graphics.cnv.hide();
    let plotWidth = 450;
    let plotHeight = 320;
    graphics.bottomLeft = sk.createGraphics(plotWidth, plotHeight);
    graphics.bottomRight = sk.createGraphics(plotWidth, plotHeight);
    graphics.topRight = sk.createGraphics(plotWidth, plotHeight);
    graphics.bottomLeft.id('TPlot');
    graphics.bottomRight.id('LPlot');
    graphics.topRight.id('PPlot');
    ['TPlot', 'LPlot', 'PPlot'].forEach((id) => {
      document.getElementById("main-application-wrapper").appendChild(document.getElementById(id));
    });
    graphics.bottomLeft.show();
    graphics.bottomRight.show();
    graphics.topRight.show();

    // Initialize Each Plot
    graphics.TPlot = new PlotCanvas(graphics.bottomLeft, document.getElementById("TPlot"));
    const TPlot = graphics.TPlot;
    TPlot.xLims = [-1000, 0];
    TPlot.yLims = [400, 600];
    TPlot.rightLims = [400, 600];
    TPlot.xAxisLabel = "time (s)";
    TPlot.yAxisLabel = "temperature (K)";
    TPlot.rightAxisLabel = "power consumption (kW)"
    TPlot.plotTitle = "";
    TPlot.plotSetup();

    graphics.PPlot = new PlotCanvas(graphics.topRight, document.getElementById("PPlot"));
    const PPlot = graphics.PPlot;
    PPlot.xLims = [-120, 0];
    PPlot.yLims = [0, 120];
    PPlot.rightLims = [0.4, 0.6];
    PPlot.xAxisLabel = "time (s)";
    PPlot.yAxisLabel = "pressure (kPa)";
    PPlot.rightAxisLabel = "lift"
    PPlot.plotTitle = "";
    PPlot.plotSetup();

    graphics.LPlot = new PlotCanvas(graphics.bottomRight, document.getElementById("LPlot"));
    const LPlot = graphics.LPlot;
    LPlot.xLims = [-120, 0];
    LPlot.yLims = [0, 100];
    LPlot.rightLims = [0.5, 0.7];
    LPlot.xAxisLabel = "time (s)";
    LPlot.yAxisLabel = "liquid level (%)";
    LPlot.rightAxisLabel = "flow rate (L/s)"
    LPlot.plotTitle = "";
    LPlot.plotSetup();

    const TemperatureArray = new ArrayPlot(separator.temperatureCoords);
    const PowerArray = new ArrayPlot(separator.powerCoords);
    const PressureArray = new ArrayPlot(separator.pressureCoords);
    const LiftArray = new ArrayPlot(separator.liftCoords);
    const LevelArray = new ArrayPlot(separator.liquidLevelCoords);
    const FlowrateArray = new ArrayPlot(separator.flowRateCoords);

    TemperatureArray.lineColor = graphics.TempColor;
    PowerArray.lineColor = graphics.PowerColor;
    PressureArray.lineColor = graphics.PressureColor;
    LiftArray.lineColor = graphics.LiftColor;
    LevelArray.lineColor = graphics.LevelColor;
    FlowrateArray.lineColor = graphics.FlowrateColor;

    TPlot.addFuncs(TemperatureArray, PowerArray);
    PPlot.addFuncs(PressureArray, LiftArray);
    LPlot.addFuncs(LevelArray, FlowrateArray);

    separator.createCoords();

    setupInputs();

    sk.frameRate(speed);
  }
}

function parseNumericInput(value, min, max) {
  let input = Number(value);
  input = Math.max(min, Math.min(max, input));
  return input;
}

function setupInputs() {
  const liftInput = document.getElementById("input-lift");
  const powerInput = document.getElementById("input-power");
  const flowInput = document.getElementById("input-flow");
  const updateLiftButton = document.getElementById("update-lift");
  const updatePowerButton = document.getElementById("update-power");
  const updateFlowButton = document.getElementById("update-flow");

  liftInput.addEventListener('input', () => {
    const inputValue = liftInput.value;
    const min = Number(liftInput.getAttribute("min"));
    const max = Number(liftInput.getAttribute("max"));
    const parsed = parseNumericInput(inputValue, min, max);
    liftInput.value = parsed;
    window.userInputs.PressureController.lift = parsed;
  });

  powerInput.addEventListener('input', () => {
    const inputValue = powerInput.value;
    const min = Number(powerInput.getAttribute("min"));
    const max = Number(powerInput.getAttribute("max"));
    const parsed = parseNumericInput(inputValue, min, max);
    powerInput.value = parsed;
    window.userInputs.TemperatureController.power = parsed;
  });

  flowInput.addEventListener('input', () => {
    const inputValue = flowInput.value;
    const min = Number(flowInput.getAttribute("min"));
    const max = Number(flowInput.getAttribute("max"));
    const parsed = parseNumericInput(inputValue, min, max);
    flowInput.value = parsed;
    window.userInputs.LevelController.flowRate = parsed;
  });

  updateLiftButton.addEventListener('click', () => {separator.lift = window.userInputs.PressureController.lift});
  updatePowerButton.addEventListener('click', () => {separator.Q = window.userInputs.TemperatureController.power});
  updateFlowButton.addEventListener('click', () => {separator.L = window.userInputs.LevelController.flowRate});
}

module.exports = setup;