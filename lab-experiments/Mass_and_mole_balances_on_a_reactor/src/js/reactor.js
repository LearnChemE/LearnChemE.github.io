import { addParticleToCondenser } from './condenser.js';
// Chemistry integration for realistic particle generation
import { getConversionAtTemp, calculateMaterialBalance } from './calcs.js';

export let reactorX = 50;
export let reactorY = 12;
export let reactorHeight = 40;
export let reactorWidth = 15;

export let valveX = reactorX + reactorHeight + 14;
export let valveY = reactorY + reactorWidth / 2;

window.reactorHeaterOn = false;

let coilGlowValue = 120;  // Starting steel grey

export let reactorVaporParticles = [];
const maxReactorVapors = 20; 

let exhaustParticles = [];
const maxExhaustParticles = 20;

let condenserParticles = [];
let condenserPathParticles = [];

export function updateCoilGlow() {
  let target = window.reactorHeaterOn ? 255 : 120;  // use global state
  coilGlowValue = lerp(coilGlowValue, target, 0.05);  // smooth transition
}

export function drawReactorBody(temp) {
  push();
  translate(reactorX, reactorY);

  // Reactor Body - compact design matching updated evaporator
  stroke(100);
  strokeWeight(1.2);
  fill(220);
  rect(0, 0, reactorHeight, reactorWidth, 10); // horizontal reactor

  // Heating coil - coordinated with updated evaporator design
  let turns = 3; // CHANGED: Fewer turns to match evaporator
  let spacing = 4;
  let coilWidth = 6;
  let startX = 14;

  // Enhanced color logic - chemistry and heater state aware
  let coilColor;
  
  if (!window.reactorHeaterOn) {
    coilColor = color(140); // Grey when heater OFF
  } else if (temp >= 330) {
    coilColor = color(255, 69, 0); // Reddish Orange for high temp reaction
  } else if (temp >= 290) {
    coilColor = color(255, 165, 0); // Orange for reaction temperature
  } else {
    coilColor = color(200, 100, 50); // Dim orange when heating but below reaction temp
  }
  
  stroke(coilColor);
  strokeWeight(1);
  noFill();

  for (let i = 0; i < turns; i++) {
    let x = startX + i * spacing;
    let y = reactorWidth / 2;
    arc(x, y, coilWidth, reactorWidth + 2, HALF_PI, -HALF_PI, OPEN);
  }

  // Wiring - adjusted for compact design
  let entryX = startX - 4;
  let entryY = reactorWidth / 2 - (reactorWidth + 2) / 2;

  let jointX = reactorHeight / 3;
  let jointY = reactorWidth + 8;

  bezier(entryX, entryY,
         entryX - 2, entryY + 4,
         jointX - 8, jointY - 3,
         jointX + 3, jointY - 2.5);

  let exitX = startX + (turns - 1) * spacing + 3;
  let exitY = reactorWidth / 2 + (reactorWidth + 2) / 2;

  bezier(exitX, exitY,
         exitX, exitY + 3,
         jointX + 3, jointY - 5,
         jointX, jointY + 1);

  pop();
}

// Compact heater switch matching updated evaporator design
export function drawReactorHeaterSwitch(x = 120, y = 60) {
  const w = 13; // CHANGED: Smaller dimensions matching evaporator switches
  const h = 6; // CHANGED: Smaller dimensions matching evaporator switches
  const isOn = window.reactorHeaterOn;

  push();
  translate(x, y);

  // Lever
  push();
  translate(0, 0);
  rotate(radians(isOn ? 30 : -30));
  stroke(0);
  strokeWeight(1);
  line(0, 0, 0, -3);  // ADJUSTED: matching evaporator lever length
  pop();

  // Switch Body - compact design
  stroke(0);
  strokeWeight(0);
  fill(60);
  rect(-w / 2, 0, w, h, 2); // CHANGED: using smaller dimensions

  // Text Labels - refined positioning
  noStroke();
  fill(255);
  textSize(2); // CHANGED: smaller text matching evaporator
  textAlign(CENTER, CENTER);
  text("OFF", -w / 2 + 3, h / 2); // ADJUSTED: better positioning
  text("ON", w / 2 - 3, h / 2); // ADJUSTED: better positioning

  fill(0);
  // text("reactor switch", 0, h + 3); // COMMENTED OUT: cleaner design
  pop();
}

