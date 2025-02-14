// resetCanvas.js
import {drainDiameterDropdown, liquidHeightDropdown, ratio } from './constants.js';
import { resetButton } from './domElements.js'; 
import { diameter, isRotated, setElapsedTime, setIsRotated, setWaterHeight, waterHeight, setDiameter } from './state.js';
import { drawCanvas } from './drawCanvas.js';
import { stopTimer } from './timer.js';
import { startDropletAnimation, stopDropletAnimation } from './droplets.js';
import { createDroplets } from './droplets.js';
import { elapsedTime } from './state.js';

export function resetCanvas() {
  resetButton.addEventListener('click', () => {
    setIsRotated(false);
    setWaterHeight(parseFloat(liquidHeightDropdown.value) * ratio);
    setDiameter(parseFloat(drainDiameterDropdown.value) * ratio);
    drawCanvas();
    stopTimer();
    stopDropletAnimation();
    setElapsedTime(0);
    drainDiameterDropdown.disabled = false;
    liquidHeightDropdown.disabled = false;
  });
}

export function addEventListener() {
    drainDiameterDropdown.addEventListener('change', () => {
      setDiameter(parseFloat(drainDiameterDropdown.value) * ratio);
      drawCanvas();
    });
    
    liquidHeightDropdown.addEventListener('change', () => {
      setWaterHeight(parseFloat(liquidHeightDropdown.value) * ratio);
      drawCanvas();
    });
  }