// js/simulation.js
import { yCO2_out, findAdsorbTime, rampTemperature } from './calc.js'; // Assuming calc.js is in the same directory or adjust path
import * as state from './state.js';
import * as config from './config.js';
import { updateCO2AnalyzerDisplay } from './components/co2Analyzer.js';
import { getTankFromMultiValvePosition } from './utils.js';
import { updateTemperatureDisplay } from './components/therm.js';

var timerID = null;

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
    startHeating(); // Turn heater on
  }
  else if (tankNum === '-1') {
    gasIsFlowing = false;
    stopHeating();
  }
  else {
    console.error("Invalid tank number for calculation:", tankNum);
    return;
  }

  // Set the global desorbing state
  state.setDesorbing(currentDesorbingState);

  // Record the real-world start time of this calculation phase
  const calculationStartTime = Date.now();
  state.setStartTime(calculationStartTime); // Store the Date.now() timestamp

  // --- Parameters for yCO2_out ---
  // P needs to be dynamic based on selected tank's gauge, or a default
  const pressureGaugeId = `gauge${tankNum}`;
  const P_bar = state.getGaugeValue(pressureGaugeId, 5.0); // Get pressure in bar, default 1.0 bar

  const m_controller_mg_min = state.getMfcValue(); // Get current MFC setting (mg/min)
  const m_g_s = m_controller_mg_min * 1e-3 / 60; // Convert mg/min to g/s

  console.log('Calculation Params:', { tankNum, y, P_bar, m_controller_mg_min, m_g_s, desorbing: state.getDesorbing(), timeOfDesorption: state.getTimeOfDesorption(), initialTimeOffset });


  // --- Interval Timer ---
  stopMoleFractionCalculation();
  const timerId = setInterval(() => {
    // Calculate elapsed simulation time (t) since the *start* of the relevant phase (adsorption or desorption)
    // Add the initial offset to continue from where we left off

    // Heat/cool the bed
    const T = rampTemperature(1/60, state.getIsHeating(), state.getTemperature()); // Temperature from config
    updateTemperatureDisplay(T);
    state.setTemperature(T);

    const elapsedRealTime_ms = Date.now() - state.getStartTime();
    const t = initialTimeOffset + (elapsedRealTime_ms / 1000) * config.simulationSpeedMultiplier;

    console.log("t = ", Math.round(t));

    // Call the external calculation function
    if (gasIsFlowing) {
      console.log(`NaN Causer: ${tankNum}`)
      const y_out = yCO2_out({
        t: t,
        tStep: 1/60, // Use config timestep
        m: m_g_s,
        P: P_bar,
        T: T,
        yCO2: y, // Initial mole fraction of the feed gas
        desorbing: state.getDesorbing(),
        timeOfDesorption: state.getTimeOfDesorption(), // The simulation time 't' when desorption *started*
        // m_controller: m_controller_mg_min // Pass m_controller if needed by yCO2_out, otherwise 'm' is sufficient
      });

      state.setOutletMoleFraction(y_out);
    }
    else {
      state.setOutletMoleFraction(0.0);
    }

    // Update the analyzer display
    updateCO2AnalyzerDisplay(state.outletMoleFraction);

    // Optional: Log detailed state every few seconds
    // if (Math.floor(t) % 5 === 0 && Math.abs(t - Math.floor(t)) < (config.timeStep * config.simulationSpeedMultiplier / 2)) { // Log roughly every 5s
    //   console.log(`Sim Time: ${t.toFixed(2)}s, Outlet CO2: ${state.outletMoleFraction.toFixed(4)}, Desorbing: ${state.getDesorbing()}, T_desorp: ${state.getTimeOfDesorption().toFixed(2)}s`);
    // }

  }, 1000/60 / config.simulationSpeedMultiplier); // Update display roughly once per real second (adjust interval based on multiplier)

  state.setMoleFractionTimer(timerId);
}

function stopMoleFractionCalculation() {
  if (state.getMoleFractionTimer()) {
    state.clearMoleFractionTimer(); // Clears interval using state function

    // // Record the simulation time when stopped IF it was an adsorption phase
    // if (!state.getDesorbing() && state.getStartTime()) {
    //   const elapsedRealTime_ms = Date.now() - state.getStartTime();
    //   const lastTimeOffset = state.getTimeWhenAdsorptionStopped() || 0; // Get previous offset if resuming
    //   const stopTime = lastTimeOffset + (elapsedRealTime_ms / 1000) * config.simulationSpeedMultiplier;
    //   state.setTimeWhenAdsorptionStopped(stopTime); // Store simulation time
    //   console.log(`Calculation stopped during Adsorption at sim time: ${stopTime.toFixed(2)}s`);
    // } else {
    //   console.log('Calculation stopped (during Desorption or no start time).');
    //   // Optionally reset timeWhenAdsorptionStopped if stopping during desorption?
    //   // state.setTimeWhenAdsorptionStopped(null);
    // }
    // // Don't reset startTime here, might be needed if quickly switching tanks
  }
}


// --- Heating Logic ---

/**
 * Start the heater so temperature will rise linearly
 * @returns 
 */
export function startHeating() {
  const draw = window.svgDraw; // Access draw object (assuming it's global for simplicity here)
  if (!draw) {
    console.error("SVG draw object not found for heating.");
    return;
  }

  if (!state.getIsHeating()) {
    state.setIsHeating(true);
    console.log("Starting Heating");

    const heatingIntervalId = setInterval(() => {
      // Create Red gradient for heating
      const gradient = draw.gradient('linear', function(add) {
        add.stop(0, '#ff0000');
        add.stop(0.5, '#ff6600'); // More orange in middle
        add.stop(1, '#ff0000');
      });
      gradient.from(0, 0).to(0, 1); // Vertical gradient

      // Apply to heaters
      const heaters = draw.find('.heater'); // Find elements by class
      heaters.forEach(heater => {
        heater.fill(gradient);
      });

    }, 500); // Update gradient periodically (visual effect)
    state.setHeatingInterval(heatingIntervalId);
  }
}

/**
 * Stop the heater so bed will cool
 * @returns 
 */
export function stopHeating() {
  const draw = window.svgDraw; // Access draw object
  if (!draw) return; // No drawing context, can't update visuals

  if (state.getIsHeating()) {
    state.setIsHeating(false);
    state.clearHeatingInterval(); // Clears interval via state function
    console.log("Stopping Heating");

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