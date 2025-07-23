import { reactorX, reactorY, reactorHeight, reactorWidth } from './reactor.js';

export let valveState = "toexhaust";  // Match the naming used in reactor.js
// Also set as global variable to avoid circular import
window.valveState = "toexhaust";

import { valveX, valveY } from './reactor.js';

export function drawThreeWayValve() {
  const baseColor = color(100, 180, 255);
  const handleColor = color(135, 206, 250);
  const r = 5;

  noStroke();  // No outlines for soft, smooth look
  fill(200, 200, 200, 200); // Light gray with some transparency

  const pipeWidth = 2.7;

  // Vertical pipe (stem)
  rect(valveX - pipeWidth / 2, valveY, pipeWidth, 10);  // downward

  // Horizontal pipe (T arms)
  rect(valveX - 15, valveY - pipeWidth / 2, 30, pipeWidth);  // full width

  // Valve base (circle)
  noStroke();
  fill(baseColor);
  ellipse(valveX, valveY, r * 2);

  // Valve handle (rotated rectangle) - points in flow direction
  push();
  translate(valveX, valveY);
  // Handle points toward actual flow direction (consistent with other valves)
  // When "toexhaust": 0° (horizontal right), When "tocondenser": 90° (vertical down)
  rotate(valveState === "toexhaust" ? radians(90) : radians(0));
  fill(handleColor);
  rectMode(CENTER);
  rect(0, 0, 2, 9, 2);  // narrow and long handle
  pop();

  // Corrected Dynamic Flow Label Above Valve
  fill(0); // Black text
  noStroke();
  textSize(3);
  textAlign(CENTER, CENTER);

  // Use consistent naming without spaces
  let label = valveState === "tocondenser" ? "to condenser" : "to exhaust";
  text(label, valveX, valveY - 8);
}

export function handleValveClick(mx, my) {
  const d = dist(mx, my, valveX, valveY);
  if (d < 7) {
    valveState = valveState === "tocondenser" ? "toexhaust" : "tocondenser";
    // Update global variable too
    window.valveState = valveState;
    console.log("Valve switched to:", valveState);
    return true;
  }
  return false;
}

export function drawExhaustCap(x, y) {
  fill(120);
  rect(x, y - 4, 5, 8, 2); // vertical cap

  stroke(100);
  strokeWeight(0.3);
  line(x + 1, y - 3, x + 4, y - 3);
  line(x + 1, y, x + 4, y);
  line(x + 1, y + 3, x + 4, y + 3);
}

// Reset function for three-way valve
export function resetThreeWayValve() {
  // Reset valve position
  valveState = "toexhaust";
  window.valveState = "toexhaust";
  
  console.log("Three-way valve reset complete");
}