import { getExperimentState } from "./draw.js";

window.condenserCoolingOn = false;
let coolingCoilColor = 120; // steel gray by default
let coolingTimer = null;
export let condensedFluidLevel = 0.0;
export let condenserLiquidLevel = 0.0; // New: liquid level inside condenser

// Liquid flow animation variables
export let drainingToBeaker = false;
let drainStartTime = 0;
let condensateBands = [];

export let condenserParticles = [];

// Material balance state tracking with experiment coordination
let experimentStartTime = null;
let totalPropanolFed = 0; // mol
let propanolConsumed = 0; // mol
let liquidProductMass = 0; // g
let lastExperimentState = "IDLE";

export function drawCondenserBody(x = 200, y = 50) {
  push();
  translate(x, y);

  const bodyWidth = 20;
  const bodyHeight = 35;
  const borderRadius = 10;
  const wallThickness = 1.5;

  // Draw Internal Liquid (Clipped Inside Rounded Rect)
  if (condenserLiquidLevel > 0) {
    // Clipping to match evaporator-style tight inner bounds
    drawingContext.save();
    drawingContext.beginPath();

    const innerX = wallThickness * 0.3;
    const innerY = wallThickness * 0.3;
    const innerW = bodyWidth - wallThickness * 0.6;
    const innerH = bodyHeight - wallThickness * 0.6;
    const innerRadius = borderRadius - wallThickness * 0.8;

    // Rounded rectangle clipping path
    drawingContext.moveTo(innerX + innerRadius, innerY);
    drawingContext.lineTo(innerX + innerW - innerRadius, innerY);
    drawingContext.quadraticCurveTo(innerX + innerW, innerY, innerX + innerW, innerY + innerRadius);
    drawingContext.lineTo(innerX + innerW, innerY + innerH - innerRadius);
    drawingContext.quadraticCurveTo(innerX + innerW, innerY + innerH, innerX + innerW - innerRadius, innerY + innerH);
    drawingContext.lineTo(innerX + innerRadius, innerY + innerH);
    drawingContext.quadraticCurveTo(innerX, innerY + innerH, innerX, innerY + innerH - innerRadius);
    drawingContext.lineTo(innerX, innerY + innerRadius);
    drawingContext.quadraticCurveTo(innerX, innerY, innerX + innerRadius, innerY);
    drawingContext.closePath();

    drawingContext.clip();

    // Draw liquid inside condenser (fills only 1/3 height)
    const liquidMaxH = innerH / 3;  // Only allow bottom 1/3
    const liquidHeight = condenserLiquidLevel * (liquidMaxH - 1);
    const liquidY = innerY + innerH - liquidHeight-0.3;  // From bottom up

    fill(30, 100, 255, 180);
    noStroke();
    rect(innerX, liquidY, innerW, liquidHeight);

    drawingContext.restore();
  }

  // Outer Container
  stroke(180);
  strokeWeight(wallThickness);
  fill(255, 255, 255, 50);
  rect(0, 0, bodyWidth, bodyHeight, borderRadius);

  // Cooling Coil
  const coilOffset = 10;
  const spacing = 2;
  const turns = 6;
  const coilTopY = coilOffset + 4;
  const coilBottomY = coilTopY + spacing * (turns - 1);
  const coilCenterX = bodyWidth / 2;

  push();
  translate(0, coilOffset);
  stroke(coolingCoilColor);
  strokeWeight(0.8);
  noFill();
  for (let i = 0; i < turns; i++) {
    let y = i * spacing + 4;
    arc(coilCenterX, y, bodyWidth + 5, spacing, 0, TWO_PI);
  }
  pop();

  // Cooling Wires
  const switchX = -12;
  const switchY = 37;
  stroke(coolingCoilColor);
  strokeWeight(0.8);
  noFill();

  // top wire
  bezier(switchX + 1, switchY, switchX - 10, switchY - 2,
         0 + 1, coilTopY - 4, 0, coilTopY);

  // bottom wire
  bezier(switchX + 1, switchY, switchX - 10, switchY + 2,
         0 + 1, coilBottomY + 3, 0, coilBottomY);

  pop();
}

// Cooling Switch UI
export function drawCoolingSwitch(x = 120, y = 100) {
  const w = 15, h = 8;

  push();
  translate(x, y);

    // Lever
  push();
  translate(0, 0);
  rotate(radians(condenserCoolingOn ? 30 : -30));
  stroke(10);
  strokeWeight(1);
  line(0, 0, 0, -4);
  pop();
  
  // Switch Box
  fill(60);
  noStroke();
  rect(-w / 2, 0, w, h,  4);



  // Labels
  fill(255);
  noStroke();
  textSize(2.5);
  textAlign(CENTER, CENTER);
  text("OFF", -w / 2 + 4, h / 2);
  text("ON", w / 2 - 4, h / 2);

  // Label
  fill(0);
  text("cooling switch", 0, 11);

  pop();
}

