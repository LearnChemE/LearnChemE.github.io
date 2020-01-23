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
var dt = 0.01;
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
  sim.eval('R = 0.008314');
  sim.eval(`T = ${T}`);
  sim.eval(`Ed = ${Ed}`);
  sim.eval(`Eu = ${Eu}`);
  sim.eval(`kd = 1.22*(10^22)*e^(-Ed/(R*T))`);
  sim.eval(`ku = 3.79*(10^23)*e^(-Eu/(R*T))`);

  //sim.eval(`rd = (kd * (Na / V) * ((Nb / V) ^ 2))`);
  //sim.eval(`ru = (ku * (Na / V) * (Nb / V))`);

  sim.eval(`Na0 = ${Na0}`);
  sim.eval(`Nb0 = ${Nb0}`);
  sim.eval(`Nd0 = ${Nd0}`);
  sim.eval(`Nu0 = ${Nu0}`);
  sim.eval(`V0 = ${V0}`);

  sim.eval(`dt = ${dt}`);
  sim.eval(`tfinal = ${tfinal}`);

  // define differential equations
  sim.eval('dNadt(Na, Nb, Nd, Nu, V) = 10 - ((kd * (Na / V) * ((Nb / V) ^ 2)) * V) - ((ku * (Na / V) * (Nb / V)) * V)');
  sim.eval('dNbdt(Na, Nb, Nd, Nu, V) = -V * ((kd * (Na / V) * ((Nb / V) ^ 2)) + (ku * (Na / V) * (Nb / V)))');
  sim.eval('dNddt(Na, Nb, Nd, Nu, V) = (kd * (Na / V) * ((Nb / V) ^ 2)) * V');
  sim.eval('dNudt(Na, Nb, Nd, Nu, V) = (ku * (Na / V) * (Nb / V)) * V');
  sim.eval('dVdt(Na, Nb, Nd, Nu, V) = 1');

  // evaluate system of ODEs and create an array from the result
  sim.eval("result = ndsolve([dNadt, dNbdt, dNddt, dNudt, dVdt], [Na0, Nb0, Nd0, Nu0, V0], dt, tfinal)");

  let Na = sim.eval("transpose(concat(transpose(result[:,1]),1))").toArray().map(function(e) { return e[0];});
  let Nb = sim.eval("transpose(concat(transpose(result[:,2]),1))").toArray().map(function(e) { return e[0];});
  let Nd = sim.eval("transpose(concat(transpose(result[:,3]),1))").toArray().map(function(e) { return e[0];});
  let Nu = sim.eval("transpose(concat(transpose(result[:,4]),1))").toArray().map(function(e) { return e[0];});

  let zeroIndex = -1;
  let l = Na.length;

  NA = new Array(l);
  NB = new Array(l);
  ND = new Array(l);
  NU = new Array(l);

  for (i = 0; i < l; i++) {
    let t = (tfinal/l) * (i + 1);
    NA[i]=[t, Na[i]];
    NB[i]=[t, Nb[i]];
    ND[i]=[t, Nd[i]];
    NU[i]=[t, Nu[i]];
  }

  // add initial conditions to beginning of array. Initial selectivity is technically infinite.
  NA.unshift([0, Na0]);
  NB.unshift([0, Nb0]);
  ND.unshift([0, Nd0]);
  NU.unshift([0, Nu0]);

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

  let GUIDOM = document.getElementsByClassName("qs_main")[0];
  GUIDOM.addEventListener("mouseup", e => {updateJax()});

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
  let NAX = tfinal / 8;
  let NAY = NA[Math.trunc(map(tfinal/8, 0, tfinal, 0, tfinal / dt - 1))][1];
  let NBX = 3 * tfinal / 8;
  let NBY = NB[Math.trunc(map(3 * tfinal / 8, 0, tfinal, 0, tfinal / dt - 1))][1];
  let NDX = 5 * tfinal / 8;
  let NDY = ND[Math.trunc(map(5 * tfinal / 8, 0, tfinal, 0, tfinal / dt - 1))][1];
  let NUX = 7 * tfinal / 8;
  let NUY = NU[Math.trunc(map(7 * tfinal / 8, 0, tfinal, 0, tfinal / dt - 1))][1];
 
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
    title = `\\mathrm{ A+2B \\rightarrow C \\qquad\\qquad } r = ${k} \\mathrm{ C_{A}C_{B}${n != 1 ? String("^{" + n + "}") : ""} \\;  \\frac{mol}{m^{3}s} } `;
    var math = MathJax.Hub.getAllJax("title")[0];
    MathJax.Hub.Queue(["Text", math, title]);
  }
}