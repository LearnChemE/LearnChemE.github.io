// Declare global variables within this object. They will be available across all files as "g.variable_name".You can make another script file aside from index.js by putting <script src="./path-to/other-js-file.js"></script> after the "index.js" HTML element. All the variables you declare in this file will be accessible there. It's best practice to store your global variables within an object E.G. "g.rng_1_value" because it will minimize the risk of namespace issues.
window.g = {
  cnv: undefined,
  //temperature_value : 75,
  glass_thickness: 1.0,
  concrete_thickness: 1.0,
  steel_thickness: 1.0,
  right_wall_material: "fiberglass",
  temperature_left_wall: 75,

}

// See https://p5js.org/ to learn how to use this graphics library. setup() and draw() are used to draw on the canvas object of the page.  Seriously, spend some time learning p5.js because it will make drawing graphics a lot easier.  You can watch tutorial videos on the "Coding Train" youtube channel. They have a p5.js crash course under their playlists section.  It will make these functions make a lot more sense.
function setup() {
  // Create a p5.js canvas 800px wide and 600px high, and assign it to the global variable "cnv".
  g.cnv = createCanvas(800, 600);

  // Set the parent element to "graphics-wrapper"
  g.cnv.parent("graphics-wrapper");

  // The "main" element is unnecessary. Don't worry about this too much
  document.getElementsByTagName("main")[0].remove();
}

