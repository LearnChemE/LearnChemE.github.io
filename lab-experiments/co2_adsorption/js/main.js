// js/main.js
// Imports remain the same...
import * as config from './config.js';
import * as state from './state.js';
import { drawPipes } from './pipes.js'; // Use the drawPipes you provided
import { resetEverything } from './reset.js';
import { createGasCylinder } from './components/gasCylinder.js';
import { createConnectedGauges, createDigitalPressureGauge } from './components/gauges.js';
import { createVerticalValve, createInteractiveValve, createTValveFromImage } from './components/valves.js';
import { createMassFlowController, mfcClicked } from './components/mfc.js';
import { createVerticalAdsorptionBedView } from './components/adsorptionBed.js';
import { createCO2GasAnalyzer } from './components/co2Analyzer.js';
import { createVentArrow } from './components/ventArrow.js';
import { addOptionToDragAndZoom } from './zoom.js';

// --- Global Canvas Setup ---
let windowWidth = window.innerWidth - 60;
let windowHeight = windowWidth * config.canvasHeight / config.canvasWidth;

const draw = SVG().addTo('#svg-container').size(windowWidth, windowHeight);
window.svgDraw = draw; // Make global if needed by other modules like simulation/reset

draw.viewbox(0, 0, config.canvasWidth, config.canvasHeight);
draw.attr('preserveAspectRatio', 'xMidYMid meet');

// --- Main Pipe Group ---
let pipeGroup = draw.group(); // Group for static pipes

