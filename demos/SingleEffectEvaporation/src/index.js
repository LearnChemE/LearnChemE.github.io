require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
  t_inlet : 450, // K
  p_inlet : 1, // MPa
  t_steam : 500, // K
  p_steam : 2.6392, // MPa
  f_inlet : 15, // kg/s
};

// Handle sliders
require("./js/inputs.js");

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 500);
    p.noLoop();
    gvs.p = p;
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