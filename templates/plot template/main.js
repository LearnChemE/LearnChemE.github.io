var clientWidth = Math.max(200, window.innerWidth - 200);
var aspRatio = 1;
var clientHeight = clientWidth * aspRatio;

var mainPlot;
var gui;
var variable = 1;

function windowResized() {
  resizeCanvas(clientWidth, clientHeight);
}

class PlotSetup {
  constructor(plot) {
    this._ = plot;
  }

  defaultSetup() {
    this._.setPos(0, 0);
    this._.setOuterDim(this._.parent.width, this._.parent.height);
    this._.setYLim(0, 1);
    this._.setXLim(0, 1);
    this._.getXAxis().getAxisLabel().setText("x - label");
    this._.getYAxis().getAxisLabel().setText("y - label");
    this._.getTitle().setText("An Interactive Plot");
  }
}

function setup() {
  createCanvas(clientWidth, clientHeight);

  mainPlot = new GPlot(this);
  plotSettings = new PlotSetup(mainPlot);
  plotSettings.defaultSetup();

  // Create the GUI
  sliderRange(0, 1, 0.05);
  gui = createGui('plot controls', 0, -1);
  gui.addGlobals('variable');

  // Only call draw when then gui is changed

}

function draw() {
  background(255);

  mainPlot.beginDraw();
  mainPlot.drawBackground();
  mainPlot.drawBox();
  
  plotFunction(String(`0.5 * sin(10 * x + 10 * ${variable}) + 0.5`),["x", 0, 1, 0.01], mainPlot, true);

  mainPlot.drawLimits();
  mainPlot.drawXAxis();
  mainPlot.drawYAxis();
  mainPlot.drawTitle();
  mainPlot.endDraw();
}