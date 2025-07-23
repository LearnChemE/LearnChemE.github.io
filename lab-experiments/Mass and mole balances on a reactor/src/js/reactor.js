import { addParticleToCondenser } from './condenser.js';

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

// Timing variables for exhaust particle control
let heaterTurnOnTime = null;
let firstExhaustBurstActive = false;
let secondExhaustBurstActive = false;
let secondExhaustStartTime = null;

let tempAbove290Time = null;
const CONDENSER_DELAY_MS = 1000;


// Add these new variables for valve switching detection
let previousValveState = "toexhaust";
let valveSwitchTime = null;
let switchTriggeredBurst = false;
const SWITCH_BURST_DURATION = 2000; // 2 seconds of particles after switching

export function updateCoilGlow() {
  let target = reactorHeaterOn ? 255 : 120;  // glow vs steel
  coilGlowValue = lerp(coilGlowValue, target, 0.05);  // smooth transition
}

export function drawReactorBody(temp) {
  push();
  translate(reactorX, reactorY);

  // Reactor Body
  stroke(100);
  strokeWeight(1.2);
  fill(220);
  rect(0, 0, reactorHeight, reactorWidth, 10); // horizontal reactor

  // Vertical Spiral Coil (rotated evaporator-style arcs)
  let turns = 4;
  let spacing = 4;
  let coilWidth = 6;
  let startX = 14;

  // Fix color logic - Orange at 300°C, Reddish Orange at 330°C+
  let coilColor;
  
  if (temp >= 329) {
    coilColor = color(255, 69 , 0); // Reddish Orange
  } else if (temp >= 201 && temp < 329) {
    coilColor = color(255, 165 , 0); // Orange
  } else {
    coilColor = color(140); // Grey
  }
  
  console.log("Temp:", temp, "Color:", coilColor.toString());
  
  stroke(coilColor);
  strokeWeight(1);
  noFill();

  for (let i = 0; i < turns; i++) {
    let x = startX + i * spacing;
    let y = reactorWidth / 2;
    arc(x, y, coilWidth, reactorWidth + 2, HALF_PI, -HALF_PI, OPEN);
  }

  // Entry wire from bottom of first coil
  let entryX = startX - 4;
  let entryY = reactorWidth / 2 - (reactorWidth + 2) / 2;

  let jointX = reactorHeight / 3 ; // Center-ish below reactor
  let jointY = reactorWidth + 8;

  bezier(entryX, entryY,
         entryX - 2 , entryY + 4,
         jointX - 8, jointY - 3,
         jointX + 3, jointY  -2.5);

  // Exit wire from bottom of last coil
  let exitX = startX + (turns - 1) * spacing + 3 ;
  let exitY = reactorWidth / 2 + (reactorWidth + 2) / 2 ;

  bezier(exitX, exitY,
         exitX , exitY + 3,
         jointX + 3, jointY - 5,
         jointX, jointY  +1 );

  pop();
}

// Draw Heater Switch for Reactor
export function drawReactorHeaterSwitch(x = 120, y = 60) {
  const w = 15; // width of switch
  const h = 8; // height of switch
  const isOn = window.reactorHeaterOn;  // use global state instead of local

  push();
  translate(x, y);

    // Lever
  push();
  translate(0, 0); // move to center of switch for better pivot point
  rotate(radians(isOn ? 30 : -30));
  stroke(0);
  strokeWeight(1); // Made slightly thicker for better visibility
  line(0, 0, 0, -4);  // vertical lever line
  pop();

  // Switch Body
  stroke(0);
  strokeWeight(0);
  fill(60);
  rect(-w / 2, 0, w, h, 4); // rounded box



  // Text Labels
  noStroke();
  fill(255);
  textSize(2.5);
  textAlign(CENTER, CENTER);
  text("OFF", -w / 4, h / 2);
  text("ON", w / 4, h / 2);

  fill(0); // Black text for the label
  text("reactor switch", 0, h + 3); // Label below the switch
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
    
    console.log("Switch clicked! Heater state:", window.reactorHeaterOn); // Debug
    
    // Record heater turn-on time and reset exhaust timing
    if (window.reactorHeaterOn) {
      heaterTurnOnTime = millis();
      firstExhaustBurstActive = false;
      secondExhaustBurstActive = false;
      secondExhaustStartTime = null;
      console.log("Heater turned ON - Starting exhaust timing sequence");
    } else {
      // Reset all timing when heater turns off
      heaterTurnOnTime = null;
      firstExhaustBurstActive = false;
      secondExhaustBurstActive = false;
      secondExhaustStartTime = null;
      console.log("Heater turned OFF - Resetting exhaust timing");
    }
    
    // Reset slider when heater turns OFF
    if (!window.reactorHeaterOn && window.tempSlider && window.tempValueSpan) {
      window.tempSlider.value = 200;
      window.tempValueSpan.textContent = `200°C`;
      window.targetTemp = 200; // Also reset target immediately
      console.log("Heater turned OFF - Slider reset to 200"); // Debug
    }
    
    return true;
  }
  return false;
}

