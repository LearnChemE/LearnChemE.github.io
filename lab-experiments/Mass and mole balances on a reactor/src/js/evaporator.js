// js/evaporator.js
// import { random, pow } from "p5";


let steamParticles = [];
let pumpPower = false;
let valveOpen = false; // Track valve state
let evaporatorFluidLevel = 0.0; // 0.0 to 0.5 max
let tubeFlowLevel = 0;  // range: 0 to 1.0 (100% of the tube)
let beakerFluidLevel = 0.75; // Add this new variable



let heaterOn = false;
let heaterColor = 120; // initial gray
let heaterColorTarget = 120; // target value
let heaterTimer = null;


let bubbles = [];
const maxBubbles = 20;
let boilingStartTime = null;
let liquidMovementStartTime = null; // Add this new variable


let vaporParticles = [];
const maxVaporParticles = 10;



export function drawBeaker(x = 20, y = 50, fluidHeight = beakerFluidLevel) {
  const width = 20;
  const height = 25;
  const wall = 2;
  const innerX = wall;
  const innerW = width - 2 * wall;
  const fluidLevel = height * beakerFluidLevel;

  push();
  translate(x, y);

  // Beaker outline (open top)
  stroke(180);
  strokeWeight(1);
  noFill();
  // Left wall
  line(0, 0, 0, height);
  // Bottom
  line(0, height, width, height);
  // Right wall
  line(width, 0, width, height);
  // Shorter and lower lips
  line(-2, 0, 0, 0);                // left lip
  line(width + 2, 0, width, 0);    // right lip

  // Fluid
  // Fill dimensions
  const fluidX = wall - 1.5; // start just after left wall
  const fluidY = height - fluidLevel - wall +1.5; // stay above bottom line
  const fluidW = width - 2 * wall + 3; // fit between walls
  const fluidH = fluidLevel;

  fill(30, 100, 255, 200); // blue color
  noStroke();
  rect(fluidX, fluidY, fluidW, fluidH);

  // FLOW LOGIC - UPDATED
  if (shouldLiquidFlow() && tubeFlowLevel < 1.0) {
    tubeFlowLevel += 0.01; // liquid flows up
  } else if (!shouldLiquidFlow() && tubeFlowLevel > 0) {
    tubeFlowLevel -= 0.02; // liquid drains back down when pump/valve stops
    tubeFlowLevel = Math.max(0, tubeFlowLevel); // Don't go below 0
  }

       // Example: Ethanol Tank
    fill(255, 99, 71);
    textAlign(CENTER, CENTER);
    textFont('Arial');
    textSize(2.5); 
    rect(100, 150, 80, 150); // Replace with your tank
    fill(0);
  
    text("Ethanol Tank", 10, 28); // Label centered below the tank
  // Graduation lines + labels
  const steps = 5; // for 200, 400, ..., 1000
  const maxValue = 1000;
  const markSpacing = (height - 2 * wall) / steps;
  const startY = height - wall + 2.5;

  stroke(20);
  strokeWeight(0.1);
  fill(0);
  textSize(2);
  textAlign(LEFT, CENTER);

  for (let i = 1; i <= steps; i++) {
    const yMark = startY - i * markSpacing;
    const value = i * (maxValue / steps);

    // Draw line
    line(wall + 3, yMark , wall + 10, yMark );

    // Draw text
    text(value , wall + 10, yMark);

 
  }

  // Draw 'mL' label at top right
  textAlign(LEFT, BOTTOM);
  text("mL", width - 6, wall + 1);

  // Tube (no valve inside anymore)
  let tubeWidth = 2.5;
  let tubeHeight = height+25;
  let tubeX = width / 2 - tubeWidth / 2 - 7;

  fill(130, 130, 130, 80); // darker transparent gray
  noStroke();
  rect(tubeX, -26, tubeWidth, tubeHeight, 0);

    // FLOW LOGIC
  if (shouldLiquidFlow() && tubeFlowLevel < 1.0) {
    tubeFlowLevel += 0.01; // adjust speed if needed
  }

  // LIQUID FLOW VISUAL
  const flowHeight = tubeHeight * tubeFlowLevel;
  fill(30, 100, 255, 200); // blue fill
  rect(tubeX, -26 + tubeHeight - flowHeight, tubeWidth, flowHeight);

  // Rubber stopper at the bottom of the tube
  fill(0, 0, 0, 100); // transparent black
  noStroke();

  // center it at the same x as tube
  let rubberWidth = tubeWidth + 1;
  let rubberHeight = 4;
  let rubberX = tubeX -0.5 ;
  let rubberY = height - wall - rubberHeight + 1.5;

  rect(rubberX, rubberY, rubberWidth, rubberHeight, 3); // rounded corners

  pop();
}

