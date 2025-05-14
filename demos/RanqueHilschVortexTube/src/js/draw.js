export function drawAll() {
  
  // -----------longer waves---------------
  push();
  noFill();
  strokeWeight(1);
  const colorStops1 = [
    color(90, 173, 233),  // light blue
    color(255, 255, 0),    // yellow (pure yellow)
    color(255, 219, 88),   // mustard yellow
    color(255, 165, 0),    // orange
    color(255, 0, 0),      // red
  ];
  for (let i = 0; i < 1000; i++) {
    const t = i / 1000;
    const x = 53 + i / 15;
    const y = height / 2 + 10.5 * sin(radians(i * 3));
    stroke(lerpColorStops(t, colorStops1));
    point(x, y,x+1,y+1);
  }
  pop();

  //--------------elongated line-----------------
  push();
  stroke(90, 173, 233); 
  strokeWeight(1);
  line(51.5, 27, 53, 50);
  pop();

  //--------------smaller waves--------------------
  push();
  fill("rgba(90, 173, 233, 0.34)");
  strokeWeight(1);
  const colorStops = [
    color(0, 0, 255),     // blue
    color(100, 200, 255), // light blue
    color(255, 255, 255), // white
    color(255, 255, 100), // yellow
    color(255, 165, 0),   // orange
    color(255, 0, 0),     // red
  ];
  for (let i = 0; i < 1000; i++) {
    const t0 = i / 1000;
    const x =  39 + i / 13;
    const y = height / 2 + 3.5 * sin(radians(i * 4.5));
    stroke(lerpColorStops(t0, colorStops));
    point(x, y,x+1,y+1);
  }
  pop();


  //------------------------ triangle --------------------------
  push();
  const xOffset = state.z * -5;
  const topX = width - 20 + xOffset;
  const topY = height / 2 - 8;
  const botY = height / 2 + 8;
  const tipX = width - 34 + xOffset;
  const tipY = height / 2;
  fill(250, 220, 240); // lavender
  strokeJoin(ROUND);    //curved edges
  strokeWeight(1);
  triangle(topX, topY, topX, botY, tipX, tipY);
  pop();


  //lines for upper vortex borders
  stroke(0); 
  strokeWeight(1);
  line(20,38,42,38);
  line(42,38,42,34);
  line(42,34,44,34);
  line(44,34,44,25);
  line(44,25,49,25);
  line(54,25,59,25);
  line(59,25,59,34);
  line(59,34,61,34);
  line(61,34,61,36);
  line(61,36,122,36);
  line(122,36,122,39);

  //--------------lines for lower vortex borders------------------
  line(122,61,122,64);
  line(61,64,122,64);
  line(61,64,61,66);
  line(44,66,61,66);
  line(43,66,61,66);
  line(43,62,43,66);
  line(20,62,43,62);

  //--------------vertical lines----------------------
  line(38,62,38,53);
  line(38,38,38,47);

  //------------------TOP ARROW-----------------------
  line(29,18,51,18);
  drawDownArrow(51, 17.5);
  function drawDownArrow(x, y, shaftLen = 6, headHeight = 3, headWidth = 3) {
    push();
    fill(0);
    strokeJoin(ROUND);
    strokeWeight(1);
  
    rect(x+0.2, y+0.6, 0.1, shaftLen);
  
    beginShape();
    vertex(x+0.5, y + shaftLen-1 + headHeight); // tip
    vertex(x+0.5 - headWidth / 2, y + shaftLen); // left base
    vertex(x+0.5 + headWidth / 2, y + shaftLen); // right base
    endShape(CLOSE);
  
    pop();
  }
  

  //----------------------left arrows------------------------
  push();
  stroke(0, 0, 255);
  strokeWeight(1); 
  fill(0, 0, 255);  

  const baseX = 37;
  const baseY = height / 2;
  const arrowLen = 18 + (state.P * 0.08) * 2 + state.z * 0.4;
  const offsetY = 1.5; 

  for (let i = -1; i <= 1; i++) {
    const y = baseY + i * offsetY;
    const angle = radians(-25 * i);

    const x1 = baseX;
    const y1 = y;
    const x2 = baseX - arrowLen * cos(angle);
    const y2 = y - arrowLen * sin(angle);

    // arrow shaft
    line(x1, y1, x2, y2);

    // arrowhead points
    const headSize = 3;
    const angleOffset = radians(15);
    const xA = x2 + headSize * cos(angle + angleOffset);
    const yA = y2 + headSize * sin(angle + angleOffset);
    const xB = x2 + headSize * cos(angle - angleOffset);
    const yB = y2 + headSize * sin(angle - angleOffset);

    beginShape();
    vertex(x2, y2);  // tip of arrow
    vertex(xA, yA);  // left side
    vertex((xA + xB) / 2, (yA + yB) / 2 + 0.5);
    vertex(xB, yB);  // right side
    endShape(CLOSE);
  }
  pop();


  // -------------------Right arrows-----------------------------
  push();
  stroke(165, 20, 20);
  fill(165, 20, 20);
  strokeWeight(1);

  const headSize = 3;
  const minLen = 10;
  const maxLen = 20;
  const baseLen = 12;
  const pressureBoost = ((state.P - 2.4) / (7.8 - 2.4)) * 6;   // up to +6
  const fractionReduction = ((state.z - 0.2) / (0.8 - 0.2)) * 4; // up to -4

  const shaftLen = baseLen + pressureBoost - fractionReduction;

  const horizontalOffset = 120;
  const verticalSpread = 8;
  const spreadAngle = radians(26); 

  for (let dir of [-1, 1]) {
    const angle = dir * spreadAngle;
    const startX = horizontalOffset;
    const startY = height / 2 + dir * verticalSpread;
    const endX = startX + shaftLen * cos(angle);
    const endY = startY + shaftLen * sin(angle);

    line(startX, startY, endX, endY);

    // Arrowhead
    const xA = endX - headSize * cos(angle + QUARTER_PI / 1.5);
    const yA = endY - headSize * sin(angle + QUARTER_PI / 1.5);
    const xB = endX - headSize * cos(angle - QUARTER_PI / 1.5);
    const yB = endY - headSize * sin(angle - QUARTER_PI / 1.5);

    beginShape();
    vertex(endX, endY);
    vertex(xA, yA);
    vertex((xA + xB) / 2, (yA + yB) / 2 + 0.5);
    vertex(xB, yB);
    endShape(CLOSE);
  }
  pop();

  // ---------------- Color gradience function----------------------
  function lerpColorStops(t, stops) {
    const n = stops.length - 1;
    const scaledT = t * n;
    const i = Math.floor(scaledT);
    const localT = scaledT - i;
    const c1 = stops[i];
    const c2 = stops[i + 1];
    return lerpColor(c1, c2, localT);
  }
}

if (window.MathJax) {
     MathJax.typesetPromise();
  }