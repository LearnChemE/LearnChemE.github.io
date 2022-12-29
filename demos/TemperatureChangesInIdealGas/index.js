window.g = {
  cnv: undefined,
  HEAT: 5,
  heatStatus: 'heat-gas',
  Fr: 20, // Going to use this to modulate framerate until I get something that looks nice
  T1: 300, //K
  R: 8.314, // J/mol/K
  cp: 0,
  cv: 0,
  progress_temp: 0,
  go: false, // Used to start and stop animation depends on the play, pause, and reset buttons
}

function setup() {
  g.cnv = createCanvas(800, 600);

  g.cnv.parent("graphics-wrapper");

  document.getElementsByTagName("main")[0].remove();
  fillProps();
  frameRate(g.Fr);
  drawFrame();

}
let progress = 0; // Second progress variable that I could fix to a certain number of decimals

function draw() {
  background(250);

  switch (g.heatStatus) {
    case 'heat-gas':
      math(progress);
      push(); textSize(25);
      if (progress == 0) {
        text('add ' + g.HEAT + ' kJ/mol heat', width / 2 - 105, 50);
      } else {
        text((g.HEAT * progress / 10).toFixed(1) + ' kJ/mol heat added', width / 2 - 120, 50);
      }
      pop();
      break;
    case 'cool-gas':
      math(progress);
      push(); textSize(25);
      if (progress == 0) {
        text('remove ' + g.HEAT + ' kJ/mol heat', width / 2 - 125, 50);
      } else {
        text((g.HEAT * progress / 10).toFixed(1) + ' kJ/mol heat removed', width / 2 - 140, 50);
      }
      break;
  }

  // I'm using two different variables for progress due to numerical issues
  // When I was just using g.progress it kept ending at .999999 or so
  // Then when I tried to round it off to fixed 1 I couldn't iterate by .1 anymore so
  if (g.progress_temp < 9.9 && g.go) {
    g.progress_temp += .1;
    progress = g.progress_temp;
    progress = progress.toFixed(1);
  }
  drawFrame();

}

// Draws the outer box and either heating or cooling element
function drawFrame() {
  push();
  textSize(25);
  text('Constant pressure', width / 2 - 275, 100);
  text('Constant volume', width / 2 + 75, 100);
  strokeWeight(2);

  // Boxes for W, deltaU, and deltaH labels
  push();
  noFill();
  rect(width / 2 - 275, 125, 200, 100);
  rect(width / 2 + 75, 125, 200, 100);
  pop();

  // Reactor box thingy
  strokeWeight(4);
  line(width / 2 - 275, 250, width / 2 - 275, 500);
  line(width / 2 - 75, 250, width / 2 - 75, 500);
  line(width / 2 - 275, 500, width / 2 - 75, 500);
  line(width / 2 + 275, 250, width / 2 + 275, 500);
  line(width / 2 + 75, 250, width / 2 + 75, 500);
  line(width / 2 + 275, 500, width / 2 + 75, 500);
  stroke(75);
  line(width / 2 - 275, 500, width / 2 - 300, 525);
  line(width / 2 - 75, 500, width / 2 - 50, 525);

  line(width / 2 + 275, 500, width / 2 + 300, 525);
  line(width / 2 + 75, 500, width / 2 + 50, 525);

  if (g.heatStatus == 'heat-gas') {
    strokeWeight(1);
    stroke(0);
    fill(100);
    quad(width / 2 + 70, 530, width / 2 + 280, 530, width / 2 + 290, 540, width / 2 + 60, 540); // Heating element
    quad(width / 2 - 70, 530, width / 2 - 280, 530, width / 2 - 290, 540, width / 2 - 60, 540);
  } else {
    stroke(75); strokeWeight(4);
    line(width / 2 - 300, 525, width / 2 - 300, 375); // Water box thingy
    line(width / 2 - 300, 525, width / 2 - 50, 525);
    line(width / 2 - 50, 525, width / 2 - 50, 375);
    line(width / 2 + 300, 525, width / 2 + 300, 375);
    line(width / 2 + 50, 525, width / 2 + 50, 375);
    line(width / 2 + 50, 525, width / 2 + 300, 525);
  }
  pop();
}

