const startResetButton = document.getElementById("start-reset");
const showSolutionNextButton = document.getElementById("show-solution-next");
const inputName = document.getElementById("input-name");
const inputQ1A1 = document.getElementById("input-q1-1");
const inputQ1A2 = document.getElementById("input-q1-2");
const inputQ2A1 = document.getElementById("input-q2-1");
const inputQ2A2 = document.getElementById("input-q2-2");
const inputQ3A1 = document.getElementById("input-q3-1");
const inputQ3A2 = document.getElementById("input-q3-2");
const inputQ3A3 = document.getElementById("input-q3-3");

inputName.addEventListener("input", () => {
  const input = inputName.value;
  gvs.name = input;
});

startResetButton.addEventListener("click", () => {
  const enabled = startResetButton.getAttribute("disabled") === "yes" ? false : true;
  gvs.solution_shown = false;
  if(enabled) {
    if(gvs.step === 0) {
      gvs.step = 1;
      generateAnswers();
      randomizeInputs();
      startResetButton.innerHTML = `<i class="fa-solid fa-backward-fast"></i><div>reset quiz</div>`;
      inputName.classList.add("hidden");
      inputQ1A1.classList.remove("hidden");
      inputQ1A2.classList.remove("hidden");
    } else {
      gvs.step = 0;
      startResetButton.innerHTML = `<i class="fa-solid fa-play"></i><div>start</div>`;
      showSolutionNextButton.innerHTML = `<i class="fa-solid fa-forward"></i><div>show solution</div>`;
      showSolutionNextButton.setAttribute("disabled", "yes");
      inputName.classList.remove("hidden");
      const inputs = [inputQ1A1, inputQ1A2, inputQ2A1, inputQ2A2, inputQ3A1, inputQ3A2, inputQ3A3];
      inputs.forEach(input => {
        input.classList.add("hidden");
        input.value = "";
      });
      gvs.guesses = [null, null, null, null, null, null, null];
    }
  }
  gvs.p.redraw();
});

showSolutionNextButton.addEventListener("click", () => {
  const enabled = showSolutionNextButton.getAttribute("disabled") === "yes" ? false : true;
  const solutionShown = gvs.solution_shown;
  const inputs = [inputQ1A1, inputQ1A2, inputQ2A1, inputQ2A2, inputQ3A1, inputQ3A2, inputQ3A3];
  inputs.forEach(input => {
    input.classList.add("hidden");
  });

  if(enabled) {
    if(gvs.step === 1) {
      if(solutionShown) {
        gvs.solution_shown = false;
        gvs.step++;
        inputs[2].classList.remove("hidden");
        inputs[3].classList.remove("hidden");
        showSolutionNextButton.innerHTML = `<i class="fa-solid fa-forward"></i><div>show solution</div>`;
        showSolutionNextButton.setAttribute("disabled", "yes");
      } else {
        gvs.solution_shown = true;
        showSolutionNextButton.innerHTML = `<i class="fa-solid fa-forward"></i><div>next question</div>`;
      }
    } else if(gvs.step === 2) {
      if(solutionShown) {
        gvs.solution_shown = false;
        gvs.step++;
        inputs[4].classList.remove("hidden");
        inputs[5].classList.remove("hidden");
        inputs[6].classList.remove("hidden");
        showSolutionNextButton.innerHTML = `<i class="fa-solid fa-forward"></i><div>show solution</div>`;
        showSolutionNextButton.setAttribute("disabled", "yes");
      } else {
        gvs.solution_shown = true;
        showSolutionNextButton.innerHTML = `<i class="fa-solid fa-forward"></i><div>next question</div>`;
      }
    } else if(gvs.step === 3) {
      if(solutionShown) {
        gvs.solution_shown = false;
        gvs.step++;
        showSolutionNextButton.innerHTML = `<i class="fa-solid fa-forward"></i><div>show solution</div>`;
        showSolutionNextButton.setAttribute("disabled", "yes");
      } else {
        gvs.solution_shown = true;
        showSolutionNextButton.innerHTML = `<i class="fa-solid fa-forward"></i><div>display results</div>`;
      }
    }
  }
  gvs.p.redraw();
})

