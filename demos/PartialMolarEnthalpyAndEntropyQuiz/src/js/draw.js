let xMin, xMax, xStepMajor, xStepMinor, yMin, yMax, yStepMajor, yStepMinor, margin_left, margin_right, margin_top, margin_bottom, plot_width, plot_height, pointDiameter;

function determineGraphingParameters() {
  xMin = gvs.plot.domain[0];
  xMax = gvs.plot.domain[1];
  xStepMajor = gvs.plot.domain[2];
  xStepMinor = gvs.plot.domain[3];
  yMin = gvs.plot.range[0];
  yMax = gvs.plot.range[1];
  yStepMajor = gvs.plot.range[2];
  yStepMinor = gvs.plot.range[3];
  
  margin_left = gvs.plot.margins[0][0];
  margin_right = gvs.plot.margins[0][1];
  margin_top = gvs.plot.margins[1][0];
  margin_bottom = gvs.plot.margins[1][1];
  plot_width = gvs.p.width - margin_left - margin_right;
  plot_height = gvs.p.height - margin_bottom - margin_top;
}

pointDiameter = 10;

function coordToPix(x, y) {
  const xPix = margin_left + ((x - xMin) / (xMax - xMin)) * plot_width;
  const yPix = margin_top + plot_height - ((y - yMin) / (yMax - yMin)) * plot_height;
  
  return [xPix, yPix]
}

