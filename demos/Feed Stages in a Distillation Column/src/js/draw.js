


export function drawAll() {
  // Phase 1: Clean schematic visualization matching the reference image
  drawColumnStructure();
  drawFlowArrows();
  drawFeedStream();
  drawEquations();
  drawFeedConditionDisplay();
}


function drawEquationWithSubscript(baseText, subscript, x, y, color) {
  push();
  fill(color);
  noStroke();
  textAlign(CENTER, CENTER);
  
  // Draw main text
  textSize(20);
  textStyle(NORMAL);
  text(baseText, x, y);
  
  // Calculate position for subscript
  const baseWidth = textWidth(baseText);
  
  // Draw subscript (smaller and slightly lower)
  textSize(14);
  text(subscript, x + baseWidth/2 - 2, y + 6);
  
  pop();
}

function drawSimpleText(textContent, x, y, color, size = 20) {
  push();
  // fill(color);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(size);
  textStyle(NORMAL);
  text(textContent, x, y);  // Fixed: using textContent parameter
  pop();
}

function drawColumnStructure() {
  push();
  
  const colWidth = 400;  // Make it wider horizontally
  const colHeight = 100;  // Make it shorter vertically
  const colX = state.columnX + 30;
  const colY = state.columnY + 150; // Adjust Y position
  
  // Draw horizontal rectangle block
  fill(220); // Light gray
  stroke(100);
  strokeWeight(2);
  
  rect(colX - colWidth / 2, colY, colWidth, colHeight);
  
  // Add vertical lines on both ends
  stroke(100);
  strokeWeight(2);
  
  // Left vertical line
  line(colX - colWidth / 2, colY -100, colX - colWidth / 2, colY + colHeight + 100);
  
  // Right vertical line  
  line(colX + colWidth / 2, colY - 100, colX + colWidth / 2, colY + colHeight + 100);

  
  pop();
}


