require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.g = {

};

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        g.p = p;
        g.drawAll = require("./js/draw.js");
        require("./js/elements.js");       
        p.windowResized = function() {

        }
    };

    p.draw = function() {
        p.background(253);
        g.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);