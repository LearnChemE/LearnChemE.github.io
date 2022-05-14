// Whatever is included in draw() will be calculated at 60 fps.  It is basically a loop that calls itself every 16.67 ms. You can pause it at any time with the noLoop() function and start it again with the loop() function. Be sure to include every graphics statement in a push() / pop() statement, because it minimizes the chance that you accidentally apply styling or properties to another graphics object.
function draw() {

  background(250);
  calculate_coordinates();
  draw_water();
  draw_cable();
  draw_gate();
  draw_container();
  draw_arrows();
}

function calculate_coordinates() {
  /*
   * The code below determines the top-right coordinate of the trapezoid that comprises the water.
   * It also determines whether the max gate angle is too high to contain the water, and adjusts
   * the maximum value of the angle slider accordingly.
   */

  g.gate_length = 400;
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
  line(130, 500 - g.water_height_in_pixels - 20, g.water_top_right_x_coordinate - 45, 500 - g.water_height_in_pixels - 20);
  fill(0);
  triangle(130, 500 - g.water_height_in_pixels - 20, 145, 500 - g.water_height_in_pixels - 25, 145, 500 - g.water_height_in_pixels - 15);
  triangle(g.water_top_right_x_coordinate - 45, 500 - g.water_height_in_pixels - 20, g.water_top_right_x_coordinate - 60, 500 - g.water_height_in_pixels - 25, g.water_top_right_x_coordinate - 60, 500 - g.water_height_in_pixels - 15);
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
  translate(390, 510);
  rotate(g.gate_angle_radians - Math.PI);
  rect(-12.5, 0, 30, g.gate_length);
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
