import './css/style.scss';
import { addOptionToDragAndZoom } from './js/zoom.js';
import * as config from './js/config.js';
import { buttonAction } from './js/hamburger.js';
import { SVG } from '@svgdotjs/svg.js';
import { drawFigure } from './js/main.js';

const aspect = config.canvasWidth / config.canvasHeight; // 1000:700
let windowHeight = window.innerHeight - 60;
let windowWidth = windowHeight * aspect;

const draw = SVG().addTo('#svg-container').size(windowWidth, windowHeight);
window.svgDraw = draw; // Make global if needed by other modules like simulation/reset

draw.viewbox(0, 0, config.canvasWidth, config.canvasHeight);
draw.attr('preserveAspectRatio', 'xMidYMid meet');

window.addEventListener('resize', function() {
    windowHeight = window.innerHeight - 60;
    windowWidth = windowHeight * aspect;
    draw.size(windowWidth, windowHeight);
});

document.addEventListener('DOMContentLoaded', () => {
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
      buttonAction({ action: 'download', url: 'assets/worksheet.pdf', label: 'Worksheet', filename: 'Chemical equilibirum for N2O4 dissociation worksheet.pdf' });
    });
  } 
});

function drawCanvas() {
  draw.clear(); // Clear previous drawings if any
  drawFigure(draw);
}

drawCanvas();

addOptionToDragAndZoom(draw);
