// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.rng_1_value" because it will minimize the risk of namespace issues.
window.g = {
  cnv: undefined,
  gate_angle: 45, // degrees
  water_height: 1.22, // meters or ft
  water_height_in_pixels : 244,
  gate_weight: 22.2, // kN
  gate_length_pixels : 400, // pixels
  gate_base_coordinate : [390, 510], // pixels
  select_value: 'SI',
  draw_distances: true,
  cable_tension: 14.80,
  gate_angle_radians: 45 * 2 * Math.PI / 360,
  force_from_water : 10.32,
  distance_to_center_of_mass : 0.41,
  gate_length : 2.44, // m
  label_font_size : 19,
  water_color: "rgb(210, 210, 255)",
}

// See https://p5js.org/ to learn how to use this graphics library. setup() and draw() are used to draw on the canvas object of the page.  Seriously, spend some time learning p5.js because it will make drawing graphics a lot easier.  You can watch tutorial videos on the "Coding Train" youtube channel. They have a p5.js crash course under their playlists section.  It will make these functions make a lot more sense.
function setup() {
  // Create a p5.js canvas 800px wide and 600px high, and assign it to the global variable "cnv".
  g.cnv = createCanvas(800, 600);

  // Set the parent element to "graphics-wrapper"
  g.cnv.parent("graphics-wrapper");

  // The "main" element is unnecessary. Don't worry about this too much
  document.getElementsByTagName("main")[0].remove();

  noLoop();
}