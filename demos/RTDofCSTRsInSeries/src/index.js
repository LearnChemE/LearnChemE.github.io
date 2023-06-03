require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    n : 1,
    tau : 6000,
    plot : {
        margins: [[100, 50], [80, 80]],
        labels: [["RTD", ""], ["residence time distribution", "time (min)"]],
        domain: [0, 12000, 3000, 600],
        range: [0, 0.001, 0.0002, 0.00005],
    },
    curveCoords : []
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        // const { SVG_Graph } = require("./js/svg-graph-library.js");
        // gvs.SVG_Graph = SVG_Graph;
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