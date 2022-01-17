require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:
// label tank pressure and temperature
// directions + details

// GLOBAL VARIABLES OBJECT
window.gvs = {
  t_inlet : 350, // feed temperature, K
  p_inlet : 0.3, // feed pressure, MPa
  P1 : 0.3, // concentrate pressure of first stage, MPa
  P2 : 0.10, // concentrate pressure of first stage, MPa
  P3 : 0.001, // concentrate pressure of first stage, MPa
  t_steam : 500, // steam temperature, K
  p_steam : 2.6392, // steam pressure, MPa
  f_inlet : 20, // feed flowrate, kg/s
  s_inlet : 6, // steam flowrate, kg/s
  conc_inlet : 0.05, // weight fraction sugar
  conc_outlet : 0.05, // weight fraction sugar in concentrate
  steam_economy : 1.07, // steam economy, kg water/kg steam
  hx_U : 2500, // overall heat transfer coefficient of heat exchanger, W / (m^2*K)
  hx_A : 56, // heat exchanger area, m^2
  Q1 : 0, // 1st heat exchanger heat transfer value, J
  Q2 : 0, // 2nd heat exchanger heat transfer value, J
  Q3 : 0, // 3rd heat exchanger heat transfer value, J
  Hvap_steam : 1835350, // latent heat of vaporization for steam at 2.64 MPa, J/kg
  Hvap_conc : 2014160, // latent heat of vaporization for concentrate at 1 MPa, J/kg
  Cp_conc : 0, // heat capacity of sugar concentrate, J/kg
  MW_sugar : .3422965, // molecular weight of sucrose (kg / mol)
  MW_water : .01801528, // molecular weight of water (kg / mol)
  xs_inlet : 0.0028, // mole fraction sugar in the inlet
  xw_inlet : 0.9972, // mole fraction water in the inlet
  xs_conc : 0.0051, // mole fraction sugar in the concentrate
  xw_conc : 0.9949, // mole fraction water in the concentrate
  V1 : 0,
  L1 : 0,
  T1 : 408,
  V2 : 0,
  L2 : 0,
  T2 : 408,
  V3 : 0,
  L3 : 0,
  T3 : 408,
};

// Handle sliders
require("./js/inputs.js");

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(900, 580);
    p.noLoop();
    gvs.p = p;
    p.textSize(17);
    gvs.calcAll = require("./js/calcs.js");
    gvs.drawAll = require("./js/draw.js");
    document.getElementById("loading").style.display = "none";
  };

  p.draw = function () {
    p.background(253);
    gvs.calcAll();
    gvs.drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);