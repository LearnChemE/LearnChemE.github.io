const width = gvs.p.width;
const height = gvs.p.height;
const tank_diameter = 200;
gvs.is_injected = false;  // Flag to track if injection has occurred
gvs.T = 5;       // Starting temperature
gvs.temperature_increase_rate = 0.01; // Temperature increase rate per update (you can adjust this)
gvs.max_temperature = 100; // Max temperature


// Define the initial and maximum temperature (in °C)
const minTemperature = 5; // 5°C
const maxTemperature = 100; // 100°C

function onInject() {
  // Set flag that injection has occurred
  gvs.is_injected = true;

  // Optionally, set the initial moles and adjust the tank's liquid level
  gvs.n = parseFloat(document.getElementById('n-slider').value);
  gvs.liquid_level = gvs.n / 2;  // Assuming 2L tank, adjust liquid level accordingly

  // Start temperature increase
  gvs.T = 5; // Start from 5°C
  gvs.p.loop(); // Start p5.js loop to continually update temperature
}

function updateTemperature() {
  console.log("draw ut", gvs.is_injected);

  if (gvs.is_injected && gvs.T < gvs.max_temperature) {
    // Gradually increase the temperature from 5°C to 100°C
    gvs.T += gvs.temperature_increase_rate;

    // Ensure it doesn't exceed max temperature
    if (gvs.T > gvs.max_temperature) {
      console.log("temp", gvs.T);
      console.log("max temp", gvs.max_temperature)
      gvs.T = gvs.max_temperature;
      gvs.p.noLoop(); // Stop looping when the temperature reaches the maximum
    }
  }
}

// function drawTemperatureProgressBar(p) {
//   p.push();
//   p.translate(50, height / 2); // Position the progress bar
  
//   // Draw the background of the progress bar
//   p.fill(200);
//   p.rect(0, -150, 20, 300); // Position and size of the bar (adjust as needed)

//   // Draw the progress (temperature) as a filled rectangle
//   const progressHeight = p.map(gvs.temperature, 5, 100, 0, 300); // Map temperature to progress height
//   p.fill(255, 0, 0); // Red color for the progress
//   p.rect(0, -150 + (300 - progressHeight), 20, progressHeight); // Update bar height

//   // Optionally, display the current temperature on the bar
//   p.fill(0);
//   p.textSize(16);
//   p.text(`${gvs.temperature.toFixed(1)}°C`, 0, -130 + (300 - progressHeight)); 

//   p.pop();
// }

function drawTemperatureProgressBar(p) {
  p.push();
  p.translate(50, p.height / 2); // Position the progress bar
  
  // Draw the background of the progress bar
  p.fill(200);
  p.rect(0, -150, 20, 300); // Background rectangle

  // Draw the progress (temperature) as a filled rectangle
  const progressHeight = p.map(gvs.T, 5, 100, 0, 300); // Map temperature to progress height
  p.fill(255, 0, 0); // Red color for the progress
  p.rect(0, -150 + (300 - progressHeight), 20, progressHeight); // Update bar height

  // Display the current temperature on the bar
  p.fill(0);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(16);
  p.text(`${gvs.T.toFixed(1)}°C`, 10, -150 + (300 - progressHeight) - 10); 

  p.pop();
}


function drawTank(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.fill(50);
  p.stroke(0);
  p.rectMode(p.CENTER);
  p.rect(-270, 80, 25, 80);
  p.rect(-170, 80, 25, 80);
  p.fill(120);
  p.rect(-280, 100, 25, 90);
  p.rect(-160, 100, 25, 90);
  p.stroke(50);
  p.rect(-220, -100, 10, 30);
  p.fill(255);
  p.strokeWeight(2);
  p.ellipse(-220, -137.5, 70, 45);
  p.fill(0);
  p.noStroke();
  p.textAlign(p.CENTER, p.CENTER);
  p.textSize(14);
  p.text(`${gvs.P.toFixed(2)} bar`, -218, -137);
  p.pop();
}

