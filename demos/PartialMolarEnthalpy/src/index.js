require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    NI_param : 20, // non-ideal parameter, between -50 and 50
    z : 0.50, // overall mole fraction A
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        
        p.windowResized = function() {
            const p5elt = document.getElementsByTagName("canvas")[0];
            const p5rect = p5elt.getBoundingClientRect();
            const graphElt = document.getElementById("plot-container");
            graphElt.style.left = `${p5rect.left + 0.5 * p5rect.width}px`;
            graphElt.style.top = `${p5rect.top + 0.5 * p5rect.height - 20}px` ;
            graphElt.style.width = `500px`;
            graphElt.style.height = `470px`;
        }

        p.windowResized();

        const { SVG_Graph } = require("./js/svg-graph-library.js");
        gvs.SVG_Graph = SVG_Graph;
        require("./js/graph.js");
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);