import Hamburger from "../assets/hamburger.svg";
import { calcAll } from "./calcs";

export function handleInputs() {
  initializeHamburger();
  initializeSliders();
}

function initializeSliders() {
  const pressureSlider = document.getElementById("pressure-slider");
  const temperatureSlider = document.getElementById("temperature-slider");
  const n2Slider = document.getElementById("n2-slider");
  const h2Slider = document.getElementById("h2-slider");
  const nh3Slider = document.getElementById("nh3-slider");
  const pressureValue = document.getElementById("pressure-value");
  const temperatureValue = document.getElementById("temperature-value");
  const n2Value = document.getElementById("n2-value");
  const h2Value = document.getElementById("h2-value");
  const nh3Value = document.getElementById("nh3-value");

  pressureSlider.addEventListener("input", (e) => {
    const P = Math.round(Number(e.target.value));
    pressureValue.innerHTML = String(P);
    state.P = P;
    calcAll();
    redraw();
  });

  temperatureSlider.addEventListener("input", (e) => {
    const T = Math.round(Number(e.target.value));
    temperatureValue.innerHTML = String(T);
    state.T = T;
    calcAll();
    redraw();
  });

  n2Slider.addEventListener("input", (e) => {
    const nN2 = Math.round(10 * Number(e.target.value)) / 10;
    n2Value.innerHTML = nN2.toFixed(1);
    state.inlet.nN2 = nN2;
    calcAll();
    redraw();
  });

  h2Slider.addEventListener("input", (e) => {
    const nH2 = Math.round(10 * Number(e.target.value)) / 10;
    h2Value.innerHTML = nH2.toFixed(1);
    state.inlet.nH2 = nH2;
    calcAll();
    redraw();
  });

  nh3Slider.addEventListener("input", (e) => {
    const nNH3 = Math.round(10 * Number(e.target.value)) / 10;
    nh3Value.innerHTML = nNH3.toFixed(1);
    state.inlet.nNH3 = nNH3;
    calcAll();
    redraw();
  });
}

function handleHamburger() {
  const hamburger = document.getElementById("hamburger");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  const buttons = document.getElementById("buttons");

  hamburgerIcon.style.transitionProperty = "background-color";
  hamburgerIcon.style.transitionDuration = "0.5s";
  const glowInterval = setInterval(() => {
    if (!state.hamburgerHasBeenClicked) {
      hamburgerIcon.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
      setTimeout(() => {
        hamburgerIcon.style.backgroundColor = "";
      }, 800);
    } else {
      hamburgerIcon.style.backgroundColor = "";
      hamburgerIcon.style.transitionProperty = "";
      hamburgerIcon.style.transitionDuration = "";
      clearInterval(glowInterval);
    }
  }, 1600);

  hamburger.addEventListener("click", (e) => {
    if (
      e.target.id !== "controls" &&
      e.target.id !== "buttons" &&
      !e.target.classList.contains("btn") &&
      !e.target.classList.contains("dropdown-label") &&
      !e.target.classList.contains("slider-label") &&
      !e.target.classList.contains("slider-value") &&
      !e.target.classList.contains("slider-container") &&
      e.target.id !== "z-slider" &&
      e.target.id !== "mixture-dropdown" &&
      e.target.id !== "antoine-table" &&
      e.target.tagName !== "TABLE" &&
      e.target.tagName !== "TR" &&
      e.target.tagName !== "TD" &&
      e.target.tagName !== "TH" &&
      !e.target.classList.contains("table-label")
    ) {
      if (state.showButtons) {
        buttons.style.display = "none";
        state.showButtons = false;
        hamburgerIcon.classList.remove("active");
      } else {
        buttons.style.display = "grid";
        state.showButtons = true;
        hamburgerIcon.classList.add("active");
        state.hamburgerHasBeenClicked = true;
        window.localStorage.setItem("hamburgerHasBeenClicked", "true");
      }
    }
  });

  document.addEventListener("click", (e) => {
    if (
      e.target.id !== "controls" &&
      e.target.id !== "buttons" &&
      !e.target.classList.contains("btn") &&
      e.target.id !== "hamburger" &&
      e.target.id !== "hamburger-icon" &&
      e.target.id !== "hamburger-svg" &&
      e.target.id !== "z-slider" &&
      e.target.id !== "mixture-dropdown" &&
      e.target.id !== "antoine-table" &&
      e.target.tagName !== "path" &&
      e.target.tagName !== "TABLE" &&
      e.target.tagName !== "TR" &&
      e.target.tagName !== "TD" &&
      e.target.tagName !== "TH" &&
      !e.target.classList.contains("modal") &&
      !e.target.classList.contains("modal-dialog") &&
      !e.target.classList.contains("modal-content") &&
      !e.target.classList.contains("modal-body") &&
      !e.target.classList.contains("modal-header") &&
      !e.target.classList.contains("dropdown-label") &&
      !e.target.classList.contains("slider-label") &&
      !e.target.classList.contains("slider-value") &&
      !e.target.classList.contains("table-label") &&
      !e.target.classList.contains("slider-container")
    ) {
      if (e.target.tagName !== "HTML") {
        if (!e.target.parentElement.classList.contains("modal-body") &&
          !e.target.parentElement.classList.contains("modal-header") &&
          !e.target.classList.contains("dropdown-label") &&
          !e.target.classList.contains("slider-label") &&
          !e.target.classList.contains("slider-value") &&
          !e.target.classList.contains("slider-container") &&
          e.target.id !== "z-slider" &&
          e.target.id !== "mixture-dropdown" &&
          e.target.id !== "antoine-table" &&
          e.target.tagName !== "TABLE" &&
          e.target.tagName !== "TR" &&
          e.target.tagName !== "TD" &&
          e.target.tagName !== "TH" &&
          !e.target.classList.contains("table-label")
        ) {
          buttons.style.display = "none";
          state.showButtons = false;
          hamburgerIcon.classList.remove("active");
        }
      } else {
        buttons.style.display = "none";
        state.showButtons = false;
        hamburgerIcon.classList.remove("active");
      }
    }
  });
}

function initializeHamburger() {
  const hamburgerContainer = document.getElementById("hamburger-icon");
  hamburgerContainer.innerHTML = Hamburger;
  handleHamburger();
}