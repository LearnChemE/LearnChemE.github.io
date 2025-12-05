import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll } from "./js/draw";
import { handleInputs } from "./js/inputs";
import { calcAll, setDefaults } from "./js/calcs";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  showButtons: false,
  mode: "compressor",
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [150, 120],
};



const containerElement = document.getElementById("p5-container");

window.setup = async function () {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  setDefaults();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
  // Use system font because it often has the best subscripts 
};

window.draw = function () {
  window.width = state.canvasSize[0];
  window.height = state.canvasSize[1];
  scale(relativeSize());
  background(255);
  drawAll();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 150;

function sizeContainer() {
  containerElement.style.width = `calc(100vw - 10px)`;
  containerElement.style.maxWidth = `calc(calc(100vh - 10px) * ${state.canvasSize[0]} / ${state.canvasSize[1]})`;
  containerElement.style.height = `calc(calc(100vw - 10px) * ${state.canvasSize[1]} / ${state.canvasSize[0]})`;
  containerElement.style.maxHeight = `calc(100vh - 10px)`;
}

document.addEventListener("DOMContentLoaded", () => {
  const btnPressure = document.getElementById("btn-pressure");
  const btnTemperature = document.getElementById("btn-temperature");
  const btnCompressor = document.getElementById("btn-compressor");
  const btnTurbine = document.getElementById("btn-turbine");

  const outletSlider = document.getElementById("outlet-slider");
  const outletLabel = document.getElementById("outlet-label");
  const outletValue = document.getElementById("outlet-value");

  const eta1 = document.getElementById("eta1");
  const eta2 = document.getElementById("eta2");
  const eta1Val = document.getElementById("eta1-value");
  const eta2Val = document.getElementById("eta2-value");

  function setActiveButton(group, selectedId) {
    document.querySelectorAll(`#${group} button`).forEach(btn => {
      btn.classList.remove("active");
    });
    document.getElementById(selectedId).classList.add("active");
  }

  function getSelected(group) {
    return document.querySelector(`#${group} button.active`).textContent;
  }

  function updateOutletSlider() {
    const outletType = getSelected("outlet-buttons");
    const machineType = getSelected("machine-buttons");

    outletLabel.textContent = outletType === "pressure"
      ? "outlet pressure (bar):"
      : "outlet temperature (K)";

    if (outletType === "pressure" && machineType === "compressor") {
      outletSlider.min = 10;
      outletSlider.max = 20;
      outletSlider.step = 1;
    } else if (outletType === "pressure") {
      outletSlider.min = 0.8;
      outletSlider.max = 2;
      outletSlider.step = 0.1;
    } else if (machineType === "compressor") {
      outletSlider.min = 500;
      outletSlider.max = 650;
      outletSlider.step = 1;
    } else {
      outletSlider.min = 350;
      outletSlider.max = 450;
      outletSlider.step = 1;
    }

    outletSlider.value = (parseFloat(outletSlider.min) + parseFloat(outletSlider.max)) / 2;
    outletValue.textContent = outletSlider.value;
    calcAll();
  }

  // Event listeners for buttons
  btnPressure.onclick = () => {
    setActiveButton("outlet-buttons", "btn-pressure");
    window.state.outletType = "pressure";
    updateOutletSlider();
    window.state.outletTarget = parseFloat(outletSlider.value);
    calcAll();
  };

  btnTemperature.onclick = () => {
    setActiveButton("outlet-buttons", "btn-temperature");
    window.state.outletType = "temperature";
    updateOutletSlider();
    window.state.outletTarget = parseFloat(outletSlider.value);
    calcAll();
  };

  btnCompressor.onclick = () => {
    setActiveButton("machine-buttons", "btn-compressor");
    window.state.mode = "compressor";   // set global state
    // Preserve slider values
    window.state.eta1 = parseFloat(eta1.value);
    window.state.eta2 = parseFloat(eta2.value);
    eta1Val.textContent = eta1.value;
    eta2Val.textContent = eta2.value;
    setDefaults();
    updateOutletSlider();
    window.state.outletTarget = parseFloat(outletSlider.value);
    calcAll();
  };

  btnTurbine.onclick = () => {
    setActiveButton("machine-buttons", "btn-turbine");
    window.state.mode = "turbine";      // set global state
    // Preserve slider values
    window.state.eta1 = parseFloat(eta1.value);
    window.state.eta2 = parseFloat(eta2.value);
    eta1Val.textContent = eta1.value;
    eta2Val.textContent = eta2.value;
    setDefaults();
    updateOutletSlider();
    window.state.outletTarget = parseFloat(outletSlider.value);
    calcAll();
  };

  outletSlider.addEventListener("input", () => {
    const val = parseFloat(outletSlider.value);
    outletValue.textContent = val;
    window.state.outletTarget = val;
    calcAll();
  });

  eta1.addEventListener("input", () => {
    eta1Val.textContent = eta1.value;
    window.state.eta1 = eta1.value;
    calcAll();
  });

  eta2.addEventListener("input", () => {
    eta2Val.textContent = eta2.value;
    window.state.eta2 = eta2.value;
    calcAll();
  });

  updateOutletSlider();
});


require("./js/events.js");