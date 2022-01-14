require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
  F : 1, // initial amount of liquid (constant)
  B : 1, // moles of liquid in the bottom kettle
  D : 0, // total moles of distillate collected
  z : 0.50, // initial mole fraction in the still (adjusted with slider)
  xB : 0.50, // concentration of more volatile component in the liquid in still
  xD : 0.74, // concentration of more volatile component in the vapor
  T : 359.5, // Temperature of the liquid/vapor
  display : "flasks", // which graphic to display on the right-side of the screen
  eq_plot : "no azeotrope", // which equilibrium plot to use
  flasks : [], // array of flask objects
  is_collecting : false, // whether or not liquid is currently being collected
  amount_to_collect : 0.10, // amount to be collected when user presses "collect"
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 530);
    p.noLoop();
    gvs.p = p;
    gvs.drawAll = require("./js/draw.js");
    gvs.Flask = require("./js/flasks.js");
    require("./js/inputs.js");
    require("./js/collect.js");
    gvs.flasks.push(new gvs.Flask({ x_loc : 356, y_loc : 370 }));
    document.getElementById("loading").style.display = "none";
  };

  p.draw = function () {
    p.background(253);
    gvs.drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);