require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
  dpdx: 0,
  U0: 0.15,
}

const backgroundShapes = require("./js/background.js");
const arrowsAndCurves = require("./js/flowProfile.js");
const containerElement = document.getElementById('p5-container');

const sketch = (p) => {

  p.setup = function() {
    p.createCanvas(600, 500);
    p.frameRate(1);
  };

  p.draw = function() {
    p.background(250);
    backgroundShapes.drawPlates(p);
    backgroundShapes.drawAxis(p);
    backgroundShapes.drawText(p);
    arrowsAndCurves.drawArrows(p);
    arrowsAndCurves.drawCurve(p);
  };
};

new p5(sketch, containerElement);

const dpdxSlider = document.getElementById("dpdx-slider");
const U0Slider = document.getElementById("U0-slider");
const dpdxValue = document.getElementById("dpdx-value");
const U0Value = document.getElementById("U0-value");

dpdxSlider.addEventListener("input", () => {
  gvs.dpdx = -1 * Number(Number(dpdxSlider.value).toFixed(2));
  dpdxValue.innerHTML = Number(gvs.dpdx).toFixed(2);
});

U0Slider.addEventListener("input", () => {
  gvs.U0 = Number(Number(U0Slider.value).toFixed(2));
  U0Value.innerHTML = Number(gvs.U0).toFixed(2);
});