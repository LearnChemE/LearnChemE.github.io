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
var ABchoices = ["A added to B", "B added to A"];
var AB = ABchoices[0];
var plotChoices = ['ND and NU', 'Selectivity (ND/NU)', 'NA and NB', 'Show All'];
var plot = plotChoices[0];

var NA, NB, ND, NU, S;
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

  Na0 = AB == ABchoices[0] ? 0 : 100;
  Nb0 = AB == ABchoices[0] ? 100 : 0;

  // define differential equations
  function dNadt(Na, Nb, Nd, Nu, V) {
    if(AB == ABchoices[0]) {
      const d = (10 - ((kd * (Na / V) * ((Nb / V) ** 2)) * V) - ((ku * (Na / V) * (Nb / V)) * V));
      return d
    } else {
      const d = -((kd * (Na / V) * ((Nb / V) ** 2)) * V) - ((ku * (Na / V) * (Nb / V)) * V);
      return d
    }
  }
  function dNbdt(Na, Nb, Nd, Nu, V) {
    if(AB == ABchoices[0]) {
      const d = -V * ((kd * (Na / V) * ((Nb / V) ** 2)) + (ku * (Na / V) * (Nb / V)));
      return d
    } else {
      const d = 10 - V * ((kd * (Na / V) * ((Nb / V) ** 2)) + (ku * (Na / V) * (Nb / V)));
      return d
    }
  }
  function dNddt(Na, Nb, Nd, Nu, V) {
    const d = (kd * (Na / V) * ((Nb / V) ** 2)) * V;
    return d
  }
  function dNudt(Na, Nb, Nd, Nu, V) {
    const d = (ku * (Na / V) * (Nb / V)) * V;
    return d
  }
  function dVdt(Na, Nb, Nd, Nu, V) {
    const d = 1;
    return d
  }

  // evaluate system of ODEs and create an array from the result
  let result = new RangeSolve2({"f":[dNadt, dNbdt, dNddt, dNudt, dVdt], "yi":[Na0, Nb0, Nd0, Nu0, V0], "tinitial": 0, "dt": dt, "tfinal": tfinal}).calcAll();

  NA = result[0];
  NB = result[1];
  ND = result[2];
  NU = result[3];

  S = new Array(ND.length);
  
  //first value is 0/0 (not a number), so make first and second values equivalent
  S[0] =  [ND[1][0], ND[1][1]/NU[1][1]];

  for(let i = 1; i < S.length; i++) {
    S[i] = [ND[i][0], ND[i][1]/NU[i][1]]
  }

  const choice = plotChoices.indexOf(plot);
  if(choice == 1) {
    let adjustAxis = false;
    let arr = [];
    S.forEach((coord) => {arr.push(coord[1])});
    const max = arr.reduce(function(a, b) {
      return Math.max(a, b);
    });
    adjustAxis = max >= mainPlot.yLims[1] || max <= 0.1 * mainPlot.yLims[1] ? true : false;
    if(adjustAxis) {mainPlot.yLims[1] = Math.ceil(max * 2); mainPlot.plotSetup();}
  } else if(mainPlot.yLims[1] != 100) {mainPlot.yLims[1] = 100; mainPlot.plotSetup();}

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
  gui.newDropdown('AB', [`${ABchoices[0]}`, `${ABchoices[1]}`]);
  gui.newDropdown('plot', [`${plotChoices[0]}`, `${plotChoices[1]}`, `${plotChoices[2]}`, `${plotChoices[3]}`], 'plot: ');
  updateData();

  NaFunction = new ArrayPlot(NA);
  NaFunction.lineColor = color(255, 0, 0, 255);

  NbFunction = new ArrayPlot(NB);
  NbFunction.lineColor = color(50, 220, 0, 255);

  NdFunction = new ArrayPlot(ND);
  NdFunction.lineColor = color(0, 0, 255, 255);

  NuFunction = new ArrayPlot(NU);
  NuFunction.lineColor = color(0, 100, 100, 255);

  SFunction = new ArrayPlot(S);
  SFunction.lineColor = color(0, 0, 0, 255);

  mainPlot.addFuncs(NaFunction, NbFunction, NdFunction, NuFunction, SFunction);

  let delay = 1000;
  setTimeout(function jax() {
      try {titleDOM.innerText = title;  MathJax.Hub.Configured(); MathJax.Hub.Register.StartupHook("End",function () { mjready = true;});}
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
  SFunction.update(S);
  let NAX = 0;
  let NBX = 0;
  let NDX = 0;
  let NUX = 0;
  let SX = tfinal / 2;

  // hides/shows lines depending on page selected
  const choice = plotChoices.indexOf(plot);
  switch(choice) {
    case 0:
      NDX = tfinal / 3;
      NUX = 2 * tfinal / 3;
      mainPlot.yAxisLabel = "moles of products";
      mainPlot.GPLOT.getYAxis().getAxisLabel().setText(mainPlot.yAxisLabel);
      NaFunction.lineColor = color(255, 0, 0, 0);
      NbFunction.lineColor = color(50, 220, 0, 0);
      NdFunction.lineColor = color(0, 0, 255, 255);
      NuFunction.lineColor = color(0, 100, 100, 255);
      SFunction.lineColor = color(0, 0, 0, 0);
    break;
    
    case 1:
      SX = tfinal / 2;
      mainPlot.yAxisLabel = "selectivity (     /     )";
      mainPlot.GPLOT.getYAxis().getAxisLabel().setText(mainPlot.yAxisLabel);
      NaFunction.lineColor = color(255, 0, 0, 0);
      NbFunction.lineColor = color(50, 220, 0, 0);
      NdFunction.lineColor = color(0, 0, 255, 0);
      NuFunction.lineColor = color(0, 100, 100, 0);
      SFunction.lineColor = color(0, 0, 0, 255);
    break;

    case 2:
      NAX = tfinal / 3;
      NBX = 2 * tfinal / 3;
      mainPlot.yAxisLabel = "moles of reactants";
      mainPlot.GPLOT.getYAxis().getAxisLabel().setText(mainPlot.yAxisLabel);
      NaFunction.lineColor = color(255, 0, 0, 255);
      NbFunction.lineColor = color(50, 220, 0, 255);
      NdFunction.lineColor = color(0, 0, 255, 0);
      NuFunction.lineColor = color(0, 100, 100, 0);
      SFunction.lineColor = color(0, 0, 0, 0);
    break;

    case 3:
      NAX = tfinal / 6;
      NBX = 2 * tfinal / 6;
      NDX = 3 * tfinal / 6;
      NUX = 4 * tfinal / 6;
      SX = 5 * tfinal / 6;
      mainPlot.yAxisLabel = "moles of reactants (or selectivity)";
      mainPlot.GPLOT.getYAxis().getAxisLabel().setText(mainPlot.yAxisLabel);
      NaFunction.lineColor = color(255, 0, 0, 255);
      NbFunction.lineColor = color(50, 220, 0, 255);
      NdFunction.lineColor = color(0, 0, 255, 255);
      NuFunction.lineColor = color(0, 100, 100, 255);
      SFunction.lineColor = color(0, 0, 0, 255);
    break;
  }

  mainPlot.plotDraw();

  const Ai = NA.findIndex(e => Math.abs(e[0] - NAX) < dt);
  const NAY = NA[Ai][1];

  const Bi = NB.findIndex(e => Math.abs(e[0] - NBX) < dt);
  const NBY = NB[Bi][1];

  const Di = ND.findIndex(e => Math.abs(e[0] - NDX) < dt);
  const NDY = ND[Di][1];

  const Ci = NU.findIndex(e => Math.abs(e[0] - NUX) < dt);
  const NUY = NU[Ci][1];

  const Si = S.findIndex(e => Math.abs(e[0] - SX) < dt);
  const SY = S[Si][1];
 
  mainPlot.labelDraw("N", NAX, NAY, NaFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("A", NAX, NAY, NaFunction.lineColor, [LEFT, TOP],"sub");
  
  mainPlot.labelDraw("N", NBX, NBY, NbFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("B", NBX, NBY, NbFunction.lineColor, [LEFT, TOP],"sub");
 
  mainPlot.labelDraw("N", NDX, NDY, NdFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("D", NDX, NDY, NdFunction.lineColor, [LEFT, TOP],"sub");

  mainPlot.labelDraw("N", NUX, NUY, NuFunction.lineColor, [RIGHT, CENTER], false, [2, 1.8]);
  mainPlot.labelDraw("U", NUX, NUY, NuFunction.lineColor, [LEFT, TOP],"sub");

  push();
    translate(mainPlot.GPLOT.pos[0] + mainPlot.GPLOT.mar[1], mainPlot.GPLOT.pos[1] + mainPlot.GPLOT.mar[2] + mainPlot.GPLOT.dim[1]);
    fill(mainPlot.GPLOT.boxBgColor.levels[0], mainPlot.GPLOT.boxBgColor.levels[1], mainPlot.GPLOT.boxBgColor.levels[2], SFunction.lineColor._array[3]*255);
    noStroke();
    rectMode(CENTER);
    rect(mainPlot.GPLOT.mainLayer.valueToXPlot(SX), mainPlot.GPLOT.mainLayer.valueToYPlot(SY), 30, 55);
  pop();
  
  mainPlot.subSuperDraw("N","D", SX, SY, SFunction.lineColor, "sub", 0, 0, -0.9*mainPlot.fontSize);
  mainPlot.subSuperDraw("N","U", SX, SY, SFunction.lineColor, "sub", 0, 0, 0.8*mainPlot.fontSize);
  mainPlot.drawLine(SX, SY, mainPlot.fontSize*3, 0, SFunction.lineColor, 1, mainPlot.fontSize*0.75, 0);

  if(choice == 1) {
    mainPlot.yaxisSubSuperDraw("N","D", 0, 1.4, SFunction.lineColor, "sub", -PI/2);
    mainPlot.yaxisSubSuperDraw("N","U", 0, 3.2, SFunction.lineColor, "sub", -PI/2);
  }

}

function updateJax() {
  if(mjready) {
    title = ``;
    var math = MathJax.Hub.getAllJax("title")[0];
    MathJax.Hub.Queue(["Text", math, title]);
  }
}