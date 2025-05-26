// CSTR (Continuous Stirred Tank Reactor) simulation graphics module

// Global state variables
let sliderAValue = 0.3; // NaOH concentration
let sliderBValue = 0.3; // CH₃COOCH₃ concentration
let valveAPosition = 0; // NaOH valve (0 to -π/2)
let valveBPosition = 0; // CH₃COOCH₃ valve (0 to -π/2)
let waveOffset = 0; // Liquid surface animation

// Add vertical offset constant
const VERTICAL_OFFSET = -50; // Negative value moves everything up

// Add slider position variables
let sliderYCommon = 0; // Will be updated in drawSimulation
let sliderTrackY = 0; // Will be updated in drawSimulation

// Tank levels (0 to 1)
let tankALiquidLevel = 1.0; // NaOH tank - Changed from 0.85 to 1.0 to represent 20L
let tankBLiquidLevel = 1.0; // CH₃COOCH₃ tank - Changed from 0.85 to 1.0 to represent 20L
let simpleTankLiquidLevel = 0.65; // CSTR tank
let collectionTankLiquidLevel = 0; // Collection tank

// Animation and control states
let simpleTankWaterfallProgress = 0; // CSTR waterfall
let collectionTankWaterfallProgress = 0; // Collection waterfall
let rotorAngle = 0; // Rotor rotation
let rotorOn = false; // Rotor power
let pumpASwitchOn = false; // NaOH pump
let pumpBSwitchOn = false; // CH₃COOCH₃ pump

// UI element bounds
let switchBounds = null; // Rotor switch
let pumpASwitchBounds = null; // NaOH pump switch
let pumpBSwitchBounds = null; // CH₃COOCH₃ pump switch
let resetButtonBounds = null; // Reset button
let setButtonBounds = null; // Concentration set
let tempSetButtonBounds = null; // Temperature set

// Control states
let temperatureValue = 55; // Temperature (°C) - default to middle of range
let temperatureSet = false; // Temp set state
let concentrationSet = false; // Conc set state

// Interaction handles
let tankAHandle = null; // NaOH valve
let tankBHandle = null; // CH₃COOCH₃ valve

// Flow tracking
let lastUpdateTime = 0; // Last flow update
let tankADeltaV = 0; // NaOH volume
let tankBDeltaV = 0; // CH₃COOCH₃ volume
let tankALastFlowTime = 0; // Last NaOH flow
let tankBLastFlowTime = 0; // Last CH₃COOCH₃ flow
let totalInletFlowRate = 0; // Total inlet flow

// CSTR calculations
let lastCalculationTime = 0; // Last calc time
let currentCA1 = 0; // CH₃COONa conc
let currentCB1 = 0; // CH₃OH conc
let accumulatedTime = 0; // Reaction time

// Color states
let lastCSTRColor = null; // CSTR tank color
let lastCollectionColor = null; // Collection tank color

// Import CSTR calculation module
const run_CSTR = require('./cstr_calc');

// Simulation constants
const TANK_VOLUME = 20000; // 20L in ml (was 200L)
const FLOW_RATE_FACTOR = 0.0000003; // Flow scaling
const MAX_FLOW_RATE = 60; // Max flow (ml/s)
const SIMPLE_TANK_MAX_LEVEL = 0.65; // Max CSTR level
const COLLECTION_TANK_MAX_LEVEL = 0.80; // Max collection tank level (decreased from 0.85)
const SIMPLE_TANK_FILL_RATE = 0.0005; // CSTR fill rate

// Add these global variables at the top with other state variables
let isDraggingValveA = false;
let isDraggingValveB = false;
let lastVolumeUpdateTime = 0;
let displayTankADeltaV = 0;
let displayTankBDeltaV = 0;
let displayCA1 = 0;
let displayCB1 = 0;

// Import hamburger menu functions
import { drawHamburgerMenu, handleHamburgerClick } from './hamburger';

function drawValveMonitor(x, y, value) {
  // Monitor box
  stroke(0);
  strokeWeight(1);
  fill(220);
  const monitorWidth = 80; // Increased from 65 to 80
  const monitorHeight = 40; // Increased from 35 to 40
  rect(x, y, monitorWidth, monitorHeight, 5);
  
  // Display value in ml/sec
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18); // Increased text size for flow rate
  // Map from 0 to π/2 to 0 to MAX_FLOW_RATE, scaling the input range
  const flowRate = map(Math.abs(value), 0, Math.PI / 2, 0, MAX_FLOW_RATE) * (Math.PI / 2);
  text(flowRate.toFixed(1) + " mL/s", x + monitorWidth / 2, y + monitorHeight / 2);
}

