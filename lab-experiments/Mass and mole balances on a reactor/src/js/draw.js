import { drawBeaker , drawPumpAndSwitch, 
  drawEvaporatorBody , drawHeaterSwitch } from "./evaporator";

import { drawReactorBody, drawReactorHeaterSwitch,updateCoilGlow, 
  updateReactorVaporParticles, updateExhaustParticles,
   drawExhaustParticles, updateCondenserParticles , 
   updateCondenserParticlesBezier} from './reactor.js';

import { drawThreeWayValve, drawExhaustCap, 
   } from "./threeWayValve";

import { drawCondenserBody,
   drawCoolingSwitch, drawCollectingBeaker,
  drawCondensateTube, drawCondensateTubeStream, 
  drawCondenserParticles, condensedFluidLevel, coordinateFlowRates } from "./condenser.js";

  import { drawBubbleMeter, drawBubbleMeterElbowTube, 
    drawTubeAtAngleToBubbleMeter, maybeSpawnHydrogenBubble,
    drawHydrogenBubbles, updateVaporFlowRateBasedOnTemp} from "./bubblemeter.js";
  
  import {startBubbleTimer, endBubbleTimer
  } from "./calcs.js"

// ✅ SIMPLIFIED: Experiment State Management
let experimentState = "IDLE"; // IDLE → FILLING → COMPLETE → MEASURING → RESET
let experimentStartTime = null;
let experimentDuration = 120000; // 2 minutes
let currentExperimentTemp = 300;
let resetRequested = false;

// ✅ SIMPLIFIED: System message state
let systemMessage = "Ready to start experiment";

// ✅ SIMPLIFIED: Setup function
function setupEvaporatorState() {
  if (typeof window.evaporatorHeaterOn === 'undefined') {
    window.evaporatorHeaterOn = false;
  }
}

// ✅ SIMPLIFIED: Check if experiment should start
function shouldStartExperiment() {
  return window.reactorHeaterOn && 
         window.condenserCoolingOn && 
         (window.reactorTemp >= 290) &&
         experimentState === "IDLE";
}

// ✅ SIMPLIFIED: Time functions
function getElapsedTime() {
  if (!experimentStartTime) return 0;
  return millis() - experimentStartTime;
}

function getRemainingTime() {
  const elapsed = getElapsedTime();
  return Math.max(0, experimentDuration - elapsed);
}

// ✅ SIMPLIFIED: Update experiment state
function updateExperimentState(temp) {
  const elapsed = getElapsedTime();
  
  switch (experimentState) {
    case "IDLE":
      if (shouldStartExperiment()) {
        experimentState = "FILLING";
        experimentStartTime = millis();
        currentExperimentTemp = temp;
        systemMessage = `Experiment started at ${temp}°C`;
        console.log(`🚀 Experiment STARTED at ${temp}°C`);
      }
      break;
      
    case "FILLING":
      // ✅ SIMPLIFIED: Just check time limit and heater state
      if (elapsed >= experimentDuration) {
        experimentState = "COMPLETE";
        systemMessage = `Experiment complete! Press bulb to measure gas volume`;
        console.log(`⏱️ Experiment COMPLETED after ${(elapsed/1000).toFixed(1)}s`);
      }
      else if (!window.reactorHeaterOn) {
        experimentState = "IDLE";
        experimentStartTime = null;
        systemMessage = "Experiment aborted - heater turned off";
        console.log("❌ Experiment ABORTED - heater off");
      }
      break;
      
    case "COMPLETE":
      // ✅ SIMPLIFIED: Ready for measurement
      if (resetRequested || !window.reactorHeaterOn) {
        experimentState = "RESET";
        systemMessage = "Resetting system...";
      }
      break;
      
    case "MEASURING":
      // Measurement controlled by bubblemeter.js
      break;
      
    case "RESET":
      // ✅ SIMPLIFIED: Reset everything
      experimentStartTime = null;
      currentExperimentTemp = 300;
      resetRequested = false;
      experimentState = "IDLE";
      systemMessage = "System reset - ready for new experiment";
      console.log("🔄 System RESET completed");
      break;
  }
}

// ✅ SIMPLIFIED: Check if flows should be active
function shouldFlowsBeActive() {
  return experimentState === "FILLING" && getElapsedTime() < experimentDuration;
}

