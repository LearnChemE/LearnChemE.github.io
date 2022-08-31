const fluid_velocity_elt = document.getElementById("fluid-velocity-slider");
const fluid_velocity_value = document.getElementById("fluid-velocity-value");
const inner_diameter_elt = document.getElementById("venturi-inner");
const inner_diameter_value = document.getElementById("venturi-inner-value");

g.venturi_inner = Number(inner_diameter_elt.value);
g.velocity_1 = Number(fluid_velocity_elt.value);

fluid_velocity_elt.addEventListener("input", () => {
  const velocity = Number(fluid_velocity_elt.value);
  g.velocity_1 = velocity;
  fluid_velocity_value.innerHTML = `${velocity.toFixed(0)}`;
  g.p.redraw();
})

inner_diameter_elt.addEventListener("input", () => {
  const dia = Number(inner_diameter_elt.value);
  g.venturi_inner = dia;
  inner_diameter_value.innerHTML = `${dia.toFixed(0)}`;
  g.p.redraw();
})