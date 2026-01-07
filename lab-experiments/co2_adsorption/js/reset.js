// js/reset.js
// Imports remain the same...
import * as state from './state.js';
import * as config from './config.js';
import { drawPipes, stopAllFlows } from './pipes.js';
import { createGasCylinder } from './components/gasCylinder.js';
import { createConnectedGauges, createDigitalPressureGauge } from './components/gauges.js';
import { createVerticalValve, createInteractiveValve, createTValve } from './components/valves.js';
import { createMassFlowController } from './components/mfc.js';
import { createVerticalAdsorptionBedView } from './components/adsorptionBed.js';
import { createCO2GasAnalyzer } from './components/co2Analyzer.js';
import { createVentArrow } from './components/ventArrow.js';
import { stopHeating, startMoleFractionCalculation } from './simulation.js';
import { addOptionToDragAndZoom } from './zoom.js';
import { drawCanvas } from './main.js';

// Function now accepts draw and pipeGroup (or assumes draw is global and recreates group)
export function resetEverything(draw, pipeGroup) { // Keep parameters if main.js passes them
    console.log('Resetting simulation...');
    window.location.reload();
    console.log('System reset complete.');
}