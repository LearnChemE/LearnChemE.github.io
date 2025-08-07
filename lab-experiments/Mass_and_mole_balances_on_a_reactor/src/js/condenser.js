import { getExperimentState } from "./draw.js";

// === FLOW CONTROL CONSTANTS ===
const CONDENSATION_THRESHOLD = 5; // particles needed before draining starts
const MIN_CONDENSER_LEVEL = 0.1; // minimum level to maintain flow
const DRAIN_BUFFER_ML = 2; // mL before target to start fast drain
const FAST_DRAIN_RATE = 0.008; // rate for final drainage
const FLOW_RAMP_UP_RATE = 0.02; // how quickly flow intensity increases
const FLOW_RAMP_DOWN_RATE = 0.05; // how quickly flow intensity decreases
const LIQUID_DRAIN_DELAY = 3000; // 3 seconds delay before beaker starts filling (tube flows immediately)

// === VISUAL ANIMATION CONSTANTS ===
const BASE_BAND_INTERVAL = 30; // base frames between band creation
const BASE_FLOW_SPEED = 0.3; // base speed of liquid bands
const MIN_BAND_INTERVAL = 10; // minimum interval between bands
const FLOW_SPEED_MULTIPLIER = 20; // how much flow rate affects speed
const BAND_SIZE_MULTIPLIER = 50; // how much flow rate affects band size

window.condenserCoolingOn = false;
let coolingCoilColor = 120; // steel gray by default
let coolingTimer = null;
export let condensedFluidLevel = 0.0;
export let condenserLiquidLevel = 0.0; // New: liquid level inside condenser

// Liquid flow animation variables
export let drainingToBeaker = false;
let drainStartTime = 0;
let condensateBands = [];
let flowIntensity = 0; // New: for smooth flow transitions

export let condenserParticles = [];

// Material balance state tracking with experiment coordination
let experimentStartTime = null;
let totalPropanolFed = 0; // mol
let propanolConsumed = 0; // mol
let liquidProductMass = 0; // g
let particlesFaded = 0; // Tracks how many particles have condensed and disappeared
let lastExperimentState = "IDLE";

// *** UI FROM CONDENSER2: Compact, refined condenser body design ***
export function drawCondenserBody(x = 200, y = 50) {
  push();
  translate(x, y);

  const bodyWidth = 12; // UPDATED: Smaller, more compact (was 20)
  const bodyHeight = 25; // UPDATED: More compact (was 35)
  const borderRadius = 10;
  const wallThickness = 1.2; // UPDATED: Refined thickness

  // Outer Container
  stroke(180);
  strokeWeight(wallThickness); // UPDATED: Using refined thickness
  fill(255, 255, 255, 50);
  rect(0, 0, bodyWidth, bodyHeight, borderRadius);

  // *** UPDATED: Compact cooling coil design from condenser2 ***
  const coilOffset = 6; // UPDATED: More compact (was 10)
  const spacing = 2; // UPDATED: Tighter spacing
  const turns = 5; // UPDATED: Fewer turns (was 6)
  const coilTopY = coilOffset + 2; // UPDATED: Better positioning
  const coilBottomY = coilTopY + spacing * (turns - 1);
  const coilCenterX = bodyWidth / 2;

  push();
  translate(0, coilOffset + 4); // UPDATED: Compact positioning
  stroke(coolingCoilColor);
  strokeWeight(0.6); // UPDATED: Refined stroke weight
  noFill();
  for (let i = 0; i < turns; i++) {
    let y = i * spacing + 2; // UPDATED: Better spacing
    arc(coilCenterX, y, bodyWidth + 5, spacing, 0, TWO_PI);
  }
  pop();

  // *** UPDATED: Refined cooling wires from condenser2 ***
  const switchX = -8; // UPDATED: Better positioning (was -12)
  const switchY = 27; // UPDATED: Adjusted for compact design (was 37)
  stroke(coolingCoilColor);
  strokeWeight(0.6); // UPDATED: Refined stroke weight
  noFill();

  // top wire - UPDATED: Better bezier curves
  bezier(switchX - 5, switchY, switchX - 10, switchY - 2, // Reduced bend
       0 + 1, coilTopY - 1, 0, coilTopY + 4.5);

  // bottom wire - UPDATED: Better bezier curves  
  bezier(switchX - 5, switchY, switchX - 10, switchY + 2, // Reduced bend
       0 + 1, coilBottomY + 2, 0, coilBottomY + 4.5);

  pop();
}