// Does the math scaled by progress variable
function math(progress) {
  let T2P, T2V, P1, V1, V2, P2, WP, WV, delUP, delUV, delHP, delHV, h1, h2;
  progress = progress / 10; // Scaling progression variable
  let Q = g.HEAT * 1000 * progress;

  T2P = g.T1 + Q / g.cp; // Constant pressure T2 (K)
  T2V = g.T1 + Q / g.cv; // Constant volume T2 (K)

  P1 = 1 * Math.pow(10, 6); // P1 for both systems (Pa)
  V1 = g.R * g.T1 / P1; // Constant pressure V1 (m^3/mol)

  V2 = g.R * T2P / P1; // Constant pressure V2 (m^3/mol)
  P2 = g.R * T2V / V1; // Constant volume P2 (Pa)

  WP = -P1 * (V2 - V1); // Constant pressure work (kJ/mol)
  WV = 0; // Constant volume work (J/mol)

  delUP = (Q + WP) // delta U constant pressure (J/mol)
  delUV = Q; // delta U constant volume (J/mol)
  delHP = Q; // delta H constant pressure (J/mol)
  delHV = delUV + g.R * (T2V - g.T1); // delta H constant volume (J/mol)

  // Fixing to one decimal and converting J/mol -> kJ/mol
  WP = (WP / 1000).toFixed(1);
  delUP = (delUP / 1000).toFixed(1);
  delHP = (delHP / 1000).toFixed(1);

  delUV = (delUV / 1000).toFixed(1);
  delHV = (delHV / 1000).toFixed(1);


  // Labels for W, deltaU, and deltaH
  push();
  textSize(23);
  push();
  textStyle(ITALIC);
  text("W ", width / 2 - 255, 150);
  text("ΔU ", width / 2 - 260, 180);
  text("ΔH ", width / 2 - 260, 210);
  text("W ", width / 2 + 95, 150);
  text("ΔU ", width / 2 + 90, 180);
  text("ΔH ", width / 2 + 90, 210);
  pop();
  text("= " + WP + " kJ/mol", width / 2 - 225, 150);
  text("= " + delUP + " kJ/mol", width / 2 - 220, 180);
  text("= " + delHP + " kJ/mol", width / 2 - 220, 210);
  text("= " + WV + " kJ/mol", width / 2 + 125, 150);
  text("= " + delUV + " kJ/mol", width / 2 + 130, 180);
  text("= " + delHV + " kJ/mol", width / 2 + 130, 210);
  pop();

  T2V = T2V.toFixed(0);
  P2 = (P2 / Math.pow(10, 6)).toFixed(2);
  T2P = T2P.toFixed(0);
  P1 = (P1 / Math.pow(10, 6)).toFixed(2);

  // Animation
  if (g.heatStatus == 'heat-gas') {
    let height;
    push();
    // Constant pressure box
    noStroke(); fill(11, 218, 81);
    height = map(T2P, 128, 644, 86, 200); // For adjusting the height of the box, the upper end makes sure it doesn't overflow into the value labels, lower end was adjusted until they start at the same height
    rect(width / 2 - 275, 500, 200, -height);
    stroke(0); fill(100);
    rect(width / 2 - 275, 500 - height, 200, -25);
    textSize(23); noStroke(); fill(0);
    push();
    textStyle(ITALIC);
    text("T", width / 2 - 225, 500 - height / 2);
    text("P", width / 2 - 245, 455 - height)
    pop();
    text(" = " + T2P + " K", width / 2 - 210, 500 - height / 2);
    text(" = " + P1 + " MPa", width / 2 - 230, 455 - height);
    pop();

    push();
    // Constant volume box
    noStroke(); fill(11, 218, 81);
    rect(width / 2 + 75, 500, 200, -125);
    stroke(0); fill(100);
    rect(width / 2 + 75, 375, 200, -25);
    fill(255, 0, 0); strokeWeight(2);
    triangle(width / 2 + 75, 350, width / 2 + 110, 350, width / 2 + 75, 315);
    triangle(width / 2 + 275, 350, width / 2 + 240, 350, width / 2 + 275, 315);
    textSize(23); noStroke(); fill(0);
    push();
    textStyle(ITALIC);
    text("T", width / 2 + 125, 440);
    text("P", width / 2 + 105, 330);
    pop();
    text(" = " + T2V + " K", width / 2 + 140, 440);
    text(" = " + P2 + " MPa", width / 2 + 120, 330);
    pop();
    if (progress < 10 && progress > 0) {
      flameDraw();
    }



  } else {
    let height;
    push();
    if (progress > 0 && progress < 10) {
      noStroke(); fill(0, 255, 255);
      rect(width / 2 - 300, 525, 250, -100); // *progress
      rect(width / 2 + 50, 525, 250, -100); // *progress
    }
    pop();

    push();
    // Constant pressure
    fill(11, 218, 81);
    height = map(T2P, 128, 644, 86, 200);
    rect(width / 2 - 275, 500, 200, -height);
    stroke(0); fill(100);
    rect(width / 2 - 275, 500 - height, 200, -25);
    textSize(23); noStroke(); fill(0);
    push();
    textStyle(ITALIC);
    text("T", width / 2 - 225, 500 - height / 2);
    text("P", width / 2 - 245, 455 - height);
    pop();
    text(" = " + T2P + " K", width / 2 - 210, 500 - height / 2);
    text(" = " + P1 + " MPa", width / 2 - 230, 455 - height);
    pop();

    push();
    // Constant volume
    noStroke(); fill(11, 218, 81);
    rect(width / 2 + 75, 500, 200, -125);
    stroke(0); fill(100);
    rect(width / 2 + 75, 375, 200, -25);
    fill(255, 0, 0); strokeWeight(2);
    triangle(width / 2 + 75, 375, width / 2 + 110, 375, width / 2 + 75, 410);
    triangle(width / 2 + 275, 375, width / 2 + 240, 375, width / 2 + 275, 410);
    textSize(23); noStroke(); fill(0);
    push();
    textStyle(ITALIC);
    text("T", width / 2 + 125, 440);
    text("P", width / 2 + 105, 330);
    pop();
    text(" = " + T2V + " K", width / 2 + 140, 440);
    text(" = " + P2 + " MPa", width / 2 + 120, 330);
    pop();
  }
}