// Store switch and valve coordinates for click detection
let switchCoords = { x: 60, y: 100 };
let valveCoords = { x: 0, y: 0 };

// Main function: draw pump, valve, and switch at separate positions
export function drawPumpAndSwitch(pumpX = 60, pumpY = 50, switchX = 60, switchY = 100) {
  // Update stored coordinates
  switchCoords.x = switchX;
  switchCoords.y = switchY;
  
  // Valve is positioned relative to pump (the black circle you see)
  const valveX = pumpX;
  const valveY = pumpY + 15; // Position valve below pump
  valveCoords.x = valveX;
  valveCoords.y = valveY;
  
  // drawPumpBody(pumpX, pumpY);
  stroke(0);
  drawValve(valveX, valveY);
  drawPumpPowerSwitch(switchX, switchY);

    // Example: Pump
  fill(60);
  
  ellipse(300, 200, 70, 70); // Replace with your pump
  fill(0);
  text("Pump Switch", 12, 101); // Label below the pump
}



// NEW: Draw the valve (the black circular thing connected to pump)
function drawValve(x, y) {
  push();
  translate(x, y);

  const flowing = pumpPower && valveOpen;

  // === Valve base (always visible)
  fill(100, 180, 255);  // blue base
  noStroke();
  ellipse(0, 0, 8, 8);  // Slightly smaller than 3-way valve

  // === Rotating handle
  push();
  rotate(valveOpen ? radians(180) : radians(90));  // Upright if open, flat if closed
  fill(135, 206, 250);  // lighter handle
  rectMode(CENTER);
  rect(0, 0, 1.5, 8, 2);  // narrow rounded handle
  pop();

  pop();

  // === Dynamic label above valve
  fill(0);
  noStroke();
  textSize(2.5);
  textAlign(CENTER, CENTER);
  const label = valveOpen ? "open" : "closed";
  text(label, x+ 10, y +2);  // slightly above the valve
  text("valve", x + 10, y-1); // slightly below the valve
}


function drawPumpPowerSwitch(x, y) {
  const boxW = 15, boxH = 8;
  const leverOffset = pumpPower ? 12 : -12;

  push();
  translate(x, y);

  // Curved wire
  stroke(90);
  noFill();
  strokeWeight(1);
  bezier(18, 18, 4, 32, 10, 20, 3, 30);

  // Switch box
  fill(60);
  stroke(0);
  rect(-boxW / 2, 30, boxW, boxH, 5);

  // === Lever
  push();
  translate(0, 30); // origin is center of the switch box
  rotate(radians(pumpPower ? 30 : -30)); // flip depending on state
  stroke(0);
  strokeWeight(1);
  line(0, 0, 0, -5); // draw lever upwards
  pop();

  // Labels
  fill(255);
  noStroke();
  textSize(2.5);
  textAlign(CENTER, CENTER);
  text("OFF", -boxW / 4, 34);
  text("ON", boxW / 4, 34);



  pop();
}

// Call this in mousePressed - FIXED VERSION
export function togglePumpPower(mx, my) {
  const sx = switchCoords.x;
  const sy = switchCoords.y;
  const boxW = 15;
  const boxH = 8;
  
  const switchBoxX = sx - boxW / 2;
  const switchBoxY = sy + 30;
  
  if (mx >= switchBoxX && mx <= switchBoxX + boxW && 
      my >= switchBoxY && my <= switchBoxY + boxH) {
    pumpPower = !pumpPower;
    
    // ADD THIS: Auto-close valve when pump is turned off
    if (!pumpPower) {
      valveOpen = false;
      console.log("Pump turned OFF - Valve automatically CLOSED");
    } else {
      console.log("Pump turned ON");
    }
    
    return true;
  }
  return false;
}

