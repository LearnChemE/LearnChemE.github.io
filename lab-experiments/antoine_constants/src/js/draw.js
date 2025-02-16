const tank_diameter = 200;
g.is_injected = false; // Flag to track if injection has occurred
g.T = 5; // Starting temperature
g.temperature_increase_rate = 0.01; // Temperature increase rate per update (you can adjust this)
g.max_temperature = 100; // Max temperature


// Define the initial and maximum temperature (in °C)
const minTemperature = 5; // 5°C
const maxTemperature = 100; // 100°C

function onInject() {
  // Set flag that injection has occurred
  g.is_injected = true;

  // Optionally, set the initial moles and adjust the tank's liquid level
  g.n = parseFloat(document.getElementById('n-slider').value);
  g.liquid_level = g.n / 2; // Assuming 2L tank, adjust liquid level accordingly

  // Start temperature increase
  g.T = 5; // Start from 5°C
  loop(); // Start p5.js loop to continually update temperature
}

function updateTemperature() {
  console.log("draw ut", g.is_injected);

  if (g.is_injected && g.T < g.max_temperature) {
    // Gradually increase the temperature from 5°C to 100°C
    g.T += g.temperature_increase_rate;

    // Ensure it doesn't exceed max temperature
    if (g.T > g.max_temperature) {
      console.log("temp", g.T);
      console.log("max temp", g.max_temperature)
      g.T = g.max_temperature;
      noLoop(); // Stop looping when the temperature reaches the maximum
    }
  }
}

// function drawTemperatureProgressBar() {
//   push();
//   translate(50, height / 2); // Position the progress bar

//   // Draw the background of the progress bar
//   fill(200);
//   rect(0, -150, 20, 300); // Position and size of the bar (adjust as needed)

//   // Draw the progress (temperature) as a filled rectangle
//   const progressHeight = map(g.temperature, 5, 100, 0, 300); // Map temperature to progress height
//   fill(255, 0, 0); // Red color for the progress
//   rect(0, -150 + (300 - progressHeight), 20, progressHeight); // Update bar height

//   // Optionally, display the current temperature on the bar
//   fill(0);
//   textSize(16);
//   text(`${g.temperature.toFixed(1)}°C`, 0, -130 + (300 - progressHeight)); 

//   pop();
// }

function drawTemperatureProgressBar() {
  push();
  translate(50, height / 2); // Position the progress bar

  // Draw the background of the progress bar
  fill(200);
  rect(0, -150, 20, 300); // Background rectangle

  // Draw the progress (temperature) as a filled rectangle
  const progressHeight = map(g.T, 5, 100, 0, 300); // Map temperature to progress height
  fill(255, 0, 0); // Red color for the progress
  rect(0, -150 + (300 - progressHeight), 20, progressHeight); // Update bar height

  // Display the current temperature on the bar
  fill(0);
  textAlign(CENTER, BOTTOM);
  textSize(16);
  text(`${g.T.toFixed(1)}°C`, 10, -150 + (300 - progressHeight) - 10);

  pop();
}


function drawTank() {
  push();
  translate(width / 2, height / 2);
  fill(50);
  stroke(0);
  rectMode(CENTER);
  rect(-270, 80, 25, 80);
  rect(-170, 80, 25, 80);
  fill(120);
  rect(-280, 100, 25, 90);
  rect(-160, 100, 25, 90);
  stroke(50);
  rect(-220, -100, 10, 30);
  fill(255);
  strokeWeight(2);
  ellipse(-220, -137.5, 70, 45);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  text(`${g.P.toFixed(2)} bar`, -218, -137);
  pop();
}

function drawLiquid() {
  push();
  translate(width / 2, height / 2);
  noStroke();
  fill(g.liquid_color);
  ellipse(-220, 0, tank_diameter, tank_diameter);

  // Background color
  fill(g.background_color);

  // Liquid level calculations
  const triangle_height_top = 200 - 400 * Math.abs(0.5 - g.liquid_level);
  const triangle_height_bottom = 200 - triangle_height_top;
  const radius = tank_diameter * 0.5;
  let angle = Math.asin(triangle_height_bottom / (radius * 2));
  let angle2 = g.liquid_level >= 0.5 ? -angle : angle;

  // Draw liquid shape
  beginShape();
  for (let i = -Math.PI - angle2; i < angle2; i += 0.01) {
    const x_value = Math.cos(i) * radius - 220;
    const y_value = Math.sin(i) * radius;
    vertex(x_value, y_value);
  }
  endShape();

  // Vapor density fill
  fill(g.liquid_color[0], g.liquid_color[1], g.liquid_color[2], g.vapor_density * 137);
  ellipse(-220, 0, tank_diameter, tank_diameter);

  // Bottom ellipse for liquid level
  const ellipse_width = Math.sin(Math.PI / 2 - angle) * 2 * radius - 3;
  const ellipse_y = -100 + (1 - g.liquid_level) * tank_diameter;
  const ellipse_height = 25 - 50 * Math.abs(g.liquid_level - 0.5);
  stroke(50);
  fill(g.liquid_color[0] - 30, g.liquid_color[1] - 30, g.liquid_color[2] - 30);
  ellipse(-220, ellipse_y, ellipse_width, ellipse_height);

  // Draw tank outline
  stroke(100);
  noFill();
  ellipse(-220, 0, tank_diameter, tank_diameter);
  pop();
}

