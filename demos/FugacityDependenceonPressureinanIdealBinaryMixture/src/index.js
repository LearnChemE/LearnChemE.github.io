import "bootstrap";
import "p5";
import "./style/style.scss";
import { drawAll } from "./js/draw.js";
import { calcAll } from "./js/calcs.js";

// GLOBAL VARIABLES OBJECT
window.state = {
  frameRate: 60,
  pixelDensity: 2,
  showButtons: false,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [150, 120],
  controlBarHeight: 17,
  showMenu: false,
  sliderValue: 0.5,
  isDraggingSlider: false,
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  sizeContainer();
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
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
  // Check if menu is open and handle menu button clicks
  if (window.state.showMenu && window.menuButtonBounds) {
    for (const btn of window.menuButtonBounds) {
      if (
        window.mX >= btn.x && window.mX <= btn.x + btn.w &&
        window.mY >= btn.y && window.mY <= btn.y + btn.h
      ) {
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
    const menu = window.menuButtonBounds[0];
    const menuX = menu.x;
    const menuY = menu.y - 5;
    const menuW = window.menuButtonBounds[0].w + 2 * 5;
    const menuH = window.menuButtonBounds.length * (12 + 4) - 4 + 2 * 5;
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