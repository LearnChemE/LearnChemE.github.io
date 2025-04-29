// js/state.js

// --- Mutable State Variables ---
export let valveStates = {}; // { valveId: { isOpen: boolean, position: {x, y}, knob?: SVGElement } }
export let flowPaths = {}; // Store flow animation paths for cleanup { segmentId: SVGPathElement }
export let pipeSegments = {}; // Store base pipe segments for animation reference { segmentId: SVGPathElement }
export let gaugeValues = {}; // Store current pressure gauge values { gaugeId: number (bar) }

export let currentMultiValvePosition = 270; // Angle in degrees
export let mfcFlowSpeed = 50; // ms per animation step
export let mfcValue = 15.0; // mg/min

export let moleFractionTimer = null; // Interval ID
export let startTime = null; // Timestamp for simulation start
export let desorbing = false; // Simulation state
export let timeOfDesorption = 0; // Simulation state (seconds)
export let timeWhenAdsorptionStopped = null; // Simulation state (seconds)
export let prevTankNum = null; // Tracks last CO2 tank used ('1' or '2')

export let outletMoleFraction = 0;

export let isHeating = false; // Adsorption bed state
export let heatingInterval = null; // Interval ID

// --- References to SVG Elements (Set by creation functions) ---
export let co2AnalyzerElement = null; // Reference to the SVG group for CO2 Analyzer
export let interactiveValveKnobElement = null; // Reference to the main interactive valve SVG group

// --- State Management Functions ---
export function setValveState(valveId, isOpen, position, knob = null) {
  valveStates[valveId] = { isOpen, position };
  if (knob) {
    valveStates[valveId].knob = knob;
  }
}
export function updateValveOpenState(valveId, isOpen) {
  if (valveStates[valveId]) {
    valveStates[valveId].isOpen = isOpen;
    // Update knob color visually (might be better handled directly in the valve click handler)
    const knob = valveStates[valveId].knob;
    if (knob && typeof knob.animate === 'function') { // Check if knob exists and is animatable
      const color = isOpen ? '#ffa500' : '#000000';
      knob.animate(300).fill(color);
    } else if (knob) { // Fallback if animate isn't available (e.g., during reset redraw)
      const color = isOpen ? '#ffa500' : '#000000';
      knob.fill(color);
    }
  } else {
    console.warn(`Valve state for ${valveId} not found.`);
  }
}
export function getValveState(valveId) {
  return valveStates[valveId];
}
export function resetValveStates() {
  Object.keys(valveStates).forEach(id => {
    if (valveStates[id]) {
      valveStates[id].isOpen = false;
      const knob = valveStates[id].knob;
      // Check if knob exists and has a fill method before calling it
      if (knob && typeof knob.fill === 'function') {
        knob.fill('#000000'); // Reset color
      }
    }
  });
  console.log("Valve states reset."); // Optional log
}

export async function setGaugeValue(gaugeId, value) {
  gaugeValues[gaugeId] = value;
  // Update the digital pressure gauge display whenever a gauge value changes
  const { updateDigitalPressureGauge } = await
    import('./calculations.js');
  updateDigitalPressureGauge(value);
}
export function getGaugeValue(gaugeId, defaultValue = 5.0) {
  return gaugeValues[gaugeId] ?? defaultValue;
}
export function resetGaugeValues() {
  Object.keys(gaugeValues).forEach(id => gaugeValues[id] = 5.0);
  console.log("Gauge values reset."); // Optional log
}

// --- NEWLY ADDED FUNCTION ---
export function resetPipeSegments() {
  // Clear the object holding references to the base pipe elements
  // Reassigning the variable *within its own module* is allowed.
  pipeSegments = {};
  console.log("Pipe segments cache reset."); // Optional log
}
// --- END NEW FUNCTION ---

