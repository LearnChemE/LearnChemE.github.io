import { drainingToBeaker } from "./condenser.js";



let bulbPressed = false;
let bubbleY = null;
let bubbleActive = false;
let bubbleSpeed = 0.4;

let soapLevel = 0;  // in mL equivalent (0 to 10)
let soapRiseSpeed = 0.05;  // rate at which soap level rises per bubble
let soapFallRate = 0.005;  // passive fall back when no gas is entering


export const meterHeight = 30;
const meterWidth = 5;



export let hydrogenBubbles = [];


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

  // === Soap water level
  fill(120, 220, 255, 80);  // light blue fill for soap water
  noStroke();
  let soapHeight = map(soapLevel, 0, 10, 0, meterHeight);
  rect(0, meterHeight - soapHeight, meterWidth, soapHeight);


  // === Bubble ===
  // if (bubbleActive && bubbleY !== null) {
  //   bubbleY -= bubbleSpeed;
  //   fill(100, 180, 255, 180);
  //   noStroke();
  //   ellipse(meterWidth / 2, bubbleY, 6);

  //   // Stop when bubble exits tube
  //   if (bubbleY < -5) {
  //     bubbleActive = false;
  //     bubbleY = null;
  //   }
  // }

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
  ellipse(0, 0, 5); // red bulb

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
    // soapLevel += 0.5; 
    console.log("Bulb squeezed! Bubble rising.");
    return true;
  }
  return false;

}


export function drawBubbleMeterElbowTube() {
  const tubeWidth =2 ;
  

  // === Starting point: tap into the main condenser tube ===
  const branchX = 104;  // approx where the main condenser tube ends (adjust if needed)
  const branchY = 63;   // height of main tube (same as condenser outlet)

  // === First segment: short vertical tube downward ===
  const verticalDrop = 8;

  fill(200, 200, 200, 200); 
  noStroke();
  rect(branchX - tubeWidth / 2, branchY, tubeWidth, verticalDrop);

  // === Second segment: horizontal elbow tube to the left (to bubble meter) ===
  const horizontalLength = branchX - 130 +7;  // 130 = x of bubble meter

  rect(
    branchX - horizontalLength - 1,             // x-start
    branchY + verticalDrop - tubeWidth / 2 - 1, // y-center aligned
    horizontalLength,
    tubeWidth
  );


}


// export function drawTubeAtAngleToBubbleMeter() {


export function drawTubeAtAngleToBubbleMeter() {
  const tubeWidth = 2;

  // === Starting point: end of elbow tube ===
  const startX = 121.5;
  const startY = 70;

  // === Ending point: top of bubble meter ===
  const endX = 130 + meterWidth / 2;
  const endY = 77.5;

  // === Calculate angle and distance
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);

  // === Draw rotated rectangle to simulate a diagonal tube
  push();
  translate(startX, startY);
  rotate(angle);

  noStroke();
  fill(200, 200, 200, 200); 
  rect(0, -tubeWidth / 2, length/2 +5, tubeWidth);  

  pop();
}


export function maybeSpawnHydrogenBubble(temp) {
  if (condenserCoolingOn && temp >= 290 && drainingToBeaker && frameCount % 12 === 0)
 {
    let bubbleColor;

    if (temp < 330) {
      bubbleColor = color(100, 255, 180, 255);  // greenish for propylene
    } else {
      bubbleColor = color(180, 220, 255, 255);  // reddish for hydrogen
    }

    hydrogenBubbles.push({
      x: 104,
      y: 63,
      vx: 0,
      vy: 0.5,
      phase: "vertical",
      alpha: 255,
      color: bubbleColor
    });
  }
}




export function drawHydrogenBubbles() {
  for (let i = hydrogenBubbles.length - 1; i >= 0; i--) {
    let b = hydrogenBubbles[i];

    // === Movement by phase ===
    if (b.phase === "vertical") {
      b.y += b.vy;
      if (b.y >= 70) {
        b.phase = "horizontal";
        b.vx = 0.8;
        b.vy = 0;
      }
    } else if (b.phase === "horizontal") {
      b.x += b.vx;
      if (b.x >= 121.5) {
        b.phase = "angled";
        b.vx = 0.6;
        b.vy = 0.4;
      }
    } else if (b.phase === "angled") {
      b.x += b.vx;
      b.y += b.vy;

      // Once it enters the bubble meter, begin rising
      if (b.x >= 132.5 && b.y >= 70) {
        b.phase = "rising";
        b.vx = 0;
        b.vy = -0.06; // slow float upward
        if (soapLevel < 10) soapLevel += soapRiseSpeed;
      }
    } else if (b.phase === "rising") {
      b.y += b.vy;
      b.alpha -= 2.1; // fade over ~2 seconds (60fps)
    }

    // === Draw the bubble
    push();
    let c = b.color;
    c.setAlpha(b.alpha);  // update transparency
    fill(c);

    noStroke();
    ellipse(b.x, b.y, 1.5);
    pop();

    // === Remove if faded
    if (b.alpha <= 0) {
      hydrogenBubbles.splice(i, 1);
    }
    // Natural fall-back of soap level if no new bubbles are entering
    if (soapLevel > 0) {
      soapLevel -= soapFallRate;
      if (soapLevel < 0) soapLevel = 0;
    }


  }
}
