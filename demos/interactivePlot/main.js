var plot1;
var point1;
var line1;
var xAxisLimit = 10;
var pointYValue = 0;
var pointYValueMin = -0.5;
var pointYValueMax = 0.5;
var pointYValueStep = 0.05
var variable = 1;
var variableMin = 0.1;
var variableMax = 5;
var variableStep = 0.1;

function setup() {
  createCanvas(800, 600);
  plot1 = new GPlot(this);
  plot1.setPos(0, 0);
  plot1.setOuterDim(this.width-200, this.height);

  plot1.setYLim(-1.5, 1.5);
  plot1.getXAxis().getAxisLabel().setText("x - label");
  plot1.getYAxis().getAxisLabel().setText("y - label");
  plot1.getTitle().setText("An Interactive Plot");

  point1 = new GPoint(10, pointYValue);

  // Create the GUI
  sliderRange(0, 100, 5);
  gui = createGui('plot controls', this.width-200, -1);
  gui.addGlobals('xAxisLimit','pointYValue','variable');

  // Only call draw when then gui is changed

}

function draw() {

  point1.setY(pointYValue);
  background(220);

  plot1.setXLim(0, xAxisLimit);
  plot1.beginDraw();
  plot1.drawBackground();
  plot1.drawBox();
  
  plotFunction(String("sin(" + variable + "*x)+" + pointYValue),["x", 0, xAxisLimit+0.2, 0.2], plot1, true);

  plot1.drawLimits();
  plot1.drawXAxis();
  plot1.drawYAxis();
  plot1.drawTitle();
  plot1.endDraw();
  
  noLoop();
}