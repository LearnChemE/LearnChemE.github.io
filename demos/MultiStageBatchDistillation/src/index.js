require("./style/style.scss");
require("bootstrap");
require("./style/slider.scss");
window.p5 = new require("./js/p5.min.js");
const { SVG_Graph } = require("./js/svg-graph-library.js");

// GLOBAL VARIABLES OBJECT
window.gvs = {
    scale: 1,
    flasks: [],
    still: {},
    R: undefined,
    stages: undefined,
    evapQuantity: undefined,
    txyShapes: {},
    eqShapes: {},
    isCollecting: false,
    isEmpty: false,
    dV: 0.005,
    xd: undefined,
    selectedPane: 1,
    initializing: true,
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
    padding: [[45, 15], [20, 55]],
    axes: {
        axesStrokeWidth: 2,
        x : {
            labels: ["", "mole fraction B"],  
            labelFontSize: 14,            
            display: [true, true],         
            range: [0, 1],                 
            step: 0.20,                    
            minorTicks: 4,                
            majorTickSize: 2,              
            minorTickSize: 0.9,
            tickLabelFontSize: 13,
            tickWidth: 0.25,
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
            tickWidth: 0.25,
            tickLabelPrecision: 0,
        }
    }
};

const eqPlotOptions = {
    parent: rightSideContainer,
    id: "eq-plot",                  
    title: "",
    titleFontSize: 16,
    padding: [[45, 15], [20, 55]],
    axes: {
        axesStrokeWidth: 2,
        x : {
            labels: ["", "x<sub>B</sub>"],
            labelFontSize: 16,
            display: [true, true],
            range: [0, 1],
            step: 0.20,
            minorTicks: 4,
            majorTickSize: 2,
            minorTickSize: 0.9,
            tickLabelFontSize: 13,
            tickWidth: 0.25,
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
            tickWidth: 0.25,
            tickLabelPrecision: 1,
            showZeroLabel: true,
        }
    }
};