/// NEW FUNCTION: Toggle valve state when clicked (now uses the black circular valve)
export function toggleValve(mx, my) {
  const vx = valveCoords.x;
  const vy = valveCoords.y;
  const clickRadius = 6; // Clickable area around valve
  
  // Check if click is within valve area
  const distance = Math.sqrt((mx - vx) ** 2 + (my - vy) ** 2);
  if (distance <= clickRadius) {
    valveOpen = !valveOpen;
    console.log("Valve:", valveOpen ? "OPENED" : "CLOSED");
    return true;
  }
  return false;
}

// Function to check if liquid should flow (both pump on AND valve open)
export function shouldLiquidFlow() {
  return pumpPower && valveOpen;
}

// Getter functions for states
export function isPumpOn() {
  return pumpPower;
}

export function isValveOpen() {
  return valveOpen;
}



export function drawEvaporatorBody(x = 100, y = 50, reactorX = 150) {
  push();
  translate(x, y);

  const bodyHeight = 30;
  const bodyWidth = 20;
  const borderRadius = 10;
  const wallThickness = 1.5;


 // Vertical pipe going upward from the top center
  const outletCenterX = bodyWidth / 2;
  const outletTopY = 0; // top of evaporator

  // fill(200);           // same color as pipe
  // noStroke();          // remove border
  // rect(outletCenterX - 1, outletTopY - 6, 2, 6);  // width 2, height 6 // Adjust -25 as needed
  
  // Vertical pipe from evaporator
  // fill(200);
  // noStroke();
  

  // Horizontal elbow extension (goes right)
  
  let elbowLength = reactorX - (x + outletCenterX);
  // rect(outletCenterX - 1, outletTopY - 8, 2, 6);  // vertical segment
  // rect(outletCenterX - 1, outletTopY - 9, elbowLength, 2);
  fill(200, 200, 200, 200); // light gray, with alpha (100/255 ~ 40% opacity)
  noStroke();

  rect(outletCenterX -1, outletTopY - 11.5, 2.5, 12.8);  // vertical segment
  rect(outletCenterX -1, outletTopY - 14, elbowLength, 2.5);


  // // Optional label
  // noStroke();
  // fill(0);
  // textSize(3);
  // textAlign(CENTER, BOTTOM);
  // text("Ethanol Vapor Out", outletCenterX, outletTopY - 28);


  
  if (shouldLiquidFlow() && tubeFlowLevel >= 1.0 && evaporatorFluidLevel < 0.7) {
    evaporatorFluidLevel += 0.0015;
        // ADD THIS: Reduce beaker fluid as evaporator fills
    if (beakerFluidLevel > 0) {
      beakerFluidLevel -= 0.001; // Adjust this rate as needed
      beakerFluidLevel = Math.max(0, beakerFluidLevel); // Don't go below 0
    }
  }

  // Draw liquid using clipping
  if (evaporatorFluidLevel > 0) {
    push();
    
    // Create clipping path for the inner container shape
    drawingContext.save();
    drawingContext.beginPath();
    
    // Create a rounded rectangle path for clipping (inner bounds)
    const innerX = wallThickness * 0.3; // Reduce gap from walls
    const innerY = wallThickness * 0.3 ;
    const innerW = bodyWidth - wallThickness * 0.6; // Less margin
    const innerH = bodyHeight - wallThickness * 0.6;
    const innerRadius = borderRadius - wallThickness * 0.8; // Keep some curve
    
    // Manual rounded rectangle path
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
    
    // Now draw the liquid - it will only appear inside the clipped area
    const fillHeight = (bodyHeight - wallThickness * 1.4) * evaporatorFluidLevel;
    fill(30, 100, 255, 180);
    noStroke();
    const baseY = bodyHeight - fillHeight;

    if (boilingStartTime && millis() - boilingStartTime > 3000) {
      // === Draw waving liquid surface ===
      beginShape();
      for (let i = 0; i <= innerW; i++) {
        const x = innerX + i;
        const y = baseY + sin((frameCount + i) * 0.1) * 1.2;
        vertex(x, y);
      }
      vertex(innerX + innerW, bodyHeight);
      vertex(innerX, bodyHeight);
      endShape(CLOSE);
    } else {
      // === Normal liquid rectangle ===
      rect(innerX, baseY, innerW, fillHeight);
    }

    
    drawingContext.restore();

  // === IMPROVED BUBBLING LOGIC WITH PROPER DELAYS ===
  if (evaporatorFluidLevel > 0.1 && heaterOn) {
    // Start boiling timer if not already started
    if (!boilingStartTime) boilingStartTime = millis();
    
    const heatingTime = millis() - boilingStartTime;
    
    // Only start bubbles after heater has been red for 2 seconds (total 5 seconds)
    if (heatingTime > 5000) {
      // Add bubbles more frequently but gradually
      if (bubbles.length < maxBubbles && frameCount % 6 === 0) { // Slower bubble generation
        bubbles.push({
          x: random(8,12),
          y: -8 + 35 - Math.pow(Math.random(), 2) * (35 * evaporatorFluidLevel),
          r: random(1, 2.5),
          speed: random(0.15, 0.15),
          floating: false,
          evaporated: false,
          alpha: 150
        });
      }
    }

    // Only start liquid movement after bubbles have been going for 3 seconds (total 8 seconds)
    if (heatingTime > 6500) {
      if (!liquidMovementStartTime) liquidMovementStartTime = millis();
    }

    // Draw bubbles only if they should exist
    if (heatingTime > 5000) {
        fill(100, 180, 255, 150);  // pale blue
        noStroke();

        const fluidTopY = -10 + 35 * (1 - evaporatorFluidLevel); // <== move this here


     
      for (let i = bubbles.length - 1; i >= 0; i--) {
        let b = bubbles[i];

        // Move up until it floats
        if (!b.floating) {
          b.y -= b.speed;
          if (b.y <= fluidTopY + 2) {
            b.y = fluidTopY + 2;
            b.floating = true;
            b.speed = 0;
          }
        }

        // Fade out after floating
        if (b.floating) {
          b.alpha -= 5;
          if (b.alpha <= 0) {
            bubbles.splice(i, 1); // Remove when faded
            continue;
          }
        }

        // Draw with fading transparency
        fill(100, 180, 255, b.alpha);
        noStroke();
        ellipse(b.x, b.y, b.r * 2);
      }

    }
  } else {
    // Clear everything when heater is off
    boilingStartTime = null;
    liquidMovementStartTime = null;
    bubbles = [];
  }



  // === VAPOR PARTICLE ANIMATION ===
if (
  heaterOn &&
  evaporatorFluidLevel > 0.1 &&
  boilingStartTime &&
  millis() - boilingStartTime > 7000 &&   // 3s delay after bubbling
  frameCount % 4 === 0 &&
  vaporParticles.length < maxVaporParticles
) {
vaporParticles.push({
    x: outletCenterX,
    y: outletTopY - 2,
    stage: 'vertical',
    alpha: 180,
    speed: random(0.5, 0.8),
    r: random(1.2, 2.0)
  });
}

// Draw vapor particles
for (let i = vaporParticles.length - 1; i >= 0; i--) {
  let p = vaporParticles[i];
  fill(100, 180, 255, p.alpha);
  noStroke();
  ellipse(p.x, p.y, p.r);

  if (p.stage === 'vertical') {
    p.y -= p.speed;
    p.x = outletCenterX;  // Keep centered in pipe
    if (p.y <= outletTopY - 12.2) {
      p.y = outletTopY - 12.2;
      p.stage = 'horizontal';
    }
  } else if (p.stage === 'horizontal') {
    p.x += p.speed;
    p.y = outletTopY - 12.5;  // Lock into horizontal pipe band
  }

  // Remove after exiting pipe
  if (p.x > outletCenterX + elbowLength + 2) {
    vaporParticles.splice(i, 1);
  }
}



    pop();
  }
  
  // Draw the glass container walls on top
  stroke(180);
  strokeWeight(1.5);
  fill(255, 255, 255, 50);
  rect(0, 0, bodyWidth, bodyHeight, borderRadius);


  // ADD THIS: Draw tube connection inside evaporator
  const tubeWidth = 2.5;
  const tubeInsideHeight = 8; // How much tube shows inside
  const tubeX = -tubeWidth / 2; // Center it horizontally
  const tubeY = bodyHeight - tubeInsideHeight; // Start from bottom
  
  fill(130, 130, 130, 120); // Semi-transparent gray tube
  noStroke();
  rect(tubeX +10, tubeY + 7, tubeWidth, tubeInsideHeight -6.1);
  
  // Show liquid in the tube inside evaporator if flowing
  if (shouldLiquidFlow() && tubeFlowLevel >= 1.0) {
    fill(30, 100, 255, 200); // Blue liquid
    rect(tubeX +10, tubeY + 7, tubeWidth, tubeInsideHeight -6.1);
  }

  // === FULL HEATER COIL AROUND EVAPORATOR WITH ENDS ===
  push();
  translate(0, 15); // Center the coil around evaporator

  stroke(heaterColor);
  strokeWeight(0.8);
  noFill();

  let turns = 4;
  let spacing = 2;
  let coilRadius = bodyWidth + 5;
  let centerX = bodyWidth / 2;

  for (let i = 0; i < turns; i++) {
    let y = i * spacing + 4;
    // Full spiral (wrap around both sides)
    arc(centerX, y, coilRadius, spacing, 0, TWO_PI);
  }

  window.liquidMovementStartTime = liquidMovementStartTime;


  pop();

  pop();
}