// Handle mouse click
export function toggleCooling(mx, my) {
  const x = 82, y = 65;
  const w = 15, h = 8;
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

export function drawCollectingBeaker(x = 20, y = 50, fluidLevel = 0.5) {
  const width = 20;
  const height = 25;
  const wall = 2;

  const innerX = wall;
  const innerW = width - 2 * wall;
  const fluidH = height * fluidLevel ;
  const fluidY = height - fluidH-0.5;

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

  // Graduation Marks
  const maxValue = 250;
  const minorSteps = 25; // Every 10mL from 0 to 250
  const markSpacing = (height - 2 * wall) / minorSteps;
  const startY = height - wall +1.8;

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
      line(wall + 3, yMark, wall + 10, yMark); // Long line
      
      // Add number label
        strokeWeight(0.1);
      textSize(2);
      text(value, wall + 10, yMark);
      stroke(20);
      
    } else {
      // Minor marks - lines only (10, 20, 30, 40, 60, 70, etc.)
      strokeWeight(0.1);
      line(wall + 5, yMark, wall + 8, yMark); // Short line, no label
    }
  }

  // mL label
  textAlign(LEFT, BOTTOM);
    strokeWeight(0.1);

  text("mL", width - 6, wall );

  fill(0); // Black text for the label
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(2.5);
  text("drawing beaker", width / 2, height + 3); // Label below the beaker

  pop();
}

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

