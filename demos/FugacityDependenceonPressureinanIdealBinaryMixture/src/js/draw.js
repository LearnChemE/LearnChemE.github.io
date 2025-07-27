import { drawBasicPlot } from './graph.js';
import { drawControlBar } from './control.js';
import { drawSlider } from './slider.js';
import { drawHamburger, drawCanvasMenu } from './hamburger.js';

export function drawAll() {
  drawControlBar();
  drawBasicPlot();
  if (window.state.showMenu) {
    drawCanvasMenu();
  }
}