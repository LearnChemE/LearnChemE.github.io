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
var vfinal = 5;
var dv = 0.1;
var mainPlot;
var equation;

var FA;
var FB;
var FC;
var xA0;
var k;
var u = 1;
var n;

var title = `\\(\\mathrm{ A+2B \\rightarrow C \\qquad\\qquad } r = 0.50 \\mathrm{ C_{A}C_{B} \\;  \\frac{mol}{m^{3}s} } \\)`;
var titleDOM;
let mjready = false;
let kunits;
window["kInnerHTML"] = '<span id="kunits">m<sup>3</sup>/(mol s)</span>';

const sim = math.parser();


/**
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * Event handler: updating equations
 *    when the slider moves        
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 */
function updateData() {
  // set initial conditions and constants
  sim.eval(`Ca0 = ${xA0}`);
  sim.eval(`Cb0 = ${1 - xA0}`);
  sim.eval(`Cc0 = 0`);
  sim.eval(`k = ${k}`);
  sim.eval(`u = ${u}`);
  sim.eval(`n = ${n}`);

  sim.eval(`vfinal = ${vfinal}`);
  sim.eval(`dv = ${dv}`);

  // define differential equations
  sim.eval("dCadv(Ca, Cb, Cc) = -k * Ca * (Cb ^ n) / u");
  sim.eval("dCbdv(Ca, Cb, Cc) = -2 * k * Ca * (Cb ^ n) / u");
  sim.eval("dCcdv(Ca, Cb, Cc) = k * Ca * (Cb ^ n) / u");

  // evaluate system of ODEs and create an array from the result
  sim.eval("result = ndsolve([dCadv, dCbdv, dCcdv], [Ca0, Cb0, Cc0], dv, vfinal)");

  let Ca = sim.eval("transpose(concat(transpose(result[:,1]),1))").toArray().map(function(e) { return e[0];});
  let Cb = sim.eval("transpose(concat(transpose(result[:,2]),1))").toArray().map(function(e) { return e[0];});
  let Cc = sim.eval("transpose(concat(transpose(result[:,3]),1))").toArray().map(function(e) { return e[0];});

  let zeroIndex = -1;
  let CaCbZero;
  let tempCa, tempCb, tempCc;

  for(let i = 0; i < Ca.length; i++) {
    if(Ca[i] <= 0) {
      zeroIndex = i;
      CaCbZero = "Ca";
      break;
    }
    if(Cb[i] <= 0) {
      zeroIndex = i;
      CaCbZero = "Cb";
      break;
    }
  }

  if(zeroIndex >= 0) {
    sim.eval(`Ca0 = ${CaCbZero == "Ca" ? 0 : xA0 - ((1 - xA0) / 2)}`);
    sim.eval(`Cb0 = ${CaCbZero == "Cb" ? 0 : (1 - 2 * xA0)}`);
    sim.eval(`Cc0 = ${CaCbZero == "Ca" ? xA0 : ((1 - xA0) / 2)}`);
    sim.eval(`k = ${k}`);
    sim.eval(`u = ${u}`);
    sim.eval(`n = ${n}`);
  
    sim.eval(`vfinal = ${vfinal * (1 - (zeroIndex / Ca.length))}`);
    sim.eval(`dv = ${dv}`);
  
    // define differential equations
    sim.eval(`dCadv(Ca, Cb, Cc) = 0`);
    sim.eval(`dCbdv(Ca, Cb, Cc) = 0`);
    sim.eval(`dCcdv(Ca, Cb, Cc) = 0`);
  
    // evaluate system of ODEs and create an array from the result
    sim.eval("result = ndsolve([dCadv, dCbdv, dCcdv], [Ca0, Cb0, Cc0], dv, vfinal)");
  
    tempCa = sim.eval("transpose(concat(transpose(result[:,1]),1))").toArray().map(function(e) { return e[0];});
    tempCb = sim.eval("transpose(concat(transpose(result[:,2]),1))").toArray().map(function(e) { return e[0];});
    tempCc = sim.eval("transpose(concat(transpose(result[:,3]),1))").toArray().map(function(e) { return e[0];});
  
    for(let i = 0; i < tempCa.length; i++) {
      Ca[zeroIndex + i] = tempCa[i];
      Cb[zeroIndex + i] = tempCb[i];
      Cc[zeroIndex + i] = tempCc[i];
    }
  }

  let l = Ca.length;

  FA = new Array(l);
  FB = new Array(l);
  FC = new Array(l);

  for (i = 0; i < FA.length; i++) {
    let v = (vfinal/l) * (i + 1);
    FA[i]=[v, Ca[i] * u];
    FB[i]=[v, Cb[i] * u];
    FC[i]=[v, Cc[i] * u];
  }

  // add initial conditions to beginning of array. Initial selectivity is technically infinite.
  FA.unshift([0, xA0 * u]);
  FB.unshift([0, (1 - xA0) * u]);
  FC.unshift([0, 0]);

  adjustUnits();
}

