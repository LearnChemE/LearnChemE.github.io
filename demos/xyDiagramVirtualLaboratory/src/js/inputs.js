const volumeASlider = document.getElementById("ml-of-a-slider");
const volumeAValue = document.getElementById("ml-of-a-value");
const collectSampleButton = document.getElementById("collection-button");
const proceedToSubmitButton = document.getElementById("proceed-to-submit-button");
const submitButton = document.getElementById("submit-button");
const backButton = document.getElementById("back-button");
const resetButton = document.getElementById("reset-button");
const downloadButton = document.getElementById("download-data-button");
const inputA12 = document.getElementById("submit-A12");
const inputA12CI = document.getElementById("submit-A12-CI");
const inputA21 = document.getElementById("submit-A21");
const inputA21CI = document.getElementById("submit-A21-CI");
const inputNames = document.getElementById("submit-name");
const testTube = document.getElementById("path844");
const pouringLiquid = document.getElementById("test-tube-pour");
const liquidInTestTube = document.getElementById("test-tube-liquid");
const VLE_apparatus_svg = document.getElementById("VLE_apparatus_svg");
const temperature_svg = document.getElementById("tspan850");
const resetExerciseButton = document.getElementById("reset-exercise-button");
const p5_container = document.getElementById("p5-container");
const resetPermanently = document.getElementById("reset-permanently");

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

downloadButton.addEventListener("mousedown", () => {
  downloadButton.classList.add("pressed");
  download_data();
});

downloadButton.addEventListener("mouseup", () => {
  downloadButton.classList.remove("pressed");
});

resetExerciseButton.addEventListener("mousedown", () => {
  resetExerciseButton.classList.add("pressed");
});

resetExerciseButton.addEventListener("mouseup", () => {
  resetExerciseButton.classList.remove("pressed");
});

resetPermanently.addEventListener("click", () => {
  localStorage.clear();
  location.reload();
})

p5_container.appendChild(resetExerciseButton);

volumeASlider.addEventListener("input", () => {
  const sliderValue = Number(volumeASlider.value);
  gvs.volume_A = sliderValue;
  volumeAValue.innerHTML = `${sliderValue.toFixed(0)}`;
  const mol_A = gvs.volume_A * gvs.molar_density_A;
  const mol_B = (100 - gvs.volume_A) * gvs.molar_density_B;
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
  const volume_A_remaining = Math.round((gvs.volume_A_remaining - gvs.volume_A) * 100) / 100;
  const volume_B_remaining = Math.round((gvs.volume_B_remaining - (100 - gvs.volume_A)) * 100) / 100;

  if(volume_A_remaining < 0 || volume_B_remaining < 0) {
    gvs.not_enough_liquid = true;
    collectSampleButton.setAttribute("disabled", "yes");
  } else {
    collectSampleButton.removeAttribute("disabled");
    gvs.not_enough_liquid = false;
  }
  gvs.temperature_flask = Math.round(T_sat * 10) / 10;
  temperature_svg.innerHTML = `${gvs.temperature_flask.toFixed(1)}°C`;
  gvs.p.redraw();
});

function collectSample() {
  gvs.yA_sample = NaN;
  gvs.p.redraw();
  collectSampleButton.setAttribute("disabled", "yes");
  const volume_A_remaining = Math.round((gvs.volume_A_remaining - gvs.volume_A) * 100) / 100;
  const volume_B_remaining = Math.round((gvs.volume_B_remaining - (100 - gvs.volume_A)) * 100) / 100;
  localStorage.setItem("volume_A_remaining", `${volume_A_remaining}`);
  localStorage.setItem("volume_B_remaining", `${volume_B_remaining}`);
  if(volume_A_remaining < 0 || volume_B_remaining < 0) {
    gvs.not_enough_liquid = true;
  } else {
    gvs.not_enough_liquid = false;
    gvs.volume_A_remaining = volume_A_remaining;
    gvs.volume_B_remaining = volume_B_remaining;
    gvs.yA_sample = Math.min(1, Math.max(0, -0.03 + 0.06 * Math.random() + gvs.yA(gvs.xA_flask)));
    if(gvs.xA_flask == 0) {
      gvs.yA_sample = 0;
    }
    if(gvs.xA_flask == 1) {
      gvs.yA_sample = 1;
    }
    testTube.style.opacity = "1";
    pouringLiquid.style.opacity = "1";
    liquidInTestTube.style.opacity = "1";
    let i = 0;
    const fillTestTubeInterval = setInterval(() => {
      if(i < 1) {
        const v = 5 * i;
        const m = 169 - v;
        const d = `m 142,${m} h 4.6 v ${0.25 + v} c 0,2.3 -2.3,2.3 -2.3,2.3 0,0 -2.3,0 -2.3,-2.3 z`;
        liquidInTestTube.setAttribute("d", d);
        i += 0.01;
      } else {
        clearInterval(fillTestTubeInterval);
        pouringLiquid.style.opacity = "0";
        setTimeout(() => {
          gvs.p.redraw();
        }, 1000);
        setTimeout(() => {
          testTube.style.opacity = "0";
          liquidInTestTube.style.opacity = "0";
          collectSampleButton.removeAttribute("disabled");
        }, 2000);
      }
    }, 20);
  }
  gvs.measurements.push([
    gvs.volume_A.toFixed(1),
    (Math.round((100 - gvs.volume_A) * 100) / 100).toFixed(0),
    (Math.round(gvs.yA_sample * 1000) / 1000).toFixed(3),
    (Math.round(gvs.temperature_flask * 10) / 10).toFixed(1)
  ]);

  localStorage.setItem("measurements", JSON.stringify(gvs.measurements));
}

