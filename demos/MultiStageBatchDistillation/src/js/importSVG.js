const svgText = require("../media/column-dist.svg");
const svgContainer = document.getElementById("svg-container");
const flaskText = require("../media/flask-dist.svg");
const flasksContainer = document.getElementById("flasks-container");
const app = document.getElementById("app");

for( let i = 0; i < 9; i++ ) {
  const flaskDiv = document.createElement("div");
  flaskDiv.innerHTML = flaskText;
  flaskDiv.classList.add("flask-div");
  flaskDiv.id = `flask-div-${i + 1}`;
  if( i === 0 ) { app.appendChild(flaskDiv) } else { flasksContainer.appendChild(flaskDiv) }
  const flaskSVG = flaskDiv.firstChild;
  flaskSVG.id = `flask-svg-${i + 1}`;
  const flaskLabelDiv = document.createElement("div");
  flaskLabelDiv.classList.add("flask-label");
  flaskLabelDiv.innerHTML = `flask #${i + 1}<br>x<sub>B</sub> = 0.00`;
  flaskDiv.appendChild(flaskLabelDiv);
};

function importSVG() {
  svgContainer.innerHTML = svgText;
};

function addStill() {
  const still = {
    xB: Number(document.getElementById("xBinit-slider").value),
    V: 10,
    maxVolume: 10,
    Tstill: 150 + 273.15,
    Tcond: 250 + 273.15,
    liquidElts: [
      document.getElementById("still-liquid"),
      document.getElementById("still-liquid-ellipse"),
    ],
    temperatureElts: [
      document.getElementById("still-temperature"),
      document.getElementById("condenser-temperature"),
    ],
    updateImage: function() {
      const adjLvl =  (this.V - 0.1 * this.maxVolume) / (0.9 * this.maxVolume);
      if ( adjLvl < 0 ) { throw "liquid level in still less than 10%" }
      const liquidTop = 217.94961;
      const liquidMaxHeight = 28.84352;
      const liquidPath = `m 93.247999,${liquidTop + (1 - adjLvl) * liquidMaxHeight} v ${adjLvl * liquidMaxHeight} c -0.26353,4.91962 -1.86939,7.08134 -6.04743,7.47887 H 73.02836 58.856157 c -4.473673,-0.39762 -5.988585,-3.13313 -6.047154,-7.47887 v ${-1 * adjLvl * liquidMaxHeight} z`;
      this.liquidElts[0].setAttribute("d", liquidPath);
      this.liquidElts[1].setAttribute("cy", `${liquidTop + (1 - adjLvl) * liquidMaxHeight}`);
      const TB = Math.round(this.Tstill - 273.15);
      const TC = Math.round(this.Tcond - 273.15);
      this.temperatureElts[0].innerHTML = `${Number(TB).toFixed(0)}° C`;
      this.temperatureElts[1].innerHTML = `${Number(TC).toFixed(0)}° C`;
    }
  };

  window.gvs.still = still;
}

module.exports = { importSVG, addStill }
