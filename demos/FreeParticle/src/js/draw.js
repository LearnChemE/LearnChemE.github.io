function drawIndividualPStates(p) {
  p.push();
  const coefficients_list = Object.keys(gvs.coefficients);
  const k_list = [];
  let max_k = 0;
  for(let i = 0; i < coefficients_list.length; i++) {
    const coefficient = gvs.coefficients[coefficients_list[i]];
    const k = Math.abs(coefficient.k);
    const ck = coefficient.ck;
    if(k > max_k && ck !== 0) {max_k = k}
  }
  let y_tick_interval;
  if(max_k < 5) {
    y_tick_interval = 1;
  } else if(max_k < 11) {
    y_tick_interval = 2;
  } else if(max_k < 16) {
    y_tick_interval = 3;
  } else if(max_k < 21) {
    y_tick_interval = 4;
  } else if(max_k < 26) {
    y_tick_interval = 5;
  } else if(max_k < 51) {
    y_tick_interval = 10;
  } else {
    y_tick_interval = 20;
  }

  p.translate(p.width / 2 + 200, 180);

  const number_to_coord = function(x, y) {
    const plot_width = 350;
    const plot_height = 240;
    const max_y = max_k + 1;
    const x_coord = (x / 0.5) * (plot_width / 2);
    const y_coord = -1 * (y / max_y) * (plot_height / 2);
    return [x_coord, y_coord]
  }

  const top_left = number_to_coord(-0.5, max_k + 1);
  const bottom_left = number_to_coord(-0.5, -1 * (max_k + 1));
  const bottom_right = number_to_coord(0.5, -1 * (max_k + 1));
  // plot grid lines
  p.strokeWeight(1);
  p.line(top_left[0], top_left[1], bottom_left[0], bottom_left[1]);
  p.line(bottom_left[0], bottom_left[1], bottom_right[0], bottom_right[1]);
  // plot tick marks
  let k = 0;
  p.textAlign(p.RIGHT, p.CENTER);
  p.textSize(14);
  while(k < max_k + 1) {
    const tick_1_coords = number_to_coord(-0.5, k);
    const tick_2_coords = number_to_coord(-0.5, -1 * k);
    p.noFill();
    p.stroke(0);
    p.line(tick_1_coords[0], tick_1_coords[1], tick_1_coords[0] + 4, tick_1_coords[1]);
    p.fill(0);
    p.noStroke();
    p.text(`${k}`, tick_1_coords[0] - 5, tick_1_coords[1]);
    if(k !== 0) {
      p.noFill();
      p.stroke(0);
      p.line(tick_2_coords[0], tick_2_coords[1], tick_2_coords[0] + 4, tick_2_coords[1]);
      p.fill(0);
      p.noStroke();
      p.text(`${-1 * k}`, tick_2_coords[0] - 5, tick_2_coords[1]);
    }
    k += y_tick_interval;
  }
  p.textAlign(p.CENTER, p.TOP);
  for(let i = -0.5; i <= 0.5; i += 0.1) {
    i = Math.round(i * 10) / 10;
    p.noFill();
    p.stroke(0);
    const tick_coords = number_to_coord(i, -1 * max_k - 1);
    p.line(tick_coords[0], tick_coords[1], tick_coords[0], tick_coords[1] - 4);
    p.fill(0);
    p.noStroke();
    p.text(`${i}`, tick_coords[0], tick_coords[1] + 5);
    p.stroke(0);
    p.strokeWeight(1);
    p.line(tick_coords[0] - 10, tick_coords[1] + 20, tick_coords[0] + 10, tick_coords[1] + 20);
    p.noStroke();
    p.text(`λ`, tick_coords[0], tick_coords[1] + 22);
  }
  for(let i = 0; i < gvs.individual_p_states_arrays.length; i++) {
    p.noFill();
    p.stroke(gvs.colors[i]);
    p.beginShape();
    const array = gvs.individual_p_states_arrays[i];
    for(let j = 0; j < array.length; j++) {
      const x_y = array[j];
      const x = x_y[0];
      const y = x_y[1];
      const coord = number_to_coord(x, y);
      p.vertex(coord[0], coord[1]);
    }
    p.endShape();
  }
  p.pop();
}