// --- Updated Initial Drawing Function ---
function drawCanvas() {
    console.log("Drawing canvas components..."); // Add log

    // --- 1. Calculate Key Positions ---
    const tankY = config.canvasHeight - config.mainCylHeight;
    const gaugeY = config.canvasHeight - config.mainCylHeight - config.pressureGaugeOffset;
    const multiValveX = config.tanksMarginX + config.mainCylWidth + config.tanksGap + (config.mainCylWidth / 2) - 2.5;
    const multiValveY = config.canvasHeight - config.mainCylHeight - 250;

    // Calculate Y positions for vertical valves (needed before creating them)
    const nozzleStackHeight = config.nozzleRect1Height + config.nozzleRect2Height + config.nozzleRect3Height;
    const tv1_y = config.canvasHeight - config.mainCylHeight - nozzleStackHeight - (config.verticalValveBlockHeight * 2 + config.verticalValveBodyHeight) - 15.5; // Position above nozzle stack

    const verticalValveTotalHeightActual = config.verticalValveBlockHeight * 2 + config.verticalValveBodyHeight;
    const pv_y = gaugeY - config.connectedGaugeVerticalOffset - config.valveOnGaugesGapBetween - verticalValveTotalHeightActual + 27; // Position above hexagon

    // Define other component coordinates (matching those used in pipes.js)
    const mfcX = 350; const mfcY = 0;
    const outletValveX = 475; const outletValveY = 87.5;
    const digPressureGaugeX = 550; const digPressureGaugeY = 55;
    const adsorptionBedX = 550; const adsorptionBedY = 150;
    const adsorptionOutletValveX = 600; const adsorptionOutletValveY = 400;
    const tValveX = 643; const tValveY = 370;
    const co2AnalyzerX = 700; const co2AnalyzerY = 450;
    const vent1BaseX = 465; const vent1BaseY = 5; // Base position for arrow placement
    const vent2BaseX = 870; const vent2BaseY = 485; // Base position for arrow placement

    // --- 2. Create ALL Static Components FIRST ---

    // Create Tanks
    createGasCylinder(draw, config.tanksMarginX, tankY, "90% CO2/N2");
    createGasCylinder(draw, config.tanksMarginX + config.mainCylWidth + config.tanksGap, tankY, "10% CO2/N2");
    createGasCylinder(draw, config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap), tankY, "N2");

    // Create Tank Valves (Initialize state with position)
    const tv1_x = config.tanksMarginX + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, tv1_x, tv1_y, 'tankValve1');
    const tv2_x = config.tanksMarginX + config.mainCylWidth + config.tanksGap + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, tv2_x, tv1_y, 'tankValve2'); // Use same Y
    const tv3_x = config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap) + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, tv3_x, tv1_y, 'tankValve3'); // Use same Y

    // Create Pressure Gauges (Connected style)
    const gauge1X = config.tanksMarginX + config.mainCylWidth / 2 - config.connectedGaugeSize / 2  - 2.5;
    createConnectedGauges(draw, gauge1X, gaugeY, 'gauge1');
    const gauge2X = config.tanksMarginX + config.mainCylWidth + config.tanksGap + config.mainCylWidth / 2 - config.connectedGaugeSize / 2 - 2.5;
    createConnectedGauges(draw, gauge2X, gaugeY, 'gauge2');
    const gauge3X = config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap) + config.mainCylWidth / 2 - config.connectedGaugeSize / 2 - 2.5;
    createConnectedGauges(draw, gauge3X, gaugeY, 'gauge3');

    // Create Pressure Valves (Initialize state with position)
    const pv1_x = config.tanksMarginX + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, pv1_x, pv_y, 'pressureValve1');
    const pv2_x = config.tanksMarginX + config.mainCylWidth + config.tanksGap + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, pv2_x, pv_y, 'pressureValve2'); // Use same Y
    const pv3_x = config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap) + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, pv3_x, pv_y, 'pressureValve3'); // Use same Y

    // Create Multi-Position Valve (Controller)
    createInteractiveValve(draw, multiValveX, multiValveY, true); // true = controller

    // Create MFC
    createMassFlowController(draw, mfcX, mfcY);
    mfcClicked(draw, mfcX, mfcY);

    // Create Inlet Valve (Non-controller) - between MFC and Bed
    createInteractiveValve(draw, outletValveX, outletValveY, false);

    // Create Digital Pressure Gauge
    createDigitalPressureGauge(draw, digPressureGaugeX, digPressureGaugeY, "--- bar"); // Use bar unit?

    // Create Adsorption Bed
    createVerticalAdsorptionBedView(draw, adsorptionBedX, adsorptionBedY);

    // Create Outlet Valve (3-way, Non-controller) - after Bed
    createInteractiveValve(draw, adsorptionOutletValveX, adsorptionOutletValveY, false, true); // true = isThreeValve

    // Create T-Valve / Back Pressure Regulator
    createTValveFromImage(draw, tValveX, tValveY);

    // Create CO2 Analyzer
    createCO2GasAnalyzer(draw, co2AnalyzerX, co2AnalyzerY, "00.00%"); // Initial text

    // Create Vent Arrows
    createVentArrow(draw, vent1BaseX + 5, vent1BaseY - 2, 270, 40); // Vent 1 (Top)
    createVentArrow(draw, vent2BaseX, vent2BaseY, 0, 40);  // Vent 2 (Right)

    // --- 3. Draw Pipes connecting the components ---
    // This now uses the component positions stored in state by the create functions above
    console.log("Drawing pipes...");
    drawPipes(draw, pipeGroup); // Draw pipes LAST

    addOptionToDragAndZoom(draw);

    console.log("Canvas drawing complete.");
}

// --- Resize Handling ---
window.addEventListener('resize', function() {
    windowWidth = window.innerWidth - 60;
    // Ensure height calculation respects potential container limits if needed
    windowHeight = windowWidth * config.canvasHeight / config.canvasWidth;
    draw.size(windowWidth, windowHeight);
    // You might not need to explicitly set viewbox again if preserveAspectRatio is working
    // draw.viewbox(0, 0, config.canvasWidth, config.canvasHeight);
});

// --- Reset Button ---
const resetButton = document.getElementById('reset-button');
if (resetButton) {
    resetButton.addEventListener('click', () => resetEverything(draw, pipeGroup));
} else {
    console.warn("Reset button element not found.");
}

// --- Initial Call ---
// Wrap in DOMContentLoaded to ensure elements exist, although placement at end of body helps
document.addEventListener('DOMContentLoaded', () => {
     drawCanvas(); // Draw everything initially
});