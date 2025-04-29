// js/pipes.js
import * as config from './config.js';
import * as state from './state.js';
import { getTankFromMultiValvePosition } from './utils.js';
import { startMoleFractionCalculation, stopMoleFractionCalculation } from './simulation.js';

// Helper to draw the pipe layers (outline and fill)
function drawPipeLayer(draw, pipeGroup, pathString, width, color, linejoin = 'round', isOutline = false) {
  const strokeOptions = {
    color: color,
    width: isOutline ? width + 4 : width, // Outline is wider
    linejoin: linejoin
  };
  let pipeElement = draw.path(pathString)
    .fill('none')
    .stroke(strokeOptions);
  pipeGroup.add(pipeElement); // Add to the main pipe group
  return pipeElement;
}

// Main function to draw a pipe segment (both layers)
export function drawPipeWithCurves(draw, pipeGroup, pathString, segmentId, pipeW = config.pipeWidth, strokeC = config.pipeStrokeColor, outlineC = config.pipeOutlineColor) {
  // Draw the "shadow" outline first (behind)
  drawPipeLayer(draw, pipeGroup, pathString, pipeW, outlineC, 'round', true);

  // Draw the actual pipe fill on top
  let pipe = drawPipeLayer(draw, pipeGroup, pathString, pipeW, strokeC, 'round', false);

  // Register the main pipe segment (the colored part) for later reference
  if (segmentId) {
    state.setPipeSegment(segmentId, pipe);
  }

  return pipe; // Return the main pipe element
}

// Function to animate flow along a specific segment
export function animateGasFlow(draw, segmentId, color, opacity, onComplete = null, isMFCControlled = false) {
  const path = state.getPipeSegment(segmentId);
  if (!path) {
    console.warn(`Pipe segment ${segmentId} not found for animation.`);
    if (onComplete) onComplete(); // Ensure callback fires even if path missing
    return;
  }
  // Avoid creating duplicate animations if one is already running for this segment
  if (state.getFlowPath(segmentId)) {
    console.log(`Flow animation already exists for ${segmentId}. Skipping.`);
    // Optionally, call onComplete immediately if needed?
    // if (onComplete) onComplete();
    return;
  }


  // Get the path string from the existing base segment
  const pathString = path.attr('d'); // Use attr('d') which is standard

  // Create a new path for the flow animation
  const flowPath = draw.path(pathString)
    .fill('none')
    .stroke({
      color: color,
      opacity: opacity,
      width: config.pipeWidth,
      linejoin: 'round'
    });

  // Add to the *drawing* (not necessarily the static pipeGroup, depends on layering needs)
  // Adding to the main draw area ensures it's potentially on top
  draw.add(flowPath);
  // Alternatively, if you have a dedicated flowGroup: flowGroup.add(flowPath);


  // Get total length for animation
  const totalLength = flowPath.length(); // Use length() method

  // Set initial dash array and offset for reveal animation
  flowPath.attr({
    'stroke-dasharray': totalLength,
    'stroke-dashoffset': totalLength
  });

  // Store the flow path WITH its properties for later reference/removal
  state.setFlowPath(segmentId, flowPath, isMFCControlled, color, opacity);

  // Animate the flow with completion callback
  const speed = isMFCControlled ? state.getMfcFlowSpeed() : 50; // Use state for speed
  flowPath.animate({ duration: totalLength * speed / 50 }).attr({ 'stroke-dashoffset': 0 }) // Adjust duration based on length and speed factor
    .after(() => {
      // Animation finished for this segment
      console.log(`Animation complete for ${segmentId}`);
      if (onComplete) {
        onComplete();
      }
      // Optional: remove the dasharray after completion to make it a solid line?
      // flowPath.attr({'stroke-dasharray': null, 'stroke-dashoffset': null});
      // Or just leave it - removing might cause flicker if immediately re-animated
    });
}


// Function to stop and remove all flow animations
export function stopAllFlows() {
  state.removeAllFlowPaths();
}