function drawSyringe() {
  push();
  translate(width / 2, height / 2);
  rectMode(CORNER);
  noStroke();

  // Syringe liquid
  fill(g.liquid_color);
  rect(-80, -12.5, 5 + (1 - g.syringe_fraction) * 92, 25);

  // Syringe body
  stroke(0);
  fill(150);
  rect(-120, -1, 40, 2);
  fill(150);
  rect(15 - 90 * g.syringe_fraction, -3, 105, 6);

  // Syringe plunger
  rectMode(CENTER);
  fill(120);
  rect(15 - 90 * g.syringe_fraction, 0, 4, 23);

  // Syringe nozzle
  rectMode(CORNER);
  fill(180);
  rect(120 - 90 * g.syringe_fraction, -13, 3, 26);

  // Syringe details
  rect(-82, -5, 2, 10);

  // Syringe gradient
  setGradient(-80, -12.5, 100, 25, color(240, 240, 240, 127), color(215, 215, 215, 127), 1);

  // Syringe border
  noFill();
  rectMode(CORNER);
  stroke(100);
  rect(-80, -12.5, 100, 25, 2, 2);
  pop();
}

function setGradient(p, x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === 1) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === 2) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

// Locate your existing `drawGraph` function and modify it as follows:
function drawGraph() {
  const graph_height = 350;
  const graph_width = 200;
  push();
  translate(3 * width / 4, height / 2);
  stroke(0);
  noFill();

  // Draw axes
  line(-50, -200, -50, -200 + graph_height);
  line(-50, 150, -50 + graph_width, 150);

  // Draw graph ticks and labels
  textSize(16);
  for (let i = 0; i <= 2; i += 0.1) {
    i = Number(Math.round(i * 10) / 10); // Fix floating point precision error
    const y = 150 - (i / 2) * 350;
    const x = -50;
    const length = i % 0.5 === 0 ? 4 : 2;

    // Draw tick marks
    stroke(0);
    noFill();
    line(x, y, x + length, y);

    if (length === 4) {
      // Draw labels for major ticks
      noStroke();
      fill(0);
      text(`${i.toFixed(1)}`, x - 30, y + 5);
    }
  }

  // Calculate the change in liquid and vapor amounts based on temperature
  let height_V_bar = 0;
  let height_L_bar = 0;

  if (g.T > 50) {
    // As temperature increases, more of the liquid turns into vapor (simplified logic)
    height_V_bar = (g.T - 50) * 0.7; // Adjust scaling factor as needed
    height_L_bar = 350 - height_V_bar; // The remaining part is liquid
  }

  // Draw the vapor and liquid bars
  rectMode(CORNERS);
  stroke(0);
  fill(150, 150, 255); // Vapor color (light blue)
  rect(-30, -200 + graph_height, -30 + graph_width / 3, -200 + graph_height - height_V_bar);
  fill(0, 0, 255); // Liquid color (blue)
  rect(-30 + graph_width / 3 + 20, -200 + graph_height, -10 + 2 * graph_width / 3, -200 + graph_height - height_L_bar);

  // Display the labels for the bars
  noStroke();
  fill(0);
  textAlign(CENTER, BOTTOM);
  textSize(18);
  text("moles in tank", -55 + graph_width / 2, -230);
  textSize(16);
  const V_text = g.V === 0 ? "0.00" : g.V.toFixed(2);
  const L_text = g.L === 0 ? "0.00" : g.L.toFixed(2);
  text(`${V_text}`, -30 + graph_width / 6, -200 + graph_height - height_V_bar - 5);
  text(`${L_text}`, -10 + graph_width / 2, -200 + graph_height - height_L_bar - 5);

  // Draw vapor and liquid labels
  text("vapor", -30 + graph_width / 6, -200 + graph_height + 30);
  text("liquid", -10 + graph_width / 2, -200 + graph_height + 30);
  pop();
}

function drawText() {
  push();
  translate(width / 2, height / 2);
  textSize(16);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  textWrap(WORD);

  let text_above_syringe = "";
  let text_below_syringe = "";
  let text_over_tank = "";

  const liquid_in_syringe = Number(g.n / g.rhoLm()).toFixed(2);

  // Text for different stages of the experiment
  if (!g.is_finished && !g.is_running) {
    text_above_syringe = "ready to inject liquid into empty vessel";
    text_below_syringe = `syringe contains ${liquid_in_syringe} L liquid`;
    text_over_tank = "";
  } else if (g.is_running && !g.is_finished) {
    text_above_syringe = "";
    text_below_syringe = "injecting liquid ...";
    text_over_tank = "";
  } else {
    text_below_syringe = `injected ${liquid_in_syringe} L liquid`;
    text_above_syringe = "";
    text_over_tank = g.L_final === 0 ? "all vapor" : "vapor-liquid mixture";
  }

  // Display the text over the tank
  text(text_over_tank, -220, 0);
  text(text_above_syringe, -120, -45, 200);
  text(text_below_syringe, -10, 40);
  text("tank volume = 2 L", -220, 180);

  pop();
}

function drawAll() {
  //updateTemperature(); // Update temperature dynamically

  drawTank();
  drawLiquid();
  drawSyringe();
  drawGraph();
  drawTemperatureProgressBar();
  drawText();

  // Update slider states (remove temperature slider)
  if (!g.is_finished && !g.is_running) {
    document.getElementById("n-slider").removeAttribute("disabled");
  } else if (g.is_running && g.percent_injected === 0) {
    document.getElementById("n-slider").setAttribute("disabled", "yes");
  }

  if (g.is_finished) {
    document.getElementById("n-slider").removeAttribute("disabled");
    noLoop();
  }
}

module.exports = drawAll;