import './css/style.scss';
import { addOptionToDragAndZoom } from './js/zoom.js';
import * as config from './js/config.js';
import { buttonAction } from './js/hamburger.js';
import { SVG } from '@svgdotjs/svg.js';
import {drawFigure, reset} from './js/main.js';

let windowWidth = window.innerWidth;
let windowHeight = windowWidth * config.canvasHeight / config.canvasWidth;

const draw = SVG().addTo('#svg-container').size(windowWidth, windowHeight);
window.svgDraw = draw; // Make global if needed by other modules like simulation/reset

draw.viewbox(0, 0, config.canvasWidth, config.canvasHeight);
draw.attr('preserveAspectRatio', 'xMidYMid meet');

window.addEventListener('resize', function() {
    windowWidth = window.innerWidth - 60;
    // Ensure height calculation respects potential container limits if needed
    windowHeight = windowWidth * config.canvasHeight / config.canvasWidth;
    draw.size(windowWidth, windowHeight);
});

// document.addEventListener('DOMContentLoaded', () => {
//   const hambIcon = document.getElementById('hamburger-icon');
//   if (hambIcon) {
//     hambIcon.addEventListener('click', toggleMenu);
//   }
// });

const menuBtn = document.querySelector('.menu-btn');
const menuContent = document.querySelector('.menu-content');
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


document.addEventListener('DOMContentLoaded', () => {
  // const hambIcon = document.getElementById('hamburger-icon');
  // if (hambIcon) {
  //   hambIcon.addEventListener('click', toggleMenu);
  // }
  // Hook up the reset button to clear and redraw the SVG figure
  const resetBtn = document.getElementById('reset-button');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      reset(draw); 
      drawCanvas();          // clear any existing elements
      addOptionToDragAndZoom(draw); // re‑enable pan/zoom on the fresh canvas
    });
  }

  const directionsBtn = document.getElementById('directions');
  if (directionsBtn) {
    directionsBtn.addEventListener('click', () => {
      // Show directions overlay
      buttonAction({ action: 'modal', url: 'html/overlay/directions.html', label: 'Directions' });
    });
  }

  const detailsBtn = document.getElementById('details');
  if (detailsBtn) {
    detailsBtn.addEventListener('click', () => {
      // Show details overlay
      buttonAction({ action: 'modal', url: 'html/overlay/details.html', label: 'Details' });
    });
  }

  const aboutBtn = document.getElementById('about');
  if (aboutBtn) {
    aboutBtn.addEventListener('click', () => {
      // Show about overlay
      buttonAction({ action: 'modal', url: 'html/overlay/about.html', label: 'About' });
    });
  }

  const worksheetBtn = document.getElementById('worksheet');
  if (worksheetBtn) {
    worksheetBtn.addEventListener('click', () => {
      // Show worksheet overlay
      buttonAction({ action: 'download', url: 'assets/worksheet.pdf', label: 'Worksheet', filename: 'Unsteady state material balances for a two-phase, multicomponent system worksheet.pdf' });
    });
  } 
});

function drawCanvas() {
  draw.clear(); // Clear previous drawings if any
  drawFigure(draw);
}

drawCanvas();

addOptionToDragAndZoom(draw);