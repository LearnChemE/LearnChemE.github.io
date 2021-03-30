const svgText = require("../media/column-dist.svg");
const svgContainer = document.getElementById("svg-container");
const flaskText = require("../media/flask-dist.svg");
const app = document.getElementById("app");

for( let i = 0; i < 9; i++ ) {
  const flaskDiv = document.createElement("div");
  flaskDiv.innerHTML = flaskText;
  flaskDiv.classList.add("flask-div");
  flaskDiv.id = `flask-div-${i}`;
  app.appendChild(flaskDiv);
  const flaskSVG = flaskDiv.firstChild;
  flaskSVG.id = `flask-svg-${i}`;
  if ( i !== 0 ) {
    // flaskDiv.style.display = "none";
  }
  const flaskLabelDiv = document.createElement("div");
  flaskLabelDiv.classList.add("flask-label");
  flaskLabelDiv.innerHTML = `flask #${i + 1}<br>x<sub>B</sub> = 0.00`;
  flaskDiv.appendChild(flaskLabelDiv);
};

function importSVG() {
  svgContainer.innerHTML = svgText;
};

module.exports = { importSVG }