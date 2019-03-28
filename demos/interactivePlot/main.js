var plot1;
var point1;
var xAxisLimit = 100;
var pointYValue = 1;

function setup() {
  createCanvas(800, 600);
  plot1 = new GPlot(this);
  plot1.setPos(0, 0);
  plot1.setOuterDim(this.width-200, this.height);

  plot1.setYLim(0, 100);
  plot1.getXAxis().getAxisLabel().setText("x - label");
  plot1.getYAxis().getAxisLabel().setText("y - label");
  plot1.getTitle().setText("An Interactive Plot");

  point1 = new GPoint(10, pointYValue);
  
  // Create the GUI
  sliderRange(0, 100, 5);
  gui = createGui('plot controls', this.width-200, -1);
  gui.addGlobals('xAxisLimit','pointYValue');

  // Only call draw when then gui is changed

}

function draw() {
  point1.setY(pointYValue);
  background(220);
  plot1.setXLim(1, xAxisLimit);
  plot1.beginDraw();
  plot1.drawBackground();
  plot1.drawBox();
  plot1.drawXAxis();
  plot1.drawYAxis();
  plot1.drawTitle();
  plot1.addPoint(point1);
  plot1.drawPoint(point1);
  plot1.endDraw();
}