const calcAll = require("./calcs.js");

const t_slider = document.getElementById("t-slider");
const t_value = document.getElementById("t-value");
const v_slider = document.getElementById("v-slider");
const v_value = document.getElementById("v-value");
const select_chemical = document.getElementById("select-chemical");
const add_button = document.getElementById("add-button");
const start_button = document.getElementById("start-button");
const reset_button = document.getElementById("reset-button");
const gauge_hover = document.getElementById("gauge-hover");

t_slider.addEventListener("input", () => {
  const T = Number(t_slider.value);
  g.T = T;
  t_value.innerHTML = `${T.toFixed(0)}`;
  if (g.is_finished) {
    calcAll();
    g.P = g.P_final;
    g.V = g.V_final;
    g.L = g.L_final;
  }
  redraw();
});

v_slider.addEventListener("input", () => {
  const V = Number(v_slider.value);
  g.v_to_inject = V;
  v_value.innerHTML = `${(round(100 * V) / 100).toFixed(2)}`;
  redraw();
});

select_chemical.addEventListener("change", () => {
  const chemical = select_chemical.value;
  g.chemical = chemical;
  const mL = 0.5;
  const max_V = g.max_injectable_volume;
  g.n_max = 0;
  v_slider.value = mL;
  v_value.innerHTML = mL.toFixed(2);
  g.syringe_initial = 1 - mL / max_V;
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
  t_slider.setAttribute("min", T_min);
  t_slider.setAttribute("max", T_max);
  t_slider.value = T_default;
  t_value.innerHTML = T_default;
  g.P_range[1] = P_max;
  g.T = T_default;
  reset_injection();
  redraw();
});

start_button.addEventListener("mousedown", () => {
  begin_injection();
  start_button.style.background = "rgb(153, 198, 153)";
  add_button.setAttribute("disabled", "yes");
  window.setTimeout(() => {
    start_button.style.background = null;
  }, 50);
});

reset_button.addEventListener("mousedown", () => {
  reset_injection();
  reset_button.style.background = "rgb(255, 150, 150)";
  window.setTimeout(() => {
    reset_button.style.background = null;
  }, 50);
})

add_button.addEventListener("mousedown", () => {
  const v = Number(v_slider.value);
  const n = v / g.rhoLm();
  g.n_max = g.n + n;
  g.syringe_initial = 1 - v / g.max_injectable_volume;
  g.syringe_fraction = 1 - v / g.max_injectable_volume;
  g.is_finished = false;
  g.percent_injected = 0;
  start_button.removeAttribute("disabled");
  add_button.style.background = "rgb(153, 153, 198)";
  window.setTimeout(() => {
    add_button.style.background = null;
  }, 50);
  redraw();
});

function begin_injection() {
  g.is_running = true;
  g.is_finished = false;
  g.is_equilibrating = true;
  calcAll();
  loop();
  v_slider.setAttribute("disabled", "yes");
  t_slider.setAttribute("disabled", "yes");
  start_button.setAttribute("disabled", "yes");
  select_chemical.setAttribute("disabled", "yes");
  reset_button.setAttribute("disabled", "yes");
}

function reset_injection() {
  g.is_running = false;
  g.is_finished = false;
  g.P = 0;
  g.V = 0;
  g.L = 0;
  g.L_final = 0;
  g.V_final = 0;
  g.P_final = 0;
  g.syringe_fraction = 1;
  g.percent_injected = 0;
  g.n = 0;
  g.n_max = 0;
  v_slider.removeAttribute("disabled");
  t_slider.removeAttribute("disabled");
  select_chemical.removeAttribute("disabled");
  start_button.setAttribute("disabled", "yes");
  window.clearInterval(g.reset_interval);
  reset_button.style.transition = "";
  reset_button.classList.remove("bright");
  redraw();
}

gauge_hover.addEventListener("mouseover", () => {
  g.is_enlarged = true;
  loop();
});

gauge_hover.addEventListener("mouseout", () => {
  g.is_enlarged = false;
  if (!g.is_equilibrating) {
    noLoop();
  }
  redraw();
});