function selectRightSideImage(n) {
    window.gvs.selectedPane = n;
    const eqPlot = document.getElementById("eq-plot");
    const txyPlot = document.getElementById("txy-plot");
    const eqLabels = document.getElementById("eq-plot-tick-labels");
    const txyLabels = document.getElementById("txy-plot-tick-labels");
    const flasks = document.getElementById("flasks-container");
    const flasksHere = document.getElementById("flasks-here");
    const eqPlotStairLabels = document.getElementById("eq-plot-stair-labels");
    const txyPlotStairLabels = document.getElementById("txy-plot-stair-labels");
    switch(n) {
        case 1:
            flasks.style.opacity = "1";
            if ( window.gvs.flasks.length === 1 ) { flasksHere.style.opacity = "1" }
            eqPlot.style.opacity = "0";
            txyPlot.style.opacity = "0";
            eqLabels.style.opacity = "0";
            txyLabels.style.opacity = "0";
            if ( !gvs.initializing ) { eqPlotStairLabels.style.opacity = "0" }
            if ( !gvs.initializing ) { txyPlotStairLabels.style.opacity = "0" }
        break;

        case 2:
            flasks.style.opacity = "0";
            eqPlot.style.opacity = "1";
            txyPlot.style.opacity = "0";
            eqLabels.style.opacity = "1";
            txyLabels.style.opacity = "0";
            flasksHere.style.opacity = "0";
            if ( !gvs.initializing ) { eqPlotStairLabels.style.opacity = "1" }
            if ( !gvs.initializing ) { txyPlotStairLabels.style.opacity = "0" }
        break;

        case 3:
            flasks.style.opacity = "0";
            eqPlot.style.opacity = "0";
            txyPlot.style.opacity = "1";
            eqLabels.style.opacity = "0";
            txyLabels.style.opacity = "1";
            flasksHere.style.opacity = "0";
            if ( !gvs.initializing ) { eqPlotStairLabels.style.opacity = "0" }
            if ( !gvs.initializing ) { txyPlotStairLabels.style.opacity = "1" }
        break;
    };
    if ( !gvs.initializing ) { calcAll(); updateImage(); }
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

        const eqLinesGroup = window.gvs.eqPlot.createGroup({
            classList: ["eq-plot-lines"],
            parent: window.gvs.eqPlot.SVG,
        });

        const OLcoords = [[0, window.gvs.OL(0)], [window.gvs.xd, window.gvs.OL(window.gvs.xd)]];
        window.gvs.eqShapes.operatingLine = window.gvs.eqPlot.createLine({ parent: eqLinesGroup, coord1: OLcoords[0], coord2: OLcoords[1], usePlotCoordinates: true, stroke: "rgb(150, 150, 0)", strokeWidth: 1 });
        window.gvs.eqShapes.stairLines = [];
        for ( let i = 0; i < 13; i++ ) {
            const line = window.gvs.eqPlot.createLine({ parent: eqLinesGroup, classList:["eq", "stair-line"], stroke: "rgb(0, 0, 0)", strokeWidth: 1 });
            line.style.strokeOpacity = "1";
            window.gvs.eqShapes.stairLines.push( line );
        };

        const plotRect = document.getElementsByClassName("svg-axes")[0].getBoundingClientRect();
        const plotW = plotRect.width;
        const plotH = plotRect.height;
        const aspectRatio = plotH / plotW;
        const rx = ( 400 / plotW );
        const ry = rx / aspectRatio;

        window.gvs.eqShapes.stillDot = window.gvs.eqPlot.createPoint({ coord: [0.5, 0.5], radius: rx, parent: eqLinesGroup, classList:["eq", "point", "still"], fill: "rgb(0, 0, 255)" });
        window.gvs.eqShapes.distillateDot = window.gvs.eqPlot.createPoint({ coord: [0.5, 0.5], radius: rx, parent: eqLinesGroup, classList:["eq", "point", "distillate"], fill: "rgb(255, 0, 0)" });
        
        const eqStairLabelDiv = document.createElement("div");
        eqStairLabelDiv.id = "eq-plot-stair-labels";
        eqStairLabelDiv.style.position = "absolute";
        eqStairLabelDiv.style.left = "0px";
        eqStairLabelDiv.style.top = "0px";
        eqStairLabelDiv.style.width = "100vw";
        eqStairLabelDiv.style.height = "100vh";
        eqStairLabelDiv.style.pointerEvents = "none";
        eqStairLabelDiv.style.opacity = "0";
        document.body.appendChild(eqStairLabelDiv);
        
        window.gvs.eqShapes.stairLabels = [];
        for ( let i = 0; i < 7; i++ ) {
            const label = document.createElement("div");
            label.classList.add("stair-label", "eq");
            label.style.position = "absolute";
            label.style.transform = "translateX(calc(-100% - 6px)) translateY(calc(-100% + 3px))";
            label.style.opacity = "0";
            label.style.padding = "0px 1px";
            label.style.lineHeight = "16px";
            label.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            if( i === 0 ) { label.innerHTML = "still" }
            else { label.innerHTML = `${i.toFixed(0)}` }
            eqStairLabelDiv.appendChild(label);
            window.gvs.eqShapes.stairLabels.push(label);
        };

        const txyLinesGroup = window.gvs.txyPlot.createGroup({
            classList: ["txy-plot-lines"],
            parent: window.gvs.txyPlot.SVG,
        });
        window.gvs.txyShapes.stairLines = [];
        for ( let i = 0; i < 13; i++ ) {
            const line = window.gvs.txyPlot.createLine({ parent: txyLinesGroup, classList:["txy", "stair-line"], stroke: "rgb(0, 0, 0)", strokeWidth: 1 });
            line.style.strokeOpacity = "1";
            window.gvs.txyShapes.stairLines.push( line );
        };

        window.gvs.txyShapes.stillDot = window.gvs.txyPlot.createPoint({ coord: [0.5, 0.5], radius: rx, parent: txyLinesGroup, classList:["txy", "point", "still"], fill: "rgb(0, 0, 255)" });
        window.gvs.txyShapes.distillateDot = window.gvs.txyPlot.createPoint({ coord: [0.5, 0.5], radius: rx, parent: txyLinesGroup, classList:["txy", "point", "distillate"], fill: "rgb(255, 0, 0)" });

        const txyStairLabelDiv = document.createElement("div");
        txyStairLabelDiv.id = "txy-plot-stair-labels";
        txyStairLabelDiv.style.position = "absolute";
        txyStairLabelDiv.style.left = "0px";
        txyStairLabelDiv.style.top = "0px";
        txyStairLabelDiv.style.width = "100vw";
        txyStairLabelDiv.style.height = "100vh";
        txyStairLabelDiv.style.pointerEvents = "none";
        txyStairLabelDiv.style.opacity = "0";
        document.body.appendChild(txyStairLabelDiv);
        
        window.gvs.txyShapes.stairLabels = [];
        for ( let i = 0; i < 8; i++ ) {
            const label = document.createElement("div");
            label.classList.add("stair-label", "txy");
            label.style.position = "absolute";
            label.style.transform = "translateX( calc( -100% - 5px ) )";
            label.style.opacity = "0";
            label.style.padding = "0px 1px";
            label.style.lineHeight = "16px";
            label.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
            if( i === 0 ) { label.innerHTML = "still" }
            else if ( i < 7 ) { label.innerHTML = `${i.toFixed(0)}` }
            else { label.innerHTML = "x<sub>d</sub>"; label.style.transform = "translate(calc(100% - 8px), calc( -100% - 2px) )"; }
            txyStairLabelDiv.appendChild(label);
            window.gvs.txyShapes.stairLabels.push(label);
        };

        updateImage();
        window.gvs.initializing = false;
    };

    p.draw = function () {
        if ( window.gvs.isCollecting ) {
            calcAll();
            updateImage();
        } else if ( p.frameCount !== 1 ) {
            endCollecting();
            updateImage();
        }
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
        const plotRect = document.getElementsByClassName("svg-axes")[0].getBoundingClientRect();
        const plotW = plotRect.width;
        const plotH = plotRect.height;
        const aspectRatio = plotH / plotW;
        const rx = ( 400 / plotW );
        const ry = rx / aspectRatio;
        const points = document.getElementsByClassName("point");
        for ( let i = 0; i < points.length; i++ ) {
            const point = points[i];
            point.setAttribute("rx", `${rx}`);
            point.setAttribute("ry", `${ry}`);
        }
        try { updateImage() } catch(e) {}
    }

};

