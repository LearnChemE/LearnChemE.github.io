const T_slider = document.getElementById("T-slider");
const T_value = document.getElementById("T-value");
const n_slider = document.getElementById("n-slider");
const n_value = document.getElementById("n-value");
const select_chemical = document.getElementById("select-chemical");
const go_button = document.getElementById("go-button");
const reset_button = document.getElementById("reset-button");

T_slider.addEventListener("input", () => {
  const T = Number(T_slider.value);
  gvs.T_initial = T;
  T_value.innerHTML = `${T.toFixed(0)}`;
  gvs.p.redraw();
});

n_slider.addEventListener("input", () => {
  const n = Number(n_slider.value);
  if (!gvs.is_finished && !gvs.is_running) {
    gvs.n = n;
    gvs.syringe_fraction = 1 - n / 2;
  }
  gvs.syringe_initial = n;
  n_value.innerHTML = `${n.toFixed(1)}`;
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
  if (!gvs.is_running) {

  }
}

function reset_injection() {
  gvs.is_running = false;
  gvs.is_finished = false;
}