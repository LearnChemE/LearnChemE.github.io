const calcAll = require("./calcs.js");

const T_slider = document.getElementById("T-slider");
const T_value = document.getElementById("T-value");
const n_slider = document.getElementById("n-slider");
const n_value = document.getElementById("n-value");
const select_chemical = document.getElementById("select-chemical");
const go_button = document.getElementById("go-button");
const reset_button = document.getElementById("reset-button");

T_slider.addEventListener("input", () => {
  const T = Number(T_slider.value);
  g.T = T;
  T_value.innerHTML = `${T.toFixed(0)}`;
  if (g.is_finished) {
    calcAll();
    g.P = g.P_final;
    g.V = g.V_final;
    g.L = g.L_final;
    g.vapor_density = g.final_vapor_density;
    g.liquid_level = g.final_liquid_level;
  }
  redraw();
});

n_slider.addEventListener("input", () => {
  const n = Number(n_slider.value);
  const mL = 1000 * g.n / g.rhoLm();
  const max_mL = 30;
  if (!g.is_finished && !g.is_running) {
    g.n = n;
    g.syringe_fraction = 1 - mL / max_mL;
  }
  g.syringe_initial = 1 - mL / max_mL;
  n_value.innerHTML = `${round(n * 1000)}`;
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

select_chemical.addEventListener("change", () => {
  const chemical = select_chemical.value;
  g.chemical = chemical;
  const mL = 1000 * g.n / g.rhoLm();
  const max_mL = 30;
  g.syringe_initial = 1 - mL / max_mL;
  let T_min, T_max, T_default, P_max;
  switch (chemical) {
    case "a":
      T_min = 10;
      T_max = 80;
      T_default = 40;
      P_max = 1;
      break;
    case "b":
      T_min = 20;
      T_max = 90;
      T_default = 50;
      P_max = 2;
      break;
    case "c":
      T_min = 0;
      T_max = 120;
      T_default = 60;
      P_max = 2;
      break;
    case "d":
      T_min = 5;
      T_max = 100;
      T_default = 50;
      P_max = 1;
      break;
    case "e":
      T_min = 10;
      T_max = 80;
      T_default = 40;
      P_max = 1;
      break;
    default:
      T_min = 10;
      T_max = 80;
      T_default = 40;
      P_max = 1;
      break;
  }
  T_slider.setAttribute("min", T_min);
  T_slider.setAttribute("max", T_max);
  T_slider.value = T_default;
  T_value.innerHTML = T_default;
  g.P_range[1] = P_max;
  g.T = T_default;
  reset_injection();
  redraw();
});

go_button.addEventListener("mousedown", () => {
  begin_injection();
  go_button.style.background = "rgb(153, 198, 153)";
  window.setTimeout(() => {
    go_button.style.background = null;
  }, 50);
});

reset_button.addEventListener("mousedown", () => {
  reset_injection();
  reset_button.style.background = "rgb(255, 150, 150)";
  window.setTimeout(() => {
    reset_button.style.background = null;
  }, 50);
})

function begin_injection() {
  if (!g.is_running && !g.is_finished) {
    g.is_running = true;
    calcAll();
    loop();
    n_slider.setAttribute("disabled", "yes");
    T_slider.setAttribute("disabled", "yes");
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
  g.L_final = 0;
  g.V_final = 0;
  g.P_final = 0;
  g.syringe_fraction = g.syringe_initial;
  g.percent_injected = 0;
  n_slider.removeAttribute("disabled");
  T_slider.removeAttribute("disabled");
  select_chemical.removeAttribute("disabled");
  go_button.removeAttribute("disabled");
  window.clearInterval(g.reset_interval);
  reset_button.style.transition = "";
  reset_button.classList.remove("bright");
  redraw();
}