// *** UI FROM CONDENSER2: Compact cooling switch matching evaporator/reactor ***
export function drawCoolingSwitch(x = 120, y = 100) {
  const w = 13, h = 6; // UPDATED: Smaller dimensions matching other switches

  push();
  translate(x, y);

  // Lever
  push();
  translate(0, 0);
  rotate(radians(condenserCoolingOn ? 30 : -30));
  stroke(10);
  strokeWeight(1);
  line(0, 0, 0, -3); // UPDATED: Shorter lever matching other switches
  pop();
  
  // Switch Box
  fill(60);
  noStroke();
  rect(-w / 2, 0, w, h, 2); // UPDATED: Using smaller dimensions

  // *** UPDATED: Better label positioning from condenser2 ***
  fill(255);
  noStroke();
  textSize(2); // UPDATED: Smaller text matching other switches
  textAlign(CENTER, CENTER);
  text("OFF", -w / 2 + 3, h / 2); // UPDATED: Better positioning
  text("ON", w / 2 - 3, h / 2); // UPDATED: Better positioning

  pop();
}

// Handle mouse click - KEEP ORIGINAL LOGIC, UPDATE DIMENSIONS
export function toggleCooling(mx, my) {
  const x = 85, y = 63;
  const w = 13, h = 6;
  const boxX = x - w / 2;
  const boxY = y;

  if (mx >= boxX && mx <= boxX + w && my >= boxY && my <= boxY + h) {
    condenserCoolingOn = !condenserCoolingOn;

    if (condenserCoolingOn) {
      if (coolingTimer) clearTimeout(coolingTimer);
      coolingTimer = setTimeout(() => {
        coolingCoilColor = color(100, 200, 255); // glow blue
      }, 500);
    } else {
      coolingCoilColor = 120;
      if (coolingTimer) clearTimeout(coolingTimer);
    }

    return true;
  }
  return false;
}

// *** UI FROM CONDENSER2: Refined beaker with better graduation marks ***
export function drawCollectingBeaker(x = 20, y = 50, fluidLevel = 0.5) {
  const width = 20;
  const height = 25;
  const wall = 2;

  const innerX = wall;
  const innerW = width - 2 * wall;
  const fluidH = height * fluidLevel;
  const fluidY = height - fluidH - 0.5;

  push();
  translate(x, y);

  // Beaker outline (open top)
  stroke(180);
  strokeWeight(1);
  noFill();
  line(0, 0, 0, height);            // Left wall
  line(0, height, width, height);  // Bottom
  line(width, 0, width, height);   // Right wall
  line(-2, 0, 0, 0);               // Left lip
  line(width + 2, 0, width, 0);    // Right lip

  // Fluid
  fill(30, 100, 255, 200); // Light blue
  noStroke();
  rect(innerX - 1.5, fluidY, innerW + 3, fluidH);

  // *** UPDATED: Better graduation marks from condenser2 ***
  const maxValue = 250;
  const minorSteps = 25; // Every 10mL from 0 to 250
  const markSpacing = (height - 2 * wall) / minorSteps;
  const startY = height - wall + 1.8;

  stroke(20);
  fill(0);
  textAlign(LEFT, CENTER);

  for (let i = 1; i <= minorSteps; i++) {
    const yMark = startY - i * markSpacing;
    const value = i * (maxValue / minorSteps); // Every 10mL
    
    // Determine if this is a major (50mL) or minor (10mL) mark
    const isMajorMark = (value % 50 === 0);
    
    if (isMajorMark) {
      // Major marks with labels (50, 100, 150, 200, 250 mL)
      strokeWeight(0.2);
      line(wall + 4, yMark, wall + 8, yMark); // UPDATED: Better positioning
      
      // Add number label
      strokeWeight(0.1);
      textSize(2);
      text(value, wall + 10, yMark);
      stroke(20);
      
    } else {
      // *** UPDATED: Better minor marks from condenser2 ***
      strokeWeight(0.1);
      line(wall + 5, yMark, wall + 6.5, yMark); // UPDATED: Shorter line, better positioning
    }
  }

  // *** UPDATED: Better mL label positioning from condenser2 ***
  textAlign(LEFT, BOTTOM);
  strokeWeight(0.1);
  text("mL", width - 4, wall + 2.8); // UPDATED: Better positioning

  pop();
}