function drawRealAndImagComponents(p) {
  p.push();
  p.translate(p.width / 2 + 200, 435);
  const number_to_coord = function(x, y) {
    const plot_width = 350;
    const plot_height = 120;
    const x_coord = (x / 0.5) * (plot_width / 2);
    const y_coord = -1 * (y / 1.1) * (plot_height / 2);
    return [x_coord, y_coord]
  }
  const top_left = number_to_coord(-0.5, 1.1);
  const bottom_left = number_to_coord(-0.5, -1.1);
  const bottom_right = number_to_coord(0.5, -1.1);
  // plot grid lines
  p.strokeWeight(1);
  p.line(top_left[0], top_left[1], bottom_left[0], bottom_left[1]);
  p.line(bottom_left[0], bottom_left[1], bottom_right[0], bottom_right[1]);
  p.textAlign(p.RIGHT, p.CENTER);
  p.textSize(14);
  for(let i = -1; i <= 1; i += 1) {
    p.noFill();
    p.stroke(0);
    i = Math.round(i);
    const tick_coord = number_to_coord(-0.5, i);
    p.line(tick_coord[0], tick_coord[1], tick_coord[0] + 4, tick_coord[1]);
    p.fill(0);
    p.noStroke();
    p.text(`${i}`, tick_coord[0] - 5, tick_coord[1]);
  }
  p.textAlign(p.CENTER, p.TOP);
  for(let i = -0.5; i <= 0.5; i += 0.1) {
    i = Math.round(i * 10) / 10;
    p.noFill();
    p.stroke(0);
    const tick_coords = number_to_coord(i, -1.1);
    p.line(tick_coords[0], tick_coords[1], tick_coords[0], tick_coords[1] - 4);
    p.fill(0);
    p.noStroke();
    p.text(`${i}`, tick_coords[0], tick_coords[1] + 5);
    p.stroke(0);
    p.strokeWeight(1);
    p.line(tick_coords[0] - 10, tick_coords[1] + 20, tick_coords[0] + 10, tick_coords[1] + 20);
    p.noStroke();
    p.text(`λ`, tick_coords[0], tick_coords[1] + 22);
  }
  p.noFill();
  p.stroke(255, 150, 0);
  p.beginShape();
  for(let i = 0; i < gvs.real_component_array.length; i++) {
    const x_y = gvs.real_component_array[i];
    const x = x_y[0];
    const y = x_y[1];
    const coord = number_to_coord(x, y);
    p.vertex(coord[0], coord[1]);
  }
  p.endShape();
  p.stroke(0, 0, 255);
  p.beginShape();
  for(let i = 0; i < gvs.imaginary_component_array.length; i++) {
    const x_y = gvs.imaginary_component_array[i];
    const x = x_y[0];
    const y = x_y[1];
    const coord = number_to_coord(x, y);
    p.vertex(coord[0], coord[1]);
  }
  p.endShape();
  p.pop();
}

function drawProbabilityDensityFunction(p) {
  p.push();
  p.translate(p.width / 2 + 200, 690);
  const number_to_coord = function(x, y) {
    const plot_width = 350;
    const plot_height = 240;
    const x_coord = (x / 0.5) * (plot_width / 2);
    const y_coord = -1 * (y / 1.1) * (plot_height / 2);
    return [x_coord, y_coord]
  }
  const top_left = number_to_coord(-0.5, 1.1);
  const bottom_left = number_to_coord(-0.5, 0);
  const bottom_right = number_to_coord(0.5, 0);
  // plot grid lines
  p.strokeWeight(1);
  p.line(top_left[0], top_left[1], bottom_left[0], bottom_left[1]);
  p.line(bottom_left[0], bottom_left[1], bottom_right[0], bottom_right[1]);
  p.textAlign(p.RIGHT, p.CENTER);
  p.textSize(14);
  for(let i = -1; i <= 1; i += 1) {
    p.noFill();
    p.stroke(0);
    i = Math.round(i);
    const tick_coord = number_to_coord(-0.5, i);
    p.line(tick_coord[0], tick_coord[1], tick_coord[0] + 4, tick_coord[1]);
    p.fill(0);
    p.noStroke();
    p.text(`${i}`, tick_coord[0] - 5, tick_coord[1]);
  }
  p.textAlign(p.CENTER, p.TOP);
  for(let i = -0.5; i <= 0.5; i += 0.1) {
    i = Math.round(i * 10) / 10;
    p.noFill();
    p.stroke(0);
    const tick_coords = number_to_coord(i, 0);
    p.line(tick_coords[0], tick_coords[1], tick_coords[0], tick_coords[1] - 4);
    p.fill(0);
    p.noStroke();
    p.text(`${i}`, tick_coords[0], tick_coords[1] + 5);
    p.stroke(0);
    p.strokeWeight(1);
    p.line(tick_coords[0] - 10, tick_coords[1] + 20, tick_coords[0] + 10, tick_coords[1] + 20);
    p.noStroke();
    p.text(`λ`, tick_coords[0], tick_coords[1] + 22);
  }
  p.noFill();
  p.stroke(0, 0, 0);
  p.strokeWeight(1);
  p.beginShape();
  for(let i = 0; i < gvs.product_array.length; i++) {
    const x_y = gvs.product_array[i];
    const x = x_y[0];
    const y = x_y[1];
    const coord = number_to_coord(x, y);
    p.vertex(coord[0], coord[1]);
  }
  p.endShape();
  p.pop();
}

function drawPlotLabels(p) {
  p.push();
  p.translate(p.width / 2 - 5, 180);
  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER);
  p.textSize(16);
  p.rotate(-1 * Math.PI / 2);
  p.text("amplitude", 0, 0);
  p.translate(-260, 0);
  p.text("amplitude", 0, 0);
  p.translate(-190, 0);
  p.text("relative probability", 0, 0);
  p.pop();
}

function drawAll(p) {
  drawIndividualPStates(p);
  drawRealAndImagComponents(p);
  drawProbabilityDensityFunction(p);
  drawPlotLabels(p);
}

module.exports = drawAll;