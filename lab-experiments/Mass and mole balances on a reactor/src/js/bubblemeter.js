import { drainingToBeaker, coordinateFlowRates } from "./condenser.js";
import { getBubbleSpawnRate } from "./calcs.js";
import { getExperimentState, canMeasureGas, setMeasuringState, completeMeasurement } from "./draw.js";

let lastBubbleFrame = 0;
let vaporFlowRate = 0; // Will be set by temperature
let bubbleSpawnRate = 0; 
let bubbleSpawnIntervalFrames = Infinity; // Start with no bubbles
export let reactorTemp = 300; // default initial value

// Measurement state variables
let measurementActive = false;
let measurementStartTime = null;
let measurementPhase = "idle"; // idle, rising, holding, falling
let targetReading = 31.8; // Will be set based on temperature
let currentReading = 0; // Start from 0mL (empty tube)
let measurementTemp = 300; // Temperature when measurement was taken

// Animation variables
let liquidDisturbance = [];
let bubbleTrails = [];
let surfaceTension = 0;
let foamLevel = 0;

let bulbPressed = false;
let bubbleY = null;
let bubbleActive = false;
let bubbleSpeed = 0.4;

// Remove complex liquid tracking - just show during measurement
let soapBaseline = 2;  // Fixed baseline for calculations only
let accumulatedLiquid = 0;  // For gas accumulation tracking
let soapRiseSpeed = 0.05;
let soapFallRate = 0.005;

export const meterHeight = 50;
const meterWidth = 5;

export let hydrogenBubbles = [];

export function drawBubbleMeter(x = 200, y = 40) {
  push();
  translate(x, y);

  // === Tube ===
  stroke(180);
  strokeWeight(0.5);
  fill(255, 255, 255, 40);
  rect(0, 0, meterWidth, meterHeight, 4);

  // === Volume Markings (every 2.5 mL from 0 to 50)
  fill(0);
  noStroke();
  textSize(2);
  textAlign(LEFT, CENTER);
  for (let i = 0; i <= 20; i++) {
    const scaleStart = 8; // Start scale above soap area
    const scaleHeight = meterHeight - scaleStart - 1;
    let yMark = meterHeight - scaleStart - i * (scaleHeight / 20);
    
    stroke(50);
    strokeWeight(0.4);
   
    // Right tick marks
    line(meterWidth - 2, yMark, meterWidth + 1, yMark);

    noStroke();
    text(`${i * 2.5} ml`, meterWidth + 2, yMark);
  }

  // === Highlight region (0–10 mL zone for flow timing)
  fill(100, 255, 100, 130); // green transparent
  noStroke();
  
  beginShape();
  vertex(0, meterHeight - 8);
  vertex(0, meterHeight - 8 + 8);
  
  // Curved bottom edge
  for (let i = 0; i <= meterWidth; i++) {
    const x = i;
    const curveDepth = 1.5;
    const y = meterHeight - 8 + 8 - curveDepth * sin(PI * i / meterWidth);
    vertex(x, y);
  }
  
  vertex(meterWidth, meterHeight - 8 + 8);
  vertex(meterWidth, meterHeight - 8);
  endShape(CLOSE);

  // Show liquid during measurement only
  if (measurementActive) {
    const displayLevel = currentReading;
    const liquidHeight = map(displayLevel, 0, 50, 0, meterHeight - 8) * 1.2;
    
    fill(100, 255, 100, 120);
    noStroke();
    rect(0, meterHeight - liquidHeight, meterWidth, liquidHeight);
    
    // Add measurement effects
    drawMeasurementEffects();
  }

  // === Bulb ===
  drawSqueezeBulb(meterWidth / 2, meterHeight);

  pop();
}

function drawMeasurementEffects() {
  // Surface ripples
  if (liquidDisturbance.length > 0) {
    stroke(100, 180, 255, 100);
    strokeWeight(0.3);
    noFill();
    
    for (let i = liquidDisturbance.length - 1; i >= 0; i--) {
      let ripple = liquidDisturbance[i];
      ellipse(meterWidth/2, ripple.y, ripple.radius, ripple.radius * 0.3);
      ripple.radius += 0.5;
      ripple.alpha -= 5;
      
      if (ripple.alpha <= 0) {
        liquidDisturbance.splice(i, 1);
      }
    }
  }
  
  // Bubble trails
  if (bubbleTrails.length > 0) {
    noStroke();
    for (let i = bubbleTrails.length - 1; i >= 0; i--) {
      let bubble = bubbleTrails[i];
      fill(255, 255, 255, bubble.alpha);
      ellipse(bubble.x, bubble.y, bubble.size);
      
      bubble.y -= bubble.speed;
      bubble.alpha -= 2;
      
      if (bubble.alpha <= 0 || bubble.y < 10) {
        bubbleTrails.splice(i, 1);
      }
    }
  }
  
  // Foam effect
  if (foamLevel > 0) {
    fill(255, 255, 255, foamLevel);
    noStroke();
    const surfaceY = meterHeight - map(currentReading, 0, 50, 0, meterHeight - 8);
    rect(0, surfaceY - 2, meterWidth, 2);
    foamLevel -= 1;
  }
}

