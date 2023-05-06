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
  if(!gvs.show_solution) {
    gvs.show_solution = true;
    if(gvs.step < 7) { nextStepSolutionButton.innerHTML = "next step" }
  } else if(gvs.step < 7) {
    nextStepSolutionButton.innerHTML = "show solution";
    gvs.show_solution = false;
    gvs.step++;
  }
});

newProblemButton.addEventListener("click", () => {
  gvs.step = 1;
  nextStepSolutionButton.innerHTML = "show solution";
  gvs.show_solution = false;
});