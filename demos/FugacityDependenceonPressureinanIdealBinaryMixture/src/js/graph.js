import { computeEquilibriumCompositions, Psat, ANTOINE_BENZENE, ANTOINE_TOLUENE } from './calcs.js';

// Helper function to draw dashed lines
function drawDashedLine(x1, y1, x2, y2) {
  const dashLength = 1; // Reduced from 3 to 1.5
  const gapLength = 1;    // Reduced from 2 to 1
  const totalLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const numDashes = Math.floor(totalLength / (dashLength + gapLength));
  
  for (let i = 0; i < numDashes; i++) {
    const t1 = (i * (dashLength + gapLength)) / totalLength;
    const t2 = Math.min(((i + 1) * dashLength + i * gapLength) / totalLength, 1);
    
    const x1Dash = x1 + t1 * (x2 - x1);
    const y1Dash = y1 + t1 * (y2 - y1);
    const x2Dash = x1 + t2 * (x2 - x1);
    const y2Dash = y1 + t2 * (y2 - y1);
    
    line(x1Dash, y1Dash, x2Dash, y2Dash);
  }
  
  // Draw final dash to reach the end point if needed
  const lastDashStart = (numDashes * (dashLength + gapLength)) / totalLength;
  if (lastDashStart < 1) {
    const x1Final = x1 + lastDashStart * (x2 - x1);
    const y1Final = y1 + lastDashStart * (y2 - y1);
    line(x1Final, y1Final, x2, y2);
  }
}

export function drawBasicPlot(options = {}) {
  // Configurable parameters with defaults
  const leftMargin = options.leftMargin ?? 18;
  const topMargin = options.topMargin ?? 8;
  const rightMargin = options.rightMargin ?? 8;
  const bottomMargin = options.bottomMargin ?? 14;
  const tickLen = options.tickLen ?? 2;
  const tickCount = options.tickCount ?? 5;
  const yLabel = options.yLabel ?? "Y Axis";
  const xLabel = options.xLabel ?? "X Axis";
  const yTickLabel = options.yTickLabel ?? (i => (i * 20).toString());
  const xTickLabel = options.xTickLabel ?? (i => (i * 10).toString());
  const axisLabelSize = options.axisLabelSize ?? 3.5;
  const tickLabelSize = options.tickLabelSize ?? 3.0;
  const yLabelOffset = options.yLabelOffset ?? -4;
  const xLabelOffset = options.xLabelOffset ?? 10;

  const plotX = window.contentArea.x + leftMargin;
  const plotY = window.contentArea.y + topMargin;
  const plotW = window.contentArea.width - leftMargin - rightMargin;
  const plotH = window.contentArea.height - topMargin - bottomMargin;

  // Axes
  stroke(0);
  strokeWeight(0.4);
  line(plotX, plotY, plotX, plotY + plotH); // y-axis
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH); // x-axis
  line(plotX, plotY, plotX + plotW, plotY); // top
  line(plotX + plotW, plotY, plotX + plotW, plotY + plotH); // right

  // Ticks and number labels (left/right, bottom/top)
  textSize(tickLabelSize);
  fill(0);
  noStroke();
  // Y axis ticks (left and right)
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= tickCount; i++) {
    const y = plotY + plotH - (i * plotH / tickCount);
    // Left ticks and labels (ticks inside)
    stroke(0);
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    text(yTickLabel(i), plotX - 2, y); // closer to axis
    // Right ticks only (ticks inside)
    stroke(0);
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  // X axis ticks (bottom and top)
  textAlign(CENTER, TOP);
  for (let i = 0; i <= tickCount; i++) {
    const x = plotX + (i * plotW / tickCount);
    // Bottom ticks and labels (ticks inside)
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY + plotH, x, plotY + plotH - tickLen);
    noStroke();
    text(xTickLabel(i), x, plotY + plotH + 2); // closer to axis
    // Top ticks only (ticks inside)
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY, x, plotY + tickLen);
    noStroke();
  }
  // Axis labels
  textStyle(NORMAL);
  textSize(axisLabelSize);
  textAlign(CENTER, BOTTOM);
  text(xLabel, plotX + plotW / 2, plotY + plotH + xLabelOffset);
  textAlign(RIGHT, CENTER);
  push();
  translate(plotX - 10, plotY + plotH / 2 + yLabelOffset); // move Y axis label up
  rotate(-HALF_PI);
  text(yLabel, 0, 0);
  pop();
}

