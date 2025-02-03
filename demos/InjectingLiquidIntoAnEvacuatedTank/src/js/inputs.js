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
  gvs.T = T;
  T_value.innerHTML = `${T.toFixed(0)}`;
  if(gvs.is_finished) {
    calcAll();
    gvs.P = gvs.P_final;
    gvs.V = gvs.V_final;
    gvs.L = gvs.L_final;
    gvs.vapor_density = gvs.final_vapor_density;
    gvs.liquid_level = gvs.final_liquid_level;
  }
  gvs.p.redraw();
});

n_slider.addEventListener("input", () => {
  const n = Number(n_slider.value);
  if (!gvs.is_finished && !gvs.is_running) {
    gvs.n = n;
    gvs.syringe_fraction = 1 - n / 2;
  }
  gvs.syringe_initial = 1 - n / 2; // 2 is the max number of moles you can inject
  n_value.innerHTML = `${n.toFixed(2)}`;
  if(gvs.is_finished) {
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

select_chemical.addEventListener("change", () => {
  const chemical = select_chemical.value;
  gvs.chemical = chemical;
  reset_injection();
  gvs.p.redraw();
});

go_button.addEventListener("mousedown", () => {
  begin_injection();
  go_button.style.background = "rgb(183, 228, 183)";
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
  if (!gvs.is_running && !gvs.is_finished) {
    gvs.is_running = true;
    calcAll();
    gvs.p.loop();
    // n_slider.setAttribute("disabled", "yes");
    // T_slider.setAttribute("disabled", "yes");
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
  gvs.L_final = 0;
  gvs.V_final = 0;
  gvs.P_final = 0;
  gvs.syringe_fraction = gvs.syringe_initial;
  gvs.percent_injected = 0;
  // n_slider.removeAttribute("disabled");
  // T_slider.removeAttribute("disabled");
  select_chemical.removeAttribute("disabled");
  go_button.removeAttribute("disabled");
  window.clearInterval(gvs.reset_interval);
  reset_button.style.transition = "";
  reset_button.classList.remove("bright");
  gvs.p.redraw();
}