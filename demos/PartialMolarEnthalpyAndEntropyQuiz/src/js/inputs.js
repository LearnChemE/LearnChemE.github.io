const newProblemButton = document.getElementById("new-problem-button");
const nextStepSolutionButton = document.getElementById("next-step-solution-button");

newProblemButton.addEventListener("mousedown", () => {
  newProblemButton.classList.add("mousedown");
});

newProblemButton.addEventListener("mouseup", () => {
  newProblemButton.classList.remove("mousedown");
});

nextStepSolutionButton.addEventListener("mousedown", () => {
  nextStepSolutionButton.classList.add("mousedown");
});

nextStepSolutionButton.addEventListener("mouseup", () => {
  nextStepSolutionButton.classList.remove("mousedown");
});

nextStepSolutionButton.addEventListener("click", () => {
  const max_step = gvs.HS === "enthalpy" ? 7 : 5;
  if(!gvs.show_solution) {
    gvs.show_solution = true;
    if(gvs.step < max_step) { 
      nextStepSolutionButton.innerHTML = "next step";
      nextStepSolutionButton.classList.add("blue");
    }
  } else if(gvs.step < max_step) {
    nextStepSolutionButton.innerHTML = "show solution";
    nextStepSolutionButton.classList.remove("blue");
    gvs.show_solution = false;
    gvs.step++;
  }
  if(gvs.HS === "enthalpy" && gvs.step === 5) {
    document.getElementById("input-H-5").style.display = "grid";
    if(gvs.show_solution) {
      document.getElementById("input-H-5").setAttribute("disabled", "yes");
    }
  } else {
    document.getElementById("input-H-5").style.display = "none";
    document.getElementById("input-H-5").removeAttribute("disabled");
  }
  if(gvs.HS === "enthalpy" && gvs.step === 6) {
    document.getElementById("input-H-6").style.display = "grid";
    if(gvs.show_solution) {
      document.getElementById("input-H-6").setAttribute("disabled", "yes");
    }
  } else {
    document.getElementById("input-H-6").style.display = "none";
    document.getElementById("input-H-6").removeAttribute("disabled");
  }
  if(gvs.HS === "entropy" && gvs.step === 4) {
    document.getElementById("input-S-4").style.display = "grid";
    if(gvs.show_solution) {
      document.getElementById("input-S-4").setAttribute("disabled", "yes");
    }
  } else {
    document.getElementById("input-S-4").style.display = "none";
    document.getElementById("input-S-4").removeAttribute("disabled");
  }
});

newProblemButton.addEventListener("click", () => {
  gvs.step = 1;
  nextStepSolutionButton.innerHTML = "show solution";
  nextStepSolutionButton.classList.remove("blue");
  gvs.show_solution = false;
  gvs.generate_random_conditions();
  document.getElementById("input-H-5").style.display = "none";
  document.getElementById("input-H-5").removeAttribute("disabled");
  document.getElementById("input-H-6").style.display = "none";
  document.getElementById("input-H-6").removeAttribute("disabled");
  document.getElementById("input-S-4").style.display = "none";
  document.getElementById("input-S-4").removeAttribute("disabled");
});