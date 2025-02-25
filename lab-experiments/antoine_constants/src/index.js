import "bootstrap";
import "p5";
import "./style/style.scss";
import "./assets/antoine_constants_worksheet.pdf";

// TO DO:

// GLOBAL VARIABLES OBJECTåç
window.g = {
  liquid_level: 0, // 0-1 value of how high liquid is in tank
  final_liquid_level: 0, // The final liquid level, between 0 and 0.3 depending on value of V_final
  max_liquid_level: 0.3, // The highest that the liquid can go in the tank (30% full)
  background_color: [252, 252, 252], // RGB color
  liquid_color: [150, 150, 255], // RGB color
  vapor_density: 0, // 0-1 value of how dark the vapor color is
  final_vapor_density: 0, // final value for how dense the vapor will be after injecting
  P: 0, // Current pressure, bar
  V: 0, // moles of vapor in tank at any given point during the animation
  L: 0, // moles of liquid in tank at any given point during the animation
  L_final: 0, // the solution to moles of liquid in the tank
  V_final: 0, // the solution to moles of vapor in the tank
  P_final: 0, // the final pressure in the tank
  P_range: [0, 1], // The range of pressure on the pressure gauge
  T: 35, // Temperature (deg. C)
  n: 0, // moles in the tank
  n_max: 0, // max moles in the tank
  v_to_inject: 0.5, // volume to inject in mL
  tank_volume: 4, // volume of the tank in L
  max_injectable_volume: 1, // max volume that can be injected in mL
  chemical: "a", // chemical to inject
  syringe_initial: 1, // The initial value for how far the syringe is pushed in. Dictated by moles to inject (n)
  syringe_fraction: 1, // How far pushed in the syringe is, 0-1
  is_running: false, // Whether the simulation is currently running
  is_finished: false, // Whether the animation has finished running
  is_equilibrating: false, // Whether the system is currently equilibrating
  percent_injected: 0, // Value between 0 and 1, used during the animation phase
  reset_button_bright: false, // Switches every second false and true to make the reset button "glow" after finishing a run
  frame_rate: 60, // Frame rate of the animation
  is_enlarged: false, // Whether the gauge is enlarged
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  g.drawAll = require("./js/draw.js");
  require("./js/inputs.js");
  pixelDensity(4);
  frameRate(g.frame_rate);
  document.getElementById("v-slider").value = g.v_to_inject;
  document.getElementById("t-slider").value = g.T;
};

window.draw = function() {
  window.width = 800;
  window.height = 530;
  window.graphics_left = width / 1.9;
  window.graphics_top = height / 2.25
  scale(relativeSize());
  scale(1.2);
  background.apply(this, g.background_color);
  g.drawAll();
  handleInject();
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 800;

function handleInject() {
  const seconds_to_inject = 2.5;
  const seconds_to_equilibrate = 10;
  const frameRate = g.frame_rate;
  const frames_per_second = frameRate;
  const frames_inject = frames_per_second * seconds_to_inject;
  const frames_equilibrate = frames_per_second * seconds_to_equilibrate;
  const dt_inject = 1 / frames_inject;
  const dInj = (1 - g.syringe_initial) / frames_inject;
  const dL = g.L_final / frames_equilibrate;
  const dV = g.V_final / frames_equilibrate;
  const dP = g.P_final / frames_equilibrate;
  if (!g.is_finished && g.is_running) {
    g.syringe_fraction = min(1, g.syringe_fraction + dInj);
    g.percent_injected = min(1, g.percent_injected + dt_inject);
    g.P = min(g.P_final, g.P + dP);
    g.L = min(g.L_final, g.L + dL);
    g.V = min(g.V_final, g.V + dV);
    if (g.L >= g.L_final && g.syringe_fraction === 1) {
      g.is_finished = true;
      g.is_running = false;
      g.is_equilibrating = false;
      const mL_in_tank = round(g.n_max * g.rhoLm());
      if (mL_in_tank < 1000) {
        document.getElementById("add-button").removeAttribute("disabled");
        document.getElementById("reset-button").removeAttribute("disabled");
        document.getElementById("v-slider").removeAttribute("disabled");
      }
    }
    if (g.percent_injected >= 1) {
      g.percent_injected = 1;
      g.syringe_fraction = 1;
    }
  }
}