inputQ1A1.addEventListener("input", () => {
  const value1 = inputQ1A1.value;
  const value2 = inputQ1A2.value;
  if(value1 !== "" && value2 !== "") {
    showSolutionNextButton.removeAttribute("disabled");
    gvs.guesses[0] = value1;
    gvs.guesses[1] = value2;
  } else {
    showSolutionNextButton.setAttribute("disabled", "yes");
  }
});

inputQ1A2.addEventListener("input", () => {
  const value1 = inputQ1A1.value;
  const value2 = inputQ1A2.value;
  if(value1 !== "" && value2 !== "") {
    showSolutionNextButton.removeAttribute("disabled");
    gvs.guesses[0] = value1;
    gvs.guesses[1] = value2;
  } else {
    showSolutionNextButton.setAttribute("disabled", "yes");
  }
});

inputQ2A1.addEventListener("input", () => {
  const value1 = inputQ2A1.value;
  const value2 = inputQ2A2.value;
  if(value1 !== "" && value2 !== "") {
    showSolutionNextButton.removeAttribute("disabled");
    gvs.guesses[2] = value1;
    gvs.guesses[3] = value2;
  } else {
    showSolutionNextButton.setAttribute("disabled", "yes");
  }
});

inputQ2A2.addEventListener("input", () => {
  const value1 = inputQ2A1.value;
  const value2 = inputQ2A2.value;
  if(value1 !== "" && value2 !== "") {
    showSolutionNextButton.removeAttribute("disabled");
    gvs.guesses[2] = value1;
    gvs.guesses[3] = value2;
  } else {
    showSolutionNextButton.setAttribute("disabled", "yes");
  }
});

inputQ3A1.addEventListener("input", () => {
  const value1 = inputQ3A1.value;
  const value2 = inputQ3A2.value;
  const value3 = inputQ3A3.value;
  if(value1 !== "" && value2 !== "" && value3 !== "") {
    showSolutionNextButton.removeAttribute("disabled");
    gvs.guesses[4] = value1;
    gvs.guesses[5] = value2;
    gvs.guesses[6] = value3;
  } else {
    showSolutionNextButton.setAttribute("disabled", "yes");
  }
});

inputQ3A2.addEventListener("input", () => {
  const value1 = inputQ3A1.value;
  const value2 = inputQ3A2.value;
  const value3 = inputQ3A3.value;
  if(value1 !== "" && value2 !== "" && value3 !== "") {
    showSolutionNextButton.removeAttribute("disabled");
    gvs.guesses[4] = value1;
    gvs.guesses[5] = value2;
    gvs.guesses[6] = value3;
  } else {
    showSolutionNextButton.setAttribute("disabled", "yes");
  }
});

inputQ3A3.addEventListener("input", () => {
  const value1 = inputQ3A1.value;
  const value2 = inputQ3A2.value;
  const value3 = inputQ3A3.value;
  if(value1 !== "" && value2 !== "" && value3 !== "") {
    showSolutionNextButton.removeAttribute("disabled");
    gvs.guesses[4] = value1;
    gvs.guesses[5] = value2;
    gvs.guesses[6] = value3;
  } else {
    showSolutionNextButton.setAttribute("disabled", "yes");
  }
});

