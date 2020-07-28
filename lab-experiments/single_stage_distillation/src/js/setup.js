function setup(sk, speed) {
  window.graphics = {
    y1Color: 'rgb(0, 0, 0)',
    y2Color: 'rgb(255, 0, 0)',
    y3Color: 'rgb(0, 0, 255)'
  }

  sk.setup = () => {
    require("flot");
    require("./flot.dashes.js");

    const TGraphArea = document.getElementById("TemperatureGraphArea");
    const PGraphArea = document.getElementById("PressureGraphArea");
    const LGraphArea = document.getElementById("LevelGraphArea");
    const plotWidth = TGraphArea.getBoundingClientRect().width;
    const plotHeight = TGraphArea.getBoundingClientRect().height;

    ['TPlot', 'LPlot', 'PPlot'].forEach((id) => {
      const div = document.createElement("div");
      div.id = `${id}`;
      document.body.appendChild(div);
      document.getElementById("main-application-wrapper").appendChild(document.getElementById(id));
      graphics[`${id}`] = jQuery.plot($(`#${id}`), [ [[0, 0], [1, 1]] ], {
        series : { 
          shadowSize: 0
        },
        xaxes: [
          { position: 'bottom', axisLabel : 'time (s)', min: -10, max: 0 },
          { position: 'top', show: true, showTicks: false, showTickLabels: false, gridLines: false}
        ],
        yaxes: [
          { position: 'left', axisLabel : '', color: graphics.y2Color},
          { position: 'right', axisLabel: '', color: graphics.y3Color, show: true, showTicks: true, gridLines: false },
        ],
        colors: [graphics.y1Color, graphics.y2Color, graphics.y3Color]
      });
    });

    // Initialize Each Plot
    const TPlot = graphics.TPlot;
    const PPlot = graphics.PPlot;
    const LPlot = graphics.LPlot;

    const TOpts = TPlot.getOptions();
    const POpts = PPlot.getOptions();
    const LOpts = LPlot.getOptions();
    
    TOpts.series.dashes.show = true;
    POpts.series.dashes.show = true;
    LOpts.series.dashes.show = true;
    TOpts.series.dashes.displayDashesOn = [0];
    POpts.series.dashes.displayDashesOn = [0];
    LOpts.series.dashes.displayDashesOn = [0];

    TOpts.yaxes[0].axisLabel = 'temperature (K)';
    TOpts.yaxes[1].axisLabel = 'heat duty (kW)';
    TOpts.xaxes[1].axisLabel = 'temperature vs. heat duty';
    TPlot.getAxes().yaxis.options.min = 400;
    TPlot.getAxes().yaxis.options.max = 500;
    TPlot.getAxes().y2axis.options.min = 450;
    TPlot.getAxes().y2axis.options.max = 550;

    POpts.yaxes[0].axisLabel = 'pressure (kPa)';
    POpts.yaxes[1].axisLabel = 'valve lift';
    POpts.xaxes[1].axisLabel = 'valve lift vs pressure';
    PPlot.getAxes().yaxis.options.min = 50;
    PPlot.getAxes().yaxis.options.max = 100;
    PPlot.getAxes().y2axis.options.min = 0.3;
    PPlot.getAxes().y2axis.options.max = 0.7;

    LOpts.yaxes[0].axisLabel = 'level (%)';
    LOpts.yaxes[1].axisLabel = 'bottoms flow (L / s)';
    LOpts.xaxes[1].axisLabel = 'level vs. bottoms flow rate';
    LPlot.getAxes().yaxis.options.min = 15;
    LPlot.getAxes().yaxis.options.max = 20;
    LPlot.getAxes().y2axis.options.min = 0.5;
    LPlot.getAxes().y2axis.options.max = 0.72;


    [TPlot, PPlot, LPlot].forEach(plot => {
      plot.getAxes().yaxis.options.autoScale = "none";
      plot.getAxes().y2axis.options.autoScale = "none";
      plot.getAxes().xaxis.options.autoScale = "none";
    })

    window["rippleTimer"] = 0;
    setInterval(() => { window["rippleTimer"] += 1; ripple(window["rippleTimer"])}, 50);
    separator.createCoords();
    sk.windowResized();
    setTimeout(() => {sk.windowResized()}, 2000);
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
    const CodeInputArea = document.getElementById("CodeEntryArea");
    const CodeOutputArea = document.getElementById("TerminalOutputWrapper");

    const TGraph = document.getElementById("TPlot");
    const PGraph = document.getElementById("PPlot");
    const LGraph = document.getElementById("LPlot");
    const TInput = document.getElementById("TC-control");
    const PInput = document.getElementById("PC-control");
    const LInput = document.getElementById("LC-control");
    const InletInput = document.getElementById("inlet-control");
    const SpeedInput = document.getElementById("slider-wrapper");
    const CSVdownload = document.getElementById("csv-wrapper");
    const CodeInput = document.getElementById("code-input-wrapper");
    const CodeOutput = document.getElementById("code-output");

    [
      [TGraph, TGraphArea],
      [PGraph, PGraphArea],
      [LGraph, LGraphArea],
      [TInput, TInputArea],
      [PInput, PInputArea],
      [LInput, LInputArea],
      [InletInput, InletInputArea],
      [SpeedInput, SpeedInputArea],
      [CSVdownload, CSVArea],
      [CodeInput, CodeInputArea],
      [CodeOutput, CodeOutputArea]
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
    });

    [graphics.TPlot, graphics.PPlot, graphics.LPlot].forEach(plot => {
      plot.resize();
      plot.setupGrid();
    });

    const bg = document.getElementById("OutermostWrapperIGuess");
    const codeOutput = document.getElementById("code-output");
    const codeInput = document.getElementById("code-input");
    const height = Number(bg.getBoundingClientRect().height);
    // can't do media queries because size is with respect to SVG height/width, not window height/width
    if(height < 580) {
      codeOutput.style.fontSize = "10px";
      codeOutput.style.padding = "6px";
      codeInput.style.fontSize = "12px";
    } else if(height < 750) {
      codeOutput.style.fontSize = "12px";
      codeOutput.style.padding = "8px";
      codeInput.style.fontSize = "13px";
    } else {
      codeOutput.style.fontSize = "14px";
      codeOutput.style.padding = "10px";
      codeInput.style.fontSize = "15px";
    }
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