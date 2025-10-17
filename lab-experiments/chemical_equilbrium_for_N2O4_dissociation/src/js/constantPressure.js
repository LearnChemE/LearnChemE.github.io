import * as config from './config.js';
import { computePressureWithConstantVolume } from './calc.js';

let pressureGuage = null;
let pressureReliefValve = null;
let sleeve = null;
let syringeObj = null;
let syringeControls = null;
let reactorBounds = null;
let tempSwitch = null;
let thermoCouple = null;

let tempController = null;   // UI elements group for temperature control
let targetTempC = 25;       // °C setpoint user can change anytime
let currentTempC = 25;      // °C measured/thermocouple reading
let heaterOn = false;        // switch state
let pressure = null;        // current pressure in bar
let liquidWeight = 1.8;      // g of N2O4 in syringe (1.6 to 2.0 g)
let liquidPushed = false;   // has the syringe been pushed?

let temperatureText = null; // text element showing current temperature
let allowTemperatureChange = true; // lockout flag during reset

// --- measurement noise for pressure readout (display-only) ---
// Standard deviation of the noise added to the displayed pressure, in bar.
export function drawConstantPressureSetup(draw) {}



function addSVGImage(draw, url, x = 0, y = 0, width, height) {
  const img = draw.image(url)
  .size(width, height)                      // force the element to the given dimensions
  .move(x, y)
  .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
  return img;
}

// Save the SVG.js context so other functions can reuse it




export function resetConstantPressureExperiment() {
 
}