function generateAnswers() {

  // Generate random values for question 1
  gvs.Q1zF = Number((0.25 + Math.random() * 0.5).toFixed(2));
  gvs.Q1F = Number((1 + 4 * Math.random()).toFixed(2));
  gvs.Q1D = Number((0.3 * gvs.Q1F + 0.4 * Math.random() * gvs.Q1F).toFixed(2));
  gvs.Q1B = Math.round((gvs.Q1F - gvs.Q1D) * 100) / 100;
  let volatile_in_feed = gvs.Q1zF * gvs.Q1F;
  gvs.Q1xD = Number((0.8 + 0.19 * Math.random()).toFixed(2));
  if(gvs.Q1xD * gvs.Q1D > 0.9 * volatile_in_feed) {
    gvs.Q1xD = Number((0.9 * volatile_in_feed / gvs.Q1D).toFixed(2));
  }
  gvs.Q1xB = Math.round(((volatile_in_feed - gvs.Q1xD * gvs.Q1D) / gvs.Q1B) * 100) / 100;

  // Generate random values for question 2
  gvs.Q2F1 = Number((1 + 4 * Math.random()).toFixed(2));
  gvs.Q2F2 = Number((1 + 4 * Math.random()).toFixed(2));
  gvs.Q2zF1 = Number((0.2 + 0.25 * Math.random()).toFixed(2));
  gvs.Q2zF2 = Number((0.55 + 0.25 * Math.random()).toFixed(2));
  gvs.Q2D = Number((0.3 * (gvs.Q2F1 + gvs.Q2F2) + 0.4 * Math.random() * (gvs.Q2F1 + gvs.Q2F2)).toFixed(2));
  gvs.Q2B = Math.round((gvs.Q2F1 + gvs.Q2F2 - gvs.Q2D) * 100) / 100;
  volatile_in_feed = gvs.Q2F1 * gvs.Q2zF1 + gvs.Q2F2 * gvs.Q2zF2;
  gvs.Q2xD = Number((0.8 + 0.19 * Math.random()).toFixed(2));
  if(gvs.Q2xD * gvs.Q2D > 0.9 * volatile_in_feed) {
    gvs.Q2xD = Number((0.9 * volatile_in_feed / gvs.Q2D).toFixed(2));
  }
  gvs.Q2xB = Math.round(((volatile_in_feed - gvs.Q2xD * gvs.Q2D) / gvs.Q2B) * 100) / 100;

  // Generate random values for question 3
  let A = Math.random();
  let B = Math.random();
  let C = Math.random();
  let total = A + B + C;
  gvs.Q3zF1 = Math.round(100 * A / total) / 100;
  gvs.Q3zF2 = Math.round(100 * B / total) / 100;
  gvs.Q3F = Number((1 + 4 * Math.random()).toFixed(2));
  gvs.Q3D = Number((0.3 * gvs.Q3F + 0.4 * Math.random() * gvs.Q3F).toFixed(2));
  gvs.Q3B = Math.round((gvs.Q3F - gvs.Q3D) * 100) / 100;
  const volatile_in_feed_1 = gvs.Q3zF1 * gvs.Q3F;
  const volatile_in_feed_2 = gvs.Q3zF2 * gvs.Q3F;
  A *= 1.5 + Math.random();
  B *= 1 + Math.random();
  total = A + B + C;
  gvs.Q3xD1 = Math.round(100 * A / total) / 100;
  gvs.Q3xD2 = Math.round(100 * B / total) / 100;
  gvs.Q3xB1 = Math.round(((volatile_in_feed_1 - gvs.Q3xD1 * gvs.Q3D) / gvs.Q3B) * 100) / 100;
  gvs.Q3xB2 = Math.round(((volatile_in_feed_2 - gvs.Q3xD2 * gvs.Q3D) / gvs.Q3B) * 100) / 100;
}

