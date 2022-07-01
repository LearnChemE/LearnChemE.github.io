require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// GLOBAL VARIABLES OBJECT
window.g = {
    waterValue : 2.0,
    weightValue : 2.5,
};

const containerElement = document.getElementById("p5-container");

// P5JS Library. See https://p5js.org
const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(800, 530);
        p.noLoop();
        g.p = p;
        require("./js/elements.js");
        g.drawAll = require("./js/draw.js");
        g.align();
        
        p.windowResized = function() {
            g.align();
        }
    };

    p.draw = function() {
        p.background(253);
        g.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);