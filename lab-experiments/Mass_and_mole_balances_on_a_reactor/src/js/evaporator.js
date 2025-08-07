let steamParticles = [];
let pumpPower = false;
let valveOpen = false; // Track valve state
let evaporatorFluidLevel = 0.0; // 0.0 to 0.5 max
let tubeFlowLevel = 0;  // range: 0 to 1.0 (100% of the tube)
let beakerFluidLevel = 0.8; // Add this new variable

// Use global heater state for auto-shutdown compatibility
window.evaporatorHeaterOn = false; // Global state instead of local
let heaterColor = 120; // initial gray
let heaterColorTarget = 120; // target value
let heaterTimer = null;

let bubbles = [];
const maxBubbles = 20;
let boilingStartTime = null;
let liquidMovementStartTime = null; // Add this new variable

let vaporParticles = [];
const maxVaporParticles = 10;
let particlesFaded = 0;  // Tracks how many particles have condensed and disappeared


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
    tubeFlowLevel += 0.001; // liquid flows up
  } else if (!shouldLiquidFlow() && tubeFlowLevel > 0) {
    tubeFlowLevel -= 0.001; // liquid drains back down when pump/valve stops
    tubeFlowLevel = Math.max(0, tubeFlowLevel); // Don't go below 0
  }

       // Example: Ethanol Tank
    fill(255, 99, 71);
    textAlign(CENTER, CENTER);
    textFont('Arial');
    textSize(2.5); 
    rect(100, 150, 80, 150); // Replace with your tank
    fill(0);
  
    // text("proponal tank", 10, 28); // Label centered below the tank - COMMENTED OUT
  // Graduation lines + labels
  const steps = 5; // for 200, 400, ..., 1000
  const maxValue = 250; // CHANGED: from 500 to 250
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
    line(wall + 4, yMark , wall + 8, yMark ); // ADJUSTED: positioning

    // Draw text
    text(value , wall + 10, yMark);

 
  }

  // Draw 'mL' label at top right
  textAlign(LEFT, BOTTOM);
  text("mL", width - 4, wall + 3.4); // ADJUSTED: positioning

  // Tube (no valve inside anymore)
  let tubeWidth = 2.5;
  let tubeHeight = height+25;
  let tubeX = width / 2 - tubeWidth / 2 - 7;

  fill(130, 130, 130, 80); // darker transparent gray
  noStroke();
  rect(tubeX, -26, tubeWidth, tubeHeight, 0);

    // FLOW LOGIC
  if (shouldLiquidFlow() && tubeFlowLevel < 1.0) {
    tubeFlowLevel += 0.005; // adjust speed if needed
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
  // text("pump switch", 12, 101); // Label below the pump - COMMENTED OUT
}

// Draw the valve (the black circular thing connected to pump)
function drawValve(x, y) {
  push();
  translate(x, y);

  const flowing = pumpPower && valveOpen;

  // Valve base (always visible)
  fill(100, 180, 255);  // blue base
  noStroke();
  ellipse(0, 0, 8, 8);  // Slightly smaller than 3-way valve

  // Rotating handle
  push();
  rotate(valveOpen ? radians(180) : radians(90));  // Upright if open, flat if closed
  fill(135, 206, 250);  // lighter handle
  rectMode(CENTER);
  rect(0, 0, 1.5, 8, 2);  // narrow rounded handle
  pop();

  pop();

  // Dynamic label above valve
  fill(0);
  noStroke();
  textSize(2.5);
  textAlign(CENTER, CENTER);
  const label = valveOpen ? "open" : "closed";
  text(label, x+ 10, y +2);  // slightly above the valve
  text("valve", x + 10, y-1); // slightly below the valve
}

