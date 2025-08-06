// threeWayValve.js (Updated to 3-State Animated Version)

import { reactorX, reactorY, reactorHeight, reactorWidth } from './reactor.js';

export let valveState = "neutral";
window.valveState = "neutral";

import { valveX, valveY } from './reactor.js';

// === Rotation Animation State ===
let valveCycleIndex = 0; // 0 = neutral, 1 = to exhaust, 2 = to condenser
let currentAngle = 180;
let targetAngle = 180;
let rotationStartAngle = 180;
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

  // Label for direction
  fill(0);
  noStroke();
  textSize(3);
  textAlign(CENTER, CENTER);
  if (valveCycleIndex === 1) {
    text("to exhaust", valveX, valveY - 8);
  } else if (valveCycleIndex === 2) {
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
    valveCycleIndex = (valveCycleIndex + 1) % 3;

    rotationStartTime = millis();
    rotationStartAngle = currentAngle;
    isRotating = true;

    if (valveCycleIndex === 0) {
      targetAngle = 180 + 360 * Math.ceil((currentAngle + 180) / 360);
      valveState = "neutral";
    } else if (valveCycleIndex === 1) {
      targetAngle = 270 + 360 * Math.ceil((currentAngle + 90) / 360);
      valveState = "toexhaust";
    } else {
      targetAngle = 360 + 360 * Math.ceil((currentAngle + 0) / 360);
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
  valveCycleIndex = 0;
  currentAngle = 180;
  targetAngle = 180;
  rotationStartAngle = 180;
  isRotating = false;
  valveState = "neutral";
  window.valveState = "neutral";
  console.log("Three-way valve reset complete");
}
