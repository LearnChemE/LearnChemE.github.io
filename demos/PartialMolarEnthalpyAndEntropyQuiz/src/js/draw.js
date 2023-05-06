const xMin = gvs.plot.domain[0];
const xMax = gvs.plot.domain[1];
const xStepMajor = gvs.plot.domain[2];
const xStepMinor = gvs.plot.domain[3];
const yMin = gvs.plot.range[0];
const yMax = gvs.plot.range[1];
const yStepMajor = gvs.plot.range[2];
const yStepMinor = gvs.plot.range[3];

const margin_left = gvs.plot.margins[0][0];
const margin_right = gvs.plot.margins[0][1];
const margin_top = gvs.plot.margins[1][0];
const margin_bottom = gvs.plot.margins[1][1];
const plot_width = gvs.p.width - margin_left - margin_right;
const plot_height = gvs.p.height - margin_bottom - margin_top;

function coordToPix(x, y) {

  const xPix = margin_left + ((x - xMin) / (xMax - xMin)) * plot_width;
  const yPix = margin_top + plot_height - ((y - yMin) / (yMax - yMin)) * plot_height;
  
  return [xPix, yPix]
}

function drawAxes(p) {
  p.push();
  const topLeft = coordToPix(gvs.plot.domain[0], gvs.plot.range[1]);
  const bottomLeft = coordToPix(gvs.plot.domain[0], gvs.plot.range[0]);
  const topRight = coordToPix(gvs.plot.domain[1], gvs.plot.range[1]);
  const bottomRight = coordToPix(gvs.plot.domain[1], gvs.plot.range[0]);

  p.stroke(0);
  p.strokeWeight(1);
  p.noFill();
  p.line(topLeft[0], topLeft[1], bottomLeft[0], bottomLeft[1]);
  p.line(topLeft[0], topLeft[1], topRight[0], topRight[1]);
  p.line(topRight[0], topRight[1], bottomRight[0], bottomRight[1]);
  p.line(bottomLeft[0], bottomLeft[1], bottomRight[0], bottomRight[1]);

  for(let x = xMin; x <= xMax; x += xStepMinor) {
    x = Math.round(100 * x) / 100;
    const pix_bottom = coordToPix(x, gvs.plot.range[0]);
    const pix_top = coordToPix(x, gvs.plot.range[1]);
    let tickLength;
    if(Math.round(((x - xMin) % xStepMajor) * 100) / 100 === 0 || Math.round(((x - xMin) % xStepMajor) * 100) / 100 === xStepMajor) {
      tickLength = 8;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.CENTER, p.TOP);
      p.textSize(14);
      p.text(`${x.toFixed(1)}`, pix_bottom[0], pix_bottom[1] + 5);
      p.stroke(0);
      p.noFill();
    } else {
      tickLength = 4;
    }
    if(tickLength === 8 && x !== xMin && x !== xMax) {
      p.stroke(220);
      p.line(pix_bottom[0], pix_bottom[1], pix_bottom[0], pix_top[1]);
    } else if(x !== xMin && x !== xMax) {
      p.stroke(240);
      p.line(pix_bottom[0], pix_bottom[1], pix_bottom[0], pix_top[1]);
    }
    p.stroke(0);
    p.line(pix_bottom[0], pix_bottom[1], pix_bottom[0], pix_bottom[1] - tickLength);
    p.line(pix_top[0], pix_top[1], pix_top[0], pix_top[1] + tickLength);
  }

  for(let y = yMin; y <= yMax; y += yStepMinor) {
    y = Math.round(y);
    const pix_left = coordToPix(0, y);
    const pix_right = coordToPix(1, y);
    let tickLength;
    if(Math.round((y - yMin) % yStepMajor) === 0 || Math.round((y - yMin) % yStepMajor) === yStepMajor) {
      tickLength = 8;
      p.noStroke();
      p.fill(0);
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(14);
      p.text(`${y.toFixed(0)}`, pix_left[0] - 5, pix_left[1]);
      p.stroke(0);
      p.noFill();
    } else {
      tickLength = 4;
    }
    if(tickLength === 8 && y !== yMin && y !== yMax) {
      p.stroke(220);
      p.line(pix_left[0], pix_left[1], pix_right[0], pix_left[1]);
    } else if(y !== yMin && y !== yMax) {
      p.stroke(240);
      p.line(pix_left[0], pix_left[1], pix_right[0], pix_left[1]);
    }
    p.stroke(0);
    p.line(pix_left[0], pix_left[1], pix_left[0] + tickLength, pix_left[1]);
    p.line(pix_right[0], pix_right[1], pix_right[0] - tickLength, pix_right[1]);
  }

  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(16);
  const bottomLabelCoords = coordToPix((xMin + xMax) / 2, yMin);
  const leftLabelCoords = coordToPix(xMin, (yMin + yMax) / 2);
  p.text(gvs.plot.labels[1][1], bottomLabelCoords[0], bottomLabelCoords[1] + 40);
  p.translate(leftLabelCoords[0], leftLabelCoords[1]);
  p.rotate(-1 * Math.PI / 2);
  p.text(gvs.plot.labels[0][0], 0, -60);
  p.pop();
}

function drawInstructions(p) {
  p.push();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(15);
  p.translate(p.width / 2, 30);
  let instructions_text;
  switch(gvs.step) {
    case 1:
      instructions_text = `step 1. Locate the pure component enthalpy of component A`;
      break;
    case 2:
      instructions_text = `step 2. Locate the pure component enthalpy of component B`;
      break;
    case 3:
      instructions_text = `step 3. Determine the mixture enthalpy`;
      break;
    case 4:
      instructions_text = `step 4. Move the line to represent the ideal mixing curve`;
      break;
    case 5:
      instructions_text = `step 5. Move the solid black dot to calculate excess enthalpy,\nthen input your answer into the input box below`;
      break;
    case 6:
      instructions_text = `step 6. Determine temperature change for adiabatic mixing at the heat capacity\nC  = 0.05 kJ/[mol K], then input your answer into the input box below`;
      break;
    case 7:
      instructions_text = `step 7. Determine the partial molar enthalpy for each\ncomponent by sliding the points along the y-axis`;
  }
  p.text(instructions_text, 0, 0);
  p.pop();
}

function drawAll(p) {
  drawAxes(p);
  drawInstructions(p);
}

module.exports = drawAll;