export function toggleReactorHeater(mx, my, switchX = 63, switchY = 36.5) {
  const x = switchX, y = switchY;
  const w = 18;
  const h = 10;
  
  const left = x - w / 2;
  const right = x + w / 2;
  const top = y;
  const bottom = y + h;
  
  if (mx >= left && mx <= right && my >= top && my <= bottom) {
    window.reactorHeaterOn = !window.reactorHeaterOn;
    
    console.log("Reactor heater toggled! State:", window.reactorHeaterOn); 
    
    // Log reaction status when heater changes - chemistry integration
    const temp = window.reactorTemp || 200;
    const reactionStatus = getReactionStatus(temp);
    console.log("Reaction status:", reactionStatus.status);
    
    // Reset slider when heater turns OFF (coordinated with evaporator)
    if (!window.reactorHeaterOn && window.tempSlider && window.tempValueSpan) {
      window.tempSlider.value = 200;
      window.tempValueSpan.textContent = `200°C`;
      window.targetTemp = 200;
      console.log("Heater turned OFF - Slider reset to 200"); 
    }
    
    return true;
  }
  return false;
}

// INTEGRATED: Coordinated with evaporator's bubble-controlled system
export function updateReactorVaporParticles(temp) {
  // *** CONDENSER COORDINATES: Updated for smaller condenser (12×25 at x=94, y=28) ***
  // Condenser bounds: Left=94, Right=106, Center=100, Top=28, Bottom=53
  
  // Check evaporator vapor production - integrated with bubble-controlled system
  const evaporatorProducingVapor = 
    window.liquidMovementStartTime &&
    millis() - window.liquidMovementStartTime > 1000;

  // Chemistry check - only react when conditions are met
  const reactorActuallyReacting = window.reactorHeaterOn && temp >= 290;

  const left = reactorX + 2;
  const right = reactorX + reactorHeight - 2;
  const top = reactorY + 2;
  const bottom = reactorY + reactorWidth - 2;

  // CHEMISTRY-BASED CONDENSER FLOW - coordinated with bubble-controlled evaporator
  if (evaporatorProducingVapor && 
      reactorActuallyReacting && 
      window.valveState === "tocondenser") {
    
    if (condenserPathParticles.length < 20) { // REDUCED: Fewer particles to prevent bursts
      // Use actual conversion from calcs.js - realistic chemistry
      const actualConversion = getConversionAtTemp(temp);
      let prob = actualConversion * 0.8; // REDUCED: Less burst-like spawning
      prob = Math.min(prob, 0.4); // REDUCED: Lower cap for smoother flow
      
      // ADDED: Only spawn particles every few frames to reduce bursts
      if (random() < prob && actualConversion > 0 && frameCount % 8 === 0) {
        condenserPathParticles.push({
          x: 90,
          y: 19.5,
          vx: random(0.6, 1.0), // REDUCED: Slower initial speed
          vy: 0,
          r: random(1.2, 1.8), // REDUCED: Slightly smaller particles
          alpha: 220,
          color: color(100, 180, 255),
          phase: "horizontal",
          hasEnteredChamber: false,
          drift: random(-0.08, 0.08), // INCREASED: More spreading potential
          expansion: 0.005, // REDUCED: Slower expansion
          settleTime: 0, // NEW: Track time in chamber for settling
          spreadRadius: random(2, 4) // *** UPDATED: Smaller spread for compact condenser (was 3-8)
        });
        
        // Coordinated logging with evaporator debug system
        if (frameCount % 120 === 0) { // Every 2 seconds
          console.log(`✅ Reactor products: ${temp}°C, ${(actualConversion*100).toFixed(1)}% conversion`);
        }
      }
    }
  }

  // CHEMISTRY-BASED EXHAUST FLOW - only when actually reacting
  if (evaporatorProducingVapor && 
      reactorActuallyReacting && 
      window.valveState === "toexhaust") {

    
    
    if (exhaustParticles.length < 15) {
      const actualConversion = getConversionAtTemp(temp);
      let prob = actualConversion * 1.2; // Scale for visual effect
      
      if (random() < prob && actualConversion > 0) {
        exhaustParticles.push({
          x: 90,
          y: 19.5,
          r: random(2, 3),
          dx: random(0.5, 0.9),
          alpha: 220,
          color: color(255, 255, 0),
          hasExitedPipe: false,
          drift: random(-0.05, 0.05)
        });
      }
    }
  }

  // REACTOR INTERNAL PARTICLES - coordinated with evaporator's bubble system
  if (evaporatorProducingVapor && reactorVaporParticles.length < 15) {
    const actualConversion = reactorActuallyReacting ? getConversionAtTemp(temp) : 0;
    let prob = 0.3 + (actualConversion * 0.5); // Base mixing + reaction boost
    
    if (random() < prob) {
      reactorVaporParticles.push({
        x: left + 2,
        y: (top + bottom) / 2,
        vx: random(0.5, 1),
        vy: random(-0.5, 0.5),
        r: random(1.0, 1.6),
        alpha: 255,
        wallTouchTime: null
      });
    }
  }

  // WARNING SYSTEM - coordinated with evaporator's phase logging
  if (evaporatorProducingVapor && !reactorActuallyReacting) {
    if (frameCount % 300 === 0) { // Every 5 seconds
      console.warn(`⚠️ Unreacted n-propanol vapor at ${temp}°C - no conversion happening`);
    }
  }

  // Update internal reactor particles with temperature-dependent behavior
  for (let i = reactorVaporParticles.length - 1; i >= 0; i--) {
    let p = reactorVaporParticles[i];

    // Temperature-dependent particle behavior - more realistic physics
    if (temp < 290) {
      p.vx += random(-0.001, 0.001);
      p.vy += random(-0.001, 0.001);
      p.vx *= 0.95; // Damping when cold
      p.vy *= 0.95;
    } else if (temp < 300) {
      p.vx += random(-0.005, 0.005);
      p.vy += random(-0.005, 0.005);
    } else if (temp < 330) {
      p.vx += random(-0.1, 0.1);
      p.vy += random(-0.1, 0.1);
    } else {
      p.vx += random(-0.25, 0.25);
      p.vy += random(-0.25, 0.25);
    }

    p.x += p.vx;
    p.y += p.vy;

    // Wall collisions
    if (p.x <= left || p.x >= right) {
      p.vx *= -1;
      p.x = constrain(p.x, left, right);
      if (!p.wallTouchTime) p.wallTouchTime = millis();
    }
    if (p.y <= top || p.y >= bottom) {
      p.vy *= -1;
      p.y = constrain(p.y, top, bottom);
      if (!p.wallTouchTime) p.wallTouchTime = millis();
    }

    // Particle fade logic - temperature dependent
    if (temp < 290) {
      p.alpha -= 4.0; // Fast fade when no reaction
    } else if (p.wallTouchTime && millis() - p.wallTouchTime > 2000) {
      p.alpha -= 1.5; // Slower fade during reaction
    }

    noStroke();
    fill(100, 180, 255, p.alpha);
    ellipse(p.x, p.y, p.r);

    if (p.alpha <= 0) {
      reactorVaporParticles.splice(i, 1);
    }
  }
}

