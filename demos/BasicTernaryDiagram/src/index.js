require("bootstrap");
require("./style/style.scss");
window.p5 = new require("./js/p5.min.js");

// TO DO:

// GLOBAL VARIABLES OBJECT
window.gvs = {
    mousedown : false,
    mouseStart : [0, 0], // When the mouse is pressed, this is used to determine dx and dy
    pointLocation : [], // When the mouse is released, this variable is updated with the new coordinate
    dragCoords : [], // A temporary variable used while the mouse is held down to keep track of point location. Couldn't think of a better variable name
    center : [350, 300], // The center of the triangle
    t : [[], [], []], // triangle coordinates. Used a short variable name to reduce the amount of typing
    tL : 400, // Triangle side length. Used a short variable name to reduce amount of typing
};

gvs.pointLocation = [gvs.center[0], gvs.center[1]];
gvs.dragCoords = [gvs.center[0], gvs.center[1]];

gvs.t[0].push(gvs.center[0] - gvs.tL / 2);
gvs.t[0].push(gvs.center[1] + gvs.tL * Math.sqrt(3) / 6);
gvs.t[1].push(gvs.center[0] + gvs.tL / 2);
gvs.t[1].push(gvs.center[1] + gvs.tL * Math.sqrt(3) / 6);
gvs.t[2].push(gvs.center[0]);
gvs.t[2].push(gvs.center[1] - gvs.tL * Math.sqrt(3) / 3);

const containerElement = document.getElementById("p5-container");

const sketch = (p) => {

    p.setup = function() {
        p.createCanvas(700, 530);
        p.noLoop();
        gvs.p = p;
        gvs.drawAll = require("./js/draw.js");
        require("./js/inputs.js");
        document.getElementById("plot-point").style.left = `${gvs.center[0]}px`;
        document.getElementById("plot-point").style.top = `${gvs.center[1]}px`;
        p.windowResized = function() {
            const plotPointContainer = document.getElementById("plot-point-container");
            const p5canvas = document.getElementsByTagName("canvas")[0];
            const rect = p5canvas.getBoundingClientRect();
            plotPointContainer.style.width = `${rect.width}px`;
            plotPointContainer.style.height = `${rect.height}px`;
            plotPointContainer.style.left = `${rect.left}px`;
            plotPointContainer.style.top = `${rect.top}px`;
            gvs.bottomLeftPoint = document.getElementsByClassName("bottom-left")[0];
            gvs.bottomRightPoint = document.getElementsByClassName("bottom-right")[0];
            gvs.topPoint = document.getElementsByClassName("top")[0];
            gvs.bottomLeftPoint.style.top = `${gvs.t[0][1]}px`;
            gvs.bottomLeftPoint.style.left = `${gvs.t[0][0]}px`;
            gvs.bottomRightPoint.style.top = `${gvs.t[1][1]}px`;
            gvs.bottomRightPoint.style.left = `${gvs.t[1][0]}px`;
            gvs.topPoint.style.top = `${gvs.t[2][1]}px`;
            gvs.topPoint.style.left = `${gvs.t[2][0]}px`;
        }
        p.windowResized();
    };

    p.draw = function() {
        p.background(253);
        gvs.drawAll(p);
    };

};

const P5 = new p5(sketch, containerElement);