function adjustUnits() {
  switch(n) {
    case 0:
      window["kInnerHTML"] = '<span id="kunits">s<sup>-1</sup></span>';
      kunits.innerHTML = window["kInnerHTML"];
      break;
    case 1:
      window["kInnerHTML"] = '<span id="kunits">m<sup>3</sup>/(mol s)</span>';
      kunits.innerHTML = window["kInnerHTML"];
      break;
    case 2:
      window["kInnerHTML"] = '<span id="kunits">m<sup>6</sup>/(mol<sup>2</sup> s)</span>';
      kunits.innerHTML = window["kInnerHTML"];
      break;  
  };
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
  mainPlot.xLims = [0, vfinal];
  mainPlot.yLims = [0, 1];
  mainPlot.xAxisLabel = "volume (m³)";
  mainPlot.yAxisLabel = "molar flow rate (mol / s)";
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

  FaFunction = new ArrayPlot(FA);
  FaFunction.lineColor = color(255, 0, 0, 255);

  FbFunction = new ArrayPlot(FB);
  FbFunction.lineColor = color(50, 220, 0, 255);

  FcFunction = new ArrayPlot(FC);
  FcFunction.lineColor = color(0, 0, 255, 255);

  mainPlot.addFuncs(FaFunction, FbFunction, FcFunction);

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
  FaFunction.update(FA);
  FbFunction.update(FB);
  FcFunction.update(FC);

  // hides/shows lines depending on page selected
  FaFunction.lineColor = color(255, 0, 0, 255);
  FbFunction.lineColor = color(50, 220, 0, 255);
  FcFunction.lineColor = color(0, 0, 255, 255);

  mainPlot.plotDraw();
  let FAX = vfinal / 6;
  let FAY = FA[Math.trunc(map(vfinal/6, 0, vfinal, 0, vfinal / dv - 1))][1];
  let FBX = vfinal / 2;
  let FBY = FB[Math.trunc(map(vfinal/2, 0, vfinal, 0, vfinal / dv - 1))][1];
  let FCX = 5 * vfinal / 6;
  let FCY = FC[Math.trunc(map(5*vfinal/6, 0, vfinal, 0, vfinal / dv - 1))][1];
 
  mainPlot.labelDraw("F", FAX, FAY, FaFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("A", FAX, FAY, FaFunction.lineColor, [LEFT, TOP],"sub");
  
  mainPlot.labelDraw("F", FBX, FBY, FbFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("B", FBX, FBY, FbFunction.lineColor, [LEFT, TOP],"sub");
 
  mainPlot.labelDraw("F", FCX, FCY, FcFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("C", FCX, FCY, FcFunction.lineColor, [LEFT, TOP],"sub");
  
}

function updateJax() {
  if(mjready) {
    title = `\\mathrm{ A+2B \\rightarrow C \\qquad\\qquad } r = ${k} \\mathrm{ C_{A}C_{B}${n != 1 ? String("^{" + n + "}") : ""} \\;  \\frac{mol}{m^{3}s} } `;
    var math = MathJax.Hub.getAllJax("title")[0];
    MathJax.Hub.Queue(["Text", math, title]);
  }
}