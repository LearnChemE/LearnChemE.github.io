require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {

};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

  p.setup = function () {
    p.createCanvas(800, 500);
    p.noLoop();
    gvs.p = p;
    document.getElementById("loading").style.display = "none";
  };

  p.draw = function () {
    p.background(253);
    calcAll();
    drawAll(p);
  };

};

const P5 = new p5(sketch, containerElement);