export function drawHeaterSwitch(x = 100, y = 100) {
  const w = 15;
  const h = 8;

  push();
  translate(x, y);

  // Switch Box
  fill(60);
  stroke(0);
  rect(-w / 2, 0, w, h, 4);

    // Curved wire
  stroke(120);
  noFill();
  strokeWeight(0.8);
    // Upper wire: from top center to top of evaporator
  bezier(0, 0, -3, -4, 5, -16, 10, -13);

  // Lower wire: from bottom center to bottom of evaporator
  bezier(0, 0, -3, -4, 5, -2, 9, -7);

  
  
  // Lever
  push();
  translate(0, 0);
  rotate(radians(heaterOn ? 30 : -30));
  stroke(10);
  strokeWeight(1);
  line(0, 0, 0, -4);
  pop();

  // === Labels ===
  fill(255);
  noStroke();
  textSize(2.5); // Make it more readable
  textAlign(CENTER, CENTER);

  // Place OFF to the left of switch box
  text("OFF", -w / 2 + 4, h / 2);

  // Place ON to the right of switch box
  text("ON", w / 2 -4, h / 2);

  // Example: Heater
  fill(255, 99, 71);
  rect(500, 300, 60, 100); // Replace with your heater
  fill(0);
  text("Heater Switch", 0, 11); // Label below the heater


  pop();
}


export function toggleHeater(mx, my) {
  const x = 12, y = 65; // Position of the switch
  const boxW = 15;
  const boxH = 8;

  const boxX = x - boxW / 2;
  const boxY = y;

  if (mx >= boxX && mx <= boxX + boxW &&
      my >= boxY && my <= boxY + boxH) {

    heaterOn = !heaterOn;

    if (heaterOn) {
      if (heaterTimer) clearTimeout(heaterTimer);
      heaterTimer = setTimeout(() => {
        heaterColor = color(200, 50, 0); // Red-orange
      }, 600); // Delay in ms
    } else {
      heaterColor = 120; // Gray
      if (heaterTimer) clearTimeout(heaterTimer);
    }

    return true;
  }

  return false;
}