function drawSqueezeBulb(cx, cy) {
  push();
  translate(cx, cy);

  // Consistent logic - removed redundant inline check
  let canPress = false;

  // Only two conditions - consistent with handleBulbClick()
  if (hydrogenBubbles.length > 30 && !measurementActive && canMeasureRealistic()) {
    canPress = true;
  }

  if (isNearTargetLevel() && !measurementActive && canMeasureRealistic()) {
    canPress = true;
  }

  const bulbColor = canPress ? color(200, 50, 50) : color(120, 120, 120);
  
  fill(bulbColor);
  stroke(80);
  strokeWeight(0.5);
  ellipse(0, 0, 5, 6);

  pop();
}

export function handleBulbClick(mx, my, meterX = 129.8, meterY = 33) {
  const localX = mx - (meterX + meterWidth / 2);
  const localY = my - (meterY + meterHeight);

  const r = 6;
  if (localX * localX + localY * localY <= r * r * 4) {
    
    // Same logic as drawSqueezeBulb()
    let canStartMeasurement = false;
    
    if ((hydrogenBubbles.length > 30 || isNearTargetLevel()) && !measurementActive && canMeasureRealistic()) {
      canStartMeasurement = true;
    }

    if (canStartMeasurement) {
      startMeasurement();
      console.log("Starting bubble meter measurement!");
      return true;
    } else if (measurementActive) {
      console.log("Measurement already in progress...");
      return true;
    } else {
      return false;
    }
  }
  return false;
}

function canMeasureRealistic() {
  // Require ALL systems to be active for realistic measurement
  return window.reactorHeaterOn && 
         window.condenserCoolingOn && 
         (window.valveState === "tocondenser");
}

function isNearTargetLevel() {
  if (typeof window.condensedFluidLevel !== 'undefined' && typeof window.targetCollection !== 'undefined') {
    const current_mL = window.condensedFluidLevel * 250;
    const target_mL = window.targetCollection * 250;
    // More realistic: only activate when 90% full or within 10mL of target
    const activationThreshold = Math.min(target_mL * 0.9, target_mL - 10);
    return current_mL >= activationThreshold;
  }
  return false;
}

function startMeasurement() {
  measurementActive = true;
  measurementStartTime = millis();
  measurementPhase = "rising";
  measurementTemp = window.reactorTemp || 300;
  
  // Calculate target based on temperature with realistic variability
  const propanolFed = 3.33; // mol (250 mL propanol)
  let conversion, gasProduced_mol;
  
  if (measurementTemp >= 330) {
    // For 330°C+ range, use random value between 43-47mL
    targetReading = random(43, 47); // Random between 43-47mL each measurement
    console.log(`Random measurement at ${measurementTemp}°C: ${targetReading.toFixed(1)}mL`);
  } else if (measurementTemp >= 300) {
    // For 300°C-329°C range, use random value between 31-35mL
    targetReading = random(31, 35); // Random between 31-35mL each measurement
    console.log(`Random measurement at ${measurementTemp}°C: ${targetReading.toFixed(1)}mL`);
  } else {
    // Lower temperature - less gas
    conversion = 0.20;
    gasProduced_mol = propanolFed * conversion;
    targetReading = gasProduced_mol * 19.4; // ~15mL
  }
  
  currentReading = 0;
  setMeasuringState(); // Update global state
  
  console.log(`Measurement started at ${measurementTemp}°C`);
  console.log(`Animation: 0mL → ${targetReading.toFixed(1)}mL`);
}

