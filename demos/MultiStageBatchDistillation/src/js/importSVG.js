const svgText = require("../media/column-dist.svg");
const svgContainer = document.getElementById("svg-container");

function importSVG() {
  svgContainer.innerHTML = svgText;
};

module.exports = { importSVG }