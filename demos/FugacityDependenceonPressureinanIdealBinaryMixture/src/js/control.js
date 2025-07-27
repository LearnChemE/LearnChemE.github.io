import { drawSlider } from './slider.js';
import { drawHamburger } from './hamburger.js';

export function drawControlBar() {
  // Draw a control bar at the top of the canvas
  const barHeight = 8;
  const margin = 2;

  // Draw slider control (move closer to label)
  drawSlider(margin + 14, margin + barHeight / 2, 28, window.state.sliderValue, "Slider", window.state.sliderValue.toFixed(2));

  // Draw a right-aligned hamburger icon
  const iconSize = 5.5;
  const iconMargin = 4;
  const iconX = state.canvasSize[0] - margin - iconSize - iconMargin;
  const iconY = margin + (barHeight - iconSize) / 2;
  drawHamburger(iconX, iconY, iconSize, iconMargin, state.canvasSize);
} 