inputA12.addEventListener("input", () => {
  const A = inputA12.value;
  const B = inputA12CI.value;
  const C = inputA21.value;
  const D = inputA21CI.value;
  const E = inputNames.value;
  if(A !== "" && B !== "" && C !== "" & D !== "" && E !== "") {
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
  const E = inputNames.value;
  if(A !== "" && B !== "" && C !== "" & D !== "" && E !== "") {
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
  const E = inputNames.value;
  if(A !== "" && B !== "" && C !== "" & D !== "" && E !== "") {
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
  const E = inputNames.value;
  if(A !== "" && B !== "" && C !== "" & D !== "" && E !== "") {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "yes");
  }
});

inputNames.addEventListener("input", () => {
  gvs.names = inputNames.value;
  const A = inputA12.value;
  const B = inputA12CI.value;
  const C = inputA21.value;
  const D = inputA21CI.value;
  const E = inputNames.value;
  if(A !== "" && B !== "" && C !== "" & D !== "" && E !== "") {
    submitButton.removeAttribute("disabled");
  } else {
    submitButton.setAttribute("disabled", "yes");
  }
});

resetButton.addEventListener("click", () => {
  localStorage.clear();
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
  inputNames.style.display = "grid";
  submitButton.style.display = "grid";
  backButton.style.display = "grid";
  VLE_apparatus_svg.style.display = "none";
  gvs.p.redraw();
}

function submit() {
  gvs.submission_stage = 3;
  inputA12.style.display = "none";
  inputA12CI.style.display = "none";
  inputA21.style.display = "none";
  inputA21CI.style.display = "none";
  inputNames.style.display = "none";
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
  inputNames.style.display = "none";
  submitButton.style.display = "none";
  backButton.style.display = "none";
  VLE_apparatus_svg.style.display = "block";
  proceedToSubmitButton.classList.remove("pressed");
  collectSampleButton.classList.remove("pressed");
  proceedToSubmitButton.style.visibility = "visible";
  collectSampleButton.style.visibility = "visible";
  backButton.classList.remove("pressed");
  gvs.p.redraw();
}

function download_data() {
  let csv = `MW component A (g/mol),MW component B (g/mol),density component A (g/mL),density component B (g/mL)\n${gvs.MW_A},${gvs.MW_B},${gvs.density_A},${gvs.density_B}\n\nAntoine constants for component A:,A,B,C\n,${gvs.component_A_antoine_parameters[0]},${gvs.component_A_antoine_parameters[1]},${gvs.component_A_antoine_parameters[2]}\n\nAntoine constants for component B:,A,B,C\n,${gvs.component_B_antoine_parameters[0]},${gvs.component_B_antoine_parameters[1]},${gvs.component_B_antoine_parameters[2]}\n\nPressure (mmHg):,760\n\nMeasurements:\nVolume A (mL),Volume B (mL),yA,temperature (deg. C)`;

  for(let i = 0; i < gvs.measurements.length; i++) {
    const measurements = gvs.measurements[i];
    const V_A = measurements[0];
    const V_B = measurements[1];
    const yA = measurements[2];
    const T = measurements[3];
    csv += `\n${V_A},${V_B},${yA},${T}`;
  }

  const d = new Date();
  const day = d.getDay();
  const month = d.getMonth();
  const year = d.getFullYear();
  let hour = d.getHours();
  let AMPM = "AM";
  if(hour > 12) {
    hour -= 12;
    AMPM = "PM";
  }
  let minute = d.getMinutes();
  if(minute < 10) {
    minute = `0${minute}`;
  }

  const filename = `measurement_data_${month}-${day}-${year}_${hour}-${minute}-${AMPM}.csv`;

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csv));
  element.setAttribute('download', filename)
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}