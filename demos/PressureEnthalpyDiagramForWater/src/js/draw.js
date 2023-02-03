function drawPlot(p) {
  const margins = gvs.plot.margins;
  const height = gvs.plot.height;
  const width = gvs.plot.width;
  const axes_range = gvs.plot.axes_range;
  const xMin = axes_range[0][0];
  const xMax = axes_range[0][1];
  const yMin = axes_range[1][0];
  const yMax = axes_range[1][1];

  p.push();
  p.fill(255);
  p.stroke(0);
  p.strokeWeight(0.5);
  p.line(margins[0][0], margins[1][0], margins[0][0], margins[1][0] + height);
  p.line(margins[0][0], margins[1][0], margins[0][0] + width, margins[1][0]);
  p.line(margins[0][0], margins[1][0] + height, margins[0][0] + width, margins[1][0] + height);
  p.line(margins[0][0] + width, margins[1][0], margins[0][0] + width, margins[1][0] + height);
  let y = axes_range[1][0];
  
  const gridStroke = 220;

  while(y < 0.1) {
    const coords1 = gvs.coordToPix(0, y);
    const coords2 = gvs.coordToPix(3500, y);
    let tickWidth;
    if(y === 0.01) {tickWidth = 8} else {tickWidth = 3}
    p.stroke(0);
    p.strokeWeight(1);
    p.line(coords1[0], coords1[1], coords1[0] + tickWidth, coords1[1]);
    p.line(coords2[0], coords2[1], coords2[0] - tickWidth, coords2[1]);
    if(gvs.plot.show_grid) {
      p.stroke(gridStroke);
      p.strokeWeight(0.5);
      p.line(coords1[0], coords1[1], coords2[0], coords1[1]);
    }
    y += 0.01;
    y = Math.round(y * 100) / 100;
  }

  while(y < 1) {
    const coords1 = gvs.coordToPix(0, y);
    const coords2 = gvs.coordToPix(3500, y);
    let tickWidth;
    if(y === 0.1) {tickWidth = 8} else {tickWidth = 3}
    p.stroke(0);
    p.strokeWeight(1);
    p.line(coords1[0], coords1[1], coords1[0] + tickWidth, coords1[1]);
    p.line(coords2[0], coords2[1], coords2[0] - tickWidth, coords2[1]);
    if(gvs.plot.show_grid) {
      p.stroke(gridStroke);
      p.strokeWeight(0.5);
      p.line(coords1[0], coords1[1], coords2[0], coords1[1]);
    }
    y += 0.1;
    y = Math.round(y * 10) / 10;
  }

  while(y < 10) {
    const coords1 = gvs.coordToPix(0, y);
    const coords2 = gvs.coordToPix(3500, y);
    let tickWidth;
    if(y === 1) {tickWidth = 8} else {tickWidth = 3}
    p.stroke(0);
    p.strokeWeight(1);
    p.line(coords1[0], coords1[1], coords1[0] + tickWidth, coords1[1]);
    p.line(coords2[0], coords2[1], coords2[0] - tickWidth, coords2[1]);
    if(gvs.plot.show_grid) {
      p.stroke(gridStroke);
      p.strokeWeight(0.5);
      p.line(coords1[0], coords1[1], coords2[0], coords1[1]);
    }
    y += 1;
    y = Math.round(y);
  }

  while(y < 100) {
    const coords1 = gvs.coordToPix(0, y);
    const coords2 = gvs.coordToPix(3500, y);
    let tickWidth;
    if(y === 10) {tickWidth = 8} else {tickWidth = 3}
    p.stroke(0);
    p.strokeWeight(1);
    p.line(coords1[0], coords1[1], coords1[0] + tickWidth, coords1[1]);
    p.line(coords2[0], coords2[1], coords2[0] - tickWidth, coords2[1]);
    if(gvs.plot.show_grid) {
      p.stroke(gridStroke);
      p.strokeWeight(0.5);
      p.line(coords1[0], coords1[1], coords2[0], coords1[1]);
    }
    y += 10;
    y = Math.round(y);
  }

  while(y < 1000) {
    const coords1 = gvs.coordToPix(0, y);
    const coords2 = gvs.coordToPix(3500, y);
    let tickWidth;
    if(y === 100) {tickWidth = 8} else {tickWidth = 3}
    p.stroke(0);
    p.strokeWeight(1);
    p.line(coords1[0], coords1[1], coords1[0] + tickWidth, coords1[1]);
    p.line(coords2[0], coords2[1], coords2[0] - tickWidth, coords2[1]);
    if(gvs.plot.show_grid) {
      p.stroke(gridStroke);
      p.strokeWeight(0.5);
      p.line(coords1[0], coords1[1], coords2[0], coords1[1]);
    }
    y += 100;
    y = Math.round(y);
  }

  while(y < 10000) {
    const coords1 = gvs.coordToPix(0, y);
    const coords2 = gvs.coordToPix(3500, y);
    let tickWidth;
    if(y === 1000) {tickWidth = 8} else {tickWidth = 3}
    p.stroke(0);
    p.strokeWeight(1);
    p.line(coords1[0], coords1[1], coords1[0] + tickWidth, coords1[1]);
    p.line(coords2[0], coords2[1], coords2[0] - tickWidth, coords2[1]);
    if(gvs.plot.show_grid) {
      p.stroke(gridStroke);
      p.strokeWeight(0.5);
      p.line(coords1[0], coords1[1], coords2[0], coords1[1]);
    }
    y += 1000;
    y = Math.round(y);
  }

  for(let x = 0; x <= 3500; x += 100) {
    const coords1 = gvs.coordToPix(x, 0.05);
    const coords2 = gvs.coordToPix(x, 10000);
    let tickWidth;
    if(x % 500 == 0) {
      tickWidth = 8
    } else {
      tickWidth = 3
    }
    p.stroke(0);
    p.strokeWeight(1);
    p.line(coords1[0], coords1[1], coords1[0], coords1[1] - tickWidth);
    p.line(coords2[0], coords2[1], coords2[0], coords2[1] + tickWidth);
    if(gvs.plot.show_grid) {
      p.stroke(gridStroke);
      p.strokeWeight(0.5);
      p.line(coords1[0], coords1[1], coords1[0], coords2[1]);
    }
  }

  p.pop();

}