function drawPump(x, y, size, pipeWidth, label) {
  // Main pump body (circular housing)
  stroke(40);
  strokeWeight(2);
  fill(180, 180, 190); // Metallic grey
  circle(x, y, size);

  // Rectangular flange and bolts at left (inlet)
  const flangeW = size * 0.60;
  const flangeH = size * 0.33;
  const boltSize = flangeH * 0.32;
  const boltOffsets = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ];
  const inletX = x - size / 2;
  fill(200, 200, 210);
  stroke(40);
  strokeWeight(2);
  rect(inletX - flangeW / 2, y - flangeH / 2, flangeW, flangeH, 5);
  // Bolts at corners - consistent style
  fill(160, 160, 170); // Metallic grey for bolts
  stroke(40);
  strokeWeight(2);
  for (const [dx, dy] of boltOffsets) {
    ellipse(inletX + dx * (flangeW / 2 - boltSize / 2), y + dy * (flangeH / 2 - boltSize / 2), boltSize, boltSize);
  }
  
  // Motor housing (rectangle on top)
  const motorWidth = size * 0.8;
  const motorHeight = size * 0.6;
  fill(160, 160, 170); // Darker metallic
  rect(x - motorWidth / 2, y - size / 2 - motorHeight, motorWidth, motorHeight, 5);
  
  // Cooling fins on motor
  const finCount = 5;
  const finSpacing = motorHeight / (finCount + 1);
  const finLength = motorWidth * 0.1;
  stroke(140, 140, 150);
  strokeWeight(2);
  for (let i = 1; i <= finCount; i++) {
    const finY = y - size / 2 - motorHeight + i * finSpacing;
    line(x - motorWidth / 2 - finLength, finY, x + motorWidth / 2 + finLength, finY);
  }
  
  // Central shaft detail
  stroke(100);
  strokeWeight(2);
  const shaftSize = size * 0.15;
  fill(140, 140, 150);
  circle(x, y, shaftSize);
  
  // Bolt details around the pump housing
  stroke(80);
  strokeWeight(1);
  const boltCount = 8;
  const boltRadius = size * 0.4;
  for (let i = 0; i < boltCount; i++) {
    const angle = (i * 2 * Math.PI) / boltCount;
    const bx = x + Math.cos(angle) * boltRadius;
    const by = y + Math.sin(angle) * boltRadius;
    fill(160, 160, 170);
    circle(bx, by, boltSize);
  }
  
  // Draw horizontal outlet pipe with different lengths for each tank
  const baseOutletLength = size * 1.5;
  const outletLength = label === "Tank A" ? baseOutletLength * 1.83 : baseOutletLength * 0.5; // Increased for Tank A
  const pipeEndX = x + size / 2 + outletLength;
  
  // Set uniform pipe style
  stroke(0);
  strokeWeight(1);
  fill(240); // Light grey for pipes
  
  // Draw horizontal outlet pipe from pump with rounded ends
  stroke(40);
  strokeWeight(2);
  beginShape();
  // Left end (at pump)
  arc(x + size / 2, y, pipeWidth, pipeWidth, -Math.PI / 2, Math.PI / 2);
  // Top line
  vertex(x + size / 2, y - pipeWidth / 2);
  vertex(pipeEndX, y - pipeWidth / 2);
  // Right end
  arc(pipeEndX, y, pipeWidth, pipeWidth, -Math.PI / 2, Math.PI / 2);
  // Bottom line
  vertex(pipeEndX, y + pipeWidth / 2);
  vertex(x + size / 2, y + pipeWidth / 2);
  endShape(CLOSE);
  
  // Draw intersection circle with mechanical details
  const circleRadius = pipeWidth * 0.6;
  const jointBoltCount = 6;
  const jointBoltRadius = circleRadius * 0.7;
  const jointBoltSize = circleRadius * 0.15;
  
  // Draw the main circle
  fill(240);
  circle(pipeEndX, y, circleRadius * 2);
  
  // Draw bolt holes around the circle
  stroke(40);
  strokeWeight(2);
  for (let i = 0; i < jointBoltCount; i++) {
    const angle = (i * 2 * Math.PI) / jointBoltCount;
    const bx = pipeEndX + Math.cos(angle) * jointBoltRadius;
    const by = y + Math.sin(angle) * jointBoltRadius;
    fill(200); // Consistent grey fill for bolts
    circle(bx, by, jointBoltSize);
  }
  
  // Draw center cross detail
  stroke(0); // Black stroke for cross
  strokeWeight(1);
  line(pipeEndX - circleRadius * 0.3, y, pipeEndX + circleRadius * 0.3, y);
  line(pipeEndX, y - circleRadius * 0.3, pipeEndX, y + circleRadius * 0.3);
  
  // Draw vertical pipe for both tanks with different heights
  const verticalPipeHeight = label === "Tank B" ? 400 : 100; // Longer for Tank B
  const verticalPipeY = y;
  
  // Reset pipe style for vertical pipe
  stroke(0);
  strokeWeight(1);
  fill(240);
  
  // Draw vertical pipe going up from intersection (appears behind the circle)
  stroke(40);
  strokeWeight(2);
  beginShape();
  // Bottom end
  arc(pipeEndX, verticalPipeY, pipeWidth, pipeWidth, 0, Math.PI);
  // Left line
  vertex(pipeEndX - pipeWidth / 2, verticalPipeY);
  vertex(pipeEndX - pipeWidth / 2, verticalPipeY - verticalPipeHeight);
  // Top end
  arc(pipeEndX, verticalPipeY - verticalPipeHeight, pipeWidth, pipeWidth, 0, Math.PI);
  // Right line
  vertex(pipeEndX + pipeWidth / 2, verticalPipeY - verticalPipeHeight);
  vertex(pipeEndX + pipeWidth / 2, verticalPipeY);
  endShape(CLOSE);
  
  // Redraw the circle and details to ensure they're on top
  fill(240);
  circle(pipeEndX, y, circleRadius * 2);
  
  // Redraw bolt holes with consistent colors
  for (let i = 0; i < jointBoltCount; i++) {
    const angle = (i * 2 * Math.PI) / jointBoltCount;
    const bx = pipeEndX + Math.cos(angle) * jointBoltRadius;
    const by = y + Math.sin(angle) * jointBoltRadius;
    fill(200); // Consistent grey fill for bolts
    circle(bx, by, jointBoltSize);
  }
  
  // Redraw center cross with consistent color
  stroke(0); // Black stroke for cross
  strokeWeight(1);
  line(pipeEndX - circleRadius * 0.3, y, pipeEndX + circleRadius * 0.3, y);
  line(pipeEndX, y - circleRadius * 0.3, pipeEndX, y + circleRadius * 0.3);

  // Add horizontal pipe and intersection for Tank B
  if (label === "Tank B") {
    const horizontalPipeLength = 100; // Length of the horizontal pipe at top
    const horizontalPipeY = verticalPipeY - verticalPipeHeight;
    
    // Set uniform pipe style
    stroke(0);
    strokeWeight(1);
    fill(240); // Light grey for pipes
    
    // Draw horizontal pipe at top of vertical pipe with rounded ends
    stroke(40);
    strokeWeight(2);
    beginShape();
    // Left end
    arc(pipeEndX, horizontalPipeY, pipeWidth, pipeWidth, -Math.PI / 2, Math.PI / 2);
    // Top line
    vertex(pipeEndX, horizontalPipeY - pipeWidth / 2);
    vertex(pipeEndX + horizontalPipeLength, horizontalPipeY - pipeWidth / 2);
    // Right end
    arc(pipeEndX + horizontalPipeLength, horizontalPipeY, pipeWidth, pipeWidth, -Math.PI / 2, Math.PI / 2);
    // Bottom line
    vertex(pipeEndX + horizontalPipeLength, horizontalPipeY + pipeWidth / 2);
    vertex(pipeEndX, horizontalPipeY + pipeWidth / 2);
    endShape(CLOSE);
    
    // Draw intersection circle with mechanical details at top
    fill(240);
    circle(pipeEndX, horizontalPipeY, circleRadius * 2);
    
    // Draw bolt holes around the circle
    stroke(40);
    strokeWeight(2);
    for (let i = 0; i < jointBoltCount; i++) {
      const angle = (i * 2 * Math.PI) / jointBoltCount;
      const bx = pipeEndX + Math.cos(angle) * jointBoltRadius;
      const by = horizontalPipeY + Math.sin(angle) * jointBoltRadius;
      fill(200);
      circle(bx, by, jointBoltSize);
    }
    
    // Draw center cross detail
    stroke(0);
    strokeWeight(1);
    line(pipeEndX - circleRadius * 0.3, horizontalPipeY, pipeEndX + circleRadius * 0.3, horizontalPipeY);
    line(pipeEndX, horizontalPipeY - circleRadius * 0.3, pipeEndX, horizontalPipeY + circleRadius * 0.3);

    // Draw the new tank at the end of the horizontal pipe
    const tankWidth = size * 5.0; // Doubled from 2.5
    const tankHeight = size * 6.0; // Doubled from 3
    const tankX = pipeEndX + horizontalPipeLength + tankWidth / 2;
    const tankY = horizontalPipeY + size * 2; // Moved down by 2 times the pump size

    // Inlet pipe end position (where water falls from)
    const inletX = pipeEndX + horizontalPipeLength;
    const inletY = horizontalPipeY;

    // Calculate the top of the liquid in the tank (inner wall)
    const wall = Math.max(4, tankWidth * 0.035);
    const tankInnerTop = tankY - tankHeight / 2 + wall;
    const tankInnerBottom = tankY + tankHeight / 2 - wall;
    const liquidHeight = (tankHeight - wall) * simpleTankLiquidLevel;
    const liquidTopY = tankInnerBottom - liquidHeight;

    // X position for the waterfall to land just inside the inner wall
    const fallLandingX = tankX - (tankWidth - 2 * wall) / 2; // exactly at the left inner wall

    // Calculate flow rates based on valve positions (ensure local definition)
    const currentFlowRateA = pumpASwitchOn ? map(Math.abs(valveAPosition), 0, Math.PI / 2, 0, MAX_FLOW_RATE) : 0;
    const currentFlowRateB = pumpBSwitchOn ? map(Math.abs(valveBPosition), 0, Math.PI / 2, 0, MAX_FLOW_RATE) : 0;

    // Calculate blended color for inlet flow based on concentrations (slider values)
    const totalConcentration = sliderAValue + sliderBValue;
    const inletAWeight = totalConcentration > 0 ? sliderAValue / totalConcentration : 0.5;
    const inletBWeight = totalConcentration > 0 ? sliderBValue / totalConcentration : 0.5;
    // Tank A is reddish, Tank B is greenish (as before)
    const feedAColor = color(255 - sliderAValue * 100, 120, 120, 200); // reddish
    const feedBColor = color(200 - sliderBValue * 100, 255 - sliderBValue * 100, 220 - sliderBValue * 100, 200); // greenish
    const inletRed = red(feedAColor) * inletAWeight + red(feedBColor) * inletBWeight;
    const inletGreen = green(feedAColor) * inletAWeight + green(feedBColor) * inletBWeight;
    const inletBlue = blue(feedAColor) * inletAWeight + blue(feedBColor) * inletBWeight;
    const inletFlowColor = color(inletRed, inletGreen, inletBlue, 200);

    // CSTR tank liquid color logic (now global for this function)
    const waterColor = color(140, 180, 255, 140); // deeper blue water
    let mainCSTRColor = waterColor;
    if ((currentFlowRateA > 0 && pumpASwitchOn) || (currentFlowRateB > 0 && pumpBSwitchOn)) {
      // Blend water and inlet flow color 50/50
      const blendRed = red(waterColor) * 0.5 + red(inletFlowColor) * 0.5;
      const blendGreen = green(waterColor) * 0.5 + green(inletFlowColor) * 0.5;
      const blendBlue = blue(waterColor) * 0.5 + blue(inletFlowColor) * 0.5;
      mainCSTRColor = color(blendRed, blendGreen, blendBlue, 160);
      lastCSTRColor = mainCSTRColor; // Store the last active color
    } else if (lastCSTRColor !== null) {
      mainCSTRColor = lastCSTRColor; // Use the last active color when pumps are off
    }
    // Store the final CSTR tank color for use elsewhere
    const finalCSTRColor = mainCSTRColor;

    // Draw the tank
    drawSimpleTank(tankX, tankY, tankWidth, tankHeight, simpleTankLiquidLevel, finalCSTRColor, width); // Use new logic for tank color

    // Draw total inlet flow rate monitor (moved outside waterfall condition)
    const totalFlowRate = currentFlowRateA + currentFlowRateB;
    const flowMonitorX = inletX - 60; // Moved further left (from -30 to -80)
    const flowMonitorY = inletY - 60;
    // Add label above monitor
    // fill(0);
    // noStroke();
    // textAlign(CENTER, BOTTOM);
    // textSize(12);
    // text("Total Inlet Flow Rate", flowMonitorX, flowMonitorY - 5);
    // // Draw monitor
    // stroke(0);
    // strokeWeight(1);
    // fill(220);
    // const monitorWidth = 75; // Increased from 60
    // const monitorHeight = 35; // Increased from 30
    // rect(flowMonitorX - monitorWidth / 2, flowMonitorY, monitorWidth, monitorHeight, 5);
    // // Display value in ml/sec
    // fill(0);
    // noStroke();
    // textAlign(CENTER, CENTER);
    // textSize(12);
    // // Only show non-zero value if at least one pump is on
    // const displayValue = (pumpASwitchOn || pumpBSwitchOn) ? totalFlowRate.toFixed(1) : "0.0";
    // text(displayValue + " ml/s", flowMonitorX, flowMonitorY + monitorHeight / 2);

    // Draw waterfall animation if filling
    if (((currentFlowRateA > 0 && pumpASwitchOn) || (currentFlowRateB > 0 && pumpBSwitchOn)) && !(tankALiquidLevel === 0 && tankBLiquidLevel === 0)) {
      const streamColor = inletFlowColor; // Use the blended color for the inlet flow
      const startX = fallLandingX;
      const startY = inletY;
      // End at the center of the tank at the liquid surface, but clamp to avoid bouncing
      const endX = tankX - tankWidth * 0.3; // closer to the left inner wall
      // Clamp the endY so it never gets too close to the top wall
      const minCurveHeight = tankHeight * 0.18;
      const maxLiquidTopY = tankY - tankHeight / 2 + wall + minCurveHeight;
      const unclampedEndY = tankInnerBottom - (tankHeight - 2 * wall) * simpleTankLiquidLevel;
      const endY = Math.max(unclampedEndY, maxLiquidTopY);

      // Fixed candy cane shape: control points are fixed offsets from start/end
      const dx = Math.abs(endX - startX);
      const caneRadius = Math.max(dx * 0.4, tankWidth * 0.12); // Reduced from 0.6 to 0.4 for gentler curve
      const ctrl1X = startX + caneRadius;
      const ctrl1Y = startY;
      const ctrl2X = endX;
      const ctrl2Y = startY + caneRadius * 0.8; // Reduced from 1.0 to 0.8 for gentler curve
      stroke(streamColor);
      strokeWeight(Math.max(8, tankWidth * 0.06));
      noFill();
      // Waterfall progress: animate the stream falling
      if (simpleTankWaterfallProgress < 1) {
        simpleTankWaterfallProgress += 0.08; // Increased from 0.04 to 0.08 for faster flow
      }
      // Interpolate the end point for the waterfall
      const animEndY = startY + (endY - startY) * Math.min(simpleTankWaterfallProgress, 1);
      beginShape();
      vertex(startX, startY);
      bezierVertex(ctrl1X, ctrl1Y, ctrl2X, ctrl2Y, endX, animEndY);
      endShape();
      // Only increase liquid level when waterfall has visually reached the surface
      if (simpleTankWaterfallProgress >= 1) {
        simpleTankLiquidLevel += SIMPLE_TANK_FILL_RATE;
        simpleTankLiquidLevel = Math.min(simpleTankLiquidLevel, SIMPLE_TANK_MAX_LEVEL);
      }
    } else {
      simpleTankWaterfallProgress = 0;
    }

    // Gradually decrease liquid level if draining
    // if (simpleTankDraining && simpleTankLiquidLevel > 0) {
    //   simpleTankLiquidLevel -= SIMPLE_TANK_FILL_RATE * 0.7; // Drain slower than fill
    //   if (simpleTankLiquidLevel < 0) simpleTankLiquidLevel = 0;
    // }

    // Draw the tank
    drawSimpleTank(tankX, tankY, tankWidth, tankHeight, simpleTankLiquidLevel, finalCSTRColor, width); // Use new logic for tank color
  }

  // Draw switch and wire for each pump
  let switchY, bounds;
  if (label === 'Tank A') {
    // Switch below pump
    switchY = y + size * 1.4; // Moved switch down
    bounds = drawRotorSwitch(x, y, switchY, pumpASwitchOn, true);
    pumpASwitchBounds = bounds;
    // Draw wire
    stroke(60);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const wx = x;
      const wy = y + size / 2 + (switchY - (y + size / 2)) * t + Math.sin(t * 4 * Math.PI) * 6 * (1 - t);
      vertex(wx, wy);
    }
    endShape();
  } else if (label === 'Tank B') {
    // Switch above pump (more space)
    switchY = y - size * 2.8; // Moved switch up
    bounds = drawRotorSwitch(x, y, switchY, pumpBSwitchOn, true);
    pumpBSwitchBounds = bounds;
    // Draw wire
    stroke(60);
    strokeWeight(3);
    noFill();
    beginShape();
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      const wx = x;
      const wy = switchY + 48 + (y - size / 2 - (switchY + 48)) * t + Math.sin(t * 4 * Math.PI) * 6 * (1 - t);
      vertex(wx, wy);
    }
    endShape();
  }

  // Rectangular flange and bolts at right (outlet)
  const outletX = x + size / 2;
  fill(200, 200, 210);
  stroke(40);
  strokeWeight(2);
  rect(outletX - flangeW / 2, y - flangeH / 2, flangeW, flangeH, 5);
  // Bolts at corners - consistent style
  fill(160, 160, 170); // Metallic grey for bolts
  stroke(40);
  strokeWeight(2);
  for (const [dx, dy] of boltOffsets) {
    ellipse(outletX + dx * (flangeW / 2 - boltSize / 2), y + dy * (flangeH / 2 - boltSize / 2), boltSize, boltSize);
  }
}