// INTEGRATED: Enhanced condenser movement with spreading and settling - UPDATED FOR SMALLER CONDENSER
export function updateCondenserParticlesBezier() {
  const valveX = 104;
  const valveY = 19.5;
  const condenserTopY = 38;
  
  // *** UPDATED: Coordinates for smaller condenser (12×25 at x=94, y=28) ***
  const condenserCenterX = 100; // UPDATED: 94 + 12/2 = 100 (was 104)
  const condenserLeft = 94;     // UPDATED: Left edge of condenser
  const condenserRight = 106;   // UPDATED: Right edge (94 + 12 = 106)
  const condenserBottom = 53;   // UPDATED: Bottom edge (28 + 25 = 53, was 60)

  for (let i = condenserPathParticles.length - 1; i >= 0; i--) {
    const p = condenserPathParticles[i];
    
    if (p.phase === "horizontal") {
      // Moving from reactor to valve
      p.x += p.vx;
      if (p.x >= valveX) {
        p.phase = "vertical";
        p.vx = 0;
        p.vy = random(0.3, 0.6); // REDUCED: Slower entry into condenser
      }
      
    } else if (p.phase === "vertical") {
      // Dropping down into condenser
      p.y += p.vy;
      if (p.y >= condenserTopY) {
        p.phase = "spreading";
        p.vy = random(0.1, 0.2); // REDUCED: Much slower vertical movement
        p.settleTime = 0; // Start timing in condenser
      }
      
    } else if (p.phase === "spreading") {
      // SPREAD OUT HORIZONTALLY in condenser chamber - UPDATED BOUNDS
      p.settleTime++;
      
      // Gentle horizontal spreading from center
      const spreadForce = (condenserCenterX - p.x) * 0.02;
      p.vx = -spreadForce + p.drift;
      
      // Constrain spreading within condenser bounds
      const maxSpread = p.spreadRadius;
      p.vx = constrain(p.vx, -0.3, 0.3);
      
      p.x += p.vx;
      p.y += p.vy * 0.5; // Slow downward drift
      
      // Add some random wobble for realistic vapor behavior
      p.x += random(-0.1, 0.1);
      p.y += random(-0.05, 0.05);
      
      // *** UPDATED: Keep within smaller condenser bounds ***
      p.x = constrain(p.x, condenserLeft + 1, condenserRight - 1); // 95 to 105 (tighter bounds)
      
      // Transition to settling after spreading for a while
      if (p.settleTime > 60) { // About 1 second of spreading
        p.phase = "settling";
        p.vy = random(0.08, 0.15); // Gentle settling speed
      }
      
    } else if (p.phase === "settling") {
      // GENTLE SETTLING - particles slowly fall and fade - UPDATED BOUNDS
      p.settleTime++;
      
      // Slow downward movement
      p.y += p.vy;
      
      // Gentle horizontal drift 
      p.x += p.drift * 0.3;
      p.drift *= 0.995; // Gradually reduce drift
      
      // *** UPDATED: Keep within smaller bounds ***
      p.x = constrain(p.x, condenserLeft, condenserRight); // 94 to 106 (exact condenser width)
      
      // Transition to final fading
      if (p.settleTime > 120 || p.y >= condenserBottom - 3) { // UPDATED: Use new bottom bound
        p.phase = "fading";
      }
      
    } else if (p.phase === "fading") {
      // FINAL FADE OUT - particles disappear gradually
      p.y += p.vy * 0.5; // Very slow final descent
      p.alpha -= 2.0; // SLOW fade rate
      p.r *= 0.99; // Slight shrinking as they condense
    }

    // MUCH SLOWER fade rate during spreading and settling phases
    if (p.phase === "spreading" || p.phase === "settling") {
      p.alpha -= 0.3; // Very slow fade - particles stay visible longer
      p.r += p.expansion; // Gentle expansion in condenser
    } else if (p.phase === "horizontal" || p.phase === "vertical") {
      p.alpha -= 0.5; // Slow fade during travel
    }
    
    // *** UPDATED: Remove particles when fully faded or fallen past condenser ***
    if (p.alpha <= 0 || p.y > condenserBottom + 2) { // UPDATED: Use new bottom bound
      condenserPathParticles.splice(i, 1);
      // Only add to condenser if reactor is actually reacting
      const temp = window.reactorTemp || 200;
      const reactorReacting = window.reactorHeaterOn && temp >= 290;
      if (reactorReacting) {
        addParticleToCondenser();
      }
      continue;
    }

    // Draw particle with phase-dependent effects
    noStroke();
    
    // Add slight transparency variation based on phase
    let drawAlpha = p.alpha;
    if (p.phase === "spreading") {
      drawAlpha *= 0.8; // Slightly more transparent while spreading
    } else if (p.phase === "settling") {
      drawAlpha *= 0.9; // Slightly more transparent while settling
    }
    
    fill(100, 180, 255, drawAlpha);
    ellipse(p.x, p.y, p.r);
  }
}