function updateMeasurement() {
  if (!measurementActive) return;
  
  const elapsed = millis() - measurementStartTime;
  
  switch (measurementPhase) {
    case "rising":
      // Smooth rise to target over 2 seconds
      const riseProgress = Math.min(elapsed / 2000, 1.0);
      currentReading = targetReading * easeInOutQuad(riseProgress);
      
      // Add visual effects during rise
      if (frameCount % 8 === 0) {
        addBubbleTrail();
      }
      if (frameCount % 15 === 0) {
        addLiquidDisturbance();
      }
      
      foamLevel = Math.min(foamLevel + 3, 60);
      
      if (riseProgress >= 1.0) {
        measurementPhase = "holding";
        console.log(`Measurement reading: ${currentReading.toFixed(1)}mL`);
      }
      break;
      
    case "holding":
      // Hold at target for 1.5 seconds
      if (elapsed > 3500) {
        measurementPhase = "falling";
      }
      
      // Gentle surface disturbance while holding
      if (frameCount % 30 === 0) {
        addLiquidDisturbance();
      }
      break;
      
    case "falling":
      // Fall back to 0mL
      const fallStart = 3500;
      const fallProgress = Math.min((elapsed - fallStart) / 1500, 1.0);
      currentReading = targetReading * (1 - easeInOutQuad(fallProgress));
      
      if (fallProgress >= 1.0) {
        measurementActive = false;
        measurementPhase = "idle";
        currentReading = 0;
        completeMeasurement(); // Update global state
        console.log("Measurement complete - tube returned to empty");
      }
      break;
  }
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function addBubbleTrail() {
  const surfaceY = meterHeight - map(currentReading, 0, 50, 0, meterHeight - 8);
  bubbleTrails.push({
    x: random(0.5, meterWidth - 0.5),
    y: surfaceY + random(5, 15),
    size: random(0.5, 1.5),
    speed: random(0.2, 0.5),
    alpha: 150
  });
}

function addLiquidDisturbance() {
  const surfaceY = meterHeight - map(currentReading, 0, 50, 0, meterHeight - 8);
  liquidDisturbance.push({
    y: surfaceY,
    radius: 1,
    alpha: 100
  });
}

export function drawBubbleMeterElbowTube() {
  const tubeWidth = 2;
  
  const branchX = 104;
  const branchY = 63;
  const verticalDrop = 8;

  fill(200, 200, 200, 200); 
  noStroke();
  rect(branchX - tubeWidth / 2, branchY, tubeWidth, verticalDrop);

  const horizontalLength = branchX - 130 + 7;

  rect(
    branchX - horizontalLength - 1,
    branchY + verticalDrop - tubeWidth / 2 - 1,
    horizontalLength,
    tubeWidth
  );
}

export function drawTubeAtAngleToBubbleMeter() {
  const tubeWidth = 2;

  const startX = 121.5;
  const startY = 70;
  const endX = 130 + meterWidth / 2;
  const endY = 77.5;

  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);

  push();
  translate(startX, startY);
  rotate(angle);

  noStroke();
  fill(200, 200, 200, 200); 
  rect(0, -tubeWidth / 2, length/2 + 5, tubeWidth);  

  pop();
}

// Bubble spawning coordinated with liquid flow to beaker
export function maybeSpawnHydrogenBubble(temp) {
  // Only spawn bubbles when liquid is actively draining to beaker
  if (!drainingToBeaker) {
    return; // No gas bubbles when no liquid flow
  }
  
  // Stop vapor particles when beaker reaches target-10mL (coordinated stopping)
  if (typeof window.condensedFluidLevel !== 'undefined' && typeof window.targetCollection !== 'undefined') {
    const current_mL = window.condensedFluidLevel * 250; // Current beaker level in mL
    const target_mL = window.targetCollection * 250; // Target level in mL
    const stopThreshold_mL = target_mL - 10; // Stop vapor 10mL before target
    
    if (current_mL >= stopThreshold_mL) {
      if (frameCount % 120 === 0) { // Log every 2 seconds
        console.log(`Vapor particles stopped: ${current_mL.toFixed(0)}mL reached threshold (${stopThreshold_mL.toFixed(0)}mL)`);
      }
      return; // No more vapor particles in final 10mL approach
    }
  }
  
  // Check system requirements
  if (!window.reactorHeaterOn || temp < 290) {
    return; // No bubbles if heater off or temp too low
  }
  
  // Must be directed to condenser
  if (window.valveState !== "tocondenser") {
    return; // No bubbles to meter if valve goes to exhaust
  }
  
  // Condenser must be active
  if (!window.condenserCoolingOn) {
    return; // No condensation process without cooling
  }
  
  // Check spawn interval
  if (frameCount - lastBubbleFrame < bubbleSpawnIntervalFrames) {
    return; // Too soon for next bubble
  }
  
  // Check if reaction is producing gas
  const materialBalance = coordinateFlowRates(temp);
  
  // Only when conversion is active and liquid flowing
  if (materialBalance.conversion > 0) {
    let bubbleColor;

    // Color based on temperature/reaction products
    if (temp < 330) {
      bubbleColor = color(100, 255, 180, 255);  // greenish for propylene (reaction 1 dominant)
    } else {
      bubbleColor = color(180, 220, 255, 255);  // bluish for hydrogen (reaction 2 more active)
    }

    hydrogenBubbles.push({
      x: 104,
      y: 63,
      vx: 0,
      vy: 0.3,
      phase: "vertical",
      alpha: 255,
      color: bubbleColor,
      size: 1.8
    });
    
    lastBubbleFrame = frameCount;
    console.log(`Gas bubble spawned (synced with liquid flow) at ${temp}°C`);
  }
}

