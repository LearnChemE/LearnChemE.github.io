require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {

}

const backgroundFunctions = require("./js/background.js");
const containerElement = document.getElementById('p5-container');

const sketch = (p) => {

  p.setup = function() {
    p.createCanvas(600, 500);
    p.noLoop();
  };

  p.draw = function() {
    p.background(250);

  };
};

const P5 = new p5(sketch, containerElement);

const slider1 = document.getElementById("slider1");
const slider1Value = document.getElementById("slider1-value");
const slider2 = document.getElementById("slider2");
const slider2Value = document.getElementById("slider2-value");

slider1.addEventListener("input", () => {
  gvs.var1 = Number(Number(slider1.value).toFixed(2));
  slider1Value.innerHTML = Number(gvs.var1).toFixed(2);
  P5.redraw();
});

slider2.addEventListener("input", () => {
  gvs.var2 = Number(Number(slider2.value).toFixed(2));
  slider2Value.innerHTML = Number(gvs.var2).toFixed(2);
  P5.redraw();
});