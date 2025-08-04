import { drawSlider } from './slider.js';
import { drawHamburger } from './hamburger.js';
import { drawButtonBar } from './buttons.js';

export function drawControlBar() {
  // Draw a control bar at the top of the canvas
  const barHeight = 8;
  const margin = 2;

  // Initialize selected button if not exists
  if (window.state.selectedButtonIndex === undefined) {
    window.state.selectedButtonIndex = 0; // Default to P-x-y button
  }

  // Initialize additional slider values if not exists
  if (window.state.slider2Value === undefined) {
    window.state.slider2Value = 0.5;
  }
  if (window.state.slider3Value === undefined) {
    window.state.slider3Value = 0.5;
  }

  // Draw button bar above the slider
  const buttonBarWidth = 60;
  const buttonBarHeight = 6;
  const buttonBarX = margin + 4;
  const buttonBarY = margin + 2;
  drawButtonBar(buttonBarX, buttonBarY, buttonBarWidth, buttonBarHeight, window.state.selectedButtonIndex);

  // Calculate pressure from slider2 value (0.1 to 0.5)
  const pressure = 0.1 + (window.state.slider2Value * 0.4);

  // Draw second slider next to buttons
  drawSlider(margin + 100, margin + 5, 22, window.state.slider2Value, "pressure (bar)", pressure.toFixed(2), { sliderId: 'slider2', labelX: margin + 77, valueX: margin + 95 + 22 + 13});

  // Calculate benzene mole fraction from slider value (0.05 to 0.95)
  const benzeneMoleFraction = 0.05 + (window.state.sliderValue * 0.9);

  // Draw slider control (move closer to label)
  drawSlider(margin + 43, margin + barHeight / 2 + 10, 22, window.state.sliderValue, "overall mole fraction benzene", benzeneMoleFraction.toFixed(2), { labelX: margin + 4, valueX: margin + 45 + 28 });

  // Calculate temperature from slider3 value (40 to 59)
  const temperature = 40 + (window.state.slider3Value * 19);

  // Draw third slider next to mole fraction slider
  drawSlider(margin + 100, margin + barHeight / 2 + 10, 22, window.state.slider3Value, "temperature (°C)", temperature.toFixed(0), { sliderId: 'slider3', labelX: margin + 77, valueX: margin + 95 + 22 + 11 });

  // Draw a right-aligned hamburger icon
  const iconSize = 5.5;
  const iconMargin = 4;
  const iconX = state.canvasSize[0] - margin - iconSize - iconMargin;
  const iconY = margin + (barHeight - iconSize) / 2;
  drawHamburger(iconX, iconY, iconSize, iconMargin, state.canvasSize);
} 