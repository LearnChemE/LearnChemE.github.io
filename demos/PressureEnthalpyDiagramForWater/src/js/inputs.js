const quality_checkbox = document.getElementById("show-quality");
const temperature_checkbox = document.getElementById("show-temperature");
const density_checkbox = document.getElementById("show-density");
const entropy_checkbox = document.getElementById("show-entropy");
const critical_checkbox = document.getElementById("show-critical");
const gridlines_checkbox = document.getElementById("show-gridlines");
const show_color = document.getElementById("display-color");
const show_black_white = document.getElementById("display-black-white");

quality_checkbox.addEventListener("input", () => {
  if(quality_checkbox.checked) {
    gvs.show_quality = true
  } else {
    gvs.show_quality = false
  }
  gvs.p.redraw();
});

temperature_checkbox.addEventListener("input", () => {
  if(temperature_checkbox.checked) {
    gvs.show_temperature = true
  } else {
    gvs.show_temperature = false
  }
  gvs.p.redraw();
});

density_checkbox.addEventListener("input", () => {
  if(density_checkbox.checked) {
    gvs.show_density = true
  } else {
    gvs.show_density = false
  }
  gvs.p.redraw();
});

entropy_checkbox.addEventListener("input", () => {
  if(entropy_checkbox.checked) {
    gvs.show_entropy = true
  } else {
    gvs.show_entropy = false
  }
  gvs.p.redraw();
});

critical_checkbox.addEventListener("input", () => {
  if(critical_checkbox.checked) {
    gvs.show_critical = true
  } else {
    gvs.show_critical = false
  }
  gvs.p.redraw();
});

gridlines_checkbox.addEventListener("input", () => {
  if(gridlines_checkbox.checked) {
    gvs.show_grid = true
  } else {
    gvs.show_grid = false
  }
  gvs.p.redraw();
});

show_color.addEventListener("click", () => {
  gvs.color = true;
  show_color.style.background = "rgb(175, 219, 233)";
  show_black_white.style.background = "rgb(240, 240, 240)";
  gvs.p.redraw();
});

show_black_white.addEventListener("click", () => {
  gvs.color = false;
  show_color.style.background = "rgb(240, 240, 240)";
  show_black_white.style.background = "rgb(175, 219, 233)";
  gvs.p.redraw();
});