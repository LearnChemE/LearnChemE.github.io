const volumeASlider = document.getElementById("ml-of-a-slider");
const volumeAValue = document.getElementById("ml-of-a-value");
const collectSampleButton = document.getElementById("collection-button");
const proceedToSubmitButton = document.getElementById("proceed-to-submit-button");
const submitButton = document.getElementById("submit-button");
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

function go_to_submission_stage() {
  gvs.submission_stage = 2;
  proceedToSubmitButton.style.opacity = "0";
  proceedToSubmitButton.style.pointerEvents = "none";
  collectSampleButton.style.opacity = "0";
  collectSampleButton.style.pointerEvents = "none";
  inputA12.style.display = "grid";
  inputA12CI.style.display = "grid";
  inputA21.style.display = "grid";
  inputA21CI.style.display = "grid";
  submitButton.style.display = "grid";
  gvs.p.redraw();
}

function submit() {
  gvs.submission_stage = 3;
  inputA12.style.display = "none";
  inputA12CI.style.display = "none";
  inputA21.style.display = "none";
  inputA21CI.style.display = "none";
  submitButton.style.display = "none";
  gvs.p.redraw();
}