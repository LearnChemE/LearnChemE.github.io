const question = document.getElementById("question");
const options = document.getElementsByClassName("option");
const next = document.getElementById("next");
window.question_number = 1;

next.addEventListener("mousedown", () => {
  next.style.backgroundColor = `rgb(230, 230, 180)`;
})

next.addEventListener("mouseup", () => {
  window.question_number++;
  next.style.backgroundColor = "";
  switch(window.question_number) {
    case 2: 
    question.innerHTML = `2.) If the volume increases for an ideal gas, what can happen to the pressure?`;
    for(let i = 0; i < 5; i++) {
      const option = options[i];
      switch(i) {
        case 0:
          option.innerHTML = `A. increase`;
        break;

        case 1:
          option.innerHTML = `B. decrease`;
        break;

        case 2:
          option.innerHTML = `C. stay constant`;
        break;

        case 3:
          option.innerHTML = `D. either A or C`;
        break;

        case 4:
          option.innerHTML = `E. A, B, or C`;
        break;
      }
    }
    next.innerHTML = `continue to simulation &longrightarrow;`
    break;

    case 3:
    window.location.href = "https://learncheme.github.io/demos/IdealGasLaw/dist/";
    break;
  }
})