// Whatever is included in draw() will be calculated at 60 fps.  It is basically a loop that calls itself every 16.67 ms. You can pause it at any time with the noLoop() function and start it again with the loop() function. Be sure to include every graphics statement in a push() / pop() statement, because it minimizes the chance that you accidentally apply styling or properties to another graphics object.
function draw() {
  background(250);

  // Box for the graph
  fill(255); strokeWeight(1);
  rect(150, 50, 600, 450);

  // Fixed temperature of the right wall
  let Temp_final = 45;
  // Vectors to hold x and y positions for the shapes
  let x = new Array(10);
  let y = new Array(10);

  // DEFINING WALL SECTION COORDINATES
  // Left wall
  x[0] = 150; y[0] = 500;
  x[1] = 150; y[1] = 500 - 6 * (g.temperature_left_wall - 40); // Sets height of left wall based on input

  // Glass & Concrete connection
  x[2] = x[1] + 6 * 10 * g.glass_thickness;
  x[3] = x[2]; y[3] = y[0];

  // Concrete & Stainless Steel connection
  x[4] = x[2] + 6 * 10 * g.concrete_thickness; //y[4] = 100;
  x[5] = x[4]; y[5] = y[3];

  // Stainless Steel and Right Wall connection
  x[6] = x[5] + 6 * 10 * g.steel_thickness; //y[6] = 100;
  x[7] = x[6]; y[7] = y[5];

  // Fixed temperature right wall
  x[8] = 750; y[8] = 500 - 6 * (Temp_final - 40);
  x[9] = 750; y[9] = 500;

  // MATERIAL PROPERTIES
  let k_glass = .96 / 100; // W/cm-K
  let k_concrete = 1.4 / 100;
  let k_steel = 16.3 / 100;
  let k_other;

  // Assigning k-value based on last wall material
  switch (g.right_wall_material) {
    case 'fiberglass':
      k_other = .04 / 100;
      break;
    case 'brick':
      k_other = 1.4 / 100;
      break;
    case 'lead':
      k_other = 35 / 100;
      break;
  }

  // Lengths of each wall segment
  let x_glass = (x[2] - x[1]) / 60;
  let x_concrete = (x[4] - x[2]) / 60;
  let x_steel = (x[6] - x[4]) / 60;
  let x_other = (x[8] - x[6]) / 60;

  // HEAT TRANSFER EQUATIONS
  // Total Resistance from 0=>10 cm
  let R_total = (x_glass / k_glass) + (x_concrete / k_concrete) + (x_steel / k_steel) + (x_other / k_other);

  // Heat flux based on deltaT from L to R wall
  let qx = (g.temperature_left_wall - Temp_final) / R_total;

  // Temperature values at connection between wall materials
  let Tglass_conc = g.temperature_left_wall - qx * (x_glass / k_glass);
  let Tconc_steel = Tglass_conc - qx * (x_concrete / k_concrete);
  let Tsteel_other = Tconc_steel - qx * (x_steel / k_steel);

  // Defining wall coordinates based on calculated temperatures
  y[2] = 500 - 6 * (Tglass_conc - 40);
  y[4] = 500 - 6 * (Tconc_steel - 40);
  y[6] = 500 - 6 * (Tsteel_other - 40);

  // DRAWING WALL SECTIONS AND LABELS
  // Glass wall
  // Shape
  push();
  fill(0, 255, 255); strokeWeight(0);
  quad(x[0], y[0], x[1], y[1], x[2], y[2], x[3], y[3]);
  pop();

  // Label
  let angletemp = radians(-90); // Rotation angle for text
  if (g.glass_thickness > .4 && g.temperature_left_wall > 55) { // Size requirements for when to make the label are somewhat arbitrary, based on when I thought it looked too cramped
    push(); fill(0);
    translate(x[1] + .6 * (x[2] - x[1]) + 5, y[0] - .2 * (y[0] - y[1])); // Position for the text
    rotate(angletemp);
    text("Glass", 0, 0);
    pop();
  }

  // Concrete wall
  // Shape
  push();
  fill(255, 255, 0); strokeWeight(0);
  quad(x[3], y[3], x[2], y[2], x[4], y[4], x[5], y[5]);
  pop();

  // Label
  if (g.concrete_thickness > .4 && (y[5] - y[4]) > 120) {
    push(); fill(0);
    translate(x[2] + .6 * (x[4] - x[2]) + 5, y[3] - .2 * (y[3] - y[2]));
    rotate(angletemp);
    text("Concrete", 0, 0);
    pop();
  }

  // Stainless Steel wall
  // Shape
  push();
  fill(255, 0, 255); strokeWeight(0);
  quad(x[5], y[5], x[4], y[4], x[6], y[6], x[7], y[7]);
  pop();
  // Label
  if (g.steel_thickness > .4 && (y[7] - y[6] > 110)) {
    push(); fill(0);
    translate(x[4] + .6 * (x[6] - x[4]) + 5, y[5] - .2 * (y[5] - y[4]));
    rotate(angletemp);
    text("S. Steel", 0, 0);
    pop();
  }

  // Other wall
  // Shape
  push();
  fill(0, 255, 0); strokeWeight(0);
  quad(x[7], y[7], x[6], y[6], x[8], y[8], x[9], y[9]);
  pop();

  // Label
  if (y[7] - y[6] > 75) {
    push(); fill(0);
    translate(x[6] + .13 * (x[8] - x[6]), y[7] - .2 * (y[7] - y[6]));
    text(g.right_wall_material, 0, 0);
    pop();
  }


  // Line that covers the top of the wall
  fill(0); strokeWeight(2.5);
  line(x[1], y[1], x[2], y[2]); line(x[2], y[2], x[4], y[4]);
  line(x[4], y[4], x[6], y[6]); line(x[6], y[6], x[8], y[8]);

  // CODE TO GENERATE GRAPH GRID LINES BELOW
  // Temperature and distance values to be displayed
  let temps = [40, 50, 60, 70, 80, 90, 100, 110];
  let dists = [0, 2, 4, 6, 8, 10];

  strokeWeight(1); textSize(25);
  let start = 500, counter0 = 0, left = 150, right = 750; // Variables to aid in positioning tick marks

  //TEMP LINES AND LABELS
  for (let i = 0; i < 38; i++) {
    if (i == 0) {
      fill(0);
      text(temps[counter0], left - 30, start - 12 * i + 10);
      counter0++;
    } else if (i % 5 == 0) { // Checking remainder to draw longer lines
      line(left, start - 12 * i, left + 10, start - 12 * i); // left long lines
      line(right, start - 12 * i, right - 10, start - 12 * i); // right long lines

      // If-else statement to accomodate spacing from left edge of 3-digit numbers
      if (counter0 <= 5) {
        text(temps[counter0], left - 33, start - 12 * i + 10);
        counter0++;
      } else {
        text(temps[counter0], left - 45, start - 12 * i + 10);
        counter0++;
      }
    } else {
      line(left, start - 12 * i, left + 5, start - 12 * i); // Left short lines
      line(right, start - 12 * i, right - 5, start - 12 * i); // right short lines
    }
  }

  let counter1 = 0, start2 = 150, top = 50, bottom = 500; // Variables to aid in positioning tick marks

  // DISTANCE LINES AND LABELS
  for (let i = 0; i < 21; i++) {
    if (i == 0) {
      text(dists[counter1], start2 + 30 * i - 5, bottom + 30);
      counter1++;
    } else if (i % 4 == 0) {
      line(start2 + 30 * i, top, start2 + 30 * i, top + 10);
      line(start2 + 30 * i, bottom, start2 + 30 * i, bottom - 10);
      text(dists[counter1], start2 + 30 * i - 10, bottom + 30);
      counter1++;
    } else {
      line(start2 + 30 * i, top, start2 + 30 * i, top + 5);
      line(start2 + 30 * i, bottom, start2 + 30 * i, bottom - 5);
    }
  }

  // GRAPH LABELS
  // X-axis label
  fill(0);
  text("Wall Thickness (cm)", 350, 575);

  // Y-axis label
  push();
  let angle1 = radians(270);
  translate(85, 400);
  rotate(angle1);
  text("Temperature (\xB0C)", 0, 0);
  pop();

  // Heat flux display
  fill(0);
  let heatflux = Math.round(qx * 100 * 100); // Rounding heat flux value
  let HF_value = heatflux.toString(); // Converting it to a string
  let title = "Heat flux = ";
  let units = " W/m^2";
  let HF_temp = title.concat(HF_value); // Combining phrases
  let HF_display = HF_temp.concat(units);
  text(HF_display, 300, 100);
  // Arrow
  rect(325, 125, 170, 2);
  triangle(495, 135, 495, 115, 530, 125)

}

