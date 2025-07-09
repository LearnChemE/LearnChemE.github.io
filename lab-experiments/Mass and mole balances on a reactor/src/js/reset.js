// Master reset function for the entire simulation

import { resetEvaporator } from "./evaporator.js";
import { resetReactor } from "./reactor.js";
import { resetCondenser } from "./condenser.js";
import { resetBubbleMeter } from "./bubblemeter.js";
import { resetThreeWayValve } from "./threeWayValve.js";
import { resetExperimentState } from "./draw.js";
import { setDefaults } from "./calcs.js";


export function resetSimulation() {
  console.log("Starting complete simulation reset...");
  
  // 1. Reset global temperature and heater states
  resetGlobalState();
  
  // 2. Reset UI controls (temperature slider)
  resetUIControls();
  
  // 3. Reset all components in order
  resetEvaporator();
  resetReactor();
  resetCondenser();
  resetBubbleMeter();
  resetThreeWayValve();
  resetExperimentState();
  
  // 4. Reset calculations
  setDefaults();
  
  console.log("Simulation reset complete - all systems returned to initial state");
}

/**
 * Reset global state variables
 */
function resetGlobalState() {
  // Temperature control
  window.reactorTemp = 200;
  window.targetTemp = 200;
  
  // Equipment states
  window.reactorHeaterOn = false;
  window.evaporatorHeaterOn = false;
  window.condenserCoolingOn = false;
  window.valveState = "toexhaust";
  
  // Experiment flow control
  window.experimentFlowsActive = false;
  window.experimentState = "IDLE";
  window.experimentElapsedTime = 0;
  
  // Clear any global timing variables
  window.liquidMovementStartTime = null;
  
  console.log("Global state variables reset");
}

/**
 * Reset UI controls to initial values
 */
function resetUIControls() {
  // Reset temperature slider
  if (window.tempSlider && window.tempValueSpan) {
    window.tempSlider.value = 200;
    window.tempValueSpan.textContent = "200°C";
  }
  
  // Close hamburger menu after reset
  const buttons = document.getElementById("buttons");
  const hamburgerIcon = document.getElementById("hamburger-icon");
  if (buttons && hamburgerIcon) {
    buttons.style.display = "none";
    hamburgerIcon.classList.remove("active");
    if (window.state) {
      window.state.showButtons = false;
    }
  }
  
  console.log("UI controls reset");
}

/**
 * Add reset button click handler
 */
export function initializeResetButton() {
  const resetButton = document.getElementById("reset-button");
  if (resetButton) {
    resetButton.addEventListener("click", () => {
      // Direct reset without confirmation dialog
      resetSimulation();
    });
    console.log("Reset button initialized");
  } else {
    console.warn("Reset button not found in DOM");
  }
}