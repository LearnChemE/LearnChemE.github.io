// js/condenser.js - Fixed liquid flow and timing
// export { condenserCoolingOn };

window.condenserCoolingOn = false;
let coolingCoilColor = 120; // steel gray by default
let coolingTimer = null;
export let condensedFluidLevel = 0.0;
export let condenserLiquidLevel = 0.0; // New: liquid level inside condenser

// ✅ LIQUID FLOW ANIMATION VARIABLES
export let drainingToBeaker = false;
let drainStartTime = 0;
let condensateBands = [];

export let condenserParticles = [];

export function drawCondenserBody(x = 200, y = 50) {
  push();
  translate(x, y);

  const bodyWidth = 20;
  const bodyHeight = 35;
  const borderRadius = 10;
  const wallThickness = 1.5;

  // === Draw Internal Liquid (Clipped Inside Rounded Rect) ===
  if (condenserLiquidLevel > 0) {
    // === Clipping to match evaporator-style tight inner bounds ===
    drawingContext.save();
    drawingContext.beginPath();

    const innerX = wallThickness * 0.3;
    const innerY = wallThickness * 0.3;
    const innerW = bodyWidth - wallThickness * 0.6;
    const innerH = bodyHeight - wallThickness * 0.6;
    const innerRadius = borderRadius - wallThickness * 0.8;

    // === Rounded rectangle clipping path (copied from evaporator) ===
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

    // === Draw liquid inside condenser (fills only 1/3 height) ===
    const liquidMaxH = innerH / 3;  // Only allow bottom 1/3
    const liquidHeight = condenserLiquidLevel * (liquidMaxH - 1);
    const liquidY = innerY + innerH - liquidHeight-0.3;  // From bottom up

    fill(30, 100, 255, 180);
    noStroke();
    rect(innerX, liquidY, innerW, liquidHeight);

    drawingContext.restore();
  }

  // === Outer Container ===
  stroke(180);
  strokeWeight(wallThickness);
  fill(255, 255, 255, 50);
  rect(0, 0, bodyWidth, bodyHeight, borderRadius);

  // === Cooling Coil ===
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

  // === Cooling Wires ===
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

// === Cooling Switch UI ===
export function drawCoolingSwitch(x = 120, y = 100) {
  const w = 15, h = 8;

  push();
  translate(x, y);

  // Switch Box
  fill(60);
  stroke(0);
  rect(-w / 2, 0, w, h, 4);

  // Lever
  push();
  translate(0, 0);
  rotate(radians(condenserCoolingOn ? 30 : -30));
  stroke(10);
  strokeWeight(1);
  line(0, 0, 0, -4);
  pop();

  // Labels
  fill(255);
  noStroke();
  textSize(2.5);
  textAlign(CENTER, CENTER);
  text("OFF", -w / 2 + 4, h / 2);
  text("ON", w / 2 - 4, h / 2);

  // Label
  fill(0);
  text("Cooling Switch", 0, 11);

  pop();
}

// === Handle mouse click ===
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
  const fluidH = height * fluidLevel;
  const fluidY = height - fluidH;

  push();
  translate(x, y);

  // === Beaker outline (open top) ===
  stroke(180);
  strokeWeight(1);
  noFill();
  line(0, 0, 0, height);            // Left wall
  line(0, height, width, height);  // Bottom
  line(width, 0, width, height);   // Right wall
  line(-2, 0, 0, 0);               // Left lip
  line(width + 2, 0, width, 0);    // Right lip

  // === Fluid ===
  fill(30, 100, 255, 200); // Light blue
  noStroke();
  rect(innerX - 1.5, fluidY, innerW + 3, fluidH);

  // === Graduation Marks ===
  const steps = 5;
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
    line(wall + 3, yMark, wall + 10, yMark);
    text(value, wall + 10, yMark);
  }

  // mL label
  textAlign(LEFT, BOTTOM);
  text("mL", width - 6, wall + 1);

  pop();
}

export function drawCondensateTube() {
  push();
  stroke(130);
  strokeWeight(2);
  noFill();

  // === Points based on your setup ===
  const startX = 94 + 10;  // center of condenser body
  const startY = 28 + 34;  // bottom of condenser (y + height)

  const bendX = startX;    // vertical pipe first
  const bendY = startY + 48;   // just above the beaker

  // ✅ FIXED: Position tube to enter beaker properly (inside the beaker walls)
  const endX = 30 + 8;     // beaker center (x=30, width=20, so center = 30+10, but offset slightly)
  const endY = 75;         // beaker top (y=50 + 25 = 75, but enter from top)

  const tubeWidth = 2.5; // thickness of pipe

  // === Vertical pipe
  fill(200, 200, 200, 200); 
  noStroke();
  rect(startX - tubeWidth / 2, startY, tubeWidth, bendY - startY);

  pop();
}

// ✅ FIXED: Smooth animated liquid flow through the tube with proper positioning
export function drawCondensateTubeStream() {
  if (!drainingToBeaker) return;

  const tubeX = 104; // Center X of the tube
  const topY = 62;   // Start of tube (bottom of condenser)
  const bottomY = 100; // ✅ FIXED: End at beaker top (y=50 + 25 = 75)
  const tubeWidth = 2.5; // Match the tube width
  const speed = 0.3; // ✅ REDUCED: Slower speed for more realistic flow

  // Create rectangular liquid segments less frequently for slower flow
  if (frameCount % 30 === 0 && condenserLiquidLevel > 0.25) { // ✅ FIXED: Only when above 1/4th
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

// ✅ SIMPLIFIED: This function now just adds particles to the condenser's internal system
export function addParticleToCondenser() {
  condenserParticles.push({
    x: 200, // Start at left edge of condenser
    y: 67.5, // Center Y of condenser
    vx: random(0.1, 0.3), // slower horizontal movement
    vy: random(-0.05, 0.05), // very gentle vertical movement
    alpha: 255,
    hasEntered: false // track if particle has fully entered condenser
  });
}

// ✅ MAIN FUNCTION: This handles the condensation process inside the condenser
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

  // ✅ FIXED: Wait until condenser is 1/4th full before starting flow
  if (condenserLiquidLevel > 0.25 && condensedFluidLevel < 0.6) { // 1/4 = 0.25
    if (!drainingToBeaker) {
      drainingToBeaker = true;
      drainStartTime = millis();
    }
    
    // ✅ SLOWER: Reduced transfer rate for delayed beaker filling
    const transferRate = 0.0005; // Much slower transfer rate
    condenserLiquidLevel = max(condenserLiquidLevel - transferRate, 0);
    condensedFluidLevel = min(condensedFluidLevel + transferRate, 0.6);
    
    // Only stop when truly empty or full, with small buffer
    if (condensedFluidLevel >= 0.58 || condenserLiquidLevel <= 0.02) {
      drainingToBeaker = false;
      // Gradually clear remaining droplets instead of instant clear
      if (condenserLiquidLevel <= 0.02) {
        // Let existing droplets finish their animation naturally
      }
    }
  } else if (condenserLiquidLevel <= 0.05) {
    // Only stop draining when liquid is very low
    drainingToBeaker = false;
  }
}