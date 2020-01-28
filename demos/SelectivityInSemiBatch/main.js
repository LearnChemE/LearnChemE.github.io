/* jshint esversion: 6 */

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *           GLOBAL VARIABLES         
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
var clientWidth = Math.min(window.innerWidth - 200, 600);
var aspRatio = 1;
var clientHeight = clientWidth * aspRatio;

var gui;
var tfinal = 20;
var dt = 0.1;
var mainPlot;
var equation;

var T;
var Ed;
var Eu;

var NA, NB, ND, NU;
var NaFunction, NbFunction, NdFunction, NuFunction;
var Na0 = 0;
var Nb0 = 100;
var Nd0 = 0;
var Nu0 = 0;
var V0 = 10;
var n;

function overText(under, over) {return `\\mathrel{\\stackrel{${over}}{${under}}}`};

var title = `\\(\\mathrm{ A+B ${overText("\\rightarrow", "k_{D}")} D \\qquad\\qquad } \\mathrm{ A+B ${overText("\\rightarrow", "k_{U}")} U \\qquad\\qquad } \\)`;
var titleDOM;
let mjready = false;

const sim = math.parser();


/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Event handler: updating equations
 *    when the slider moves        
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function updateData() {
  // set initial conditions and constants
  const R = 0.008314;
  const con1 = Math.exp(-Ed/(R*T));
  const con2 = Math.exp(-Eu/(R*T))
  const kd = 1.22*(10**22)*con1;
  const ku = 3.79*(10**23)*con2;

  // define differential equations
  function dNadt(Na, Nb, Nd, Nu, V) {
    const d = (10 - ((kd * (Na / V) * ((Nb / V) ** 2)) * V) - ((ku * (Na / V) * (Nb / V)) * V));
    return d}
  function dNbdt(Na, Nb, Nd, Nu, V) {
    const d = -V * ((kd * (Na / V) * ((Nb / V) ** 2)) + (ku * (Na / V) * (Nb / V)));
    return d}
  function dNddt(Na, Nb, Nd, Nu, V) {
    const d = (kd * (Na / V) * ((Nb / V) ** 2)) * V;
    return d}
  function dNudt(Na, Nb, Nd, Nu, V) {
    const d = (ku * (Na / V) * (Nb / V)) * V;
    return d}
  function dVdt(Na, Nb, Nd, Nu, V) {
    const d = 1;
    return d}

  // evaluate system of ODEs and create an array from the result
  let result = new RangeSolve2({"f":[dNadt, dNbdt, dNddt, dNudt, dVdt], "yi":[Na0, Nb0, Nd0, Nu0, V0], "tinitial": 0, "dt": dt, "tfinal": tfinal}).calcAll();

  NA = result[0];
  NB = result[1];
  ND = result[2];
  NU = result[3];

}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * What to do when the browser is resized         
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function windowResized() {
  // retrieve the new client width
  clientWidth = Math.min(window.innerWidth - 200, 600);
  aspRatio = 1;
  clientHeight = clientWidth * aspRatio;
  
  // resize the canvas and plot, reposition the GUI 
  resizeCanvas(clientWidth, clientHeight);
  mainPlot.GPLOT.setOuterDim(clientWidth, clientHeight);
  mainPlot.GPLOT.setPos(0, 0);
  gui.prototype.setPosition(clientWidth, mainPlot.GPLOT.mar[2] + 100);
}

/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *        Set up the canvas         
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function setup() {
  titleDOM = document.getElementById('title');
  let cnv = createCanvas(clientWidth, clientHeight);
  
  math.import({RangeSolve2:RangeSolve2});

  cnv.parent('plotContainer');
  // Declare a plot
  mainPlot = new PlotCanvas(this);
  mainPlot.xLims = [0, tfinal];
  mainPlot.yLims = [0, 100];
  mainPlot.xAxisLabel = "time (min)";
  mainPlot.yAxisLabel = "moles of product";
  mainPlot.plotTitle = "";
  mainPlot.plotSetup();
  
  // Create the GUI using p5.gui.js
  gui = createGui('Plot Controls', clientWidth - 10, mainPlot.GPLOT.mar[2] + 100);
  gui.newSlider('T', 298, 370, 350, 1, 'Isothermal Temperature', 'K');
  gui.newSlider('Ed', 140, 160, 150, 1, 'activation energy<br>(desired)', 'kJ/mol');
  gui.newSlider('Eu', 150, 170, 160, 1, 'activation energy<br>(undesired)', 'kJ/mol');
  gui.newDropdown('addedto', ['A added to B', 'B added to A']);
  gui.newDropdown('plot', ['ND and NU', 'Selectivity (ND/NU)', 'NA and NB'], 'plot: ');
  updateData();

  NaFunction = new ArrayPlot(NA);
  NaFunction.lineColor = color(255, 0, 0, 255);

  NbFunction = new ArrayPlot(NB);
  NbFunction.lineColor = color(50, 220, 0, 255);

  NdFunction = new ArrayPlot(ND);
  NdFunction.lineColor = color(0, 0, 255, 255);

  NuFunction = new ArrayPlot(NU);
  NuFunction.lineColor = color(0, 100, 100, 255);

  mainPlot.addFuncs(NaFunction, NbFunction, NdFunction, NuFunction);

  let delay = 1000;
  setTimeout(function jax() {
      try {titleDOM.innerText = title; MathJax.Hub.Configured(); MathJax.Hub.Register.StartupHook("End",function () { mjready = true });}
      catch(error) {
        console.error(error); if(delay < 10000) {
          delay*= 1.5; setTimeout(jax, delay);
        } else {
          console.log("mathjax could not load");
      }}
  }, delay);

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
  NaFunction.update(NA);
  NbFunction.update(NB);
  NdFunction.update(ND);
  NuFunction.update(NU);

  // hides/shows lines depending on page selected
  NaFunction.lineColor = color(255, 0, 0, 255);
  NbFunction.lineColor = color(50, 220, 0, 255);
  NdFunction.lineColor = color(0, 0, 255, 255);
  NuFunction.lineColor = color(0, 100, 100, 255);

  mainPlot.plotDraw();
  const NAX = tfinal / 8;
  const Ai = NA.findIndex(e => Math.abs(e[0] - NAX) < dt);
  const NAY = NA[Ai][1];
  const NBX = 3 * tfinal / 8;
  const Bi = NB.findIndex(e => Math.abs(e[0] - NBX) < dt);
  const NBY = NB[Bi][1];
  const NDX = 5 * tfinal / 8;
  const Di = ND.findIndex(e => Math.abs(e[0] - NDX) < dt);
  const NDY = ND[Di][1];
  const NUX = 7 * tfinal / 8;
  const Ci = NU.findIndex(e => Math.abs(e[0] - NUX) < dt);
  const NUY = NU[Ci][1];
 
  mainPlot.labelDraw("N", NAX, NAY, NaFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("A", NAX, NAY, NaFunction.lineColor, [LEFT, TOP],"sub");
  
  mainPlot.labelDraw("N", NBX, NBY, NbFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("B", NBX, NBY, NbFunction.lineColor, [LEFT, TOP],"sub");
 
  mainPlot.labelDraw("N", NDX, NDY, NdFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("D", NDX, NDY, NdFunction.lineColor, [LEFT, TOP],"sub");

  mainPlot.labelDraw("N", NUX, NUY, NuFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("U", NUX, NUY, NuFunction.lineColor, [LEFT, TOP],"sub");
  
}

function updateJax() {
  if(mjready) {
    title = ``;
    var math = MathJax.Hub.getAllJax("title")[0];
    MathJax.Hub.Queue(["Text", math, title]);
  }
}