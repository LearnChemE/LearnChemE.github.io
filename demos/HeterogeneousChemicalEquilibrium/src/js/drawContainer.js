
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


// Update the generateCaCO3Molecules function
export function generateCaCO3Molecules(count, radius, centerX, centerY) {
  const positions = [];
  const boundingRadius = radius * 0.93;
  
  // Updated layers with 10-8-6-4 distribution
  const layers = [
    { count: Math.min(10, count), rFactor: 0.88, angleRange: [PI/7, PI*4.5/5.5] }, // bottom layer (widest)
    { count: Math.min(8, Math.max(0, count-10)), rFactor: 0.82, angleRange: [PI/6, PI*4/5.5] },
    { count: Math.min(6, Math.max(0, count-18)), rFactor: 0.76, angleRange: [PI/4.5, PI*3.5/4.5] },
    { count: Math.min(4, Math.max(0, count-24)), rFactor: 0.70, angleRange: [PI/3, PI*3/3.8] } // top layer (narrowest)
  ];

  let moleculesPlaced = 0;
  
  for (const layer of layers) {
    if (moleculesPlaced >= count) break;
    
    const arcRadius = radius * layer.rFactor;
    const [startAngle, endAngle] = layer.angleRange;
    
    for (let i = 0; i < layer.count && moleculesPlaced < count; i++) {
      const angle = map(i, 0, layer.count - 1, startAngle, endAngle);
      const x = centerX + arcRadius * cos(angle);
      const y = centerY + arcRadius * sin(angle);
      
      if (dist(x, y, centerX, centerY) <= boundingRadius) {
        positions.push([x, y]);
        moleculesPlaced++;
      }
    }
  }
  
  // Distribute remaining randomly in bottom half but more tightly packed
  while (moleculesPlaced < count) {
    let px, py, tries = 0;
    do {
      const angle = random(PI/5, PI*4/5); 
      const r = random(0.7, 0.88) * radius; 
      px = centerX + r * cos(angle);
      py = centerY + r * sin(angle);
      tries++;
    } while ((dist(px, py, centerX, centerY) > boundingRadius) && tries < 100);
    
    positions.push([px, py]);
    moleculesPlaced++;
  }
  
  return positions;
}

// Similarly update generateCaOMolecules
export function generateCaOMolecules(count, radius, centerX, centerY) {
  const positions = [];
  const boundingRadius = radius * 0.93;
  
  // Slightly offset layers from CaCO3
  const layers = [
    { count: Math.min(9, count), rFactor: 0.86, angleRange: [PI/5.5, PI*4.5/5.5] },
    { count: Math.min(7, Math.max(0, count-9)), rFactor: 0.80, angleRange: [PI/4.8, PI*3.8/4.8] },
    { count: Math.min(5, Math.max(0, count-16)), rFactor: 0.74, angleRange: [PI/4.3, PI*3.3/4.3] },
    { count: Math.min(3, Math.max(0, count-21)), rFactor: 0.68, angleRange: [PI/4, PI*3/4] }
  ];

  let moleculesPlaced = 0;
  
  for (const layer of layers) {
    if (moleculesPlaced >= count) break;
    
    const arcRadius = radius * layer.rFactor;
    const [startAngle, endAngle] = layer.angleRange;
    
    for (let i = 0; i < layer.count && moleculesPlaced < count; i++) {
      const angle = map(i, 0, layer.count - 1, startAngle, endAngle);
      const x = centerX + arcRadius * cos(angle);
      const y = centerY + arcRadius * sin(angle);
      
      if (dist(x, y, centerX, centerY) <= boundingRadius) {
        positions.push([x, y]);
        moleculesPlaced++;
      }
    }
  }
  
  // Distribute remaining randomly but tightly packed
  while (moleculesPlaced < count) {
    let px, py, tries = 0;
    do {
      const angle = random(PI/5, PI*4/5);
      const r = random(0.68, 0.86) * radius;
      px = centerX + r * cos(angle);
      py = centerY + r * sin(angle);
      tries++;
    } while ((dist(px, py, centerX, centerY) > boundingRadius) && tries < 100);
    
    positions.push([px, py]);
    moleculesPlaced++;
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




export function drawDigitalPressureMeter(x, y, pressure) {
  push();
  fill(0); 
  stroke(130);
  strokeWeight(1.5);
  rectMode(CENTER);
  rect(x, y, 30, 12, 5); // slightly wider to accommodate "bar"

  fill(255); // white text for contrast
  noStroke();
  textSize(5.5);
  textAlign(CENTER, CENTER);
  const pressureText = Math.round(pressure) + " bar";
  text(pressureText, x, y);

  pop();
}



export function drawYAxis(x, y, height, maxValue = 4) {
  const tickCount = 4;
  const tickLength = 1;
  const labelOffset = 4;
  const barWidth = 16; 
  const axisExtension = 4; 

  push();
  translate(x - 6, y); 

  // Extended X-axis line
  stroke(40);
  strokeWeight(0.4);
  line(-30, 0, 25 + axisExtension, 0); 

  // X-axis labels (CaCO₃, CaO, CO₂)
  const labels = ["CaCO₃", "CaO", "CO₂"];
  const xOffset = -20;
  const barSpacing = 4;

  textAlign(CENTER, TOP);
  textSize(4);
  noStroke();
  fill(0);
  for (let i = 0; i < 3; i++) {
    const xPos = i * (barSpacing + barWidth) + xOffset;
    text(labels[i], xPos, 3);
  }

  // Y-axis line
  stroke(40);
  strokeWeight(0.4);
  line(-30, 0, -30, -height - 8);

  // Y-axis ticks and labels (0,1,2,3,4)
  textAlign(RIGHT, CENTER);
  textSize(4);
  fill(0);
  for (let i = 0; i <= tickCount; i++) {
    const val = (maxValue / tickCount) * i;
    const ty = map(i, 0, tickCount, 0, -height);
    stroke(0);
    line(-30, ty, -30 - tickLength, ty);
    noStroke();
    text(floor(val), -32, ty); 
  }

  // Axis label
  push();
  rotate(-HALF_PI);
  textAlign(CENTER, CENTER);
  textSize(3);
  text("equilibrium amount (mol)", -height + 65, -38);
  pop();

  // Draw bars
  const barColors = ["#3399ff", "#66cc33", "#ffff33"];
  const molValues = [
    window.state.caCO3_final || 0,
    window.state.caO_final || 0,
    window.state.cO2_final || 0
  ];

  for (let i = 0; i < 3; i++) {
    const val = molValues[i];
    const barHeight = map(val, 0, maxValue, 0, height);
    const xPos = i * (barSpacing + barWidth) + xOffset;

    fill(barColors[i]);
    noStroke();
    rect(xPos - barWidth/2, -barHeight, barWidth, barHeight);

    fill(0);
    textAlign(CENTER, CENTER);
    textSize(4);
    text(nf(val, 1, 2), xPos, -barHeight/2);
  }

  // Draw extension line
  stroke(40);
  strokeWeight(0.4);
  const lastBarX = 2 * (barSpacing + barWidth) + xOffset + barWidth/2;
  line(lastBarX, 0, lastBarX + axisExtension, 0);

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
  text("CaCO₃(solid)", x + 3 , y);

  // CaO
  fill(102, 204, 51, 204);
  ellipse(x + spacing, y, size -1);
  fill(0);
  text("CaO(solid)", x + spacing + 3, y);

  // CO₂
  fill(255, 255, 0);  
  ellipse(x + spacing*2, y, size -2);
  fill(0);
  text("CO₂(gas)", x + spacing * 2+  3, y);
}

