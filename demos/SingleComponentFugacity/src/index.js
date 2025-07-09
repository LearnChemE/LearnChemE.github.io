import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll } from "./js/draw.js";
import { handleInputs } from "./js/inputs.js";
import { calcAll } from "./js/calcs.js";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 2,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [150, 120],
  controlBarHeight: 17, // 8px control bar + 1px gap + 6px graph bar + 2px margins
  showMenu: false, // For canvas popup menu
  sliderValue: 0.5, // Temperature slider value
  isDraggingSlider: false, // Track if slider is being dragged
  dropdownSelection: 0, // Selected dropdown option (0 or 1)
  showDropdown: false, // Whether dropdown options are visible
  realGasChecked: window.localStorage.getItem("realGasChecked") === "true",
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  handleInputs();
  calcAll();
  pixelDensity(state.pixelDensity);
  frameRate(state.frameRate);
};

window.draw = function() {
  window.width = state.canvasSize[0];
  window.height = state.canvasSize[1];
  scale(relativeSize());
  background(255);
  
  // Set the main content area (below both bars with margins)
  const margin = 2; // Match the control bar margin
  window.contentArea = {
    x: margin,
    y: state.controlBarHeight + 2 * margin,
    width: state.canvasSize[0] - 2 * margin,
    height: state.canvasSize[1] - state.controlBarHeight - 3 * margin
  };
  
  // Provide scaled mouse coordinates for future use
  window.mX = mouseX / relativeSize();
  window.mY = mouseY / relativeSize();

  calcAll(); // Ensure calculations are always up to date
  drawAll();
};

window.mousePressed = function() {
  // Check dropdown option clicks FIRST if open
  if (window.state.showDropdown && window.dropdownOptionBounds) {
    for (let option of window.dropdownOptionBounds) {
      if (window.mX >= option.x && 
          window.mX <= option.x + option.width &&
          window.mY >= option.y && 
          window.mY <= option.y + option.height) {
        window.state.dropdownSelection = option.index;
        window.state.showDropdown = false;
        return;
      }
    }
  }
  // Then check dropdown box interaction
  if (window.dropdownBounds && 
      window.mX >= window.dropdownBounds.x && 
      window.mX <= window.dropdownBounds.x + window.dropdownBounds.width &&
      window.mY >= window.dropdownBounds.y && 
      window.mY <= window.dropdownBounds.y + window.dropdownBounds.height) {
    window.state.showDropdown = !window.state.showDropdown;
    return;
  }
  
  // Check if menu is open and handle menu button clicks
  if (window.state.showMenu && window.menuButtonBounds) {
    for (const btn of window.menuButtonBounds) {
      if (
        window.mX >= btn.x && window.mX <= btn.x + btn.w &&
        window.mY >= btn.y && window.mY <= btn.y + btn.h
      ) {
        // Trigger the appropriate modal
        let modalId = null;
        if (btn.label === 'Directions') modalId = 'directions-modal';
        if (btn.label === 'Details') modalId = 'details-modal';
        if (btn.label === 'About') modalId = 'about-modal';
        if (modalId) {
          const modal = new window.bootstrap.Modal(document.getElementById(modalId));
          modal.show();
        }
        window.state.showMenu = false;
        return;
      }
    }
    // If click is outside the menu, close it
    // (menu bounds)
    const menu = window.menuButtonBounds[0];
    const menuX = menu.x;
    const menuY = menu.y - 5; // popupPadding
    const menuW = window.menuButtonBounds[0].w + 2 * 5; // btnW + 2*popupPadding
    const menuH = window.menuButtonBounds.length * (12 + 4) - 4 + 2 * 5; // (buttonHeight+buttonSpacing)*3 - spacing + 2*popupPadding
    if (!(window.mX >= menuX && window.mX <= menuX + menuW && window.mY >= menuY && window.mY <= menuY + menuH)) {
      window.state.showMenu = false;
      return;
    }
  }
  
  // Check slider interaction
  if (window.sliderBounds) {
    const { x, y, width, height } = window.sliderBounds;
    if (
      window.mX >= x && window.mX <= x + width &&
      window.mY >= y && window.mY <= y + height
    ) {
      window.state.isDraggingSlider = true;
      // Update slider value based on mouse position
      const newValue = Math.max(0, Math.min(1, (window.mX - x) / width));
      window.state.sliderValue = newValue;
      return;
    }
  }
  
  // Check if click is inside the hamburger icon
  if (window.hamburgerIconBounds) {
    const { x, y, w, h } = window.hamburgerIconBounds;
    if (
      window.mX >= x && window.mX <= x + w &&
      window.mY >= y && window.mY <= y + h
    ) {
      window.state.showMenu = !window.state.showMenu;
      return;
    }
  }
  // Add other mouse interactions here if needed
  // Check checkbox interaction
  if (window.checkboxBounds &&
      window.mX >= window.checkboxBounds.x &&
      window.mX <= window.checkboxBounds.x + window.checkboxBounds.w &&
      window.mY >= window.checkboxBounds.y &&
      window.mY <= window.checkboxBounds.y + window.checkboxBounds.h) {
    window.state.realGasChecked = !window.state.realGasChecked;
    return;
  }
};

// Add mouse dragging for slider
window.mouseDragged = function() {
  if (window.state.isDraggingSlider && window.sliderBounds) {
    const { x, width } = window.sliderBounds;
    const newValue = Math.max(0, Math.min(1, (window.mX - x) / width));
    window.state.sliderValue = newValue;
  }
};

// Add mouse release to stop dragging
window.mouseReleased = function() {
  window.state.isDraggingSlider = false;
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

require("./js/events.js");

// If not already present, add the directions modal HTML to the document
if (!document.getElementById('directions-modal')) {
  const modalHtml = `
  <div class="modal fade" id="directions-modal" tabindex="-1" aria-labelledby="directions-modal-label" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="directions-modal-label">Directions</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body" style="font-size: 13px;">
          This simulation plots fugacity of a hypothetical single component as a function of temperature or pressure (select which plot using the dropdown menu). The saturation point is where liquid and vapor have equal fugacities. Above or below the saturation point, the phase with the lower fugacity is the stable phase. The fugacity-versus-pressure plot assume the vapor phase is ideal so that the fugacity versus pressure for the gas phase is linear. When the "real gas" box is checked, the vapor is assumed to be a real gas and the fugacity versus pressure for the vapor phase is not linear.
        </div>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHtml);
}