require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

window.gvs = {
    step : 0,
    name : "",
    solution_shown : false,
    answers : [null, null, null, null, null, null, null],
    Q1zF : 0.5,
    Q1xD : 1,
    Q1xB : 0,
    Q1F : 1,
    Q1D : 0.5,
    Q1B : 0.5,
    Q2zF1 : 0.5,
    Q2zF2 : 0.5,
    Q2xD : 1,
    Q2xB : 0,
    Q2F1 : 1,
    Q2F2 : 1,
    Q2D : 1,
    Q2B : 1,
    Q3zF1 : 0,
    Q3zF2 : 1,
    Q3xD1 : 0,
    Q3xD2 : 1,
    Q3xB1 : 0,
    Q3xB2 : 1,
    Q3F : 1,
    Q3D : 1,
    Q3B : 0,
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

        }
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);