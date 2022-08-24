const inner_diameter_elt = document.getElementById("venturi-inner");
const inner_diameter_value = document.getElementById("venturi-inner-value");

inner_diameter_elt.addEventListener("input", () => {
  const dia = Number(inner_diameter_elt.value);
  g.venturi_inner = dia;
  inner_diameter_value.innerHTML = `${dia.toFixed(0)}`;
  g.p.redraw();
})