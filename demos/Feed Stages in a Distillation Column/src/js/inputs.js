import Hamburger from "../assets/hamburger.svg";
import { calcAll, setDefaults } from "./calcs";

export function handleInputs() {
  initializeHamburger();
  initializeQSlider();
}

function initializeQSlider() {
  const qSlider = document.getElementById("q-slider");
  const qDisplay = document.getElementById("q-value-display");
  
  if (!qSlider || !qDisplay) {
    console.error("Q-slider elements not found!");
    return;
  }
  
  // Set initial display value
  qDisplay.textContent = `q = ${parseFloat(qSlider.value).toFixed(1)}`;
  
  // Add event listener for real-time updates
  qSlider.addEventListener("input", function(event) {
    const qValue = parseFloat(event.target.value);
    
    // Update display immediately for smooth feel
    qDisplay.textContent = `q = ${qValue.toFixed(1)}`;
    
    // Update global state and trigger recalculation
    if (window.updateQValue) {
      window.updateQValue(qValue);
    }
  });
  
  // Add change event for final update (when user releases slider)
  qSlider.addEventListener("change", function(event) {
    const qValue = parseFloat(event.target.value);
    console.log(`Q-slider changed to: ${qValue} (${window.getFeedCondition(qValue)})`);
  });
  
  // Add visual feedback for slider interaction
  qSlider.addEventListener("mousedown", function() {
    qSlider.style.opacity = "1";
  });
  
  qSlider.addEventListener("mouseup", function() {
    qSlider.style.opacity = "0.8";
  });
  
  qSlider.addEventListener("mouseleave", function() {
    qSlider.style.opacity = "0.8";
  });
  
  console.log("Q-slider initialized successfully");
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
      e.target.id !== "q-slider" &&
      e.target.id !== "q-slider-container" &&
      e.target.id !== "q-value-display" &&
      e.target.id !== "controls-panel" &&
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
      e.target.id !== "q-slider" &&
      e.target.id !== "q-slider-container" &&
      e.target.id !== "q-value-display" &&
      e.target.id !== "controls-panel" &&
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
          e.target.id !== "q-slider" &&
          e.target.id !== "q-slider-container" &&
          e.target.id !== "q-value-display" &&
          e.target.id !== "controls-panel" &&
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