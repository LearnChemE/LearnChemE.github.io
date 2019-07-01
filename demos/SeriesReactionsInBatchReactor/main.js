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
  gui.prototype.setPosition(clientWidth, mainPlot.GPLOT.mar[2] + 50);
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *        Set up the canvas         
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function setup() {
  let cnv = createCanvas(clientWidth, clientHeight);
  cnv.parent('plotContainer');
  // Declare a plot
  mainPlot = new PlotCanvas(this);
  mainPlot.xLims = [0, tfinal];
  mainPlot.yLims = [0, 2.5];
  mainPlot.xAxisLabel = "time (h)";
  mainPlot.yAxisLabel = " ";
  mainPlot.plotTitle = "";
  mainPlot.plotSetup();
  
  // Create the GUI using p5.gui.js
  gui = createGui('Plot Controls', clientWidth - 10, mainPlot.GPLOT.mar[2] + 70);
  gui.newSlider('T', 450, 480, 450, 1, 'Temperature', 'K');
  gui.newDropdown("page", ["concentrations", "selectivity"], "Display:");
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
      mainPlot.yAxisLabel = "selectivity (     /     )";
      mainPlot.GPLOT.getYAxis().getAxisLabel().setText(mainPlot.yAxisLabel);
      selFunction.lineColor = color(0, 0, 0, 255);
      CaFunction.lineColor = color(255, 0, 0, 0);
      CbFunction.lineColor = color(50, 220, 0, 0);
      CcFunction.lineColor = color(0, 0, 255, 0);
      break;
    default:
      mainPlot.yAxisLabel = "concentration (M)";
      mainPlot.GPLOT.getYAxis().getAxisLabel().setText(mainPlot.yAxisLabel);
      selFunction.lineColor = color(0, 0, 0, 0);
      CaFunction.lineColor = color(255, 0, 0, 255);
      CbFunction.lineColor = color(50, 220, 0, 255);
      CcFunction.lineColor = color(0, 0, 255, 255);
    break;
  }

  mainPlot.plotDraw();
  let selX = tfinal / 2;
  let selY = selectivity[Math.trunc(map(tfinal/2, 0, tfinal, 0, tfinal / dt - 1))][1] + 0.1;
  let CAX = tfinal / 6;
  let CAY = CA[Math.trunc(map(tfinal/6, 0, tfinal, 0, tfinal / dt - 1))][1];
  let CBX = tfinal / 2;
  let CBY = CB[Math.trunc(map(tfinal/2, 0, tfinal, 0, tfinal / dt - 1))][1];
  let CCX = 5 * tfinal / 6;
  let CCY = CC[Math.trunc(map(5*tfinal/6, 0, tfinal, 0, tfinal / dt - 1))][1];

  mainPlot.labelDraw("selectivity", selX, selY, selFunction.lineColor, [CENTER, CENTER], false, [5, 1.6]);
 
  mainPlot.labelDraw("C", CAX, CAY, CaFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("A", CAX, CAY, CaFunction.lineColor, [LEFT, TOP],"sub");
  
  mainPlot.labelDraw("C", CBX, CBY, CbFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("B", CBX, CBY, CbFunction.lineColor, [LEFT, TOP],"sub");
 
  mainPlot.labelDraw("C", CCX, CCY, CcFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("C", CCX, CCY, CcFunction.lineColor, [LEFT, TOP],"sub");

  push();
  translate(mainPlot.GPLOT.pos[0] + mainPlot.GPLOT.mar[1], mainPlot.GPLOT.pos[1] + mainPlot.GPLOT.mar[2] + mainPlot.GPLOT.dim[1]);
  fill(mainPlot.GPLOT.boxBgColor.levels[0], mainPlot.GPLOT.boxBgColor.levels[1], mainPlot.GPLOT.boxBgColor.levels[2], selFunction.lineColor._array[3]*255);
  noStroke();
  rectMode(CENTER);
  rect(mainPlot.GPLOT.mainLayer.valueToXPlot(selX) + mainPlot.fontSize*3.3, mainPlot.GPLOT.mainLayer.valueToYPlot(selY), 30, 55);
  pop();
  
  mainPlot.subSuperDraw("C","B", selX, selY, selFunction.lineColor, "sub", 0, 3.3*mainPlot.fontSize, -0.9*mainPlot.fontSize);
  mainPlot.subSuperDraw("C","C", selX, selY, selFunction.lineColor, "sub", 0, 3.3*mainPlot.fontSize, 0.8*mainPlot.fontSize);
  mainPlot.drawLine(selX, selY, mainPlot.fontSize*3, 0, selFunction.lineColor, 1, mainPlot.fontSize*4, 0);

  mainPlot.yaxisSubSuperDraw("C","B", 0, 1.4, selFunction.lineColor, "sub", -PI/2);
  mainPlot.yaxisSubSuperDraw("C","C", 0, 3.2, selFunction.lineColor, "sub", -PI/2);
}