// KEEP ORIGINAL: Condensate tube drawing logic
export function drawCondensateTube() {
  push();
  stroke(130);
  strokeWeight(2);
  noFill();

  // Points based on your setup
  const startX = 94 + 10;  // center of condenser body
  const startY = 28 + 34;  // bottom of condenser (y + height)

  const bendX = startX;    // vertical pipe first
  const bendY = startY + 48;   // just above the beaker

  // Position tube to enter beaker properly (inside the beaker walls)
  const endX = 30 + 8;     // beaker center (x=30, width=20, so center = 30+10, but offset slightly)
  const endY = 75;         // beaker top (y=50 + 25 = 75, but enter from top)

  const tubeWidth = 2.5; // thickness of pipe

  // Vertical pipe
  fill(200, 200, 200, 200); 
  noStroke();
  rect(startX - tubeWidth / 2, startY, tubeWidth, bendY - startY);

  pop();
}

// *** IMPROVED: Flow-rate coordinated liquid animation ***
export function drawCondensateTubeStream() {
  if (!drainingToBeaker || !window.experimentFlowsActive) {
    // Ramp down flow intensity when not draining
    flowIntensity = Math.max(0, flowIntensity - FLOW_RAMP_DOWN_RATE);
    if (flowIntensity <= 0) return;
  } else {
    // Ramp up flow intensity immediately when draining starts (no delay for tube animation)
    flowIntensity = Math.min(1.0, flowIntensity + FLOW_RAMP_UP_RATE);
  }

  const tubeX = 104;
  const topY = 62;
  const bottomY = 103;
  const tubeWidth = 2.5;

  // Get current material balance for flow rate coordination
  const materialBalance = coordinateFlowRates(window.reactorTemp || 300);
  const flowRate = materialBalance.liquidFillRate;

  // *** IMPROVED: Scale band creation frequency based on actual flow rate ***
  const flowRateMultiplier = Math.max(0.1, flowRate * 100 + 0.5);
  const actualInterval = Math.max(MIN_BAND_INTERVAL, BASE_BAND_INTERVAL / flowRateMultiplier);
  
  if (frameCount % Math.floor(actualInterval) === 0 && flowIntensity > 0.1) {
    const bandSize = random(4, 8) * (flowRate * BAND_SIZE_MULTIPLIER + 1);
    condensateBands.push({
      y: topY,
      opacity: 200 * flowIntensity,
      height: Math.min(bandSize, 15) // Cap maximum band size
    });
  }

  // *** IMPROVED: Vary speed based on flow rate and intensity ***
  const flowSpeedMultiplier = Math.max(0.2, flowRate * FLOW_SPEED_MULTIPLIER + 0.5);
  const effectiveSpeed = BASE_FLOW_SPEED * flowSpeedMultiplier * flowIntensity;

  push();
  noStroke();

  for (let i = condensateBands.length - 1; i >= 0; i--) {
    let segment = condensateBands[i];
    segment.y += effectiveSpeed;
    
    // *** IMPROVED: Smoother opacity fade ***
    const fadeRate = drainingToBeaker ? 0.3 : 1.5; // Fade faster when stopping
    segment.opacity = Math.max(0, segment.opacity - fadeRate);

    // Main liquid band
    fill(30, 100, 255, segment.opacity);
    rect(tubeX - tubeWidth / 2, segment.y, tubeWidth, segment.height);

    // Highlight for better visual effect
    fill(120, 180, 255, segment.opacity * 0.4);
    rect(tubeX - tubeWidth / 2 + 0.2, segment.y + 1, tubeWidth * 0.3, segment.height - 2);

    // Remove bands that have left the tube or faded completely
    if (segment.y > bottomY || segment.opacity <= 5) {
      condensateBands.splice(i, 1);
    }
  }

  pop();
}

// This function now just adds particles to the condenser's internal system
export function addParticleToCondenser() {
  // Only add particles if experiment flows are active
  if (!window.experimentFlowsActive) return;
  
  condenserParticles.push({
    x: 200, // Start at left edge of condenser
    y: 67.5, // Center Y of condenser
    vx: random(0.1, 0.3), // slower horizontal movement
    vy: random(-0.05, 0.05), // very gentle vertical movement
    alpha: 255,
    hasEntered: false // track if particle has fully entered condenser
  });
}

