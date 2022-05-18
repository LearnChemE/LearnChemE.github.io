// connects html to Javascript and assigns them to a const variable
const angle_slider_element = document.getElementById("angle-slider");
const angle_value_label = document.getElementById("angle-slider-value");
const water_height_element = document.getElementById("water-height");
const water_height_value_label = document.getElementById("water-height-value");
const gate_weight_element = document.getElementById("gate-weight");
const gate_weight_value_label = document.getElementById("gate-weight-value");
const select_element = document.getElementById("unit-selection");
const select_label = document.getElementById("unit-selection-value");
const show_distances = document.getElementById("show-distances");

// Code I added, trying to link the button units to unit selection.
const select_water_units = document.getElementById('unit-selection-height');
const gate_weight_units = document.getElementById("gate-weight-units");
const water_height_units = document.getElementById("water-height-units");

// angle slider Code 
angle_slider_element.addEventListener("input", function () {
  const angle = Number(angle_slider_element.value);
  angle_value_label.innerHTML = `${angle.toFixed(0)}°`;
  g.gate_angle = angle;
  calculate();
  redraw();
});


// Water_height slider Code
water_height_element.addEventListener("input", function () {
  const height = Number(water_height_element.value);
  let imperial_height;
  if(g.select_value == "imperial") { imperial_height = 3.28084 * height }
  water_height_value_label.innerHTML = `${g.select_value == "SI" ? height.toFixed(2) : imperial_height.toFixed(1)}`;
  g.water_level = height;
  calculate();
  redraw();
});


// gate_weight
gate_weight_element.addEventListener("input", function () {
  const gate_weight = Number(gate_weight_element.value);
  let imperial_gate_weight;
  if(g.select_value == "imperial") { imperial_gate_weight = 0.22480894387096 * gate_weight }
  gate_weight_value_label.innerHTML = `${g.select_value == "SI" ? gate_weight.toFixed(1) : imperial_gate_weight.toFixed(1)}`;
  g.gate_weight = gate_weight;
  calculate();
  redraw();
});

select_element.addEventListener("change", function () {
  const select_value = select_element.value;
  g.select_value = select_value;
  const current_value_weight = Number(gate_weight_element.value);
  const current_value_water_height = Number(water_height_element.value);
  let new_value_weight, new_value_water_height;

  if(select_value === "imperial") {
    imperial_weight = current_value_weight * 0.22480894387096;
    imperial_water_height = current_value_water_height * 3.28084;
    gate_weight_units.innerHTML = "klb<sub>f</sub>";
    water_height_units.innerHTML = "ft";
    // document.getElementsByClassName("input-row")[1].style.gridTemplateColumns = "120px 150px 2.3ch 2.8ch";
    // document.getElementsByClassName("input-row")[2].style.gridTemplateColumns = "120px 150px 4.7ch 2.8ch";
    gate_weight_value_label.innerHTML = `${imperial_weight.toFixed(1)}`;
    water_height_value_label.innerHTML = `${imperial_water_height.toFixed(1)}`;
  } else {
    SI_weight = current_value_weight;
    SI_water_height = current_value_water_height;
    gate_weight_units.innerHTML = "kN";
    water_height_units.innerHTML = "m";
    // document.getElementsByClassName("input-row")[1].style.gridTemplateColumns = "120px 150px 3ch 3.5ch";
    // document.getElementsByClassName("input-row")[2].style.gridTemplateColumns = "120px 150px 3ch 3.5ch";
    gate_weight_value_label.innerHTML = `${SI_weight.toFixed(1)}`;
    water_height_value_label.innerHTML = `${SI_water_height.toFixed(2)}`;
  }
  calculate();
  redraw();
});

show_distances.addEventListener("change", () => {
  const show = show_distances.checked;
  if(show) {
    g.draw_distances = true;
  } else {
    g.draw_distances = false;
  }
  redraw();
})