function drawEnvelope(p) {
  p.push();
  p.stroke(0);
  p.strokeWeight(2);
  p.noFill();
  
  const Q0 = gvs.coords.Q0;
  const Q100 = gvs.coords.Q100;
  
  p.beginShape();
  for(let i = 0; i < Q0.length; i++) {
    const coord = Q0[i];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();
  
  p.beginShape();
  for(let i = 0; i < Q100.length; i++) {
    const coord = Q100[i];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();
  
  p.pop();
}

function drawQuality(p) {
  p.push();
  p.noFill();
  p.stroke(0, 0, 150);
  p.strokeWeight(1);
  for(let i = 10; i <= 90; i += 10) {
    const variable_name = `Q${Math.round(i)}`;
    const quality_array = gvs.coords[variable_name];
    p.beginShape();
    for(let j = 0; j < quality_array.length; j++) {
      const coord = quality_array[j];
      const pix = gvs.coordToPix(coord[0], coord[1]);
      p.vertex(pix[0], pix[1]);
    }
    p.endShape();
  }
  p.pop();
}

function drawTemperature(p) {
  p.push();
  p.noFill();
  p.stroke(255, 0, 0);
  p.strokeWeight(1);
  for(let i = 50; i <= 550; i += 50) {
    if(i == 200) {i += 50}
    const variable_name = `T${Math.round(i)}`;
    const temperature_array = gvs.coords[variable_name];
    p.beginShape();
    for(let j = 0; j < temperature_array.length; j++) {
      const coord = temperature_array[j];
      const pix = gvs.coordToPix(coord[0], coord[1]);
      p.vertex(pix[0], pix[1]);
    }
    p.endShape();
  }
  p.pop();
}

function drawCritical(p) {
  p.push();
  p.noFill();
  p.strokeWeight(2);
  p.stroke(100, 0, 255);
  const temperature_array = gvs.coords.Tc;
  p.beginShape();
  for(let j = 0; j < temperature_array.length; j++) {
    const coord = temperature_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();
  p.pop();
}

function drawDensity(p) {
  p.push();
  p.noFill();
  p.stroke(155, 155, 0);
  p.strokeWeight(1);
  
  let density_array = gvs.coords.Rho1000;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho950;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho900;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();
  
  density_array = gvs.coords.Rho800;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho700;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho600;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho400;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho200;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho50;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho10;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho2;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho02;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  density_array = gvs.coords.Rho002;
  p.beginShape();
  for(let j = 0; j < density_array.length; j++) {
    const coord = density_array[j];
    const pix = gvs.coordToPix(coord[0], coord[1]);
    p.vertex(pix[0], pix[1]);
  }
  p.endShape();

  p.pop();
}

function drawEntropy(p) {
  p.push();
  p.noFill();
  p.stroke(255, 0, 155);
  p.strokeWeight(1);
  for(let i = 5; i <= 85; i += 5) {
    const variable_name = `S${Math.round(i)}`;
    const entropy_array = gvs.coords[variable_name];
    p.beginShape();
    for(let j = 0; j < entropy_array.length; j++) {
      const coord = entropy_array[j];
      const pix = gvs.coordToPix(coord[0], coord[1]);
      p.vertex(pix[0], pix[1]);
    }
    p.endShape();
  }
  p.pop();
}

function drawLabels(p) {
  p.push();
  p.noStroke();
  p.fill(253);
  p.rectMode(p.CORNERS);
  p.rect(gvs.plot.margins[0][0] + gvs.plot.width + 1, 0, p.width, p.height);
  p.rect(0, gvs.plot.margins[1][0] + gvs.plot.height + 1, p.width, p.height);
  p.pop();

  p.push();
  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
  for(let x = 0; x <= 3500; x += 500) {
    const coords = gvs.coordToPix(x, 0.05);
    p.text(`${Math.round(x)}`, coords[0], coords[1] + 15);
  }

  p.textAlign(p.RIGHT, p.CENTER);
  for(let exp = -1; exp <= 4; exp++) {
    const y = 10**exp;
    const coords = gvs.coordToPix(0, y);
    p.text(`${Math.round(y * 10) / 10}`, coords[0] - 5, coords[1]);
  }

  p.textAlign(p.CENTER, p.CENTER);
  p.translate(p.width / 2 + 20, p.height - 30);
  p.text("enthalpy (kJ/kg)", 0, 0);
  p.translate(-1 * p.width / 2 + 20, -1 * p.height / 2 + 10);
  p.rotate(-1 * Math.PI / 2);
  p.text("pressure (bar)", 0, 0);
  p.pop();
}

function drawAll(p) {
  drawPlot(p);
  drawEnvelope(p);
  drawQuality(p);
  drawTemperature(p);
  drawCritical(p);
  drawDensity(p);
  drawEntropy(p);
  drawLabels(p);
}

module.exports = drawAll;