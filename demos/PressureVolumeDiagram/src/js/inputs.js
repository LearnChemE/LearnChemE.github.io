const show_constant_enthalpy = document.getElementById("show-enthalpy");
const show_constant_entropy = document.getElementById("show-entropy");
const show_constant_temperature = document.getElementById("show-temperature");
const show_constant_quality = document.getElementById("show-quality");

show_constant_enthalpy.addEventListener("input", () => {
  const is_checked = show_constant_enthalpy.checked;
  gvs.show_constant_enthalpy = is_checked;
  gvs.p.redraw();
});

show_constant_entropy.addEventListener("input", () => {
  const is_checked = show_constant_entropy.checked;
  gvs.show_constant_entropy = is_checked;
  gvs.p.redraw();
});

show_constant_temperature.addEventListener("input", () => {
  const is_checked = show_constant_temperature.checked;
  gvs.show_constant_temperature = is_checked;
  gvs.p.redraw();
});

show_constant_quality.addEventListener("input", () => {
  const is_checked = show_constant_quality.checked;
  gvs.show_constant_quality = is_checked;
  gvs.p.redraw();
});