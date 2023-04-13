const startStopButton = document.getElementById("start-stop");
const resetTButton = document.getElementById("reset-t");
const measurePButton = document.getElementById("measure-p");
const resetDefaultsButton = document.getElementById("reset-defaults");
const massSlider = document.getElementById("mass-slider");
const massValue = document.getElementById("mass-value");
const populateSlider = document.getElementById("populate-slider");
const populateValue = document.getElementById("populate-units");
const populateButton = document.getElementById("populate-button");

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
    const ck2 = coefficient.ck**2;
    coefficient_total += ck2;
  }
  for(let i = 0; i < coefficients_list.length; i++) {
    const coefficient_number = coefficients_list[i];
    const coefficient = gvs.coefficients[`${coefficient_number}`];
    const ck2 = coefficient.ck**2 / coefficient_total;
    if(ck2 > 0) {
      weights_array.push([coefficient_number, coefficient_weight]);
    }
    coefficient_weight = coefficient_weight + ck2;
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
});

populateButton.addEventListener("mousedown", () => {
  populateButton.classList.add("mousedown");
});

populateButton.addEventListener("mouseup", () => {
  populateButton.classList.remove("mousedown");
});

populateSlider.addEventListener("input", () => {
  const populateNumber = Number(populateSlider.value);
  gvs.populate_quantity = populateNumber;
  populateValue.innerHTML = `${Math.round(populateNumber)} rows`;
});

populateButton.addEventListener("click", () => {
  const inputsBox = document.getElementById("inputs-box");
  inputsBox.innerHTML = "";
  gvs.coefficients = {};
  for(let i = 0; i <= gvs.populate_quantity; i++) {
    if(i == gvs.populate_quantity / 2) {i++}
    const k = Math.round(-1 * gvs.populate_quantity / 2 + i);
    const container = document.createElement("div");
    const numberDiv = document.createElement("div");
    const kDiv = document.createElement("input");
    const CkDiv = document.createElement("input");
    container.classList.add("inputs-container");
    numberDiv.classList.add("list-number");
    kDiv.classList.add("k-input");
    CkDiv.classList.add("ck-input");
    kDiv.setAttribute("type", "number");
    CkDiv.setAttribute("type", "number");
    let number;
    if(k < 0) {number = i + 1} else {number = i}
    if(number % 2 === 0) {
      container.classList.add("even");
    }
    numberDiv.innerHTML = `${Math.round(number)}`;
    CkDiv.value = "1";
    kDiv.value = `${k}`;
    container.appendChild(numberDiv);
    container.appendChild(numberDiv);
    container.appendChild(kDiv);
    container.appendChild(CkDiv);
    inputsBox.appendChild(container);
    kDiv.id = `k-${number}-input`;
    CkDiv.id = `ck-${number}-input`;
    gvs.coefficients[`${number}`] = {
      k : k,
      ck : Number(CkDiv.value),
    }
    kDiv.addEventListener("change", () => {
      const k = Math.max(-100, Math.min(100, Math.round(kDiv.value)));
      kDiv.value = `${k}`;
      gvs.coefficients[`${number}`].k = k;
      gvs.re_im_max_value = 1;
      gvs.Psi_max_value = 1;
      gvs.p.redraw();
    });
    CkDiv.addEventListener("change", () => {
      const ck = Math.max(0, Number(CkDiv.value));
      CkDiv.value = `${ck}`;
      gvs.coefficients[`${number}`].ck = ck;
      gvs.re_im_max_value = 1;
      gvs.Psi_max_value = 1;
      gvs.p.redraw();
    });
    gvs.re_im_max_value = 1;
    gvs.Psi_max_value = 1;
  }
  gvs.p.redraw();
});