export function updateReactorVaporParticles(temp) {
  const vaporDelayReached =
    window.liquidMovementStartTime &&
    millis() - window.liquidMovementStartTime > 1000;

  const left = reactorX + 2;
  const right = reactorX + reactorHeight - 2;
  const top = reactorY + 2;
  const bottom = reactorY + reactorWidth - 2;

  // Only spawn condenser particles if reactor hot, valve is open, and cooling is ON
  if (
    vaporDelayReached &&
    window.reactorHeaterOn &&
    temp >= 290 &&
    tempAbove290Time !== null &&
    millis() - tempAbove290Time >= CONDENSER_DELAY_MS &&
    window.valveState === "tocondenser" &&
    window.condenserCoolingOn && // extra condition
    condenserPathParticles.length < 20 &&
    frameCount % 10 === 0
  ) {
    spawnCondenserParticle();
  }

  // Spawn reactor vapor particles (bouncing inside reactor)
  if (
    vaporDelayReached &&
    window.reactorHeaterOn &&
    reactorVaporParticles.length < maxReactorVapors &&
    frameCount % 10 === 0
  ) {
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

  // Update reactor vapor particles
  for (let i = reactorVaporParticles.length - 1; i >= 0; i--) {
    let p = reactorVaporParticles[i];

    // Movement and fading logic
    if (temp < 300) {
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

    if (p.wallTouchTime && millis() - p.wallTouchTime > 2000) {
      p.alpha -= 1.5;
    }

    noStroke();
    fill(100, 180, 255, p.alpha);
    ellipse(p.x, p.y, p.r);

    if (p.alpha <= 0) {
      reactorVaporParticles.splice(i, 1);
    }

    // Track when temp exceeds 290 for the first time
    if (temp >= 290 && tempAbove290Time === null) {
      tempAbove290Time = millis();
    }

    // Reset if temp drops
    if (temp < 290) {
      tempAbove290Time = null;
    }
  }
}

export function updateCondenserParticlesBezier() {
  const p0 = { x: 90, y: 20  };   // reactor outlet (right side)
  const p1 = { x: 108, y: 17  };  // valve center (horizontal elbow)
  const p2 = { x: 104, y: 30 -5};    // drop to condenser inlet
  const p3 = { x: 104, y: 28 + 20 };    // same as p2 for sharp corner

  for (let i = condenserPathParticles.length - 1; i >= 0; i--) {
    const p = condenserPathParticles[i];
    p.t += 0.015; // speed of particle

    if (p.t > 1) {
      // When particle reaches end of path, add it to condenser
      condenserPathParticles.splice(i, 1);
      addParticleToCondenser(); // This will add particle to condenser's internal system
      continue;
    }

    const x = bezierPoint(p0.x, p1.x, p2.x, p3.x, p.t);
    const y = bezierPoint(p0.y, p1.y, p2.y, p3.y, p.t);

    fill(100, 180, 255, p.alpha);
    noStroke();
    ellipse(x, y, p.r);
    
    // Optional: Fade particles as they travel (makes transition smoother)
    // if (p.t > 0.8) { // Start fading when 80% of the way there
    //   p.alpha -= 3;
    // }
  }
}

export function updateExhaustParticles() {
  if (!window.reactorHeaterOn || !heaterTurnOnTime) {
    return; // No exhaust if heater is off
  }

  const currentTime = millis();
  
  // NEW: Detect valve switching to exhaust
  if (window.valveState !== previousValveState) {
    if (window.valveState === "toexhaust" && window.reactorHeaterOn) {
      // Valve just switched to exhaust while heater is on
      valveSwitchTime = currentTime;
      switchTriggeredBurst = true;
      console.log("Valve switched to exhaust - Starting exhaust burst!");
    }
    previousValveState = window.valveState;
  }

  // NEW: Handle switch-triggered burst
  let switchBurstActive = false;
  if (switchTriggeredBurst && valveSwitchTime) {
    const timeSinceSwitch = currentTime - valveSwitchTime;
    if (timeSinceSwitch <= SWITCH_BURST_DURATION) {
      switchBurstActive = true;
    } else {
      switchTriggeredBurst = false; // End the burst
      console.log("Switch-triggered exhaust burst ended");
    }
  }

  // EXISTING: Original timed bursts logic
  const timeSinceHeaterOn = currentTime - heaterTurnOnTime;
  const liquidMovementStarted = window.liquidMovementStartTime !== null;
  const timeSinceLiquidMovement = liquidMovementStarted ? 
    currentTime - window.liquidMovementStartTime : 0;

  // First burst: 1 second right when liquid movement starts
  if (liquidMovementStarted && timeSinceLiquidMovement <= 1000) {
    if (!firstExhaustBurstActive) {
      firstExhaustBurstActive = true;
      console.log("Starting FIRST exhaust burst (1 second)");
    }
  } else if (firstExhaustBurstActive && timeSinceLiquidMovement > 1000) {
    firstExhaustBurstActive = false;
    console.log("Ending FIRST exhaust burst");
  }

  // Second burst: 3 seconds starting after vapor particles appear and settle
  const secondBurstStartDelay = 3000;
  const secondBurstDuration = 3000;
  
  if (liquidMovementStarted && 
      timeSinceLiquidMovement >= secondBurstStartDelay && 
      timeSinceLiquidMovement <= secondBurstStartDelay + secondBurstDuration) {
    
    if (!secondExhaustBurstActive) {
      secondExhaustBurstActive = true;
      secondExhaustStartTime = currentTime;
      console.log("Starting SECOND exhaust burst (3 seconds)");
    }
  } else if (secondExhaustBurstActive && 
             timeSinceLiquidMovement > secondBurstStartDelay + secondBurstDuration) {
    secondExhaustBurstActive = false;
    console.log("Ending SECOND exhaust burst");
  }

  // UPDATED: Generate particles during any active burst period
  const shouldGenerateParticles = window.valveState === "toexhaust" && 
                                  (firstExhaustBurstActive || 
                                   secondExhaustBurstActive || 
                                   switchBurstActive); // NEW: Add switch burst

  if (shouldGenerateParticles) {
    if (exhaustParticles.length < maxExhaustParticles && frameCount % 4 === 0) {
      exhaustParticles.push({
        x: 90,
        y: 19.5,
        r: random(2, 3),
        dx: random(0.5, 0.9),
        alpha: 220
      });
    }
  }

  // Update existing particles
  for (let i = exhaustParticles.length - 1; i >= 0; i--) {
    const p = exhaustParticles[i];
    p.x += p.dx;
    p.alpha -= 2;
    if (p.alpha <= 0 || p.x > 200) {
      exhaustParticles.splice(i, 1);
    }
  }
}

export function drawExhaustParticles() {
  noStroke();
  for (const p of exhaustParticles) {
    fill(255, 255, 0, p.alpha);
    ellipse(p.x, p.y, p.r);
  }
}

export function updateCondenserParticles() {
  for (let i = condenserParticles.length - 1; i >= 0; i--) {
    let p = condenserParticles[i];

    // Move toward condenser (mostly right, slight down)
    p.x += p.vx;
    p.y += p.vy;

    fill(100, 180, 255, p.alpha);
    noStroke();
    ellipse(p.x, p.y, p.r);

    // Remove when particle reaches condenser
    if (p.x > 185 && p.y > 45) {
      condenserParticles.splice(i, 1);
      // Optionally: increase condenser fluid or add to condenser internal array
    }
  }
}

function spawnCondenserParticle() {
  condenserPathParticles.push({
    t: 0,       // travel progress from 0 → 1
    r: random(1.5, 2.2),
    alpha: 255
  });
}

// Reset function for reactor component
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
  
  // Reset timing variables
  heaterTurnOnTime = null;
  firstExhaustBurstActive = false;
  secondExhaustBurstActive = false;
  secondExhaustStartTime = null;
  tempAbove290Time = null;
  
  console.log("Reactor reset complete");
}