function drawLiquid(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.noStroke();
  p.fill(gvs.liquid_color);
  p.ellipse(-220, 0, tank_diameter, tank_diameter);

  // Background color
  p.fill(gvs.background_color);

  // Liquid level calculations
  const triangle_height_top = 200 - 400 * Math.abs(0.5 - gvs.liquid_level);
  const triangle_height_bottom = 200 - triangle_height_top;
  const radius = tank_diameter * 0.5;
  let angle = Math.asin(triangle_height_bottom / (radius * 2));
  let angle2 = gvs.liquid_level >= 0.5 ? -angle : angle;

  // Draw liquid shape
  p.beginShape();
  for (let i = -Math.PI - angle2; i < angle2; i += 0.01) {
    const x_value = Math.cos(i) * radius - 220;
    const y_value = Math.sin(i) * radius;
    p.vertex(x_value, y_value);
  }
  p.endShape();

  // Vapor density fill
  p.fill(gvs.liquid_color[0], gvs.liquid_color[1], gvs.liquid_color[2], gvs.vapor_density * 137);
  p.ellipse(-220, 0, tank_diameter, tank_diameter);

  // Bottom ellipse for liquid level
  const ellipse_width = Math.sin(Math.PI / 2 - angle) * 2 * radius - 3;
  const ellipse_y = -100 + (1 - gvs.liquid_level) * tank_diameter;
  const ellipse_height = 25 - 50 * Math.abs(gvs.liquid_level - 0.5);
  p.stroke(50);
  p.fill(gvs.liquid_color[0] - 30, gvs.liquid_color[1] - 30, gvs.liquid_color[2] - 30);
  p.ellipse(-220, ellipse_y, ellipse_width, ellipse_height);

  // Draw tank outline
  p.stroke(100);
  p.noFill();
  p.ellipse(-220, 0, tank_diameter, tank_diameter);
  p.pop();
}

function drawSyringe(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.rectMode(p.CORNER);
  p.noStroke();

  // Syringe liquid
  p.fill(gvs.liquid_color);
  p.rect(-80, -12.5, 5 + (1 - gvs.syringe_fraction) * 92, 25);

  // Syringe body
  p.stroke(0);
  p.fill(150);
  p.rect(-120, -1, 40, 2);
  p.fill(150);
  p.rect(15 - 90 * gvs.syringe_fraction, -3, 105, 6);

  // Syringe plunger
  p.rectMode(p.CENTER);
  p.fill(120);
  p.rect(15 - 90 * gvs.syringe_fraction, 0, 4, 23);

  // Syringe nozzle
  p.rectMode(p.CORNER);
  p.fill(180);
  p.rect(120 - 90 * gvs.syringe_fraction, -13, 3, 26);

  // Syringe details
  p.rect(-82, -5, 2, 10);

  // Syringe gradient
  setGradient(p, -80, -12.5, 100, 25, p.color(240, 240, 240, 127), p.color(215, 215, 215, 127), 1);

  // Syringe border
  p.noFill();
  p.rectMode(p.CORNER);
  p.stroke(100);
  p.rect(-80, -12.5, 100, 25, 2, 2);
  p.pop();
}

function setGradient(p, x, y, w, h, c1, c2, axis) {
  p.noFill();

  if (axis === 1) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = p.map(i, y, y + h, 0, 1);
      let c = p.lerpColor(c1, c2, inter);
      p.stroke(c);
      p.line(x, i, x + w, i);
    }
  } else if (axis === 2) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = p.map(i, x, x + w, 0, 1);
      let c = p.lerpColor(c1, c2, inter);
      p.stroke(c);
      p.line(i, y, i, y + h);
    }
  }
}

