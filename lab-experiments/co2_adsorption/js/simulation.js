// js/simulation.js
import { yCO2_out, findAdsorbTime } from './calc.js'; // Assuming calc.js is in the same directory or adjust path
import * as state from './state.js';
import * as config from './config.js';
import { updateCO2AnalyzerDisplay } from './components/co2Analyzer.js';
import { getTankFromMultiValvePosition } from './utils.js';

export function startMoleFractionCalculation(tankNum) {
  // Stop any existing calculation first
  stopMoleFractionCalculation();

  let y; // Initial mole fraction at the *inlet* of the bed for this run
  let currentDesorbingState = false;
  let startTimeForCalc;
  let initialTimeOffset = 0;

  console.log(`Starting calculation. Tank: ${tankNum}, PrevTank: ${state.getPrevTankNum()}, TimeStopped: ${state.getTimeWhenAdsorptionStopped()}`);

  if (tankNum === '1') { // 90% CO2 Adsorption
    y = 0.9;
    if (state.getPrevTankNum() === '2') {
      initialTimeOffset = findAdsorbTime({
        tStep: 0.01,
        yCO2: y,
        yTarget: state.outletMoleFraction,
        m: state.getMfcValue() * 1e-3 / 60, // Convert mg/min to g/s
        P: state.getGaugeValue('gauge1', 5.0), // Convert bar to MPa
        T: config.tempKelvin,
        desorbing: false,
      })
    }

    console.log(`yTarget: ${state.outletMoleFraction}`);
    console.log(`m: ${state.getMfcValue() * 1e-3 / 60}`);
    console.log(`P: ${state.getGaugeValue('gauge1', 5.0)}`);
    console.log(`T: ${config.tempKelvin}`);
    console.log({ initialTimeOffset });
    currentDesorbingState = false;
    stopHeating(); // Ensure heater is off
    // If resuming adsorption for the same tank, continue time
    if (state.getPrevTankNum() === '1' && state.getTimeWhenAdsorptionStopped() !== null) {
      initialTimeOffset = state.getTimeWhenAdsorptionStopped();
      console.log(`Resuming Adsorption Tank 1 from ${initialTimeOffset.toFixed(2)}s`);
    } else {
      console.log("Starting New Adsorption Tank 1");
      state.setTimeWhenAdsorptionStopped(null); // Clear previous stop time
    }
    state.setPrevTankNum('1'); // Mark this as the last active CO2 tank
    state.setTimeOfDesorption(0); // Reset desorption time marker

  } else if (tankNum === '2') { // 10% CO2 Adsorption
    y = 0.1;
    currentDesorbingState = false;
    stopHeating();
    if (state.getPrevTankNum() === '1') {
      initialTimeOffset = findAdsorbTime({
        tStep: 0.01,
        yCO2: y,
        yTarget: state.outletMoleFraction,
        m: state.getMfcValue() * 1e-3 / 60, // Convert mg/min to g/s
        P: state.getGaugeValue('gauge1', 5.0),
        T: config.tempKelvin,
        desorbing: false,
      })
    }
    if (state.getPrevTankNum() === '2' && state.getTimeWhenAdsorptionStopped() !== null) {
      initialTimeOffset = state.getTimeWhenAdsorptionStopped();
      console.log(`Resuming Adsorption Tank 2 from ${initialTimeOffset.toFixed(2)}s`);
    } else {
      console.log("Starting New Adsorption Tank 2");
      state.setTimeWhenAdsorptionStopped(null);
    }
    state.setPrevTankNum('2');
    state.setTimeOfDesorption(0);

  } else if (tankNum === '3') { // N2 Desorption
    // Use the mole fraction of the *last* CO2 tank for yCO2 parameter during desorption
    const lastTank = state.getPrevTankNum();
    if (lastTank === '1') y = 0.9;
    else if (lastTank === '2') y = 5.0;
    else {
      console.warn("Desorption (Tank 3) started without prior Adsorption (Tank 1 or 2). Using y=0.1");
      y = 0.1; // Default if no previous tank
    }

    currentDesorbingState = true;
    startHeating(); // Turn heater on

    if (state.getTimeWhenAdsorptionStopped() !== null) {
      // Desorption time starts from when adsorption stopped
      initialTimeOffset = state.getTimeWhenAdsorptionStopped();
      state.setTimeOfDesorption(initialTimeOffset); // Set the timeOfDesorption parameter
      console.log(`Starting Desorption (Tank 3) from ${initialTimeOffset.toFixed(2)}s (based on last stop time). Using y=${y}`);
    } else {
      console.warn("Desorption (Tank 3) started, but no previous adsorption stop time recorded. Starting time from 0.");
      initialTimeOffset = 0;
      state.setTimeOfDesorption(0);
    }
    // PrevTankNum remains unchanged during desorption

  } else {
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

  const T = config.tempKelvin; // Temperature from config

  console.log('Calculation Params:', { tankNum, y, P_bar, m_controller_mg_min, m_g_s, T, desorbing: state.getDesorbing(), timeOfDesorption: state.getTimeOfDesorption(), initialTimeOffset });


  // --- Interval Timer ---
  const timerId = setInterval(() => {
    // Calculate elapsed simulation time (t) since the *start* of the relevant phase (adsorption or desorption)
    // Add the initial offset to continue from where we left off
    const elapsedRealTime_ms = Date.now() - state.getStartTime();
    const t = initialTimeOffset + (elapsedRealTime_ms / 1000) * config.simulationSpeedMultiplier;

    console.log("t = ", Math.round(t));

    // Call the external calculation function
    const y_out = yCO2_out({
      t: t,
      tStep: config.timeStep, // Use config timestep
      m: m_g_s,
      P: P_bar,
      T: T,
      yCO2: y, // Initial mole fraction of the feed gas
      desorbing: state.getDesorbing(),
      timeOfDesorption: state.getTimeOfDesorption(), // The simulation time 't' when desorption *started*
      // m_controller: m_controller_mg_min // Pass m_controller if needed by yCO2_out, otherwise 'm' is sufficient
    });

    state.setOutletMoleFraction(y_out);

    // Update the analyzer display
    updateCO2AnalyzerDisplay(state.outletMoleFraction);

    // Optional: Log detailed state every few seconds
    if (Math.floor(t) % 5 === 0 && Math.abs(t - Math.floor(t)) < (config.timeStep * config.simulationSpeedMultiplier / 2)) { // Log roughly every 5s
      console.log(`Sim Time: ${t.toFixed(2)}s, Outlet CO2: ${state.outletMoleFraction.toFixed(4)}, Desorbing: ${state.getDesorbing()}, T_desorp: ${state.getTimeOfDesorption().toFixed(2)}s`);
    }

  }, 1000 / config.simulationSpeedMultiplier); // Update display roughly once per real second (adjust interval based on multiplier)

  state.setMoleFractionTimer(timerId);
}

export function stopMoleFractionCalculation() {
  if (state.getMoleFractionTimer()) {
    state.clearMoleFractionTimer(); // Clears interval using state function

    // Record the simulation time when stopped IF it was an adsorption phase
    if (!state.getDesorbing() && state.getStartTime()) {
      const elapsedRealTime_ms = Date.now() - state.getStartTime();
      const lastTimeOffset = state.getTimeWhenAdsorptionStopped() || 0; // Get previous offset if resuming
      const stopTime = lastTimeOffset + (elapsedRealTime_ms / 1000) * config.simulationSpeedMultiplier;
      state.setTimeWhenAdsorptionStopped(stopTime); // Store simulation time
      console.log(`Calculation stopped during Adsorption at sim time: ${stopTime.toFixed(2)}s`);
    } else {
      console.log('Calculation stopped (during Desorption or no start time).');
      // Optionally reset timeWhenAdsorptionStopped if stopping during desorption?
      // state.setTimeWhenAdsorptionStopped(null);
    }
    // Don't reset startTime here, might be needed if quickly switching tanks
  }
  // Ensure heater is off if stopping adsorption
  if (!state.getDesorbing()) {
    stopHeating();
  }
}


// --- Heating Logic ---
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