// State-coordinated liquid flow animation
export function drawCondensateTubeStream() {
  // Only show liquid stream if experiment flows are active
  if (!drainingToBeaker || !window.experimentFlowsActive) return;

  const tubeX = 104; // Center X of the tube
  const topY = 62;   // Start of tube (bottom of condenser)
  const bottomY = 100; // End at beaker top (y=50 + 25 = 75)
  const tubeWidth = 2.5; // Match the tube width
  const speed = 0.3; // Slower speed for more realistic flow

  // Create rectangular liquid segments less frequently for slower flow
  if (frameCount % 30 === 0 && condenserLiquidLevel > 0.25) { // Only when above 1/4th
    condensateBands.push({ 
      y: topY,
      opacity: 200,
      height: random(6, 12) // Smaller segments for slower flow
    });
  }

  // Update and draw rectangular liquid segments
  push();
  noStroke();
  
  for (let i = condensateBands.length - 1; i >= 0; i--) {
    let segment = condensateBands[i];
    segment.y += speed;
    
    // Gradual fade as segment travels
    segment.opacity = max(0, segment.opacity - 0.5); // Slower fade
    
    // Draw the main liquid rectangle inside the tube
    fill(30, 100, 255, segment.opacity);
    rect(tubeX - tubeWidth/2, segment.y, tubeWidth, segment.height);
    
    // Add a subtle highlight on one side
    fill(120, 180, 255, segment.opacity * 0.4);
    rect(tubeX - tubeWidth/2 + 0.2, segment.y + 1, tubeWidth * 0.3, segment.height - 2);

    // Remove segment when it reaches bottom or fades completely
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

// State-coordinated condensation process
export function drawCondenserParticles() {
  const condenserCenterX = 210;
  const condenserCenterY = 67.5;
  const fadeRadius = 6;

  for (let i = condenserParticles.length - 1; i >= 0; i--) {
    let p = condenserParticles[i];

    // Draw vapor particle
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

    // Condensation logic - same as before
    if (p.hasEntered) {
      const distFromCenter = dist(p.x, p.y, condenserCenterX, condenserCenterY);
      let fadeRate = 0.2;
      if (distFromCenter < fadeRadius) {
        fadeRate = condenserCoolingOn ? 6.0 : 2.0;
      } else if (distFromCenter < fadeRadius * 1.5) {
        fadeRate = condenserCoolingOn ? 2.0 : 0.8;
      } else {
        fadeRate = condenserCoolingOn ? 0.8 : 0.2;
      }
      p.alpha -= fadeRate;
    }

    if (p.alpha <= 0) {
      condenserParticles.splice(i, 1);
      condenserLiquidLevel = min(condenserLiquidLevel + 0.008, 1.0);
    }
  }

  // State-coordinated material balance with early completion
  const currentTemp = window.reactorTemp || 300;
  const currentState = getExperimentState();
  const materialBalance = coordinateFlowRates(currentTemp);
  
  // Make beaker progress available globally for evaporator coordination
  window.condensedFluidLevel = condensedFluidLevel;
  window.targetCollection = materialBalance.targetCollection;
  
  // Handle state transitions
  if (currentState !== lastExperimentState) {
    handleStateChange(currentState, lastExperimentState);
    lastExperimentState = currentState;
  }
  
  // Only process liquid flow during FILLING state
  if (currentState === "FILLING" && window.experimentFlowsActive) {
    // Wait until condenser is 1/4th full before starting flow
    if (condenserLiquidLevel > 0.25 && condensedFluidLevel < materialBalance.targetCollection) {
      if (!drainingToBeaker) {
        drainingToBeaker = true;
        drainStartTime = millis();
        console.log(`Starting liquid collection at ${currentTemp}°C`);
      }
      
      // Use realistic transfer rate based on temperature
      condensedFluidLevel += materialBalance.liquidFillRate;
      condenserLiquidLevel = max(0, condenserLiquidLevel - materialBalance.liquidFillRate * 0.8);
      
      // Progressive condenser draining - normal until target-20mL, then fast drain
      const targetLevel = materialBalance.targetCollection;
      const target_mL = targetLevel * 250; // Convert to mL (155mL or 185mL)
      const current_mL = condensedFluidLevel * 250; // Current beaker level in mL
      const threshold_mL = target_mL - 5; // Start fast drain 20mL before target
      
      // Normal draining until 20mL before target
      if (current_mL < threshold_mL) {
        // Standard draining rate - let it behave normally
        // (condenserLiquidLevel already being reduced by standard rate above)
      } else {
        // Fast draining in final 20mL approach to target
        const fastDrainRate = 0.008; // 4x faster than normal
        if (condenserLiquidLevel > 0) {
          condenserLiquidLevel = max(0, condenserLiquidLevel - fastDrainRate);
          console.log(`Fast drain active: ${current_mL.toFixed(0)}mL/${target_mL.toFixed(0)}mL (${(target_mL - current_mL).toFixed(0)}mL to target)`);
        }
      }
      
      // Check if target collection is reached - stop flow but keep equipment on
      if (condensedFluidLevel >= materialBalance.targetCollection) {
        condensedFluidLevel = materialBalance.targetCollection; // Cap at target
        drainingToBeaker = false;
        condensateBands = []; // Clear flowing liquid
        
        // Empty condenser completely when target reached
        condenserLiquidLevel = 0;
        console.log("Final drain: Condenser emptied completely");
        
        // Just transition to COMPLETE state, no equipment shutdown
        if (typeof window.setExperimentComplete === 'function') {
          window.setExperimentComplete();
          console.log(`Target reached! Experiment ready for measurement at ${currentTemp}°C`);
          console.log(`Collected: ${(materialBalance.targetCollection * 250).toFixed(0)}mL - condenser fully drained`);
        }
      }
      
    } else if (condenserLiquidLevel <= 0.05) {
      // Only stop draining when liquid is very low
      drainingToBeaker = false;
    }
  } else if (currentState === "COMPLETE" || currentState === "MEASURING") {
    // Just stop liquid flows, keep everything else running
    drainingToBeaker = false;
    condensateBands = []; // Clear flowing liquid
    
    // Keep beaker level stable at target, condenser stays empty
    const materialBalance = coordinateFlowRates(currentTemp);
    condensedFluidLevel = materialBalance.targetCollection; // Maintain target level
    condenserLiquidLevel = 0; // Keep condenser empty after completion
  }
}

// Handle experiment state changes
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

// Realistic material balance calculations with state coordination
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

// Get condenser state for debugging
export function getCondenserState() {
  return {
    coolingOn: condenserCoolingOn,
    liquidLevel: condenserLiquidLevel,
    fluidLevel: condensedFluidLevel,
    draining: drainingToBeaker,
    particleCount: condenserParticles.length,
    bandCount: condensateBands.length
  };
}

// Reset function for condenser component  
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
  
  // Reset particle arrays
  condenserParticles = [];
  condensateBands = [];
  
  // Reset material balance tracking
  experimentStartTime = null;
  totalPropanolFed = 0;
  propanolConsumed = 0;
  liquidProductMass = 0;
  lastExperimentState = "IDLE";
  
  // Reset global variables
  window.condensedFluidLevel = 0.0;
  window.targetCollection = 0.0;
  
  console.log("Condenser reset complete");
}