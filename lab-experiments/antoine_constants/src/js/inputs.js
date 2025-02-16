const calcAll = require("./calcs.js");

const n_slider = document.getElementById("n-slider");
const n_value = document.getElementById("n-value");
const select_chemical = document.getElementById("select-chemical");
const go_button = document.getElementById("go-button");
const reset_button = document.getElementById("reset-button");

const minTemperature = 5; // 5°C
const maxTemperature = 100; // 100°C
let startTime = null; // To keep track of the starting time

// Function to update temperature continuously over time
g.updateTemperature = function() {
  const maxTemperature = 100; // 100°C
  const minTemperature = 5; // 5°C
  const elapsedTime = (Date.now() - startTime) / 1000; // Elapsed time in seconds
  const temperatureRange = maxTemperature - minTemperature;

  // Increment the temperature based on elapsed time
  g.T = minTemperature + (temperatureRange * elapsedTime / 20); // Adjust "20" to control speed

  // Cap the temperature at the maximum value
  if (g.T >= maxTemperature) {
    g.T = maxTemperature;
    g.is_running = false; // Stop updating when max temperature is reached
    go_button.removeAttribute("disabled"); // Enable the "Go" button
  }

  // Force redraw (if necessary)
  redraw();
}


// Function to start temperature updates when "Go" button is clicked
function startTemperatureUpdate() {
  if (!g.is_running) {
    g.is_running = true;
    go_button.setAttribute("disabled", "yes"); // Disable the "Go" button during the experiment
    startTime = null; // Reset start time
    g.temperatureInterval = setInterval(updateTemperature, 50); // Update temperature every 50ms
  }
}


// Handle mole quantity slider (n-slider)
n_slider.addEventListener("input", () => {
  const n = Number(n_slider.value);
  if (!g.is_finished && !g.is_running) {
    g.n = n;
    g.syringe_fraction = 1 - n / 2;
  }
  g.syringe_initial = 1 - n / 2; // 2 is the max number of moles you can inject
  n_value.innerHTML = `${n.toFixed(2)}`;
  if (g.is_finished) {
    g.n = n;
    calcAll();
    g.P = g.P_final;
    g.V = g.V_final;
    g.L = g.L_final;
    g.vapor_density = g.final_vapor_density;
    g.liquid_level = g.final_liquid_level;
  }
  redraw();
});

// Chemical selection event listener
select_chemical.addEventListener("change", () => {
  const chemical = select_chemical.value;
  g.chemical = chemical;
  reset_injection();
  redraw();
});

// "Go" button (start button)
go_button.addEventListener("mousedown", () => {
  begin_injection();
  go_button.style.background = "rgb(183, 228, 183)";
  window.setTimeout(() => {
    go_button.style.background = null;
  }, 50);

});

// Reset button event listener
reset_button.addEventListener("mousedown", () => {
  reset_injection();
  reset_button.style.background = "rgb(255, 150, 150)";
  window.setTimeout(() => {
    reset_button.style.background = null;
  }, 50);
});

function begin_injection() {
  if (!g.is_running && !g.is_finished) {
    startTime = Date.now(); // Set the start time
    g.is_running = true;
    console.log(g.T);
    calcAll();
    startTemperatureUpdate();
    loop();
    go_button.setAttribute("disabled", "yes");
    select_chemical.setAttribute("disabled", "yes");
  }
}

function reset_injection() {
  g.is_running = false;
  g.is_finished = false;
  g.liquid_level = 0;
  g.vapor_density = 0;
  g.P = 0;
  g.V = 0;
  g.L = 0;
  g.T = 5;
  g.L_final = 0;
  g.V_final = 0;
  g.P_final = 0;
  g.syringe_fraction = g.syringe_initial;
  g.percent_injected = 0;
  select_chemical.removeAttribute("disabled");
  go_button.removeAttribute("disabled");
  window.clearInterval(g.reset_interval);
  reset_button.style.transition = "";
  reset_button.classList.remove("bright");
  redraw();
}