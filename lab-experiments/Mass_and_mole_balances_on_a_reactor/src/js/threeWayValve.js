// threeWayValve.js (Updated to 2-State Version: Exhaust ↔ Condenser)

import { reactorX, reactorY, reactorHeight, reactorWidth } from './reactor.js';

export let valveState = "toexhaust"; // CHANGED: Start with exhaust instead of neutral
window.valveState = "toexhaust";

import { valveX, valveY } from './reactor.js';

// === Rotation Animation State ===
let valveCycleIndex = 0; // CHANGED: 0 = to exhaust, 1 = to condenser (no neutral)
let currentAngle = 270;  // CHANGED: Start at exhaust position (270°)
let targetAngle = 270;   // CHANGED: Start at exhaust position
let rotationStartAngle = 270; // CHANGED: Start at exhaust position
let rotationStartTime = 0;
let isRotating = false;
let rotationDuration = 800;

export function drawThreeWayValve() {
  const baseColor = color(100, 180, 255);
  const handleColor = color(135, 206, 250);
  const r = 5;
  const pipeWidth = 2.7;

  // Pipes
  noStroke();
  fill(200, 200, 200, 200);
  rect(valveX - pipeWidth / 2, valveY, pipeWidth + 0.5, 19);
  rect(valveX - 15, valveY - pipeWidth / 2, 30, pipeWidth );

  // Valve base
  fill(baseColor);
  ellipse(valveX, valveY, r * 2);

  drawFlowIndicator();

  // UPDATED: Always show label since there's no neutral state
  fill(0);
  noStroke();
  textSize(3);
  textAlign(CENTER, CENTER);
  if (valveCycleIndex === 0) {
    text("to exhaust", valveX, valveY - 8);
  } else {
    text("to condenser", valveX, valveY - 8);
  }
}

function drawFlowIndicator() {
  push();
  translate(valveX, valveY);

  fill(135, 206, 250);
  noStroke();

  // Animate triangle rotation
  if (isRotating) {
    const elapsed = millis() - rotationStartTime;
    const t = constrain(elapsed / rotationDuration, 0, 1);
    currentAngle = lerp(rotationStartAngle, targetAngle, easeInOutQuad(t));
    if (t >= 1.0) {
      isRotating = false;
      currentAngle = targetAngle % 360;
    }
  }

  rotate(radians(currentAngle));
  const size = 5;
  triangle(-size / 2, -size / 2, size / 2, -size / 2, 0, size / 2);
  pop();
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function handleValveClick(mx, my) {
  const d = dist(mx, my, valveX, valveY);
  if (d < 7 && !isRotating) {
    // CHANGED: Toggle between only 2 states (0 ↔ 1)
    valveCycleIndex = (valveCycleIndex + 1) % 2;

    rotationStartTime = millis();
    rotationStartAngle = currentAngle;
    isRotating = true;

    // UPDATED: Only 2 positions now
    if (valveCycleIndex === 0) {
      targetAngle = 270;  // To exhaust
      valveState = "toexhaust";
    } else {
      targetAngle = 360;  // To condenser (same as 0° but avoids reverse rotation)
      valveState = "tocondenser";
    }

    window.valveState = valveState;
    console.log("Valve switched to:", valveState);
    return true;
  }
  return false;
}

export function drawExhaustCap(x, y) {
  fill(120);
  rect(x, y - 4, 5, 8, 2);
  stroke(100);
  strokeWeight(0.3);
  line(x + 1, y - 3, x + 4, y - 3);
  line(x + 1, y, x + 4, y);
  line(x + 1, y + 3, x + 4, y + 3);
}

export function resetThreeWayValve() {
  // CHANGED: Reset to exhaust position instead of neutral
  valveCycleIndex = 0;
  currentAngle = 270;
  targetAngle = 270;
  rotationStartAngle = 270;
  isRotating = false;
  valveState = "toexhaust";
  window.valveState = "toexhaust";
  console.log("Two-way valve reset to exhaust position");
}