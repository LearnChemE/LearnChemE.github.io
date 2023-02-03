require("bootstrap");
require("./style/style.scss");
window.p5 = require("./js/p5.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    plot : {
        margins : [[100, 0], [50, 0]], // [[left, right], [top, bottom]]
        height : 400,
        width : 650,
        axes_range : [[0, 3500], [0.05, 10000]], // [[xMin, xMax], [yMin, yMax]]
    },
    coords : {},
    show_quality : false,
    show_temperature : false,
    show_density : false,
    show_entropy : false,
    show_critical : false,
    show_grid : true,
    color : true,
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/coords.js");
        require("./js/calcs.js");
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