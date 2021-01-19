// Load libraries
require("./style/style.scss");
require("../dist/mathjax.js");
window.jQuery = require("jquery");
window.$ = window.jQuery;
window.p5 = require("p5");
window.shapes = require("./js/shapes.js");

// Declare global variables (sp represents "sketch properties")
window.sp = {
  width : 550,
  height : 400,
  pipeHeightInPixels : 50,
  pipeHeightInMeters : 2.7,
  pipeDiameterInletInPixels : 20,
  pipeDiameterInletInMeters : 0.05,
  pipeDiameterOutletInPixels : 20,
  pipeDiameterOutletInCentimeters: 5,
  inletPressure : 100,
  inletVelocity : 1,
  outletPressure : 100,
  outletVelocity : 1,
}

window.setup = function() {
  createCanvas(sp.width, sp.height);

  windowResized = () => {
    console.log("resize window");
  }
}

window.draw = function() {
  background(240);
  translate(10, 20);
  shapes.pipeHorizontal(100, 300, Number(sp.pipeDiameterInletInPixels), 100);
  shapes.pipeVertical(200, 300, Number(sp.pipeDiameterInletInPixels), sp.pipeHeightInPixels);
  shapes.elbow1(200, 300, Number(sp.pipeDiameterInletInPixels));
  shapes.elbow2(200, 300 - sp.pipeHeightInPixels, Number(sp.pipeDiameterInletInPixels));
  shapes.pipeHorizontal(294, 256.75 - Number(sp.pipeHeightInPixels) - Number(sp.pipeDiameterOutletInPixels) / 2, window.sp.pipeDiameterOutletInPixels, 100);
  shapes.expander(254, 256.75 - Number(sp.pipeHeightInPixels) - Number(sp.pipeDiameterInletInPixels) / 2, Number(sp.pipeDiameterInletInPixels), Number(sp.pipeDiameterOutletInPixels));
  shapes.doubleArrow(250, 320, sp.pipeHeightInPixels - (Number(sp.pipeDiameterInletInPixels) - 20) / 2 - 5);

  textSize(16);
  text(`Δz = ${window.sp.pipeHeightInMeters} m`, 260, 300 - sp.pipeHeightInPixels / 2);
  push();
    text(`D   = ${Number(Number(window.sp.pipeDiameterInletInMeters) * 100).toFixed(1)} cm`, 20, 230);
    text(`P   = ${window.sp.inletPressure} kPa`, 20, 260);
    text(`u   = ${window.sp.inletVelocity} m/s`, 20, 290);
    text(`D     = ${Number( Number(window.sp.pipeDiameterOutletInCentimeters)).toFixed(1)} cm`, 410, 285 - Number(window.sp.pipeHeightInPixels));
    text(`P     = ${window.sp.outletPressure} kPa`, 410, 315 - Number(window.sp.pipeHeightInPixels));
    text(`u     = ${window.sp.outletVelocity} m/s`, 410, 340 - Number(window.sp.pipeHeightInPixels));
    textSize(12);
    text(`in`, 30, 295);
    text(`in`, 30, 265);
    text(`in`, 32, 235);
    text(`out`, 420, 320 - Number(window.sp.pipeHeightInPixels));
    text(`out`, 420, 345 - Number(window.sp.pipeHeightInPixels));
    text(`out`, 420, 290 - Number(window.sp.pipeHeightInPixels));
  pop();


  shapes.singleArrow(20, 310, 95, 310);
  shapes.singleArrow(400, 257 - sp.pipeHeightInPixels, 460, 257 - sp.pipeHeightInPixels);
}

function calculate() {
  const dz = Number.parseFloat(window.sp.pipeHeightInMeters); // change in height (m)
  const Pin = Number.parseFloat(window.sp.inletPressure) * 1000; // inlet pressure (Pa)
  const vin = Number.parseFloat(window.sp.inletVelocity); // inlet velocity (m/s)
  const Din = Number.parseFloat(window.sp.pipeDiameterInletInMeters); // inlet pipe diameter (m)
  const Dout = Number.parseFloat(window.sp.pipeDiameterOutletInCentimeters) / 100; // outlet pipe diameter (m)
  const g = 9.81; // gravitational acceleration (m/s^2)
  const rho = 1000; // fluid density (kg / m^3)
  
  const inletArea = PI * (Din / 2)**2;
  const outletArea = PI * (Dout / 2)**2;

  const outletVelocity = ( vin * inletArea ) / outletArea;
  const outletPressure = Pin + ( rho * (vin**2) / 2 ) - ( rho * (outletVelocity**2) / 2 ) - g * dz * rho;

  window.sp.outletPressure = Number(Math.round(outletPressure) / 1000).toFixed(0);
  window.sp.outletVelocity = Number(outletVelocity).toFixed(1);
};

const heightSlider = document.getElementById("heightSlider");

heightSlider.addEventListener("input", function () {
  window.sp.pipeHeightInPixels = heightSlider.value;
  window.sp.pipeHeightInMeters = Number(0.25 + ( 9.75 * Number(heightSlider.value) / 200 )).toFixed(1);
  document.getElementById("height-value").innerHTML = window.sp.pipeHeightInMeters;
  calculate();
});

const outletDiameterSlider = document.getElementById("outletDiameterSlider");

outletDiameterSlider.addEventListener("input", function () {
  window.sp.pipeDiameterOutletInPixels = outletDiameterSlider.value;
  window.sp.pipeDiameterOutletInCentimeters = Number( Number(outletDiameterSlider.value) / 4 ).toFixed(1);
  document.getElementById("outlet-diameter-value").innerHTML = window.sp.pipeDiameterOutletInCentimeters;
  calculate();
});

const inletPressureSlider = document.getElementById("inletPressureSlider");

inletPressureSlider.addEventListener("input", function () {
  window.sp.inletPressure = Number(inletPressureSlider.value).toFixed(0);
  document.getElementById("inlet-pressure-value").innerHTML = window.sp.inletPressure;
  calculate();
});

const inletVelocitySlider = document.getElementById("inletVelocitySlider");

inletVelocitySlider.addEventListener("input", function() {
  window.sp.inletVelocity = Number(inletVelocitySlider.value).toFixed(1);
  document.getElementById("inlet-velocity-value").innerHTML = window.sp.inletVelocity;
  calculate();
})