function drawOutletPipe(x, y, pipeWidth, valvePosition, label) {
  // Set black outline for all pipe elements
  stroke(40);
  strokeWeight(2);
  
  // Main vertical pipe - longer for both tanks, extra length for Tank A
  const basePipeHeight = 150;
  const pipeHeight = label === "Tank A" ? basePipeHeight + 100 : basePipeHeight;
  
  // Connect pipe to tank outlet
  const pipeTop = y - pipeWidth / 2;
  fill(240); // Light grey for pipes
  
  // Draw pipe with rounded top to connect smoothly
  stroke(40);
  strokeWeight(2);
  beginShape();
  // Straight opening at tank wall (no arc)
  vertex(x - pipeWidth / 2, pipeTop);
  vertex(x - pipeWidth / 2, y + pipeHeight);
  vertex(x + pipeWidth / 2, y + pipeHeight);
  vertex(x + pipeWidth / 2, pipeTop);
  endShape(CLOSE);
  
  // Bottom valve (adjustable switch style)
  const valveY = y + pipeHeight;
  const valveSize = pipeWidth * 3;
  
  // Valve body (circle) with matching red tint
  fill(100, 150, 255); // Changed from red to blue
  stroke(40);
  strokeWeight(2);
  circle(x, valveY, valveSize);
  
  // Add bolt holes around the valve body
  const boltCount = 8;
  const boltRadius = valveSize * 0.4;
  const boltSize = valveSize * 0.06; // Reduced from 0.08 to 0.06
  for (let i = 0; i < boltCount; i++) {
    const angle = (i * 2 * Math.PI) / boltCount;
    const bx = x + Math.cos(angle) * boltRadius;
    const by = valveY + Math.sin(angle) * boltRadius;
    fill(160, 160, 170); // Metallic grey for bolts
    stroke(40);
    strokeWeight(2);
    circle(bx, by, boltSize);
  }
  
  // Draw horizontal pipe from valve with different lengths for each tank
  const basePipeLength = basePipeHeight * 2;
  const horizontalPipeLength = label === "Tank A" ? basePipeLength : basePipeLength * 0.7; // Reduced for Tank B
  fill(240); // Light grey for pipes
  
  // Ensure black outline for horizontal pipe
  stroke(0);
  strokeWeight(1);
  // Draw horizontal pipe with rounded end
  stroke(40);
  strokeWeight(2);
  beginShape();
  vertex(x + valveSize / 2, valveY - pipeWidth / 2);
  vertex(x + valveSize / 2 + horizontalPipeLength, valveY - pipeWidth / 2);
  arc(x + valveSize / 2 + horizontalPipeLength, valveY, pipeWidth, pipeWidth, -Math.PI / 2, Math.PI / 2);
  vertex(x + valveSize / 2 + horizontalPipeLength, valveY + pipeWidth / 2);
  vertex(x + valveSize / 2, valveY + pipeWidth / 2);
  endShape(CLOSE);
  
  // Draw pump at the end of horizontal pipe
  const pumpX = x + valveSize / 2 + horizontalPipeLength + pipeWidth / 2;
  const pumpY = valveY;
  const pumpSize = valveSize * 1.2;
  drawPump(pumpX, pumpY, pumpSize, pipeWidth, label);
  
  // Calculate flow rate based on valve position (0 to 1)
  const flowRate = map(valvePosition, 0, -Math.PI / 2, 0, 1);
  
  // Draw monitor and wire first (before the switch)
  if (label === "Tank A") {
    // Draw monitor further to the left and higher up
    const monitorX = x - valveSize - 100;
    const monitorY = valveY - valveSize; // Moved up from valveSize/2 to valveSize
    
    // Draw wavy connecting wire to monitor
    stroke(100);
    strokeWeight(1);
    beginShape();
    noFill();
    const wireStartX = x - valveSize / 2;
    const wireEndX = monitorX + 50;
    const wireLength = wireEndX - wireStartX;
    const segments = 10;
    const amplitude = 5;
    
    for (let i = 0; i <= segments; i++) {
      const xPos = wireStartX + (wireLength * i / segments);
      // Adjust Y position to start from valve level and curve up to monitor
      const yPos = valveY + (monitorY - valveY) * (i / segments) + Math.sin(i * Math.PI / 2) * amplitude;
      vertex(xPos, yPos);
    }
    endShape();
    
    // Draw monitor
    drawValveMonitor(monitorX, monitorY, flowRate);
    
    // Draw label
    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(18); // Increased text size for label
    text("NaOH flow rate", monitorX - 20, monitorY - 15);
  } else if (label === "Tank B") {
    // Move monitor up for Tank B
    const monitorX = x + valveSize + 10;
    const monitorY = valveY - valveSize * 1.2; // Moved up
    
    // Draw wavy connecting wire to monitor
    stroke(100);
    strokeWeight(1);
    beginShape();
    noFill();
    const wireStartX = x + valveSize / 2;
    const wireEndX = monitorX;
    const wireLength = wireEndX - wireStartX;
    const segments = 10;
    const amplitude = 5;
    
    for (let i = 0; i <= segments; i++) {
      const xPos = wireStartX + (wireLength * i / segments);
      const yPos = valveY - (valveY - monitorY) * (i / segments) + Math.sin(i * Math.PI / 2) * amplitude;
      vertex(xPos, yPos);
    }
    endShape();
    
    // Draw monitor
    drawValveMonitor(monitorX, monitorY, flowRate);
    
    // Draw label
    fill(0);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(18); // Increased text size for label
    text("CH₃COOCH₃ flow rate", monitorX-30, monitorY - 15);
  }

  // Draw valve diameter lines (before the switch)
  strokeWeight(1);
  line(x - valveSize / 2, valveY, x + valveSize / 2, valveY);
  line(x, valveY - valveSize / 2, x, valveY + valveSize / 2);
  
  // Add center cross detail
  const crossSize = valveSize * 0.15;
  line(x - crossSize, valveY, x + crossSize, valveY);
  line(x, valveY - crossSize, x, valveY + crossSize);
  
  // Valve handle (rotatable) - drawn last to appear on top
  stroke(40);
  strokeWeight(2);
  const handleLength = valveSize;
  const handleWidth = 20;
  
  // Calculate handle end position for hit detection
  // Map valvePosition from 0 to -π/2 to -π to 0 (left to right, rotating up)
  const mappedAngle = map(valvePosition, 0, -Math.PI / 2, -Math.PI, 0);
  const handleEndX = x + handleLength * Math.cos(mappedAngle);
  const handleEndY = valveY + handleLength * Math.sin(mappedAngle);

  // Draw handle as a rectangle with blue tint (same as valve body)
  push();
  translate(x, valveY);
  rotate(mappedAngle); // Use mapped angle for rotation
  fill(100, 150, 255); // Blue, same as valve body
  rect(0, -handleWidth / 2, handleLength, handleWidth, 5);
  
  // Add handle details
  stroke(0);
  strokeWeight(1);
  // Add grip lines on handle
  const gripCount = 3;
  const gripSpacing = handleLength / (gripCount + 1);
  for (let i = 1; i <= gripCount; i++) {
    line(i * gripSpacing, -handleWidth / 2 + 2, i * gripSpacing, handleWidth / 2 - 2);
  }
  
  // Draw blue draggable handle at the end
  translate(handleLength, 0);
  // Use darker gold when pump is on
  const isPumpOn = label === "Tank A" ? pumpASwitchOn : pumpBSwitchOn;
  fill(isPumpOn ? color(218, 165, 32) : color(255, 215, 0)); // Changed from red to gold colors
  circle(0, 0, handleWidth * 1.5);
  
  // Add center dot to handle
  fill(0);
  circle(0, 0, handleWidth * 0.4);
  pop();
  
  // Store handle end position for interaction
  if (label === "Tank A") {
    window.tankAHandle = { x: handleEndX, y: handleEndY, centerX: x, centerY: valveY };
  } else {
    window.tankBHandle = { x: handleEndX, y: handleEndY, centerX: x, centerY: valveY };
  }
}

function drawStand(x, y, w, h) {
  stroke(0);
  strokeWeight(3); // Keep default stroke weight for other components
  
  // Left leg
  const legSpacing = w * 1.2;
  const leftLegX = x - legSpacing / 2;
  const rightLegX = x + legSpacing / 2;
  const legBottom = y + h / 2 + h * 0.2;

  // Draw legs with thicker stroke
  strokeWeight(5); // Increased stroke weight specifically for vertical legs
  line(leftLegX, y - h / 4, leftLegX, legBottom);
  line(rightLegX, y - h / 4, rightLegX, legBottom);
  
  // Base feet
  const footLength = w * 0.25;
  
  // Left leg foot
  strokeWeight(5); // Match vertical leg thickness
  line(leftLegX - footLength / 2, legBottom, leftLegX + footLength / 2, legBottom);
  
  // Right leg foot
  line(rightLegX - footLength / 2, legBottom, rightLegX + footLength / 2, legBottom);
  
  // Side clamps
  const clampWidth = w * 0.1;
  const clampExtension = w * 0.15;
  
  // Left clamp
  strokeWeight(2); // Keep original stroke weight for clamps
  // Horizontal part
  line(leftLegX, y - h / 4, leftLegX + clampExtension, y - h / 4);
  line(leftLegX, y + h / 4, leftLegX + clampExtension, y + h / 4);
  // Vertical part
  line(leftLegX + clampExtension, y - h / 4, leftLegX + clampExtension, y + h / 4);
  
  // Right clamp
  // Horizontal part
  line(rightLegX, y - h / 4, rightLegX - clampExtension, y - h / 4);
  line(rightLegX, y + h / 4, rightLegX - clampExtension, y + h / 4);
  // Vertical part
  line(rightLegX - clampExtension, y - h / 4, rightLegX - clampExtension, y + h / 4);
  
  // Cross support between legs (for stability)
  stroke(100); // Changed to lighter grey
  strokeWeight(3); // Keep original stroke weight for cross supports
  line(leftLegX, y, rightLegX, y);
  line(leftLegX, y + h / 4, rightLegX, y - h / 4);
  line(leftLegX, y - h / 4, rightLegX, y + h / 4);
}

