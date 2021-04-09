require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");
const { SVG_Graph } = require("./js/svg-graph-library.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
    scale: 1,
    flasks: [],
    still: undefined,
    R: undefined,
    stages: undefined,
    xStill: undefined,
    evapQuantity: undefined,
    txyShapes: {},
    eqShapes: {},
};

// JavaScript modules from /js/ folder
const { calcAll } = require("./js/calcs.js"); // contains all calculation-related functions
const { importSVG, addStill } = require("./js/importSVG.js"); // adds inline-SVG to the document
const { resizeFlasks, updateImage } = require("./js/update.js");

const containerElement = document.getElementById("svg-container");
const rightSideContainer = document.getElementById("right-side-container");

const txyPlotOptions = {
    parent: rightSideContainer,
    id: "txy-plot",                  
    title: "",
    titleFontSize: 16,
    padding: [[53, 18], [20, 55]],
    axes: {
        axesStrokeWidth: 2,
        x : {
            labels: ["", "mole fraction B"],  
            labelFontSize: 14,            
            display: [true, true],         
            range: [0, 1],                 
            step: 0.20,                    
            minorTicks: 4,                
            majorTickSize: 1.35,              
            minorTickSize: 0.65,
            tickLabelFontSize: 13,
            tickWidth: 0.5,
            tickLabelPrecision: 1,
            showZeroLabel: true,
        },
        y : {
            labels: ["temperature (&deg;C)", ""],
            labelFontSize: 14,
            display: [true, true],
            range: [75, 110],
            step: 5,
            minorTicks: 4,
            majorTickSize: 2.75,
            minorTickSize: 1.25,
            tickLabelFontSize: 13,
            tickWidth: 0.5,
            tickLabelPrecision: 0,
        }
    }
};

const eqPlotOptions = {
    parent: rightSideContainer,
    id: "eq-plot",                  
    title: "",
    titleFontSize: 16,
    padding: [[55, 20], [20, 55]],
    axes: {
        axesStrokeWidth: 2,
        x : {
            labels: ["", "x<sub>B</sub>"],
            labelFontSize: 16,
            display: [true, true],
            range: [0, 1],
            step: 0.20,
            minorTicks: 4,
            majorTickSize: 1.35,
            minorTickSize: 0.65,
            tickLabelFontSize: 13,
            tickWidth: 0.5,
            tickLabelPrecision: 1,
            showZeroLabel: true,
        },
        y : {
            labels: ["y<sub>B</sub>", ""],
            labelFontSize: 16,
            display: [true, true],
            range: [0, 1],
            step: 0.2,
            minorTicks: 4,
            majorTickSize: 2.75,
            minorTickSize: 1.25,
            tickLabelFontSize: 13,
            tickWidth: 0.5,
            tickLabelPrecision: 1,
            showZeroLabel: true,
        }
    }
};

function selectRightSideImage(n) {
    const eqPlot = document.getElementById("eq-plot");
    const txyPlot = document.getElementById("txy-plot");
    const eqLabels = document.getElementById("eq-plot-tick-labels");
    const txyLabels = document.getElementById("txy-plot-tick-labels");
    const flasks = document.getElementById("flasks-container");
    const flasksHere = document.getElementById("flasks-here");
    switch(n) {
        case 1:
            flasks.style.opacity = "1";
            if ( window.gvs.flasks.length === 1 ) { flasksHere.style.opacity = "1" }
            eqPlot.style.opacity = "0";
            txyPlot.style.opacity = "0";
            eqLabels.style.opacity = "0";
            txyLabels.style.opacity = "0";
        break;

        case 2:
            flasks.style.opacity = "0";
            eqPlot.style.opacity = "1";
            txyPlot.style.opacity = "0";
            eqLabels.style.opacity = "1";
            txyLabels.style.opacity = "0";
            flasksHere.style.opacity = "0";
        break;

        case 3:
            flasks.style.opacity = "0";
            eqPlot.style.opacity = "0";
            txyPlot.style.opacity = "1";
            eqLabels.style.opacity = "0";
            txyLabels.style.opacity = "1";
            flasksHere.style.opacity = "0";
        break;
    }
}

