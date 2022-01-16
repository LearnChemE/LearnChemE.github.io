const V0_slider = document.getElementById("V0-slider");
const V0_value = document.getElementById("V0-value");
const v0_slider = document.getElementById("v0-slider");
const v0_value = document.getElementById("v0-value");
const CA0_slider = document.getElementById("CA0-slider");
const CA0_value = document.getElementById("CA0-value");
const speed_slider = document.getElementById("speed-slider");
const speed_value = document.getElementById("speed-value");
const start_simulation_button = document.getElementById("start-button");
const reset_simulation_button = document.getElementById("reset-button");

gvs.handle_V0 = function() {
  const V0 = Number(V0_slider.value);
  gvs.V0 = V0;
  V0_value.innerHTML = `${(V0).toFixed(0)}`;
}

gvs.handle_v0 = function() {
  const v0 = Number(v0_slider.value);
  gvs.v0 = v0;
  v0_value.innerHTML = `${(v0).toFixed(0)}`;
}

gvs.handle_CA0 = function() {
  const CA0 = Number(CA0_slider.value);
  gvs.CA0 = CA0;
  CA0_value.innerHTML = `${CA0.toFixed(1)}`;
}

gvs.handle_speed = function() {
  const speed = Number(speed_slider.value);
  gvs.speed = speed;
  speed_value.innerHTML = `${speed.toFixed(1)}`;
}

V0_slider.addEventListener("input", () => {
  gvs.handle_V0();
});

v0_slider.addEventListener("input", () => {
  gvs.handle_v0();
});

CA0_slider.addEventListener("input", () => {
  gvs.handle_CA0();
});

speed_slider.addEventListener("input", () => {
  gvs.handle_speed();
})

start_simulation_button.addEventListener("click", () => {
  gvs.is_running = true;
  gvs.start_simulation();
});

reset_simulation_button.addEventListener("click", () => {
  gvs.is_running = false;
  gvs.reset_simulation();
});

gvs.start_simulation = function() {
  gvs.start_frame = gvs.p.frameCount;
  V0_slider.setAttribute("disabled", "yes");
  v0_slider.setAttribute("disabled", "yes");
  CA0_slider.setAttribute("disabled", "yes");
  start_simulation_button.setAttribute("disabled", "yes");
}

gvs.reset_simulation = function() {
  V0_slider.removeAttribute("disabled");
  v0_slider.removeAttribute("disabled");
  CA0_slider.removeAttribute("disabled");
  start_simulation_button.removeAttribute("disabled");
}