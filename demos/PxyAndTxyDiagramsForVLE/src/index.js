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
    plot_selection : "P-x-y",
    isDragging : false,
    dotOriginalCoords : [0, 0], // the original coordinates of the black dot when the mouse is clicked over it
    mouseOriginalPixels : [0, 0], // the pixel coordinates of the mouse when it is first clicked
    mouseCurrentPixels : [0, 0], // the real-time pixel coordinates of the mouse while the black dot is being dragged
    q_list : [0.514, 0.514, 0.514, 0.514, 0.514, 0.514], // this is used to average (smooth) out values for gvs.q in order to prevent "jittering" behavior
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 560);
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
            const p5_container = document.getElementById("p5-container");
            const p5_rect = p5_container.getBoundingClientRect();
            const plot_container = document.getElementById("plot-container");
            const p5_plot_margin_top = 58;
            const p5_plot_margin_bottom = 20;
            const p5_plot_margin_left = 15;
            const p5_plot_margin_right = 50;
            plot_container.style.top = `${p5_rect.top + p5_plot_margin_top}px`;
            plot_container.style.left = `${p5_rect.left + p5_plot_margin_left}px`;
            plot_container.style.height = `${gvs.p.height - p5_plot_margin_bottom - p5_plot_margin_top}px`;
            plot_container.style.width = `${2 * gvs.p.width / 3 - p5_plot_margin_right}px`;
            gvs.pxy_plot.redrawAxes();
            gvs.txy_plot.redrawAxes();
        }
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);