// --- Flow Path Functions ---
export function setFlowPath(segmentId, pathElement, isMFCControlled = false, color = 'grey', opacity = 1) {
  if (pathElement) {
    // Store additional info directly on the element or in a wrapper object
    pathElement.isMFCControlled = isMFCControlled;
    pathElement.flowColor = color;
    pathElement.flowOpacity = opacity;
    flowPaths[segmentId] = pathElement;
  } else {
    delete flowPaths[segmentId];
  }
}
export function removeFlowPath(segmentId) {
  // Check if path exists and has a remove method before calling
  if (flowPaths[segmentId] && typeof flowPaths[segmentId].remove === 'function') {
    flowPaths[segmentId].remove();
  }
  delete flowPaths[segmentId]; // Always remove from tracking object
}
export function removeAllFlowPaths() {
  Object.keys(flowPaths).forEach(id => {
    if (flowPaths[id] && typeof flowPaths[id].remove === 'function') {
      flowPaths[id].remove(); // Remove SVG element if stored and possible
    }
  });
  flowPaths = {}; // Clear the tracking object
  console.log("Flow paths reset."); // Optional log
}
export function getFlowPath(segmentId) {
  return flowPaths[segmentId];
}
export function getAllFlowPaths() {
  return flowPaths;
}

// --- Pipe Segment Functions ---
export function setPipeSegment(segmentId, pathElement) {
  pipeSegments[segmentId] = pathElement;
}
export function getPipeSegment(segmentId) {
  return pipeSegments[segmentId];
}

// --- MFC Value/Speed ---
export function setMfcValue(value) { mfcValue = value; }
export function getMfcValue() { return mfcValue; }
export function setMfcFlowSpeed(value) { mfcFlowSpeed = value; }
export function getMfcFlowSpeed() { return mfcFlowSpeed; }

// --- Multi-Valve Position ---
export function setCurrentMultiValvePosition(value) { currentMultiValvePosition = value; }
export function getCurrentMultiValvePosition() { return currentMultiValvePosition; }

// --- SVG Element References ---
export function setCo2AnalyzerElement(element) { co2AnalyzerElement = element; }
export function getCo2AnalyzerElement() { return co2AnalyzerElement; }
export function setInteractiveValveKnobElement(element) { interactiveValveKnobElement = element; }
export function getInteractiveValveKnobElement() { return interactiveValveKnobElement; }

// --- Simulation Timers and State ---
export function setMoleFractionTimer(timerId) { moleFractionTimer = timerId; }
export function getMoleFractionTimer() { return moleFractionTimer; }
export function clearMoleFractionTimer() {
  if (moleFractionTimer) clearInterval(moleFractionTimer);
  moleFractionTimer = null;
}

export function setStartTime(time) { startTime = time; }
export function getStartTime() { return startTime; }

export function setDesorbing(value) { desorbing = value; }
export function getDesorbing() { return desorbing; }
export function setTimeOfDesorption(value) { timeOfDesorption = value; }
export function getTimeOfDesorption() { return timeOfDesorption; }

export function setTimeWhenAdsorptionStopped(value) { timeWhenAdsorptionStopped = value; }
export function getTimeWhenAdsorptionStopped() { return timeWhenAdsorptionStopped; }

export function setPrevTankNum(value) { prevTankNum = value; }
export function getPrevTankNum() { return prevTankNum; }

// --- Heating State ---
export function setIsHeating(value) { isHeating = value; }
export function getIsHeating() { return isHeating; }
export function setHeatingInterval(intervalId) { heatingInterval = intervalId; }
export function getHeatingInterval() { return heatingInterval; }
export function clearHeatingInterval() {
  if (heatingInterval) clearInterval(heatingInterval);
  heatingInterval = null;
}

// --- Master Reset for Simulation State ---
export function resetSimulationState() {
  clearMoleFractionTimer();
  clearHeatingInterval();
  startTime = null;
  desorbing = false;
  timeOfDesorption = 0;
  timeWhenAdsorptionStopped = null;
  prevTankNum = null;
  isHeating = false;
  mfcValue = 15.0; // Reset MFC value
  mfcFlowSpeed = 50; // Reset flow speed
  currentMultiValvePosition = 270; // Reset valve position
  console.log("Simulation state reset."); // Optional log
}

// --- Optional Combined Reset for Drawing-related State ---
// Call this from reset.js if preferred over individual calls
export function resetDrawingState() {
  resetValveStates();
  resetGaugeValues();
  removeAllFlowPaths();
  resetPipeSegments();
  // Reset element references? Usually unnecessary if elements are recreated.
  // co2AnalyzerElement = null;
  // interactiveValveKnobElement = null;
  console.log("Drawing-related state reset."); // Optional log
}

export function setOutletMoleFraction(value) { outletMoleFraction = value; }