// *** IMPROVED: State-coordinated condensation process with better flow control ***
export function drawCondenserParticles() {
  const condenserCenterX = 210;
  const condenserCenterY = 67.5;
  const fadeRadius = 6;

  const currentTemp = window.reactorTemp || 300;
  const currentState = getExperimentState();
  const materialBalance = coordinateFlowRates(currentTemp);

  // Optional: simulate fill if you skip particle condensation
  if (
    currentState === "FILLING" &&
    window.experimentFlowsActive &&
    window.reactorHeaterOn &&
    condenserCoolingOn
  ) {
    condenserLiquidLevel = min(condenserLiquidLevel + 0.01, 1.0);
  }

  // Draw and update particles
  for (let i = condenserParticles.length - 1; i >= 0; i--) {
    let p = condenserParticles[i];

    fill(100, 180, 255, p.alpha);
    noStroke();
    ellipse(p.x, p.y, 2, 2);

    // Movement logic
    if (!p.hasEntered && p.x < 205) {
      p.x += p.vx;
      p.y += p.vy * 0.5;
    } else {
      p.hasEntered = true;
      p.x += p.vx * 0.5;
      p.y += p.vy * 0.5;

      const condenserLeft = 212;
      const condenserRight = 218;
      const condenserTop = 55;
      const condenserBottom = 80;

      if (p.x > condenserRight || p.x < condenserLeft) p.vx *= -1;
      if (p.y > condenserBottom || p.y < condenserTop) p.vy *= -1;
    }

    // Fade logic
    if (p.hasEntered) {
      const distFromCenter = dist(p.x, p.y, condenserCenterX, condenserCenterY);
      let fadeRate = condenserCoolingOn
        ? (distFromCenter < fadeRadius ? 6.0 : distFromCenter < fadeRadius * 1.5 ? 2.0 : 0.8)
        : (distFromCenter < fadeRadius ? 2.0 : distFromCenter < fadeRadius * 1.5 ? 0.8 : 0.2);

      p.alpha -= fadeRate;
    }

    if (p.alpha <= 0) {
      condenserParticles.splice(i, 1);
      particlesFaded++;  //  Count faded particles
    }
  }

  // === IMPROVED: Better liquid draining logic ===
  window.condensedFluidLevel = condensedFluidLevel;
  window.targetCollection = materialBalance.targetCollection;

  if (currentState !== lastExperimentState) {
    handleStateChange(currentState, lastExperimentState);
    lastExperimentState = currentState;
  }

  if (currentState === "FILLING" && window.experimentFlowsActive) {
    // *** IMPROVED: More consistent flow control logic ***
    const hasEnoughCondensate = particlesFaded >= CONDENSATION_THRESHOLD; // Now 5 particles
    const hasCondenserLevel = condenserLiquidLevel > MIN_CONDENSER_LEVEL;
    const belowTarget = condensedFluidLevel < materialBalance.targetCollection;
    const isCoolingActive = condenserCoolingOn && window.reactorHeaterOn;

    if (hasEnoughCondensate && hasCondenserLevel && belowTarget && isCoolingActive) {
      if (!drainingToBeaker) {
        drainingToBeaker = true;
        drainStartTime = millis();
        console.log(`Starting liquid collection at ${currentTemp}°C - tube flow immediate, beaker fills in 3s`);
      }

      // *** NEW: Tube flows immediately, but beaker filling is delayed by 3 seconds ***
      const timeElapsed = millis() - drainStartTime;
      const beakerFillDelayPassed = timeElapsed >= LIQUID_DRAIN_DELAY;

      if (beakerFillDelayPassed) {
        // Update beaker liquid level (only after 3 second delay)
        condensedFluidLevel += materialBalance.liquidFillRate;
        
        // *** IMPROVED: Use constants for buffer calculations ***
        const target_mL = materialBalance.targetCollection * 250;
        const current_mL = condensedFluidLevel * 250;

        // Check if target reached
        if (condensedFluidLevel >= materialBalance.targetCollection) {
          condensedFluidLevel = materialBalance.targetCollection;
          drainingToBeaker = false;
          condensateBands = [];
          condenserLiquidLevel = 0;

          if (typeof window.setExperimentComplete === "function") {
            window.setExperimentComplete();
            console.log("Target reached. Experiment ready for measurement.");
          }
        }
      } else {
        // During 3-second delay: tube shows flow but beaker doesn't fill yet
        const remainingTime = ((LIQUID_DRAIN_DELAY - timeElapsed) / 1000).toFixed(1);
        if (Math.floor(timeElapsed / 1000) !== Math.floor((timeElapsed - 16.67) / 1000)) { // Log every second
          console.log(`Tube flowing... beaker fills in ${remainingTime}s`);
        }
      }
      
      // Condenser liquid level always drains (regardless of delay)
      condenserLiquidLevel = Math.max(0, condenserLiquidLevel - materialBalance.liquidFillRate * 0.8);

      // Fast drain near target to empty condenser (only when beaker is actually filling)
      if (beakerFillDelayPassed) {
        const target_mL = materialBalance.targetCollection * 250;
        const current_mL = condensedFluidLevel * 250;
        if (current_mL >= target_mL - DRAIN_BUFFER_ML) {
          if (condenserLiquidLevel > 0) {
            condenserLiquidLevel = Math.max(0, condenserLiquidLevel - FAST_DRAIN_RATE);
          }
        }
      }
    } else {
      // Stop draining if conditions not met
      drainingToBeaker = false;
    }
  } else if (currentState === "COMPLETE" || currentState === "MEASURING") {
    drainingToBeaker = false;
    condensateBands = [];
    condensedFluidLevel = materialBalance.targetCollection;
    condenserLiquidLevel = 0;
  }
}

