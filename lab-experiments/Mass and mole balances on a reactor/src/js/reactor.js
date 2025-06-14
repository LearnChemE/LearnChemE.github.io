// reactor.js


export let reactorX = 50;
export let reactorY = 12;
export let reactorHeight = 40;
export let reactorWidth = 15;


// let heaterOn = true;  // Start with ON to test coil glow
// let currentTemp = 150;  // Simulate mid temperature for glow

window.reactorHeaterOn = false;

let coilGlowValue = 120;  // Starting steel grey

let reactorVaporParticles = [];
const maxReactorVapors = 25; // instead of 20




export function updateCoilGlow() {
  let target = reactorHeaterOn ? 255 : 120;  // glow vs steel
  coilGlowValue = lerp(coilGlowValue, target, 0.05);  // smooth transition
}




export function drawReactorBody(temp) {
  push();
  translate(reactorX, reactorY);

  // === Reactor Body ===
  stroke(100);
  strokeWeight(1.2);
  fill(220);
  rect(0, 0, reactorHeight, reactorWidth, 10); // horizontal reactor

  // === Vertical Spiral Coil (rotated evaporator-style arcs) ===
  let turns = 4;
  let spacing = 4;
  let coilWidth = 6;
  let startX = 14;

  // ✅ Fix color logic - Orange at 300°C, Reddish Orange at 330°C+
  let coilColor;
  // let pulse = sin(frameCount * 0.2) * 15;
  
  if (temp >= 329) {
    coilColor = color(255, 69 , 0); // Reddish Orange
  } else if (temp >= 201 && temp < 329) {
    coilColor = color(255, 165 , 0); // Orange
  } else {
    coilColor = color(140); // Grey
  }
  
  console.log("Temp:", temp, "Color:", coilColor.toString());
  
  stroke(coilColor);
  strokeWeight(1);
  noFill();

  for (let i = 0; i < turns; i++) {
    let x = startX + i * spacing;
    let y = reactorWidth / 2;
    arc(x, y, coilWidth, reactorWidth + 2, HALF_PI, -HALF_PI, OPEN);
  }


// === Entry wire from bottom of first coil
let entryX = startX - 4;
let entryY = reactorWidth / 2 - (reactorWidth + 2) / 2;

let jointX = reactorHeight / 3 ; // Center-ish below reactor
let jointY = reactorWidth + 8;

bezier(entryX, entryY,
       entryX - 2 , entryY + 4,
       jointX - 8, jointY - 3,
       jointX + 3, jointY  -2.5);

// === Exit wire from bottom of last coil
let exitX = startX + (turns - 1) * spacing + 3 ;
let exitY = reactorWidth / 2 + (reactorWidth + 2) / 2 ;

bezier(exitX, exitY,
       exitX , exitY + 3,
       jointX + 3, jointY - 5,
       jointX, jointY  +1 );


  pop();

}




// === Draw Heater Switch for Reactor ===
export function drawReactorHeaterSwitch(x = 120, y = 60) {
  const w = 15; // width of switch
  const h = 8; // height of switch
  const isOn = window.reactorHeaterOn;  // ✅ FIXED: use global state instead of local

  push();
  translate(x, y);

  // --- Switch Body ---
  stroke(0);
  strokeWeight(0);
  fill(60);
  rect(-w / 2, 0, w, h, 6); // rounded box

  // --- Lever ---
  push();
  translate(0, 0); // ✅ FIXED: move to center of switch for better pivot point
  rotate(radians(isOn ? 30 : -30));
  stroke(0);
  strokeWeight(1); // ✅ Made slightly thicker for better visibility
  line(0, 0, 0, -4);  // vertical lever line
  pop();

  // --- Text Labels ---
  noStroke();
  fill(255);
  textSize(2.5);
  textAlign(CENTER, CENTER);
  text("OFF", -w / 4, h / 2);
  text("ON", w / 4, h / 2);

  // // --- Label below switch ---
  // fill(0);
  // textSize(4);
  // textAlign(CENTER);
  // text("Heater Switch", 0, h + 10);

  pop();
}

export function toggleReactorHeater(mx, my, switchX = 63, switchY = 36.5) {
  const x = switchX, y = switchY;
  const w = 18;
  const h = 10;
  
  const left = x - w / 2;
  const right = x + w / 2;
  const top = y;
  const bottom = y + h;
  
  if (mx >= left && mx <= right && my >= top && my <= bottom) {
    window.reactorHeaterOn = !window.reactorHeaterOn;
    
    console.log("Switch clicked! Heater state:", window.reactorHeaterOn); // ✅ Debug
    
    // ✅ Reset slider when heater turns OFF
    if (!window.reactorHeaterOn && window.tempSlider && window.tempValueSpan) {
      window.tempSlider.value = 200;
      window.tempValueSpan.textContent = `200°C`;
      window.targetTemp = 200; // ✅ Also reset target immediately
      console.log("Heater turned OFF - Slider reset to 200"); // Debug
    }
    
    return true;
  }
  return false;
}



export function updateReactorVaporParticles(temp) {
  const vaporDelayReached =
    window.liquidMovementStartTime &&
    millis() - window.liquidMovementStartTime > 1000;

  const left = reactorX + 2;
  const right = reactorX + reactorHeight - 2;
  const top = reactorY + 2;
  const bottom = reactorY + reactorWidth - 2;

  // Generate new particles
  if (
    vaporDelayReached &&
    window.reactorHeaterOn &&
    reactorVaporParticles.length < maxReactorVapors &&
    frameCount % 10 === 0
  ) {
    reactorVaporParticles.push({
      x: left + 2,
      y: (top + bottom) / 2,
      vx: random(0.5, 1),
      vy: random(-0.5, 0.5),
      r: random(1.0, 1.6),
      alpha: 255,
      wallTouchTime: null // Will be set when it hits a wall
    });
  }

  // Update particles
  for (let i = reactorVaporParticles.length - 1; i >= 0; i--) {
    let p = reactorVaporParticles[i];

    // Add temp-based motion randomness
    if (temp < 300) {
      p.vx += random(-0.005, 0.005);
      p.vy += random(-0.005, 0.005);
      fill(100, 180, 255, p.alpha);
    } else if (temp < 330) {
      p.vx += random(-0.1, 0.1);
      p.vy += random(-0.1, 0.1);
      fill(100, 180, 255, p.alpha);
    } else {
      p.vx += random(-0.25, 0.25);
      p.vy += random(-0.25, 0.25);
      fill(100, 180, 255, p.alpha);
    }

    p.x += p.vx;
    p.y += p.vy;

    // Bounce + track first wall touch
    if (p.x <= left) {
      p.x = left;
      p.vx *= -1;
      if (!p.wallTouchTime) p.wallTouchTime = millis();
    } else if (p.x >= right) {
      p.x = right;
      p.vx *= -1;
      if (!p.wallTouchTime) p.wallTouchTime = millis();
    }

    if (p.y <= top) {
      p.y = top;
      p.vy *= -1;
      if (!p.wallTouchTime) p.wallTouchTime = millis();
    } else if (p.y >= bottom) {
      p.y = bottom;
      p.vy *= -1;
      if (!p.wallTouchTime) p.wallTouchTime = millis();
    }

    // Fading: only after 2s from wall touch
    if (p.wallTouchTime && millis() - p.wallTouchTime > 2000) {
      p.alpha -= 1.5;
    }

    noStroke();
    ellipse(p.x, p.y, p.r);

    if (p.alpha <= 0) {
      reactorVaporParticles.splice(i, 1);
    }
  }
}
