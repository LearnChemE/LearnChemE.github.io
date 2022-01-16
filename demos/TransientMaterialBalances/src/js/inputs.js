const V0_slider = document.getElementById("V0-slider");
const V0_value = document.getElementById("V0-value");
const F0_slider = document.getElementById("F0-slider");
const F0_value = document.getElementById("F0-value");
const x0_slider = document.getElementById("x0-slider");
const x0_value = document.getElementById("x0-value");
const start_simulation_button = document.getElementById("start-button");
const reset_simulation_button = document.getElementById("reset-button");

gvs.handle_V0 = function() {
  const V0 = Number(V0_slider.value);
  gvs.V0 = V0;
  V0_value.innerHTML = `${V0.toFixed(2)}`;
}

gvs.handle_F0 = function() {
  const F0 = Number(F0_slider.value);
  gvs.F0 = F0;
  F0_value.innerHTML = `${F0.toFixed(2)}`;
}

gvs.handle_x0 = function() {
  const x0 = Number(x0_slider.value);
  gvs.x0 = x0;
  x0_value.innerHTML = `${x0.toFixed(2)}`;
}

V0_slider.addEventListener("input", () => {
  gvs.handle_V0();
});

F0_slider.addEventListener("input", () => {
  gvs.handle_F0();
});

x0_slider.addEventListener("input", () => {
  gvs.handle_x0();
});

start_simulation_button.addEventListener("click", () => {
  gvs.is_running = true;
  gvs.start_simulation();
});

reset_simulation_button.addEventListener("click", () => {
  gvs.is_running = false;
  gvs.reset_simulation();
});