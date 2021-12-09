require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
  t_inlet : 373, // feed temperature, K
  p_inlet : 1, // feed pressure, MPa
  t_steam : 500, // steam temperature, K
  p_steam : 2.6392, // steam pressure, MPa
  f_inlet : 15, // feed flowrate, kg/s
  s_inlet : 6, // steam flowrate, kg/s
  conc_inlet : 0.05, // fraction sugar
  evap_flowrate : 6.4, // flow rate of evaporated water, kg/s
  evaporator_t : 453, // temperature of the single-effect evaporator, K
  conc_flowrate : 8.6, // flow rate of concentrate, kg/s
  conc_concentrate : 0.088, // fraction of sugar in the concentrate stream
  steam_economy : 1.07, // steam economy, kg water/kg steam
};

// Handle sliders
require("./js/inputs.js");

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 530);
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