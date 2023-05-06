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
});

newProblemButton.addEventListener("click", () => {
  gvs.step = 1;
  nextStepSolutionButton.innerHTML = "show solution";
  nextStepSolutionButton.classList.remove("blue");
  gvs.show_solution = false;
  gvs.generate_random_conditions();
});