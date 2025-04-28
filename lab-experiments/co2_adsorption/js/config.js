// js/config.js

// Global Dimensions & Settings
export const canvasWidth = 950;
export const canvasHeight = 600;

export const mainCylWidth = 60;
export const mainCylHeight = 250;
export const nozzleRect1Width = 30;
export const nozzleRect1Height = 12;
export const nozzleRect2Width = 15;
export const nozzleRect2Height = 20;
export const nozzleRect3Width = 30;
export const nozzleRect3Height = 12;

export const gaugeSize = 30;
export const gaugeStrokeWidth = 4;

export const hexCircleSize = 30;
export const hexSize = 12;
export const hexInnerCircleSize = 10;

export const connectedGaugeSize = 50;
export const connectedGaugeSeparation = 0;
export const connectedGaugeVerticalOffset = 30;

export const valveBlockWidth = 20; // Horizontal Valve (Not used in final drawing?)
export const valveBlockHeight = 40; // Horizontal Valve
// ... (keep other horizontal valve dimensions if needed, or remove if unused)

export const verticalValveBlockWidth = 15;
export const verticalValveBlockHeight = 7.5;
export const verticalValveBodyWidth = 15;
export const verticalValveBodyHeight = 20;
export const verticalValveStemWidth = 5;
export const verticalValveStemHeight = 10;
export const verticalValveTrapezoidWidth = 5;
export const verticalValveTopExtent = 15;

export const interactiveValveRadius = 25;
export const interactiveValveMarkerOffset = 3;
export const interactiveValvePointerOffset = 5;

export const tanksMarginX = 35;
export const tanksGap = 40;

export const pressureGaugeOffset = 150;

export const valveOnGaugesGaugeOffset = 135;
export const valveOnGaugesGapBetween = 20;
export const valveOnGaugesValveWidth = 20;
export const valveOnGaugesValveTotalHeight = 50;

export const pipeWidth = 5;
export const pipeStrokeColor = '#f7f7f7';
export const pipeOutlineColor = '#d5d5d5';

// Transmitter Dimensions (Not used in final drawing?)
export const transmitterBodyWidth = 80;
// ... (keep other transmitter dimensions if needed, or remove if unused)

// MFC Dimensions (derived within createMassFlowController)
// Adsorption Bed Dimensions (derived within createVerticalAdsorptionBedView)
// Digital Pressure Gauge Dimensions (derived within createDigitalPressureGauge)
// CO2 Analyzer Dimensions (derived within createCO2GasAnalyzer)
// T-Valve Dimensions (derived within createTValveFromImage)

// Simulation Parameters
export const defaultMfcValue = 15.0;
export const defaultMfcFlowSpeed = 50; // ms
export const timeStep = 1; // seconds
export const simulationSpeedMultiplier = 1; // Adjust for faster/slower simulation time progression (8 in original example)
export const tempKelvin = 298; // Temperature in K