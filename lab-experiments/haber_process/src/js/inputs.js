import Hamburger from "../assets/hamburger.svg";
import { calcAll, setDefaults } from "./calcs";

export function handleInputs() {
  initializeHamburger();
  handlePressureInput();
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

function handlePressureInput() {
  const canvas = document.querySelector("canvas");
  const h2Pressure = document.getElementById("h2-pressure");
  const n2Pressure = document.getElementById("n2-pressure");
  const nh3Pressure = document.getElementById("nh3-pressure");

  [h2Pressure, n2Pressure, nh3Pressure].forEach((elt) => {
    elt.querySelector("input").setAttribute("max", state.tanks.maxP);
  });

  h2Pressure.querySelector("input").addEventListener("input", (e) => {
    const P = round(parseFloat(e.target.value));
    state.tanks.h2.P = P;
    h2Pressure.querySelector(".pressure-value").innerText = P;
    calcAll();
  });

  n2Pressure.querySelector("input").addEventListener("input", (e) => {
    const P = round(parseFloat(e.target.value));
    state.tanks.n2.P = P;
    n2Pressure.querySelector(".pressure-value").innerText = P;
    calcAll();
  });

  nh3Pressure.querySelector("input").addEventListener("input", (e) => {
    const P = round(parseFloat(e.target.value));
    state.tanks.nh3.P = P;
    nh3Pressure.querySelector(".pressure-value").innerText = P;
    calcAll();
  });

  canvas.addEventListener("mousedown", (e) => {
    if (state.popupOpen) {
      h2Pressure.style.display = "none";
      n2Pressure.style.display = "none";
      nh3Pressure.style.display = "none";
      state.popupOpen = false;
    }
  });
}