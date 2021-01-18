// Load libraries
require("./style/style.scss");
require("../dist/mathjax.js");
window.jQuery = require("jquery");
window.$ = window.jQuery;
window.p5 = require("p5");
window.shapes = require("./js/shapes.js");

// Declare global variables (sp represents "sketch properties")
window.sp = {
  width : 500,
  height : 400,
  pipeHeight : 50,
}

window.setup = function() {
  createCanvas(sp.width, sp.height);

  windowResized = () => {
    console.log("resize window");
  }
}

window.draw = function() {
  background(200);
  shapes.pipeHorizontal(70, 300, 20, 100);
  shapes.pipeVertical(170, 300, 20, sp.pipeHeight);
  shapes.elbow1(170, 300, 20);
  shapes.elbow2(170, 300 - sp.pipeHeight, 20);
  shapes.pipeHorizontal(224, 246.75 - sp.pipeHeight, 20, 100);
}

const heightSlider = document.getElementById("heightSlider");

heightSlider.addEventListener("input", function () {
  window.sp.pipeHeight = heightSlider.value;
});