// Handle experiment state changes - KEEP ALL ORIGINAL LOGIC
function handleStateChange(newState, oldState) {
  console.log(`Condenser: State change ${oldState} → ${newState}`);
  
  switch (newState) {
    case "IDLE":
      // Reset all condenser state
      experimentStartTime = null;
      totalPropanolFed = 0;
      propanolConsumed = 0;
      liquidProductMass = 0;
      drainingToBeaker = false;
      condensateBands = [];
      condenserLiquidLevel = 0;
      condensedFluidLevel = 0; // Reset beaker to empty for new experiment
      particlesFaded = 0;
      flowIntensity = 0; // Reset flow intensity
      console.log("Condenser reset to initial state - beaker emptied");
      break;
      
    case "FILLING":
      if (oldState === "IDLE") {
        experimentStartTime = millis();
        console.log("Condenser: Starting material balance tracking");
      }
      break;
      
    case "COMPLETE":
      // Stop all flows immediately
      drainingToBeaker = false;
      condensateBands = [];
      console.log("Condenser: All flows stopped - experiment complete");
      console.log("Condenser will drain, beaker level maintained");
      break;
      
    case "MEASURING":
      // Maintain stopped state during measurement
      break;
      
    case "RESET":
      // Will transition to IDLE on next frame
      break;
  }
}

