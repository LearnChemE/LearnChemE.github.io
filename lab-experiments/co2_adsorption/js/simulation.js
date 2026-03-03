// js/simulation.js
import { yCO2_out, rampTemperature } from './calc.js'; // Assuming calc.js is in the same directory or adjust path
import * as state from './state.js';
import * as config from './config.js';
import { updateCO2AnalyzerDisplay } from './components/co2Analyzer.js';
import { updateTemperatureDisplay } from './components/therm.js';
import { betaLabelX, betaLabelY } from './main.js';


let simAniPlaying = false;
let conditions = { m: 0, P: 1, y: 0 };
function startSimAni(y, m, P) {
  // Update conditions
  conditions.y = y;
  conditions.m = m;
  conditions.P = P;

  if (simAniPlaying) return;
  simAniPlaying = true;

  const simFrame = (dt) => {
    // Calculate elapsed simulation time (t) since the *start* of the relevant phase (adsorption or desorption)
    // Add the initial offset to continue from where we left off

    // Check if we need to pause the heating
    if (state.getFlowConfig() !== state.FLOW_BED) {
      state.pauseHeating();
    }

    // Heat/cool the bed
    const isHeating = state.getIsHeating();
    // console.log(state.isHeatingPaused())
    const T = state.isHeatingPaused() ? state.getTemperature() : rampTemperature(dt, isHeating, state.getTemperature()); // Temperature from config
    updateTemperatureDisplay(T);
    state.setTemperature(T);
    console.log(dt)

    const flowCfg = state.getFlowConfig();
    console.log(flowCfg)
    if (flowCfg === state.FLOW_BED) {
      // Do calculation
      const y_out = yCO2_out(dt, conditions.m, T, conditions.P, conditions.y);

      state.setOutletMoleFraction(y_out);
    }
    else {
      yCO2_out(dt, 0, T, 1, 0, true);
      state.setOutletMoleFraction(conditions.y);
    }

    // Update the analyzer display
    updateCO2AnalyzerDisplay(state.outletMoleFraction);

    return true;
  }; // Update display roughly once per real second (adjust interval based on multiplier)

  return animate(simFrame, () => {playing = false});
}



/**
 * Misleading function name. Updates the tank number with whatever is currently happening.
 * @param {*} tankNum Tank number set by user
 * @returns None.
 */
export function startMoleFractionCalculation(tankNum) {
  // Stop any existing calculation first
  // stopMoleFractionCalculation();

  let y; // Initial mole fraction at the *inlet* of the bed for this run
  let currentDesorbingState = false;
  let initialTimeOffset = 0;
  let gasIsFlowing = true;

  // console.log(`Starting calculation. Tank: ${tankNum}, PrevTank: ${state.getPrevTankNum()}, TimeStopped: ${state.getTimeWhenAdsorptionStopped()}`);

  if (tankNum === '1') { // 90% CO2 Adsorption
    y = 0.9;
    stopHeating(); // Ensure heater is off
  } 
  else if (tankNum === '2') { // 10% CO2 Adsorption
    y = 0.1;
    stopHeating();
  } 
  else if (tankNum === '3') { // N2 Desorption
    y = 0.0;
    startHeating();
    if (state.getFlowConfig() !== state.FLOW_BED) {
      state.pauseHeating();
    }
  }
  else if (tankNum === '-1') {
    gasIsFlowing = false;
    y = 0.0;
    stopHeating();
  }
  else {
    console.error("Invalid tank number for calculation:", tankNum);
    return;
  }

  // Record the real-world start time of this calculation phase
  const calculationStartTime = Date.now();
  state.setStartTime(calculationStartTime); // Store the Date.now() timestamp

  // --- Parameters for yCO2_out ---
  // P needs to be dynamic based on selected tank's gauge, or a default
  const pressureGaugeId = `gauge${tankNum}`;
  const P_bar = state.getGaugeValue(pressureGaugeId, 5.0); // Get pressure in bar, default 1.0 bar

  const m = gasIsFlowing ? state.getMfcValue() : 0; // Get current MFC setting (mg/min)

  // --- Interval Timer ---
  startSimAni(y, m, P_bar);
}

function stopMoleFractionCalculation() {
  state.clearMoleFractionTimer(); // Clears interval using state function
}


// --- Heating Logic ---
let heatingRateLabel = null;

/**
 * Start the heater so temperature will rise linearly
 * @returns 
 */
export function startHeating() {
  const draw = window.svgDraw; // Access draw object (assuming it's global for simplicity here)
  state.unpauseHeating();
  if (!draw) {
    console.error("SVG draw object not found for heating.");
    return;
  }

  if (!state.getIsHeating()) {
    state.setIsHeating(true);
    // console.log("Starting Heating");

    heatingRateLabel = draw.text("heating rate = 4 K/s")
        .move(betaLabelX, betaLabelY);

  }
}

/**
 * Stop the heater so bed will cool
 * @returns 
 */
export function stopHeating() {
  const draw = window.svgDraw; // Access draw object
  state.unpauseHeating();
  if (!draw) return; // No drawing context, can't update visuals

  if (state.getIsHeating()) {
    state.setIsHeating(false);
    state.clearHeatingInterval(); // Clears interval via state function

    if (heatingRateLabel) {
      heatingRateLabel.remove();
      heatingRateLabel = null;
    }

    // Reset heater gradients to Blue (cold)
    const gradient = draw.gradient('linear', function(add) {
      add.stop(0, '#0000ff');
      add.stop(0.5, '#6666ff');
      add.stop(1, '#0000ff');
    });
    gradient.from(0, 0).to(0, 1);

    // Apply reset gradient
    const heaters = draw.find('.heater');
    heaters.forEach(heater => {
      heater.fill(gradient);
    });
  }
}

/**
 * Animate function to be called every frame.
 * @param {(dt: number, t: number) => boolean} fn Function to call every frame. dt is time since last call in seconds, t is total time in ms. Return true to continue, false to stop.
 * @param {(() => void) | undefined} then Optional function to call when animation ends.
 */
export function animate(fn, then) {
    let prevtime = null;

    const frame = (time) => {
        if (prevtime === null) prevtime = time;
        const dt = Math.min((time - prevtime) / 1000, .3); // in ms
        prevtime = time;

        // Call the function
        const playing = fn(dt, time);

        // Request next frame
        if (playing) requestAnimationFrame(frame);
        else then?.();
    }
    return requestAnimationFrame(frame);
}