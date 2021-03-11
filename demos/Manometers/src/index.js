require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
  manometerChoice: "piezometer",
  fluidChoice: "water",
  fluidColor: "rgba(0, 0, 255, 0.5)",
  pipeColor: "rgba(200, 200, 200, 0.15)",
  h: 0.375, // meters
  hInPixels: 0,
  rhom: 1000, // density of manometer fluid, kg/m^3
  Pf: 105000, // hydrostatic pressure, Pa 
  theta: 35, // angle of inclined manometer, degrees
  defaultCamera: function() { P5.camera(0, -60, 400, 0, -10, 0, 0, 1, 0); },
  cnvText: null,
  clickedLocation: [0, false]
}

const manometers = require("./js/manometers.js");
const containerElement = document.getElementById('p5-container');

gvs.findFluidHeight = function() {
  const gamma = gvs.rhom * 9.81; // specific weight
  const Patm = 101325;
  const h = (gvs.Pf - Patm) / gamma;
  gvs.h = h;
  switch(gvs.manometerChoice) {
    case "piezometer":
      gvs.hInPixels = gvs.h * 230;
    break;
    
    case "utube":
      gvs.hInPixels = gvs.h * 300;
    break;

    case "inclined":
      gvs.hInPixels = gvs.h * 85;
    break;
  }
}

const sketch = (p) => {

  p.preload = function() {
    gvs.cnvText = p.loadFont('./assets/NotoSans-Regular.ttf');
  }

  p.setup = function() {
    const cnv = p.createCanvas(600, 500, p.WEBGL);
    const cnvElt = document.getElementsByTagName("canvas");
    cnvElt[0].addEventListener("mouseenter", function() { P5.loop(); });
    cnvElt[0].addEventListener("mouseleave", function() { P5.noLoop(); });
    cnvElt[0].addEventListener("wheel", e => {e.preventDefault()});
    gvs.defaultCamera();
    cnv.mouseWheel(gvs.zoom);
    gvs.findFluidHeight();
    p.textFont(gvs.cnvText);
    p.noLoop();
  };

  p.draw = function() {
    p.background(255);
    p.orbitControl();
    p.ambientLight(100);
    p.pointLight(250, 250, 250, 50, 50, 50);
    p.noStroke();
    switch(gvs.manometerChoice) {
      case "piezometer":
        manometers.drawPiezometer(p);
        break;
      case "utube":
        manometers.drawUTube(p);
        break;
      case "inclined":
        manometers.drawInclined(p);
        break;
    }
    if(p.mouseIsPressed && p.mouseButton === p.CENTER) {
      if( gvs.clickedLocation[1] ) {
        const delta = p.mouseY - gvs.clickedLocation[0];
        window.P5._renderer._curCamera.move(0, -delta / 2, 0);
        gvs.clickedLocation[0] = p.mouseY;
      } else {
        gvs.clickedLocation[0] = p.mouseY;
      }
      gvs.clickedLocation[1] = true;
    } else {
      gvs.clickedLocation[1] = false;
    }
  };

};

window.P5 = new p5(sketch, containerElement);

const pressureSlider = document.getElementById("pressure-slider");
const angleSlider = document.getElementById("angle-slider");
const pressureValue = document.getElementById("pressure-value");
const angleValue = document.getElementById("angle-value");

pressureSlider.addEventListener("input", () => {
  gvs.Pf = Number(pressureSlider.value);
  pressureValue.innerHTML = Number(gvs.Pf / 1000).toFixed(1);
  gvs.findFluidHeight();
  P5.redraw();
});

angleSlider.addEventListener("input", () => {
  gvs.theta = Number(angleSlider.value);
  angleValue.innerHTML = Number(gvs.theta).toFixed(1);
  gvs.findFluidHeight();
  P5.redraw();
});

const selectFluid = document.getElementById("select-fluid").children;
const selectManometer = document.getElementById("select-manometer").children;

function limitPressureSlider() {
  const current = Number(pressureSlider.value);
  const limited = Math.min(110000, current);
  pressureSlider.value = `${limited}`;
  gvs.Pf = limited;
  pressureValue.innerHTML = Number(limited / 1000).toFixed(1);
  pressureSlider.setAttribute("max", "110000");
}

for ( let i = 0; i < selectFluid.length; i++ ) {
  selectFluid[i].addEventListener("click", function() {
    
    for ( let j = 0; j < selectFluid.length; j++ ) { 
      selectFluid[j].classList.remove("selected");
    };

    selectFluid[i].classList.add("selected");
    gvs.fluidChoice = selectFluid[i].value;

    switch(selectFluid[i].value) {
      case "water":
        gvs.rhom = 1000;
        gvs.fluidColor = "rgba(0, 0, 255, 0.5)";
        limitPressureSlider()
        break;
      case "oil":
        gvs.rhom = 880;
        gvs.fluidColor = "rgba(200, 200, 0, 0.5)";
        limitPressureSlider()
        break;
      case "mercury":
        gvs.rhom = 13600;
        gvs.fluidColor = "rgba(100, 100, 100, 0.5)";
        pressureSlider.setAttribute("max", "220000");
        break;
    };
    gvs.findFluidHeight();
    P5.redraw();
  });
};

for ( let i = 0; i < selectManometer.length; i++ ) {
  selectManometer[i].addEventListener("click", function() {
    
    for ( let j = 0; j < selectManometer.length; j++ ) { 
      selectManometer[j].classList.remove("selected");
    };

    selectManometer[i].classList.add("selected");
    gvs.manometerChoice = selectManometer[i].value;

    if(gvs.manometerChoice === "inclined") {
      document.getElementById("angle-block").classList.remove("hidden");
    } else {
      document.getElementById("angle-block").classList.add("hidden");
    }
    gvs.findFluidHeight();
    P5.redraw();
  });
};

document.getElementById("reset-camera").addEventListener("click", function() {
  gvs.defaultCamera();
  P5.redraw();
});

window.gvs.zoom = function(event) {
  // zoom according to direction of mouseWheelDeltaY rather than value
  let sensitivityZoom = 0.05;
  let scaleFactor = window.P5.height;
  if (event.deltaY > 0) {
    window.P5._renderer._curCamera._orbit(0, 0, sensitivityZoom * scaleFactor);
  } else {
    window.P5._renderer._curCamera._orbit(0, 0, -sensitivityZoom * scaleFactor);
  }
}