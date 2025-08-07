import './css/style.scss';
import { addOptionToDragAndZoom } from './js/zoom.js';
import * as config from './js/config.js';
import { toggleMenu } from './js/hamburger.js';
import { SVG } from '@svgdotjs/svg.js';
import {drawFigure, reset} from './js/main.js';

let windowWidth = window.innerWidth - 60;
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

document.addEventListener('DOMContentLoaded', () => {
  const hambIcon = document.getElementById('hamburger-icon');
  if (hambIcon) {
    hambIcon.addEventListener('click', toggleMenu);
  }
  // Hook up the reset button to clear and redraw the SVG figure
  const resetBtn = document.getElementById('reset-button');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      reset(draw); 
      drawCanvas();          // clear any existing elements
      addOptionToDragAndZoom(draw); // re‑enable pan/zoom on the fresh canvas
    });
  }
});

function drawCanvas() {
  draw.clear();
  drawFigure(draw);
}

drawCanvas();

addOptionToDragAndZoom(draw);