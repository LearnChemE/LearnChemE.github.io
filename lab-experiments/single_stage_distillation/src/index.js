import './style/style.scss';
import * as p5 from 'p5'; // a glorified while loop
window.p5 = p5;
import './grafica/grafica.js';
import './grafica/plotFunctions.js';


/******** ADD HTML FROM HTML FOLDER ********/
const html = require('./html/main.html').toString();
const doc = document.createElement('div');
doc.id = "main-application-wrapper";
doc.innerHTML = html;
document.body.appendChild(doc);

const Separator = require('./js/Separator.js');

let separator = new Separator();

let x = [0, 0, 1, 2];
let y = [450, 450, 450, 450];

let TPlot, PPlot, LPlot; // Temperature plot, Pressure Plot, Level Plot
let bottomLeft, topRight, bottomRight;

let animation = (sk) => {
  sk.setup = () => {
    let cnv = sk.createCanvas(1, 1);
    cnv.hide();
    let plotWidth = 450;
    let plotHeight = 320;
    bottomLeft = sk.createGraphics(plotWidth, plotHeight);
    bottomRight = sk.createGraphics(plotWidth, plotHeight);
    topRight = sk.createGraphics(plotWidth, plotHeight);
    bottomLeft.id('TPlot');
    bottomRight.id('LPlot');
    topRight.id('PPlot');
    ['TPlot', 'LPlot', 'PPlot'].forEach((id) => {
      document.getElementById("main-application-wrapper").appendChild(document.getElementById(id));
    });
    bottomLeft.show();
    bottomRight.show();
    topRight.show();

    // Initialize Each Plot
    TPlot = new PlotCanvas(bottomLeft, document.getElementById("TPlot"));
    TPlot.xLims = [-1000, 0];
    TPlot.yLims = [400, 600];
    TPlot.rightLims = [400, 600];
    TPlot.xAxisLabel = "time (s)";
    TPlot.yAxisLabel = "temperature (K)";
    TPlot.rightAxisLabel = "power consumption (kW)"
    TPlot.plotTitle = "";
    TPlot.plotSetup();

    PPlot = new PlotCanvas(topRight, document.getElementById("PPlot"));
    PPlot.xLims = [-120, 0];
    PPlot.yLims = [400, 600];
    PPlot.rightLims = [0.4, 0.6];
    PPlot.xAxisLabel = "time (s)";
    PPlot.yAxisLabel = "pressure (Pa)";
    PPlot.rightAxisLabel = "lift"
    PPlot.plotTitle = "";
    PPlot.plotSetup();

    LPlot = new PlotCanvas(bottomRight, document.getElementById("LPlot"));
    LPlot.xLims = [-120, 0];
    LPlot.yLims = [0, 100];
    LPlot.rightLims = [4, 6];
    LPlot.xAxisLabel = "time (s)";
    LPlot.yAxisLabel = "liquid level (%)";
    LPlot.rightAxisLabel = "flow rate (L/s)"
    LPlot.plotTitle = "";
    LPlot.plotSetup();

    sk.frameRate(2);
  }
  
  sk.draw = () => {
    x.push(sk.frameCount);
    y.push(400 + Math.random()*120);
    TPlot.plotDraw();
    PPlot.plotDraw();
    LPlot.plotDraw();
  }
}

let P5 = new p5(animation);
