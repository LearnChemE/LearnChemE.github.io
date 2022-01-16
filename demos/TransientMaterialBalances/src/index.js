require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
  F0 : null, // Initial flow rate ( m^3/s )
  V0 : null, // Initial volume in tank
  x0 : null, // Initial mole fraciton
  is_running : false, // Is "true" once "start simulation" is pressed
  A : 0.785, // Area of the tank, m^2
  V : null, // Volume of liquid in the tank ( m^3 )
  h_tank : 0.785 * 1.5, // Height of the tank (m)
  h : null, // Height of the liquid (m)
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 530);
    gvs.p = p;
    gvs.drawAll = require("./js/draw.js");
    gvs.calcAll = require("./js/calcs.js");
    const { SVG_Graph } = require("./js/svg-graph-library.js");
    gvs.SVG_Graph = SVG_Graph;
    require("./js/inputs.js");
    gvs.handle_V0();
    gvs.handle_F0();
    gvs.handle_x0();
    gvs.V = gvs.V0;
    gvs.h = gvs.V / gvs.A;
  };

  p.draw = function () {
    p.background(253);
    gvs.calcAll();
    gvs.drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);