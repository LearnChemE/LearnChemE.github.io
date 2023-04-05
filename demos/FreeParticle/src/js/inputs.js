const startStopButton = document.getElementById("start-stop");
const resetTButton = document.getElementById("reset-t");
const measurePButton = document.getElementById("measure-p");
const resetDefaultsButton = document.getElementById("reset-defaults");
const massSlider = document.getElementById("mass-slider");
const massValue = document.getElementById("mass-value");

const buttons = [
  startStopButton,
  resetTButton,
  measurePButton,
  resetDefaultsButton
];

buttons.forEach(button => {
  button.addEventListener("mousedown", () => {
    button.classList.add("mousedown");
  });
  button.addEventListener("mouseup", () => {
    button.classList.remove("mousedown");
  });
});

massSlider.addEventListener("input", () => {
  const mass = Number(massSlider.value);
  massValue.innerHTML = `${mass.toFixed(2)}x`;
});

massSlider.addEventListener("change", () => {
  const mass = Number(massSlider.value);
  gvs.mass = mass;
});

startStopButton.addEventListener("click", () => {
  gvs.playing = !gvs.playing;
  if(gvs.playing) {
    gvs.p.loop();
  } else {
    gvs.p.noLoop();
  }
});

resetTButton.addEventListener("click", () => {
  gvs.playing = false;
  gvs.t = 0;
  gvs.p.noLoop();
  gvs.p.redraw();
});

resetDefaultsButton.addEventListener("click", () => {
  location.reload();
});

measurePButton.addEventListener("click", () => {
  const coefficients_list = Object.keys(gvs.coefficients);
  let coefficient_total = 0;
  let coefficient_weight = 0;
  let weights_array = [];
  for(let i = 0; i < coefficients_list.length; i++) {
    const coefficient_number = coefficients_list[i];
    const coefficient = gvs.coefficients[`${coefficient_number}`];
    const ck = coefficient.ck;
    coefficient_total += ck;
  }
  for(let i = 0; i < coefficients_list.length; i++) {
    const coefficient_number = coefficients_list[i];
    const coefficient = gvs.coefficients[`${coefficient_number}`];
    const k = coefficient.k;
    const ck = coefficient.ck / coefficient_total;
    if(ck > 0) {
      weights_array.push([coefficient_number, coefficient_weight]);
    }
    coefficient_weight = coefficient_weight + ck;
  }
  weights_array.push([coefficients_list[coefficients_list.length - 1], 1]);
  const random_weight = Math.random();
  let chosen_number;
  for(let i = 0; i < weights_array.length - 1; i++) {
    const current_weight = weights_array[i][1];
    const next_weight = weights_array[i + 1][1];
    if(random_weight > current_weight && random_weight < next_weight) {
      chosen_number = weights_array[i][0]
    }
  }
  for(let i = 0; i < coefficients_list.length; i++) {
    const coefficient_number = coefficients_list[i];
    if(coefficient_number !== chosen_number) {
      gvs.coefficients[coefficient_number].ck = 0;
      document.getElementById(`ck-${coefficient_number}-input`).value = "0";
    }
  }
  document.getElementById(`ck-${chosen_number}-input`).value = "1";
  gvs.playing = false;
  gvs.t = 0;
  gvs.p.noLoop();
  gvs.p.redraw();
})