export function drawPlot1(options = {}) {
  // P-x-y plot
  const leftMargin = options.leftMargin ?? 18;
  const topMargin = options.topMargin ?? 8;
  const rightMargin = options.rightMargin ?? 8;
  const bottomMargin = options.bottomMargin ?? 14;
  const tickLen = options.tickLen ?? 2;
  const tickCount = options.tickCount ?? 5; // 5 major ticks
  const yLabel = options.yLabel ?? "pressure (bar)";
  const xLabel = options.xLabel ?? "mole fraction benzene";
  const yTickLabel = options.yTickLabel ?? (i => (i * 0.1).toFixed(1)); // 0.0 to 0.5 in 5 steps
  const xTickLabel = options.xTickLabel ?? (i => (i * 0.2).toFixed(1)); // 0.0 to 1.0 in 5 steps
  const axisLabelSize = options.axisLabelSize ?? 3.5;
  const tickLabelSize = options.tickLabelSize ?? 3.0;
  const yLabelOffset = options.yLabelOffset ?? -4;
  const xLabelOffset = options.xLabelOffset ?? 10;
  const yLabelXOffset = options.yLabelXOffset ?? -10; // Custom X offset for Y-axis label

  const plotX = window.contentArea.x + leftMargin;
  const plotY = window.contentArea.y + topMargin;
  const plotW = window.contentArea.width - leftMargin - rightMargin;
  const plotH = window.contentArea.height - topMargin - bottomMargin;

  // Draw P-x-y curves FIRST (behind axes and ticks)
  if (window.pxyData && window.pxyData.length > 0) {
    // Draw bubble point curve (Px) - Orange
    stroke(255, 165, 0); // Orange
    strokeWeight(0.6); // Reduced thickness
    noFill();
    beginShape();
    for (let i = 0; i < window.pxyData.length; i++) {
      const point = window.pxyData[i];
      const x = plotX + (point.x * plotW);
      const y = plotY + plotH - (point.Px / 0.5 * plotH);
      // Ensure point is within plot bounds
      const boundedY = Math.max(plotY, Math.min(plotY + plotH, y));
      vertex(x, boundedY);
    }
    endShape();
    
    // Draw dew point curve (Py) - Red
    stroke(255, 0, 0); // Red
    strokeWeight(0.6); // Reduced thickness
    noFill();
    beginShape();
    for (let i = 0; i < window.pxyData.length; i++) {
      const point = window.pxyData[i];
      const x = plotX + (point.x * plotW);
      const y = plotY + plotH - (point.Py / 0.5 * plotH);
      // Ensure point is within plot bounds
      const boundedY = Math.max(plotY, Math.min(plotY + plotH, y));
      vertex(x, boundedY);
    }
    endShape();
  }

  // Axes
  stroke(0);
  strokeWeight(0.4);
  line(plotX, plotY, plotX, plotY + plotH); // y-axis
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH); // x-axis
  line(plotX, plotY, plotX + plotW, plotY); // top
  line(plotX + plotW, plotY, plotX + plotW, plotY + plotH); // right

  // Ticks and number labels
  textSize(tickLabelSize);
  fill(0);
  noStroke();
  
  // Y axis ticks (left and right) - 4 major ticks
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= tickCount; i++) {
    const y = plotY + plotH - (i * plotH / tickCount);
    // Left ticks and labels
    stroke(0);
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    text(yTickLabel(i), plotX - 2, y);
    // Right ticks only
    stroke(0);
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  
  // X axis ticks (bottom and top) - 4 major ticks
  textAlign(CENTER, TOP);
  for (let i = 0; i <= tickCount; i++) {
    const x = plotX + (i * plotW / tickCount);
    // Bottom ticks and labels
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY + plotH, x, plotY + plotH - tickLen);
    noStroke();
    text(xTickLabel(i), x, plotY + plotH + 2);
    // Top ticks only
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY, x, plotY + tickLen);
    noStroke();
  }
  
  // Minor ticks for X-axis (3 minor ticks between each major tick)
  stroke(0);
  strokeWeight(0.15);
  for (let i = 0; i < tickCount; i++) {
    for (let j = 1; j <= 3; j++) {
      const x = plotX + (i * plotW / tickCount) + (j * plotW / (tickCount * 4));
      // Bottom minor ticks
      line(x, plotY + plotH, x, plotY + plotH - tickLen * 0.6);
      // Top minor ticks
      line(x, plotY, x, plotY + tickLen * 0.6);
    }
  }
  
  // Minor ticks for Y-axis (4 minor ticks between each major tick)
  for (let i = 0; i < tickCount; i++) {
    for (let j = 1; j <= 4; j++) {
      const y = plotY + plotH - (i * plotH / tickCount) - (j * plotH / (tickCount * 5));
      // Left minor ticks
      line(plotX, y, plotX + tickLen * 0.6, y);
      // Right minor ticks
      line(plotX + plotW, y, plotX + plotW - tickLen * 0.6, y);
    }
  }
  
  // Draw current point if state is available (after axes and ticks)
  if (window.currentState) {
    const state = window.currentState;
    const currentX = plotX + (state.moleFraction * plotW);
    const currentY = plotY + plotH - (state.pressure / 0.5 * plotH);
    
    // Ensure current point is within plot bounds
    const boundedCurrentY = Math.max(plotY, Math.min(plotY + plotH, currentY));
    
    // Add tie-line visualization if in two-phase region
    if (state.isInTwoPhase && window.pxyData && window.pxyData.length > 0) {
      // Find the equilibrium compositions (liquid and vapor)
      const PB = Psat(state.temperature, ANTOINE_BENZENE);
      const PT = Psat(state.temperature, ANTOINE_TOLUENE);
      const { xL: solLiq, yV: solVap } = computeEquilibriumCompositions(state.pressure, PB, PT);
      
      if (solLiq !== null && solVap !== null) {
        // Calculate positions for tie-line points
        const liquidX = plotX + (solLiq * plotW);
        const vaporX = plotX + (solVap * plotW);
        const tieLineY = plotY + plotH - (state.pressure / 0.5 * plotH);
        const boundedTieLineY = Math.max(plotY, Math.min(plotY + plotH, tieLineY));
        
        // Draw dashed tie-lines
        stroke(255, 0, 0); // Red for liquid
        strokeWeight(0.4);
        strokeCap(SQUARE);
        // Draw dashed line from current point to liquid curve
        drawDashedLine(currentX, boundedCurrentY, liquidX, boundedTieLineY);
        // Draw dashed line from liquid curve to x-axis
        drawDashedLine(liquidX, boundedTieLineY, liquidX, plotY + plotH);
        
        stroke(255, 165, 0); // Orange for vapor
        // Draw dashed line from current point to vapor curve
        drawDashedLine(currentX, boundedCurrentY, vaporX, boundedTieLineY);
        // Draw dashed line from vapor curve to x-axis
        drawDashedLine(vaporX, boundedTieLineY, vaporX, plotY + plotH);
        
        // Reset line style
        strokeCap(ROUND); // Reset to default
        
        // Draw additional dots at tie-line intersections (AFTER dashed lines)
        fill(0);
        noStroke();
        
        ellipse(liquidX, boundedTieLineY, 1.5, 1.5); // Liquid point on curve
        ellipse(vaporX, boundedTieLineY, 1.5, 1.5); // Vapor point on curve
      }
    }
    
    // Draw current point (AFTER dashed lines so it appears on top)
    fill(0);
    noStroke();
    ellipse(currentX, boundedCurrentY, 1.5, 1.5); // Reduced from 3 to 1.5
  }
  
  // Add curve labels (after everything else)
  if (window.pxyData && window.pxyData.length > 0) {
    textSize(3.5);
    textAlign(CENTER, BOTTOM);
    fill(255, 165, 0); // Orange for liquid
    noStroke();
    text("liquid", plotX + plotW * 0.22, plotY + plotH * 0.18); // Moved up from 0.42
    
    textAlign(CENTER, TOP);
    fill(255, 0, 0); // Red for vapor
    text("vapor", plotX + plotW * 0.76, plotY + plotH * 0.75); // Moved down from 0.1
  }
  
  // Axis labels
  textStyle(NORMAL);
  textFont();
  noStroke();
  textSize(axisLabelSize);
  fill(0); // Ensure axis labels are black
  textAlign(CENTER, BOTTOM);
  text(xLabel, plotX + plotW / 2, plotY + plotH + xLabelOffset);
  textAlign(CENTER, CENTER);
  push();
  translate(plotX + yLabelXOffset, plotY + plotH / 2); // Use custom X offset
  rotate(-HALF_PI);
  text(yLabel, 0, 0);
  pop();
}

