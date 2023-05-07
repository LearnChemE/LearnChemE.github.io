let xMin, xMax, xStepMajor, xStepMinor, yMin, yMax, yStepMajor, yStepMinor, margin_left, margin_right, margin_top, margin_bottom, plot_width, plot_height, pointDiameter;

const answerColor = "rgb(0, 140, 0)";

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

  for (let x = xMin; x <= xMax; x += xStepMinor) {
    x = Math.round(100 * x) / 100;
    const pix_bottom = coordToPix(x, gvs.plot.range[0]);
    const pix_top = coordToPix(x, gvs.plot.range[1]);
    let tickLength;
    if (Math.round(((x - xMin) % xStepMajor) * 100) / 100 === 0 || Math.round(((x - xMin) % xStepMajor) * 100) / 100 === xStepMajor) {
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
    if (tickLength === 8 && x !== xMin && x !== xMax) {
      p.stroke(220);
      p.line(pix_bottom[0], pix_bottom[1], pix_bottom[0], pix_top[1]);
    } else if (x !== xMin && x !== xMax) {
      p.stroke(240);
      p.line(pix_bottom[0], pix_bottom[1], pix_bottom[0], pix_top[1]);
    }
    p.stroke(0);
    p.line(pix_bottom[0], pix_bottom[1], pix_bottom[0], pix_bottom[1] - tickLength);
    p.line(pix_top[0], pix_top[1], pix_top[0], pix_top[1] + tickLength);
  }

  for (let y = yMin; y <= yMax; y += yStepMinor) {
    y = Math.round(y);
    const pix_left = coordToPix(0, y);
    const pix_right = coordToPix(1, y);
    let tickLength;
    if (Math.round((y - yMin) % yStepMajor) === 0 || Math.round((y - yMin) % yStepMajor) === yStepMajor) {
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
    if (tickLength === 8 && y !== yMin && y !== yMax) {
      p.stroke(220);
      p.line(pix_left[0], pix_left[1], pix_right[0], pix_left[1]);
    } else if (y !== yMin && y !== yMax) {
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
  if (gvs.HS === "enthalpy") {
    switch (gvs.step) {
      case 1:
        instructions_text = `step 1. Locate the pure component enthalpy of component A \nby dragging the black dot to the correct location.`;
        break;
      case 2:
        instructions_text = `step 2. Locate the pure component enthalpy of component B \nby dragging the black dot to the correct location.`;
        break;
      case 3:
        instructions_text = `step 3. Determine the mixture enthalpy, given that\nthe mole fraction of A in the mixture is ${gvs.randx}`;
        break;
      case 4:
        instructions_text = `step 4. Move the line to represent the ideal mixing curve by dragging the black dots.`;
        break;
      case 5:
        instructions_text = `step 5. Move the black dot to calculate excess enthalpy,\nthen input your answer into the input box below`;
        break;
      case 6:
        instructions_text = `step 6. Determine temperature change for adiabatic mixing at the heat capacity\nC   = ${gvs.cp.toFixed(2)} kJ/[mol K], then input your answer into the input box below`;
        break;
      case 7:
        if(gvs.show_solution) {
          instructions_text = `You have finished this quiz simulation. Click "new problem" to\ntry this exercise again with entropy instead of enthalpy.`
        } else {
          instructions_text = `step 7. Determine the partial molar enthalpy for each component by sliding the\npoints along the y-axis. The white dot represents the mixture enthalpy.`;
        }
        break;
    }
  } else {
    switch (gvs.step) {
      case 1:
        instructions_text = `step 1. Locate the pure component entropy of component A \nby dragging the black dot to the correct location.`;
        break;
      case 2:
        instructions_text = `step 2. Locate the pure component entropy of component B \nby dragging the black dot to the correct location.`;
        break;
      case 3:
        instructions_text = `step 3. Determine the mixture entropy, given that\nthe mole fraction of A in the mixture is ${gvs.randx}`;
        break;
      case 4:
        instructions_text = `step 4. Move the black dot to find excess entropy relative to ideal\nmixing (black curve), then input your answer into the input box below`;
        break;
      case 5:
        if(gvs.show_solution) {
          instructions_text = `You have finished this quiz simulation. Click "new problem" to\ntry this exercise again with enthalpy instead of entropy.`
        } else {
          instructions_text = `step 5. Determine the partial molar entropy for each component by sliding the\npoints along the y axis. The white dot represents the mixture entropy.`;
        }
        break;
      case 6:
        instructions_text = ``;
        break;
      case 7:
        instructions_text = ``;
        break;
    }
  }
  p.text(instructions_text, 0, 0);
  if (gvs.step === 6) {
    p.textSize(10);
    p.text("P", -213, 14);
  }
  p.pop();
}

function drawCurve(p) {
  p.push();
  p.noFill();
  p.stroke(0, 0, 255);
  p.strokeWeight(2);
  p.beginShape();
  if (gvs.HS === "enthalpy") {
    const coord1 = coordToPix(0, gvs.hB);
    const coord2 = coordToPix(1, gvs.hA);
    p.vertex(coord1[0], coord1[1]);
    for (let x = 0.01; x <= 0.99; x += 0.01) {
      x = Math.round(100 * x) / 100;
      const pix = coordToPix(x, gvs.molarH(x));
      p.vertex(pix[0], pix[1]);
    }
    p.vertex(coord2[0], coord2[1]);
  } else {
    const coord1 = coordToPix(0, gvs.sB);
    const coord2 = coordToPix(1, gvs.sA);
    p.vertex(coord1[0], coord1[1]);
    for (let x = 0; x <= 0.99; x += 0.01) {
      x = Math.round(100 * x) / 100;
      const pix = coordToPix(x, gvs.molarS2(x));
      p.vertex(pix[0], pix[1]);
    }
    p.vertex(coord2[0], coord2[1]);
  }
  p.endShape();
  p.pop();
}

function textBoxShift(xPix, yPix, textWidth, textHeight) {
  const x_shift = ((margin_left + plot_width / 2 - xPix) / (plot_width / 2)) * (textWidth / 2 + 10)
  let y_shift;
  const xCoord = pixToCoord(xPix, yPix)[0];
  let ySwitch = gvs.HS === "enthalpy" ? coordToPix(xCoord, gvs.molarH(xCoord))[1] : coordToPix(xCoord, gvs.molarS2(xCoord))[1];
  if (gvs.HS === "enthalpy" && gvs.molarH(gvs.randx) > gvs.hB + gvs.randx * (gvs.hA - gvs.hB)) {
    ySwitch += 5
  } else {
    ySwitch -= 5
  }
  if (gvs.HS === "entropy" && (gvs.molarS(xCoord) > gvs.molarS2(xCoord)) && gvs.step === 4) {
    ySwitch -= 10
  }
  if (gvs.HS === "entropy" && (gvs.molarS(xCoord) < gvs.molarS2(xCoord)) && gvs.step === 4) {
    ySwitch += 10
  }
  if (yPix < ySwitch) {
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
  if (!gvs.show_solution) {
    const mousePix = [p.mouseX, p.mouseY];
    if (gvs.HS === "enthalpy") {
      locPix = coordToPix(gvs.loc_H_1[0], gvs.loc_H_1[1]);
    } else {
      locPix = coordToPix(gvs.loc_S_1[0], gvs.loc_S_1[1]);
    }
    const distance = Math.sqrt((mousePix[0] - locPix[0]) ** 2 + (mousePix[1] - locPix[1]) ** 2);
    if (p.mouseIsPressed && distance < 10) {
      gvs.dragging_loc_1 = true;
    }
    if (!p.mouseIsPressed) {
      gvs.dragging_loc_1 = false;
    }
    if (gvs.dragging_loc_1) {
      locPix = mousePix;
      locPix[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix[0]));
      locPix[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix[1]));
    }
    const locCoords = pixToCoord(locPix[0], locPix[1]);
    if (gvs.HS === "enthalpy") {
      if (gvs.dragging_loc_1) {
        gvs.loc_H_1 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    } else {
      if (gvs.dragging_loc_1) {
        gvs.loc_S_1 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    }
    p.fill(0);
  } else {
    let answerPix;
    if (gvs.HS === "enthalpy") {
      answerPix = coordToPix(gvs.answer_H_1[0], gvs.answer_H_1[1]);
    } else {
      answerPix = coordToPix(gvs.answer_S_1[0], gvs.answer_S_1[1]);
    }
    locPix = answerPix;
    p.fill(answerColor);
  }
  p.circle(locPix[0], locPix[1], pointDiameter);
  p.fill(253);
  p.rectMode(p.CENTER);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(15);
  let labelText;
  let textLength;
  if (gvs.HS === "enthalpy") {
    labelText = `z   = ${(Math.round(100 * gvs.loc_H_1[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.loc_H_1[1]) / 10).toFixed(1)} kJ/mol`;
    textLength = p.textWidth(`H = ${(Math.round(10 * gvs.loc_H_1[1]) / 10).toFixed(1)} kJ/mol`);
    if (gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_H_1[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_H_1[1]) / 10).toFixed(1)} kJ/mol`
    }
  } else {
    labelText = `z   = ${(Math.round(100 * gvs.loc_S_1[0]) / 100).toFixed(2)}\nS = ${(Math.round(gvs.loc_S_1[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    textLength = p.textWidth(`S = ${(Math.round(10 * gvs.loc_S_1[1]) / 10).toFixed(1)} J/(mol K)`);
    if (gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_S_1[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_S_1[1]) / 10).toFixed(1)} kJ/mol`
    }
  }
  const offset = textBoxShift(locPix[0], locPix[1], textLength + 10, 40);
  const x = locPix[0] + offset[0];
  const y = locPix[1] + offset[1];
  p.noStroke();
  p.rect(x, y, textLength + 10, 40);
  if (gvs.show_solution) {
    p.fill(answerColor);
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
  if (!gvs.show_solution) {
    const mousePix = [p.mouseX, p.mouseY];
    if (gvs.HS === "enthalpy") {
      locPix = coordToPix(gvs.loc_H_2[0], gvs.loc_H_2[1]);
    } else {
      locPix = coordToPix(gvs.loc_S_2[0], gvs.loc_S_2[1]);
    }
    const distance = Math.sqrt((mousePix[0] - locPix[0]) ** 2 + (mousePix[1] - locPix[1]) ** 2);
    if (p.mouseIsPressed && distance < 10) {
      gvs.dragging_loc_1 = true;
    }
    if (!p.mouseIsPressed) {
      gvs.dragging_loc_1 = false;
    }
    if (gvs.dragging_loc_1) {
      locPix = mousePix;
      locPix[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix[0]));
      locPix[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix[1]));
    }
    const locCoords = pixToCoord(locPix[0], locPix[1]);
    if (gvs.HS === "enthalpy") {
      if (gvs.dragging_loc_1) {
        gvs.loc_H_2 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    } else {
      if (gvs.dragging_loc_1) {
        gvs.loc_S_2 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    }
    p.fill(0);
  } else {
    let answerPix;
    if (gvs.HS === "enthalpy") {
      answerPix = coordToPix(gvs.answer_H_2[0], gvs.answer_H_2[1]);
    } else {
      answerPix = coordToPix(gvs.answer_S_2[0], gvs.answer_S_2[1]);
    }
    locPix = answerPix;
    p.fill(answerColor);
  }
  p.circle(locPix[0], locPix[1], pointDiameter);
  p.fill(253);
  p.rectMode(p.CENTER);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(15);
  let labelText;
  let textLength;
  if (gvs.HS === "enthalpy") {
    labelText = `z   = ${(Math.round(100 * gvs.loc_H_2[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.loc_H_2[1]) / 10).toFixed(1)} kJ/mol`;
    textLength = p.textWidth(`H = ${(Math.round(10 * gvs.loc_H_2[1]) / 10).toFixed(1)} kJ/mol`);
    if (gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_H_2[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_H_2[1]) / 10).toFixed(1)} kJ/mol`
    }
  } else {
    labelText = `z   = ${(Math.round(100 * gvs.loc_S_2[0]) / 100).toFixed(2)}\nS = ${(Math.round(gvs.loc_S_2[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    textLength = p.textWidth(`S = ${(Math.round(10 * gvs.loc_S_2[1]) / 10).toFixed(1)} J/(mol K)`);
    if (gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_S_2[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_S_2[1]) / 10).toFixed(1)} kJ/mol`
    }
  }
  const offset = textBoxShift(locPix[0], locPix[1], textLength + 10, 40);
  const x = locPix[0] + offset[0];
  const y = locPix[1] + offset[1];
  p.noStroke();
  p.rect(x, y, textLength + 10, 40);
  if (gvs.show_solution) {
    p.fill(answerColor);
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
  if (!gvs.show_solution) {
    const mousePix = [p.mouseX, p.mouseY];
    if (gvs.HS === "enthalpy") {
      locPix = coordToPix(gvs.loc_H_3[0], gvs.loc_H_3[1]);
    } else {
      locPix = coordToPix(gvs.loc_S_3[0], gvs.loc_S_3[1]);
    }
    const distance = Math.sqrt((mousePix[0] - locPix[0]) ** 2 + (mousePix[1] - locPix[1]) ** 2);
    if (p.mouseIsPressed && distance < 10) {
      gvs.dragging_loc_1 = true;
    }
    if (!p.mouseIsPressed) {
      gvs.dragging_loc_1 = false;
    }
    if (gvs.dragging_loc_1) {
      locPix = mousePix;
      locPix[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix[0]));
      locPix[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix[1]));
    }
    const locCoords = pixToCoord(locPix[0], locPix[1]);
    if (gvs.HS === "enthalpy") {
      if (gvs.dragging_loc_1) {
        gvs.loc_H_3 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    } else {
      if (gvs.dragging_loc_1) {
        gvs.loc_S_3 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
    }
    p.fill(0);
  } else {
    let answerPix;
    if (gvs.HS === "enthalpy") {
      answerPix = coordToPix(gvs.answer_H_3[0], gvs.answer_H_3[1]);
    } else {
      answerPix = coordToPix(gvs.answer_S_3[0], gvs.answer_S_3[1]);
    }
    locPix = answerPix;
    p.fill(answerColor);
  }
  p.circle(locPix[0], locPix[1], pointDiameter);
  p.fill(253);
  p.rectMode(p.CENTER);
  p.textAlign(p.LEFT, p.CENTER);
  p.textSize(15);
  let labelText;
  let textLength;
  if (gvs.HS === "enthalpy") {
    labelText = `z   = ${(Math.round(100 * gvs.loc_H_3[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.loc_H_3[1]) / 10).toFixed(1)} kJ/mol`;
    textLength = p.textWidth(`H = ${(Math.round(10 * gvs.loc_H_3[1]) / 10).toFixed(1)} kJ/mol`);
    if (gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_H_3[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_H_3[1]) / 10).toFixed(1)} kJ/mol`
    }
  } else {
    labelText = `z   = ${(Math.round(100 * gvs.loc_S_3[0]) / 100).toFixed(2)}\nS = ${(Math.round(gvs.loc_S_3[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    textLength = p.textWidth(`S = ${(Math.round(10 * gvs.loc_S_3[1]) / 10).toFixed(1)} J/(mol K)`);
    if (gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_S_3[0]) / 100).toFixed(2)}\nS = ${(Math.round(10 * gvs.answer_S_3[1]) / 10).toFixed(1)} J/(mol K)`
    }
  }
  const offset = textBoxShift(locPix[0], locPix[1], textLength + 10, 40);
  const x = locPix[0] + offset[0];
  const y = locPix[1] + offset[1];
  p.noStroke();
  p.rect(x, y, textLength + 10, 40);
  if (gvs.show_solution) {
    p.fill(answerColor);
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
  if (gvs.HS === "enthalpy") {
    let locPix1, locPix2;
    p.noStroke();
    if (!gvs.show_solution) {
      const mousePix = [p.mouseX, p.mouseY];
      locPix1 = coordToPix(gvs.loc_H_4_1[0], gvs.loc_H_4_1[1]);
      locPix2 = coordToPix(gvs.loc_H_4_2[0], gvs.loc_H_4_2[1]);
      const distance1 = Math.sqrt((mousePix[0] - locPix1[0]) ** 2 + (mousePix[1] - locPix1[1]) ** 2);
      const distance2 = Math.sqrt((mousePix[0] - locPix2[0]) ** 2 + (mousePix[1] - locPix2[1]) ** 2);
      if (p.mouseIsPressed && distance1 < 10) {
        gvs.dragging_loc_1 = true;
      } else if (p.mouseIsPressed && distance2 < 10) {
        gvs.dragging_loc_2 = true;
      }
      if (!p.mouseIsPressed) {
        gvs.dragging_loc_1 = false;
        gvs.dragging_loc_2 = false;
      }
      if (gvs.dragging_loc_1) {
        locPix1 = mousePix;
        locPix1[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix1[0]));
        locPix1[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix1[1]));
      }
      if (gvs.dragging_loc_2) {
        locPix2 = mousePix;
        locPix2[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix2[0]));
        locPix2[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix2[1]));
      }
      const locCoords1 = pixToCoord(locPix1[0], locPix1[1]);
      const locCoords2 = pixToCoord(locPix2[0], locPix2[1]);
      if (gvs.dragging_loc_1) {
        gvs.loc_H_4_1 = [Math.round(locCoords1[0] * 100) / 100, Math.round(locCoords1[1] * 100) / 100];
      }
      if (gvs.dragging_loc_2) {
        gvs.loc_H_4_2 = [Math.round(locCoords2[0] * 100) / 100, Math.round(locCoords2[1] * 100) / 100];
      }
      p.fill(0);
    } else {
      const answerPix1 = coordToPix(0, gvs.answer_H_4_B[1]);
      const answerPix2 = coordToPix(1, gvs.answer_H_4_A[1]);
      locPix1 = answerPix1;
      locPix2 = answerPix2;
      p.fill(answerColor);
    }
    p.circle(locPix1[0], locPix1[1], pointDiameter);
    p.circle(locPix2[0], locPix2[1], pointDiameter);
    if (gvs.show_solution) {
      p.stroke(answerColor);
    } else {
      p.stroke(0);
    }
    p.strokeWeight(2);
    p.line(locPix1[0], locPix1[1], locPix2[0], locPix2[1]);
  } else {
    p.noFill();
    p.stroke(0);
    p.strokeWeight(2);
    p.beginShape();
    p.vertex(coordToPix(0, gvs.sB)[0], coordToPix(0, gvs.sB)[1]);
    for (let x = 0; x < 1.00; x += 0.01) {
      x = Math.round(x * 100) / 100;
      const pix = coordToPix(x, gvs.molarS(x));
      p.vertex(pix[0], pix[1]);
    }
    p.vertex(coordToPix(1, gvs.sA)[0], coordToPix(1, gvs.sA)[1]);
    p.endShape();
    let locPix;
    p.noStroke();
    if (!gvs.show_solution) {
      const mousePix = [p.mouseX, p.mouseY];
      locPix = coordToPix(gvs.loc_S_4[0], gvs.loc_S_4[1]);
      const distance = Math.sqrt((mousePix[0] - locPix[0]) ** 2 + (mousePix[1] - locPix[1]) ** 2);
      if (p.mouseIsPressed && distance < 10) {
        gvs.dragging_loc_1 = true;
      }
      if (!p.mouseIsPressed) {
        gvs.dragging_loc_1 = false;
      }
      if (gvs.dragging_loc_1) {
        locPix = mousePix;
        locPix[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix[0]));
        locPix[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix[1]));
      }
      const locCoords = pixToCoord(locPix[0], locPix[1]);
      if (gvs.dragging_loc_1) {
        gvs.loc_S_4 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
      p.fill(0);
    } else {
      let answerPix;
      answerPix = coordToPix(gvs.answer_S_4[0], gvs.answer_S_4[1]);
      locPix = answerPix;
      p.fill(answerColor);
      // add text box with answer here
    }
    p.circle(locPix[0], locPix[1], pointDiameter);
    const S_pix = coordToPix(gvs.randx, gvs.molarS2(gvs.randx));
    if (gvs.show_solution) {
      p.noFill();
      p.stroke(answerColor);
      p.strokeWeight(2);
      p.line(S_pix[0], S_pix[1], locPix[0], locPix[1]);
    }
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(255);
    if (gvs.show_solution) {
      p.fill(answerColor);
      p.noStroke();
    }
    p.circle(S_pix[0], S_pix[1], pointDiameter);
    p.noStroke();
    p.fill(253);
    p.rectMode(p.CENTER);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(15);
    const S_text = `z   = ${(Math.round(100 * gvs.randx) / 100).toFixed(2)}\nS = ${(Math.round(gvs.molarS2(gvs.randx) * 10) / 10).toFixed(1)} J/(mol K)`;
    const S_textLength = p.textWidth(`S = ${(Math.round(gvs.answer_S_4[1] * 10) / 10).toFixed(1)} J/(mol K)`);
    const S_yOffset = gvs.molarS(gvs.randx) < gvs.molarS2(gvs.randx) ? -40 : 40;
    p.rect(S_pix[0], S_pix[1] + S_yOffset, S_textLength + 10, 40);
    p.fill(0);
    p.text(S_text, S_pix[0] - S_textLength / 2, S_pix[1] + S_yOffset);
    p.textSize(10);
    p.text("A", S_pix[0] - S_textLength / 2 + 9, S_pix[1] + S_yOffset - 4);
    p.textSize(15);
    p.fill(253);
    let labelText;
    let textLength;
    labelText = `z   = ${(Math.round(100 * gvs.loc_S_4[0]) / 100).toFixed(2)}\nS = ${(Math.round(gvs.loc_S_4[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    textLength = p.textWidth(`S = ${(Math.round(10 * gvs.loc_S_4[1]) / 10).toFixed(1)} J/(mol K)`);
    if (gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_S_4[0]) / 100).toFixed(2)}\nS = ${(Math.round(10 * gvs.answer_S_4[1]) / 10).toFixed(1)} J/(mol K)`
    }
    const offset = textBoxShift(locPix[0], locPix[1], textLength + 10, 40);
    const x = locPix[0] + offset[0];
    const y = locPix[1] + offset[1];
    p.noStroke();
    p.rect(x, y, textLength + 10, 40);
    if (gvs.show_solution) {
      p.fill(answerColor);
    } else {
      p.fill(0);
    }
    p.text(labelText, x - textLength / 2, y);
    p.textSize(10);
    p.text("A", x - textLength / 2 + 9, y - 4);
    if (gvs.show_solution) {
      p.textSize(20);
      p.fill(253);
      p.stroke(0);
      const answerValue = (Math.round(10 * (Math.round(10 * gvs.molarS2(gvs.randx)) / 10 - Math.round(10 * gvs.answer_S_4[1]) / 10)) / 10).toFixed(1);
      const answerText = `S   = ${answerValue} J/(mol K)`;
      const answerTextLength = p.textWidth(answerText);
      p.rect(margin_left + plot_width - answerTextLength / 2 - 50, margin_top + 35, answerTextLength + 15, 30);
      p.fill(answerColor);
      p.noStroke();
      p.text(answerText, margin_left + plot_width - answerTextLength - 50, margin_top + 36);
      p.textSize(12);
      p.text("E", margin_left + plot_width - answerTextLength - 35, margin_top + 42);
    }
  }
  p.pop();
}

function step5(p) {
  p.push();
  if (gvs.HS === "enthalpy") {
    p.stroke(0);
    p.noFill();
    p.strokeWeight(2);
    const idealPix = [coordToPix(0, gvs.hB), coordToPix(1, gvs.hA)];
    p.line(idealPix[0][0], idealPix[0][1], idealPix[1][0], idealPix[1][1]);
    const mixturePix = coordToPix(gvs.randx, gvs.molarH(gvs.randx));
    p.strokeWeight(1);
    if (gvs.show_solution) {
      p.fill(answerColor);
      p.noStroke();
    } else {
      p.fill(255);
    }
    p.circle(mixturePix[0], mixturePix[1], pointDiameter);
    const mixtureLabelText = `z   = ${(Math.round(100 * gvs.randx) / 100).toFixed(2)}\nH = ${(Math.round(gvs.molarH(gvs.randx) * 10) / 10).toFixed(1)} kJ/mol`;
    const mixtureTextLength = p.textWidth(`H = ${(Math.round(gvs.molarH(gvs.randx) * 10) / 10).toFixed(1)} kJ/mol`);
    const mixtureOffset = textBoxShift(mixturePix[0], mixturePix[1], mixtureTextLength, 40);
    const mixtureX = mixturePix[0] + mixtureOffset[0];
    const mixtureY = mixturePix[1] + mixtureOffset[1];
    p.noStroke();
    p.rectMode(p.CENTER);
    p.fill(253);
    p.rect(mixtureX, mixtureY, mixtureTextLength + 30, 40);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(15);
    p.fill(0);
    p.text(mixtureLabelText, mixturePix[0] + mixtureOffset[0] - mixtureTextLength / 2 - 10, mixturePix[1] + mixtureOffset[1]);
    p.textSize(10);
    p.text("A", mixturePix[0] + mixtureOffset[0] - mixtureTextLength / 2 - 1, mixturePix[1] + mixtureOffset[1] - 4);
    let locPix;
    p.noStroke();
    if (!gvs.show_solution) {
      const mousePix = [p.mouseX, p.mouseY];
      locPix = coordToPix(gvs.loc_H_5[0], gvs.loc_H_5[1]);
      const distance = Math.sqrt((mousePix[0] - locPix[0]) ** 2 + (mousePix[1] - locPix[1]) ** 2);
      if (p.mouseIsPressed && distance < 10) {
        gvs.dragging_loc_1 = true;
      }
      if (!p.mouseIsPressed) {
        gvs.dragging_loc_1 = false;
      }
      if (gvs.dragging_loc_1) {
        locPix = mousePix;
        locPix[0] = Math.min(margin_left + plot_width, Math.max(margin_left, locPix[0]));
        locPix[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix[1]));
      }
      const locCoords = pixToCoord(locPix[0], locPix[1]);
      if (gvs.dragging_loc_1) {
        gvs.loc_H_5 = [Math.round(locCoords[0] * 100) / 100, Math.round(locCoords[1] * 100) / 100];
      }
      p.fill(0);
    } else {
      const answerPix = coordToPix(gvs.answer_H_5[0], gvs.answer_H_5[1]);
      locPix = answerPix;
      p.fill(answerColor);
    }
    p.circle(locPix[0], locPix[1], pointDiameter);
    p.fill(253);
    p.rectMode(p.CENTER);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(15);
    let labelText;
    let textLength;
    labelText = `z   = ${(Math.round(100 * gvs.loc_H_5[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.loc_H_5[1]) / 10).toFixed(1)} kJ/mol`;
    textLength = p.textWidth(`H = ${(Math.round(10 * gvs.loc_H_5[1]) / 10).toFixed(1)} kJ/mol`);
    if (gvs.show_solution) {
      labelText = `z   = ${(Math.round(100 * gvs.answer_H_5[0]) / 100).toFixed(2)}\nH = ${(Math.round(10 * gvs.answer_H_5[1]) / 10).toFixed(1)} kJ/mol`
    }
    const offset = textBoxShift(locPix[0], locPix[1], textLength + 10, 40);
    const x = locPix[0] + offset[0];
    const y = locPix[1] + offset[1];
    p.noStroke();
    p.rect(x, y, textLength + 10, 40);
    if (gvs.show_solution) {
      p.fill(answerColor);
    } else {
      p.fill(0);
    }
    p.text(labelText, x - textLength / 2, y);
    p.textSize(10);
    p.text("A", x - textLength / 2 + 9, y - 4);
    if (gvs.show_solution) {
      p.textSize(20);
      p.fill(253);
      p.stroke(0);
      const answerValue = (Math.round(10 * (Math.round(10 * gvs.molarH(gvs.randx)) / 10 - Math.round(10 * gvs.answer_H_5[1]) / 10)) / 10).toFixed(1);
      const answerText = `H   = ${answerValue} kJ/mol`;
      const answerTextLength = p.textWidth(answerText);
      p.rect(margin_left + plot_width - answerTextLength / 2 - 50, margin_top + 38, answerTextLength + 15, 30);
      p.fill(answerColor);
      p.noStroke();
      p.text(answerText, margin_left + plot_width - answerTextLength - 50, margin_top + 39);
      p.textSize(12);
      p.text("E", margin_left + plot_width - answerTextLength - 35, margin_top + 45);
      p.stroke(answerColor);
      p.noFill();
      p.strokeWeight(2);
      p.line(locPix[0], locPix[1], mixturePix[0], mixturePix[1]);
    }
  } else {
    let locPix1, locPix2;
    p.stroke(0);
    p.strokeWeight(1);
    p.fill(255);
    const mixturePix = coordToPix(gvs.randx, gvs.molarS2(gvs.randx));
    p.circle(mixturePix[0], mixturePix[1], 8);
    p.noStroke();
    if (!gvs.show_solution) {
      const mousePix = [p.mouseX, p.mouseY];
      locPix1 = coordToPix(gvs.loc_S_5_B[0], gvs.loc_S_5_B[1]);
      locPix2 = coordToPix(gvs.loc_S_5_A[0], gvs.loc_S_5_A[1]);
      const distance1 = Math.sqrt((mousePix[0] - locPix1[0]) ** 2 + (mousePix[1] - locPix1[1]) ** 2);
      const distance2 = Math.sqrt((mousePix[0] - locPix2[0]) ** 2 + (mousePix[1] - locPix2[1]) ** 2);
      if (p.mouseIsPressed && distance1 < 10) {
        gvs.dragging_loc_1 = true;
      } else if (p.mouseIsPressed && distance2 < 10) {
        gvs.dragging_loc_2 = true;
      }
      if (!p.mouseIsPressed) {
        gvs.dragging_loc_1 = false;
        gvs.dragging_loc_2 = false;
      }
      if (gvs.dragging_loc_1) {
        locPix1 = mousePix;
        locPix1[0] = margin_left;
        locPix1[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix1[1]));
      }
      if (gvs.dragging_loc_2) {
        locPix2 = mousePix;
        locPix2[0] = margin_left + plot_width;
        locPix2[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix2[1]));
      }
      const locCoords1 = pixToCoord(locPix1[0], locPix1[1]);
      const locCoords2 = pixToCoord(locPix2[0], locPix2[1]);
      if (gvs.dragging_loc_1) {
        gvs.loc_S_5_B = [Math.round(locCoords1[0] * 100) / 100, Math.round(locCoords1[1] * 100) / 100];
      }
      if (gvs.dragging_loc_2) {
        gvs.loc_S_5_A = [Math.round(locCoords2[0] * 100) / 100, Math.round(locCoords2[1] * 100) / 100];
      }
      p.fill(0);
    } else {
      const answerPix1 = coordToPix(0, gvs.answer_S_5_B[1]);
      const answerPix2 = coordToPix(1, gvs.answer_S_5_A[1]);
      locPix1 = answerPix1;
      locPix2 = answerPix2;
      gvs.loc_S_5_B = gvs.answer_S_5_B;
      gvs.loc_S_5_A = gvs.answer_S_5_A;
      p.fill(answerColor);
    }
    p.circle(locPix1[0], locPix1[1], pointDiameter);
    p.circle(locPix2[0], locPix2[1], pointDiameter);
    p.strokeWeight(1);
    if (gvs.show_solution) {
      p.stroke(answerColor);
    } else {
      p.stroke(0);
    }
    p.line(locPix1[0], locPix1[1], locPix2[0], locPix2[1]);
    const labelTextB = `S   = ${(Math.round(gvs.loc_S_5_B[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    const labelTextBLength = p.textWidth(labelTextB);
    const labelTextA = `S   = ${(Math.round(gvs.loc_S_5_A[1] * 10) / 10).toFixed(1)} J/(mol K)`;
    const labelTextALength = p.textWidth(labelTextA);
    p.rectMode(p.CENTER);
    p.noStroke();
    p.fill(253);
    const rectXB = locPix1[0] + labelTextBLength / 2 + 20
    const rectYB = locPix1[1] - 20;
    const rectXA = locPix2[0] - labelTextALength / 2 - 20;
    const rectYA = locPix2[1] - 20;
    p.rect(rectXB, rectYB, labelTextBLength + 35, 25);
    p.rect(rectXA, rectYA, labelTextALength + 35, 25);
    if (gvs.show_solution) {
      p.fill(answerColor);
    } else {
      p.fill(0);
    }
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(15);
    p.text(labelTextB, rectXB, rectYB);
    p.text(labelTextA, rectXA, rectYA);
    p.noFill();
    if (gvs.show_solution) {
      p.stroke(answerColor);
    } else {
      p.stroke(0);
    }
    p.line(rectXB - labelTextBLength / 2 - 13, rectYB - 9, rectXB - labelTextBLength / 2 - 4, rectYB - 9);
    p.line(rectXA - labelTextALength / 2 - 13, rectYA - 9, rectXA - labelTextALength / 2 - 4, rectYA - 9);
    p.noStroke();
    p.textSize(10);
    if (gvs.show_solution) {
      p.fill(answerColor);
    } else {
      p.fill(0);
    }
    p.text("B", rectXB - labelTextBLength / 2 + 2, rectYB + 5);
    p.text("A", rectXA - labelTextALength / 2 + 2, rectYA + 5);
  }
  p.pop();
}

function step6(p) {
  p.push();
  const mixturePix = coordToPix(gvs.randx, gvs.hB + gvs.randx * (gvs.hA - gvs.hB));
  const nonIdealPix = coordToPix(gvs.randx, gvs.molarH(gvs.randx));
  const hBPix = coordToPix(0, gvs.hB);
  const hAPix = coordToPix(1, gvs.hA);
  p.stroke(0);
  p.strokeWeight(2);
  p.line(hAPix[0], hAPix[1], hBPix[0], hBPix[1]);
  p.fill(0);
  p.noStroke();
  p.circle(mixturePix[0], mixturePix[1], pointDiameter);
  p.circle(nonIdealPix[0], nonIdealPix[1], pointDiameter);
  p.drawingContext.setLineDash([5, 8]);
  p.stroke(0);
  // p.strokeWeight(1);
  p.line(mixturePix[0], mixturePix[1], nonIdealPix[0], nonIdealPix[1]);
  const excessHValue = (Math.round(10 * (Math.round(10 * gvs.molarH(gvs.randx)) / 10 - Math.round(10 * gvs.answer_H_5[1]) / 10)) / 10).toFixed(1);
  const labelText = `H   = ${excessHValue} kJ/mol`;
  const textLength = p.textWidth(labelText);
  const textPix = [mixturePix[0], (mixturePix[1] + nonIdealPix[1]) / 2];
  p.rectMode(p.CENTER);
  p.textAlign(p.LEFT, p.CENTER);
  p.noStroke();
  p.fill(253);
  p.rect(textPix[0], textPix[1], textLength + 30, 20);
  p.fill(0);
  p.textSize(15);
  p.text(labelText, textPix[0] - textLength / 2 - 10, textPix[1]);
  p.textSize(10);
  p.text("E", textPix[0] - textLength / 2 + 2, textPix[1] + 6);
  if (gvs.show_solution) {
    p.textSize(20);
    p.translate(p.width / 2 + 160, 97);
    const answerText = `ΔT = ${Math.round(Number(excessHValue) / gvs.cp)} K`;
    const answerTextWidth = p.textWidth(answerText);
    p.fill(253);
    p.stroke(0);
    p.drawingContext.setLineDash([1, 0]);
    p.strokeWeight(1);
    p.rect(0, 0, answerTextWidth + 20, 30);
    p.fill(answerColor);
    p.noStroke();
    p.text(answerText, -1 * answerTextWidth / 2, 1);
  }
  p.pop();
}

function step7(p) {
  p.push();
  let locPix1, locPix2;
  p.stroke(0);
  p.strokeWeight(1);
  p.fill(255);
  const mixturePix = coordToPix(gvs.randx, gvs.molarH(gvs.randx));
  p.circle(mixturePix[0], mixturePix[1], 8);
  p.noStroke();
  if (!gvs.show_solution) {
    const mousePix = [p.mouseX, p.mouseY];
    locPix1 = coordToPix(gvs.loc_H_7_B[0], gvs.loc_H_7_B[1]);
    locPix2 = coordToPix(gvs.loc_H_7_A[0], gvs.loc_H_7_A[1]);
    const distance1 = Math.sqrt((mousePix[0] - locPix1[0]) ** 2 + (mousePix[1] - locPix1[1]) ** 2);
    const distance2 = Math.sqrt((mousePix[0] - locPix2[0]) ** 2 + (mousePix[1] - locPix2[1]) ** 2);
    if (p.mouseIsPressed && distance1 < 10) {
      gvs.dragging_loc_1 = true;
    } else if (p.mouseIsPressed && distance2 < 10) {
      gvs.dragging_loc_2 = true;
    }
    if (!p.mouseIsPressed) {
      gvs.dragging_loc_1 = false;
      gvs.dragging_loc_2 = false;
    }
    if (gvs.dragging_loc_1) {
      locPix1 = mousePix;
      locPix1[0] = margin_left;
      locPix1[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix1[1]));
    }
    if (gvs.dragging_loc_2) {
      locPix2 = mousePix;
      locPix2[0] = margin_left + plot_width;
      locPix2[1] = Math.min(margin_top + plot_height, Math.max(margin_top, locPix2[1]));
    }
    const locCoords1 = pixToCoord(locPix1[0], locPix1[1]);
    const locCoords2 = pixToCoord(locPix2[0], locPix2[1]);
    if (gvs.dragging_loc_1) {
      gvs.loc_H_7_B = [Math.round(locCoords1[0] * 100) / 100, Math.round(locCoords1[1] * 100) / 100];
    }
    if (gvs.dragging_loc_2) {
      gvs.loc_H_7_A = [Math.round(locCoords2[0] * 100) / 100, Math.round(locCoords2[1] * 100) / 100];
    }
    p.fill(0);
  } else {
    const answerPix1 = coordToPix(0, gvs.answer_H_7_B[1]);
    const answerPix2 = coordToPix(1, gvs.answer_H_7_A[1]);
    locPix1 = answerPix1;
    locPix2 = answerPix2;
    gvs.loc_H_7_B = gvs.answer_H_7_B;
    gvs.loc_H_7_A = gvs.answer_H_7_A;
    p.fill(answerColor);
  }
  p.circle(locPix1[0], locPix1[1], pointDiameter);
  p.circle(locPix2[0], locPix2[1], pointDiameter);
  p.strokeWeight(1);
  if (gvs.show_solution) {
    p.stroke(answerColor);
  } else {
    p.stroke(0);
  }
  p.line(locPix1[0], locPix1[1], locPix2[0], locPix2[1]);
  const labelTextB = `H   = ${(Math.round(gvs.loc_H_7_B[1] * 10) / 10).toFixed(1)} kJ/mol`;
  const labelTextBLength = p.textWidth(labelTextB);
  const labelTextA = `H   = ${(Math.round(gvs.loc_H_7_A[1] * 10) / 10).toFixed(1)} kJ/mol`;
  const labelTextALength = p.textWidth(labelTextA);
  p.rectMode(p.CENTER);
  p.noStroke();
  p.fill(253);
  const rectXB = locPix1[0] + labelTextBLength / 2 + 20
  const rectYB = locPix1[1] - 20;
  const rectXA = locPix2[0] - labelTextALength / 2 - 20;
  const rectYA = locPix2[1] - 20;
  p.rect(rectXB, rectYB, labelTextBLength + 35, 25);
  p.rect(rectXA, rectYA, labelTextALength + 35, 25);
  if (gvs.show_solution) {
    p.fill(answerColor);
  } else {
    p.fill(0);
  }
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(15);
  p.text(labelTextB, rectXB, rectYB);
  p.text(labelTextA, rectXA, rectYA);
  p.noFill();
  if (gvs.show_solution) {
    p.stroke(answerColor);
  } else {
    p.stroke(0);
  }
  p.line(rectXB - labelTextBLength / 2 - 11, rectYB - 10, rectXB - labelTextBLength / 2 - 1, rectYB - 10);
  p.line(rectXA - labelTextALength / 2 - 11, rectYA - 10, rectXA - labelTextALength / 2 - 1, rectYA - 10);
  p.noStroke();
  p.textSize(10);
  if (gvs.show_solution) {
    p.fill(answerColor);
  } else {
    p.fill(0);
  }
  p.text("B", rectXB - labelTextBLength / 2 + 4, rectYB + 5);
  p.text("A", rectXA - labelTextALength / 2 + 4, rectYA + 5);
  p.pop();
}

function drawAll(p) {
  determineGraphingParameters()
  drawAxes(p);
  drawCurve(p);
  drawInstructions(p);
  switch (gvs.step) {
    case 1:
      step1(p);
      break;
    case 2:
      step2(p);
      break;
    case 3:
      step3(p);
      break;
    case 4:
      step4(p);
      break;
    case 5:
      step5(p);
      break;
    case 6:
      step6(p);
      break;
    case 7:
      step7(p);
      break;
  }
}

module.exports = drawAll;