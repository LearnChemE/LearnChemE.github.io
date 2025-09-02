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
  p_conc : 0.3, // concentrate pressure, MPa
  t_steam : 500, // steam temperature, K
  p_steam : 2.6392, // steam pressure, MPa
  f_inlet : 10, // feed flowrate, kg/s
  s_inlet : 6, // steam flowrate, kg/s
  conc_inlet : 0.05, // weight fraction sugar
  evap_flowrate : 6.4, // flow rate of evaporated water, kg/s
  t_evaporator : 406.67, // temperature of the single-effect evaporator, K
  conc_flowrate : 8.6, // flow rate of concentrate, kg/s
  conc_concentrate : 0.088, // weight fraction of sugar in the concentrate stream
  steam_economy : 1.07, // steam economy, kg water/kg steam
  hx_U : 2500, // overall heat transfer coefficient of heat exchanger, W / (m^2*K)
  hx_A : 56, // heat exchanger area, m^2
  Q : 0, // heat exchanger heat transfer value, J
  Hvap_steam : 1835350, // latent heat of vaporization for steam at 2.64 MPa, J/kg
  Hvap_conc : 2014160, // latent heat of vaporization for concentrate at 1 MPa, J/kg
  Cp_conc : 0, // heat capacity of sugar concentrate, J/kg
  MW_sugar : .3422965, // molecular weight of sucrose (kg / mol)
  MW_water : .01801528, // molecular weight of water (kg / mol)
  xs_inlet : 0.0028, // mole fraction sugar in the inlet
  xw_inlet : 0.9972, // mole fraction water in the inlet
  xs_conc : 0.0051, // mole fraction sugar in the concentrate
  xw_conc : 0.9949, // mole fraction water in the concentrate
};

// Handle sliders
require("./js/inputs.js");

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 530);
    p.textFont("Inter");
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