function drawFlowArrows() {
  const colWidth = 400;  // Updated width
  const colHeight = 100; // Updated height  
  const colX = state.columnX + 30;
  const colY = state.columnY + 150;
  const feedY = colY + colHeight / 2;
  
  push();
  
  // L - Liquid down with mixing pattern (at position 100)
  const blueX = colX - colWidth/2 + 100; // Position 100 from left edge

  // 1. Top dashed line coming down to block (made of small horizontal dashes)
  stroke(0, 100, 200);
  strokeWeight(3);
  const numTopDashes = 8; // Number of horizontal dashes
  for (let i = 0; i < numTopDashes; i++) {
    const dashY = colY - 100 + (i * 12); // Start from colY - 100, stack every 12 pixels
    line(blueX - 5, dashY, blueX + 5, dashY); // Small horizontal dash
  }

  // 2. Dashed arrow pattern at top edge (angled lines pointing in)
  stroke(0, 100, 200);
  strokeWeight(4);
  line(blueX - 20, colY - 20, blueX, colY);     // Left angled line
  line(blueX + 20, colY - 20, blueX, colY);     // Right angled line

  // 3. Vertical dashed line made of small horizontal dashes (inside block)
  stroke(0, 100, 200);
  strokeWeight(3);
  const numDashes = 8; // Number of horizontal dashes
  for (let i = 0; i < numDashes; i++) {
    const dashY = colY + 5 + (i * 12); // Stacked vertically every 12 pixels
    line(blueX - 5, dashY, blueX + 5, dashY); // Small horizontal dash
  }

  // 4. Dashed arrow pattern at bottom edge (angled lines pointing IN)
  stroke(0, 100, 200);
  strokeWeight(4);
  line(blueX - 20, colY + colHeight - 20, blueX, colY + colHeight);  // Left angled line pointing in
  line(blueX + 20, colY + colHeight - 20, blueX, colY + colHeight);  // Right angled line pointing in

  // 5. Solid line continuing down from block
  stroke(0, 100, 200);
  strokeWeight(6);
  line(blueX, colY + colHeight, blueX, colY + colHeight + 100);

  // 6. Solid triangle at the very end
  push();
  translate(blueX, colY + colHeight + 110);
  fill(0, 100, 200);
  noStroke();
  triangle(0, 0, -10, -18, 10, -18); // Solid triangle pointing down
  pop();

  // V - Vapor up with mixing pattern (at position 300)
  const greenX = colX - colWidth/2 + 300; // Position 300 from left edge

  // 1. Bottom dashed line coming up to block (made of small horizontal dashes)
  stroke(0, 150, 50);
  strokeWeight(3);
  const numBottomDashes = 8; // Number of horizontal dashes
  for (let i = 0; i < numBottomDashes; i++) {
    const dashY = colY + colHeight + 100 - (i * 12); // Start from bottom, stack upward every 12 pixels
    line(greenX - 5, dashY, greenX + 5, dashY); // Small horizontal dash
  }

  // 2. Dashed arrow pattern at bottom edge (angled lines pointing in)
  stroke(0, 150, 50);
  strokeWeight(4);
  line(greenX - 20, colY + colHeight + 20, greenX, colY + colHeight);     // Left angled line pointing up
  line(greenX + 20, colY + colHeight + 20, greenX, colY + colHeight);     // Right angled line pointing up

  // 3. Vertical dashed line made of small horizontal dashes (inside block)
  stroke(0, 150, 50);
  strokeWeight(3);
  const numGreenDashes = 8; // Number of horizontal dashes
  for (let i = 0; i < numGreenDashes; i++) {
    const dashY = colY + 5 + (i * 12); // Stacked vertically every 12 pixels
    line(greenX - 5, dashY, greenX + 5, dashY); // Small horizontal dash
  }

  // 4. Dashed arrow pattern at top edge (angled lines pointing IN)
  stroke(0, 150, 50);
  strokeWeight(4);
  line(greenX - 20, colY + 20, greenX, colY);  // Left angled line pointing up into block
  line(greenX + 20, colY + 20, greenX, colY);  // Right angled line pointing up into block

  // 5. Solid line continuing up from block
  stroke(0, 150, 50);
  strokeWeight(6);
  line(greenX, colY, greenX, colY - 100);

  // 6. Solid triangle at the very end (pointing up)
  push();
  translate(greenX, colY - 110);
  fill(0, 150, 50);
  noStroke();
  triangle(0, 0, -10, 18, 10, 18); // Solid triangle pointing up
  pop();

// LABELS
 push();
  
  // Top row labels
  // fill(0, 100, 200);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(20);
  // textStyle(BOLD);
  text("L", blueX, colY - 130);  // Top left

  // Top right - Vapor relationship (handle subscripts)
  const vaporRel = state.vaporRelation;
  if (vaporRel.includes("VF")) {
    // Split "V = V̄ + VF" into "V = V̄ + V" and "F"
    const baseVapor = vaporRel.replace("VF", "V");
    drawEquationWithSubscript(baseVapor, "F", greenX, colY - 130);
  } else {
    drawSimpleText(vaporRel, greenX, colY - 130);
  }
  
  // Bottom row labels
  
  // Bottom left - Liquid relationship (handle subscripts)
  const liquidRel = state.liquidRelation;
  if (liquidRel.includes("LF")) {
    // Split "L̄ = L + LF" into "L̄ = L + L" and "F"
    const baseLiquid = liquidRel.replace("LF", "L");
    drawEquationWithSubscript(baseLiquid, "F", blueX, colY + colHeight + 150);
  } else {
    drawSimpleText(liquidRel, blueX, colY + colHeight + 150);
  }
  
  // Bottom right - V̄ symbol
  drawSimpleText("V̅", greenX, colY + colHeight + 150);
  
  pop();
}



