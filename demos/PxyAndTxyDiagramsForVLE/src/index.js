require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:
/*
- When the tie lines are hidden and you switch graphs, make sure to update the opacity to show the correct ones

*/
// GLOBAL VARIABLES OBJECT
window.gvs = {
    z : 0.45, // overall mole fraction
    P : 1.50, // pressure (for the T-x-y diagram) (bar)
    T : 115, // temperature (for the P-x-y diagram) (deg. C)
    q : 0.5131228699981252, // quality (mole fraction liquid)
    bubble_point_temperature_array : [],
    dew_point_temperature_array: [],
    plot : "P-x-y"
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/calcs.js");
        gvs.calc_Tsat();
        const { SVG_Graph } = require("./js/svg-graph-library.js");
        gvs.SVG_Graph = SVG_Graph;
        require("./js/graphs.js");
        require("./js/inputs.js");
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);