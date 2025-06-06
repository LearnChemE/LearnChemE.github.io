// draw.js

import results from "./results.js";  // ← adjust this path if your results.js lives elsewhere

// ------------------ 9) “Color interpolation” helper ------------------
  function lerpColorStops(t, stops) {
    const n = stops.length - 1;
    const scaledT = t * n;
    const i = floor(scaledT);
    const localT = scaledT - i;
    const idx = constrain(i, 0, n - 1);
    const c1 = stops[idx];
    const c2 = stops[idx + 1];
    return lerpColor(c1, c2, localT);
  }

function sinusoid(x0, y0, len, amp, om, colorStops, n) {
  var last = [x0, y0];
  var dx = len / n;
  om = om / n;

  for (let i = 0; i < n; i++) {
    const t = i / n;
    const x = x0 + i * dx;
    const y = y0 + amp * sin(radians(i * om));
    stroke(lerpColorStops(t, colorStops));
    line(...last, x, y);
    last[0] = x;
    last[1] = y;
  }
}

export function drawAll() {

  push();
  translate(-25, 55);

  // Compute scale factors from “design units” → actual pixels:
  const ux = width / 150;
  const uy = height / 100;

  const mcNum = parseFloat(results.mc);  // cold‐side mass flow (kg/min)
  const mhNum = parseFloat(results.mh);  // hot‐side mass flow  (kg/min)

  const scaleFactor = 80;  // (design units per kg/min)

  //  Compute “design‐unit length” for each arrow:
  const arrowLenCold_Design = mcNum * scaleFactor;
  const arrowLenHot_Design = mhNum * scaleFactor;

  const rawCold_px = arrowLenCold_Design * ux;
  const rawHot_px = arrowLenHot_Design * ux;

  // ── 3) Now remap “raw px” into [minPx, maxPx] so small flows aren’t too tiny
  //      and large flows aren’t too huge.
  const minPx = 80;
  const maxPx = 180;

  // Option A: CLAMP the raw pixel values directly
  const arrowLenCold_px = constrain(rawCold_px, minPx, maxPx);
  const arrowLenHot_px = constrain(rawHot_px, minPx, maxPx);

  // ------------------ 1) “Longer waves” inside the pipe (even thicker) ------------------
  push();
  noFill();
  strokeWeight(height * 0.011);

  const colorStops1 = [
    color(90, 173, 233),  // light blue
    color(255, 255, 0),   // yellow
    color(255, 219, 88),  // mustard yellow
    color(255, 165, 0),   // orange
    color(255, 0, 0)      // red
  ];

  // Draw a sinusoid
  sinusoid(53 * ux, height/2, 200 / 3 * ux, 10.5 * uy, 3000, colorStops1, 150);
  pop();

  // ------------------ 2) “Elongated line” (small slanted connector, thicker) ------------------
  push();
  stroke(90, 173, 233);
  strokeWeight(height * 0.011);

  line(
    51.5 * ux, 27 * uy,
    53 * ux, 50 * uy
  );
  pop();

  // ------------------ 3) “Smaller waves” under the pipe (even thicker) ------------------
  push();
  fill('rgba(90, 173, 233, 0.34)');
  strokeWeight(height * 0.010);

  const colorStops2 = [
    color(0, 0, 255), // blue
    color(100, 200, 255), // light blue
    color(255, 255, 255), // white
    color(255, 255, 100), // yellow
    color(255, 165, 0), // orange
    color(255, 0, 0)  // red
  ];

  // Draw another sinusoid
  sinusoid(39 * ux, height/2, 1000 / 13 * ux, 3.5 * uy, 4500, colorStops2, 180);
  pop();

  // ------------------ 4) “Triangle” (throttle valve indicator, much thicker outline) ------------------
  push();
  const xOffsetDesign = state.z * -5;

  const topX = (150 - 20 + xOffsetDesign) * ux;
  const topY = (50 - 8) * uy;
  const botY = (50 + 8) * uy;
  const tipX = (150 - 34 + xOffsetDesign) * ux;
  const tipY = 50 * uy;

  fill(250, 220, 240); // lavender fill
  strokeJoin(ROUND);
  strokeWeight(height * 0.010);

  triangle(topX, topY, topX, botY, tipX, tipY);
  pop();


  // ------------------ 6) “Top arrow” (small downward arrow, same thickness) ------------------
  drawDownArrow(
    51.5 * ux,
    20 * uy,
    4 * uy,   // shaft length in pixels
    2 * uy,   // head height
    3 * ux    // head width
  );

  function drawDownArrow(px, py, shaftLenPx, headHeightPx, headWidthPx) {
    push();
    strokeJoin(ROUND);
    strokeWeight(height * 0.008);  // same thickness you chose for other arrows
    fill(0);

    // Draw a straight vertical shaft from (px, py) down to (px, py + shaftLenPx)
    line(px, py, px, py + shaftLenPx);

    // Draw a centered triangular arrowhead below the shaft

    const baseY = py + shaftLenPx;
    const tipY = baseY + headHeightPx;

    beginShape();
    vertex(px - headWidthPx / 2, baseY);  // left corner of triangle base
    vertex(px + headWidthPx / 2, baseY);  // right corner of triangle base
    vertex(px, tipY);                     // bottom “tip” of the arrowhead
    endShape(CLOSE);

    pop();
  }

  push();
  stroke(0);
  strokeWeight(height * 0.008);
  line(28 * ux, 20 * uy, 51.5 * ux, 20 * uy);
  pop();

  // ------------------ 5) “Pipe borders” (upper and lower lines, unchanged or tweak as desired) ------------------
  stroke(0);
  strokeWeight(height * 0.010);

  // Upper borders (in design units):
  line(25 * ux, 38 * uy, 42 * ux, 38 * uy);
  line(42 * ux, 38 * uy, 42 * ux, 34 * uy);
  line(42 * ux, 34 * uy, 44 * ux, 34 * uy);
  line(44 * ux, 34 * uy, 44 * ux, 25 * uy);
  line(44 * ux, 25 * uy, 49 * ux, 25 * uy);

  line(54 * ux, 25 * uy, 59 * ux, 25 * uy);
  line(59 * ux, 25 * uy, 59 * ux, 34 * uy);
  line(59 * ux, 34 * uy, 61 * ux, 34 * uy);
  line(61 * ux, 34 * uy, 61 * ux, 36 * uy);
  line(61 * ux, 36 * uy, 122 * ux, 36 * uy);
  line(122 * ux, 36 * uy, 122 * ux, 39 * uy);

  // Lower borders:
  line(122 * ux, 61 * uy, 122 * ux, 64 * uy);
  line(61 * ux, 64 * uy, 122 * ux, 64 * uy);
  line(61 * ux, 64 * uy, 61 * ux, 66 * uy);
  line(44 * ux, 66 * uy, 61 * ux, 66 * uy);
  line(43 * ux, 66 * uy, 61 * ux, 66 * uy);
  line(43 * ux, 62 * uy, 43 * ux, 66 * uy);
  line(25 * ux, 62 * uy, 43 * ux, 62 * uy);

  // Vertical lines separating the two vortices:
  line(38 * ux, 62 * uy, 38 * ux, 53 * uy);
  line(38 * ux, 38 * uy, 38 * ux, 47 * uy);

  // ------------------ 7) “Left arrows” (cold side, now three arrows 
  // ------------------ 7) “Left arrows” (cold side; proportional to results.mc) ------------------
  push();
  stroke(0, 0, 255);
  fill(0, 0, 255);
  strokeWeight(height * 0.01);

  const baseX_Design = 37;
  const baseY_Design = 50;
  const offsetY_Design = 1.5;

  for (let dir of [-1, 0, 1]) {
    const angle = radians(-25 * dir);

    // 1) Starting point:
    const x1 = baseX_Design * ux;
    const y1 = (baseY_Design + dir * offsetY_Design) * uy;

    // 2) Compute dx/dy from the single pixel length:
    const dx = arrowLenCold_px * cos(angle);
    const dy = arrowLenCold_px * sin(angle);

    // 3) Ending point:
    const x2 = x1 - dx;
    const y2 = y1 - dy;

    line(x1, y1, x2, y2);

    // 4) Arrowhead (kept identical to your existing logic)
    const headSizePx = 3 * ux;            // arrowhead base half-width
    const angleOffset = radians(15);
    const xA = x2 + headSizePx * cos(angle + angleOffset);
    const yA = y2 + headSizePx * sin(angle + angleOffset);
    const xB = x2 + headSizePx * cos(angle - angleOffset);
    const yB = y2 + headSizePx * sin(angle - angleOffset);

    beginShape();
    vertex(x2, y2);
    vertex(xA, yA);
    vertex((xA + xB) / 2, (yA + yB) / 2 + 0.5 * uy);
    vertex(xB, yB);
    endShape(CLOSE);
  }
  pop();


  // ------------------ 8) “Right arrows” (hot side, pointing outward) ------------------
  // ------------------ 8) “Right arrows” (hot side; proportional to results.mh) ------------------
  push();
  stroke(165, 20, 20);
  fill(165, 20, 20);
  strokeWeight(height * 0.01);

  const baseX2_Design = 120;
  const baseY2_Design = 50;
  const spreadAngle = radians(26);

  for (let dir of [-1, 1]) {
    const angle = dir * spreadAngle;
    const startX = baseX2_Design * ux;
    const startY = (baseY2_Design + dir * 8) * uy;

    // 1) Use arrowLenHot_px for both X and Y
    const dx = arrowLenHot_px * cos(angle);
    const dy = arrowLenHot_px * sin(angle);

    const endX = startX + dx;
    const endY = startY + dy;

    line(startX, startY, endX, endY);

    // 2) Draw arrowhead
    const headSizePx = 3 * ux;
    const headAngleOffset = QUARTER_PI / 1.5;
    const xA = endX - headSizePx * cos(angle + headAngleOffset);
    const yA = endY - headSizePx * sin(angle + headAngleOffset);
    const xB = endX - headSizePx * cos(angle - headAngleOffset);
    const yB = endY - headSizePx * sin(angle - headAngleOffset);

    beginShape();
    vertex(endX, endY);
    vertex(xA, yA);
    vertex((xA + xB) / 2, (yA + yB) / 2 + 0.5 * uy);
    vertex(xB, yB);
    endShape(CLOSE);
  }
  pop();

  
  pop();
}


if (window.MathJax) {
  MathJax.typesetPromise();
}