// Locate your existing `drawGraph` function and modify it as follows:
function drawGraph(p) {
  const graph_height = 350;
  const graph_width = 200;
  p.push();
  p.translate(3 * width / 4, height / 2);
  p.stroke(0);
  p.noFill();

  // Draw axes
  p.line(-50, -200, -50, -200 + graph_height);
  p.line(-50, 150, -50 + graph_width, 150);

  // Draw graph ticks and labels
  p.textSize(16);
  for (let i = 0; i <= 2; i += 0.1) {
    i = Number(Math.round(i * 10) / 10); // Fix floating point precision error
    const y = 150 - (i / 2) * 350;
    const x = -50;
    const length = i % 0.5 === 0 ? 4 : 2;

    // Draw tick marks
    p.stroke(0);
    p.noFill();
    p.line(x, y, x + length, y);

    if (length === 4) {
      // Draw labels for major ticks
      p.noStroke();
      p.fill(0);
      p.text(`${i.toFixed(1)}`, x - 30, y + 5);
    }
  }

  // Calculate the change in liquid and vapor amounts based on temperature
  let height_V_bar = 0;
  let height_L_bar = 0;

  if (gvs.T > 50) {
    // As temperature increases, more of the liquid turns into vapor (simplified logic)
    height_V_bar = (gvs.T - 50) * 0.7; // Adjust scaling factor as needed
    height_L_bar = 350 - height_V_bar; // The remaining part is liquid
  }

  // Draw the vapor and liquid bars
  p.rectMode(p.CORNERS);
  p.stroke(0);
  p.fill(150, 150, 255); // Vapor color (light blue)
  p.rect(-30, -200 + graph_height, -30 + graph_width / 3, -200 + graph_height - height_V_bar);
  p.fill(0, 0, 255); // Liquid color (blue)
  p.rect(-30 + graph_width / 3 + 20, -200 + graph_height, -10 + 2 * graph_width / 3, -200 + graph_height - height_L_bar);

  // Display the labels for the bars
  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.BOTTOM);
  p.textSize(18);
  p.text("moles in tank", -55 + graph_width / 2, -230);
  p.textSize(16);
  const V_text = gvs.V === 0 ? "0.00" : gvs.V.toFixed(2);
  const L_text = gvs.L === 0 ? "0.00" : gvs.L.toFixed(2);
  p.text(`${V_text}`, -30 + graph_width / 6, -200 + graph_height - height_V_bar - 5);
  p.text(`${L_text}`, -10 + graph_width / 2, -200 + graph_height - height_L_bar - 5);

  // Draw vapor and liquid labels
  p.text("vapor", -30 + graph_width / 6, -200 + graph_height + 30);
  p.text("liquid", -10 + graph_width / 2, -200 + graph_height + 30);
  p.pop();
}

function drawText(p) {
  p.push();
  p.translate(width / 2, height / 2);
  p.textSize(16);
  p.noStroke();
  p.fill(0);
  p.textAlign(p.CENTER, p.CENTER);
  p.textWrap(p.WORD);

  let text_above_syringe = "";
  let text_below_syringe = "";
  let text_over_tank = "";

  const liquid_in_syringe = Number(gvs.n / gvs.rhoLm()).toFixed(2);

  // Text for different stages of the experiment
  if (!gvs.is_finished && !gvs.is_running) {
    text_above_syringe = "ready to inject liquid into empty vessel";
    text_below_syringe = `syringe contains ${liquid_in_syringe} L liquid`;
    text_over_tank = "";
  } else if (gvs.is_running && !gvs.is_finished) {
    text_above_syringe = "";
    text_below_syringe = "injecting liquid ...";
    text_over_tank = "";
  } else {
    text_below_syringe = `injected ${liquid_in_syringe} L liquid`;
    text_above_syringe = "";
    text_over_tank = gvs.L_final === 0 ? "all vapor" : "vapor-liquid mixture";
  }

  // Display the text over the tank
  p.text(text_over_tank, -220, 0);
  p.text(text_above_syringe, -120, -45, 200);
  p.text(text_below_syringe, -10, 40);
  p.text("tank volume = 2 L", -220, 180);

  p.pop();
}

function drawAll(p) {
  //updateTemperature(); // Update temperature dynamically

  drawTank(p);
  drawLiquid(p);
  drawSyringe(p);
  drawGraph(p);
  drawTemperatureProgressBar(p);
  drawText(p);

  // Update slider states (remove temperature slider)
  if (!gvs.is_finished && !gvs.is_running) {
    document.getElementById("n-slider").removeAttribute("disabled");
  } else if (gvs.is_running && gvs.percent_injected === 0) {
    document.getElementById("n-slider").setAttribute("disabled", "yes");
  }

  if (gvs.is_finished) {
    document.getElementById("n-slider").removeAttribute("disabled");
    gvs.p.noLoop();
  }
}

module.exports = drawAll;
