var clientWidth = Math.max(200, window.innerWidth - 200);
var aspRatio = 1;
var clientHeight = clientWidth * aspRatio;

var mainPlot;
var gui;
var variable;

function windowResized() {
  clientWidth = Math.max(200, window.innerWidth - 200);
  aspRatio = 1;
  clientHeight = clientWidth * aspRatio;
  resizeCanvas(clientWidth, clientHeight);
  mainPlot.setOuterDim(clientWidth, clientHeight);
  mainPlot.setPos(0, 0);
  gui.prototype.setPosition(clientWidth, mainPlot.mar[2]);
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
  gui = createGui('plot controls', clientWidth, mainPlot.mar[2]);
  gui.newSlider('variable', 0, 1, 0.5, 0.1);
}

function draw() {
  background(255);

  Plot("x", "x", 0, 1, mainPlot);
}