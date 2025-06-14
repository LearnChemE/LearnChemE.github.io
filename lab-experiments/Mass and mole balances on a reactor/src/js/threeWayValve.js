import { reactorX, reactorY, reactorHeight, reactorWidth } from './reactor.js';

export let valveState = "toExhaust";

export let valveX = reactorX + reactorHeight + 14;
export let valveY = reactorY + reactorWidth / 2;

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

  // // Valve knob at the junction
  // fill(valveState === "toCondenser" ? "green" : "red");
  // ellipse(valveX, valveY, 7, 7);

    // Valve base (circle)
  noStroke();
  fill(baseColor);
  ellipse(valveX, valveY, r * 2);

    // Valve handle (rotated rectangle)
  push();
  translate(valveX, valveY);
  rotate(valveState === "toCondenser" ? radians(90) : radians(-180));
  fill(handleColor);
  rectMode(CENTER);
  rect(0, 0, 2, 9, 2);  // narrow and long handle
  pop();

  // === Dynamic Flow Label Above Valve ===
  fill(0); // Black text
  noStroke();
  textSize(3);
  textAlign(CENTER, CENTER);

  let label = valveState === "toCondenser" ? "to exhaust" : "to condenser"  ;
  text(label, valveX, valveY - 8);
}




export function handleValveClick(mx, my) {
  const d = dist(mx, my, valveX, valveY);
  if (d < 7) {
    valveState = valveState === "toCondenser" ? "toExhaust" : "toCondenser";
    console.log("Valve switched to:", valveState);
  }
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
              