const P5 = new p5(sketch, document.body);

const collectButton = document.getElementById("collect-button");
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

const xB = Number( xBinitSlider.value );
window.gvs.still.xB = xB;
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

rightSideGraphicSelector.addEventListener("change", () => {
    const selection = Number(rightSideGraphicSelector.value);
    selectRightSideImage(selection);
});

collectButton.addEventListener("click", () => {
    beginCollecting();
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
    window.gvs.still.xB = xB;
    xBinitValue.innerHTML = xB.toFixed(2);
    calcAll();
    updateImage()
});

stagesSlider.addEventListener("input", function() {
    const stages = Math.round( stagesSlider.value );
    window.gvs.stages = stages;
    stagesValue.innerHTML = stages.toFixed(0);
    calcAll();
    updateImage()
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
    calcAll();
    updateImage()
});

function  resetToInitialConditions() {
    [collectButton, resetButton, xBinitSlider, stagesSlider, evapQuantitySlider, refluxSlider].forEach(inp => {
        inp.removeAttribute("disabled");
    });

    document.getElementById("flasks-here").style.opacity = "1";

    const xB = Number( xBinitSlider.value );
    window.gvs.still.xB = xB;
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

    window.gvs.isCollecting = false;
    window.gvs.isEmpty = false;
    window.gvs.flasks = [];
    window.gvs.addFlask();
    window.gvs.still.V = window.gvs.still.maxVolume;
    window.gvs.findXd();
    P5.noLoop();
    updateImage();

    selectRightSideImage(Number(rightSideGraphicSelector.value));
};

function beginCollecting() {
    if ( !window.gvs.isEmpty ) {
        window.gvs.isCollecting = true;
        [collectButton, resetButton, xBinitSlider, stagesSlider, evapQuantitySlider, refluxSlider].forEach(inp => {
            inp.setAttribute("disabled", "true");
        });
        P5.loop();
    }
};
  
function endCollecting() {
    [collectButton, resetButton, evapQuantitySlider, refluxSlider].forEach(inp => {
        inp.removeAttribute("disabled");
    });
    window.gvs.addFlask();
    P5.noLoop();
};