// Define all pipe paths and draw them
export function drawPipes(draw, pipeGroup) {
  pipeGroup.clear(); // Clear previous pipes if redrawing

  // Tank 1 Paths
  let startX = 62.5;
  let startY = config.canvasHeight - config.mainCylHeight - 42.5;
  const tank1PipePath1 = `
    M ${startX} ${startY} 
    L ${startX} ${startY - 17.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank1PipePath1, 'tank1_seg1', config.pipeWidth, '#ff0000', config.pipeOutlineColor)
    .stroke({ opacity: 0.9 });

  const tank1PipePath2 = `
    M ${startX} ${startY - 53}
    L ${startX} ${startY - 63}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank1PipePath2, 'tank1_seg2');

  const tank1PipePath3 = `
    M ${startX} ${startY - 92.5}
    L ${startX} ${startY - 130}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank1PipePath3, 'tank1_seg3');

  const tank1PipePath4 = `
    M ${startX} ${startY - 162.5}
    L ${startX} ${startY - 207.5}
    L ${startX + 66.5} ${startY - 207.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank1PipePath4, 'tank1_seg4');

  // Tank 2
  startX = 62.5 + config.mainCylWidth + config.tanksGap;
  startY = config.canvasHeight - config.mainCylHeight - 42.5;
  const tank2PipePath1 = `
    M ${startX} ${startY} 
    L ${startX} ${startY - 17.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank2PipePath1, 'tank2_seg1', config.pipeWidth, '#ff0000', config.pipeOutlineColor).stroke({ opacity: 0.5 });;

  const tank2PipePath2 = `
    M ${startX} ${startY - 53}
    L ${startX} ${startY - 63}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank2PipePath2, 'tank2_seg2');

  const tank2PipePath3 = `
    M ${startX} ${startY - 92.5}
    L ${startX} ${startY - 130}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank2PipePath3, 'tank2_seg3');

  const tank2PipePath4 = `
    M ${startX} ${startY - 162.5}
    L ${startX} ${startY - 175}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank2PipePath4, 'tank2_seg4');

  // Tank 3
  startX = 62.5 + 2 * config.mainCylWidth + 2 * config.tanksGap;
  startY = config.canvasHeight - config.mainCylHeight - 42.5;
  const tank3PipePath1 = `
    M ${startX} ${startY} 
    L ${startX} ${startY - 17.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank3PipePath1, 'tank3_seg1', config.pipeWidth, 'blue', config.pipeOutlineColor).stroke({ opacity: 0.5 });;;

  const tank3PipePath2 = `
    M ${startX} ${startY - 53}
    L ${startX} ${startY - 63}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank3PipePath2, 'tank3_seg2');

  const tank3PipePath3 = `
    M ${startX} ${startY - 92.5}
    L ${startX} ${startY - 130}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank3PipePath3, 'tank3_seg3');

  const tank3PipePath4 = `
    M ${startX} ${startY - 162.5}
    L ${startX} ${startY - 207.5}
    L ${startX - 66.5} ${startY - 207.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, tank3PipePath4, 'tank3_seg4');

  // MFC Inlet and Outlet Paths and further connections (as per your design)
  startX = 62.5 + config.mainCylWidth + config.tanksGap;
  startY = config.canvasHeight - config.mainCylHeight - 42.5 - 240;

  const MFCInletPath = `
    M ${startX} ${startY}
    L ${startX} ${startY - 10}
    L ${startX + 150} ${startY - 10}
    L ${startX + 150} ${startY + 20}
    L ${startX + 187.5} ${startY + 20}
  `;
  drawPipeWithCurves(draw, pipeGroup, MFCInletPath, 'mfc_inlet');

  const MFCOutletPath = `
    M ${startX + 187.5 + 60} ${startY + 20}
    L ${startX + 187.5 + 60 + 32.5} ${startY + 20}
  `;
  drawPipeWithCurves(draw, pipeGroup, MFCOutletPath, 'mfc_outlet');

  const AdsorptionBedInletPath = `
    M ${startX + 187.5 + 60 + 32.5 + 65} ${startY + 20}
    L ${startX + 187.5 + 60 + 32.5 + 65 + 92.5} ${startY + 20}
    L ${startX + 187.5 + 60 + 32.5 + 65 + 92.5} ${startY + 20 + 62.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, AdsorptionBedInletPath, 'adsorption_bed_inlet');

  const MFCValveOutletPath = `
    M ${startX + 187.5 + 60 + 32.5 + 32.5} ${startY + 52.5}
    L ${startX + 187.5 + 60 + 32.5 + 32.5} ${startY + 332.5}
    L ${startX + 187.5 + 60 + 32.5 + 32.5 + 92.5} ${startY + 332.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, MFCValveOutletPath, 'mfc_valve_outlet');

  const AdsorptionBedOutletPath = `
    M ${startX + 187.5 + 60 + 32.5 + 65 + 92.5} ${startY + 20 + 62.5 + 200}
    L ${startX + 187.5 + 60 + 32.5 + 65 + 92.5} ${startY + 20 + 62.5 + 200 + 17.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, AdsorptionBedOutletPath, 'adsorption_bed_outlet');

  const AdsorptionBedValveOutletPath = `
    M ${startX + 187.5 + 60 + 32.5 + 32.5 + 95 + 62.5} ${startY + 332.5}
    L ${startX + 187.5 + 60 + 32.5 + 32.5 + 95 + 62.5 + 9.5} ${startY + 332.5}
  `;
  drawPipeWithCurves(draw, pipeGroup, AdsorptionBedValveOutletPath, 'adsorption_bed_valve_outlet');

  const BPGValveOutletPath = `
    M ${startX + 187.5 + 60 + 32.5 + 32.5 + 95 + 62.5 + 95} ${startY + 332.5}
    L ${startX + 187.5 + 60 + 32.5 + 32.5 + 95 + 62.5 + 95 + 35} ${startY + 332.5}
    L ${startX + 187.5 + 60 + 32.5 + 32.5 + 95 + 62.5 + 95 + 35} ${startY + 332.5 + 50}
  `;
  drawPipeWithCurves(draw, pipeGroup, BPGValveOutletPath, 'bpg_valve_outlet');

  const AnalyserOutletPath = `
    M ${startX + 187.5 + 60 + 32.5 + 32.5 + 95 + 62.5 + 95 + 35 + 50 + 9} ${startY + 332.5 + 50 + 40}
    L ${startX + 187.5 + 60 + 32.5 + 32.5 + 95 + 62.5 + 95 + 35 + 50 + 50} ${startY + 332.5 + 50 + 40}
  `;
  drawPipeWithCurves(draw, pipeGroup, AnalyserOutletPath, 'analyser_outlet');
}


// Logic to determine which flows should be active and start/stop them
export function checkAndStartMFCFlow(draw) {
  // Stop all flows downstream of the multi-valve first
  const mfcSegments = [
    'mfc_inlet', 'mfc_outlet', 'adsorption_bed_inlet',
    'mfc_valve_outlet', // To vent 1
    'adsorption_bed_outlet', 'adsorption_bed_valve_outlet', // To T-valve
    'bpg_valve_outlet', // T-valve to Analyzer
    'analyser_outlet' // Analyzer to Vent 2
  ];
  mfcSegments.forEach(segmentId => state.removeFlowPath(segmentId));

  // Stop simulation calculation
  stopMoleFractionCalculation(); // Assumes this clears timer and resets related state

  // Determine selected tank and check valve states
  const tankNum = getTankFromMultiValvePosition(state.getCurrentMultiValvePosition());

  if (tankNum && tankNum !== 'outlet') { // Ensure a tank (1, 2, or 3) is selected
    const tankValveId = `tankValve${tankNum}`;
    const pressureValveId = `pressureValve${tankNum}`;

    // Only proceed if *both* valves for the selected tank are open
    if (state.getValveState(tankValveId)?.isOpen && state.getValveState(pressureValveId)?.isOpen) {

      // Set color and opacity based on tank number
      let color, opacity;
      switch (tankNum) {
        case '1':
          color = '#ff0000';
          opacity = 0.9;
          break;
        case '2':
          color = '#ff0000';
          opacity = 0.5;
          break;
        case '3':
          color = 'blue';
          opacity = 0.5;
          break;
        default:
          color = 'grey';
          opacity = 1.0; // Should not happen
      }

      console.log(`Starting flow from Tank ${tankNum}`);

      state.setGaugeValue(`gauge${tankNum}`, state.getGaugeValue(`gauge${tankNum}`, 5.0));

      // Start chained animations
      // Flow reaches MFC
      animateGasFlow(draw, 'mfc_inlet', color, opacity, () => {
        // After MFC inlet completes, start MFC outlet and other paths
        animateGasFlow(draw, 'mfc_outlet', color, opacity, null, true);

        // Start these paths simultaneously
        animateGasFlow(draw, 'adsorption_bed_inlet', color, opacity, () => {
          // Start mole fraction calculation when adsorption bed inlet completes
          startMoleFractionCalculation(tankNum);
        }, true);

        animateGasFlow(draw, 'mfc_valve_outlet', color, opacity, () => {
          // After MFC valve outlet completes, start adsorption bed outlet
          animateGasFlow(draw, 'adsorption_bed_outlet', color, opacity, () => {
            // After adsorption bed outlet completes, start remaining paths
            animateGasFlow(draw, 'adsorption_bed_valve_outlet', color, opacity, null, true);
            animateGasFlow(draw, 'bpg_valve_outlet', color, opacity, null, true);
            animateGasFlow(draw, 'analyser_outlet', color, opacity, null, true);
          }, true);
        }, true);
      }, true); // isMFCControlled = true

    } else {
      state.setGaugeValue(0.0, 0.0);
      console.log(`Flow check: Tank ${tankNum} selected, but one or both valves are closed.`);
      // No flow started, simulation already stopped.
    }
  } else {
    state.setGaugeValue(0.0, 0.0);
    console.log(`Flow check: No valid tank selected (Position: ${state.getCurrentMultiValvePosition()}).`);
    // No flow started, simulation already stopped.
  }
}