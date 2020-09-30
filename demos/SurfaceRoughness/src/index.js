require("./style/style.scss");

window.jQuery = require("jquery");
window.$ = window.jQuery;
require("./js/jquery.flot.js");
require("./js/initializePlot.js");
const { dragCoeff, dragCoeffs } = require("./js/dragCoeffs.js");
require("./js/calcs.js");
require("./js/loop.js");

const select = document.getElementById("select-ball");
for ( let i = 0; i < Object.keys(dragCoeffs).length; i++ ) {
  const option = document.createElement("option");
  option.innerText = Object.keys(dragCoeffs)[i];
  option.value = String(i);
  select.appendChild(option);
}

select.addEventListener("change", e => {
  const i = Number(select.value);
  window.ballObj.roughness = window.ballObj.roughnesses[i];
})