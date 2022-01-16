require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {

};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 530);
    p.noLoop();
    gvs.p = p;
    gvs.drawAll = require("./js/draw.js");
    gvs.calcAll = require("./js/calcs.js");
    const { SVG_Graph } = require("./js/svg-graph-library.js");
    gvs.SVG_Graph = SVG_Graph;
    require("./js/inputs.js");
  };

  p.draw = function () {
    p.background(253);
    gvs.calcAll();
    gvs.drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);