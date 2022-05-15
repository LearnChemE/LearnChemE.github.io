// connects html to Javascript and assigns them to a const variable
const angle_slider_element = document.getElementById("angle-slider");
const angle_value_label = document.getElementById("angle-slider-value");
const water_height_element = document.getElementById("water-height");
const water_height_value_label = document.getElementById("water-height-value");
const gate_weight_element = document.getElementById("gate-weight");
const gate_weight_value_label = document.getElementById("gate-weight-value");
const select_element = document.getElementById("unit-selection");
const select_label = document.getElementById("unit-selection-value");

// Code I added, trying to link the button units to unit selection.
const select_water_units = document.getElementById('unit-selection-height');
const gate_weight_units = document.getElementById("gate-weight-units");
const water_height_units = document.getElementById("water-height-units");

// angle slider Code 
angle_slider_element.addEventListener("input", function () {
  const angle = Number(angle_slider_element.value);
  angle_value_label.innerHTML = `${angle.toFixed(0)}°`;
  g.gate_angle = angle;
});


// Water_height slider Code
water_height_element.addEventListener("input", function () {
  const height = Number(water_height_element.value);
  let imperial_height;
  if(g.select_value == "imperial") { imperial_height = 3.28084 * height }
  water_height_value_label.innerHTML = `${g.select_value == "SI" ? height.toFixed(2) : imperial_height.toFixed(1)}`;
  g.water_level = height;
});



// gate_weight
gate_weight_element.addEventListener("input", function () {
  const gate_weight = Number(gate_weight_element.value);
  let imperial_gate_weight;
  if(g.select_value == "imperial") { imperial_gate_weight = 224.80894387096 * gate_weight }
  gate_weight_value_label.innerHTML = `${g.select_value == "SI" ? gate_weight.toFixed(1) : imperial_gate_weight.toFixed(0)}`;
  g.gate_weight = gate_weight;
});

select_element.addEventListener("change", function () {
  const select_value = select_element.value;
  g.select_value = select_value;
  const current_value_weight = Number(gate_weight_element.value);
  const current_value_water_height = Number(water_height_element.value);
  let new_value_weight, new_value_water_height;

  if(select_value === "imperial") {
    new_value_weight = current_value_weight * 224.80894387096;
    new_value_water_height = current_value_water_height * 3.28084;
    gate_weight_units.innerHTML = "lbs";
    water_height_units.innerHTML = "ft";
    document.getElementsByClassName("input-row")[1].style.gridTemplateColumns = "120px 150px 2.3ch 2.8ch";
    document.getElementsByClassName("input-row")[2].style.gridTemplateColumns = "120px 150px 4.7ch 2.8ch";
    gate_weight_value_label.innerHTML = `${new_value_weight.toFixed(0)}`;
    water_height_value_label.innerHTML = `${new_value_water_height.toFixed(1)}`;
  } else {
    new_value_weight = current_value_weight;
    new_value_water_height = current_value_water_height;
    gate_weight_units.innerHTML = "kN";
    water_height_units.innerHTML = "m";
    document.getElementsByClassName("input-row")[1].style.gridTemplateColumns = "120px 150px 3ch 3.5ch";
    document.getElementsByClassName("input-row")[2].style.gridTemplateColumns = "120px 150px 3ch 3.5ch";
    gate_weight_value_label.innerHTML = `${current_value_weight.toFixed(1)}`;
    water_height_value_label.innerHTML = `${current_value_water_height.toFixed(2)}`;
  }
})