// Adds cp and cv values
function fillProps() {
  g.cp = 7 * g.R / 2;
  g.cv = 5 * g.R / 2;
}

const heat = document.getElementById("HEAT"); // Gets value for heat into system
const heat_label = document.getElementById("HEAT-VALUE"); // Gets label for heat into the system
const addORremoveHeat = document.getElementById("heating-cooling").children; // Radio button for heating/cooling gas
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");
const resetButton = document.getElementById("reset-button");


heat.addEventListener("input", function () {
  const rng_1_value = Number(heat.value);
  heat_label.innerHTML = `${rng_1_value}`;
  g.HEAT = rng_1_value;
  redraw();
  if (progress > 0 && progress < 1) {
    g.progress_temp -= .1;
    progress = g.progress_temp;
    progress = progress.toFixed(1);
  }
});

// For switching radio button. Also changes label & value on the heat added/removed slider
for (let i = 0; i < addORremoveHeat.length; i++) {
  addORremoveHeat[i].addEventListener("click", function () {
    for (let j = 0; j < addORremoveHeat.length; j++) {
      addORremoveHeat[j].classList.remove("selected");
    };

    addORremoveHeat[i].classList.add("selected");
    g.heatStatus = addORremoveHeat[i].value;

    if (addORremoveHeat[i].value == "cool-gas") { // This conditional is for changing label and value of heat added/removed when swapping between the heating and cooling
      heat.setAttribute("min", "-5");
      heat.setAttribute("max", "0");
      heat.value = "-2";
      g.HEAT = heat.value;
      heat_label.innerHTML = `${g.HEAT}`;
      const temp = document.getElementById("HEAT-label");
      temp.innerHTML = "Heat removed (kJ/mol)";
      g.progress_temp = 0;
      progress = 0;
      g.go = false;

    } else {
      heat.setAttribute("min", "0");
      heat.setAttribute("max", "10");
      heat.value = "5";
      g.HEAT = heat.value;
      heat_label.innerHTML = `${g.HEAT}`;
      heat.setAttribute("input-label", "Heat added (kJ/mol)");
      const temp = document.getElementById("HEAT-label");
      temp.innerHTML = "Heat added (kJ/mol)";
      g.progress_temp = 0;
      progress = 0;
      g.go = false;
    }
  });
};

playButton.addEventListener("click", function () {
  g.go = true;
});

pauseButton.addEventListener("click", function () {
  if (progress != 1 && progress != 10) {
    g.progress_temp -= .1; // Whenever I hit pause the animation would advance an extra step for some reason so I'm back tracking a step to account for that when pause is hit
    progress = g.progress_temp;
    progress = progress.toFixed(1);
  }
  g.go = false; // Stops animation
});

resetButton.addEventListener("click", function () {
  g.progress_temp = 0;
  progress = 0;
  g.go = false; // Stops animation
});






