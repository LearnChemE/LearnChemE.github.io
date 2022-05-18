function calculate() {
  window.rdns = g.gate_angle_radians;
  window.conv1 = 0.3048;
  window.conv2 = 4.448;
  window.h0 = g.water_height;
  function a1(h) {
    return h/Math.sin(rdns)
  }
  window.a2 = 8*conv1;

  window.w = 4*conv1;
  window.h2 = a2 * Math.sin(rdns);
  window.h1 = h0 >= h2 ? h2 : h0;
  window.b = 3.28084 * conv1;
  window.A = a1(h1) * b;
  window.yc = a1(h1) / 2;
  window.hc = yc * Math.sin(rdns);
  window.Ixc = (1 / 12) * b * a1(h1)**3;
  window.yR = (Ixc / (yc * A)) + yc;
  window.hR = yR * Math.sin(rdns);
  window.gamma = 9807;
  window.W = g.gate_weight * 1000;
  window.FR = gamma * Math.sin(rdns) * A * a1(h1) / 2;
  window.FT = (FR * a1(h1) / 3 + W * a2 * Math.cos(rdns) / 2) / (a2 * Math.sin(rdns));

  let xc;
  let xR;
  let delta = 2;
  for(let x = 1.000; x <= 3.000; x += 0.001) {
    const lhs = 0.5 * a2 * Math.sin(rdns);
    const rhs = h2 / (w + a2 * Math.cos(rdns) - w) * (x - w);
    if(Math.abs(lhs - rhs) < delta) {
      delta = Math.abs(lhs - rhs);
      xc = x;
    }
  }
  delta = 2;
  for(let x = 1.0000; x <= 3.0000; x += 0.0001) {
    const lhs = 0.333 * h1;
    const rhs = (h2 / (w + a2 * Math.cos(rdns) - w)) * (x - w);
    if(Math.abs(lhs - rhs) < delta) {
      delta = Math.abs(lhs - rhs);
      xR = x;
    }
  }
  g.d = 1.2 * 0.85;
  g.cable_tension = Number((FT / 1000).toPrecision(4));
  g.force_from_water = Number((FR / 1000).toPrecision(4));
  g.cable_height = Number((a1(h1)).toPrecision(3));
  g.distance_to_center_of_mass = Number((h1 / 3).toFixed(2));
  g.distance_to_water_surface = Number((a1(h1)).toFixed(2));

}


function calculate_coordinates() {
  /*
   * The code below determines the top-right coordinate of the trapezoid that comprises the water.
   */

  g.gate_angle_radians = g.gate_angle * 2 * PI / 360;
  g.water_height_in_pixels = g.water_height * 150;
  g.water_top_right_x_coordinate = 400 + g.water_height_in_pixels * Math.tan(Math.PI / 2 - g.gate_angle_radians); // setting the height equal with g.gate_angle_radians and tangent
}

calculate();