// INTEGRATED: Exhaust system coordinated with valve state
export function updateExhaustParticles() {
  for (let i = exhaustParticles.length - 1; i >= 0; i--) {
    const p = exhaustParticles[i];
    
    if (!p.hasExitedPipe) {
      p.x += p.dx;
      if (p.x >= 114) {
        p.hasExitedPipe = true;
      }
    } else {
      p.x += p.dx;
      p.y += p.drift;
      p.r += 0.01;
    }
    
    p.alpha -= 1.5;
    p.r += 0.01;
    
    if (p.alpha <= 0 || p.x > 200) {
      exhaustParticles.splice(i, 1);
    }
  }
}

export function drawExhaustParticles() {
  noStroke();
  for (const p of exhaustParticles) {
    let r = red(p.color);
    let g = green(p.color);
    let b = blue(p.color);
    
    fill(r, g, b, p.alpha);
    ellipse(p.x, p.y, p.r);
  }
}

export function updateCondenserParticles() {
  for (let i = condenserParticles.length - 1; i >= 0; i--) {
    let p = condenserParticles[i];

    p.x += p.vx;
    p.y += p.vy;

    fill(100, 180, 255, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.r);

    if (p.x > 185 && p.y > 45) {
      condenserParticles.splice(i, 1);
    }
  }
}

