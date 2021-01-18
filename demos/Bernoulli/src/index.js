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
  background(240);
  shapes.pipeHorizontal(100, 300, 20, 100);
  shapes.pipeVertical(200, 300, 20, sp.pipeHeight);
  shapes.elbow1(200, 300, 20);
  shapes.elbow2(200, 300 - sp.pipeHeight, 20);
  shapes.pipeHorizontal(254, 246.75 - sp.pipeHeight, 20, 100);
  shapes.doubleArrow(280, 320, sp.pipeHeight);

  textSize(16);
  text(`Δz = ${Number(window.sp.pipeHeight) + 50} cm`, 290, 295 - sp.pipeHeight / 2);
}

const heightSlider = document.getElementById("heightSlider");

heightSlider.addEventListener("input", function () {
  window.sp.pipeHeight = heightSlider.value;
});