function pixToCoord(x, y) {
  const xCoord = xMin + ((x - margin_left) / plot_width) * (xMax - xMin);
  const yCoord = yMin + ((margin_top + plot_height - y) / plot_height) * (yMax - yMin);

  return [xCoord, yCoord]
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
  if(gvs.HS === "enthalpy") {
    switch(gvs.step) {
      case 1:
        instructions_text = `step 1. Locate the pure component enthalpy of component A`;
        break;
      case 2:
        instructions_text = `step 2. Locate the pure component enthalpy of component B`;
        break;
      case 3:
        instructions_text = `step 3. Determine the mixture enthalpy, given that\nthe mole fraction of A in the mixture is ${gvs.randx}`;
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
  } else {
    switch(gvs.step) {
      case 1:
        instructions_text = `step 1. Locate the pure component entropy of component A`;
        break;
      case 2:
        instructions_text = `step 2. Locate the pure component entropy of component B`;
        break;
      case 3:
        instructions_text = `step 3. Determine the mixture entropy, given that\nthe mole fraction of A in the mixture is ${gvs.randx}`;
        break;
      case 4:
        instructions_text = `step 4. Move the solid dot to find excess entropy relative to ideal\nmixing (black curve), then input your answer into the input box below`;
        break;
      case 5:
        instructions_text = `step 5. Determine the partial molar entropy for each\ncomponent by sliding the points along the y axis.`;
        break;
      case 6:
        instructions_text = ``;
        break;
      case 7:
        instructions_text = ``;
    }
  }
  p.text(instructions_text, 0, 0);
  p.pop();
}

function drawCurve(p) {
  p.push();
  p.noFill();
  p.stroke(0, 0, 255);
  p.strokeWeight(2);
  p.beginShape();
  if(gvs.HS === "enthalpy") {
    const coord1 = coordToPix(0, gvs.hB);
    const coord2 = coordToPix(1, gvs.hA);
    p.vertex(coord1[0], coord1[1]);
    for(let x = 0.01; x <= 0.99; x += 0.01) {
      x = Math.round(100 * x) / 100;
      const pix = coordToPix(x, gvs.molarH(x));
      p.vertex(pix[0], pix[1]);
    }
    p.vertex(coord2[0], coord2[1]);
  } else {
    const coord1 = coordToPix(0, gvs.sB);
    const coord2 = coordToPix(1, gvs.sA);
    p.vertex(coord1[0], coord1[1]);
    for(let x = 0; x <= 0.99; x += 0.01) {
      x = Math.round(100 * x) / 100;
      const pix = coordToPix(x, gvs.molarS(x));
      p.vertex(pix[0], pix[1]);
    }
    p.vertex(coord2[0], coord2[1]);
  }
  p.endShape();
  p.pop();
}

function textBoxShift(xCoord, yCoord, textWidth, textHeight) {
  const x_shift = ((margin_left + plot_width / 2 - xCoord) / (plot_width / 2)) * (textWidth / 2 + 10)
  let y_shift;
  let xyB, xyA;
  if(gvs.HS === "enthalpy") {
    xyB = coordToPix(0, gvs.hB)[1];
    xyA = coordToPix(1, gvs.hA)[1];
  } else {
    xyB = coordToPix(0, gvs.sB)[1];
    xyA = coordToPix(1, gvs.sA)[1];
  }
  const x = (xCoord - margin_left) / plot_width;
  const ySwitch = (1 - x) * xyB + x * xyA;
  if(yCoord < ySwitch) {
    y_shift = -0.5 * textHeight - 10;
  } else {
    y_shift = 0.5 * textHeight + 10;
  }
  return [x_shift, y_shift]
}

function step1(p) {
  p.push();
  let locPix;
  p.noStroke();
  if(!gvs.show_solution) {
    const mousePix = [p.mouseX, p.mouseY];
    if(gvs.HS === "enthalpy") {
      locPix = coordToPix(gvs.loc_H_1[0], gvs.loc_H_1[1]);
    } else {
      locPix = coordToPix(gvs.loc_S_1[0], gvs.loc_S_1[1]);
    }
    const distance = Math.sqrt((mousePix[0] - locPix[0])**2 + (mousePix[1] - locPix[1])**2);
    if(p.mouseIsPressed && distance < 10) {
      gvs.dragging_loc_1 = true;
    }
    if(!p.mouseIsPressed) {
      gvs.dragging_loc_1 = false;
    }
    if(gvs.dragging_loc_1) {
      locPix = mousePix;
      locPix[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix[0]));
      locPix[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix[1]));
    }
    const locCoords = pixToCoord(locPix[0], locPix[1]);
    if(gvs.HS === "enthalpy") {
      if(gvs.dragging_loc_1) {
        gvs.loc_H_1 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    } else {
      if(gvs.dragging_loc_1) {
        gvs.loc_S_1 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    }
    p.fill(0);
  } else {
    let answerPix;
    if(gvs.HS === "enthalpy") {
      answerPix = coordToPix(gvs.answer_H_1[0], gvs.answer_H_1[1]);
    } else {
      answerPix = coordToPix(gvs.answer_S_1[0], gvs.answer_S_1[1]);
    }
    locPix = answerPix;
    p.fill(0, 150, 0);
  }
  p.circle(locPix[0], locPix[1], pointDiameter);
  p.fill(253);
  p.rectMode(p.CENTER);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(15);
  let labelText;
  let textLength;
  if(gvs.HS === "enthalpy") {
    labelText = `z   = ${(Math.round(100 * gvs.loc_H_1[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.loc_H_1[1]) / 10).toFixed(1)} kJ/mol`;
    textLength = p.textWidth(`H = ${(Math.round(10 * gvs.loc_H_1[1]) / 10).toFixed(1)} kJ/mol`);
    if(gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_H_1[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_H_1[1]) / 10).toFixed(1)} kJ/mol`
    }
  } else {
    labelText = `z   = ${(Math.round(100 * gvs.loc_S_1[0]) / 100).toFixed(2)}\nS = ${(Math.round(gvs.loc_S_1[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    textLength = p.textWidth(`S = ${(Math.round(10 * gvs.loc_S_1[1]) / 10).toFixed(1)} J/(mol K)`);
    if(gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_S_1[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_S_1[1]) / 10).toFixed(1)} kJ/mol`
    }
  }
  const offset = textBoxShift(locPix[0], locPix[1], textLength + 10, 40);
  const x = locPix[0] + offset[0];
  const y = locPix[1] + offset[1];
  p.noStroke();
  p.rect(x, y, textLength + 10, 40);
  if(gvs.show_solution) {
    p.fill(0, 150, 0);
  } else {
    p.fill(0);
  }
  p.text(labelText, x - textLength / 2, y);
  p.textSize(10);
  p.text("A", x - textLength / 2 + 9, y - 4);
  p.pop();
}

function step2(p) {
  p.push();
  let locPix;
  p.noStroke();
  if(!gvs.show_solution) {
    const mousePix = [p.mouseX, p.mouseY];
    if(gvs.HS === "enthalpy") {
      locPix = coordToPix(gvs.loc_H_2[0], gvs.loc_H_2[1]);
    } else {
      locPix = coordToPix(gvs.loc_S_2[0], gvs.loc_S_2[1]);
    }
    const distance = Math.sqrt((mousePix[0] - locPix[0])**2 + (mousePix[1] - locPix[1])**2);
    if(p.mouseIsPressed && distance < 10) {
      gvs.dragging_loc_1 = true;
    }
    if(!p.mouseIsPressed) {
      gvs.dragging_loc_1 = false;
    }
    if(gvs.dragging_loc_1) {
      locPix = mousePix;
      locPix[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix[0]));
      locPix[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix[1]));
    }
    const locCoords = pixToCoord(locPix[0], locPix[1]);
    if(gvs.HS === "enthalpy") {
      if(gvs.dragging_loc_1) {
        gvs.loc_H_2 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    } else {
      if(gvs.dragging_loc_1) {
        gvs.loc_S_2 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    }
    p.fill(0);
  } else {
    let answerPix;
    if(gvs.HS === "enthalpy") {
      answerPix = coordToPix(gvs.answer_H_2[0], gvs.answer_H_2[1]);
    } else {
      answerPix = coordToPix(gvs.answer_S_2[0], gvs.answer_S_2[1]);
    }
    locPix = answerPix;
    p.fill(0, 150, 0);
  }
  p.circle(locPix[0], locPix[1], pointDiameter);
  p.fill(253);
  p.rectMode(p.CENTER);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(15);
  let labelText;
  let textLength;
  if(gvs.HS === "enthalpy") {
    labelText = `z   = ${(Math.round(100 * gvs.loc_H_2[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.loc_H_2[1]) / 10).toFixed(1)} kJ/mol`;
    textLength = p.textWidth(`H = ${(Math.round(10 * gvs.loc_H_2[1]) / 10).toFixed(1)} kJ/mol`);
    if(gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_H_2[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_H_2[1]) / 10).toFixed(1)} kJ/mol`
    }
  } else {
    labelText = `z   = ${(Math.round(100 * gvs.loc_S_2[0]) / 100).toFixed(2)}\nS = ${(Math.round(gvs.loc_S_2[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    textLength = p.textWidth(`S = ${(Math.round(10 * gvs.loc_S_2[1]) / 10).toFixed(1)} J/(mol K)`);
    if(gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_S_2[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_S_2[1]) / 10).toFixed(1)} kJ/mol`
    }
  }
  const offset = textBoxShift(locPix[0], locPix[1], textLength + 10, 40);
  const x = locPix[0] + offset[0];
  const y = locPix[1] + offset[1];
  p.noStroke();
  p.rect(x, y, textLength + 10, 40);
  if(gvs.show_solution) {
    p.fill(0, 150, 0);
  } else {
    p.fill(0);
  }
  p.text(labelText, x - textLength / 2, y);
  p.textSize(10);
  p.text("A", x - textLength / 2 + 9, y - 4);
  p.pop();
}

function step3(p) {
  p.push();
  let locPix;
  p.noStroke();
  if(!gvs.show_solution) {
    const mousePix = [p.mouseX, p.mouseY];
    if(gvs.HS === "enthalpy") {
      locPix = coordToPix(gvs.loc_H_3[0], gvs.loc_H_3[1]);
    } else {
      locPix = coordToPix(gvs.loc_S_3[0], gvs.loc_S_3[1]);
    }
    const distance = Math.sqrt((mousePix[0] - locPix[0])**2 + (mousePix[1] - locPix[1])**2);
    if(p.mouseIsPressed && distance < 10) {
      gvs.dragging_loc_1 = true;
    }
    if(!p.mouseIsPressed) {
      gvs.dragging_loc_1 = false;
    }
    if(gvs.dragging_loc_1) {
      locPix = mousePix;
      locPix[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix[0]));
      locPix[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix[1]));
    }
    const locCoords = pixToCoord(locPix[0], locPix[1]);
    if(gvs.HS === "enthalpy") {
      if(gvs.dragging_loc_1) {
        gvs.loc_H_3 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    } else {
      if(gvs.dragging_loc_1) {
        gvs.loc_S_3 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    }
    p.fill(0);
  } else {
    let answerPix;
    if(gvs.HS === "enthalpy") {
      answerPix = coordToPix(gvs.answer_H_3[0], gvs.answer_H_3[1]);
    } else {
      answerPix = coordToPix(gvs.answer_S_3[0], gvs.answer_S_3[1]);
    }
    locPix = answerPix;
    p.fill(0, 150, 0);
  }
  p.circle(locPix[0], locPix[1], pointDiameter);
  p.fill(253);
  p.rectMode(p.CENTER);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(15);
  let labelText;
  let textLength;
  if(gvs.HS === "enthalpy") {
    labelText = `z   = ${(Math.round(100 * gvs.loc_H_3[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.loc_H_3[1]) / 10).toFixed(1)} kJ/mol`;
    textLength = p.textWidth(`H = ${(Math.round(10 * gvs.loc_H_3[1]) / 10).toFixed(1)} kJ/mol`);
    if(gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_H_3[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_H_3[1]) / 10).toFixed(1)} kJ/mol`
    }
  } else {
    labelText = `z   = ${(Math.round(100 * gvs.loc_S_3[0]) / 100).toFixed(2)}\nS = ${(Math.round(gvs.loc_S_3[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    textLength = p.textWidth(`S = ${(Math.round(10 * gvs.loc_S_3[1]) / 10).toFixed(1)} J/(mol K)`);
    if(gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_S_3[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_S_3[1]) / 10).toFixed(1)} kJ/mol`
    }
  }
  const offset = textBoxShift(locPix[0], locPix[1], textLength + 10, 40);
  const x = locPix[0] + offset[0];
  const y = locPix[1] + offset[1];
  p.noStroke();
  p.rect(x, y, textLength + 10, 40);
  if(gvs.show_solution) {
    p.fill(0, 150, 0);
  } else {
    p.fill(0);
  }
  p.text(labelText, x - textLength / 2, y);
  p.textSize(10);
  p.text("A", x - textLength / 2 + 9, y - 4);
  p.pop();
}

function step4(p) {
  p.push();

  p.pop();
}

function step5(p) {
  p.push();

  p.pop();
}

function step6(p) {
  p.push();

  p.pop();
}

function step7(p) {
  p.push();

  p.pop();
}

function drawAll(p) {
  determineGraphingParameters()
  drawAxes(p);
  drawCurve(p);
  drawInstructions(p);
  switch(gvs.step) {
    case 1: step1(p); break;
    case 2: step2(p); break;
    case 3: step3(p); break;
    case 4: step4(p); break;
    case 5: step5(p); break;
    case 6: step6(p); break;
    case 7: step7(p); break;
  }
}

module.exports = drawAll;