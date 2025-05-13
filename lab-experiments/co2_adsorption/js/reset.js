// js/reset.js
// Imports remain the same...
import * as state from './state.js';
import * as config from './config.js';
import { drawPipes, stopAllFlows } from './pipes.js';
import { createGasCylinder } from './components/gasCylinder.js';
import { createConnectedGauges, createDigitalPressureGauge } from './components/gauges.js';
import { createVerticalValve, createInteractiveValve, createTValveFromImage } from './components/valves.js';
import { createMassFlowController, mfcClicked } from './components/mfc.js';
import { createVerticalAdsorptionBedView } from './components/adsorptionBed.js';
import { createCO2GasAnalyzer } from './components/co2Analyzer.js';
import { createVentArrow } from './components/ventArrow.js';
import { stopMoleFractionCalculation, stopHeating } from './simulation.js';
import { addOptionToDragAndZoom } from './zoom.js';

// Function now accepts draw and pipeGroup (or assumes draw is global and recreates group)
export function resetEverything(draw, pipeGroup) { // Keep parameters if main.js passes them
    console.log('Resetting simulation...');

    // 1. Stop Timers and Calculations
    stopMoleFractionCalculation();
    stopHeating();

    // 2. Reset State Variables (using functions from state.js)
    state.resetSimulationState();
    state.resetValveStates();
    state.resetGaugeValues();
    state.removeAllFlowPaths();
    state.resetPipeSegments();

    // 3. Clear Full Canvas
    draw.clear();

    // 4. Recreate the main pipe group (or clear if managed by main.js)
    let newPipeGroup = draw.group(); // Create new group on cleared canvas

    // 5. Redraw all components using the NEW coordinates from main.js

    // --- Calculate Key Positions (Copied EXACTLY from your latest main.js) ---
    const tankY = config.canvasHeight - config.mainCylHeight;
    const gaugeY = config.canvasHeight - config.mainCylHeight - config.pressureGaugeOffset;
    // Updated multiValveX
    const multiValveX = config.tanksMarginX + config.mainCylWidth + config.tanksGap + (config.mainCylWidth / 2) - 2.5;
    const multiValveY = config.canvasHeight - config.mainCylHeight - 250;

    // Updated tv1_y
    const nozzleStackHeight = config.nozzleRect1Height + config.nozzleRect2Height + config.nozzleRect3Height;
    const tv1_y = config.canvasHeight - config.mainCylHeight - nozzleStackHeight - (config.verticalValveBlockHeight * 2 + config.verticalValveBodyHeight) - 15.5;

    // Updated pv_y
    const verticalValveTotalHeightActual = config.verticalValveBlockHeight * 2 + config.verticalValveBodyHeight;
    const pv_y = gaugeY - config.connectedGaugeVerticalOffset - config.valveOnGaugesGapBetween - verticalValveTotalHeightActual + 27;

    // Other coordinates (matching your latest main.js)
    const mfcX = 350; const mfcY = 0;
    const outletValveX = 475; const outletValveY = 87.5;
    const digPressureGaugeX = 550; const digPressureGaugeY = 55;
    const adsorptionBedX = 550; const adsorptionBedY = 150;
    const adsorptionOutletValveX = 600; const adsorptionOutletValveY = 400;
    const tValveX = 643; const tValveY = 370; // Updated tValveX
    const co2AnalyzerX = 700; const co2AnalyzerY = 450;
    const vent1BaseX = 465; const vent1BaseY = 5;
    const vent2BaseX = 870; const vent2BaseY = 485;

    // --- Create ALL Static Components FIRST (Using Updated Coordinates) ---
    createGasCylinder(draw, config.tanksMarginX, tankY, "90% CO2/N2");
    createGasCylinder(draw, config.tanksMarginX + config.mainCylWidth + config.tanksGap, tankY, "10% CO2/N2");
    createGasCylinder(draw, config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap), tankY, "N2");

    // Updated tvX calculations
    const tv1_x = config.tanksMarginX + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, tv1_x, tv1_y, 'tankValve1');
    const tv2_x = config.tanksMarginX + config.mainCylWidth + config.tanksGap + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, tv2_x, tv1_y, 'tankValve2');
    const tv3_x = config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap) + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, tv3_x, tv1_y, 'tankValve3');

    // Updated gaugeX calculations
    const gauge1X = config.tanksMarginX + config.mainCylWidth / 2 - config.connectedGaugeSize / 2 - 2.5;
    createConnectedGauges(draw, gauge1X, gaugeY, 'gauge1');
    const gauge2X = config.tanksMarginX + config.mainCylWidth + config.tanksGap + config.mainCylWidth / 2 - config.connectedGaugeSize / 2 - 2.5;
    createConnectedGauges(draw, gauge2X, gaugeY, 'gauge2');
    const gauge3X = config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap) + config.mainCylWidth / 2 - config.connectedGaugeSize / 2 - 2.5;
    createConnectedGauges(draw, gauge3X, gaugeY, 'gauge3');

    const pv1_x = config.tanksMarginX + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, pv1_x, pv_y, 'pressureValve1');
    const pv2_x = config.tanksMarginX + config.mainCylWidth + config.tanksGap + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, pv2_x, pv_y, 'pressureValve2');
    const pv3_x = config.tanksMarginX + 2 * (config.mainCylWidth + config.tanksGap) + config.mainCylWidth / 2 - config.verticalValveBlockWidth / 2 - 2.5;
    createVerticalValve(draw, pv3_x, pv_y, 'pressureValve3');

    createInteractiveValve(draw, multiValveX, multiValveY, true);
    createMassFlowController(draw, mfcX, mfcY);
    mfcClicked(draw, mfcX, mfcY);
    createInteractiveValve(draw, outletValveX, outletValveY, false);
    createDigitalPressureGauge(draw, digPressureGaugeX, digPressureGaugeY, "--- bar");
    createVerticalAdsorptionBedView(draw, adsorptionBedX, adsorptionBedY);
    createInteractiveValve(draw, adsorptionOutletValveX, adsorptionOutletValveY, false, true);
    createTValveFromImage(draw, tValveX, tValveY);
    createCO2GasAnalyzer(draw, co2AnalyzerX, co2AnalyzerY, "00.00%");

    createVentArrow(draw, vent1BaseX + 5, vent1BaseY - 2, 270, 40);
    createVentArrow(draw, vent2BaseX, vent2BaseY, 0, 40);

    // 6. Draw Pipes LAST
    drawPipes(draw, newPipeGroup); // Pass the newly created group
    addOptionToDragAndZoom(draw);

    console.log('System reset complete.');
}