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
  pipeHeightInPixels : 50,
  pipeHeightInMeters : 2.7,
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
  shapes.pipeVertical(200, 300, 20, sp.pipeHeightInPixels);
  shapes.elbow1(200, 300, 20);
  shapes.elbow2(200, 300 - sp.pipeHeightInPixels, 20);
  shapes.pipeHorizontal(254, 246.75 - sp.pipeHeightInPixels, 20, 100);
  shapes.doubleArrow(280, 320, sp.pipeHeightInPixels);

  textSize(16);
  text(`Δz = ${window.sp.pipeHeightInMeters} m`, 290, 295 - sp.pipeHeightInPixels / 2);

  shapes.singleArrow(20, 310, 95, 310);
  shapes.singleArrow(360, 257 - sp.pipeHeightInPixels, 450, 257 - sp.pipeHeightInPixels);
}

const heightSlider = document.getElementById("heightSlider");

heightSlider.addEventListener("input", function () {
  window.sp.pipeHeightInPixels = heightSlider.value;
  window.sp.pipeHeightInMeters = Number(0.25 + ( 9.75 * Number(heightSlider.value) / 200 )).toFixed(1);
});