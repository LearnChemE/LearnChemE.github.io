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
  xD : 1, // concentration of more volatile component in the vapor
  display : "flasks", // which graphic to display on the right-side of the screen
  flasks : [], // array of flask objects
  is_collecting : false, // whether or not liquid is currently being collected
  amount_to_collect : 0.10, // amount to be collected when user presses "collect"

};

// Handle sliders
require("./js/inputs.js");

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 530);
    // p.noLoop();
    gvs.p = p;
    gvs.calcAll = require("./js/calcs.js");
    gvs.drawAll = require("./js/draw.js");
    gvs.Flask = require("./js/flasks.js");
    gvs.flasks.push(new gvs.Flask({ x_loc : 356, y_loc : 370 }));
    document.getElementById("loading").style.display = "none";
  };

  p.draw = function () {
    p.background(253);
    gvs.calcAll();
    gvs.drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);