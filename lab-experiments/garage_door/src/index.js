const line = require("./media/blank.svg");

const mainDiv = document.getElementsByTagName("main")[0];

const ladderDiv = document.getElementById("ladder");

ladderDiv.innerHTML = line;

const Loop = require("./js/loop.js");
const LoopConfiguration = {
  fps: 5,
  runAfterInitialization: false,
}
window.MainLoop = new Loop(LoopConfiguration);