export function drawHydrogenBubbles() {
  // Update measurement animation
  updateMeasurement();
  
  let anyBubbleRising = false;

  for (let i = hydrogenBubbles.length - 1; i >= 0; i--) {
    let b = hydrogenBubbles[i];

    // Movement by phase
    if (b.phase === "vertical") {
      b.y += b.vy;
      if (b.y >= 70) {
        b.phase = "horizontal";
        b.vx = 0.4;
        b.vy = 0;
      }
    } else if (b.phase === "horizontal") {
      b.x += b.vx;
      if (b.x >= 121.5) {
        b.phase = "angled";
        b.vx = 0.3;
        b.vy = 0.2;
      }
    } else if (b.phase === "angled") {
      b.x += b.vx;
      b.y += b.vy;

      if (b.x >= 132.5 && b.y >= 70) {
        b.phase = "rising";
        b.vx = 0;
        b.vy = -0.04;
        
        // Just accumulate some liquid when bubbles enter
        if (accumulatedLiquid < 8) {
          accumulatedLiquid += soapRiseSpeed;
        }
      }
    } else if (b.phase === "rising") {
      b.y += b.vy;
      b.alpha -= 1.0;
      anyBubbleRising = true;
    }

    // Draw the bubble
    push();
    let c = b.color;
    c.setAlpha(b.alpha);
    fill(c);
    noStroke();
    ellipse(b.x, b.y, b.size || 1.5);
    pop();

    if (b.alpha <= 0) {
      hydrogenBubbles.splice(i, 1);
    }
  }

  // Gentle fallback when no bubbles
  if (!anyBubbleRising && accumulatedLiquid > 0 && !measurementActive) {
    accumulatedLiquid -= soapFallRate;
    if (accumulatedLiquid < 0) accumulatedLiquid = 0;
  }
}

// Update vapor flow rate
export function updateVaporFlowRateBasedOnTemp(temp) {
  reactorTemp = temp;

  // Get realistic flow rates
  const materialBalance = coordinateFlowRates(temp);
  vaporFlowRate = materialBalance.gasFlowRate;

  // Update bubble frequency
  if (vaporFlowRate > 0) {
    bubbleSpawnRate = getBubbleSpawnRate(vaporFlowRate);
    bubbleSpawnIntervalFrames = Math.max(5, 60 / bubbleSpawnRate);
  } else {
    bubbleSpawnRate = 0;
    bubbleSpawnIntervalFrames = Infinity;
  }

  console.log(`Temperature: ${temp}°C, Gas Flow: ${vaporFlowRate.toFixed(1)}mL/s, Bubble Rate: ${bubbleSpawnRate.toFixed(2)}/s`);
}

// Export functions for debugging and display
export function getCurrentGasFlowRate() {
  return vaporFlowRate;
}

export function getBubbleCount() {
  return hydrogenBubbles.length;
}

export function getLiquidLevels() {
  return {
    soapBaseline: soapBaseline,
    accumulatedLiquid: accumulatedLiquid,
    totalLevel: soapBaseline + accumulatedLiquid,
    currentReading: currentReading
  };
}

export function getMeasurementData() {
  return {
    active: measurementActive,
    phase: measurementPhase,
    currentReading: currentReading,
    targetReading: targetReading,
    temperature: measurementTemp
  };
}

// Reset function for bubble meter component
export function resetBubbleMeter() {
  // Reset measurement state
  measurementActive = false;
  measurementStartTime = null;
  measurementPhase = "idle";
  currentReading = 0;
  targetReading = 31.8;
  measurementTemp = 300;
  
  // Reset particle arrays
  hydrogenBubbles = [];
  liquidDisturbance = [];
  bubbleTrails = [];
  
  // Reset visual effects
  surfaceTension = 0;
  foamLevel = 0;
  bulbPressed = false;
  bubbleY = null;
  bubbleActive = false;
  
  // Reset liquid tracking
  accumulatedLiquid = 0;
  
  // Reset flow tracking
  lastBubbleFrame = 0;
  vaporFlowRate = 0;
  bubbleSpawnRate = 0;
  bubbleSpawnIntervalFrames = Infinity;
  reactorTemp = 300;
  
  console.log("Bubble meter reset complete");
}