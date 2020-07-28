function setup(sk, speed) {
  window.graphics = {
    TempColor: 'rgb(255, 0, 0)',
    PowerColor: 'rgb(0, 0, 255)',
    LevelColor: 'rgb(255, 0, 0)',
    FlowrateColor: 'rgb(0, 0, 255)',
    PressureColor: 'rgb(255, 0, 0)',
    LiftColor: 'rgb(0, 0, 255)'
  }

  sk.setup = () => {
    graphics.cnv = sk.createCanvas(1, 1);
    graphics.cnv.hide();
    let plotWidth = 350;
    let plotHeight = 240;
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
    TPlot.xLims = [-60, 0];
    TPlot.yLims = [400, 600];
    TPlot.rightLims = [400, 600];
    TPlot.xAxisLabel = "time (s)";
    TPlot.yAxisLabel = "temperature (K)";
    TPlot.rightAxisLabel = "power consumption (kW)"
    TPlot.plotTitle = "Temperature vs. power consumption";
    TPlot.yAxisColor = graphics.TempColor;
    TPlot.rightAxisColor = graphics.PowerColor;
    TPlot.plotSetup();

    graphics.PPlot = new PlotCanvas(graphics.topRight, document.getElementById("PPlot"));
    const PPlot = graphics.PPlot;
    PPlot.xLims = [-60, 0];
    PPlot.yLims = [0, 120];
    PPlot.rightLims = [0.4, 0.6];
    PPlot.xAxisLabel = "time (s)";
    PPlot.yAxisLabel = "pressure (kPa)";
    PPlot.rightAxisLabel = "lift"
    PPlot.plotTitle = "Pressure vs. valve lift";
    PPlot.yAxisColor = graphics.PressureColor;
    PPlot.rightAxisColor = graphics.LiftColor;
    PPlot.plotSetup();

    graphics.LPlot = new PlotCanvas(graphics.bottomRight, document.getElementById("LPlot"));
    const LPlot = graphics.LPlot;
    LPlot.xLims = [-60, 0];
    LPlot.yLims = [0, 100];
    LPlot.rightLims = [0.5, 0.7];
    LPlot.xAxisLabel = "time (s)";
    LPlot.yAxisLabel = "liquid level (%)";
    LPlot.rightAxisLabel = "flow rate (L/s)"
    LPlot.plotTitle = "Liquid level vs. bottoms flow rate";
    LPlot.yAxisColor = graphics.LevelColor;
    LPlot.rightAxisColor = graphics.FlowrateColor;
    LPlot.plotSetup();

    const TemperatureArray = new ArrayPlot(separator.temperatureCoords);
    const PowerArray = new ArrayPlot(separator.powerCoords);
    const PressureArray = new ArrayPlot(separator.pressureCoords);
    const LiftArray = new ArrayPlot(separator.liftCoords);
    const LevelArray = new ArrayPlot(separator.liquidLevelCoords);
    const FlowrateArray = new ArrayPlot(separator.flowRatesOutCoords);

    TemperatureArray.lineColor = graphics.TempColor;
    PowerArray.lineColor = graphics.PowerColor;
    PressureArray.lineColor = graphics.PressureColor;
    LiftArray.lineColor = graphics.LiftColor;
    LevelArray.lineColor = graphics.LevelColor;
    FlowrateArray.lineColor = graphics.FlowrateColor;

    TPlot.addFuncs(TemperatureArray, PowerArray);
    PPlot.addFuncs(PressureArray, LiftArray);
    LPlot.addFuncs(LevelArray, FlowrateArray);
    window["rippleTimer"] = 0;
    setInterval(() => { window["rippleTimer"] += 1; ripple(window["rippleTimer"])}, 50);
    separator.createCoords();
    sk.windowResized();
    setInterval(() => {sk.windowResized()}, 5000);
    separator.maxLiquidHeight = Number(document.getElementById("liquidRect").getAttribute("height"));
    window.adjustSpeed = (sp) => {sk.frameRate(sp)}
    sk.frameRate(60);
    sk.noCanvas();
  }

  sk.windowResized = () => {
    const TGraphArea = document.getElementById("TemperatureGraphArea");
    const PGraphArea = document.getElementById("PressureGraphArea");
    const LGraphArea = document.getElementById("LevelGraphArea");
    const TInputArea = document.getElementById("TCInputArea");
    const PInputArea = document.getElementById("PCInputArea");
    const LInputArea = document.getElementById("LCInputArea");
    const InletInputArea = document.getElementById("InletInputArea");
    const SpeedInputArea = document.getElementById("SpeedInputArea");
    const CSVArea = document.getElementById("csvDownloadArea");

    const TGraph = document.getElementById("TPlot");
    const PGraph = document.getElementById("PPlot");
    const LGraph = document.getElementById("LPlot");
    const TInput = document.getElementById("TC-control");
    const PInput = document.getElementById("PC-control");
    const LInput = document.getElementById("LC-control");
    const InletInput = document.getElementById("inlet-control");
    const SpeedInput = document.getElementById("slider-wrapper");
    const CSVdownload = document.getElementById("csv-wrapper");

    [
      [TGraph, TGraphArea],
      [PGraph, PGraphArea],
      [LGraph, LGraphArea],
      [TInput, TInputArea],
      [PInput, PInputArea],
      [LInput, LInputArea],
      [InletInput, InletInputArea],
      [SpeedInput, SpeedInputArea],
      [CSVdownload, CSVArea]
    ].forEach(pair => {
      const rect = pair[1].getBoundingClientRect();
      const x = rect.x;
      const y = rect.y;
      const width = rect.width;
      const height = rect.height;

      pair[0].style.left = `${x}px`;
      pair[0].style.top = `${y}px`;
      pair[0].style.width = `${width}px`;
      pair[0].style.height = `${height}px`;
    })
  }
}

function ripple(t) {
  const ls = document.getElementById("liquidSquiggle");
  const width = 77.514;
  let lines = "";
  const resolution = 30;
  const dx = width / resolution;
  let x = 0;
  for(let i = 0; i < resolution; i++) {
    x += dx;
    const dy = 0.5 * Math.sin(x * 6 * Math.PI / width + t / 11) + 0.45 * Math.sin(x * 5 * Math.PI / width + t / 14) + 0.35 * Math.sin(x * 2.5 * Math.PI / width + t / 8);
    lines += `-${dx},${dy} `;
  }
  const path = `
  m 320.032,100.18395
  h 38.7568 38.7572
  v -9.532082
  l ${lines}
  z
  `;
  ls.setAttribute("d", path);
}

module.exports = setup;