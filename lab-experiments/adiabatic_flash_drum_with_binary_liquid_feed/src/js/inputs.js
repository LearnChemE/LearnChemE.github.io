import Hamburger from "../assets/hamburger.svg";
import { calcAll, setDefaults } from "./calcs";

export function handleInputs() {
  initializeHamburger();
  initializeSlider();
  initializeDropdown();
}

function initializeSlider() {
  const zSlider = document.getElementById("z-slider");
  const zValue = document.getElementById("z-value");
  zSlider.addEventListener("input", (e) => {
    const value = Number(e.target.value);
    zValue.innerHTML = value.toFixed(2);
    state.xF = value;
    setDefaults();
    calcAll();
  });
}

function initializeDropdown() {
  const mixtureDropdown = document.getElementById("mixture-dropdown");
  const compound1label = document.getElementById("compound-1");
  const compound2label = document.getElementById("compound-2");
  const A1 = document.getElementById("a1");
  const B1 = document.getElementById("b1");
  const C1 = document.getElementById("c1");
  const MW1 = document.getElementById("mw1");
  const A2 = document.getElementById("a2");
  const B2 = document.getElementById("b2");
  const C2 = document.getElementById("c2");
  const MW2 = document.getElementById("mw2");
  mixtureDropdown.addEventListener("change", (e) => {
    const selectedOption = e.target.value;
    switch (selectedOption) {
      case "b-t":
        compound1label.innerHTML = "benzene";
        compound2label.innerHTML = "toluene";
        A1.innerHTML = state.chemicals.benzene.A.toFixed(3);
        B1.innerHTML = state.chemicals.benzene.B.toFixed(0);
        C1.innerHTML = state.chemicals.benzene.C.toFixed(1);
        MW1.innerHTML = state.chemicals.benzene.MW.toFixed(2);
        A2.innerHTML = state.chemicals.toluene.A.toFixed(3);
        B2.innerHTML = state.chemicals.toluene.B.toFixed(0);
        C2.innerHTML = state.chemicals.toluene.C.toFixed(1);
        MW2.innerHTML = state.chemicals.toluene.MW.toFixed(2);
        window.mixture = [state.chemicals.benzene, state.chemicals.toluene];
        break;
      case "h-o":
        compound1label.innerHTML = "n-hexane";
        compound2label.innerHTML = "n-octane";
        A1.innerHTML = state.chemicals.nHexane.A.toFixed(3);
        B1.innerHTML = state.chemicals.nHexane.B.toFixed(0);
        C1.innerHTML = state.chemicals.nHexane.C.toFixed(1);
        MW1.innerHTML = state.chemicals.nHexane.MW.toFixed(2);
        A2.innerHTML = state.chemicals.nOctane.A.toFixed(3);
        B2.innerHTML = state.chemicals.nOctane.B.toFixed(0);
        C2.innerHTML = state.chemicals.nOctane.C.toFixed(1);
        MW2.innerHTML = state.chemicals.nOctane.MW.toFixed(2);
        window.mixture = [state.chemicals.nHexane, state.chemicals.nOctane];
        break;
      case "c-d":
        compound1label.innerHTML = "cyclohexane";
        compound2label.innerHTML = "n-Decane";
        A1.innerHTML = state.chemicals.cycloHexane.A.toFixed(3);
        B1.innerHTML = state.chemicals.cycloHexane.B.toFixed(0);
        C1.innerHTML = state.chemicals.cycloHexane.C.toFixed(1);
        MW1.innerHTML = state.chemicals.cycloHexane.MW.toFixed(2);
        A2.innerHTML = state.chemicals.nDecane.A.toFixed(3);
        B2.innerHTML = state.chemicals.nDecane.B.toFixed(0);
        C2.innerHTML = state.chemicals.nDecane.C.toFixed(1);
        MW2.innerHTML = state.chemicals.nDecane.MW.toFixed(2);
        window.mixture = [state.chemicals.cycloHexane, state.chemicals.nDecane];
        break;
      case "m-w":
        compound1label.innerHTML = "methanol";
        compound2label.innerHTML = "water";
        A1.innerHTML = state.chemicals.methanol.A.toFixed(3);
        B1.innerHTML = state.chemicals.methanol.B.toFixed(0);
        C1.innerHTML = state.chemicals.methanol.C.toFixed(1);
        MW1.innerHTML = state.chemicals.methanol.MW.toFixed(2);
        A2.innerHTML = state.chemicals.water.A.toFixed(3);
        B2.innerHTML = state.chemicals.water.B.toFixed(0);
        C2.innerHTML = state.chemicals.water.C.toFixed(1);
        MW2.innerHTML = state.chemicals.water.MW.toFixed(2);
        window.mixture = [state.chemicals.methanol, state.chemicals.water];
        break;
      default:
        compound1label.innerHTML = "benzene";
        compound2label.innerHTML = "toluene";
        A1.innerHTML = state.chemicals.benzene.A.toFixed(3);
        B1.innerHTML = state.chemicals.benzene.B.toFixed(0);
        C1.innerHTML = state.chemicals.benzene.C;
        MW1.innerHTML = state.chemicals.benzene.MW;
        A2.innerHTML = state.chemicals.toluene.A.toFixed(3);
        B2.innerHTML = state.chemicals.toluene.B.toFixed(0);
        C2.innerHTML = state.chemicals.toluene.C;
        MW2.innerHTML = state.chemicals.toluene.MW;
        window.mixture = [state.chemicals.benzene, state.chemicals.toluene];
        break;
    }
    setDefaults();
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