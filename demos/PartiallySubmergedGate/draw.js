// Whatever is included in draw() will be calculated at 60 fps.  It is basically a loop that calls itself every 16.67 ms. You can pause it at any time with the noLoop() function and start it again with the loop() function. Be sure to include every graphics statement in a push() / pop() statement, because it minimizes the chance that you accidentally apply styling or properties to another graphics object.
function draw() {
  background(250);
  translate(-50, -20);
  calculate_coordinates();
  draw_water();
  draw_gate();
  draw_cable();
  if(g.draw_distances) {
    draw_distances();
  }
  draw_container();
  draw_force_vectors();
}

function draw_distances() {
  fill(0);
  stroke(160);
  textSize(g.label_font_size);
  textAlign(CENTER, CENTER);
  // water height
  push();
  rectMode(CENTER);
  translate(150, 500);
  line(0, 0, 0, -1 * g.water_height_in_pixels);
  line(-10, -1 * g.water_height_in_pixels, 10, -1 * g.water_height_in_pixels);
  const water_height_text = g.select_value == "SI" ? `${g.water_height.toFixed(2)} m` : `${(g.water_height / 0.3048).toFixed(2)} ft`;
  const water_height_text_length = textWidth(water_height_text) + 5;
  const water_height_text_height = textAscent() + 10;
  noStroke();
  fill(g.water_color);
  rect(0, -30, water_height_text_length, water_height_text_height);
  fill(0);
  text(water_height_text, 0, -30);
  pop();

  // cable height
  push();
  rectMode(CENTER);
  translate(220, 500);
  const cable_height_meters = g.gate_length * Math.cos(Math.PI / 2 - g.gate_angle_radians);
  line(0, 0, 0, -1 * g.gate_length_pixels * Math.cos(Math.PI / 2 - g.gate_angle_radians) + 10);
  line(
    -10,
    -1 * g.gate_length_pixels * Math.cos(Math.PI / 2 - g.gate_angle_radians) + 10,
    10,
    -1 * g.gate_length_pixels * Math.cos(Math.PI / 2 - g.gate_angle_radians) + 10
  );
  const cable_height_text = g.select_value == "SI" ? `${cable_height_meters.toFixed(2)} m` : `${(cable_height_meters / 0.3048).toFixed(2)} ft`;
  const cable_height_text_length = textWidth(water_height_text) + 5;
  const cable_height_text_height = textAscent() + 10;
  noStroke();
  fill(g.water_color);
  rect(0, -30, cable_height_text_length, cable_height_text_height);
  fill(0);
  text(cable_height_text, 0, -30);
  pop();

  // force vector height
  push();
  rectMode(CENTER);
  translate(360, 500);
  const force_vector_height_meters = g.water_height / 3;
  const force_vector_height_pixels = g.water_height_in_pixels / 3;
  line(0, 0, 0, -1 * force_vector_height_pixels);
  line(-10, -1 * force_vector_height_pixels, 35 + force_vector_height_pixels * Math.tan(Math.PI / 2 - g.gate_angle_radians), -1 * force_vector_height_pixels);
  const vector_height_text = g.select_value == "SI" ? `${force_vector_height_meters.toFixed(2)} m` : `${(force_vector_height_meters / 0.3048).toFixed(2)} ft`;
  const vector_height_text_length = textWidth(vector_height_text) + 5;
  const vector_height_text_height = textAscent() + 10;
  noStroke();
  fill(g.water_color);
  rect(-20, -20, vector_height_text_length, vector_height_text_height);
  fill(0);
  text(vector_height_text, -20, -20);
  pop();

  // angle
  push();
  translate(390, 510);
  stroke(160);
  noFill();
  arc(0, 0, 75, 75, -1 * g.gate_angle_radians, 0);
  line(0, 0, 45, 0);
  line(0, 0, 45 * Math.sin(Math.PI / 2 - g.gate_angle_radians), -45 * Math.cos(Math.PI / 2 - g.gate_angle_radians));
  fill(0);
  noStroke();
  textSize(g.label_font_size);
  angle_text = `${g.gate_angle}°`;
  text(angle_text, 55, -15);
  pop();

  // water length
  push();
  translate(390, 510);
  const water_length_coordinates = [
    g.water_height_in_pixels * Math.tan(Math.PI / 2 - g.gate_angle_radians),
    -1 * g.water_height_in_pixels
  ];
  translate(70, 0);
  stroke(160);
  noFill();
  strokeWeight(1);
  line(-10, 0, 10, 0);
  line(
    water_length_coordinates[0] - 10,
    water_length_coordinates[1],
    water_length_coordinates[0] + 10,
    water_length_coordinates[1]
  );
  line(
    0,
    0,
    water_length_coordinates[0],
    water_length_coordinates[1]
  );
  fill(250);
  noStroke();
  const water_length_text = g.select_value == "SI" ? `${Math.sqrt(g.water_height**2 + (g.water_height * Math.tan(Math.PI / 2 - g.gate_angle_radians))**2).toFixed(2)} m` : `${(Math.sqrt(g.water_height**2 + (g.water_height * Math.tan(Math.PI / 2 - g.gate_angle_radians))**2) / 0.3048).toFixed(2)} ft`;
  const text_length = textWidth(water_length_text);
  const text_ascent = textAscent();
  fill(250);
  noStroke();
  textSize(g.label_font_size);
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  rect(water_length_coordinates[0] * 0.75, water_length_coordinates[1] * 0.75, text_length + 8, text_ascent + 5);
  fill(0);
  text(water_length_text, water_length_coordinates[0] * 0.75, water_length_coordinates[1] * 0.75);
  translate(45, 0);
  stroke(160);
  line(-10, 0, 10, 0);
  const gate_length_coordinates = [
    g.gate_length_pixels * Math.sin(Math.PI / 2 - g.gate_angle_radians),
    -1 * g.gate_length_pixels * Math.cos(Math.PI / 2 - g.gate_angle_radians)
  ];
  line(gate_length_coordinates[0] - 10, gate_length_coordinates[1], gate_length_coordinates[0] + 10, gate_length_coordinates[1])
  line(0, 0, gate_length_coordinates[0], gate_length_coordinates[1]);
  fill(250);
  noStroke();
  rect(gate_length_coordinates[0] * 0.8, gate_length_coordinates[1] * 0.8, text_length + 5, text_ascent + 10);
  const gate_length_text = g.select_value == "SI" ? `${g.gate_length.toFixed(2)} m` : `${(g.gate_length / 0.3048).toFixed(2)} ft`;
  fill(0);
  noStroke();
  text(gate_length_text, gate_length_coordinates[0] * 0.8, gate_length_coordinates[1] * 0.8);
  pop();

  // gate length
  push();

  pop();
}

