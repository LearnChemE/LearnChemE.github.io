// Whatever is included in draw() will be calculated at 60 fps.  It is basically a loop that calls itself every 16.67 ms. You can pause it at any time with the noLoop() function and start it again with the loop() function. Be sure to include every graphics statement in a push() / pop() statement, because it minimizes the chance that you accidentally apply styling or properties to another graphics object.
function draw() {
  background(250);
  calculate_coordinates();
  draw_water();
  draw_gate();
  draw_container();
  draw_cable();
  draw_arrows();
}

function calculate_coordinates() {
  /*
   * The code below determines the top-right coordinate of the trapezoid that comprises the water.
   * It also determines whether the max gate angle is too high to contain the water, and adjusts
   * the maximum value of the angle slider accordingly.
   */

  g.gate_angle_radians = g.gate_angle * 2 * PI / 360;
  g.water_height_in_pixels = g.water_level * 200;
  g.water_top_right_x_coordinate = 400 + g.water_height_in_pixels * Math.tan(g.gate_angle_radians); // setting the height equal with g.gate_angle_radians and tangent
  g.max_gate_angle = Math.acos(g.water_height_in_pixels / g.gate_length); // uses the height of the water and gate length to deterine a max angle from a for loop that will be usd later
  g.max_gate_angle_degrees = g.max_gate_angle * 360 / (2 * PI) - 1; // conversion to radians (not sure why its subtracting by -1)
  if (g.max_gate_angle_degrees < g.gate_angle) {
    g.max_gate_angle_degrees = Math.floor(g.max_gate_angle_degrees); // changes g.max_gate_angle egrees to lowest gate angle
    angle_slider_element.setAttribute("value", `${Math.floor(g.max_gate_angle_degrees)}`); // sets the gate anlge to g.max_gate_angle (connecting HTML)
    angle_value_label.innerHTML = `${g.max_gate_angle_degrees}°`; // (connecting HTML)
    g.gate_angle = g.max_gate_angle_degrees; // sets abojected max angle_value
  }
  angle_slider_element.setAttribute("max", Math.floor(g.max_gate_angle_degrees));
}

function draw_arrows() {
  
}

function draw_cable() {
  // Draws the cable between the top of the gate and the edge of the container.
  push();
  const tip_of_gate_coordinate = [
    g.gate_base_coordinate[0] + Math.sin(g.gate_angle_radians) * g.gate_length,
    g.gate_base_coordinate[1] - Math.cos(g.gate_angle_radians) * g.gate_length,
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
  textSize(19);
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
  fill(12);
  strokeWeight(3);
  rect(100, 100, 15, 400);
  rect(100, 500, 270, 15);
  pop();
  // Gate fulcrum
  push();
  fill(128);
  ellipse(390, 510, 50, 50);
  pop();
}

function draw_gate() {
  push();
  g.gate_length = 400;
  g.gate_base_coordinate = [390, 510];
  translate(g.gate_base_coordinate[0], g.gate_base_coordinate[1]);
  rotate(g.gate_angle_radians - Math.PI);
  fill(205);
  rect(-12.5, 0, 22, g.gate_length);
  pop();
}

function draw_water() {
  push();
  fill(0, 100, 200, 40);
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
