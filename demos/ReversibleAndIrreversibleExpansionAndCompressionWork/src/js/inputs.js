const select_compression = document.getElementById("select-compression");
const select_expansion = document.getElementById("select-expansion");
const play_button = document.getElementById("play");
const reset_button = document.getElementById("reset");
const p_final_slider = document.getElementById("p-final-slider");
const p_final_value = document.getElementById("p-final-value");
const condition_1 = document.getElementById("condition-1");
const condition_2 = document.getElementById("condition-2");

select_compression.addEventListener("click", () => {
  select_compression.classList.add("selected");
  select_expansion.classList.remove("selected");
  p_final_slider.setAttribute("min", "1.1");
  p_final_slider.setAttribute("max", "2.0");
  if(gvs.work_type !== "compression") {
    p_final_slider.value = "1.50";
  }
  p_final_value.innerHTML = `${Number(p_final_slider.value).toFixed(2)}`;
  gvs.P_final = Number(p_final_slider.value) * 1e6;
  gvs.work_type = "compression";
  gvs.calculateFinalConditions();
  gvs.p.redraw();
});

select_expansion.addEventListener("click", () => {
  select_compression.classList.remove("selected");
  select_expansion.classList.add("selected");
  p_final_slider.setAttribute("min", "0.1");
  p_final_slider.setAttribute("max", "0.9");
  if(gvs.work_type !== "expansion") {
    p_final_slider.value = "0.50";
  }
  p_final_value.innerHTML = `${Number(p_final_slider.value).toFixed(2)}`;
  gvs.P_final = Number(p_final_slider.value) * 1e6;
  gvs.work_type = "expansion";
  gvs.calculateFinalConditions();
  gvs.p.redraw();
});

condition_1.addEventListener("input", () => {
  switch(condition_1.value) {
    case "reversible-adiabatic":
      gvs.condition_1 = "reversible adiabatic";
    break;
    case "reversible-isothermal":
      gvs.condition_1 = "reversible isothermal";
    break;
    case "irreversible-adiabatic":
      gvs.condition_1 = "irreversible adiabatic";
    break;
    case "irreversible-isothermal":
      gvs.condition_1 = "irreversible isothermal";
    break;
  }
  gvs.calculateFinalConditions();
  gvs.p.redraw();
});

condition_2.addEventListener("input", () => {
  switch(condition_2.value) {
    case "reversible-adiabatic":
      gvs.condition_2 = "reversible adiabatic";
    break;
    case "reversible-isothermal":
      gvs.condition_2 = "reversible isothermal";
    break;
    case "irreversible-adiabatic":
      gvs.condition_2 = "irreversible adiabatic";
    break;
    case "irreversible-isothermal":
      gvs.condition_2 = "irreversible isothermal";
    break;
  }
  gvs.calculateFinalConditions();
  gvs.p.redraw();
});

p_final_slider.addEventListener("input", () => {
  const P = Number(p_final_slider.value);
  gvs.P_final = P * 1e6;
  p_final_value.innerHTML = `${P.toFixed(2)}`;
  gvs.calculateFinalConditions();
  gvs.p.redraw();
});

play_button.addEventListener("mousedown", () => {
  play_button.classList.add("clicked");
  play_button.setAttribute("disabled", "yes");
  p_final_slider.setAttribute("disabled", "yes");
  condition_1.setAttribute("disabled", "yes");
  condition_2.setAttribute("disabled", "yes");
  gvs.calculateFinalConditions();
  animate();
});

play_button.addEventListener("mouseup", () => {
  play_button.classList.remove("clicked");
});

reset_button.addEventListener("mousedown", () => {
  reset_button.classList.add("clicked");
  play_button.removeAttribute("disabled");
  gvs.animation_fraction = 0;
  gvs.running = false;
  gvs.p.redraw();
});

reset_button.addEventListener("mouseup", () => {
  reset_button.classList.remove("clicked");
});

function animate() {
  gvs.animation_fraction = 0;
  gvs.running = true;
  gvs.p.loop();
}