function draw_cable() {
  // Draws the cable between the top of the gate and the edge of the container.
  push();
  const tip_of_gate_coordinate = [
    g.gate_base_coordinate[0] + Math.sin(Math.PI / 2 - g.gate_angle_radians) * g.gate_length_pixels,
    g.gate_base_coordinate[1] - Math.cos(Math.PI / 2 - g.gate_angle_radians) * g.gate_length_pixels,
  ]
  fill(0, 180, 50);
  stroke(100);
  strokeWeight(0);
  const center_x = (108 + tip_of_gate_coordinate[0]) / 2;
  triangle(
    center_x - 80,
    tip_of_gate_coordinate[1],
    center_x - 110,
    tip_of_gate_coordinate[1] + 10,
    center_x - 110,
    tip_of_gate_coordinate[1] - 10
  );
  triangle(
    center_x + 80,
    tip_of_gate_coordinate[1],
    center_x + 110,
    tip_of_gate_coordinate[1] + 10,
    center_x + 110,
    tip_of_gate_coordinate[1] - 10
  );
  strokeWeight(0);
  // stroke(100);
  fill(0, 180, 50);
  rectMode(CORNERS);
  rect(108, tip_of_gate_coordinate[1] - 2, tip_of_gate_coordinate[0], tip_of_gate_coordinate[1] + 2);
  strokeWeight(1);
  fill(255);
  circle(108, tip_of_gate_coordinate[1], 15);
  circle(tip_of_gate_coordinate[0], tip_of_gate_coordinate[1], 15);
  translate(center_x, tip_of_gate_coordinate[1]);
  textAlign(CENTER, CENTER);
  textSize(g.label_font_size);
  rectMode(CENTER);
  fill(250);
  noStroke();
  const tension_value = g.select_value == "SI" ? g.cable_tension.toFixed(2) : (g.cable_tension * 0.224809).toFixed(2);
  const units = g.select_value == "SI" ? "kN" : "klbf";
  const txt = `tension = ${tension_value} ${units}`;
  const rect_length = textWidth(txt) + 5;
  const rect_height = textAscent() + 3;
  rect(0, 0, rect_length, rect_height);
  fill(0, 180, 50);
  noStroke();
  text(txt, 0, 0);
  pop();
}

