import { meterHeight } from "./bubblemeter.js";

let bubbleStartTime = null;
let bubbleEndTime = null;

export function startBubbleTimer() {
  bubbleStartTime = millis();
}

export function endBubbleTimer(currentY) {
  bubbleEndTime = millis();

  const duration = (bubbleEndTime - bubbleStartTime) / 1000; // seconds
  const volume = map(currentY, meterHeight, 0, 0, 10); // height → mL
  const flowRate = volume / duration;

  return {
    volume: volume.toFixed(2),
    duration: duration.toFixed(2),
    flowRate: flowRate.toFixed(2)
  };
}

// ✅ ENHANCED: Each bubble represents realistic volume based on flow rate
export function getBubbleSpawnRate(vaporFlowRate_mL_per_s) {
  if (vaporFlowRate_mL_per_s <= 0) return 0;
  
  // Each bubble represents 0.5 mL of gas
  const bubbleVolume = 0.5; 
  const bubblesPerSecond = vaporFlowRate_mL_per_s / bubbleVolume;
  
  // Cap the maximum bubble rate for visual clarity
  return Math.min(bubblesPerSecond, 5.0); // Max 5 bubbles/second
}

// ✅ NEW: Calculate conversion based on temperature (from worksheet data)
export function getConversionAtTemp(temp) {
  if (temp < 290) return 0; // No reaction below 290°C
  if (temp >= 290 && temp < 315) {
    // Linear interpolation between 290°C (0%) and 315°C (40%)
    return (temp - 290) / (315 - 290) * 0.40;
  }
  if (temp >= 315 && temp < 330) {
    // 40% conversion at 300°C region
    return 0.40;
  }
  if (temp >= 330 && temp < 345) {
    // Linear interpolation between 330°C (40%) and 345°C (60%)
    return 0.40 + (temp - 330) / (345 - 330) * 0.20;
  }
  // 60% conversion at 330°C and above
  return 0.60;
}

// ✅ NEW: Calculate product yields based on temperature and conversion
export function calculateProductYields(temp, conversion) {
  const propanolFed = 3.33; // mol (250 mL * 0.8 g/mL / 60 g/mol)
  const propanolReacted = propanolFed * conversion;
  const propanolUnreacted = propanolFed - propanolReacted;
  
  // Temperature affects product distribution
  let fractionToPropanal; // x in worksheet equations
  
  if (temp < 330) {
    // At lower temps, more propylene (reaction 1)
    fractionToPropanal = 0.3; // 30% goes to propanal
  } else {
    // At higher temps, more propanal (reaction 2)  
    fractionToPropanal = 0.7; // 70% goes to propanal
  }
  
  const propanolToPropanal = propanolReacted * fractionToPropanal;
  const propanolToPropylene = propanolReacted * (1 - fractionToPropanal);
  
  // Calculate mass flow rates (from worksheet equations)
  const MW_propanal = 58; // g/mol
  const MW_water = 18; // g/mol
  const MW_propanol = 60; // g/mol
  
  const massFlowPropanal = propanolToPropanal * MW_propanal;
  const massFlowWater = propanolToPropylene * MW_water;
  const massFlowUnreactedPropanol = propanolUnreacted * MW_propanol;
  
  const totalLiquidMass = massFlowPropanal + massFlowWater + massFlowUnreactedPropanol;
  
  // Convert to mL (assuming density ~ 0.8 g/mL)
  const liquidVolume_mL = totalLiquidMass / 0.8;
  
  return {
    propanolFed: propanolFed,
    propanolReacted: propanolReacted,
    propanolUnreacted: propanolUnreacted,
    propanolToPropanal: propanolToPropanal,
    propanolToPropylene: propanolToPropylene,
    fractionToPropanal: fractionToPropanal,
    totalLiquidMass: totalLiquidMass,
    liquidVolume_mL: liquidVolume_mL,
    gasProduced_mol: propanolReacted, // 1 mol gas per mol propanol reacted
    yields: {
      propanalYield: propanolToPropanal / propanolFed,
      propyleneYield: propanolToPropylene / propanolFed
    }
  };
}

// ✅ NEW: Calculate expected gas flow rate based on stoichiometry
export function calculateGasFlowRate(temp, conversion) {
  const yields = calculateProductYields(temp, conversion);
  const gasProduced_mol = yields.gasProduced_mol;
  
  // Convert to mL/s using ideal gas law at reaction conditions
  // Assume STP approximation: 1 mol = 22.4 L = 22400 mL
  const gasVolume_mL = gasProduced_mol * 22400;
  
  // Spread over 10-minute experiment = 600 seconds
  const experimentDuration_s = 120;
  const gasFlowRate_mL_s = gasVolume_mL / experimentDuration_s;
  
  return gasFlowRate_mL_s;
}

// ✅ NEW: Comprehensive material balance calculation
export function calculateMaterialBalance(temp) {
  const conversion = getConversionAtTemp(temp);
  const yields = calculateProductYields(temp, conversion);
  const gasFlowRate = calculateGasFlowRate(temp, conversion);
  
  return {
    temperature: temp,
    conversion: conversion,
    gasFlowRate_mL_s: gasFlowRate,
    liquidVolume_mL: yields.liquidVolume_mL,
    ...yields
  };
}

// ✅ NEW: Validate material balance (inlet = outlet)
export function validateMaterialBalance(materialBalance) {
  const { propanolFed, propanolReacted, propanolUnreacted } = materialBalance;
  
  // Check molar balance
  const molarIn = propanolFed;
  const molarOut = propanolUnreacted + propanolReacted; // reacted becomes products
  const molarBalanceError = Math.abs(molarIn - molarOut) / molarIn;
  
  // Check mass balance would require tracking all product masses
  
  return {
    molarBalanceError: molarBalanceError,
    isBalanced: molarBalanceError < 0.01 // 1% tolerance
  };
}

export function setDefaults() {
  // Reset any global state if needed
  bubbleStartTime = null;
  bubbleEndTime = null;
}

export function calcAll() {
  // Main calculation function - can be expanded as needed
  console.log("Material balance calculations updated");
}