// ✅ SIMPLIFIED: Debug overlay (press 'd' key)
function drawDebugOverlay() {
  if (keyIsPressed && key === 'd') {
    push();
    fill(0, 0, 0, 150);
    noStroke();
    rect(width - 180, height - 120, 170, 110);
    
    fill(255);
    textAlign(LEFT, TOP);
    textSize(2);
    const debugY = height - 115;
    text(`State: ${experimentState}`, width - 175, debugY);
    text(`Elapsed: ${(getElapsedTime()/1000).toFixed(1)}s`, width - 175, debugY + 12);
    text(`Remaining: ${(getRemainingTime()/1000).toFixed(1)}s`, width - 175, debugY + 24);
    text(`Flows Active: ${shouldFlowsBeActive()}`, width - 175, debugY + 36);
    text(`Reactor Heater: ${window.reactorHeaterOn}`, width - 175, debugY + 48);
    text(`Cooling: ${window.condenserCoolingOn}`, width - 175, debugY + 60);
    text(`Valve: ${window.valveState}`, width - 175, debugY + 72);
    text(`Temp: ${window.reactorTemp}°C`, width - 175, debugY + 84);
    text(`Bubble Count: ${window.bubbleCount || 0}`, width - 175, debugY + 96);
    
    pop();
  }
}

// ✅ SIMPLIFIED: Main draw function
export function drawAll(temp) {
  background(255);
  
  setupEvaporatorState();
  
  // ✅ Update global tracking
  window.reactorTemp = temp;
  
  // ✅ Update experiment state
  updateExperimentState(temp);
  
  // ✅ Set global flags for other components
  window.experimentFlowsActive = shouldFlowsBeActive();
  window.experimentState = experimentState;
  window.experimentElapsedTime = getElapsedTime();
  
  // ✅ Draw all components (unchanged visual style)
  drawBeaker(30, 88, 1);
  drawHeaterSwitch(12, 65);
  drawPumpAndSwitch(33, 60, 12, 60);
  drawEvaporatorBody(23, 33, 55);
  updateCoilGlow();
  drawReactorBody(temp); 
  
  // ✅ SIMPLIFIED: Always update particles if heater is on (let components handle their own logic)
  if (window.reactorHeaterOn) {
    updateReactorVaporParticles(temp); 
  }
  
  drawReactorHeaterSwitch(63, 36.5);
  updateExhaustParticles();
  drawExhaustParticles();
  updateCondenserParticlesBezier();
  
  if (window.reactorHeaterOn) {
    updateCondenserParticles();
  }

  drawThreeWayValve();
  drawExhaustCap(118,19.2);
  drawCondenserBody(94, 28, 100); 
  drawCoolingSwitch(81, 63);
  drawCollectingBeaker(100, 88, condensedFluidLevel + 0);
  drawCondenserParticles();

  drawBubbleMeterElbowTube();
  drawCondensateTube();
  
  if (shouldFlowsBeActive()) {
    drawCondensateTubeStream();
  }

  drawTubeAtAngleToBubbleMeter();
  coordinateFlowRates(temp);

  drawBubbleMeter(129.8, 33);

  // ✅ SIMPLIFIED: Always try to spawn bubbles (let bubble meter handle conditions)
  maybeSpawnHydrogenBubble(temp);
  
  drawHydrogenBubbles();
  
  // ✅ Make bubble count available for debugging
  window.bubbleCount = window.hydrogenBubbles ? window.hydrogenBubbles.length : 0;
  
  startBubbleTimer();
  updateVaporFlowRateBasedOnTemp(temp);
  endBubbleTimer();

  // ✅ Debug overlay
  drawDebugOverlay();
}

// ✅ Export functions for other components
export function getExperimentState() {
  return experimentState;
}

export function setExperimentState(newState) {
  experimentState = newState;
}

export function requestReset() {
  resetRequested = true;
}

export function isExperimentActive() {
  return experimentState === "FILLING" || experimentState === "COMPLETE";
}

export function canMeasureGas() {
  return experimentState === "COMPLETE";
}

export function setMeasuringState() {
  if (experimentState === "COMPLETE") {
    experimentState = "MEASURING";
    systemMessage = "Measuring accumulated gas volume...";
  }
}

export function completeMeasurement() {
  if (experimentState === "MEASURING") {
    experimentState = "COMPLETE";
    systemMessage = "Measurement complete. Reset to start new experiment.";
  }
}

export function setExperimentComplete() {
  if (experimentState === "FILLING") {
    experimentState = "COMPLETE";
    systemMessage = "Target collection reached! Press bulb to measure gas volume";
    
    // ✅ MINIMAL AUTO-SHUTDOWN: Only evaporator heater
    if (typeof window.evaporatorHeaterOn !== 'undefined') {
      window.evaporatorHeaterOn = false;
      console.log("🔴 Auto-shutdown: Evaporator heater OFF");
    }
    
    console.log("🎯 Experiment ready for measurement");
  }
}

// ✅ Make available globally
window.setExperimentComplete = setExperimentComplete;