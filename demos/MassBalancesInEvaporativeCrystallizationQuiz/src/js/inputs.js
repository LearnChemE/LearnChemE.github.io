// const unknown_list_1 = ["mfeed", "m2", "m4", "m5", "zfeed", "zwater"];
// const unknown_list_2 = ["mfeed", "m2", "m4", "m5", "x5", "xw5"];

gvs.mfeed_input = document.getElementById("mfeed-input");
gvs.m2_input = document.getElementById("m2-input");
gvs.m4_input = document.getElementById("m4-input");
gvs.m5_input = document.getElementById("m5-input");
gvs.zfeed_input = document.getElementById("zfeed-input");
gvs.zwater_input = document.getElementById("zwater-input");
gvs.x5_input = document.getElementById("x5-input");
gvs.xw5_input = document.getElementById("xw5-input");
const show_answer_button = document.getElementById("show-answer-button");
const reset_button = document.getElementById("reset-button");

const inputs = [
  gvs.mfeed_input,
  gvs.m2_input,
  gvs.m4_input,
  gvs.m5_input,
  gvs.zfeed_input,
  gvs.zwater_input,
  gvs.x5_input,
  gvs.xw5_input
];

inputs.forEach(input => {
  input.value = "";
});

const input_1 = gvs[`${gvs.unknown_1}_input`];
const input_2 = gvs[`${gvs.unknown_2}_input`];

input_1.style.display = "block";
input_2.style.display = "block";

show_answer_button.addEventListener("mousedown", () => {
  show_answer();
  show_answer_button.classList.add("pressed");
});

show_answer_button.addEventListener("mouseup", () => {
  show_answer_button.classList.remove("pressed");
});

reset_button.addEventListener("click", () => {
  location.reload();
});

function show_answer() {
  gvs.display_results = true;
  inputs.forEach(input => {
    input.style.display = "none";
  });
  show_answer_button.setAttribute("disabled", "yes");
  gvs.p.redraw();
}