function drawSlider(x, y, w, value, label, displayValue, min = 0.1, max = 0.5, disabled = false) {
  const sliderY = y - 30;
  // Draw slider track (simple grey bar)
  stroke(180); // Grey stroke
  strokeWeight(6); // Thicker stroke like in the image
  noFill(); // No fill for a simple bar
  const trackY = sliderY;

  // Draw simple grey bar
  const barHeight = 6; // Match stroke weight for a solid bar appearance
  const barWidth = w;
  rectMode(CENTER);
  rect(x, trackY, barWidth, barHeight, barHeight / 2); // Rounded ends
  rectMode(CORNER); // Reset rectMode to default

  // Draw slider handle (3D look)
  const handleX = map(value, min, max, x - w / 2, x + w / 2); // Map value across the full bar width
  const handleR = 20; // Increased handle size
  // Shadow
  noStroke();
  if (!disabled) {
    fill(120, 120, 120, 60);
    ellipse(handleX + 2, trackY + 3, handleR * 1.1, handleR * 0.7);
  }
  // Handle
  stroke(40);
  strokeWeight(2);
  fill(disabled ? 180 : color(102, 155, 188)); // Navy blue color
  ellipse(handleX, trackY, handleR, handleR);

  // Draw value display box
  fill(255);
  stroke(40);
  strokeWeight(1);
  rect(handleX - 22, trackY - 35, 44, 22, 6);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(18); // Increased text size for value
  if (displayValue !== undefined) {
    text(Math.round(displayValue), handleX, trackY - 24);
  } else {
    text(value.toFixed(2), handleX, trackY - 24);
  }

  // Draw label below with increased text size
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  textSize(18); // Increased text size for label
  text(label, x, trackY + 15);
}

function drawLiquid(x, y, w, h, level, color, applyWave = true) {
  // Calculate total liquid height
  const totalHeight = h;
  const liquidHeight = totalHeight * level;
  const waveHeight = applyWave ? 0.8 : 0; // Reduced from 1.5 to 0.8 for flatter waves
  const segments = 20;
  
  fill(color);
  noStroke();
  
  beginShape();
  
  // Left side
  vertex(x - w / 2, y - h / 2 + h - liquidHeight);
  
  // Draw wavy top surface
  for (let i = 0; i <= segments; i++) {
    const xPos = x - w / 2 + (w * i / segments);
    const baseY = y - h / 2 + h - liquidHeight;
    const yOffset = Math.sin(waveOffset + i * 0.5) * waveHeight;
    vertex(xPos, baseY + yOffset);
  }
  
  // Right side
  vertex(x + w / 2, y - h / 2 + h - liquidHeight);
  
  // Bottom vertices
  vertex(x + w / 2, y + h / 2);
  vertex(x - w / 2, y + h / 2);
  
  endShape(CLOSE);
}

export function drawTank(x, y, w, h, label, liquidColor, isFirstTank, liquidLevel) {
  // Draw stand first
  drawStand(x, y, w, h);
  
  // Tank outline
  stroke(0);
  strokeWeight(3); // Thick walls
  noFill();
  
  // Main cylindrical body - now extends full height
  const cylinderHeight = h;
  
  // Draw main cylinder sides with thicker walls
  line(x - w / 2, y - h / 2, x - w / 2, y + h / 2);
  line(x + w / 2, y - h / 2, x + w / 2, y + h / 2);
  
  // Draw top rim
  const rimWidth = w * 0.1; // Width of the rim
  strokeWeight(3);
  // Left rim
  line(x - w / 2, y - h / 2, x - w / 2 - rimWidth, y - h / 2);
  // Right rim
  line(x + w / 2, y - h / 2, x + w / 2 + rimWidth, y - h / 2);
  // Front rim
  line(x - w / 2 - rimWidth, y - h / 2, x + w / 2 + rimWidth, y - h / 2);
  
  // Bottom line
  strokeWeight(4); // Even thicker bottom line
  line(x - w / 2, y + h / 2, x + w / 2, y + h / 2);
  strokeWeight(3); // Reset stroke weight for rest of the drawing
  
  // Draw liquid with current level, accounting for wall thickness
  const wallThickness = 3; // Match the stroke weight
  const adjustedWidth = w - (2 * wallThickness);
  const adjustedHeight = h - (2 * wallThickness);
  const adjustedX = x;
  const adjustedY = y;
  drawLiquid(adjustedX, adjustedY, adjustedWidth, adjustedHeight, liquidLevel, liquidColor, false); // Disable wave for Tank A and B
  
  // Draw volume markings
  stroke(0);
  strokeWeight(1); // Default stroke weight for text outline
  textAlign(LEFT, CENTER); // Align text to the left of the mark
  textSize(12); // Reduced size for numbers
  fill(0); // Text color

  const innerWidth = w - (2 * wallThickness);
  const innerHeight = h - (2 * wallThickness);
  const innerTopY = y - h / 2 + wallThickness;
  const innerBottomY = y + h / 2 - wallThickness;

  // Markings every 1000 ml (1L)
  const volumesToMark = [];
  for (let v = 0; v <= TANK_VOLUME; v += 1000) {
     volumesToMark.push(v);
  }

  for (let i = 0; i < volumesToMark.length; i++) {
    const volume = volumesToMark[i];
    // Map volume (0-20000) to a level (0-0.85)
    const level = 0.85 * (volume / TANK_VOLUME);
    // Map level (0-0.85) to a visual Y position (bottom to 85% full height)
    // Level 0 corresponds to innerBottomY, Level 0.85 corresponds to innerTopY + innerHeight * (1 - 0.85)
    const markY = innerBottomY - (innerHeight * level);

    // Draw tick mark
    const volumeInL = volume / 1000;
    const tickLength = (volumeInL % 2 === 0) ? 50 : 25; // Longer for even liters, shorter for odd - Increased size even more
    
    strokeWeight(2); // Reduced thickness for lines
    line(x - tickLength / 2, markY, x + tickLength / 2, markY); // Centered tick marks

    // Only draw text label for even liter markings
    if (volumeInL % 2 === 0) {
        strokeWeight(1); // Reset stroke weight for text outline
        text(volumeInL + " L", x + tickLength / 2 + 5, markY - 4); // Position text to the right of the mark, moved up
    }
  }
  
  // Draw outlet pipe with bottom valve
  const valvePos = isFirstTank ? valveAPosition : valveBPosition;
  const valveLabel = isFirstTank ? "Tank A" : "Tank B";
  drawOutletPipe(x, y + h / 2 + 10, w * 0.1, valvePos, valveLabel);
  
  // Tank label
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(h * 0.06); // Increased text size for labels
  text(label, x, y - h / 2 + 20);
}

export function setupCanvas(containerElement) {
  const width = containerElement.offsetWidth;
  const height = containerElement.offsetHeight;
  const canvas = createCanvas(width, height);
  canvas.parent(containerElement);
  pixelDensity(4);
  frameRate(60);
  return { width, height };
}

// Global p5.js mouse event handlers
window.mousePressed = function() {
  handleInteractions();
}

window.mouseDragged = function() {
  handleInteractions();
}

function handleInteractions() {
  const tankAX = width * 0.15;
  const tankBX = width * 0.30;
  const tankY = height * 0.4 + VERTICAL_OFFSET; // Add offset here
  const tankH = height * 0.35;
  const tankW = width * 0.12;
  const pipeHeight = 150;
  const valveY = tankY + tankH / 2 + pipeHeight;
  // --- SLIDER TRACK LOGIC ---
  // These must match drawSlider
  const sliderTrackRadius = 8;
  const extendedSliderWidth = tankBX + tankW/2 - (tankAX - tankW/2); // From left edge of Tank A to right edge of Tank B
  const extendedSliderX = (tankAX - tankW/2 + tankBX + tankW/2) / 2; // Center point between tanks
  const sliderAY = tankY - tankH / 2 - 120; // Moved up from -100 to -120 for NaOH slider
  const sliderBY = tankY - tankH / 2 - 40; // Original position for CH₃COOCH₃ slider
  const sliderATrackLeft = extendedSliderX - extendedSliderWidth / 2 + sliderTrackRadius;
  const sliderATrackRight = extendedSliderX + extendedSliderWidth / 2 - sliderTrackRadius;
  const sliderBTrackLeft = extendedSliderX - extendedSliderWidth / 2 + sliderTrackRadius;
  const sliderBTrackRight = extendedSliderX + extendedSliderWidth / 2 - sliderTrackRadius;
  const sliderHandleRadius = 20; // matches drawSlider handleR

  // Only block slider logic if rotor is on
  if (!rotorOn) {
    // Check slider interactions (A)
    if (!concentrationSet) {
      if (Math.abs(mY - sliderAY) < 18) {
        if (mX >= sliderATrackLeft - sliderHandleRadius && mX <= sliderATrackRight + sliderHandleRadius) {
          sliderAValue = map(mX, sliderATrackLeft, sliderATrackRight, 0.1, 0.5);
          sliderAValue = constrain(sliderAValue, 0.1, 0.5);
          return; // Only allow one slider at a time
        }
      }
    }
    // Check slider interactions (B)
    if (!concentrationSet) {
      if (Math.abs(mY - sliderBY) < 18) {
        if (mX >= sliderBTrackLeft - sliderHandleRadius && mX <= sliderBTrackRight + sliderHandleRadius) {
          sliderBValue = map(mX, sliderBTrackLeft, sliderBTrackRight, 0.1, 0.5);
          sliderBValue = constrain(sliderBValue, 0.1, 0.5);
          return;
        }
      }
    }
    // Check Set button interaction
    if (setButtonBounds && mX >= setButtonBounds.x && mX <= setButtonBounds.x + setButtonBounds.w && mY >= setButtonBounds.y && mY <= setButtonBounds.y + setButtonBounds.h) {
      concentrationSet = true;
      return;
    }
  }

  // Check valve handle interactions (always allowed unless pump is on)
  function updateValvePosition(handle, setPosition, isPumpOn, isDragging) {
    if (!handle || isPumpOn) return false; // Don't allow valve adjustment if pump is on
    const { centerX, centerY } = handle;

    // Increase the interaction radius for stronger interaction
    const handleRadius = 20; // Increased from 15 to 20 for larger interaction area

    // Check if we're either clicking the handle or already dragging
    if (dist(mX, mY, handle.x, handle.y) < handleRadius || isDragging) {
      const deltaX = mX - centerX;
      const deltaY = mY - centerY;
      let angle = Math.atan2(deltaY, deltaX);
      
      // Normalize angle to be between -π and π
      angle = (angle + Math.PI) % (2 * Math.PI) - Math.PI;

      // Only allow rotation in the correct direction (counter-clockwise from left to right)
      // If trying to rotate clockwise (angle > 0), ignore the movement
      if (angle > 0) return isDragging; // Return current drag state if trying to rotate wrong way

      // Map angle from -π to 0 to 0 to -π/2 range (left to right, rotating up)
      angle = map(angle, -Math.PI, 0, 0, -Math.PI / 2);

      // Ensure the angle can reach both extremes with a small threshold
      if (angle > -0.01) angle = 0; // Fully closed
      if (angle < -Math.PI / 2 + 0.01) angle = -Math.PI / 2; // Fully open
      
      setPosition(angle);
      return true; // Return true to indicate we're dragging
    }
    return false; // Return false to indicate we're not dragging
  }

  // Update valve positions and track drag state
  const newValveAPosition = updateValvePosition(window.tankAHandle, (angle) => { valveAPosition = angle; }, pumpASwitchOn, isDraggingValveA);
  const newValveBPosition = updateValvePosition(window.tankBHandle, (angle) => { valveBPosition = angle; }, pumpBSwitchOn, isDraggingValveB);

  // Update drag states
  isDraggingValveA = newValveAPosition;
  isDraggingValveB = newValveBPosition;

  // --- TEMPERATURE SLIDER LOGIC ---
  // These must match drawSlider for the temperature slider
  const tempSliderX = extendedSliderX + extendedSliderWidth + 20; // Match the position in drawSimulation
  const tempSliderY = sliderYCommon - 80; // Match the position in drawSimulation
  const tempSliderW = extendedSliderWidth; // Match the width of other sliders
  const tempSliderTrackLeft = tempSliderX - tempSliderW / 2 + sliderTrackRadius;
  const tempSliderTrackRight = tempSliderX + tempSliderW / 2 - sliderTrackRadius;
  if (!rotorOn && !temperatureSet) {
    if (Math.abs(mY - (tempSliderY - 30)) < 18) { // Fixed: Account for track offset
      if (mX >= tempSliderTrackLeft - sliderHandleRadius && mX <= tempSliderTrackRight + sliderHandleRadius) {
        // Map mX to temperature value (25 to 85 °C)
        temperatureValue = map(mX, tempSliderTrackLeft, tempSliderTrackRight, 25, 85);
        temperatureValue = constrain(temperatureValue, 25, 85);
        return;
      }
    }
  }
}

