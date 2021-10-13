require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
  T: Number(document.getElementById("t-slider").value) + 273.15,
  X: Number(document.getElementById("x-slider").value),
  reaction: "acetylene hydrogenation",
  H: function(T, X) {},
  Hrxn: 0,
  currentH: 0,
  xRange: [0, 1],
  yRange: [0, 1],
  chemicals: {}
};

// JavaScript modules from /js/ folder
require("./js/addChemicals.js"); // adds chemicals and chemical properties to window.gvs.chemicals object
const { calcAll } = require("./js/calcs.js"); // contains all calculation-related functions
const { drawAll } = require("./js/draw.js"); // contains all drawing-related functionality

const containerElement = document.getElementById("p5-container");


const sketch = (p) => {

  p.setup = function () {
      p.createCanvas(600, 500);
      p.noLoop();
      gvs.p = p;
      changeReaction("1");
      document.getElementById("loading").style.display = "none";
  };

  p.draw = function () {
      p.background(253);
      calcAll();
      drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);

const tSlider = document.getElementById("t-slider");
const xSlider = document.getElementById("x-slider");
const tValue = document.getElementById("t-value");
const xValue = document.getElementById("x-value");
const selectReaction = document.getElementById("select-reaction");
const reactionContainer = document.getElementById("reaction-container");

tSlider.addEventListener("input", () => {
  gvs.T = Number(Number(tSlider.value).toFixed(0)) + 273.15;
  tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));
  P5.redraw();
});

xSlider.addEventListener("input", () => {
  gvs.X = Number(Number(xSlider.value).toFixed(2));
  xValue.innerHTML = Number(gvs.X).toFixed(2);
  P5.redraw();
});

selectReaction.addEventListener("change", () => {
  changeReaction(selectReaction.value);
  P5.redraw();
});

function changeReaction(rxn) {
  switch( rxn ) {
      case "1":
          gvs.reaction = "acetylene hydrogenation";
          gvs.xRange = [0, 320];
          gvs.yRange = [25, 1000];
          tSlider.setAttribute("min", "30");
          tSlider.setAttribute("max", "900");
          tSlider.setAttribute("step", "1");
          gvs.T = gvs.p.constrain(gvs.T - 273.15, 30, 900) + 273.15;
          tSlider.value = String(gvs.T - 273.15);
          tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));
          gvs.H = function(T, X) {
              const H0 = gvs.chemicals.hydrogen.enthalpy(T) + gvs.chemicals.acetylene.enthalpy(T);
              const H1 = gvs.chemicals.ethylene.enthalpy(T);
              return H0 + X * (H1 - H0);
          }
          gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
          reactionContainer.innerHTML = `\\( \\mathrm{ C_{2} H_{2} + H_{2} \\longrightarrow C_{2} H_{4} } \\)`;
      break;

      case "2":
          gvs.reaction = "methane combustion";

          gvs.xRange = [-1200, 200];
          gvs.yRange = [0, 220];

          tSlider.setAttribute("min", "25");
          tSlider.setAttribute("max", "200");
          tSlider.setAttribute("step", "1");

          gvs.T = gvs.p.constrain(gvs.T - 273.15, 25, 200) + 273.15;
          tSlider.value = String(gvs.T - 273.15);
          tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));

          gvs.H = function(T, X) {
              const H0 = gvs.chemicals.methane.enthalpy(T) + 2 * gvs.chemicals.oxygen.enthalpy(T);
              const H1 = gvs.chemicals.carbondioxide.enthalpy(T) + 2 * gvs.chemicals.water.enthalpy(T);
              return H0 + X * (H1 - H0);
          }
          gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
          reactionContainer.innerHTML = `\\( \\mathrm{ C_{2} H_{4} + 2 \\; O_{2} \\longrightarrow CO_{2} + 2 \\; H_{2} O } \\)`;
      break;
      
      case "3":
          gvs.reaction = "carbon monoxide oxidation";

          gvs.xRange = [-450, 20];
          gvs.yRange = [0, 2100];

          tSlider.setAttribute("min", "25");
          tSlider.setAttribute("max", "2000");
          tSlider.setAttribute("step", "5");

          gvs.T = gvs.p.constrain(gvs.T - 273.15, 30, 5500) + 273.15;
          
          tSlider.value = String(gvs.T - 273.15);
          tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));

          gvs.H = function(T, X) {
              const H0 = gvs.chemicals.carbonmonoxide.enthalpy(T) + 0.5 * gvs.chemicals.oxygen.enthalpy(T);
              const H1 = gvs.chemicals.carbondioxide.enthalpy(T);
              return H0 + X * (H1 - H0);
          }
          gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
          reactionContainer.innerHTML = `\\( \\mathrm{ C O + \\frac{1}{2} \\; O_{2} \\longrightarrow CO_{2} } \\)`;
      break;

      case "4":
          gvs.reaction = "haber bosch process";

          gvs.xRange = [-150, 160];
          gvs.yRange = [0, 2000];

          tSlider.setAttribute("min", "25");
          tSlider.setAttribute("max", "1200");
          tSlider.setAttribute("step", "5");

          gvs.T = gvs.p.constrain(gvs.T - 273.15, 30, 1200) + 273.15;
          
          tSlider.value = String(gvs.T - 273.15);
          tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));

          gvs.H = function(T, X) {
              const H0 = gvs.chemicals.nitrogen.enthalpy(T) + 3 * gvs.chemicals.hydrogen.enthalpy(T);
              const H1 = 2 * gvs.chemicals.ammonia.enthalpy(T);
              return H0 + X * (H1 - H0);
          }
          gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
          reactionContainer.innerHTML = `\\( \\mathrm{ N_{2} + 3 \\; H_{2} \\longrightarrow 2 \\; NH_{3} } \\)`;
      break;
  };
  window.MathJax.typeset();
}