import Hamburger from "../assets/hamburger.svg";
import { calcAll, setDefaults } from "./calcs";
import { initializeResetButton } from "./reset.js"; // Import reset functionality
import worksheetPDF from '/src/assets/Mass_and_mole_balances_on_a_reactor_worksheet.pdf';

// Initialize hamburger icon SVG and its toggle behavior
function initializeHamburger() {
  const hamburgerContainer = document.getElementById("hamburger-icon");
  hamburgerContainer.innerHTML = Hamburger;
  handleHamburger();
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
      !e.target.classList.contains("table-label") &&
      e.target.id !== "reset-button" // Allow reset button clicks
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
      !e.target.classList.contains("slider-container") &&
      e.target.id !== "reset-button" // Allow reset button clicks
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
          !e.target.classList.contains("table-label") &&
          e.target.id !== "reset-button" // Allow reset button clicks
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

import { togglePumpPower, toggleValve, toggleHeater } from "./evaporator";
import { toggleReactorHeater } from './reactor.js'
import { handleValveClick } from './threeWayValve.js';
import { toggleCooling } from "./condenser";
import { handleBulbClick } from "./bubblemeter.js";

// Add this function
function downloadFile(fileUrl, fileName) {
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function handleWorksheetDownload() {
  const worksheetButton = document.getElementById("worksheet");
  if (worksheetButton) {
    worksheetButton.addEventListener("click", () => {
      downloadFile(worksheetPDF, 'Mass_and_mole_balances_worksheet.pdf');
    });
  }
}

export function handleInputs() {
  initializeHamburger();
  initializeResetButton(); 
  handleWorksheetDownload();

  window.mousePressed = () => {
    const mx = mouseX / relativeSize();
    const my = mouseY / relativeSize();
    
    // Try to toggle pump power first
    if (togglePumpPower(mx, my)) {
      return; // If pump was clicked, don't check valve
    }
    
    //If pump wasn't clicked, try valve (the black circular valve)
    if (toggleValve(mx, my)) {
      return; // Valve was clicked
    }

    if (toggleHeater(mx, my)) {
      return; // Valve was clicked
    }
    
    if (toggleReactorHeater(mx, my, 63, 36.5)) {
      return; // Reactor heater was clicked
    }

    if (handleValveClick(mx, my) ){
      return;
    }

    if (toggleCooling(mx, my)) {
      return; // Cooling switch was clicked
    }

    if (handleBulbClick(mx, my,  129.5, 33)){
      return; // Bulb was clicked
    }
    // Add more click handlers here if needed
  };
}