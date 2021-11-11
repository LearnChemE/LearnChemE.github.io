require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
  T: Number(document.getElementById("t-slider").value) + 273.15,
  T_rxn: Number(document.getElementById("t-slider").value) + 273.15,
  position: 0,
  reaction: "acetylene hydrogenation",
  H: function (T, X) {},
  Hrxn: 0,
  H_std_rxn: 0,
  currentH: 0,
  xRange: [0, 1],
  yRange: [0, 1],
  chemicals: {}
};

// JavaScript modules from /js/ folder
require("./js/addChemicals.js"); // adds chemicals and chemical properties to window.gvs.chemicals object
const {
  calcAll
} = require("./js/calcs.js"); // contains all calculation-related functions
const {
  drawAll
} = require("./js/draw.js"); // contains all drawing-related functionality

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
const tValue = document.getElementById("t-value");
const selectReaction = document.getElementById("select-reaction");
const beginCalculation = document.getElementById("begin-calculation");
const equationInstructions = document.getElementById("equation-instructions");
const reactionContainer = document.getElementById("reaction-container");
const equationContainer = document.getElementById("equation-container");
const equationContainer_part1 = document.getElementById("eq-1");
const equationContainer_part2 = document.getElementById("eq-2");
const equationContainer_part3 = document.getElementById("eq-3");
const equationContainer_part4 = document.getElementById("eq-4");


tSlider.addEventListener("input", () => {
  gvs.T_rxn = Number(Number(tSlider.value).toFixed(0)) + 273.15;
  tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));
  P5.redraw();
});

selectReaction.addEventListener("change", () => {
  changeReaction(selectReaction.value);
  P5.redraw();
});

tSlider.addEventListener("change", () => {
  equationContainer_part1.innerHTML = `$$ \\int_{${Math.round(gvs.T_rxn - 273.15)}^{ \\circ }}^{25^{ \\circ }} c_{p,r} dT $$`;
  equationContainer_part3.innerHTML = `$$ + \\int_{25^{ \\circ }}^{${Math.round(gvs.T_rxn - 273.15)}^{ \\circ }} c_{p,p} dT $$`;
  equationContainer_part4.innerHTML = `$$ =  ${gvs.Hrxn.toFixed(1)} \\; \\mathrm{ \\frac{ kJ }{ mol } } $$`
  window.MathJax.typeset();
});

beginCalculation.addEventListener("click", () => {
  if( beginCalculation.innerHTML !== "Reset" ) {
    equationInstructions.style.opacity = "0";
    gvs.position = 0;
    equationContainer_part1.style.opacity = "1";
    equationContainer_part2.style.opacity = "0";
    equationContainer_part3.style.opacity = "0";
    equationContainer_part4.style.opacity = "0";
    beginCalculation.innerHTML = "Reset";
    beginCalculation.classList.remove("btn-success");
    beginCalculation.classList.add("btn-danger");
    tSlider.setAttribute("disabled", "yes");
    runCalcs();
  } else {
    window.setTimeout(() => { equationInstructions.style.opacity = "1" }, 500);
    beginCalculation.innerHTML = "Calculate &Delta;H<sub>rxn</sub>";
    beginCalculation.classList.add("btn-success");
    beginCalculation.classList.remove("btn-danger");
    equationContainer_part1.style.opacity = "0";
    equationContainer_part2.style.opacity = "0";
    equationContainer_part3.style.opacity = "0";
    equationContainer_part4.style.opacity = "0";
    gvs.position = 0;
    tSlider.removeAttribute("disabled");
    P5.redraw();
  }
});

function runCalcs() {
  if (gvs.position < 1 || gvs.position > 2) {
    gvs.position += 0.012;
  } else {
    gvs.position += 0.006;
  }
  
  if ( gvs.position >= 1 ) {
    equationContainer_part2.style.opacity = "1";
  }

  if ( gvs.position >= 2 ) {
    equationContainer_part3.style.opacity = "1";
  }

  if ( gvs.position >= 3 ) {
    equationContainer_part4.style.opacity = "1";
  }

  P5.redraw();
  if (gvs.position < 3) {
    window.setTimeout(() => {
      if( gvs.position !== 0 ) {
        runCalcs()
      }
    }, 16.7);
  } else {
    equationContainer_part4.style.opacity = "1";
    tSlider.removeAttribute("disabled");
    
  }
}