export function drawSimulation(width, height) {
  background(255);

  // Calculate time delta for volume updates
  const currentTime = millis();
  const deltaTime = (currentTime - lastUpdateTime) / 1000; // Convert to seconds
  lastUpdateTime = currentTime;

  // Update displayed values every 500ms
  if (currentTime - lastVolumeUpdateTime >= 500) {
    displayTankADeltaV = Math.round(tankADeltaV);
    displayTankBDeltaV = Math.round(tankBDeltaV);
    displayCA1 = currentCA1;
    displayCB1 = currentCB1;
    lastVolumeUpdateTime = currentTime;
  }

  // Calculate flow rates based on valve positions and pump states
  let currentFlowRateA = pumpASwitchOn ? map(Math.abs(valveAPosition), 0, Math.PI / 2, 0, MAX_FLOW_RATE) : 0;
  let currentFlowRateB = pumpBSwitchOn ? map(Math.abs(valveBPosition), 0, Math.PI / 2, 0, MAX_FLOW_RATE) : 0;

  // Stop flow if both tanks are empty
  if (tankALiquidLevel === 0 && tankBLiquidLevel === 0) {
    currentFlowRateA = 0;
    currentFlowRateB = 0;
  }

  // Calculate total inlet flow rate
  totalInletFlowRate = currentFlowRateA + currentFlowRateB;

  // Update delta V values based on flow rates
  if (pumpASwitchOn) {
    tankADeltaV += currentFlowRateA * deltaTime;
  }
  if (pumpBSwitchOn) {
    tankBDeltaV += currentFlowRateB * deltaTime;
  }

  // Update liquid levels based on delta V
  // Ensure level does not go below 0
  tankALiquidLevel = Math.max(0, 0.85 * (1 - (tankADeltaV / TANK_VOLUME))); // Level goes from 0.85 down to 0 when 20L is drained
  tankBLiquidLevel = Math.max(0, 0.85 * (1 - (tankBDeltaV / TANK_VOLUME))); // Level goes from 0.85 down to 0 when 20L is drained

  // Draw reset button
  drawResetButton();
  
  const tankAX = width * 0.15;
  const tankBX = width * 0.30;
  const tankY = height * 0.42 + VERTICAL_OFFSET; // Add offset here
  const tankW = width * 0.12;
  const tankH = height * 0.35;
  
  // Update global slider position variables
  sliderYCommon = tankY - tankH / 2 - 40;
  sliderTrackY = sliderYCommon - 30; // This matches the trackY in drawSlider
  
  // Update wave animation
  waveOffset += 0.05;
  
  // Draw Tank A (left tank) with blue liquid
  const tankAColor = color(255 - sliderAValue * 100, 120, 120, 200); // reddish
  drawTank(tankAX, tankY, tankW, tankH, "NaOH", tankAColor, true, tankALiquidLevel);
  
  // Draw Tank B (right tank) with green liquid
  const tankBColor = color(200 - sliderBValue * 100, 255 - sliderBValue * 100, 220 - sliderBValue * 100, 200);
  drawTank(tankBX, tankY, tankW, tankH, "CH₃COOCH₃", tankBColor, false, tankBLiquidLevel);

  // Calculate extended slider width and position
  const extendedSliderWidth = tankBX + tankW/2 - (tankAX - tankW/2); // From left edge of Tank A to right edge of Tank B
  const extendedSliderX = (tankAX - tankW/2 + tankBX + tankW/2) / 2; // Center point between tanks

  // Draw NaOH slider (top)
  drawSlider(extendedSliderX, sliderYCommon - 80, extendedSliderWidth, sliderAValue, "NaOH (M)", undefined, 0.1, 0.5, rotorOn || concentrationSet);

  // Draw temperature slider next to NaOH slider
  const tempSliderX = extendedSliderX + extendedSliderWidth + 60; // Position to the right of NaOH slider - Increased offset further
  drawSlider(tempSliderX, sliderYCommon - 80, extendedSliderWidth, temperatureValue, 'temperature (°C)', temperatureValue, 25, 85, rotorOn || temperatureSet);

  // Draw CH₃COOCH₃ slider (bottom)
  drawSlider(extendedSliderX, sliderYCommon, extendedSliderWidth, sliderBValue, "CH₃COOCH₃ (M)", undefined, 0.1, 0.5, rotorOn || concentrationSet);

  // Update temperature Set button position to match new slider position
  const tempSetButtonW = 60;
  const tempSetButtonH = 32;
  const tempSetButtonX = tempSliderX + extendedSliderWidth / 2 + 18; // Use updated tempSliderX
  const tempSetButtonY = sliderTrackY - tempSetButtonH / 2;
  tempSetButtonBounds = { x: tempSetButtonX, y: tempSetButtonY, w: tempSetButtonW, h: tempSetButtonH };

  // Draw volume monitor for Tank A (left side)
  const volumeMonitorAX = tankAX - tankW - 20;
  const volumeMonitorAY = tankY;
  // Add label above monitor
  // fill(0);
  // noStroke();
  // textAlign(CENTER, BOTTOM);
  // textSize(12);
  // text("NaOH ΔV", volumeMonitorAX + 35, volumeMonitorAY - 5);
  // drawVolumeMonitor(volumeMonitorAX, volumeMonitorAY, displayTankADeltaV);

  // Draw volume monitor for Tank B (right side)
  const volumeMonitorBX = tankBX + tankW - 40;
  const volumeMonitorBY = tankY;
  // Add label above monitor
  // fill(0);
  // noStroke();
  // textAlign(CENTER, BOTTOM);
  // textSize(12);
  // text("CH₃COOCH₃ ΔV", volumeMonitorBX + 35, volumeMonitorBY - 5);
  // drawVolumeMonitor(volumeMonitorBX, volumeMonitorBY, displayTankBDeltaV);

  // Calculate blended color for final tank based on concentrations
  const totalConcentration = sliderAValue + sliderBValue;
  const tankAWeight = totalConcentration > 0 ? sliderAValue / totalConcentration : 0.5;
  const tankBWeight = totalConcentration > 0 ? sliderBValue / totalConcentration : 0.5;

  // Extract RGB components from both colors
  const tankARed = red(tankAColor);
  const tankAGreen = green(tankAColor);
  const tankABlue = blue(tankAColor);

  const tankBRed = red(tankBColor);
  const tankBGreen = green(tankBColor);
  const tankBBlue = blue(tankBColor);

  // Calculate weighted average of colors
  const finalRed = tankARed * tankAWeight + tankBRed * tankBWeight;
  const finalGreen = tankAGreen * tankAWeight + tankBGreen * tankBWeight;
  const finalBlue = tankABlue * tankAWeight + tankBBlue * tankBWeight;

  // Create final color with same alpha
  const finalTankColor = color(finalRed, finalGreen, finalBlue, 200);

  // Calculate CSTR tank color based on flow conditions
  const waterColor = color(140, 180, 255, 140); // deeper blue water
  let mainCSTRColor = waterColor;
  if ((currentFlowRateA > 0 && pumpASwitchOn) || (currentFlowRateB > 0 && pumpBSwitchOn)) {
    // Blend water and inlet flow color 50/50
    const blendRed = red(waterColor) * 0.5 + red(finalTankColor) * 0.5;
    const blendGreen = green(waterColor) * 0.5 + green(finalTankColor) * 0.5;
    const blendBlue = blue(waterColor) * 0.5 + blue(finalTankColor) * 0.5;
    mainCSTRColor = color(blendRed, blendGreen, blendBlue, 160);
    lastCSTRColor = mainCSTRColor; // Store the last active color
  } else if (lastCSTRColor !== null) {
    mainCSTRColor = lastCSTRColor; // Use the last active color when pumps are off
  }
  // Store the final CSTR tank color for use elsewhere
  const finalCSTRColor = mainCSTRColor;

  // Rotor angle increment
  if (rotorOn) {
    rotorAngle += 0.07; // Speed of spin
    if (rotorAngle > Math.PI * 2) rotorAngle -= Math.PI * 2;
  }

  // Draw collection tank in bottom right, aligned with downward pipe
  // The downward pipe's X is verticalPipeX = x + wOuter/2 + pipeLength in drawSimpleTank
  // Use the same calculation for alignment
  const tankX = width * 0.78; // X of the CSTR tank
  const collectionTankWLocal = width * 0.09; // Reduced from 0.12 to 0.09
  const pipeLength = collectionTankWLocal * 0.3;
  const wall = Math.max(4, collectionTankWLocal * 0.035);
  const collectionTankX = tankX + collectionTankWLocal / 2 + pipeLength + 70; // Increased from +60 to +80 to move tank further right
  const collectionTankY = height * 0.7 + VERTICAL_OFFSET; // Moved up from 0.75 to 0.70
  const collectionTankW = collectionTankWLocal;
  const collectionTankH = height * 0.28; // Reduced from 0.35 to 0.28
  // Default liquid level is 0
  const collectionTankLevel = 0;
  // Use cstrTankColor for the collection tank liquid color
  const cstrTankColor = color(140, 180, 255, 140); // deeper blue water
  // Always use finalTankColor for the collection tank liquid color
  const defaultCollectionColor = color(200, 220, 255, 200);

  // Determine collection tank color
  let collectionTankColor = defaultCollectionColor;
  if ((currentFlowRateA > 0 && pumpASwitchOn) || (currentFlowRateB > 0 && pumpBSwitchOn)) {
    collectionTankColor = finalCSTRColor;
    lastCollectionColor = finalCSTRColor; // Store the last active color
  } else if (lastCollectionColor !== null) {
    collectionTankColor = lastCollectionColor; // Use the last active color when pumps are off
  }

  // Draw collection tank first (so it appears behind the pipe)
  drawCollectionTank(collectionTankX, collectionTankY, collectionTankW, collectionTankH, collectionTankLiquidLevel, collectionTankColor);

  // Draw flow from downward pipe to collection tank if there is outflow
  const downwardPipeX = collectionTankX; // Shift flow further right (changed from -3.5 to -1.5)
  const pipeWidth = width * 0.012; // Matches outlet pipe width
  const collectionTankWall = Math.max(4, collectionTankW / 10);
  const downwardPipeTop = collectionTankY - collectionTankH / 2 - 1;
  // The bottom of the flow should be the current liquid surface in the tank
  const tankInnerBottom = collectionTankY + collectionTankH / 2 - collectionTankWall;
  const tankInnerTop = collectionTankY - collectionTankH / 2 + collectionTankWall;
  // Fix: When full, liquid surface should be exactly at tankInnerBottom
  const liquidHeight = (tankInnerBottom - tankInnerTop) * collectionTankLiquidLevel;
  const liquidSurfaceY = tankInnerBottom - liquidHeight;
  // Outflow condition: either pump is on and its flow rate is nonzero
  const collectionFlowActive = (pumpASwitchOn && currentFlowRateA > 0) || (pumpBSwitchOn && currentFlowRateB > 0);
  if (collectionFlowActive) {
    // Animate the waterfall progress
    if (collectionTankWaterfallProgress < 1) {
      collectionTankWaterfallProgress += 0.08; // Speed of animation
    }
    // Interpolate the end point for the waterfall (to the current liquid surface)
    const animEndY = downwardPipeTop + 9.5 + (liquidSurfaceY - downwardPipeTop) * Math.min(collectionTankWaterfallProgress, 1);
    noStroke();
    fill(finalCSTRColor); // Use finalCSTRColor instead of finalTankColor
    rect(
      downwardPipeX - pipeWidth / 2,
      downwardPipeTop,
      pipeWidth,
      animEndY - downwardPipeTop
    );
    // Only increase liquid level when waterfall has visually reached the liquid surface
    if (collectionTankWaterfallProgress >= 1) {
      collectionTankLiquidLevel += SIMPLE_TANK_FILL_RATE;
      collectionTankLiquidLevel = Math.min(collectionTankLiquidLevel, COLLECTION_TANK_MAX_LEVEL); // Use new constant
    }
  } else {
    collectionTankWaterfallProgress = 0;
  }

  // Draw the collection tank again after the flow so the tank walls appear in front
  // drawCollectionTank(collectionTankX, collectionTankY, collectionTankW, collectionTankH, collectionTankLiquidLevel, collectionTankColor);

  // Calculate CSTR values
  const calcTime = millis();
  const timeSinceLastCalc = (calcTime - lastCalculationTime) / 1000; // Convert to seconds

  if (timeSinceLastCalc >= 0.1) { // Update every 100ms
    // Only calculate when both pumps are on
    if (pumpASwitchOn && pumpBSwitchOn) {
      accumulatedTime += timeSinceLastCalc;
      const cstrResult = run_CSTR({
        t: accumulatedTime,
        T: temperatureValue + 273.15, // Convert °C to K
        CAf: pumpASwitchOn ? sliderAValue : 0, // Only use NaOH concentration if its pump is on
        CBf: pumpBSwitchOn ? sliderBValue : 0, // Only use CH₃COOCH₃ concentration if its pump is on
        vA: currentFlowRateA / 1000,
        vB: currentFlowRateB / 1000
      });

      // Update the values
      currentCA1 = cstrResult.CC;
      currentCB1 = cstrResult.CD;
    } else {
      // Reset concentrations when pumps are off
      currentCA1 = 0;
      currentCB1 = 0;
      accumulatedTime = 0;
    }
    lastCalculationTime = calcTime;
  }

  // Draw CA1 and CB1 indicators to the left of the collection tank
  const indicatorW = 65;
  const indicatorH = 35;
  const baseX = collectionTankX - collectionTankW / 2 - indicatorW - 222; // Changed from -185 to -205 to move monitors further left
  const baseY = collectionTankY + 140 + VERTICAL_OFFSET; // Changed from -20 to +20 to move monitors down

  // Draw line from CH₃COONa monitor
  stroke(0);
  strokeWeight(1);
  noFill();
  // Vertical line going up from left monitor
  line(baseX - 40, baseY + indicatorH / 2, baseX - 40, baseY - 160);
  // Add dot at the end of vertical line
  fill(0);
  circle(baseX - 40, baseY - 160, 4);

  // Draw line from CH₃OH monitor
  // Horizontal line from right monitor
  line(baseX + indicatorW * 1.7 + indicatorW, baseY + indicatorH / 2, baseX + indicatorW * 1.7 + indicatorW + 25, baseY + indicatorH / 2);
  // Vertical line going up from right monitor
  line(baseX + indicatorW * 1.7 + indicatorW + 25, baseY + indicatorH / 2, baseX + indicatorW * 1.7 + indicatorW + 25, baseY - 160);
  // Add dot at the end of vertical line
  fill(0);
  circle(baseX + indicatorW * 1.7 + indicatorW + 25, baseY - 160, 4);

  // CA1 monitor (left)
  fill(0);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(18); // Increased text size for label
  text('CH₃COONa (M)', baseX + indicatorW / 2 - 65, baseY + indicatorH + 45); // Moved label further down below monitor, and left by 15
  stroke(0);
  strokeWeight(1);
  fill(220);
  rect(baseX - 40 - indicatorW / 2, baseY + indicatorH / 2, indicatorW, indicatorH, 5); // Move monitor to end of vertical line
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20); // Increased text size for final concentration value
  text(displayCA1.toFixed(3), baseX - 40, baseY + indicatorH); // Position value at the center of the monitor

  // CB1 monitor (right)
  fill(0);
  noStroke();
  textAlign(CENTER, BOTTOM);
  textSize(18); // Increased text size for label
  text('CH₃OH (M)', baseX + indicatorW * 2.2 + 55, baseY + indicatorH + 45); // Moved label further down below monitor, and right by 15
  stroke(0);
  strokeWeight(1);
  fill(220);
  rect(baseX + indicatorW * 1.7 + indicatorW + 25 - indicatorW / 2, baseY + indicatorH / 2, indicatorW, indicatorH, 5); // Move monitor to end of vertical line
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20); // Increased text size for final concentration value
  text(displayCB1.toFixed(3), baseX + indicatorW * 1.7 + indicatorW + 25, baseY + indicatorH); // Position value at the center of the monitor

  // Draw hamburger menu last to ensure it's on top
  drawHamburgerMenu();
}

