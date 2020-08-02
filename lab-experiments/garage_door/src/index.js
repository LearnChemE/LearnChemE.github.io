/*****************************************************/
/**************** Import HTML, CSS *******************/
/*****************************************************/

const style = require("./style/style.scss");
const tippyStyle = require("tippy.js/dist/tippy.css");
const mainDiv = document.getElementsByTagName("main")[0];

const SVG = require("./js/svg/SVG");
const Coil = require("./js/svg/Coil");
const Contact = require("./js/svg/Contact");

window.ladderSVG = new SVG({id: "ladderSVG"});

const coil = new Coil({
  type : "coil",
  parent : ladderSVG,
  translationCoords : [10, 5],
  canBeDragged : false,
})

const nCoil = new Coil({
  type : "negated coil",
  parent : ladderSVG,
  translationCoords : [22, 5],
  canBeDragged : false,
});

const SLatch = new Coil({
  type : "set latch",
  parent : ladderSVG,
  translationCoords : [34, 5],
  canBeDragged : false,
});

const RLatch = new Coil({
  type : "reset latch",
  parent : ladderSVG,
  translationCoords : [46, 5],
  canBeDragged : false,
});

const contact = new Contact({
  type : "NO",
  parent : ladderSVG,
  translationCoords : [58, 5],
  canBeDragged : false,
});

const NCcontact = new Contact({
  type : "NC",
  parent : ladderSVG,
  translationCoords : [70, 5],
  canBeDragged : false,
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