function changeReaction(rxn) {
  switch (rxn) {
    case "1":
      gvs.reaction = "acetylene hydrogenation";
      gvs.xRange = [-20, 320];
      gvs.yRange = [25, 1200];
      tSlider.setAttribute("min", "30");
      tSlider.setAttribute("max", "1000");
      tSlider.setAttribute("step", "1");
      gvs.T = gvs.p.constrain(gvs.T - 273.15, 30, 900) + 273.15;
      tSlider.value = String(gvs.T - 273.15);
      tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));
      gvs.H = function (T, X) {
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

      gvs.H = function (T, X) {
        const H0 = gvs.chemicals.methane.enthalpy(T) + 2 * gvs.chemicals.oxygen.enthalpy(T);
        const H1 = gvs.chemicals.carbondioxide.enthalpy(T) + 2 * gvs.chemicals.water.enthalpy(T);
        return H0 + X * (H1 - H0);
      }
      gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
      reactionContainer.innerHTML = `\\( \\mathrm{ C_{2} H_{4} + 2 \\; O_{2} \\longrightarrow CO_{2} + 2 \\; H_{2} O } \\)`;
      break;

    case "3":
      gvs.reaction = "carbon monoxide oxidation";

      gvs.xRange = [-520, 20];
      gvs.yRange = [0, 1200];

      tSlider.setAttribute("min", "25");
      tSlider.setAttribute("max", "1000");
      tSlider.setAttribute("step", "5");

      gvs.T = gvs.p.constrain(gvs.T - 273.15, 30, 5500) + 273.15;

      tSlider.value = String(gvs.T - 273.15);
      tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));

      gvs.H = function (T, X) {
        const H0 = gvs.chemicals.carbonmonoxide.enthalpy(T) + 0.5 * gvs.chemicals.oxygen.enthalpy(T);
        const H1 = gvs.chemicals.carbondioxide.enthalpy(T);
        return H0 + X * (H1 - H0);
      }
      gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
      reactionContainer.innerHTML = `\\( \\mathrm{ C O + \\frac{1}{2} \\; O_{2} \\longrightarrow CO_{2} } \\)`;
      break;

    case "4":
      gvs.reaction = "haber bosch process";

      gvs.xRange = [-150, 150];
      gvs.yRange = [0, 1200];

      tSlider.setAttribute("min", "25");
      tSlider.setAttribute("max", "1000");
      tSlider.setAttribute("step", "5");

      gvs.T = gvs.p.constrain(gvs.T - 273.15, 30, 1200) + 273.15;

      tSlider.value = String(gvs.T - 273.15);
      tValue.innerHTML = Number(Number(tSlider.value).toFixed(0));

      gvs.H = function (T, X) {
        const H0 = gvs.chemicals.nitrogen.enthalpy(T) + 3 * gvs.chemicals.hydrogen.enthalpy(T);
        const H1 = 2 * gvs.chemicals.ammonia.enthalpy(T);
        return H0 + X * (H1 - H0);
      }
      gvs.Hrxn = gvs.H(gvs.T, 1) - gvs.H(gvs.T, 0);
      reactionContainer.innerHTML = `\\( \\mathrm{ N_{2} + 3 \\; H_{2} \\longrightarrow 2 \\; NH_{3} } \\)`;
      break;
  };
  if(beginCalculation.innerHTML === "Reset") { beginCalculation.click() }
  equationContainer_part1.innerHTML = `$$ \\int_{${Math.round(gvs.T_rxn - 273.15)}^{ \\circ }}^{25^{ \\circ }} c_{p,r} dT $$`;
  equationContainer_part3.innerHTML = `$$ + \\int_{25^{ \\circ }}^{${Math.round(gvs.T_rxn - 273.15)}^{ \\circ }} c_{p,p} dT $$`;
  equationContainer_part4.innerHTML = `$$ =  ${gvs.Hrxn.toFixed(1)} \\; \\mathrm{ \\frac{ kJ }{ mol } } $$`
  tSlider.removeAttribute("disabled");
  window.MathJax.typeset();
}