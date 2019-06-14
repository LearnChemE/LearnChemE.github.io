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
var tfinal = 15;
var dt = 0.1;
var mainPlot;
var equation;

var CA;
var CB;
var CC;
var Cao = 2;
var Cbo = 0;
var Cco = 0;
var selectivity;

var page = "concentration";

const sim = math.parser();


/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Event handler: updating equations
 *    when the slider moves        
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function updateData() {
  // set initial conditions and constants
  sim.eval("Ea1 = 145");
  sim.eval("Ea2 = 155");
  sim.eval("R  = 8.314*10^-3");
  sim.eval("A1 = 3.6*10^16");
  sim.eval("A2 = 1.8*10^17");
  sim.eval(`tfinal = ${tfinal}`);
  sim.eval(`dt = ${dt}`);

  sim.eval(`Ca0 = ${Cao}`);
  sim.eval(`Cb0 = ${Cbo}`);
  sim.eval(`Cc0 = ${Cco}`);

  sim.eval(`k1 = A1 * e^(-Ea1/(R * ${T}))`);
  sim.eval(`k2 = A2 * e^(-Ea2/(R * ${T}))`);

  // define differential equations
  sim.eval("dCadt(Ca, Cb, Cc) = -k1 * Ca");
  sim.eval("dCbdt(Ca, Cb, Cc) = k1 * Ca - k2 * Cb");
  sim.eval("dCcdt(Ca, Cb, Cc) = k2 * Cb");

  // evaluate system of ODEs and create an array from the result
  sim.eval("result = ndsolve([dCadt, dCbdt, dCcdt], [Ca0, Cb0, Cc0], dt, tfinal)");

  const Ca = sim.eval("transpose(concat(transpose(result[:,1]),1))").toArray().map(function(e) { return e[0];});
  const Cb = sim.eval("transpose(concat(transpose(result[:,2]),1))").toArray().map(function(e) { return e[0];});
  const Cc = sim.eval("transpose(concat(transpose(result[:,3]),1))").toArray().map(function(e) { return e[0];});

  let l = Ca.length;

  CA = new Array(l);
  CB = new Array(l);
  CC = new Array(l);
  selectivity = new Array(l);

  for (i=0; i<Ca.length;i++) {
    let t = (tfinal/l)*(i+1);
    CA[i]=[t, Ca[i]];
    CB[i]=[t, Cb[i]];
    CC[i]=[t, Cc[i]];
    selectivity[i]=[t, CB[i][1]/CC[i][1]];
  }

  // add initial conditions to beginning of array. Initial selectivity is technically infinite.
  CA.unshift([0,Cao]);
  CB.unshift([0,Cbo]);
  CC.unshift([0,Cco]);
  selectivity.unshift([0, 100]);
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
  mainPlot.GPLOT.setOuterDim(clientWidth, clientHeight);
  mainPlot.GPLOT.setPos(0, 0);
  gui.prototype.setPosition(clientWidth, mainPlot.GPLOT.mar[2]);
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *        Set up the canvas         
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function setup() {
  createCanvas(clientWidth, clientHeight);

  // Declare a plot
  mainPlot = new PlotCanvas(this);
  mainPlot.xLims = [0, tfinal];
  mainPlot.yLims = [0, 2.5];
  mainPlot.xAxisLabel = "time (h)";
  mainPlot.yAxisLabel = "concentration (M)";
  mainPlot.plotTitle = "Series Reactions in a Batch Reactor";
  mainPlot.plotSetup();
  
  // Create the GUI using p5.gui.js
  gui = createGui('plot controls', clientWidth, mainPlot.GPLOT.mar[2]);
  gui.newSlider('T', 450, 480, 450, 1, 'Temperature', 'K');
  gui.newDropdown("page", ["concentration", "selectivity"], "display:");
  updateData();

  CaFunction = new ArrayPlot(CA);
  CaFunction.lineColor = color(255, 0, 0, 255);

  CbFunction = new ArrayPlot(CB);
  CbFunction.lineColor = color(50, 220, 0, 255);

  CcFunction = new ArrayPlot(CC);
  CcFunction.lineColor = color(0, 0, 255, 255);

  selFunction = new ArrayPlot(selectivity);
  selFunction.lineColor = color(0, 0, 0, 0);

  //secondaryFunction = new Plot(equation, "x", 0, 1);

  mainPlot.addFuncs(CaFunction, CbFunction, CcFunction, selFunction);

  //console.log(mainPlot);
  noLoop();
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *          Main Program Loop       
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function draw() {
  clear();
  
  // updates the solution, then updates the lines on the plot
  updateData();
  CaFunction.update(CA);
  CbFunction.update(CB);
  CcFunction.update(CC);
  selFunction.update(selectivity);

  // hides/shows lines depending on page selected
  switch(page) {
    case "selectivity":
      selFunction.lineColor = color(0, 0, 0, 255);
      CaFunction.lineColor = color(255, 0, 0, 0);
      CbFunction.lineColor = color(50, 220, 0, 0);
      CcFunction.lineColor = color(0, 0, 255, 0);
      break;
    default:
      selFunction.lineColor = color(0, 0, 0, 0);
      CaFunction.lineColor = color(255, 0, 0, 255);
      CbFunction.lineColor = color(50, 220, 0, 255);
      CcFunction.lineColor = color(0, 0, 255, 255);
    break;
  }

  mainPlot.plotDraw();
  mainPlot.labelDraw("selectivity", tfinal / 2, selectivity[Math.trunc(map(tfinal/2, 0, tfinal, 0, tfinal / dt - 1))][1], selFunction.lineColor, [CENTER, CENTER], false, [5, 1.6]);
 
  mainPlot.labelDraw("C", tfinal / 6, CA[Math.trunc(map(tfinal/6, 0, tfinal, 0, tfinal / dt - 1))][1], CaFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("a", tfinal / 6, CA[Math.trunc(map(tfinal/6, 0, tfinal, 0, tfinal / dt - 1))][1], CaFunction.lineColor, [LEFT, TOP],"sub");
  
  mainPlot.labelDraw("C", tfinal / 2, CB[Math.trunc(map(tfinal/2, 0, tfinal, 0, tfinal / dt - 1))][1], CbFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("b", tfinal / 2, CB[Math.trunc(map(tfinal/2, 0, tfinal, 0, tfinal / dt - 1))][1], CbFunction.lineColor, [LEFT, TOP],"sub");
 
  mainPlot.labelDraw("C", 5 * tfinal / 6, CC[Math.trunc(map(5*tfinal/6, 0, tfinal, 0, tfinal / dt - 1))][1], CcFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("c", 5 * tfinal / 6, CC[Math.trunc(map(5*tfinal/6, 0, tfinal, 0, tfinal / dt - 1))][1], CcFunction.lineColor, [LEFT, TOP],"sub");
}