function randomizeInputs() {
  gvs.Q1_input1 = Math.ceil(3 * Math.random());
  gvs.Q1_input2 = Math.ceil(3 * Math.random());
  gvs.Q2_input1 = Math.ceil(4 * Math.random());
  gvs.Q2_input2 = Math.ceil(4 * Math.random());
  gvs.Q3_input1 = Math.ceil(3 * Math.random());
  gvs.Q3_input2 = Math.ceil(3 * Math.random());
  gvs.Q3_input3 = Math.ceil(3 * Math.random());
  
  switch(gvs.Q1_input1) {
    case 1: 
      gvs.answers[0] = gvs.Q1zF;
      inputQ1A1.style.left = "220px";
      inputQ1A1.style.top = "253px";
    break;
    case 2:
      gvs.answers[0] = gvs.Q1xD;
      inputQ1A1.style.left = "527px";
      inputQ1A1.style.top = "109px";
    break;
    case 3:
      gvs.answers[0] = gvs.Q1xB;
      inputQ1A1.style.left = "527px";
      inputQ1A1.style.top = "409px";
    break;
  }
  
  switch(gvs.Q1_input2) {
    case 1:
      gvs.answers[1] = gvs.Q1F;
      inputQ1A2.style.left = "165px";
      inputQ1A2.style.top = "289px";
    break;
    case 2:
      gvs.answers[1] = gvs.Q1D;
      inputQ1A2.style.left = "475px";
      inputQ1A2.style.top = "144px";
    break;
    case 3:
      gvs.answers[1] = gvs.Q1B;
      inputQ1A2.style.left = "475px";
      inputQ1A2.style.top = "444px";
    break;
  }
  
  switch(gvs.Q2_input1) {
    case 1: 
      gvs.answers[2] = gvs.Q2zF1;
      inputQ2A1.style.left = "230px";
      inputQ2A1.style.top = "184px";
    break;
    case 2:
      gvs.answers[2] = gvs.Q2zF2;
      inputQ2A1.style.left = "230px";
      inputQ2A1.style.top = "322px";
    break;
    case 3:
      gvs.answers[2] = gvs.Q2xD;
      inputQ2A1.style.left = "527px";
      inputQ2A1.style.top = "109px";
    break;
    case 4:
      gvs.answers[2] = gvs.Q2xB;
      inputQ2A1.style.left = "527px";
      inputQ2A1.style.top = "409px";
    break;
  }
  
  switch(gvs.Q2_input2) {
    case 1:
      gvs.answers[3] = gvs.Q2F1;
      inputQ2A2.style.left = "165px";
      inputQ2A2.style.top = "218px";
    break;
    case 2:
      gvs.answers[3] = gvs.Q2F2;
      inputQ2A2.style.left = "165px";
      inputQ2A2.style.top = "358px";
    break;
    case 3:
      gvs.answers[3] = gvs.Q2D;
      inputQ2A2.style.left = "475px";
      inputQ2A2.style.top = "143px";
    break;
    case 4:
      gvs.answers[3] = gvs.Q2B;
      inputQ2A2.style.left = "475px";
      inputQ2A2.style.top = "443px";
    break;
  }

  switch(gvs.Q3_input1) {
    case 1:
      gvs.answers[4] = gvs.Q3zF1;
      inputQ3A1.style.left = "228px";
      inputQ3A1.style.top = "253px";
    break;
    case 2:
      gvs.answers[4] = gvs.Q3xD1;
      inputQ3A1.style.left = "537px";
      inputQ3A1.style.top = "108px";
    break;
    case 3:
      gvs.answers[4] = gvs.Q3xB1;
      inputQ3A1.style.left = "537px";
      inputQ3A1.style.top = "408px";
    break;
  }
  
  switch(gvs.Q3_input2) {
    case 1: 
      gvs.answers[5] = gvs.Q3zF2;
      inputQ3A2.style.left = "228px";
      inputQ3A2.style.top = "288px";
    break;
    case 2:
      gvs.answers[5] = gvs.Q3xD2;
      inputQ3A2.style.left = "537px";
      inputQ3A2.style.top = "143px";
    break;
    case 3:
      gvs.answers[5] = gvs.Q3xB2;
      inputQ3A2.style.left = "537px";
      inputQ3A2.style.top = "443px";
    break;
  }
  
  switch(gvs.Q3_input3) {
    case 1:
      gvs.answers[6] = gvs.Q3F;
      inputQ3A3.style.left = "166px";
      inputQ3A3.style.top = "323px";
    break;
    case 2:
      gvs.answers[6] = gvs.Q3D;
      inputQ3A3.style.left = "476px";
      inputQ3A3.style.top = "178px";
    break;
    case 3:
      gvs.answers[6] = gvs.Q3B;
      inputQ3A3.style.left = "476px";
      inputQ3A3.style.top = "478px";
    break;
  }
}