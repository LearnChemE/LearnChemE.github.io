const volumeASlider = document.getElementById("ml-of-a-slider");
const volumeAValue = document.getElementById("ml-of-a-value");
const collectSampleButton = document.getElementById("collection-button");
const proceedToSubmitButton = document.getElementById("proceed-to-submit-button");
const submitButton = document.getElementById("submit-button");
const backButton = document.getElementById("back-button");
const resetButton = document.getElementById("reset-button");
const inputA12 = document.getElementById("submit-A12");
const inputA12CI = document.getElementById("submit-A12-CI");
const inputA21 = document.getElementById("submit-A21");
const inputA21CI = document.getElementById("submit-A21-CI");

collectSampleButton.addEventListener("mousedown", () => {
  collectSampleButton.classList.add("pressed");
  collectSample();
});

collectSampleButton.addEventListener("mouseup", () => {
  collectSampleButton.classList.remove("pressed");
});

proceedToSubmitButton.addEventListener("mousedown", () => {
  proceedToSubmitButton.classList.add("pressed");
  go_to_submission_stage();
});

proceedToSubmitButton.addEventListener("mouseup", () => {
  proceedToSubmitButton.classList.remove("pressed");
});

submitButton.addEventListener("mousedown", () => {
  submitButton.classList.add("pressed");
  submit();
});

submitButton.addEventListener("mouseup", () => {
  submitButton.classList.remove("pressed");
});

backButton.addEventListener("mousedown", () => {
  backButton.classList.add("pressed");
  go_back();
});

backButton.addEventListener("mouseup", () => {
  backButton.classList.remove("pressed");
});

volumeASlider.addEventListener("input", () => {
  const sliderValue = Number(volumeASlider.value);
  gvs.volume_A = sliderValue;
  volumeAValue.innerHTML = `${sliderValue.toFixed(1)}`;
  const mol_A = gvs.volume_A * gvs.molar_density_A;
  const mol_B = (10 - gvs.volume_A) * gvs.molar_density_B;
  gvs.xA_flask = mol_A / (mol_A + mol_B);
  const xB = 1 - gvs.xA_flask;
  const P = 760; // atmospheric pressure, mmHg
  let delta = 1e6;
  let T_sat = -273.1;
  for(let T = -273.1; T < 400; T += 0.01) {
      const PsatA = gvs.PsatA(T);
      const PsatB = gvs.PsatB(T);
      const Psat_mixture = gvs.xA_flask * gvs.gamma_A(gvs.xA_flask) * PsatA + xB * gvs.gamma_B(gvs.xA_flask) * PsatB;
      const diff = Math.abs(P - Psat_mixture);
      if(diff < delta) {
          T_sat = Math.round(T * 100) / 100;
          delta = diff;
      }
  }
  gvs.temperature_flask = Math.round(T_sat * 10) / 10;
  gvs.p.redraw();
});

function collectSample() {
  const volume_A_remaining = Math.round((gvs.volume_A_remaining - gvs.volume_A) * 10) / 10;
  const volume_B_remaining = Math.round((gvs.volume_B_remaining - (10 - gvs.volume_A)) * 10) / 10;
  if(volume_A_remaining < 0 || volume_B_remaining < 0) {
    gvs.not_enough_liquid = true;
  } else {
    gvs.not_enough_liquid = false;
    gvs.volume_A_remaining = volume_A_remaining;
    gvs.volume_B_remaining = volume_B_remaining;
    gvs.yA_sample = Math.min(1, (0.95 + 0.1 * Math.random()) * gvs.yA(gvs.xA_flask));
  }
  gvs.p.redraw();
}

inputA12.addEventListener("input", () => {
  const A = inputA12.value;
  const B = inputA12CI.value;
  const C = inputA21.value;
  const D = inputA21CI.value;
  if(A !== "" && B !== "" && C !== "" & D !== "") {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "yes");
  }
});

inputA12CI.addEventListener("input", () => {
  const A = inputA12.value;
  const B = inputA12CI.value;
  const C = inputA21.value;
  const D = inputA21CI.value;
  if(A !== "" && B !== "" && C !== "" & D !== "") {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "yes");
  }
});

inputA21.addEventListener("input", () => {
  const A = inputA12.value;
  const B = inputA12CI.value;
  const C = inputA21.value;
  const D = inputA21CI.value;
  if(A !== "" && B !== "" && C !== "" & D !== "") {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "yes");
  }
});

inputA21CI.addEventListener("input", () => {
  const A = inputA12.value;
  const B = inputA12CI.value;
  const C = inputA21.value;
  const D = inputA21CI.value;
  if(A !== "" && B !== "" && C !== "" & D !== "") {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "yes");
  }
});

resetButton.addEventListener("click", () => {
  location.reload();
});

function go_to_submission_stage() {
  gvs.submission_stage = 2;
  proceedToSubmitButton.style.visibility = "hidden";
  collectSampleButton.style.visibility = "hidden";
  inputA12.style.display = "grid";
  inputA12CI.style.display = "grid";
  inputA21.style.display = "grid";
  inputA21CI.style.display = "grid";
  submitButton.style.display = "grid";
  backButton.style.display = "grid";
  gvs.p.redraw();
}

function submit() {
  gvs.submission_stage = 3;
  inputA12.style.display = "none";
  inputA12CI.style.display = "none";
  inputA21.style.display = "none";
  inputA21CI.style.display = "none";
  submitButton.style.display = "none";
  backButton.style.display = "none";
  resetButton.style.display = "grid";
  const A12 = Number(inputA12.value);
  const A12_CI = Number(inputA12CI.value);
  const A21 = Number(inputA21.value);
  const A21_CI = Number(inputA21CI.value);
  gvs.A12_submission = Math.round(A12 * 100) / 100;
  gvs.A12_CI_submission = Math.round(A12_CI * 100) / 100;
  gvs.A21_submission = Math.round(A21 * 100) / 100;
  gvs.A21_CI_submission = Math.round(A21_CI * 100) / 100;
  gvs.p.redraw();
}

function go_back() {
  gvs.submission_stage = 1;
  inputA12.style.display = "none";
  inputA12CI.style.display = "none";
  inputA21.style.display = "none";
  inputA21CI.style.display = "none";
  submitButton.style.display = "none";
  backButton.style.display = "none";
  proceedToSubmitButton.classList.remove("pressed");
  collectSampleButton.classList.remove("pressed");
  proceedToSubmitButton.style.visibility = "visible";
  collectSampleButton.style.visibility = "visible";
  backButton.classList.remove("pressed");
  gvs.p.redraw();
}