export function drawPlot2(options = {}) {
  // Fugacity versus P plot
  const leftMargin = options.leftMargin ?? 18;
  const topMargin = options.topMargin ?? 8;
  const rightMargin = options.rightMargin ?? 8;
  const bottomMargin = options.bottomMargin ?? 14;
  const tickLen = options.tickLen ?? 2;
  const tickCount = options.tickCount ?? 4; // 4 major ticks for X-axis
  const yTickCount = options.yTickCount ?? 5; // 5 major ticks for Y-axis
  const yLabel = options.yLabel ?? "fugacity (bar)";
  const xLabel = options.xLabel ?? "pressure (bar)";
  const yTickLabel = options.yTickLabel ?? (i => (i * 0.1).toFixed(1)); // 0.0 to 0.5 in 5 steps
  const xTickLabel = options.xTickLabel ?? (i => (0.1 + i * 0.1).toFixed(1)); // 0.1 to 0.5 in 4 steps
  const axisLabelSize = options.axisLabelSize ?? 3.5;
  const tickLabelSize = options.tickLabelSize ?? 3.0;
  const yLabelOffset = options.yLabelOffset ?? -4;
  const xLabelOffset = options.xLabelOffset ?? 10;
  const yLabelXOffset = options.yLabelXOffset ?? -10; // Custom X offset for Y-axis label
  const isBothPlots = options.isBothPlots ?? false; // New parameter to indicate both plots are shown

  const plotX = window.contentArea.x + leftMargin;
  const plotY = window.contentArea.y + topMargin;
  const plotW = window.contentArea.width - leftMargin - rightMargin;
  const plotH = window.contentArea.height - topMargin - bottomMargin;

  // Draw fugacity curves FIRST (behind axes and ticks)
  if (window.fugacityCurvesData && window.fugacityCurvesData.length > 0) {
    // Draw benzene fugacity curve (Green) - continuous curve
    stroke(0, 255, 0); // Green
    strokeWeight(0.6);
    noFill();
    beginShape();
    for (let i = 0; i < window.fugacityCurvesData.length; i++) {
      const point = window.fugacityCurvesData[i];
      const x = plotX + ((point.p - 0.1) / 0.4) * plotW;
      const y = plotY + plotH - (point.fBen / 0.5) * plotH;
      const boundedY = Math.max(plotY, Math.min(plotY + plotH, y));
      vertex(x, boundedY);
    }
    endShape();
    
    // Draw toluene fugacity curve (Blue) - continuous curve
    stroke(0, 0, 255); // Blue
    strokeWeight(0.6);
    noFill();
    beginShape();
    for (let i = 0; i < window.fugacityCurvesData.length; i++) {
      const point = window.fugacityCurvesData[i];
      const x = plotX + ((point.p - 0.1) / 0.4) * plotW;
      const y = plotY + plotH - (point.fTol / 0.5) * plotH;
      const boundedY = Math.max(plotY, Math.min(plotY + plotH, y));
      vertex(x, boundedY);
    }
    endShape();
  }

  // Axes
  stroke(0);
  strokeWeight(0.4);
  line(plotX, plotY, plotX, plotY + plotH); // y-axis
  line(plotX, plotY + plotH, plotX + plotW, plotY + plotH); // x-axis
  line(plotX, plotY, plotX + plotW, plotY); // top
  line(plotX + plotW, plotY, plotX + plotW, plotY + plotH); // right

  // Ticks and number labels
  textSize(tickLabelSize);
  fill(0);
  noStroke();
  // Y axis ticks (left and right)
  textAlign(RIGHT, CENTER);
  for (let i = 0; i <= yTickCount; i++) {
    const y = plotY + plotH - (i * plotH / yTickCount);
    // Left ticks and labels
    stroke(0);
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    text(yTickLabel(i), plotX - 2, y);
    // Right ticks only
    stroke(0);
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  // X axis ticks (bottom and top)
  textAlign(CENTER, TOP);
  for (let i = 0; i <= tickCount; i++) {
    const x = plotX + (i * plotW / tickCount);
    // Bottom ticks and labels
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY + plotH, x, plotY + plotH - tickLen);
    noStroke();
    text(xTickLabel(i), x, plotY + plotH + 2);
    // Top ticks only
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY, x, plotY + tickLen);
    noStroke();
  }
  
  // Minor ticks for X-axis (4 minor ticks between each major tick)
  stroke(0);
  strokeWeight(0.15);
  for (let i = 0; i < tickCount; i++) {
    for (let j = 1; j <= 4; j++) {
      const x = plotX + (i * plotW / tickCount) + (j * plotW / (tickCount * 5));
      // Bottom minor ticks
      line(x, plotY + plotH, x, plotY + plotH - tickLen * 0.6);
      // Top minor ticks
      line(x, plotY, x, plotY + tickLen * 0.6);
    }
  }
  
  // Minor ticks for Y-axis (4 minor ticks between each major tick)
  for (let i = 0; i < yTickCount; i++) {
    for (let j = 1; j <= 4; j++) {
      const y = plotY + plotH - (i * plotH / yTickCount) - (j * plotH / (yTickCount * 5));
      // Left minor ticks
      line(plotX, y, plotX + tickLen * 0.6, y);
      // Right minor ticks
      line(plotX + plotW, y, plotX + plotW - tickLen * 0.6, y);
    }
  }
  
  // Draw current point if state is available (after axes and ticks)
  if (window.currentState) {
    const state = window.currentState;
    const currentX = plotX + ((state.pressure - 0.1) / 0.4) * plotW;
    const currentYB = plotY + plotH - (state.fB / 0.5) * plotH;
    const currentYT = plotY + plotH - (state.fT / 0.5) * plotH;
    
    // Ensure current points are within plot bounds
    const boundedCurrentYB = Math.max(plotY, Math.min(plotY + plotH, currentYB));
    const boundedCurrentYT = Math.max(plotY, Math.min(plotY + plotH, currentYT));
    
    // Draw current points (smaller size)
    fill(0);
    noStroke();
    ellipse(currentX, boundedCurrentYB, 1.5, 1.5); // Benzene point
    ellipse(currentX, boundedCurrentYT, 1.5, 1.5); // Toluene point
  }
  
  // Add curve labels (after everything else)
  if (window.fugacityCurvesData && window.fugacityCurvesData.length > 0) {
    textSize(3.5);
    textAlign(CENTER, CENTER);
    
    // Find the curve points at fixed X positions for labels
    const benzeneXPos = 0.25; // Fixed X position for benzene label
    const tolueneXPos = 0.75; // Fixed X position for toluene label
    
    // Find benzene curve Y position at the fixed X
    const benzeneIndex = Math.round(benzeneXPos * window.fugacityCurvesData.length);
    if (benzeneIndex < window.fugacityCurvesData.length) {
      const benzenePoint = window.fugacityCurvesData[benzeneIndex];
      const benzeneX = plotX + ((benzenePoint.p - 0.1) / 0.4) * plotW;
      const benzeneY = plotY + plotH - (benzenePoint.fBen / 0.5) * plotH;
      const boundedBenzeneY = Math.max(plotY, Math.min(plotY + plotH, benzeneY));
      
      // Draw white background rectangle for benzene label
      const textW = textWidth("benzene");
      const textHeight = 4;
      const padding = 0.25;
      fill(255); // White background
      noStroke();
      rect(benzeneX - textW/2 - padding, boundedBenzeneY - textHeight/2 - padding, 
           textW + 2*padding, textHeight + 2*padding);
      
      // Draw benzene text
      fill(0, 255, 0); // Green for benzene
      noStroke();
      text("benzene", benzeneX, boundedBenzeneY);
    }
    
    // Find toluene curve Y position at the fixed X
    const tolueneIndex = Math.round(tolueneXPos * window.fugacityCurvesData.length);
    if (tolueneIndex < window.fugacityCurvesData.length) {
      const toluenePoint = window.fugacityCurvesData[tolueneIndex];
      const tolueneX = plotX + ((toluenePoint.p - 0.1) / 0.4) * plotW;
      const tolueneY = plotY + plotH - (toluenePoint.fTol / 0.5) * plotH;
      const boundedTolueneY = Math.max(plotY, Math.min(plotY + plotH, tolueneY));
      
      // Draw white background rectangle for toluene label
      const textW = textWidth("toluene");
      const textHeight = 4;
      const padding = 0.25;
      fill(255); // White background
      noStroke();
      rect(tolueneX - textW/2 - padding, boundedTolueneY - textHeight/2 - padding, 
           textW + 2*padding, textHeight + 2*padding);
      
      // Draw toluene text
      fill(0, 0, 255); // Blue for toluene
      noStroke();
      text("toluene", tolueneX, boundedTolueneY);
    }
  }
  
  // Axis labels
  textStyle(NORMAL);
  textFont();
  noStroke();
  textSize(axisLabelSize);
  fill(0); // Ensure axis labels are black
  textAlign(CENTER, BOTTOM);
  text(xLabel, plotX + plotW / 2, plotY + plotH + xLabelOffset);
  textAlign(CENTER, CENTER);
  push();
  translate(plotX + yLabelXOffset, plotY + plotH / 2); // Moved right from -12 to -8
  rotate(-HALF_PI);
  text(yLabel, 0, 0);
  pop();
} 