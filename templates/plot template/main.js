/* jshint esversion: 6 */

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           GLOBAL VARIABLES         
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
var clientWidth = Math.max(200, window.innerWidth - 200);
var aspRatio = 1;
var clientHeight = clientWidth * aspRatio;

var gui;
var variable;
var examplePlot;
var equation;

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Event handler: updating equations
 *    when the slider moves        
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function updateEquations() {
  equation =  `erf(x) + ${variable - 0.5}`;
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * What to do when the browser is resized         
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function windowResized() {
  // retrieve the new client width
  clientWidth = Math.max(200, window.innerWidth - 200);
  aspRatio = 1;
  clientHeight = clientWidth * aspRatio;
  
  // resize the canvas and plot, reposition the GUI 
  resizeCanvas(clientWidth, clientHeight);
  examplePlot.GPLOT.setOuterDim(clientWidth, clientHeight);
  examplePlot.GPLOT.setPos(0, 0);
  gui.prototype.setPosition(clientWidth, examplePlot.GPLOT.mar[2]);
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *        Set up the canvas         
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function setup() {
  createCanvas(clientWidth, clientHeight);

  // Declare a plot
  examplePlot = new PlotCanvas(this);
  examplePlot.plotSetup();
  
  // Create the GUI using p5.gui.js
  gui = createGui('plot controls', clientWidth, examplePlot.GPLOT.mar[2]);
  gui.newSlider('variable', 0, 1, 0.5, 0.01, 'label', 'units');
  updateEquations();

  exampleFunction = new Plot("sin(4*x)", "x", 0, 1, 0.01);
  exampleFunction.lineColor = color(255, 255, 0);

  secondaryFunction = new Plot(equation, "x", 0, 1);

  examplePlot.addFuncs(exampleFunction, secondaryFunction);
  noLoop();
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *          Main Program Loop       
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function draw() {
  clear();

  updateEquations();
  secondaryFunction.update(equation);

  examplePlot.plotDraw();
}