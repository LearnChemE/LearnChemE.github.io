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
var T = 450;
var z = 15;
var examplePlot;
var equation;

var CA;
var CB;
var CC;

const sim = math.parser();


/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Event handler: updating equations
 *    when the slider moves        
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function updateData() {
  sim.eval("Ea1 = 145");
  sim.eval("Ea2 = 155");
  sim.eval("R  = 8.314*10^-3");
  sim.eval("A1 = 3.6*10^16");
  sim.eval("A2 = 1.8*10^17");
  sim.eval(`z = ${z}`);

  sim.eval("Ca0 = 2.0");
  sim.eval("Cb0 = 0");
  sim.eval("Cc0 = 0");

  sim.eval(`k1 = A1 * e^(-Ea1/(R * ${T}))`);
  sim.eval(`k2 = A2 * e^(-Ea2/(R * ${T}))`);

  sim.eval("dCadt(Ca, Cb, Cc) = -k1 * Ca");
  sim.eval("dCbdt(Ca, Cb, Cc) = k1 * Ca - k2 * Cb");
  sim.eval("dCcdt(Ca, Cb, Cc) = k2 * Cb");

  sim.eval("result = ndsolve([dCadt, dCbdt, dCcdt], [Ca0, Cb0, Cc0], 0.1, z)");

  const Ca = sim.eval("transpose(concat(transpose(result[:,1]),1))").toArray().map(function(e) { return e[0]});
  const Cb = sim.eval("transpose(concat(transpose(result[:,2]),1))").toArray().map(function(e) { return e[0]});
  const Cc = sim.eval("transpose(concat(transpose(result[:,3]),1))").toArray().map(function(e) { return e[0]});

  let l = Ca.length;

  CA = new Array(l);
  CB = new Array(l);
  CC = new Array(l);

  for (i=0; i<Ca.length;i++) {
    let t = (z/l)*(i+1);
    CA[i]=[t, Ca[i]];
    CB[i]=[t, Cb[i]];
    CC[i]=[t, Cc[i]];
  }

  CA.unshift([0,2]);
  CB.unshift([0,0]);
  CC.unshift([0,0]);
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
  examplePlot.xLims = [0, z];
  examplePlot.yLims = [0, 2.5];
  examplePlot.xAxisLabel = "time (h)";
  examplePlot.yAxisLabel = "concentration (M)";
  examplePlot.plotTitle = "Series Reactions in a Batch Reactor";
  examplePlot.plotSetup();
  
  // Create the GUI using p5.gui.js
  gui = createGui('plot controls', clientWidth, examplePlot.GPLOT.mar[2]);
  gui.newSlider('T', 450, 480, 450, 1, 'Temperature', 'K');
  updateData();

  CaFunction = new ArrayPlot(CA);
  CaFunction.lineColor = color(255, 0, 0);

  CbFunction = new ArrayPlot(CB);
  CbFunction.lineColor = color(0, 255, 0);

  CcFunction = new ArrayPlot(CC);
  CcFunction.lineColor = color(0, 0, 255);

  //secondaryFunction = new Plot(equation, "x", 0, 1);

  examplePlot.addFuncs(CaFunction, CbFunction, CcFunction);

  //console.log(examplePlot);
  noLoop();
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *          Main Program Loop       
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function draw() {
  clear();

  updateData();
  CaFunction.update(CA);
  CbFunction.update(CB);
  CcFunction.update(CC);

  examplePlot.plotDraw();
}