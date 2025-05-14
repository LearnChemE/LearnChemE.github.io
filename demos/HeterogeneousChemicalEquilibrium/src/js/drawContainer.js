export function drawContainer(centerX, centerY, radius) {
  push();

  // ===== TANK LEGS (drawn first so they appear behind the tank) =====
  const legWidth = radius * 0.2;
  const legHeight = radius * 1.1;
  const legOffset = radius * 0.6;

  fill(20, 20, 20, 100); // dark gray legs with semi-transparency
  noStroke();

  // Left leg
  rect(centerX - legOffset - legWidth / 2, centerY + radius - 7, legWidth, legHeight - 15);

  // Right leg
  rect(centerX + legOffset - legWidth / 2, centerY + radius - 7, legWidth, legHeight - 15);

  // ===== METALLIC SPHERE BODY =====
  for (let r = radius; r > 0; r--) {
    const inter = map(r, 0, radius, 0, 0.8);
    const col = lerpColor(
      color(255, 255, 255, 150),
      color(100, 100, 100, 150),
      inter
    );

    fill(col);
    noStroke();
    ellipse(centerX, centerY, r * 2, r * 2);
  }

  // Optional soft top-left highlight
  fill(255, 255, 128, 20);  // subtle yellow-white glow
  noStroke();
  ellipse(centerX - radius * 0.45, centerY - radius * 0.1, radius * 1.9);

  // Metallic outer ring
  stroke(120);
  strokeWeight(1.5);
  noFill();
  ellipse(centerX, centerY, radius * 2);

  pop();
}


  
export function generateCaCO3Molecules(count, radius, centerX, centerY) {
    const positions = [];
  
    for (let i = 0; i < count; i++) {
      let px, py;
      let tries = 0;
  
      do {
        px = centerX + random(-radius * 0.45, radius * 0.45);  
  
        py = centerY + random(radius * 0.4, radius * 0.85 );
        tries++;
      } while (dist(px, py, centerX, centerY) > radius && tries < 100);
  
      positions.push([px, py]);
    }
  
    return positions;
  }
export  function generateCaOMolecules(count, radius, centerX, centerY) {
    const positions = [];
  
    for (let i = 0; i < count; i++) {
      let px, py;
      let tries = 0;
  
      do {
        px = centerX + random(-radius * 0.55, radius * 0.65);  
        py = centerY + random(radius * 0.5, radius * 0.8);
        tries++;
      } while (dist(px, py, centerX, centerY) > radius && tries < 100);
  
      positions.push([px, py]);
    }
  
    return positions;
  }
  
export function generateCO2Molecules(count) {
    const T = window.state.T || 1000; 
    const scale = sqrt(T / 1000);    
  
    return Array.from({ length: count }, () => ({
      x: random(-0.1, 0.1),
      y: random(-0.1, 0.1),
      vx: random(-0.002, 0.002) * scale,
      vy: random(-0.002, 0.002) * scale
    }));
  }

export function drawTubeFurnace(centerX, centerY, radius, temp) {
  const furnaceWidth = radius * 1.2;
  const furnaceHeight = radius * 0.25;

  // Flame color palette
  const darkRed      = color('#330000');  // cold start
  const flameRed     = color('#ff3300');  // mid temp red
  const hotRedOrange = color('#ff4400');  // intense red-orange

  // Interpolate based on temperature
  let heatColor;
  if (temp < 1000) {
    const t = map(temp, 300, 1000, 0, 1);
    heatColor = lerpColor(darkRed, flameRed, t);
  } else {
    const t = map(temp, 1000, 2000, 0, 1);
    heatColor = lerpColor(flameRed, hotRedOrange, t);
  }

  // Flickering effect for realism
  heatColor.setAlpha(200 + random(-20, 20));

  push();

  // Furnace body
  fill(120); 
  noStroke();
  rectMode(CENTER);
  rect(centerX, centerY + radius + 2.5, furnaceWidth, furnaceHeight, 10);

  // Inner glowing heater
  fill(heatColor);
  rect(centerX, centerY + radius + 2.5, furnaceWidth * 0.95, furnaceHeight * 0.55, 1);

  pop();
}



export function drawDigitalPressureMeter(x, y, pressure) {
  push();

  // Outer box
  fill(0);
  stroke(130);
  strokeWeight(1.5);
  rectMode(CENTER);
  rect(x, y, 16, 8, 5);

  // Text inside
  fill(0, 155, 0); // bright green like LCD
  noStroke();
  textSize(4);
  textAlign(CENTER, CENTER);
  text(nf(pressure, 1, 2) + " ", x, y);

  pop();
}


export function drawYAxis(x, y, height, maxValue = 4) {
  const tickCount = 4;
  const tickLength = 1;
  const labelOffset = 4;

  push();
  translate(x, y);

 
 // X-axis
  stroke(40);
  strokeWeight(0.4);
  line(-30, 0, 25, 0);

// === X-axis ticks and labels ===
const xTickCount = 3;
const barSpacing = 8;     // space between ticks
const barWidth = 8;       // width allocated per bar
const labels = ["CaCO₃", "CaO", "CO₂"];
const xOffset = -20;       // shift everything to the left

textAlign(CENTER, TOP);
textSize(4);

for (let i = 0; i < xTickCount; i++) {
  const xPos = i * (barSpacing + barWidth) + xOffset;

  // Centered X-tick line (shifted left)
  stroke(0);
  line(xPos, 0, xPos, 1.5);

  // Label (shifted left)
  noStroke();
  fill(0);
  text(labels[i], xPos, 3);
}


  // Y-axis line
  stroke(40);
  strokeWeight(0.4);
  line(-30, 0, -30,-height -8 ) ;

  // Ticks and labels
  textAlign(RIGHT, CENTER );
  textSize(4);
  for (let i = 0; i <= tickCount; i++) {
    const val = (maxValue / tickCount) * i;
    const ty = map(i, 0, tickCount, 0, -height);
    stroke(0);
    line(-30, ty, -30 - tickLength, ty);
    noStroke();
    fill(0);
    text(val.toFixed(1), -32, ty);
  }

  // Axis label (rotated, repositioned properly)
  push();
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(4);
  text("equilibrium amount (mol)", -height + 65, -40);
  pop();


    // === Draw Bars for CaCO₃, CaO, CO₂ ===
  const barColors = ["#3399ff", "#66cc33", "#ffff33"];  // blue, green, yellow
  const molValues = [
    window.state.caCO3 || 0,
    window.state.caO || 0,
    window.state.cO2 || 0
  ];

  for (let i = 0; i < xTickCount; i++) {
    const val = molValues[i];
    const barHeight = map(val, 0, maxValue, 0, height);

    const xPos = i * (barSpacing + barWidth) + xOffset;

    fill(barColors[i]);
    noStroke();
    rect(xPos - barWidth / 2, -barHeight, barWidth, barHeight);  // from bottom up

    // Optional: draw value label inside bar
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(4);
    text(val.toFixed(2), xPos, -barHeight / 2);
  }

  pop();  
}
