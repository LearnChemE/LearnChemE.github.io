import "bootstrap";
import "p5";
import "./style/style.scss";
import { setupCanvas, drawSimulation } from "./js/graphics";

// Global state object
window.state = {
  frameRate: 60,
  pixelDensity: 4,
  hamburgerHasBeenClicked: window.localStorage.getItem("hamburgerHasBeenClicked") === "true",
  canvasSize: [1400, 1000],
  scale: 1
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  setupCanvas(containerElement);
  windowResized();
};

window.draw = function() {
  const width = state.canvasSize[0];
  const height = state.canvasSize[1];
  window.width = width;
  window.height = height;
  window.mX = mouseX / relativeSize();
  window.mY = mouseY / relativeSize();
  scale(relativeSize());
  drawSimulation(width, height);
};

window.windowResized = () => {
  const width = containerElement.offsetWidth;
  const height = containerElement.offsetHeight;
  resizeCanvas(width, height);
}

window.relativeSize = () => {
  return containerElement.offsetWidth / state.canvasSize[0];
}

// Hamburger
const menuBtn = document.querySelector('.menu-btn');
const menuContent = document.querySelector('.menu-content');
const menuItems = document.querySelectorAll('.menu-item');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn');


// Hamburger menu functionality
menuBtn.addEventListener('click', () => {
    menuContent.classList.toggle('show');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !menuContent.contains(e.target)) {
        menuContent.classList.remove('show');
    }
});

// Menu items click handlers
menuItems.forEach(item => {
    if (item.getAttribute('data-modal') === null) return;
    item.addEventListener('click', () => {
        const modalId = item.getAttribute('data-modal') + '-modal';
        document.getElementById(modalId).style.display = 'block';
        menuContent.classList.remove('show');
    });
});

// Close modal buttons
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});
