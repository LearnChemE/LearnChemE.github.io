let bulbPressed = false;
let bubbleY = null;
let bubbleActive = false;
let bubbleSpeed = 0.4;

const meterHeight = 30;
const meterWidth = 5;

export function drawBubbleMeter(x = 200, y = 40) {
  push();
  translate(x, y);

  // === Tube ===
  stroke(180);
  strokeWeight(0.5);
  fill(255, 255, 255, 40);
  rect(0, 0, meterWidth, meterHeight, 4);

// === Volume Markings (every 10 mL from 0 to 100)
fill(0);
noStroke();
textSize(3);
textAlign(LEFT, CENTER);
for (let i = 0; i <= 10; i++) {
  let yMark = meterHeight - i * (meterHeight / 10);
  stroke(50);
  strokeWeight(0.4);
 

  // ✅ RIGHT tick marks
  line(meterWidth - 2, yMark, meterWidth + 1, yMark);  // short tick to right

  noStroke();
  text(`${i * 1} ml` , meterWidth +2, yMark);  // number on right
}


  // === Highlight region (0–10 mL zone for flow timing)
  fill(100, 255, 100, 30); // green transparent
  noStroke();
  rect(0, meterHeight - 8, meterWidth, 8);

  // === Bubble ===
  if (bubbleActive && bubbleY !== null) {
    bubbleY -= bubbleSpeed;
    fill(100, 180, 255, 180);
    noStroke();
    ellipse(meterWidth / 2, bubbleY, 6);

    // Stop when bubble exits tube
    if (bubbleY < -5) {
      bubbleActive = false;
      bubbleY = null;
    }
  }

  // === Bulb ===
  drawSqueezeBulb(meterWidth / 2, meterHeight + 6);

  pop();
}


function drawSqueezeBulb(cx, cy) {
  push();
  translate(cx, cy);

  fill(200, 0, 0);
  stroke(80);
  strokeWeight(0.5);
  ellipse(0, 0, 7); // red bulb

//   fill(0);
//   noStroke();
//   textSize(2.5);
//   textAlign(CENTER, TOP);
//   text("Bulb", 0, 10);

  pop();
}


export function handleBulbClick(mx, my, meterX = 130, meterY = 50) {
  const localX = mx - (meterX + meterWidth / 2);
  const localY = my - (meterY + meterHeight + 12);

  const r = 6;
  if (localX * localX + localY * localY <= r * r * 4) {
    bulbPressed = true;
    bubbleY = meterHeight;  // start from bottom
    bubbleActive = true;
    console.log("Bulb squeezed! Bubble rising.");
    return true;
  }
  return false;

}


export function drawCondensateToBubbleMeterTube() {
  const tubeWidth = 3;

  // Starting point: right side of condenser
  const startX = 94 + 20; // 20 = condenser width
  const startY = 28 + 35 / 2; // vertical center of condenser

  // Ending point: left side of bubble meter
  const endX = 130;
  const endY = 50 + 5; // adjust as needed to match bubble meter top

  // Horizontal pipe
  fill(130, 130, 130, 180); // gray
  noStroke();
  rect(startX, startY - tubeWidth / 2, endX - startX, tubeWidth);
}

