require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    mfeed : 0,
    zfeed : 0,
    zwater : 0,
    m1 : 0,
    x1 : 0,
    m2 : 0,
    m3 : 0,
    x3 : 0,
    m4 : 0,
    m5 : 0,
    x5 : 0,
    mR : 0,
    xR : 0,
    unknown_1 : "",
    unknown_2 : "",
    display_results : false,
};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 480);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/initialize.js");
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