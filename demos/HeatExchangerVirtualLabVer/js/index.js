const DOUBLE_TUBE = 0;
const SHELL_TUBE = 1;
const MAX_HOT_WATER_TEMP = 59.2;
const MIN_HOT_WATER_TEMP = 46.6;
const MAX_COLD_WATER_TEMP = 26.6;
const MIN_COLD_WATER_TEMP = 20.2;
const MAX_HOT_FLOWRATE = 19.5;
const MIN_HOT_FLOWRATE = 3.5;
const MAX_COLD_FLOWRATE = 21.6;
const MIN_COLD_FLOWRATE = 16.3;

/* ************************************************************************* */
/* ** This file holds the main P5 draw loop, window globals, and settings ** */
/* ************************************************************************* */

// Globals defined here
window.g = {
    cnv: undefined,
    width: 800,
    height: 640,

    orngTime: -1, // -1 means it's not running, will be replaced by millis() once pumps are started
    blueTime: -1,

    orangeFluidColor: [255, 50, 0, 200],
    blueFluidColor: [0, 80, 255, 180],

    cpC: 4.186, // J / g / K
    cpH: 4.186, // J / g / K
    mDotC: 2, // g / s
    mDotH: 1, // g / s

    vols: [1000, 0, 1000, 0], // Beakers always follow order [Th_in, Th_out, Tc_in, Tc_out]
    hIsFlowing: false, // These are separate because the simulation used to have you start them separately
    cIsFlowing: false, // I'll leave it in like this in case that ever changes again

    Th_in: 40.0, // These values are overridden by the randStartVals function
    Tc_in: 10.0,
    Th_out: 40,
    Tc_out: 10,
    Th_out_observed: 25, // These values are the starting observed beaker values...
    Tc_out_observed: 25, // The beakers are integrated over the pump run time and display the average temperature over time

    T_measured: [-1, -1, -1, -1],

    dragging1: false, // These are for the valves, they become true on click in the buttons.js
    dragging2: false,
}

// Setup is called when the p5 object is initialized
function setup() {
    g.cnv = createCanvas(g.width, g.height);
    g.cnv.parent("graphics-wrapper");

    dt = doubleTubeGraphic(500, 400);
    dtb = doubleTubeBlue(500, 400, 50, 450, 50);
    dto = doubleTubeOrng(500, 400, 50, 450, 50);
    b = createBeaker();
    bt = beakersAndTubes();
    v = valve();
    pa = pumpAssembly();

    thiTubes(thi = createGraphics(g.width, g.height));
    thoTubes(tho = createGraphics(g.width, g.height));
    tciTubes(tci = createGraphics(g.width, g.height));
    tcoTubes(tco = createGraphics(g.width, g.height));

    var options = { placement: 'bottom' };
    $("#hi-tooltip").tooltip(options);
    $("#ho-tooltip").tooltip(options);
    $("#ci-tooltip").tooltip(options);
    $("#co-tooltip").tooltip(options);

    randStartVals();
}

// Called every frame of the p5 animation
function draw() {
    // console.log((1000 / deltaTime).toFixed(1)); // Track frametime
    background(250);

    heatTransferRate(); // calculations
    drawAll(); // graphics
}