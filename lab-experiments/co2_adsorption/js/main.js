// js/main.js
// Imports remain the same...
import * as config from './config.js';
import * as state from './state.js';
import { checkAndStartMFCFlow, drawPipes, playValve2Animation } from './pipes.js'; // Use the drawPipes you provided
import { resetEverything } from './reset.js';
import { createGasCylinder } from './components/gasCylinder.js';
import { createConnectedGauges, createDigitalPressureGauge } from './components/gauges.js';
import { createVerticalValve, createInteractiveValve, createTValve } from './components/valves.js';
import { createMassFlowController } from './components/mfc.js';
import { createVerticalAdsorptionBedView } from './components/adsorptionBed.js';
import { createCO2GasAnalyzer } from './components/co2Analyzer.js';
import { createVentArrow } from './components/ventArrow.js';
import { addOptionToDragAndZoom } from './zoom.js';
import { createThermister } from './components/therm.js';

export const zoomLabelX = 740, zoomLabelY = 190;
export const betaLabelX = 810, betaLabelY = 485;

// Define other component coordinates (matching those used in pipes.js)
const mfcX = 319; const mfcY = 22;
const outletValveX = 510; const outletValveY = 250;
export const digPressureGaugeX = 565, digPressureGaugeY = 530;
const adsorptionBedX = 650; const adsorptionBedY = 330;
const tValveX = 580, tValveY = 220;
const co2AnalyzerX = 700, co2AnalyzerY = 50;
const thermX = 800; const thermY = 380;
const vent2BaseX = 875; const vent2BaseY = 85; // Base position for arrow placement


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
export function drawCanvas() {
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

    // --- 2. Create ALL Static Components FIRST ---

    // Create Tanks
    createGasCylinder(draw, config.tanksMarginX, tankY, "90% CO₂/N₂");
    createGasCylinder(draw, config.tanksMarginX + config.mainCylWidth + config.tanksGap, tankY, "10% CO₂/N₂");
    createGasCylinder(draw, config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap), tankY, "N₂");

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

    // First valve
    createInteractiveValve(draw, "tankValve", multiValveX, multiValveY, [180, 0, 90], (angle) => {
        state.setCurrentMultiValvePosition(angle); // Update global state
        checkAndStartMFCFlow(draw);
    });

    // Create MFC
    createMassFlowController(draw, mfcX, mfcY);


    // Create Digital Pressure Gauge
    createDigitalPressureGauge(draw, digPressureGaugeX, digPressureGaugeY, "--- bar"); // Use bar unit?

    // Create Adsorption Bed
    createVerticalAdsorptionBedView(draw, adsorptionBedX, adsorptionBedY);

    // Create Inlet Valve - between MFC and Bed
    createInteractiveValve(draw, "inletValve", outletValveX, outletValveY, [0, 90], (angle) => {
        let path;
        switch(angle) {
            case   0:
                path = state.FLOW_BED;
                break;
            case  90:
                path = state.FLOW_BYPASS;
                break;
        }
        state.setFlowConfig(path);
        if (state.getFlowPath("mfc_inlet") !== undefined) playValve2Animation(draw);
    });
    // Create Outlet Valve - after Bed
    // createInteractiveValve(draw, "outletValve", adsorptionOutletValveX, adsorptionOutletValveY, [0], undefined, true); // true = isThreeValve

    // Create T-Valve / Back Pressure Regulator
    createTValve(draw, tValveX, tValveY);

    // Create CO2 Analyzer
    createCO2GasAnalyzer(draw, co2AnalyzerX, co2AnalyzerY, "0.00%"); // Initial text

    // Create Thermister display
    createThermister(draw, thermX, thermY);

    // Create Vent Arrows
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