/*****************************************************/
/**************** Import HTML, CSS *******************/
/*****************************************************/
const style = require("./style/style.scss");

const mainDiv = document.getElementsByTagName("main")[0];

const SVG = require("./js/svg/SVG");
const Line = require("./js/svg/Line");
const G = require("./js/svg/G");
const Path = require("./js/svg/Path");

const svg = new SVG({id: "test"});
const path = new Path({
  parent: svg,
  commands: [["M", 20, 20], ["a", 4, 4, 0, 0, 1, 0, -6]]
});

/*****************************************************/
/************* Initialize Animation Loop *************/
/*****************************************************/

const Loop = require("./js/loop.js");
const LoopConfiguration = {
  fps: 5,
  runAfterInitialization: false,
}
window.MainLoop = new Loop(LoopConfiguration);
