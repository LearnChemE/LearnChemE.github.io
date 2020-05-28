const svg = require('../media/PID.svg');

function insertSVG() {
  const div = document.createElement("div");
  div.id = "bgdiv";
  div.innerHTML = svg;
  document.body.appendChild(div);
}

module.exports = insertSVG;