const temperature_slider = document.getElementById("temperature-slider");
const temperature_label = document.getElementById("temperature-value");
const glass_thickness_slider = document.getElementById("glass-thickness-slider");
const glass_thickness_label = document.getElementById("glass-thickness-value");
const concrete_thickness_slider = document.getElementById("concrete-thickness-slider");
const concrete_thickness_label = document.getElementById("concrete-thickness-value");
const steel_thickness_slider = document.getElementById("steel-thickness-slider");
const steel_thickness_label = document.getElementById("steel-thickness-value");
const select_right_wall = document.getElementById("select-right-wall");

temperature_slider.addEventListener("input", function () {
  const temperature_value = Number(temperature_slider.value); // temperature-slider value is a string by default, so we need to convert it to a number.
  temperature_label.innerHTML = `${temperature_value.toFixed(0)}`; // Edit the text of the global var g.temperature_left_wall
  g.temperature_left_wall = temperature_value; // Assign the number to the global object.
});

glass_thickness_slider.addEventListener("input", function () {
  const glass_thickness_value = Number(glass_thickness_slider.value);
  glass_thickness_label.innerHTML = `${glass_thickness_value.toFixed(1)}`;
  g.glass_thickness = glass_thickness_value;
});

concrete_thickness_slider.addEventListener("input", function () {
  const concrete_thickness_value = Number(concrete_thickness_slider.value);
  concrete_thickness_label.innerHTML = `${concrete_thickness_value.toFixed(1)}`;
  g.concrete_thickness = concrete_thickness_value;
});

steel_thickness_slider.addEventListener("input", function () {
  const steel_thickness_value = Number(steel_thickness_slider.value);
  steel_thickness_label.innerHTML = `${steel_thickness_value.toFixed(1)}`;
  g.steel_thickness = steel_thickness_value;
});

select_right_wall.addEventListener("change", function () {
  const select_value = select_right_wall.value;
  g.right_wall_material = select_value;
})