const sketch = (p) => {

    p.setup = function () {
        document.getElementById("loading").style.display = "none";
        p.noCanvas();
        p.noLoop();
        importSVG();
        addStill();
        window.gvs.addFlask();
        
        const flasksHere = document.createElement("div");
        flasksHere.innerHTML = `Collected distillate will appear here after you press "collect".`;
        flasksHere.id = "flasks-here";
        rightSideContainer.appendChild(flasksHere);

        const eqLineOptions = {
            stroke: "rgba(0, 0, 205, 1)",
            strokeWidth: 2,
            resolution: 100,
            id: `eq-curve-path`,
        };

        const txyLineOptions = {
            stroke: "rgba(0, 0, 205, 1)",
            strokeWidth: 2,
            resolution: 100,
            id: `txy-curve-path`,
        };

        window.gvs.txyPlot = new SVG_Graph(txyPlotOptions);
        window.gvs.txyPlot.addCurve(window.gvs.eqTempCelsius, txyLineOptions);
        const dewPointLine = window.gvs.txyPlot.addCurve(window.gvs.dewPointCelsius, { stroke: "rgb(100, 100, 100)", strokeWidth: 1 });
        dewPointLine.elt.style.strokeDasharray = "6px 3px";

        window.gvs.eqPlot = new SVG_Graph(eqPlotOptions);
        window.gvs.eqPlot.addCurve(window.gvs.eq, eqLineOptions);
        const xyLine = window.gvs.eqPlot.addCurve(function(x) { return x }, { stroke: "rgb(100, 100, 100)", strokeWidth: 1 });
        xyLine.elt.style.strokeDasharray = "6px 3px";

        selectRightSideImage(1);
        window.gvs.p = p;
        p.windowResized();
        window.gvs.findXd();

        const OLcoords = [[0, window.gvs.OL(0)], [window.gvs.xd, window.gvs.OL(window.gvs.xd)]];
        window.gvs.eqShapes.operatingLine = window.gvs.eqPlot.createLine({coord1: OLcoords[0], coord2: OLcoords[1], usePlotCoordinates: true, stroke: "rgb(150, 150, 0)", strokeWidth: 1 });
    };

    p.draw = function () {
        calcAll();
        updateImage();
    };

    p.windowResized = function() {
        const svgCnvElt = document.getElementById("canvas-rect");
        const rect = svgCnvElt.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const top = rect.top;
        const left = rect.left;
        rightSideContainer.style.width = `${w}px`;
        rightSideContainer.style.height = `${h}px`;
        rightSideContainer.style.top = `${top}px`;
        rightSideContainer.style.left = `${left}px`;
        window.gvs.txyPlot.resize();
        window.gvs.eqPlot.resize();
        resizeFlasks();
    }

};

const P5 = new p5(sketch, document.body);

const resetButton = document.getElementById("reset-button");
const sizeIncrease = document.getElementById("size-increase");
const sizeDecrease = document.getElementById("size-decrease");
const rightSideGraphicSelector = document.getElementById("right-side-graphic");
const xBinitSlider = document.getElementById("xBinit-slider");
const xBinitValue = document.getElementById("xBinit-value");
const stagesSlider = document.getElementById("stages-slider");
const stagesValue = document.getElementById("stages-value");
const evapQuantitySlider = document.getElementById("evap-quantity-slider");
const evapQuantityValue = document.getElementById("evap-quantity-value");
const refluxSlider = document.getElementById("reflux-slider");
const refluxValue = document.getElementById("reflux-value");

rightSideGraphicSelector.addEventListener("change", () => {
    const selection = Number(rightSideGraphicSelector.value);
    selectRightSideImage(selection);
});

resetButton.addEventListener("click", () => {
    resetToInitialConditions();
});

sizeDecrease.addEventListener("click", () => {
    gvs.scale *= 0.9;
    document.body.style.transform = `translate(${-1 * (1 - gvs.scale) * 500}px, ${-1 * (1 - gvs.scale) * 250}px) scale(${gvs.scale})`;
});

sizeIncrease.addEventListener("click", () => {
    gvs.scale *= 1.1;
    document.body.style.transform = `translate(${-1 * (1 - gvs.scale) * 500}px, ${-1 * (1 - gvs.scale) * 250}px) scale(${gvs.scale})`;
});

xBinitSlider.addEventListener("input", function() {
    const xB = Number( xBinitSlider.value );
    window.gvs.xStill = xB;
    xBinitValue.innerHTML = xB.toFixed(2);
    window.gvs.findXd();
    window.gvs.updateGraphs();
});

stagesSlider.addEventListener("input", function() {
    const stages = Math.round( stagesSlider.value );
    window.gvs.stages = stages;
    stagesValue.innerHTML = stages.toFixed(0);
    window.gvs.findXd();
    window.gvs.updateGraphs();
});

evapQuantitySlider.addEventListener("input", function() {
    const evapQuantity = Number( evapQuantitySlider.value );
    window.gvs.evapQuantity = evapQuantity;
    evapQuantityValue.innerHTML = evapQuantity.toFixed(2);
});

refluxSlider.addEventListener("input", function() {
    const R = Number( refluxSlider.value );
    window.gvs.R = R;
    refluxValue.innerHTML = R.toFixed(1);
    window.gvs.findXd();
    window.gvs.updateGraphs();
});

const xB = Number( xBinitSlider.value );
window.gvs.xStill = xB;
xBinitValue.innerHTML = xB.toFixed(2);

const stages = Math.round( stagesSlider.value );
window.gvs.stages = stages;
stagesValue.innerHTML = stages.toFixed(0);

const evapQuantity = Number( evapQuantitySlider.value );
evapQuantityValue.innerHTML = evapQuantity.toFixed(2);
window.gvs.evapQuantity = evapQuantity;

const R = Number( refluxSlider.value );
window.gvs.R = R;
refluxValue.innerHTML = R.toFixed(1);

function  resetToInitialConditions() {

};