// Export slider values for external use
export function getSliderValues() {
  return {
    tankA: sliderAValue,
    tankB: sliderBValue
  };
}

// Draws a rotor with a vertical shaft and two paddle-shaped fans at the bottom
function drawRotor(cx, topY, shaftLen, shaftWidth, bladeLen, bladeWidth, angle = 0) {
  // Shaft
  fill(230);
  stroke(40);
  strokeWeight(2);
  rect(cx - shaftWidth / 2, topY, shaftWidth, shaftLen);

  // baseY is used for both mechanical details and blades
  const baseY = topY + shaftLen;
  // Mechanical details: central hub, bolts, and cap
  const hubRadius = shaftWidth * 1.2;
  const boltCount = 6;
  const boltRadius = hubRadius * 0.7;
  const boltSize = hubRadius * 0.22;
  // Hub
  fill(180, 180, 200);
  stroke(40);
  strokeWeight(2);
  ellipse(cx, baseY, hubRadius * 2, hubRadius * 2);
  // Bolts/rivets around hub
  fill(120);
  stroke(40);
  strokeWeight(1.5);
  for (let i = 0; i < boltCount; i++) {
    const theta = (i * 2 * Math.PI) / boltCount;
    const bx = cx + Math.cos(theta) * boltRadius;
    const by = baseY + Math.sin(theta) * boltRadius;
    ellipse(bx, by, boltSize, boltSize);
  }
  // Center cap
  fill(220);
  stroke(40);
  strokeWeight(2);
  ellipse(cx, baseY, hubRadius * 0.7, hubRadius * 0.7);

  // Slim, side-curved paddle shapes - left and right
  fill(230);
  stroke(40);
  strokeWeight(2);

  // 3D spinning: blades rotate in z-x plane, foreshortened by cos(angle)
  for (let i = 0; i < 2; i++) {
    const bladeAngle = angle + i * Math.PI; // 180 deg apart, always in sync
    const dx = Math.cos(bladeAngle) * bladeLen;
    const dz = Math.sin(bladeAngle) * bladeLen * 0.25; // 3D effect: z-depth
    const width3D = bladeWidth * Math.abs(Math.cos(bladeAngle)); // foreshortening
    // Tip of blade
    const tipX = cx + dx;
    const tipY = baseY + dz;
    // Draw curved blade from shaft to tip
    beginShape();
    vertex(cx, baseY);
    bezierVertex(
      cx + dx * 0.7, baseY - width3D * 0.7,
      tipX, tipY - width3D / 2,
      tipX, tipY
    );
    bezierVertex(
      tipX, tipY + width3D / 2,
      cx + dx * 0.7, baseY + width3D * 0.7,
      cx, baseY
    );
    endShape(CLOSE);
  }
}

// Draw a detailed switch above the tank
function drawRotorSwitch(cx, topY, switchY, isOn, returnBounds = false) {
  // Switch base (reduced size)
  const swWidth = 72;
  const swHeight = 48;
  const leverLen = 44;
  const leverWidth = 8; // Reduced from 11 to 8
  const baseRadius = 16;
  const lightRadius = 10;
  // Draw base
  fill(180);
  stroke(80);
  strokeWeight(2);
  rect(cx - swWidth / 2, switchY, swWidth, swHeight, 8);
  // Draw mounting bolts
  // fill(120);
  // for (let i = 0; i < 2; i++) {
  //   circle(cx - swWidth / 2 + 10 + i * (swWidth - 20), switchY + swHeight - 7, 7);
  // }
  // Draw indicator lights
  fill(isOn ? 'yellow' : 'red');
  stroke(60);
  circle(cx - swWidth / 2 + 12, switchY + 15, lightRadius); // Moved down from 12 to 15
  fill(isOn ? 'limegreen' : 'yellow');
  stroke(60);
  circle(cx + swWidth / 2 - 12, switchY + 15, lightRadius); // Moved down from 12 to 15
  // Draw ON/OFF labels inside the switch, near the left/right walls
  noStroke();
  fill(0);
  textSize(14); // Increased text size for ON/OFF labels
  textAlign(LEFT, CENTER);
  text('OFF', cx - swWidth / 2 + 4, switchY + swHeight / 2 + 10); // Moved down by adding 3
  textAlign(RIGHT, CENTER);
  text('ON', cx + swWidth / 2 - 4, switchY + swHeight / 2 + 10); // Moved down by adding 3
  // Draw lever
  const leverAngle = isOn ? -PI / 4 : -3 * PI / 4;
  stroke(60);
  strokeWeight(leverWidth);
  line(cx, switchY + swHeight / 2, cx + leverLen * Math.cos(leverAngle), switchY + swHeight / 2 + leverLen * Math.sin(leverAngle));
  // Draw lever knob
  fill(220);
  stroke(80);
  strokeWeight(2);
  circle(cx + leverLen * Math.cos(leverAngle), switchY + swHeight / 2 + leverLen * Math.sin(leverAngle), baseRadius);
  // Store clickable bounds for interaction
  const bounds = {
    x: cx - swWidth / 2,
    y: switchY,
    w: swWidth,
    h: swHeight
  };
  if (returnBounds) return bounds;
}

