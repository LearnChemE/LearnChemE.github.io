
export function drawContainer(centerX, centerY, radius) {
  push();
  const legWidth = radius * 0.2;
  const legHeight = radius * 1.1;
  const legOffset = radius * 0.6;

  fill(20, 20, 20, 100);
  noStroke();

  rect(centerX - legOffset - legWidth / 2, centerY + radius - 7, legWidth, legHeight - 15);
  rect(centerX + legOffset - legWidth / 2, centerY + radius - 7, legWidth, legHeight - 15);

  for (let r = radius; r > 0; r--) {
    const inter = map(r, 0, radius, 0, 0.8);
    const col = lerpColor(color(255, 255, 255, 150), color(100, 100, 100, 150), inter);
    fill(col);
    noStroke();
    ellipse(centerX, centerY, r * 2, r * 2);
  }


  stroke(120);
  strokeWeight(1.5);
  noFill();
  ellipse(centerX, centerY, radius * 2);
  pop();
}


export function generateCaCO3Molecules(count, radius, centerX, centerY) {
  const boundingRadius = radius * 0.90; 
  const positions = [];
  const minDistance = 9;

  for (let i = 0; i < count; i++) {
    let px, py, tries = 0;
    let valid = false;

    while (!valid && tries < 150) {
      
      const angle = random(PI / 4, (3 * PI) / 3.75);

      const distFromCenter = random(boundingRadius * 0.2, boundingRadius * 0.85);

     
      px = centerX + distFromCenter * cos(angle);
      py = centerY + distFromCenter * sin(angle);

      const dFromCenter = dist(px, py, centerX, centerY);
      if (dFromCenter > boundingRadius) continue;


      valid = true;
      for (const [x, y] of positions) {
        if (dist(px, py, x, y) < minDistance) {
          valid = false;
          break;
        }
      }

      tries++;
    }

    if (valid) {
      positions.push([px, py]);
    }
  }

  return positions;
}




export function generateCaOMolecules(count, radius, centerX, centerY) {
  const boundingRadius = radius * 0.93;
  const positions = [];
  for (let i = 0; i < count; i++) {
    let px, py, tries = 0;
    do {
      px = centerX + random(-radius * 0.65, radius * 0.65);
      py = centerY + random(radius * 0.5, radius * 0.8);
      tries++;
    } while (dist(px, py, centerX, centerY) > boundingRadius && tries < 100);
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

  const lowOrange = color('#FF6600');  
  const hotFlame = color('#FF3300');   

  
  const clampedTemp = constrain(temp, 980, 1400);

  
  const heatColor = lerpColor(lowOrange, hotFlame, map(clampedTemp, 980, 1400, 0, 1));
  heatColor.setAlpha(220 + random(-10, 10));  

  push();
  fill(120);
  noStroke();
  rectMode(CENTER);
  rect(centerX, centerY + radius + 2.5, furnaceWidth, furnaceHeight, 10);

  fill(heatColor);
  rect(centerX, centerY + radius + 2.5, furnaceWidth * 0.95, furnaceHeight * 0.55, 1);
  pop();
}


export function drawDigitalPressureMeter(x, y, pressure) {
  push();
  fill(0);
  stroke(130);
  strokeWeight(1.5);
  rectMode(CENTER);
  rect(x, y, 24, 10, 5); 

  fill(0, 155, 0);
  noStroke();
  textSize(4);
  textAlign(CENTER, CENTER);
  text("P: " + nf(pressure, 1, 2), x, y);  
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
  const barSpacing = 8;
  const barWidth = 8;
  const labels = ["CaCO₃", "CaO", "CO₂"];
  const xOffset = -20;

  textAlign(CENTER, TOP);
  textSize(4);

  for (let i = 0; i < xTickCount; i++) {
    const xPos = i * (barSpacing + barWidth) + xOffset;
    stroke(0);
    line(xPos, 0, xPos, 1.5);
    noStroke();
    fill(0);
    text(labels[i], xPos, 3);
  }

  // Y-axis line
  stroke(40);
  strokeWeight(0.4);
  line(-30, 0, -30, -height - 8);

  // Ticks and labels
  textAlign(RIGHT, CENTER);
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

  // Axis label
  push();
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(3);
  text("equilibrium amount (mol)", -height + 65, -40);
  pop();

  // === Draw Bars ===
  const barColors = ["#3399ff", "#66cc33", "#ffff33"];
  const molValues = [
    window.state.caCO3_final || 0,
    window.state.caO_final || 0,
    window.state.cO2_final || 0
  ];

  for (let i = 0; i < xTickCount; i++) {
    const val = molValues[i];
    const barHeight = map(val, 0, maxValue, 0, height);
    const xPos = i * (barSpacing + barWidth) + xOffset;

    fill(barColors[i]);
    noStroke();
    rect(xPos - barWidth / 2, -barHeight, barWidth, barHeight);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(4);
    text(val.toFixed(2), xPos, -barHeight / 2);
  }

  pop();
}


export function drawLegend(x, y) {
  const spacing = 25;     
  const size = 4;         
  const textSizeValue = 3;

  noStroke();
  textSize(textSizeValue);
  textAlign(LEFT, CENTER);

  // CaCO₃
  fill(100, 149, 255, 255);  
  ellipse(x, y, size);
  fill(0);
  text("CaCO₃ (solid)", x + 3 , y);

  // CaO
  fill(102, 204, 51, 204);
  ellipse(x + spacing, y, size);
  fill(0);
  text("CaO (solid)", x + spacing + 3, y);

  // CO₂
  fill(255, 204, 0);  
  ellipse(x + spacing * 2, y, size);
  fill(0);
  text("CO₂ (gas)", x + spacing * 2+  3, y);
}

