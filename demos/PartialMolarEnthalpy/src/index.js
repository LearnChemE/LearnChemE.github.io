require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    xA : null, // overall mole fraction A
    alpha : null, // non-ideal parameter
    hA : 50, // pure-component specific enthalpy of component A
    hB : 70, // pure-component specific enthalpy of component B
    pause : false, // a variable used for updating the plot label typesetting
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(650, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        let first_resize = true;

        p.windowResized = function() {
            const p5elt = document.getElementsByTagName("canvas")[0];
            const p5rect = p5elt.getBoundingClientRect();
            const graphElt = document.getElementById("plot-container");
            graphElt.style.left = `${p5rect.left + 0.5 * p5rect.width}px`;
            graphElt.style.top = `${p5rect.top + 0.5 * p5rect.height - 20}px` ;
            graphElt.style.width = `500px`;
            graphElt.style.height = `470px`;
            if(!first_resize) {
                // Grab the coordinates of the plot axes, and put the plot label in the correct location
                const plotRect = document.getElementById("svg-plot").getElementsByTagName("svg")[0].getElementsByClassName("svg-axes")[0].getBoundingClientRect();
                const title_elt = document.getElementById("above-plot-label");
                title_elt.style.left = `${plotRect.left + plotRect.width / 2}px`;
                title_elt.style.top = `${plotRect.top - 25}px`;
                const plot_text = document.getElementsByClassName("text-over-plot");
                const plot_label = document.getElementById("above-plot-label");
                for(let i = 0; i < plot_text.length; i++) {
                    plot_text[i].style.opacity = "1"
                }
                plot_label.style.opacity = "1";
            } else {
                first_resize = false;
            }
        }

        p.windowResized();

        const { SVG_Graph } = require("./js/svg-graph-library.js");
        gvs.SVG_Graph = SVG_Graph;
        require("./js/graph.js");
        gvs.updatePlot();
        p.windowResized();
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);