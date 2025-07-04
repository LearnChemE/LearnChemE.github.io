import Hamburger from "../assets/hamburger.svg";
import { calcAll } from "./calcs";

export function handleInputs() {
  initializeHamburger();
  handleFeedPressure();
  handleFeedFraction();

}

function handleFeedPressure() {
  document.getElementById("feed-pressure-slider").addEventListener("input", (e) => {
    const pressureValue = parseFloat(e.target.value);
    state.P = pressureValue;
    const normalized = (pressureValue - 2.4) / (7.8 - 2.4);
    state.arrowShift = normalized;
    document.getElementById("feed-pressure-value").textContent = pressureValue.toFixed(1);
    calcAll();
    console.log('to ' + millis())
  });
}

function handleFeedFraction() {
  document.getElementById("fraction-feed-slider").addEventListener("input", (e) => {
    const fractionValue = parseFloat(e.target.value);
    state.z = fractionValue;
    document.getElementById("fraction-feed-value").textContent = fractionValue.toFixed(2);
    calcAll();
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