// Update drawSimpleTank to accept canvasWidth as an argument
function drawSimpleTank(x, y, w, h, liquidLevel, liquidColor, canvasWidth) {
  // Tank body (vertically sliced open, with wall thickness)
  const ellipseHeight = w * 0.18;
  const wall = Math.max(4, w * 0.035);
  const wOuter = w;
  const wInner = w - 2 * wall;
  const eOuter = ellipseHeight;
  const eInner = ellipseHeight - wall * 0.5;
  const topY = y - h / 2;
  const bottomY = y + h / 2;

  // Draw wall fill (grey area between outer and inner walls)
  noStroke();
  fill(200);
  // Top wall (front arc)
  beginShape();
  arc(x, topY, wOuter, eOuter, 0, Math.PI);
  arc(x, topY, wInner, eInner, Math.PI, 0, true);
  endShape(CLOSE);
  // Bottom wall (front arc)
  beginShape();
  arc(x, bottomY, wOuter, eOuter, Math.PI, 2 * Math.PI);
  arc(x, bottomY, wInner, eInner, 2 * Math.PI, Math.PI, true);
  endShape(CLOSE);
  // Left wall
  rect(x - wOuter / 2, topY, wall, h);
  // Right wall
  rect(x + wOuter / 2 - wall, topY, wall, h);

  // Draw back wall (lighter arcs)
  stroke(200);
  strokeWeight(2);
  noFill();
  arc(x, topY, wOuter, eOuter, Math.PI, 2 * Math.PI);
  arc(x, topY, wInner, eInner, Math.PI, 2 * Math.PI);
  arc(x, bottomY, wOuter, eOuter, 0, Math.PI);
  arc(x, bottomY, wInner, eInner, 0, Math.PI);

  // Fill the backside upper wall with grey
  fill(200);
  noStroke();
  beginShape();
  arc(x, topY, wOuter, eOuter, Math.PI, 2 * Math.PI);
  arc(x, topY, wInner, eInner, 2 * Math.PI, Math.PI, true);
  endShape(CLOSE);

  // Draw outer and inner front arcs and sides (black)
  stroke(0);
  strokeWeight(2); // Thinner black outline
  // Outer and inner back arcs (top, black)
  arc(x, topY, wOuter, eOuter, Math.PI, 2 * Math.PI);
  arc(x, topY, wInner, eInner, Math.PI, 2 * Math.PI);
  // Outer and inner front arcs (top, light grey)
  stroke(200);
  arc(x, topY, wOuter, eOuter, 0, Math.PI);
  arc(x, topY, wInner, eInner, 0, Math.PI);
  // Bottom arcs (front, black)
  stroke(0);
  arc(x, bottomY, wOuter, eOuter, Math.PI, 2 * Math.PI);
  arc(x, bottomY, wInner, eInner, Math.PI, 2 * Math.PI);
  // Sides
  line(x - wOuter / 2, topY, x - wOuter / 2, bottomY);
  line(x + wOuter / 2, topY, x + wOuter / 2, bottomY);
  line(x - wOuter / 2 + wall, topY, x - wOuter / 2 + wall, bottomY);
  line(x + wOuter / 2 - wall, topY, x + wOuter / 2 - wall, bottomY);

  // Add white padding and grey outline to top wall
  // First draw the white padding
  stroke(255);
  strokeWeight(3);
  noFill();
  arc(x, topY, wOuter, eOuter, 0, Math.PI);
  arc(x, topY, wInner, eInner, 0, Math.PI);
  line(x - wOuter / 2, topY, x - wOuter / 2 + wall, topY);
  line(x + wOuter / 2, topY, x + wOuter / 2 - wall, topY);
  
  // Then draw the grey outline on top
  stroke(180);
  strokeWeight(2);
  noFill();
  arc(x, topY, wOuter, eOuter, 0, Math.PI);
  arc(x, topY, wInner, eInner, 0, Math.PI);
  line(x - wOuter / 2, topY, x - wOuter / 2 + wall, topY);
  line(x + wOuter / 2, topY, x + wOuter / 2 - wall, topY);

  // Add top base outline (matching bottom style)
  stroke(200);
  strokeWeight(2);
  noFill();
  // Draw the top base outline
  const topBaseWidth = w * 0.4;
  const topBaseHeight = 10;
  rect(x - topBaseWidth / 2, topY - topBaseHeight, topBaseWidth, topBaseHeight, 5);
  // Add a small lip at the front
  line(x - topBaseWidth / 2, topY - topBaseHeight, x - topBaseWidth / 2, topY);
  line(x + topBaseWidth / 2, topY - topBaseHeight, x + topBaseWidth / 2, topY);

  // Add outlet pipe on the right wall
  const pipeWidth = canvasWidth * 0.012; // Matches the feed tank pipe width exactly
  const pipeLength = w * 0.4; // Increased from 0.3 to 0.4 to make the pipe longer
  // Position pipe at exactly the same level as the inlet pipe
  const pipeY = y - h / 2 + 120; // Lowered from 60 to 80 to move pipe down

  // Draw pipe with rounded end at tank and simple end
  stroke(40);
  strokeWeight(2);
  fill(240); // Light grey for pipe
  beginShape();
  // Left end (at tank)
  arc(x + wOuter / 2, pipeY, pipeWidth, pipeWidth, -Math.PI / 2, Math.PI / 2);
  // Top line
  vertex(x + wOuter / 2, pipeY - pipeWidth / 2);
  vertex(x + wOuter / 2 + pipeLength, pipeY - pipeWidth / 2);
  // Right end (simple flat end)
  vertex(x + wOuter / 2 + pipeLength, pipeY + pipeWidth / 2);
  vertex(x + wOuter / 2, pipeY + pipeWidth / 2);
  endShape(CLOSE);

  // Draw a vertical pipe extending downward from the end of the outlet pipe
  const verticalPipeX = x + wOuter / 2 + pipeLength;
  const verticalPipeYStart = pipeY;
  const verticalPipeLength = w * 0.48; // Reduced from 0.5 to 0.4 to make it shorter
  
  // Draw solid vertical pipe with border
  fill(240); // Light grey fill
  stroke(40); // Dark grey border
  strokeWeight(2);
  rect(verticalPipeX - pipeWidth / 2, verticalPipeYStart, pipeWidth, verticalPipeLength);

  // Draw intersection (mechanical joint) at the elbow
  const jointCircleRadius = pipeWidth * 0.6;
  const jointBoltCount = 6;
  const jointBoltRadius = jointCircleRadius * 0.7;
  const jointBoltSize = jointCircleRadius * 0.15;
  // Main circle
  fill(240);
  stroke(40);
  strokeWeight(2);
  circle(verticalPipeX, verticalPipeYStart, jointCircleRadius * 2);
  // Bolt holes around the circle
  for (let i = 0; i < jointBoltCount; i++) {
    const angle = (i * 2 * Math.PI) / jointBoltCount;
    const bx = verticalPipeX + Math.cos(angle) * jointBoltRadius;
    const by = verticalPipeYStart + Math.sin(angle) * jointBoltRadius;
    fill(200);
    stroke(40);
    strokeWeight(2);
    circle(bx, by, jointBoltSize);
  }
  // Center cross detail
  stroke(0);
  strokeWeight(1);
  line(verticalPipeX - jointCircleRadius * 0.3, verticalPipeYStart, verticalPipeX + jointCircleRadius * 0.3, verticalPipeYStart);
  line(verticalPipeX, verticalPipeYStart - jointCircleRadius * 0.3, verticalPipeX, verticalPipeYStart + jointCircleRadius * 0.3);


  // Draw rotor (suspended from the top, centered) BEFORE the liquid
  const shaftWidth = w * 0.04;
  const shaftLen = h * 0.75; // Increased shaft length
  const bladeLen = w * 0.32; // Paddle length
  const bladeWidth = h * 0.11; // Slimmer paddle width
  const rotorTopY = y - h / 2 + Math.max(4, w * 0.035) + 2; // Just below the inner top wall

  // Draw curved dome above rotor shaft
  const domeWidth = w * 0.15;
  const domeHeight = h * 0.25;
  const domeY = rotorTopY;

  // Dome main body
  fill(200);
  stroke(40);
  strokeWeight(2); // Increased from 1 to 2 to match tank outline
  // Draw main dome body with more pronounced curve
  beginShape();
  vertex(x - domeWidth / 2, domeY);
  bezierVertex(
    x - domeWidth / 2, domeY - domeHeight * 0.8, // Control point 1
    x + domeWidth / 2, domeY - domeHeight * 0.8, // Control point 2
    x + domeWidth / 2, domeY
  );
  endShape(CLOSE);

  // Remove dome highlight
  // noStroke();
  // fill(255, 255, 255, 100);
  // ellipse(x - domeWidth * 0.2, domeY - domeHeight * 0.4, domeWidth * 0.4, domeHeight * 0.2);

  drawRotor(x, rotorTopY, shaftLen, shaftWidth, bladeLen, bladeWidth, rotorAngle);

  // Draw the liquid inside the cutaway tank with flat top and curved bottom
  if (liquidLevel > 0) {
    const tankInnerTop = topY + wall;
    const tankInnerBottom = bottomY - wall;
    const liquidHeight = (h - 2 * wall) * liquidLevel;
    const liquidTopY = tankInnerBottom - liquidHeight;
    const waveHeight = 0.8; // Reduced from 1.5 to 0.8 for flatter waves
    const segments = 20;

    fill(liquidColor);
    noStroke();
    beginShape();
    // Left side
    vertex(x - wInner / 2, liquidTopY);
    // Wavy top surface
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const xPos = x - wInner / 2 + wInner * t;
      const yOffset = Math.sin(waveOffset + t * 4 * Math.PI) * waveHeight;
      vertex(xPos, liquidTopY + yOffset);
    }
    // Right side down to bottom
    // Follow inner wall curve at bottom (right to left)
    let angleSteps = 20;
    for (let i = 0; i <= angleSteps; i++) {
      const angle = 0 + (i / angleSteps) * Math.PI;
      const px = x + Math.cos(angle) * wInner / 2;
      const py = tankInnerBottom + Math.sin(angle) * eInner / 2;
      vertex(px, py);
    }
    endShape(CLOSE);
  }

  // Add bar structures on both sides of the inner walls
  const barWidth = w * 0.04; // Width of the bars
  const barLength = h * 0.38; // Reduced length
  const rodWidth = w * 0.015; // Width of the connecting rods
  const rodLength = w * 0.05; // Length of the connecting rods
  const barExtension = h * 0.025; // Slightly reduced extension
  const verticalOffset = h * 0.16; // Move bars further down

  // Draw left side bar structure
  fill(180); // Dark grey for bars and rods
  stroke(40);
  strokeWeight(2);

  // Left bar (extended beyond clamps)
  rect(x - wInner / 2 + rodLength, y - barLength / 2 - barExtension + verticalOffset, barWidth, barLength + 2 * barExtension);

  // Top rod
  rect(x - wInner / 2, y - barLength / 2 + verticalOffset, rodLength, rodWidth);

  // Bottom rod
  rect(x - wInner / 2, y + barLength / 2 - rodWidth + verticalOffset, rodLength, rodWidth);

  // Draw right side bar structure
  // Right bar (extended beyond clamps)
  rect(x + wInner / 2 - rodLength - barWidth, y - barLength / 2 - barExtension + verticalOffset, barWidth, barLength + 2 * barExtension);

  // Top rod
  rect(x + wInner / 2 - rodLength, y - barLength / 2 + verticalOffset, rodLength, rodWidth);

  // Bottom rod
  rect(x + wInner / 2 - rodLength, y + barLength / 2 - rodWidth + verticalOffset, rodLength, rodWidth);

  // Draw switch above the tank
  const switchY = y - h / 2 - 130;
  switchBounds = drawRotorSwitch(x, y - h / 2, switchY, rotorOn, true);
  // Draw wire from switch to top of rotor shaft
  stroke(60);
  strokeWeight(3);
  noFill();
  const shaftTopY = y - h / 2 + Math.max(4, w * 0.035) + 2;
  // Draw a wavy wire for realism
  beginShape();
  for (let i = 0; i <= 17; i++) {
    const t = i / 20;
    const wx = x;
    const wy = switchY + 48 + (shaftTopY - (switchY + 32)) * t + Math.sin(t * 4 * Math.PI) * 6 * (1 - t);
    vertex(wx, wy);
  }
  endShape();
}