function draw_container() {
  push();
  stroke(200);
  noFill();
  strokeWeight(1);
  for(let x = 100; x < 360; x += 30) {
    line(x, 540, x + 25, 510);
  }
  noStroke();
  fill(12);
  strokeWeight(3);
  rect(100, 100, 15, 400);
  rect(100, 500, 280, 15);
  pop();
  // Gate fulcrum
  push();
  fill(255);
  stroke(0);
  strokeWeight(5);
  ellipse(390, 510, 40, 40);
  noStroke();
  fill(0);
  textSize(g.label_font_size);
  textAlign(CENTER, CENTER);
  text("hinge", 400, 550);
  pop();
}

function draw_force_vectors() {
  // gate weight
  push();
  translate(g.gate_base_coordinate[0], g.gate_base_coordinate[1]);
  const distance_right = g.gate_length_pixels * Math.sin(Math.PI / 2 - g.gate_angle_radians) / 2;
  const distance_up = -1 * g.gate_length_pixels * Math.cos(Math.PI / 2 - g.gate_angle_radians) / 2;
  translate(distance_right, distance_up);
  fill(0, 0, 255);
  stroke(0, 0, 255);
  strokeWeight(13);
  point(0, 0);
  strokeWeight(3);
  const vector_length = 30 + (g.gate_weight / 22.2) * 80;
  line(0, 0, 0, vector_length);
  triangle(
    0, vector_length,
    -5, vector_length - 15,
    5, vector_length - 15
  );
  translate(0, vector_length + 20);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(g.label_font_size);
  const gate_weight_text = g.select_value == "SI" ? `gate weight = ${g.gate_weight.toFixed(1)} kN` : `gate weight = ${(g.gate_weight * 0.224809).toFixed(1)} klbf`;
  text(gate_weight_text, 60, 0);
  pop();

  // force from water
  push();
  translate(g.gate_base_coordinate[0], g.gate_base_coordinate[1]);
  const force_vector_y = -1 * g.water_height_in_pixels / 3 - 10; // 10 pixel offset to account for half the width of the base
  const force_vector_x = -1 * force_vector_y * Math.tan(Math.PI / 2 - g.gate_angle_radians);
  translate(force_vector_x, force_vector_y);
  fill(150, 0, 255);
  stroke(150, 0, 255);
  strokeWeight(13);
  point(0, 0);
  const force_vector_length = 30 + (FR / 15000) * 80;
  rotate(Math.PI / 2 - g.gate_angle_radians);
  strokeWeight(3);
  line(0, 0, -1 * force_vector_length, 0);
  triangle(
    -5, 0,
    -20, 5,
    -20, -5
  );
  translate(-1 * force_vector_length, 0);
  rotate(g.gate_angle_radians - Math.PI / 2);
  translate(-45, -22);
  noStroke();
  textSize(g.label_font_size);
  textAlign(CENTER, CENTER);
  const force_water_text = g.select_value == "SI" ? `force from water\n${(FR / 1000).toFixed(2)} kN` : `force from water\n${(FR * 0.224809 / 1000).toFixed(2)} klbf`;
  text(force_water_text, 0, 0);
  pop();
}

function draw_gate() {
  push();
  translate(g.gate_base_coordinate[0], g.gate_base_coordinate[1]);
  rotate(3 * Math.PI / 2 - g.gate_angle_radians);
  fill(205);
  rect(-10, 0, 20, g.gate_length_pixels);
  pop();
}

function draw_water() {
  push();
  fill(g.water_color);
  strokeWeight(0);
  // Trapazoid Vertices for Water 
  beginShape();
  vertex(100, 500); // bottom left
  vertex(400, 500); // bottom right
  vertex(g.water_top_right_x_coordinate, 500 - g.water_height_in_pixels); // top left
  vertex(100, 500 - g.water_height_in_pixels); // top right
  endShape();
  pop();
}