// Realistic material balance calculations with state coordination - KEEP ALL ORIGINAL LOGIC
export function coordinateFlowRates(temp) {
  const currentState = getExperimentState();
  
  // No flow rates outside of FILLING state
  if (currentState !== "FILLING" || !window.experimentFlowsActive) {
    return { 
      gasFlowRate: 0, 
      liquidFillRate: 0, 
      targetCollection: condensedFluidLevel, // Maintain current level
      conversion: 0 
    };
  }

  // Initialize experiment if not started
  if (!experimentStartTime && window.reactorHeaterOn && temp >= 290) {
    experimentStartTime = millis();
    totalPropanolFed = 0;
    propanolConsumed = 0;
    liquidProductMass = 0;
    console.log("Material balance experiment started");
  }

  // Reset if heater turned off
  if (!window.reactorHeaterOn) {
    experimentStartTime = null;
    return { gasFlowRate: 0, liquidFillRate: 0, targetCollection: 0, conversion: 0 };
  }

  // Calculate based on worksheet stoichiometry
  const propanolFed = 3.33; // mol (250 mL * 0.8 g/mL / 60 g/mol)
  let conversion, gasProduced_mol, liquidProduced_mL, vaporFlowRate_mL_s;
  
  if (temp >= 300 && temp < 330) {
    conversion = 0.40; // 40% conversion at 300°C
    gasProduced_mol = propanolFed * conversion; // 1.33 mol gas total
    liquidProduced_mL = 155; // Target: ~155 mL liquid collection
    vaporFlowRate_mL_s = 2.5; // 2.5 mL/s gas flow rate
  } else if (temp >= 330) {
    conversion = 0.60; // 60% conversion at 330°C
    gasProduced_mol = propanolFed * conversion; // 2.0 mol gas total
    liquidProduced_mL = 185; // Target: ~185 mL liquid collection
    vaporFlowRate_mL_s = 6.0; // 6.0 mL/s gas flow rate
  } else {
    // Below reaction temperature
    conversion = 0;
    gasProduced_mol = 0;
    liquidProduced_mL = 0;
    vaporFlowRate_mL_s = 0;
  }

  // Convert to simulation scale (250 mL beaker = 1.0 scale)
  const targetCollection = liquidProduced_mL / 250; // Scale to 0-1
  
  // More realistic fill rate coordination with experiment timing
  const experimentDuration_s = 120; // 2 minutes
  const liquidFillRate = targetCollection / (experimentDuration_s * 60) * 2.0; // per frame at 60fps

  console.log(`Temp: ${temp}°C, Conversion: ${(conversion*100).toFixed(0)}%, Target: ${liquidProduced_mL}mL, Gas: ${vaporFlowRate_mL_s}mL/s`);

  return {
    gasFlowRate: vaporFlowRate_mL_s,
    liquidFillRate: liquidFillRate,
    targetCollection: targetCollection,
    conversion: conversion,
    propanolReacted: propanolFed * conversion,
    propanolUnreacted: propanolFed * (1 - conversion)
  };
}

// Get current material balance data for display
export function getMaterialBalanceData() {
  const currentTemp = window.reactorTemp || 300;
  return coordinateFlowRates(currentTemp);
}

// Check if condenser is ready for operation
export function isCondenserReady() {
  return condenserCoolingOn && window.reactorHeaterOn;
}

// *** IMPROVED: Enhanced debugging information ***
export function getCondenserState() {
  const timeElapsed = drainingToBeaker ? millis() - drainStartTime : 0;
  const beakerFillDelayPassed = timeElapsed >= LIQUID_DRAIN_DELAY;
  
  return {
    coolingOn: condenserCoolingOn,
    liquidLevel: condenserLiquidLevel,
    fluidLevel: condensedFluidLevel,
    draining: drainingToBeaker,
    flowIntensity: flowIntensity,
    particleCount: condenserParticles.length,
    bandCount: condensateBands.length,
    particlesFaded: particlesFaded,
    beakerFillDelay: {
      timeElapsed: timeElapsed,
      delayPassed: beakerFillDelayPassed,
      remainingTime: Math.max(0, LIQUID_DRAIN_DELAY - timeElapsed)
    },
    thresholdsMet: {
      condensationThreshold: particlesFaded >= CONDENSATION_THRESHOLD, // 5 particles
      minLevel: condenserLiquidLevel > MIN_CONDENSER_LEVEL,
      coolingActive: condenserCoolingOn && window.reactorHeaterOn,
      beakerFillDelayPassed: beakerFillDelayPassed
    }
  };
}

// *** IMPROVED: Enhanced reset function ***
export function resetCondenser() {
  // Reset equipment state
  window.condenserCoolingOn = false;
  
  // Reset cooling visuals
  coolingCoilColor = 120; // Steel gray
  if (coolingTimer) {
    clearTimeout(coolingTimer);
    coolingTimer = null;
  }
  
  // Reset fluid levels
  condensedFluidLevel = 0.0;
  condenserLiquidLevel = 0.0;
  
  // Reset flow state
  drainingToBeaker = false;
  drainStartTime = 0;
  flowIntensity = 0; // Reset flow intensity
  
  // Reset particle arrays
  condenserParticles = [];
  condensateBands = [];
  
  // Reset material balance tracking
  experimentStartTime = null;
  totalPropanolFed = 0;
  propanolConsumed = 0;
  liquidProductMass = 0;
  lastExperimentState = "IDLE";
  particlesFaded = 0; // Reset particle counter
  
  // Reset global variables
  window.condensedFluidLevel = 0.0;
  window.targetCollection = 0.0;
  
  console.log("Condenser reset complete - all flow states cleared");
}