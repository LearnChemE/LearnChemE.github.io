import * as config from './config.js';
import {drawConstantVolumeSetup} from './constantVolume.js';


export function drawFigure(svg) {
  // store and clear the canvas
  
  // draw the reactor and the 0–500 mL scale
  drawConstantVolumeSetup(svg);
}

export function reset(svg) {
  
}