function drawPumpPowerSwitch(x, y) {
  const boxW = 13, boxH = 6; // CHANGED: Smaller switch box dimensions
  const leverOffset = pumpPower ? 12 : -12;

  push();
  translate(x, y);

  // // Curved wire
  // stroke(90);
  // noFill();
  // strokeWeight(1);
  // bezier(18, 18, 4, 32, 10, 20, 3, 30);

  // Lever
  push();
  translate(0, 30); // origin is center of the switch box
  rotate(radians(pumpPower ? 30 : -30)); // flip depending on state
  stroke(0);
  strokeWeight(1);
  line(0, 0, 0, -3); // ADJUSTED: draw lever upwards
  pop();

  // Switch box
  fill(60);
  noStroke();
  rect(-boxW / 2, 30, boxW, boxH, 2); // CHANGED: Using smaller dimensions



  // Labels
  fill(255);
  noStroke();
  textSize(2); // ADJUSTED: Smaller text size
  textAlign(CENTER, CENTER);
  text("OFF", -boxW / 2 + 3, 33); // ADJUSTED: positioning
  text("ON", boxW / 2 - 3, 33); // ADJUSTED: positioning

  pop();
}

// Call this in mousePressed - FIXED VERSION
export function togglePumpPower(mx, my) {
  const sx = switchCoords.x;
  const sy = switchCoords.y;
  const boxW = 13; // CHANGED: Updated to match new dimensions
  const boxH = 6; // CHANGED: Updated to match new dimensions
  
  const switchBoxX = sx - boxW / 2;
  const switchBoxY = sy + 30;
  
  if (mx >= switchBoxX && mx <= switchBoxX + boxW && 
      my >= switchBoxY && my <= switchBoxY + boxH) {
    pumpPower = !pumpPower;
    
    // Auto-close valve when pump is turned off
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

// Toggle valve state when clicked (now uses the black circular valve)
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

  const bodyHeight = 22; // CHANGED: Smaller, more compact dimensions
  const bodyWidth = 12.5; // CHANGED: Smaller, more compact dimensions
  const borderRadius = 7; // CHANGED: Smaller, more compact dimensions
  const wallThickness = 1.2; // CHANGED: Adjusted wall thickness

 // Vertical pipe going upward from the top center
  const outletCenterX = bodyWidth / 2;
  const outletTopY = 0; // top of evaporator

  // Horizontal elbow extension (goes right)
  
  let elbowLength = reactorX - (x + outletCenterX);
  fill(200, 200, 200, 200); // light gray, with alpha (100/255 ~ 40% opacity)
  noStroke();

  rect(outletCenterX -1, outletTopY - 19.5, 2.5, 20.8);  // ADJUSTED: vertical segment positioning
  rect(outletCenterX -1, outletTopY - 22, elbowLength, 2.5); // ADJUSTED: horizontal segment

  // IMPROVED FLOW SEQUENCE: Bubble-controlled draining (more realistic!)
  if (shouldLiquidFlow()) {
    // STEP 1: Fill the tube first
    if (tubeFlowLevel < 1.0) {
      tubeFlowLevel += 0.0005; // Tube fills at normal speed
    }
    
    // STEP 2: After tube is full, start filling evaporator
    if (tubeFlowLevel >= 1.0 && evaporatorFluidLevel < 0.25) {
      evaporatorFluidLevel += 0.0008;
      
      // Initial beaker draining while evaporator fills up
      if (beakerFluidLevel > 0.05) {
        beakerFluidLevel -= 0.00012;
        beakerFluidLevel = Math.max(0.05, beakerFluidLevel);
      }
    }
    
    // STEP 3: Once evaporator is full, only drain beaker when BUBBLES are actively forming
    if (tubeFlowLevel >= 1.0 && evaporatorFluidLevel >= 0.25) {
      // Check if bubbles are actively being generated (liquid is actually evaporating)
      const heatingTime = boilingStartTime ? millis() - boilingStartTime : 0;
      const bubblesActive = window.evaporatorHeaterOn && 
                          boilingStartTime && 
                          heatingTime > 5000 && 
                          bubbles.length > 0;
      
      // Only continue draining beaker if bubbles are actively forming (liquid evaporating)
      if (bubblesActive && beakerFluidLevel > 0.05) {
        beakerFluidLevel -= 0.00012; // Slower rate when bubble-controlled
        beakerFluidLevel = Math.max(0.05, beakerFluidLevel);
        
        // Maintain evaporator level (liquid is being vaporized by bubbling)
        if (evaporatorFluidLevel > 0.20) {
          evaporatorFluidLevel = 0.25; // Keep topped up as bubbles create space
        }
      }
      // If no bubbles, beaker draining pauses (no evaporation happening)
    }
  }

  // STEP 4: Tube drains when pump/valve turn off
  if (!shouldLiquidFlow() && tubeFlowLevel > 0) {
    tubeFlowLevel -= 0.001;
    tubeFlowLevel = Math.max(0, tubeFlowLevel);
  }

  // Enhanced debug logging to show flow phases with bubble status
  if (frameCount % 60 === 0 && shouldLiquidFlow()) { // Every second
    if (tubeFlowLevel < 1.0) {
      console.log(`Phase 1 - Tube filling: ${(tubeFlowLevel * 100).toFixed(1)}%`);
    } else if (evaporatorFluidLevel < 0.25) {
      console.log(`Phase 2 - Evaporator filling: ${(evaporatorFluidLevel * 100 / 0.4).toFixed(1)}%, Beaker: ${(beakerFluidLevel * 100).toFixed(1)}%`);
    } else {
      // Show bubble status instead of just heater status
      const heatingTime = boilingStartTime ? millis() - boilingStartTime : 0;
      const bubblesActive = window.evaporatorHeaterOn && 
                          boilingStartTime && 
                          heatingTime > 5000 && 
                          bubbles.length > 0;
      
      const bubbleStatus = bubblesActive ? 
        `bubbling (${bubbles.length} bubbles) - draining` : 
        window.evaporatorHeaterOn ? 
          `heating (no bubbles yet) - paused` : 
          `heater OFF - paused`;
      
      console.log(`Phase 3 - Evaporator full, ${bubbleStatus}, Beaker: ${(beakerFluidLevel * 100).toFixed(1)}%`);
    }
  }

  // Draw liquid using clipping
  if (evaporatorFluidLevel > 0) {
    push();
    
    // Create clipping path for the inner container shape
    drawingContext.save();
    drawingContext.beginPath();
    
    // FIXED: Better inner bounds to fill container properly
    const innerX = wallThickness * 0.1; // Much smaller left margin
    const innerY = wallThickness * 0.1; // Much smaller top margin  
    const innerW = bodyWidth - wallThickness * 0.2; // Fill almost full width
    const innerH = bodyHeight - wallThickness * 0.2; // Fill almost full height
    const innerRadius = borderRadius - wallThickness * 0.5; // Better radius
    
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
    
    // FIXED: Better liquid positioning
    const fillHeight = (bodyHeight - wallThickness * 0.3) * evaporatorFluidLevel;
    fill(30, 100, 255, 180);
    noStroke();
    const baseY = bodyHeight - fillHeight - wallThickness * 0.1;

    if (boilingStartTime && millis() - boilingStartTime > 3000) {
      // Draw waving liquid surface - FIXED to fill width properly
      beginShape();
      for (let i = 0; i <= innerW; i += 0.5) { // Smaller steps for smoother curves
        const x = innerX + i;
        const y = baseY + sin((frameCount + i) * 0.1) * 1.2;
        vertex(x, y);
      }
      vertex(innerX + innerW, bodyHeight - wallThickness * 0.1); // Right bottom
      vertex(innerX, bodyHeight - wallThickness * 0.1); // Left bottom
      endShape(CLOSE);
    } else {
      // Normal liquid rectangle - FIXED dimensions
      rect(innerX, baseY, innerW, fillHeight);
    }

    drawingContext.restore();

    // CORRECTED: Evaporator bubbling logic - bubbles continue as long as heater is on and liquid exists
    if (evaporatorFluidLevel > 0.01 && window.evaporatorHeaterOn) {
      // Start boiling timer if not already started
      if (!boilingStartTime) boilingStartTime = millis();
      
      const heatingTime = millis() - boilingStartTime;
      
      // Only start bubbles after heater has been red for 2 seconds (total 5 seconds)
      if (heatingTime > 5000) {
        // Add bubbles more frequently but gradually
        if (bubbles.length < maxBubbles && frameCount % 6 === 0) {
          bubbles.push({
            x: -4+random(9, 12), // CHANGED: Adjusted spawn area
            y: random(bodyHeight-6, bodyHeight-2), // Bottom area where tube enters
            r: random(1, 2.5),
            speed: random(0.15, 0.15),
            floating: false,
            evaporated: false,
            alpha: 150
          });
        }
        
        // CORRECTED: Bubbles consume liquid as they evaporate it
        // If no new liquid is flowing in, bubbles gradually consume existing liquid
        if (!shouldLiquidFlow() && evaporatorFluidLevel > 0.01) {
          evaporatorFluidLevel -= 0.0003; // Bubbles consume liquid through evaporation
          evaporatorFluidLevel = Math.max(0, evaporatorFluidLevel);
          
          // Debug logging for consumption
          if (frameCount % 120 === 0) { // Every 2 seconds
            console.log(`🔥 Bubbles evaporating liquid: ${(evaporatorFluidLevel * 100 / 0.25).toFixed(1)}% remaining`);
          }
        }
      }

      // Only start liquid movement after bubbles have been going for 3 seconds (total 8 seconds)
      if (heatingTime > 6500) {
        if (!liquidMovementStartTime) {
          liquidMovementStartTime = millis();
          window.liquidMovementStartTime = liquidMovementStartTime;
          console.log("🔥 LIQUID MOVEMENT STARTED - Bubbles reached top!");
        }
      }

      // Draw bubbles only if they should exist
      if (heatingTime > 5000) {
        fill(100, 180, 255, 150);  // pale blue
        noStroke();

        const fluidTopY = -10 + 35 * (1 - evaporatorFluidLevel); // move this here

        for (let i = bubbles.length - 1; i >= 0; i--) {
          let b = bubbles[i];

          // Move up until it floats
          if (!b.floating) {
            b.y -= b.speed;
            const evaporatorTop = 2;
            if (b.y <= evaporatorTop) {
              b.y = evaporatorTop; 
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
      // Clear everything when heater is off OR no liquid left
      if (!window.evaporatorHeaterOn || evaporatorFluidLevel <= 0.01) {
        boilingStartTime = null;
        liquidMovementStartTime = null;
        window.liquidMovementStartTime = null;
        bubbles = []; // Clear all bubbles
        
        if (evaporatorFluidLevel <= 0.01 && window.evaporatorHeaterOn) {
          console.log("💧 EVAPORATOR DRIED OUT - No more liquid to evaporate");
        }
      }
    }

    // Create vapor particles when bubbles reach top
    if (
      window.evaporatorHeaterOn &&
      evaporatorFluidLevel > 0.02 &&
      boilingStartTime &&
      millis() - boilingStartTime > 7000 &&   // 3s delay after bubbling
      frameCount % 2 === 0 &&
      vaporParticles.length < maxVaporParticles
    ) {
      vaporParticles.push({
        x: outletCenterX,
        y: outletTopY - 2,
        stage: 'vertical',
        alpha: 180,
        speed: random(0.5,1),
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
        if (p.y <= outletTopY - 20) { // ADJUSTED: positioning
          p.y = outletTopY - 20;
          p.stage = 'horizontal';
        }
      } else if (p.stage === 'horizontal') {
        p.x += p.speed;
        p.y = outletTopY - 20.75;  // ADJUSTED: Lock into horizontal pipe band
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
  strokeWeight(wallThickness); // CHANGED: Using new wall thickness
  fill(255, 255, 255, 50);
  rect(0, 0, bodyWidth, bodyHeight, borderRadius);

  // Draw tube connection inside evaporator
  const tubeWidth = 2.5;
  const tubeInsideHeight = 8; // How much tube shows inside
  const tubeX = -tubeWidth / 2; // Center it horizontally
  const tubeY = bodyHeight - tubeInsideHeight; // Start from bottom
  
  fill(130, 130, 130, 120); // Semi-transparent gray tube
  noStroke();
  rect(tubeX +6.5, tubeY + 7, tubeWidth, tubeInsideHeight -6.1); // ADJUSTED: positioning
  
  // Show liquid in the tube inside evaporator if flowing
  if (shouldLiquidFlow() && tubeFlowLevel >= 1.0) {
    fill(30, 100, 255, 200); // Blue liquid
    rect(tubeX +6.5, tubeY + 7, tubeWidth, tubeInsideHeight -6.1); // ADJUSTED: positioning
  }

  // Use global heater state for coil color
  push();
  translate(0, 10); // ADJUSTED: Center the coil around evaporator
    // Update coil color to match current heater state (handles auto-shutdown)
  if (!window.evaporatorHeaterOn && heaterColor !== 120) {
    // If heater is OFF but color is still red, change to gray immediately
    heaterColor = 120; // Gray when off
    if (heaterTimer) {
      clearTimeout(heaterTimer);
      heaterTimer = null;
    }
    console.log("🔧 Visual sync: Heater coil color → Gray (auto-shutdown)");
  }
  stroke(heaterColor);
  strokeWeight(0.8);
  noFill();

  let turns = 3; // CHANGED: Fewer turns
  let spacing = 2;
  let coilRadius = bodyWidth + 3; // CHANGED: Smaller radius
  let centerX = bodyWidth / 2;

  for (let i = 0; i < turns; i++) {
    let y = i * spacing + 4;
    // Full spiral (wrap around both sides)
    arc(centerX, y, coilRadius, spacing, 0, TWO_PI);
  }

  pop();

  pop();
}

export function drawHeaterSwitch(x = 100, y = 100) {
  const w = 13; // CHANGED: Smaller switch dimensions
  const h = 6; // CHANGED: Smaller switch dimensions

  push();
  translate(x, y);

    // Curved wire
  stroke(heaterColor);
  noFill();
  strokeWeight(0.8);
    // Upper wire: from top center to top of evaporator
  bezier(0, 0, -3, -4, 5, -8, 13, -11); // ADJUSTED: positioning

  // Lower wire: from bottom center to bottom of evaporator
  bezier(0, 0, -3, -4, 0, -2, 13, -7); // ADJUSTED: positioning

    // Use global heater state for lever position
  push();
  translate(0, 0);
  rotate(radians(window.evaporatorHeaterOn ? 30 : -30));
  stroke(10);
  strokeWeight(1);
  line(0, 0, 0, -3); // ADJUSTED: lever length
  pop();
  
  // Switch Box
  fill(60);
  noStroke();
  rect(-w / 2, 0, w, h, 2); // CHANGED: Using smaller dimensions

  // Labels
  fill(255);
  noStroke();
  textSize(2); // CHANGED: Smaller text size
  textAlign(CENTER, CENTER);

  // Place OFF to the left of switch box
  text("OFF", -w / 2 + 3, h / 2); // ADJUSTED: positioning

  // Place ON to the right of switch box
  text("ON", w / 2 -3, h / 2); // ADJUSTED: positioning

  // Example: Heater
  fill(255, 99, 71);
  rect(500, 300, 60, 100); // Replace with your heater
  fill(0);
  // text("heater switch", 0, 11); // Label below the heater - COMMENTED OUT

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

    // Toggle global heater state
    window.evaporatorHeaterOn = !window.evaporatorHeaterOn;

    if (window.evaporatorHeaterOn) {
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

// Reset function for evaporator component
export function resetEvaporator() {
  // Reset equipment states
  window.evaporatorHeaterOn = false;
  pumpPower = false;
  valveOpen = false;
  
  // Reset fluid levels
  evaporatorFluidLevel = 0.0;
  tubeFlowLevel = 0;
  beakerFluidLevel = 0.8; // Initial beaker level (80%)
  
  // Reset particle arrays
  steamParticles = [];
  bubbles = [];
  vaporParticles = [];
  
  // Reset heater visuals
  heaterColor = 120; // Gray
  heaterColorTarget = 120;
  if (heaterTimer) {
    clearTimeout(heaterTimer);
    heaterTimer = null;
  }
  
    window.experimentDraining = false;
  window.drainStartTime = null;
  // Reset timing variables
  boilingStartTime = null;
  liquidMovementStartTime = null;
  window.liquidMovementStartTime = null; // ADDED: Clear global variable
  
  console.log("Evaporator reset complete");
}