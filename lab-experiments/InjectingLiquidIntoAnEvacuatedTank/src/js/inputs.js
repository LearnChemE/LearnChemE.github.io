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
gvs.updateTemperature = function(){
  const maxTemperature = 100; // 100°C
  const minTemperature = 5;   // 5°C
  const elapsedTime = (Date.now() - startTime) / 1000; // Elapsed time in seconds
  const temperatureRange = maxTemperature - minTemperature;

  // Increment the temperature based on elapsed time
  gvs.T = minTemperature + (temperatureRange * elapsedTime / 20); // Adjust "20" to control speed

  // Cap the temperature at the maximum value
  if (gvs.T >= maxTemperature) {
    gvs.T = maxTemperature;
    gvs.is_running = false; // Stop updating when max temperature is reached
    go_button.removeAttribute("disabled"); // Enable the "Go" button
  }

  // Force redraw (if necessary)
  gvs.p.redraw();
}


// Function to start temperature updates when "Go" button is clicked
function startTemperatureUpdate(){
  if (!gvs.is_running) {
    gvs.is_running = true;
    go_button.setAttribute("disabled", "yes"); // Disable the "Go" button during the experiment
    startTime = null; // Reset start time
    gvs.temperatureInterval = setInterval(updateTemperature, 50); // Update temperature every 50ms
  }
}


// Handle mole quantity slider (n-slider)
n_slider.addEventListener("input", () => {
  const n = Number(n_slider.value);
  if (!gvs.is_finished && !gvs.is_running) {
    gvs.n = n;
    gvs.syringe_fraction = 1 - n / 2;
  }
  gvs.syringe_initial = 1 - n / 2; // 2 is the max number of moles you can inject
  n_value.innerHTML = `${n.toFixed(2)}`;
  if (gvs.is_finished) {
    gvs.n = n;
    calcAll();
    gvs.P = gvs.P_final;
    gvs.V = gvs.V_final;
    gvs.L = gvs.L_final;
    gvs.vapor_density = gvs.final_vapor_density;
    gvs.liquid_level = gvs.final_liquid_level;
  }
  gvs.p.redraw();
});

// Chemical selection event listener
select_chemical.addEventListener("change", () => {
  const chemical = select_chemical.value;
  gvs.chemical = chemical;
  reset_injection();
  gvs.p.redraw();
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
  if (!gvs.is_running && !gvs.is_finished) {
    startTime = Date.now(); // Set the start time
    gvs.is_running = true;
    console.log(gvs.T);
    calcAll();
    startTemperatureUpdate();
    gvs.p.loop();
    go_button.setAttribute("disabled", "yes");
    select_chemical.setAttribute("disabled", "yes");
  }
}

function reset_injection() {
  gvs.is_running = false;
  gvs.is_finished = false;
  gvs.liquid_level = 0;
  gvs.vapor_density = 0;
  gvs.P = 0;
  gvs.V = 0;
  gvs.L = 0;
  gvs.T = 5;
  gvs.L_final = 0;
  gvs.V_final = 0;
  gvs.P_final = 0;
  gvs.syringe_fraction = gvs.syringe_initial;
  gvs.percent_injected = 0;
  select_chemical.removeAttribute("disabled");
  go_button.removeAttribute("disabled");
  window.clearInterval(gvs.reset_interval);
  reset_button.style.transition = "";
  reset_button.classList.remove("bright");
  gvs.p.redraw();
}