// NEW: Get detailed reaction status - chemistry integration
export function getReactionStatus(temp) {
  const reactorActuallyReacting = window.reactorHeaterOn && temp >= 290;
  
  if (!window.reactorHeaterOn) {
    return {
      reacting: false,
      conversion: 0,
      status: "Reactor heater OFF - no reaction possible",
      details: "Turn on reactor heater to enable reactions"
    };
  }
  
  if (temp < 290) {
    return {
      reacting: false,
      conversion: 0,
      status: `Temperature too low (${temp}°C) - no reaction below 290°C`,
      details: "Increase temperature to at least 290°C for reaction"
    };
  }
  
  const conversion = getConversionAtTemp(temp);
  const materialBalance = calculateMaterialBalance(temp);
  
  return {
    reacting: true,
    conversion: conversion,
    status: `Reacting at ${temp}°C with ${(conversion*100).toFixed(1)}% conversion`,
    details: {
      gasFlow: materialBalance.gasFlowRate_mL_s,
      liquidProduction: materialBalance.liquidVolume_mL,
      propanalYield: materialBalance.yields?.propanalYield || 0,
      propyleneYield: materialBalance.yields?.propyleneYield || 0
    }
  };
}

// NEW: Get current reactor operating conditions for debugging
export function getReactorConditions() {
  const temp = window.reactorTemp || 200;
  const reactionStatus = getReactionStatus(temp);
  
  return {
    temperature: temp,
    heaterOn: window.reactorHeaterOn,
    reactionStatus: reactionStatus,
    particleCounts: {
      internal: reactorVaporParticles.length,
      toCondenser: condenserPathParticles.length,
      toExhaust: exhaustParticles.length
    },
    valvePosition: window.valveState || "neutral",
    coordinatedWithEvaporator: {
      liquidMovementActive: window.liquidMovementStartTime !== null,
      evaporatorHeaterOn: window.evaporatorHeaterOn
    }
  };
}

// INTEGRATED: Reset function coordinated with evaporator reset
export function resetReactor() {
  // Reset heater state
  window.reactorHeaterOn = false;
  
  // Reset visual effects
  coilGlowValue = 120; // Steel gray
  
  // Reset particle arrays
  reactorVaporParticles = [];
  exhaustParticles = [];
  condenserParticles = [];
  condenserPathParticles = [];
  
  console.log("Reactor reset complete - coordinated with evaporator");
}