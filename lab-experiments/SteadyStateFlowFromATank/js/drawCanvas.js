// drawCanvas.js
import { draw } from './constants.js';
import { drawTable } from './drawTable.js';
import { drawContainer } from './drawContainer.js';
import { drawValve } from './drawValve.js';
import { fillTank } from './fillTank.js';
import { drawInstructions } from './drawInstructions.js';
import { drawRuler } from './drawRuler.js';
import { createDroplets, startDropletAnimation } from './droplets.js';
import {isRotated} from './state.js';

export function drawCanvas() {
  draw.clear();
  drawTable();
  drawContainer();
  drawValve();
  fillTank();
  drawInstructions();
  drawRuler();

  if (isRotated) {
    createDroplets();
    startDropletAnimation();
  }
}