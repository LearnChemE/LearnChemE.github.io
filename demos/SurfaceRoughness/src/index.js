require("./style/style.scss");

window.jQuery = require("jquery");
window.$ = window.jQuery;
require("./js/jquery.flot.js");
require("./js/dragCoeffs.js");
require("./js/initializePlot.js");
require("./js/calcs.js");
require("./js/loop.js");

const select = document.getElementById("select-ball");
for ( let i = 0; i < Object.keys(window.dragCoeffs).length; i++ ) {
  const option = document.createElement("option");
  option.innerText = Object.keys(window.dragCoeffs)[i];
  option.value = String(i);
  select.appendChild(option);
}

select.addEventListener("change", e => {
  const i = Number(select.value);
  window.ballObj.roughness = window.ballObj.roughnesses[i];
});

const launchAngle = document.getElementById("launch-angle");
const launchAngleValue = document.getElementById("launch-angle-value");

launchAngle.addEventListener("input", () => {
  window.ballObj.theta = Number(launchAngle.value);
  const degrees = Number(180 * window.ballObj.theta / Math.PI).toFixed(0);
  launchAngleValue.innerHTML = `${degrees}&deg;`;
})