// Refactor mousePressed handler to check all switches and only return after toggling the correct one
const oldMousePressed = window.mousePressed;
window.mousePressed = function() {
  // Check hamburger menu first
  if (handleHamburgerClick(mX, mY)) {
    return;
  }

  // Check reset button
  if (resetButtonBounds &&
    mX >= resetButtonBounds.x &&
    mX <= resetButtonBounds.x + resetButtonBounds.width &&
    mY >= resetButtonBounds.y &&
    mY <= resetButtonBounds.y + resetButtonBounds.height) {
    resetSimulation();
    return;
  }

  // Check other interactions
  const mx = mX,
    my = mY;
  let toggled = false;
  if (rotorOn && pumpASwitchBounds && mx >= pumpASwitchBounds.x && mx <= pumpASwitchBounds.x + pumpASwitchBounds.w && my >= pumpASwitchBounds.y && my <= pumpASwitchBounds.y + pumpASwitchBounds.h) {
    pumpASwitchOn = !pumpASwitchOn;
    toggled = true;
  }
  if (rotorOn && pumpBSwitchBounds && mx >= pumpBSwitchBounds.x && mx <= pumpBSwitchBounds.x + pumpBSwitchBounds.w && my >= pumpBSwitchBounds.y && my <= pumpBSwitchBounds.y + pumpBSwitchBounds.h) {
    pumpBSwitchOn = !pumpBSwitchOn;
    toggled = true;
  }
  if (switchBounds && mx >= switchBounds.x && mx <= switchBounds.x + switchBounds.w && my >= switchBounds.y && my <= switchBounds.y + switchBounds.h) {
    rotorOn = !rotorOn;
    toggled = true;
  }
  if (!toggled && typeof oldMousePressed === 'function') oldMousePressed();
};

// Add mouseReleased handler to reset drag states
window.mouseReleased = function() {
  isDraggingValveA = false;
  isDraggingValveB = false;
};

function drawResetButton() {
  const buttonWidth = 100;
  const buttonHeight = 36;
  const buttonX = width - buttonWidth - 20;
  const buttonY = 20;

  // Check if mouse is hovering over the reset button, accounting for scaling
  const isHovering = mX >= buttonX && mX <= buttonX + buttonWidth &&
                     mY >= buttonY && mY <= buttonY + buttonHeight;

  // Button background with black border
  stroke(0); // Black border
  strokeWeight(2);
  // Use a lighter red when hovering
  fill(isHovering ? color(255, 83, 99) : color(220, 53, 69)); // Modern red color
  rect(buttonX, buttonY, buttonWidth, buttonHeight, 8);

  // Button text
  fill(255); // White text
  textAlign(CENTER, CENTER);
  textSize(18); // Increased from 14 to 18
  textStyle(BOLD);
  text("Reset", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2);
  textStyle(NORMAL);

  // Store button bounds for interaction
  resetButtonBounds = {
    x: buttonX,
    y: buttonY,
    width: buttonWidth,
    height: buttonHeight
  };
}

function resetSimulation() {
  // Reset slider values
  sliderAValue = 0.3;
  sliderBValue = 0.3;

  // Reset valve positions
  valveAPosition = 0;
  valveBPosition = 0;

  // Reset tank liquid levels
  tankALiquidLevel = 1.0; // NaOH tank - Changed from 0.85 to 1.0 to represent 20L
  tankBLiquidLevel = 1.0; // CH₃COOCH₃ tank - Changed from 0.85 to 1.0 to represent 20L
  simpleTankLiquidLevel = 0.65; // CSTR tank
  collectionTankLiquidLevel = 0;

  // Reset waterfall animations
  simpleTankWaterfallProgress = 0;
  collectionTankWaterfallProgress = 0;

  // Reset rotor
  rotorAngle = 0;
  rotorOn = false;

  // Reset pump states
  pumpASwitchOn = false;
  pumpBSwitchOn = false;

  // Reset volume tracking
  tankADeltaV = 0;
  tankBDeltaV = 0;
  displayTankADeltaV = 0;
  displayTankBDeltaV = 0;
  displayCA1 = 0;
  displayCB1 = 0;
  tankALastFlowTime = 0;
  tankBLastFlowTime = 0;
  totalInletFlowRate = 0;
  lastVolumeUpdateTime = 0;

  // Reset temperature
  temperatureValue = 55; // Default to middle of range (25-85 °C)
  temperatureSet = false;

  // Reset concentration settings
  concentrationSet = false;

  // Reset CSTR calculations
  lastCalculationTime = millis();
  currentCA1 = 0;
  currentCB1 = 0;
  accumulatedTime = 0;

  // Reset tank colors
  lastCSTRColor = null;
  lastCollectionColor = null;

  // Reset wave animation
  waveOffset = 0;

  // Reset last update time
  lastUpdateTime = millis();
}

// Draw a monitor box for temperature
function drawTemperatureMonitor(x, y, value) {
  stroke(0);
  strokeWeight(1);
  fill(220);
  const monitorWidth = 70;
  const monitorHeight = 35;
  rect(x - monitorWidth / 2, y, monitorWidth, monitorHeight, 5);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(value.toFixed(1) + " °C", x, y + monitorHeight / 2);
}

function drawVolumeMonitor(x, y, value) {
  // Monitor box
  stroke(0);
  strokeWeight(1);
  fill(220);
  const monitorWidth = 65;
  const monitorHeight = 35;
  rect(x, y, monitorWidth, monitorHeight, 5);

  // Display value in ml (no decimals)
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(12);
  text(value + " ml", x + monitorWidth / 2, y + monitorHeight / 2);
}

function drawCollectionTank(x, y, w, h, liquidLevel, liquidColor) {
  // Draw stand first
  drawStand(x, y, w, h);
  
  // Tank outline
  stroke(0);
  strokeWeight(3); // Thick walls
  noFill();
  
  // Main cylindrical body
  const cylinderHeight = h;
  
  // Draw main cylinder sides with thicker walls
  line(x - w / 2, y - h / 2, x - w / 2, y + h / 2);
  line(x + w / 2, y - h / 2, x + w / 2, y + h / 2);
  
  // Draw top rim
  const rimWidth = w * 0.1; // Width of the rim
  strokeWeight(3);
  // Left rim
  line(x - w / 2, y - h / 2, x - w / 2 - rimWidth, y - h / 2);
  // Right rim
  line(x + w / 2, y - h / 2, x + w / 2 + rimWidth, y - h / 2);
  // Front rim
  line(x - w / 2 - rimWidth, y - h / 2, x + w / 2 + rimWidth, y - h / 2);
  
  // Bottom line
  strokeWeight(4); // Even thicker bottom line
  line(x - w / 2, y + h / 2, x + w / 2, y + h / 2);
  strokeWeight(3); // Reset stroke weight for rest of the drawing
  
  // Draw liquid with current level, accounting for wall thickness
  const wallThickness = 3; // Match the stroke weight
  const adjustedWidth = w - (2 * wallThickness);
  const adjustedHeight = h - (2 * wallThickness);
  const adjustedX = x;
  const adjustedY = y;
  drawLiquid(adjustedX, adjustedY, adjustedWidth, adjustedHeight, liquidLevel, liquidColor);
  
  // Draw outlet pipe with bottom valve
  const pipeWidth = w * 0.1; // Same width as cone bottom
  const pipeHeight = h * 0.4; // Height of the vertical pipe
  const valveY = y + h / 2 + pipeHeight + 10;
  
  // Draw vertical pipe
  stroke(40);
  strokeWeight(2);
  fill(240); // Light grey for pipe
  beginShape();
  // Top end (at tank)
  arc(x, y + h / 2, pipeWidth, pipeWidth, 0, Math.PI);
  // Left line
  vertex(x - pipeWidth / 2, y + h / 2);
  vertex(x - pipeWidth / 2, valveY);
  // Bottom end
  arc(x, valveY, pipeWidth, pipeWidth, 0, Math.PI);
  // Right line
  vertex(x + pipeWidth / 2, valveY);
  vertex(x + pipeWidth / 2, y + h / 2);
  endShape(CLOSE);

  // Draw horizontal pipe from valve (behind the valve)
  const horizontalPipeLength = w * 1.2;
  stroke(40);
  strokeWeight(2);
  fill(240); // Light grey for pipe
  beginShape();
  // Left end (at valve)
  arc(x, valveY, pipeWidth, pipeWidth, -Math.PI / 2, Math.PI / 2);
  // Top line
  vertex(x, valveY - pipeWidth / 2);
  vertex(x + horizontalPipeLength, valveY - pipeWidth / 2);
  // Right end
  arc(x + horizontalPipeLength, valveY, pipeWidth, pipeWidth, -Math.PI / 2, Math.PI / 2);
  // Bottom line
  vertex(x + horizontalPipeLength, valveY + pipeWidth / 2);
  vertex(x, valveY + pipeWidth / 2);
  endShape(CLOSE);

  // Draw valve body
  const valveSize = pipeWidth * 3;
  fill(100, 150, 255); // Blue tint
  stroke(40);
  strokeWeight(2);
  circle(x, valveY, valveSize);

  // Add bolt holes around the valve body
  const boltCount = 8;
  const boltRadius = valveSize * 0.4;
  const boltSize = valveSize * 0.06;
  for (let i = 0; i < boltCount; i++) {
    const angle = (i * 2 * Math.PI) / boltCount;
    const bx = x + Math.cos(angle) * boltRadius;
    const by = valveY + Math.sin(angle) * boltRadius;
    fill(160, 160, 170); // Metallic grey for bolts
    stroke(40);
    strokeWeight(2);
    circle(bx, by, boltSize);
  }

  // Draw valve handle
  const handleLength = valveSize;
  const handleWidth = 15;
  const handleAngle = Math.PI; // Point left
  
  push();
  translate(x, valveY);
  rotate(handleAngle);
  fill(100, 150, 255); // Blue, same as valve body
  rect(0, -handleWidth / 2, handleLength, handleWidth, 5);
  
  // Add handle details
  stroke(0);
  strokeWeight(1);
  // Add grip lines on handle
  const gripCount = 3;
  const gripSpacing = handleLength / (gripCount + 1);
  for (let i = 1; i <= gripCount; i++) {
    line(i * gripSpacing, -handleWidth / 2 + 2, i * gripSpacing, handleWidth / 2 - 2);
  }
  
  // Draw handle knob
  translate(handleLength, 0);
  fill(255, 215, 0); // Gold knob to match other valves
  circle(0, 0, handleWidth * 1.5);
  
  // Add center dot to handle
  fill(0);
  circle(0, 0, handleWidth * 0.4);
  pop();
} 