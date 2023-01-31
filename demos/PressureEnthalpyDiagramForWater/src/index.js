require("bootstrap");
require("./style/style.scss");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {

};

const { SVG_Graph } = require("./js/svg-graph-library.js");
gvs.SVG_Graph = SVG_Graph;
require("./js/calcs.js");
require("./js/inputs.js");