function drawFeedStream() {
  const colWidth = 120;
  const colHeight = 300;
  const colX = state.columnX;
  const colY = state.columnY + 50;
  const feedY = colY + colHeight / 2;
  
  push();
  
  // Feed arrow from left (black to green gradient)
  // Black arrow head (feed entrance)
  fill(0);
  noStroke();
  push();
  translate(colX - colWidth / 2 - 100, feedY);
  triangle(0, 0, -50, -20, -50, 20); // Arrow head points right
  pop();
  

  // Black rectangular tube (same color as triangle)
    fill(0); // Black color (same as triangle)
    noStroke(); // No outline
    const tubeWidth = colWidth / 2 + 60; // Length of the tube
    const tubeHeight = 16; // Height/thickness of the tube
    rect(colX - colWidth / 2 -240, feedY - tubeHeight/2, tubeWidth, tubeHeight);
  
  // Feed F label
  fill(0);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(20);
  text("feed F", colX - colWidth / 2 - 240, feedY - 30);  // Text further left

  
  // Feed condition label
  textSize(16);
  textStyle(NORMAL);
  const condition = getFeedConditionText(state.qValue);
  text(condition, colX - colWidth / 2 - 260, feedY + 30);
  pop();
}

function drawEquations() {
  const colX = state.columnX;
  const colY = state.columnY + 50;
  
  push();
  
  fill(0, 150, 50); // Green text
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(18);
  textStyle(BOLD);
  
  
  pop();
}

function drawFeedConditionDisplay() {
  // Simplified display in bottom left corner
  push();
  
  fill(245, 245, 245);
  stroke(150);
  strokeWeight(1);
  rect(20, height - 120, 180, 100, 5);
  
  fill(50);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  textStyle(BOLD);
  text("Feed Condition:", 30, height - 105);
  
  textSize(16);
  textStyle(BOLD);
  fill(200, 50, 50);
  text(`q = ${state.qValue.toFixed(1)}`, 30, height - 85);
  
  textSize(12);
  textStyle(NORMAL);
  fill(50);
  const condition = getFeedConditionText(state.qValue);
  text(condition, 30, height - 60);
  
  // Show material balance effect
  textSize(11);
  fill(100);
  const effect = getMaterialBalanceEffect(state.qValue);
  text(effect, 30, height - 40);
  
  pop();
}

function drawSolidArrow(x1, y1, x2, y2, color, direction) {
  push();
  stroke(color);
  strokeWeight(6);
  line(x1, y1, x2, y2);
  
  // Arrow head
  fill(color);
  noStroke();
  push();
  translate(x2, y2);
  if (direction === "up") {
    triangle(0, 0, -8, 15, 8, 15);
  } else if (direction === "down") {
    triangle(0, 0, -8, -15, 8, -15);
  }
  pop();
  pop();
}

function drawDashedArrow(x1, y1, x2, y2, color, direction, dashed = false) {
  push();
  
  if (dashed) {
    // Draw dashed line
    stroke(color);
    strokeWeight(4);
    drawingContext.setLineDash([8, 6]);
    line(x1, y1, x2, y2);
    drawingContext.setLineDash([]);
  } else {
    stroke(color);
    strokeWeight(6);
    line(x1, y1, x2, y2);
  }
  
  // Arrow head
  fill(color);
  noStroke();
  push();
  translate(x2, y2);
  if (direction === "up") {
    triangle(0, 0, -8, 15, 8, 15);
  } else if (direction === "down") {
    triangle(0, 0, -8, -15, 8, -15);
  }
  pop();
  pop();
}

function getFeedConditionText(q) {
  if (q < 0) return "superheated vapor";
  if (q === 0) return "dew point vapor";
  if (q > 0 && q < 1) return "partially vaporized";
  if (q === 1) return "bubble point liquid";
  if (q > 1) return "subcooled liquid";
  return "unknown";
}

function getMaterialBalanceEffect(q) {
  if (q < 0) return "Vaporizes reflux liquid";
  if (q === 0) return "Adds vapor only";
  if (q > 0 && q < 1) return "Adds vapor and liquid";
  if (q === 1) return "Adds liquid only";
  if (q > 1) return "Condenses vapor";
  return "";
}









