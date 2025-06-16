// js/ condenser.js

let condenserCoolingOn = false;
let coolingCoilColor = 120; // steel gray by default
let coolingCoilTarget = 120;
let coolingTimer = null;
let condensedFluidLevel = 0.0; // fills up when cooling is ON

export function drawCondenserBody(x = 200, y = 50) {
  push();
  translate(x, y);

  const bodyWidth = 20;
  const bodyHeight = 35;
  const borderRadius = 10;

  // === Draw Container ===
  stroke(180);
  strokeWeight(1.5);
  fill(255, 255, 255, 50);
  rect(0, 0, bodyWidth, bodyHeight, borderRadius);

  // === Cooling Coil ===
  const coilOffset = 10;
  const spacing = 2;
  const turns = 6;
  const coilTopY = coilOffset + 4;
  const coilBottomY = coilTopY + spacing * (turns - 1);
  const coilCenterX = bodyWidth / 2;
  const coilLeftX = 0;

  push();
  translate(0, coilOffset); // Move coil downward
  stroke(coolingCoilColor);
  strokeWeight(0.8);
  noFill();

  for (let i = 0; i < turns; i++) {
    let y = i * spacing + 4;
    arc(coilCenterX, y, bodyWidth + 5, spacing, 0, TWO_PI);
  }
  pop();

  // === Cooling Wires to Coil ===
  const switchX = -12; // Relative to condenser (200 - 82 = 118)
  const switchY = 37;

  stroke(coolingCoilColor);
  strokeWeight(0.8);
  noFill();

  // Wire to top coil (left side)
  bezier(
    switchX + 1, switchY,
    switchX - 10, switchY - 2,
    coilLeftX + 1, coilTopY - 4,
    coilLeftX, coilTopY
  );

  // Wire to bottom coil (left side)
  bezier(
    switchX + 1, switchY,
    switchX - 10, switchY + 2,
    coilLeftX + 1, coilBottomY + 3,
    coilLeftX, coilBottomY
  );


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
  // fill(30, 100, 255, 200); // Light blue
  // noStroke();
  // rect(innerX - 1.5, fluidY, innerW + 3, fluidH);

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

// export function drawCondensateTube() {
//   push();
//   stroke(130);
//   strokeWeight(2);
//   noFill();

//   // === Points based on your setup ===
//   const startX = 94 + 10;  // center of condenser body
//   const startY = 28 + 34;  // bottom of condenser (y + height)

//   const bendX = startX;    // vertical pipe first
//   const bendY = startY + 48;   // just above the beaker

//   const endX = 100 + 10;   // enter beaker from center
//   const endY = 88;       // beaker top

//   const tubeWidth = 2.5; // thickness of pipe



// // === Vertical pipe
// fill(200, 200, 200, 200); 
// noStroke();
// rect(startX - tubeWidth / 2, startY, tubeWidth, bendY - startY);




//   pop();
// }
