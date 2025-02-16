import "bootstrap";
import "p5";
import "./style/style.scss";

// TO DO:

// GLOBAL VARIABLES OBJECTåç
window.g = {
  liquid_level: 0, // 0-1 value of how high liquid is in tank
  final_liquid_level: 0, // The final liquid level, between 0 and 0.3 depending on value of V_final
  max_liquid_level: 0.3, // The highest that the liquid can go in the tank (30% full)
  background_color: [253, 253, 253], // RGB color
  liquid_color: [150, 150, 255], // RGB color
  vapor_density: 0, // 0-1 value of how dark the vapor color is
  final_vapor_density: 0, // final value for how dense the vapor will be after injecting
  P: 0, // Current pressure, bar
  V: 0, // moles of vapor in tank at any given point during the animation
  L: 0, // moles of liquid in tank at any given point during the animation
  L_final: 0, // the solution to moles of liquid in the tank
  V_final: 0, // the solution to moles of vapor in the tank
  P_final: 0, // the final pressure in the tank
  T: 35, // Temperature (deg. C)
  n: 1.0, // moles to inject (moles)
  chemical: "propane", // chemical to inject
  syringe_initial: 0.5, // The initial value for how far the syringe is pushed in. Dictated by moles to inject (n)
  syringe_fraction: 0.5, // How far pushed in the syringe is, 0-1
  is_running: false, // Whether the simulation is currently running
  is_finished: false, // Whether the animation has finished running
  percent_injected: 0, // Value between 0 and 1, used during the animation phase
  reset_button_bright: false, // Switches every second false and true to make the reset button "glow" after finishing a run
};

const containerElement = document.getElementById("p5-container");

window.setup = function() {
  createCanvas(containerElement.offsetWidth, containerElement.offsetHeight).parent(containerElement);
  noLoop();
  g.drawAll = require("./js/draw.js");
  require("./js/inputs.js");
};

window.draw = function() {
  window.width = 800;
  window.height = 530;
  scale(relativeSize());
  background.apply(this, g.background_color);
  g.drawAll();
  const seconds_to_inject = 2.5;
  const frameRate = 60;
  const frames_per_second = frameRate;
  const frames = frames_per_second * seconds_to_inject;
  const dt = 1 / frames;
  const dInj = (1 - g.syringe_initial) / frames;
  const dL = g.L_final / frames;
  const dV = g.V_final / frames;
  const dP = g.P_final / frames;
  const dVap = g.final_vapor_density / frames;
  const dLiq = g.final_liquid_level / frames;
  if (g.is_running && !g.is_finished) {
    g.syringe_fraction += dInj;
    g.percent_injected += dt;
    g.P += dP;
    g.L += dL;
    g.V += dV;
    g.liquid_level += dLiq;
    g.vapor_density += dVap;
    if (g.percent_injected >= 1) {
      g.percent_injected = 1;
      g.is_finished = true;
      g.is_running = false;
      g.P = g.P_final;
      g.L = g.L_final;
      g.P = g.P_final;
      g.syringe_fraction = 1;
      const reset_button = document.getElementById("reset-button");
      reset_button.style.transition = "background 2s";
      g.reset_interval = setInterval(() => {
        if (g.reset_button_bright) {
          reset_button.classList.remove("bright");
        } else {
          reset_button.classList.add("bright");
        }
        g.reset_button_bright = !g.reset_button_bright;
      }, 1000);
    }
  }
};

window.windowResized = () => {
  resizeCanvas(containerElement.offsetWidth, containerElement.offsetHeight);
}

window.relativeSize = () => containerElement.offsetWidth / 800;