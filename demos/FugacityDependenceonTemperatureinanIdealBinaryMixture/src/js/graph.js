import { computeEquilibriumCompositions, Psat, ANTOINE_BENZENE, ANTOINE_TOLUENE } from './calcs.js';

/* ––––– Helper Functions ––––– */

/** Draw a dashed line between two points */
function drawDashedLine(x1, y1, x2, y2, dashLength = 3, gapLength = 3) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const unitX = dx / distance;
  const unitY = dy / distance;
  
  let currentX = x1;
  let currentY = y1;
  let remainingDistance = distance;
  let drawDash = true;
  
  while (remainingDistance > 0) {
    const segmentLength = Math.min(drawDash ? dashLength : gapLength, remainingDistance);
    const nextX = currentX + unitX * segmentLength;
    const nextY = currentY + unitY * segmentLength;
    
    if (drawDash) {
      line(currentX, currentY, nextX, nextY);
    }
    
    currentX = nextX;
    currentY = nextY;
    remainingDistance -= segmentLength;
    drawDash = !drawDash;
  }
}

/** Draw a dashed curve using multiple line segments */
function drawDashedCurve(points, dashLength = 3, gapLength = 3) {
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    drawDashedLine(p1.x, p1.y, p2.x, p2.y, dashLength, gapLength);
  }
}

/** Draw a dashed curve with consistent spacing regardless of slope */
function drawConsistentDashedCurve(points, dashLength = 0.75, gapLength = 1.5) {
  if (points.length < 2) return;
  
  // Calculate total curve length
  let totalLength = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    totalLength += Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }
  
  // Calculate number of dash-gap cycles needed
  const cycleLength = dashLength + gapLength;
  const numCycles = Math.floor(totalLength / cycleLength);
  
  // Draw dashes along the curve
  let currentLength = 0;
  let cycleProgress = 0;
  let drawDash = true;
  
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const segmentLength = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
    
    if (segmentLength === 0) continue;
    
    const unitX = (p2.x - p1.x) / segmentLength;
    const unitY = (p2.y - p1.y) / segmentLength;
    
    let segmentProgress = 0;
    
    while (segmentProgress < segmentLength) {
      const remainingInSegment = segmentLength - segmentProgress;
      const remainingInCycle = drawDash ? dashLength - cycleProgress : gapLength - cycleProgress;
      const stepLength = Math.min(remainingInSegment, remainingInCycle);
      
      if (stepLength <= 0) break;
      
      const startX = p1.x + segmentProgress * unitX;
      const startY = p1.y + segmentProgress * unitY;
      const endX = p1.x + (segmentProgress + stepLength) * unitX;
      const endY = p1.y + (segmentProgress + stepLength) * unitY;
      
      if (drawDash) {
        line(startX, startY, endX, endY);
      }
      
      segmentProgress += stepLength;
      cycleProgress += stepLength;
      
      // Check if we need to switch from dash to gap or vice versa
      if (cycleProgress >= (drawDash ? dashLength : gapLength)) {
        cycleProgress = 0;
        drawDash = !drawDash;
      }
    }
  }
}

// Helper function to draw vertical lines with horizontal dashes
function drawVerticalDashedLine(x, y1, y2, plotX, plotW) {
  const dashLength = 0.75; // Reduced from 1
  const gapLength = 0.75;  // Reduced from 1
  const totalLength = Math.abs(y2 - y1);
  const numDashes = Math.floor(totalLength / (dashLength + gapLength));
  
  // Calculate dash width to stay within plot boundaries
  const maxDashWidth = Math.min(0.5, (plotW * 0.01)); // 1% of plot width or 0.5, whichever is smaller
  const dashWidth = Math.min(maxDashWidth, 0.5);
  
  for (let i = 0; i < numDashes; i++) {
    const t1 = (i * (dashLength + gapLength)) / totalLength;
    const t2 = Math.min(((i + 1) * dashLength + i * gapLength) / totalLength, 1);
    
    const y1Dash = y1 + t1 * (y2 - y1);
    const y2Dash = y1 + t2 * (y2 - y1);
    
    // Draw horizontal dash within plot boundaries
    const dashX1 = Math.max(plotX, x - dashWidth);
    const dashX2 = Math.min(plotX + plotW, x + dashWidth);
    line(dashX1, y1Dash, dashX2, y1Dash);
  }
  
  // Draw final dash to reach the end point if needed
  const lastDashStart = (numDashes * (dashLength + gapLength)) / totalLength;
  if (lastDashStart < 1) {
    const y1Final = y1 + lastDashStart * (y2 - y1);
    const dashX1 = Math.max(plotX, x - dashWidth);
    const dashX2 = Math.min(plotX + plotW, x + dashWidth);
    line(dashX1, y1Final, dashX2, y1Final);
  }
}

// Helper function to draw horizontal lines with vertical dashes (matching vertical dash size)
function drawHorizontalDashedLine(x1, y1, x2, y2, plotY, plotH) {
  const dashLength = 1.0; // Same as vertical dashes
  const gapLength = 0.75;  // Same as vertical dashes
  const totalLength = Math.abs(x2 - x1);
  const numDashes = Math.floor(totalLength / (dashLength + gapLength));
  
  // Calculate dash width to match vertical dash width
  const dashWidth = 0.5; // Same as vertical dash width
  
  for (let i = 0; i < numDashes; i++) {
    const t1 = (i * (dashLength + gapLength)) / totalLength;
    const t2 = Math.min(((i + 1) * dashLength + i * gapLength) / totalLength, 1);
    
    const x1Dash = x1 + t1 * (x2 - x1);
    const x2Dash = x1 + t2 * (x2 - x1);
    
    // Draw horizontal dash within plot boundaries
    const dashY1 = Math.max(plotY, y1 - dashWidth/2);
    const dashY2 = Math.min(plotY + plotH, y1 + dashWidth/2);
    line(x1Dash, dashY1, x2Dash, dashY1);
  }
  
  // Draw final dash to reach the end point if needed
  const lastDashStart = (numDashes * (dashLength + gapLength)) / totalLength;
  if (lastDashStart < 1) {
    const x1Final = x1 + lastDashStart * (x2 - x1);
    const dashY1 = Math.max(plotY, y1 - dashWidth/2);
    const dashY2 = Math.min(plotY + plotH, y1 + dashWidth/2);
    line(x1Final, dashY1, x2, dashY1);
  }
}

// Helper function to draw yB label consistently
function drawYBLabel(vaporX, plotY, plotH, plotX, plotW) {
  textSize(4.0);
  textAlign(CENTER, TOP);
  
  const yBText = "y";
  const yBTextWidth = textWidth(yBText);
  const boxHeight = 5;
  const boxWidth = boxHeight;
  const boxPadding = 0.5;
  
  // Ensure label stays within plot boundaries
  const labelX = Math.max(plotX + boxWidth/2, Math.min(plotX + plotW - boxWidth/2, vaporX));
  const labelY = Math.max(plotY + 2, Math.min(plotY + plotH - boxHeight - 2, plotY + plotH - 9));
  
  // White box with green outline for y_B
  fill(255);
  stroke(0, 128, 0);
  strokeWeight(0.3);
  rect(labelX - boxWidth/2, labelY, 
       boxWidth, boxHeight);
  
  // y_B text in green
  fill(0, 128, 0);
  noStroke();
  text(yBText, labelX - 0.75, labelY + boxPadding - 0.5);
  
  // y subscript B
  textSize(2.5);
  fill(0, 128, 0);
  text("B", labelX + yBTextWidth/2 + 0.2, labelY + boxPadding + 1.5);
}

// Helper function to draw xB label consistently
function drawXBLabel(liquidX, plotY, plotH, plotX, plotW) {
  textSize(4.0);
  textAlign(CENTER, TOP);
  
  const xBText = "x";
  const xBTextWidth = textWidth(xBText);
  const boxHeight = 5;
  const boxWidth = boxHeight;
  const boxPadding = 0.5;
  
  // Ensure label stays within plot boundaries
  const labelX = Math.max(plotX + boxWidth/2, Math.min(plotX + plotW - boxWidth/2, liquidX));
  const labelY = Math.max(plotY + 2, Math.min(plotY + plotH - boxHeight - 2, plotY + plotH - 9));
  
  // White box with blue outline for x_B
  fill(255);
  stroke(0, 0, 255);
  strokeWeight(0.3);
  rect(labelX - boxWidth/2, labelY, 
       boxWidth, boxHeight);
  
  // x_B text in blue
  fill(0, 0, 255);
  noStroke();
  text(xBText, labelX - 0.75, labelY + boxPadding - 0.5);
  
  // x subscript B
  textSize(2.5);
  fill(0, 0, 255);
  text("B", labelX + xBTextWidth/2 + 0.2, labelY + boxPadding + 1.5);
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
  // T-x-y plot
  const leftMargin = options.leftMargin ?? 18;
  const topMargin = options.topMargin ?? 8;
  const rightMargin = options.rightMargin ?? 8;
  const bottomMargin = options.bottomMargin ?? 14;
  const tickLen = options.tickLen ?? 2;
  const tickCount = options.tickCount ?? 5; // 5 major ticks
  const yLabel = options.yLabel ?? "temperature (°C)";
  const xLabel = options.xLabel ?? "mole fraction benzene";
  const yTickLabel = options.yTickLabel ?? (i => {
    const temps = [75, 80, 90, 100, 110, 115];
    return temps[i].toString();
  }); // 75, 80, 90, 100, 110, 115
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

  // Draw T-x-y curves FIRST (behind axes and ticks)
  if (window.pxyData && window.pxyData.length > 0) {
    // Draw bubble point curve (Tx) - Blue
    stroke(0, 0, 255); // Blue
    strokeWeight(0.6); // Reduced thickness
    noFill();
    beginShape();
    for (let i = 0; i < window.pxyData.length; i++) {
      const point = window.pxyData[i];
      const x = plotX + (point.x * plotW);
      const y = plotY + plotH - ((point.Tx - 75) / (115 - 75) * plotH);
      // Ensure point is within plot bounds
      const boundedY = Math.max(plotY, Math.min(plotY + plotH, y));
      vertex(x, boundedY);
    }
    endShape();
    
    // Draw dew point curve (Ty) - Green
    stroke(0, 128, 0); // Dark Green
    strokeWeight(0.6); // Reduced thickness
    noFill();
    beginShape();
    for (let i = 0; i < window.pxyData.length; i++) {
      const point = window.pxyData[i];
      const x = plotX + (point.x * plotW);
      const y = plotY + plotH - ((point.Ty - 75) / (115 - 75) * plotH);
      // Ensure point is within plot bounds
      const boundedY = Math.max(plotY, Math.min(plotY + plotH, y));
      vertex(x, boundedY);
    }
    endShape();
  }

  // Draw tie-lines BEFORE axes (so they appear behind)
  if (window.currentState) {
    const state = window.currentState;
    const currentX = plotX + (state.moleFraction * plotW);
    const currentY = plotY + plotH - ((state.temperature - 75) / (115 - 75) * plotH);
    
    // Add tie-line visualization if in two-phase region
    if (window.pxyData && window.pxyData.length > 0) {
      // Use the calculated xB and yB values from current state
      const solLiq = state.xB;
      const solVap = state.yB;
      
      if (solLiq !== null && solVap !== null) {
        // Calculate positions for tie-line points
        const liquidX = plotX + (solLiq * plotW);
        const vaporX = plotX + (solVap * plotW);
        const tieLineY = plotY + plotH - ((state.temperature - 75) / (115 - 75) * plotH);
        const boundedTieLineY = Math.max(plotY, Math.min(plotY + plotH, tieLineY));
        
        // Find the temperature at current mole fraction for both curves
        let currentTx = null;
        let currentTy = null;
        
        // Find Tx and Ty at current mole fraction
        for (let i = 0; i < window.pxyData.length; i++) {
          const point = window.pxyData[i];
          if (Math.abs(point.x - state.moleFraction) < 0.01) {
            currentTx = point.Tx;
            currentTy = point.Ty;
            break;
          }
        }
        
        // If not found exactly, interpolate
        if (currentTx === null || currentTy === null) {
          for (let i = 0; i < window.pxyData.length - 1; i++) {
            const point1 = window.pxyData[i];
            const point2 = window.pxyData[i + 1];
            if (state.moleFraction >= point1.x && state.moleFraction <= point2.x) {
              const ratio = (state.moleFraction - point1.x) / (point2.x - point1.x);
              currentTx = point1.Tx + ratio * (point2.Tx - point1.Tx);
              currentTy = point1.Ty + ratio * (point2.Ty - point1.Ty);
              break;
            }
          }
        }
        
        // Draw dashed tie-lines based on current point position
        strokeWeight(0.4);
        strokeCap(SQUARE);
        
        if (currentTx !== null && currentTy !== null) {
          // If current point is under the blue curve (liquid), show only xB line
          if (state.temperature <= currentTx) {
            // Horizontal line from current point to liquid curve (green)
            stroke(0, 128, 0); // Green for liquid horizontal line
            drawHorizontalDashedLine(currentX, currentY, liquidX, boundedTieLineY, plotY, plotH);
            
            // Vertical line from liquid curve to x-axis (blue)
            stroke(0, 0, 255); // Blue for liquid vertical line
            drawVerticalDashedLine(liquidX, boundedTieLineY, plotY + plotH, plotX, plotW);
            
            // Store label position for drawing after axes
            window.xBLabelPosition = { x: liquidX, plotY: plotY, plotH: plotH, plotX: plotX, plotW: plotW };
          }
          // If current point is above the green curve (vapor), show only yB line
          else if (state.temperature >= currentTy) {
            // Horizontal line from current point to vapor curve (blue)
            stroke(0, 0, 255); // Blue for vapor horizontal line
            drawHorizontalDashedLine(currentX, currentY, vaporX, boundedTieLineY, plotY, plotH);
            
            // Vertical line from vapor curve to x-axis (green)
            stroke(0, 128, 0); // Green for vapor vertical line
            drawVerticalDashedLine(vaporX, boundedTieLineY, plotY + plotH, plotX, plotW);
            
            // Store label position for drawing after axes
            window.yBLabelPosition = { x: vaporX, plotY: plotY, plotH: plotH, plotX: plotX, plotW: plotW };
          }
          // If in two-phase region, show both lines
          else {
            // Horizontal line from current point to liquid curve (green)
            stroke(0, 128, 0); // Green for liquid horizontal line
            drawHorizontalDashedLine(currentX, currentY, liquidX, boundedTieLineY, plotY, plotH);
            
            // Vertical line from liquid curve to x-axis (blue)
            stroke(0, 0, 255); // Blue for liquid vertical line
            drawVerticalDashedLine(liquidX, boundedTieLineY, plotY + plotH, plotX, plotW);
            
            // Horizontal line from current point to vapor curve (blue)
            stroke(0, 0, 255); // Blue for vapor horizontal line
            drawHorizontalDashedLine(currentX, currentY, vaporX, boundedTieLineY, plotY, plotH);
            
            // Vertical line from vapor curve to x-axis (green)
            stroke(0, 128, 0); // Green for vapor vertical line
            drawVerticalDashedLine(vaporX, boundedTieLineY, plotY + plotH, plotX, plotW);
            
            // Store label positions for drawing after axes
            window.xBLabelPosition = { x: liquidX, plotY: plotY, plotH: plotH, plotX: plotX, plotW: plotW };
            window.yBLabelPosition = { x: vaporX, plotY: plotY, plotH: plotH, plotX: plotX, plotW: plotW };
          }
        }
        
        // Reset line style
        strokeCap(ROUND); // Reset to default
      }
    }
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
  
  // Y axis ticks (left and right) - 6 major ticks for temperature
  textAlign(RIGHT, CENTER);
  const tempTicks = [75, 80, 90, 100, 110, 115];
  for (let i = 0; i < tempTicks.length; i++) {
    const temp = tempTicks[i];
    const y = plotY + plotH - ((temp - 75) / (115 - 75) * plotH);
    // Left ticks and labels
    stroke(0);
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    // Don't show label for 75 or 115
    if (temp !== 75 && temp !== 115) {
      text(temp.toString(), plotX - 2, y);
    }
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
  
  // Minor ticks for Y-axis - adjust for temperature range
  stroke(0);
  strokeWeight(0.15);
  // Minor ticks between 75-80 (2 minor ticks at 76 and 78)
  const minorTicks75to80 = [76, 78];
  for (let temp of minorTicks75to80) {
    const y = plotY + plotH - ((temp - 75) / (115 - 75) * plotH);
    // Left minor ticks
    line(plotX, y, plotX + tickLen * 0.6, y);
    // Right minor ticks
    line(plotX + plotW, y, plotX + plotW - tickLen * 0.6, y);
  }
  // Minor ticks between other major ticks (80-90, 90-100, 100-110)
  const tempRanges = [[80, 90], [90, 100], [100, 110]];
  for (let range of tempRanges) {
    for (let j = 1; j <= 4; j++) {
      const temp = range[0] + (j * (range[1] - range[0]) / 5);
      const y = plotY + plotH - ((temp - 75) / (115 - 75) * plotH);
      // Left minor ticks
      line(plotX, y, plotX + tickLen * 0.6, y);
      // Right minor ticks
      line(plotX + plotW, y, plotX + plotW - tickLen * 0.6, y);
    }
  }
  // Minor ticks between 110-115 (2 minor ticks at 112 and 114)
  const minorTicks110to115 = [112, 114];
  for (let temp of minorTicks110to115) {
    const y = plotY + plotH - ((temp - 75) / (115 - 75) * plotH);
    // Left minor ticks
    line(plotX, y, plotX + tickLen * 0.6, y);
    // Right minor ticks
    line(plotX + plotW, y, plotX + plotW - tickLen * 0.6, y);
  }
  
  // Draw labels after axes (so they appear on top)
  if (window.xBLabelPosition) {
    drawXBLabel(window.xBLabelPosition.x, window.xBLabelPosition.plotY, window.xBLabelPosition.plotH, plotX, plotW);
    window.xBLabelPosition = null; // Clear for next frame
  }
  if (window.yBLabelPosition) {
    drawYBLabel(window.yBLabelPosition.x, window.yBLabelPosition.plotY, window.yBLabelPosition.plotH, plotX, plotW);
    window.yBLabelPosition = null; // Clear for next frame
  }
  
  // Add curve labels (after everything else)
  if (window.pxyData && window.pxyData.length > 0) {
    textSize(3.5);
    textAlign(CENTER, BOTTOM);
    fill(100); // Grey for liquid
    noStroke();
    text("liquid", plotX + plotW * 0.22, plotY + plotH * 0.75); // Moved down from 0.18
    
    textAlign(CENTER, TOP);
    fill(100); // Grey for vapor
    text("vapor", plotX + plotW * 0.76, plotY + plotH * 0.25); // Moved up from 0.75
  }
  
  // Draw current point if state is available (after axes and ticks)
  if (window.currentState) {
    const state = window.currentState;
    const currentX = plotX + (state.moleFraction * plotW);
    const currentY = plotY + plotH - ((state.temperature - 75) / (115 - 75) * plotH);
    
    // Draw current point
    fill(0);
    noStroke();
    ellipse(currentX, currentY, 2.0, 2.0); // Always visible, no bounding
    
    // Display x_B and y_B values if available
    if (state.xB !== null && state.yB !== null) {
      textSize(3.5);
      textAlign(LEFT, TOP);
      fill(0);
      noStroke();
      
      // Display x_B and y_B values on the same line with proper subscript
      const xBValue = state.xB.toFixed(2);
      const yBValue = state.yB.toFixed(2);
      
      // Start position
      let textX = plotX + 40;
      const textY = plotY + 5;
      
      // Draw "x"
      text("x", textX, textY);
      textX += textWidth("x");
      
      // Draw subscript "B"
      textSize(2.5);
      text("B", textX + 0.2, textY + 1.5);
      textX += textWidth("B") + 0.5;
      textSize(3.5);
      
      // Draw " = "
      text(" = ", textX, textY);
      textX += textWidth(" = ");
      
      // Draw x_B value
      text(xBValue, textX + 2, textY);
      textX += textWidth(xBValue);
      
      // Add spacing
      textX += 15;
      
      // Draw "y"
      text("y", textX, textY);
      textX += textWidth("y");
      
      // Draw subscript "B"
      textSize(2.5);
      text("B", textX + 0.2, textY + 1.5);
      textX += textWidth("B") + 0.5;
      textSize(3.5);
      
      // Draw " = "
      text(" = ", textX, textY);
      textX += textWidth(" = ");
      
      // Draw y_B value
      text(yBValue, textX + 2, textY);
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
  translate(plotX + yLabelXOffset, plotY + plotH / 2); // Use custom X offset
  rotate(-HALF_PI);
  text(yLabel, 0, 0);
  pop();
}

export function drawPlot2(options = {}) {
  // Fugacity versus T plot based on Mathematica code
  const leftMargin = options.leftMargin ?? 18;
  const topMargin = options.topMargin ?? 8;
  const rightMargin = options.rightMargin ?? 8;
  const bottomMargin = options.bottomMargin ?? 14;
  const tickLen = options.tickLen ?? 2;
  const yLabel = options.yLabel ?? "fugacity (bar)";
  const xLabel = options.xLabel ?? "temperature (°C)";
  const axisLabelSize = options.axisLabelSize ?? 3.5;
  const tickLabelSize = options.tickLabelSize ?? 3.0;
  const yLabelOffset = options.yLabelOffset ?? -4;
  const xLabelOffset = options.xLabelOffset ?? 10;
  const yLabelXOffset = options.yLabelXOffset ?? -10;
  const isBothPlots = options.isBothPlots ?? false;

  const plotX = window.contentArea.x + leftMargin;
  const plotY = window.contentArea.y + topMargin;
  const plotW = window.contentArea.width - leftMargin - rightMargin;
  const plotH = window.contentArea.height - topMargin - bottomMargin;

  // Draw fugacity curves FIRST (behind axes and ticks)
  if (window.fugacityCurvesData && window.fugacityCurvesData.length > 0) {
    // Draw benzene fugacity curve (Purple) - solid line
    stroke(128, 0, 128); // Purple
    strokeWeight(0.6);
    noFill();
    
    // Draw solid curve using simple line segments (like Mathematica's linear interpolation)
    beginShape();
    for (let i = 0; i < window.fugacityCurvesData.length; i++) {
      const point = window.fugacityCurvesData[i];
      const x = plotX + ((point.T - 75) / (115 - 75)) * plotW;
      const y = plotY + plotH - (point.fB / 1.0) * plotH;
      const boundedY = Math.max(plotY, Math.min(plotY + plotH, y));
      vertex(x, boundedY);
    }
    endShape();
    
    // Draw toluene fugacity curve (Purple, dashed) - dashed line
    stroke(128, 0, 128); // Purple
    strokeWeight(0.6);
    noFill();
    
    // Create points array for dashed curve
    const toluenePoints = [];
    for (let i = 0; i < window.fugacityCurvesData.length; i++) {
      const point = window.fugacityCurvesData[i];
      const x = plotX + ((point.T - 75) / (115 - 75)) * plotW;
      const y = plotY + plotH - (point.fT / 1.0) * plotH;
      const boundedY = Math.max(plotY, Math.min(plotY + plotH, y));
      toluenePoints.push({ x, y: boundedY });
    }
    
    // Draw dashed curve using simple line segments
    drawConsistentDashedCurve(toluenePoints, 0.75, 1.5);
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
  
  // Y axis ticks (left and right) - fugacity ticks
  textAlign(RIGHT, CENTER);
  const fugacityTicks = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
  for (let i = 0; i < fugacityTicks.length; i++) {
    const fugacity = fugacityTicks[i];
    const y = plotY + plotH - (fugacity / 1.0) * plotH;
    // Left ticks and labels
    stroke(0);
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    text(fugacity.toFixed(1), plotX - 2, y);
    // Right ticks only
    stroke(0);
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  
  // X axis ticks (bottom and top) - temperature ticks
  textAlign(CENTER, TOP);
  const tempTicks = [75, 80, 90, 100, 110, 115];
  for (let i = 0; i < tempTicks.length; i++) {
    const temp = tempTicks[i];
    const x = plotX + ((temp - 75) / (115 - 75)) * plotW;
    // Bottom ticks and labels
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY + plotH, x, plotY + plotH - tickLen);
    noStroke();
    // Don't show label for 75 or 115
    if (temp !== 75 && temp !== 115) {
      text(temp.toString(), x, plotY + plotH + 2);
    }
    // Top ticks only
    stroke(0);
    strokeWeight(0.25);
    line(x, plotY, x, plotY + tickLen);
    noStroke();
  }
  
  // Minor ticks for X-axis - temperature minor ticks
  stroke(0);
  strokeWeight(0.15);
  // Minor ticks between 75-80 (2 minor ticks at 76 and 78)
  const minorTicks75to80 = [76, 78];
  for (let temp of minorTicks75to80) {
    const x = plotX + ((temp - 75) / (115 - 75)) * plotW;
    // Bottom minor ticks
    line(x, plotY + plotH, x, plotY + plotH - tickLen * 0.6);
    // Top minor ticks
    line(x, plotY, x, plotY + tickLen * 0.6);
  }
  // Minor ticks between other major ticks (80-90, 90-100, 100-110)
  const tempRanges = [[80, 90], [90, 100], [100, 110]];
  for (let range of tempRanges) {
    for (let j = 1; j <= 4; j++) {
      const temp = range[0] + (j * (range[1] - range[0]) / 5);
      const x = plotX + ((temp - 75) / (115 - 75)) * plotW;
      // Bottom minor ticks
      line(x, plotY + plotH, x, plotY + plotH - tickLen * 0.6);
      // Top minor ticks
      line(x, plotY, x, plotY + tickLen * 0.6);
    }
  }
  // Minor ticks between 110-115 (2 minor ticks at 112 and 114)
  const minorTicks110to115 = [112, 114];
  for (let temp of minorTicks110to115) {
    const x = plotX + ((temp - 75) / (115 - 75)) * plotW;
    // Bottom minor ticks
    line(x, plotY + plotH, x, plotY + plotH - tickLen * 0.6);
    // Top minor ticks
    line(x, plotY, x, plotY + tickLen * 0.6);
  }
  
  // Minor ticks for Y-axis (3 minor ticks between each major tick)
  for (let i = 0; i < fugacityTicks.length - 1; i++) {
    for (let j = 1; j <= 3; j++) {
      const fugacity = fugacityTicks[i] + (j * (fugacityTicks[i + 1] - fugacityTicks[i]) / 4);
      const y = plotY + plotH - (fugacity / 1.0) * plotH;
      // Left minor ticks
      line(plotX, y, plotX + tickLen * 0.6, y);
      // Right minor ticks
      line(plotX + plotW, y, plotX + plotW - tickLen * 0.6, y);
    }
  }
  
  // Draw current points and labels if state is available (after axes and ticks)
  if (window.currentState) {
    const state = window.currentState;
    const currentX = plotX + ((state.temperature - 75) / (115 - 75)) * plotW;
    const currentYB = plotY + plotH - (state.fB / 1.0) * plotH;
    const currentYT = plotY + plotH - (state.fT / 1.0) * plotH;
    
    // Ensure current points are within plot bounds
    const boundedCurrentYB = Math.max(plotY, Math.min(plotY + plotH, currentYB));
    const boundedCurrentYT = Math.max(plotY, Math.min(plotY + plotH, currentYT));
    
    // Draw current points
    fill(0);
    noStroke();
    ellipse(currentX, currentYB, 2.0, 2.0); // Benzene point - use exact position
    ellipse(currentX, currentYT, 2.0, 2.0); // Toluene point - use exact position
    
    // Add f_B and f_T labels near the current points
    textSize(3.5);
    textAlign(CENTER, CENTER);
    
    // Determine label positions to avoid overlap (smaller offsets like Plot 1)
    let fBLabelY, fTLabelY;
    if (state.fB >= state.fT && state.moleFraction < 0.7) {
      fBLabelY = boundedCurrentYB - 6;
      fTLabelY = boundedCurrentYT + 6;
    } else {
      fBLabelY = boundedCurrentYB + 6;
      fTLabelY = boundedCurrentYT - 6;
    }
    
    // Determine label X offset based on temperature (smaller offsets)
    let labelXOffset = 0;
    if (state.temperature <= 76) {
      labelXOffset = 0.5; // Small right offset when near left edge
    } else if (state.temperature > 114) {
      labelXOffset = -0.5; // Small left offset when near right edge
    }
    
    // Calculate text dimensions for boundary checking
    const fBText = "f_B";
    const fTText = "f_T";
    const fBTextW = textWidth(fBText);
    const fTTextW = textWidth(fTText);
    const textHeight = 4;
    const padding = 0.5;
    const totalFBTWidth = fBTextW + 2*padding;
    const totalFTWidth = fTTextW + 2*padding;
    
    // Draw f_B label with boundary clipping (smaller offsets)
    let fBTextX = currentX + (labelXOffset * 8); // Reduced from 15 to 8
    
    // Ensure f_B label stays within plot boundaries (with smaller adjustments)
    if (fBTextX - totalFBTWidth/2 < plotX) {
      fBTextX = plotX + totalFBTWidth/2 + 1; // Smaller adjustment
    } else if (fBTextX + totalFBTWidth/2 > plotX + plotW) {
      fBTextX = plotX + plotW - totalFBTWidth/2 - 1; // Smaller adjustment
    }
    
    // Ensure f_B label Y position stays within plot boundaries
    let boundedFBY = Math.max(plotY + textHeight/2 + padding, Math.min(plotY + plotH - textHeight/2 - padding, fBLabelY));
    
    // White background for f_B label
    fill(255);
    noStroke();
    rect(fBTextX - totalFBTWidth/2, boundedFBY - textHeight/2 - padding, 
         totalFBTWidth, textHeight + 2*padding);
    
    // f_B text
    fill(0);
    noStroke();
    textSize(4.0); // Increased from 3.5
    textStyle(ITALIC); // Make f italic
    text("f", fBTextX - 1, boundedFBY);
    textStyle(NORMAL); // Reset to normal
    textSize(2.5);
    text("B", fBTextX + 1, boundedFBY + 1);
    textSize(3.5);
    
    // Draw f_T label with boundary clipping (smaller offsets)
    let fTTextX = currentX + (labelXOffset * 8); // Reduced from 15 to 8
    
    // Ensure f_T label stays within plot boundaries (with smaller adjustments)
    if (fTTextX - totalFTWidth/2 < plotX) {
      fTTextX = plotX + totalFTWidth/2 + 1; // Smaller adjustment
    } else if (fTTextX + totalFTWidth/2 > plotX + plotW) {
      fTTextX = plotX + plotW - totalFTWidth/2 - 1; // Smaller adjustment
    }
    
    // Ensure f_T label Y position stays within plot boundaries
    let boundedFTY = Math.max(plotY + textHeight/2 + padding, Math.min(plotY + plotH - textHeight/2 - padding, fTLabelY));
    
    // White background for f_T label
    fill(255);
    noStroke();
    rect(fTTextX - totalFTWidth/2, boundedFTY - textHeight/2 - padding, 
         totalFTWidth, textHeight + 2*padding);
    
    // f_T text
    fill(0);
    noStroke();
    textSize(4.0); // Increased from 3.5
    textStyle(ITALIC); // Make f italic
    text("f", fTTextX - 1, boundedFTY);
    textStyle(NORMAL); // Reset to normal
    textSize(2.5);
    text("T", fTTextX + 1, boundedFTY + 1);
    textSize(3.5);
  }
  
  // Axis labels
  textStyle(NORMAL);
  textFont();
  noStroke();
  textSize(axisLabelSize);
  fill(0);
  textAlign(CENTER, BOTTOM);
  text(xLabel, plotX + plotW / 2, plotY + plotH + xLabelOffset);
  textAlign(CENTER, CENTER);
  push();
  translate(plotX + yLabelXOffset, plotY + plotH / 2);
  rotate(-HALF_PI);
  text(yLabel, 0, 0);
  pop();
} 

export function drawBothPlots(options = {}) {
  // Both plots stacked vertically with purple frame
  const leftMargin = options.leftMargin ?? 18;
  const topMargin = options.topMargin ?? 8;
  const rightMargin = options.rightMargin ?? 8;
  const bottomMargin = options.bottomMargin ?? 14;
  const tickLen = options.tickLen ?? 2;

  const plotX = window.contentArea.x + leftMargin;
  const plotY = window.contentArea.y + topMargin;
  const plotW = window.contentArea.width - leftMargin - rightMargin;
  const plotH = window.contentArea.height - topMargin - bottomMargin;

  // Split the plot area into top and bottom sections
  const topPlotH = plotH * 0.5;
  const bottomPlotH = plotH * 0.5;
  const topPlotY = plotY;
  const bottomPlotY = plotY + topPlotH;

  // Draw purple frame around top plot (fugacity vs temperature)
  stroke(128, 0, 128); // Purple
  strokeWeight(0.4);
  noFill();
  rect(plotX, topPlotY, plotW, topPlotH);

  // Draw black frame around bottom plot (temperature vs mole fraction)
  stroke(0); // Black
  strokeWeight(0.4);
  noFill();
  rect(plotX, bottomPlotY, plotW, bottomPlotH);

  // === TOP PLOT: Fugacity vs Temperature ===
  
  // Draw fugacity curves for top plot
  if (window.fugacityCurvesData && window.fugacityCurvesData.length > 0) {
    // Draw benzene fugacity curve (Purple) - solid line
    stroke(128, 0, 128); // Purple
    strokeWeight(0.6);
    noFill();
    
    beginShape();
    for (let i = 0; i < window.fugacityCurvesData.length; i++) {
      const point = window.fugacityCurvesData[i];
      const x = plotX + ((point.T - 75) / (115 - 75)) * plotW;
      const y = topPlotY + topPlotH - (point.fB / 1.0) * topPlotH;
      const boundedY = Math.max(topPlotY, Math.min(topPlotY + topPlotH, y));
      vertex(x, boundedY);
    }
    endShape();
    
    // Draw toluene fugacity curve (Purple, dashed) - dashed line
    stroke(128, 0, 128); // Purple
    strokeWeight(0.6);
    noFill();
    
    const toluenePoints = [];
    for (let i = 0; i < window.fugacityCurvesData.length; i++) {
      const point = window.fugacityCurvesData[i];
      const x = plotX + ((point.T - 75) / (115 - 75)) * plotW;
      const y = topPlotY + topPlotH - (point.fT / 1.0) * topPlotH;
      const boundedY = Math.max(topPlotY, Math.min(topPlotY + topPlotH, y));
      toluenePoints.push({ x, y: boundedY });
    }
    
    drawConsistentDashedCurve(toluenePoints, 0.75, 1.5);
  }

  // === BOTTOM PLOT: Temperature vs Mole Fraction ===
  
  // Draw T-x-y curves for bottom plot
  if (window.pxyData && window.pxyData.length > 0) {
    // Draw bubble point curve (Tx) - Blue
    stroke(0, 0, 255); // Blue
    strokeWeight(0.6);
    noFill();
    beginShape();
    for (let i = 0; i < window.pxyData.length; i++) {
      const point = window.pxyData[i];
      const x = plotX + (point.x * plotW);
      const y = bottomPlotY + bottomPlotH - ((point.Tx - 75) / (115 - 75) * bottomPlotH);
      const boundedY = Math.max(bottomPlotY, Math.min(bottomPlotY + bottomPlotH, y));
      vertex(x, boundedY);
    }
    endShape();
    
    // Draw dew point curve (Ty) - Green
    stroke(0, 128, 0); // Dark Green
    strokeWeight(0.6);
    noFill();
    beginShape();
    for (let i = 0; i < window.pxyData.length; i++) {
      const point = window.pxyData[i];
      const x = plotX + (point.x * plotW);
      const y = bottomPlotY + bottomPlotH - ((point.Ty - 75) / (115 - 75) * bottomPlotH);
      const boundedY = Math.max(bottomPlotY, Math.min(bottomPlotY + bottomPlotH, y));
      vertex(x, boundedY);
    }
    endShape();
  }

  // Draw current point and tie-line for bottom plot
  if (window.currentState) {
    const state = window.currentState;
    const currentX = plotX + (state.moleFraction * plotW);
    const currentY = bottomPlotY + bottomPlotH - ((state.temperature - 75) / (115 - 75) * bottomPlotH);
    
    // Add tie-line visualization if in two-phase region
    if (window.pxyData && window.pxyData.length > 0) {
      // Use the calculated xB and yB values from current state
      const solLiq = state.xB;
      const solVap = state.yB;
      
      if (solLiq !== null && solVap !== null) {
        // Calculate positions for tie-line points
        const liquidX = plotX + (solLiq * plotW);
        const vaporX = plotX + (solVap * plotW);
        const tieLineY = bottomPlotY + bottomPlotH - ((state.temperature - 75) / (115 - 75) * bottomPlotH);
        const boundedTieLineY = Math.max(bottomPlotY, Math.min(bottomPlotY + bottomPlotH, tieLineY));
        
        // Find the temperature at current mole fraction for both curves
        let currentTx = null;
        let currentTy = null;
        
        // Find Tx and Ty at current mole fraction
        for (let i = 0; i < window.pxyData.length; i++) {
          const point = window.pxyData[i];
          if (Math.abs(point.x - state.moleFraction) < 0.01) {
            currentTx = point.Tx;
            currentTy = point.Ty;
            break;
          }
        }
        
        // If not found exactly, interpolate
        if (currentTx === null || currentTy === null) {
          for (let i = 0; i < window.pxyData.length - 1; i++) {
            const point1 = window.pxyData[i];
            const point2 = window.pxyData[i + 1];
            if (state.moleFraction >= point1.x && state.moleFraction <= point2.x) {
              const ratio = (state.moleFraction - point1.x) / (point2.x - point1.x);
              currentTx = point1.Tx + ratio * (point2.Tx - point1.Tx);
              currentTy = point1.Ty + ratio * (point2.Ty - point1.Ty);
              break;
            }
          }
        }
        
        // Draw dashed tie-lines based on current point position
        strokeWeight(0.4);
        strokeCap(SQUARE);
        
        if (currentTx !== null && currentTy !== null) {
          // If current point is under the blue curve (liquid), show only xB line
          if (state.temperature <= currentTx) {
            // Horizontal line from current point to liquid curve (green)
            stroke(0, 128, 0); // Green for liquid horizontal line
            drawHorizontalDashedLine(currentX, currentY, liquidX, boundedTieLineY, bottomPlotY, bottomPlotH);
            
            // Vertical line from liquid curve to x-axis (blue)
            stroke(0, 0, 255); // Blue for liquid vertical line
            drawVerticalDashedLine(liquidX, boundedTieLineY, bottomPlotY + bottomPlotH, plotX, plotW);
            
            // Store label position for drawing after axes
            window.xBLabelPosition = { x: liquidX, plotY: bottomPlotY, plotH: bottomPlotH, plotX: plotX, plotW: plotW };
          }
          // If current point is above the green curve (vapor), show only yB line
          else if (state.temperature >= currentTy) {
            // Horizontal line from current point to vapor curve (blue)
            stroke(0, 0, 255); // Blue for vapor horizontal line
            drawHorizontalDashedLine(currentX, currentY, vaporX, boundedTieLineY, bottomPlotY, bottomPlotH);
            
            // Vertical line from vapor curve to x-axis (green)
            stroke(0, 128, 0); // Green for vapor vertical line
            drawVerticalDashedLine(vaporX, boundedTieLineY, bottomPlotY + bottomPlotH, plotX, plotW);
            
            // Store label position for drawing after axes
            window.yBLabelPosition = { x: vaporX, plotY: bottomPlotY, plotH: bottomPlotH, plotX: plotX, plotW: plotW };
          }
          // If in two-phase region, show both lines
          else {
            // Horizontal line from current point to liquid curve (green)
            stroke(0, 128, 0); // Green for liquid horizontal line
            drawHorizontalDashedLine(currentX, currentY, liquidX, boundedTieLineY, bottomPlotY, bottomPlotH);
            
            // Vertical line from liquid curve to x-axis (blue)
            stroke(0, 0, 255); // Blue for liquid vertical line
            drawVerticalDashedLine(liquidX, boundedTieLineY, bottomPlotY + bottomPlotH, plotX, plotW);
            
            // Horizontal line from current point to vapor curve (blue)
            stroke(0, 0, 255); // Blue for vapor horizontal line
            drawHorizontalDashedLine(currentX, currentY, vaporX, boundedTieLineY, bottomPlotY, bottomPlotH);
            
            // Vertical line from vapor curve to x-axis (green)
            stroke(0, 128, 0); // Green for vapor vertical line
            drawVerticalDashedLine(vaporX, boundedTieLineY, bottomPlotY + bottomPlotH, plotX, plotW);
            
            // Store label positions for drawing after axes
            window.xBLabelPosition = { x: liquidX, plotY: bottomPlotY, plotH: bottomPlotH, plotX: plotX, plotW: plotW };
            window.yBLabelPosition = { x: vaporX, plotY: bottomPlotY, plotH: bottomPlotH, plotX: plotX, plotW: plotW };
          }
        }
        
        // Reset line style
        strokeCap(ROUND); // Reset to default
      }
    }
    
    // Draw current point AFTER tie-lines so it appears on top
    fill(0);
    noStroke();
    ellipse(currentX, currentY, 2.0, 2.0);
  }

  // === MINIMAL AXES AND LABELS ===
  
  // Draw axes for BOTTOM PLOT (black) FIRST
  stroke(0); // Black
  strokeWeight(0.4);
  // Bottom plot x-axis line
  line(plotX, bottomPlotY + bottomPlotH, plotX + plotW, bottomPlotY + bottomPlotH);
  // Bottom plot y-axis line
  line(plotX, bottomPlotY, plotX, bottomPlotY + bottomPlotH);
  // Bottom plot right edge
  line(plotX + plotW, bottomPlotY, plotX + plotW, bottomPlotY + bottomPlotH);
  // Bottom plot top edge
  line(plotX, bottomPlotY, plotX + plotW, bottomPlotY);
  
  // Draw axes for TOP PLOT (purple) LAST to ensure they appear on top
  stroke(128, 0, 128); // Purple
  strokeWeight(0.4);
  // Top plot x-axis line
  line(plotX, topPlotY + topPlotH, plotX + plotW, topPlotY + topPlotH);
  // Top plot y-axis line
  line(plotX, topPlotY, plotX, topPlotY + topPlotH);
  // Top plot right edge
  line(plotX + plotW, topPlotY, plotX + plotW, topPlotY + topPlotH);
  // Top plot top edge
  line(plotX, topPlotY, plotX + plotW, topPlotY);
  
  // X-axis ticks for TOP PLOT (temperature) - purple
  stroke(128, 0, 128); // Purple
  strokeWeight(0.25);
  textSize(3.0);
  fill(128, 0, 128); // Purple text
  noStroke();
  textAlign(CENTER, TOP);
  
  const tempTicks = [80, 90, 100, 110];
  for (let temp of tempTicks) {
    const x = plotX + ((temp - 75) / (115 - 75)) * plotW;
    // Top plot ticks (bottom of top plot)
    stroke(128, 0, 128); // Purple
    strokeWeight(0.25);
    line(x, topPlotY + topPlotH, x, topPlotY + topPlotH - tickLen);
    noStroke();
    fill(128, 0, 128); // Purple text
    text(temp.toString(), x, topPlotY + topPlotH + 2);
    // Top plot ticks (top of top plot)
    stroke(128, 0, 128); // Purple
    strokeWeight(0.25);
    line(x, topPlotY, x, topPlotY + tickLen);
    noStroke();
  }
  
  // X-axis ticks for BOTTOM PLOT (mole fraction) - black
  stroke(0); // Black
  strokeWeight(0.25);
  fill(0); // Black text
  noStroke();
  textAlign(CENTER, TOP);
  
  const moleFracTicks = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
  for (let frac of moleFracTicks) {
    const x = plotX + (frac * plotW);
    // Bottom plot ticks (bottom of bottom plot)
    stroke(0); // Black
    strokeWeight(0.25);
    line(x, bottomPlotY + bottomPlotH, x, bottomPlotY + bottomPlotH - tickLen);
    noStroke();
    fill(0); // Black text
    text(frac.toFixed(1), x, bottomPlotY + bottomPlotH + 2);
  }
  
  // Y-axis ticks for top plot (fugacity) - purple
  textAlign(RIGHT, CENTER);
  const fugacityTicks = [0.2, 0.4, 0.6, 0.8, 1.0];
  for (let fugacity of fugacityTicks) {
    const y = topPlotY + topPlotH - (fugacity / 1.0) * topPlotH;
    // Left ticks
    stroke(128, 0, 128); // Purple
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    fill(128, 0, 128); // Purple text
    text(fugacity.toFixed(1), plotX - 2, y);
    // Right ticks
    stroke(128, 0, 128); // Purple
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  
  // Y-axis ticks for bottom plot (temperature) - black
  stroke(0); // Black
  strokeWeight(0.25);
  fill(0); // Black text
  noStroke();
  
  const bottomTempTicks = [80, 90, 100, 110];
  for (let temp of bottomTempTicks) {
    const y = bottomPlotY + bottomPlotH - ((temp - 75) / (115 - 75) * bottomPlotH);
    // Left ticks
    stroke(0); // Black
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    fill(0); // Black text
    text(temp.toString(), plotX - 2, y);
    // Right ticks
    stroke(0); // Black
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  
  // === MINOR TICKS ===
  
  // Minor ticks for TOP PLOT X-axis (temperature) - purple
  stroke(128, 0, 128); // Purple
  strokeWeight(0.25);
  noStroke();
  textAlign(CENTER, TOP);
  
  // Add minor ticks between 80-90, 90-100, 100-110
  const topMinorTempTicks = [85, 95, 105];
  for (let temp of topMinorTempTicks) {
    const x = plotX + ((temp - 75) / (115 - 75)) * plotW;
    // Top plot minor ticks (bottom of top plot)
    stroke(128, 0, 128); // Purple
    strokeWeight(0.25);
    line(x, topPlotY + topPlotH, x, topPlotY + topPlotH - tickLen);
    noStroke();
    // Top plot minor ticks (top of top plot)
    stroke(128, 0, 128); // Purple
    strokeWeight(0.25);
    line(x, topPlotY, x, topPlotY + tickLen);
    noStroke();
  }
  
  // Minor ticks for BOTTOM PLOT X-axis (mole fraction) - black
  stroke(0); // Black
  strokeWeight(0.25);
  noStroke();
  textAlign(CENTER, TOP);
  
  // Add minor ticks between 0.0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1.0
  const bottomMinorMoleFracTicks = [0.1, 0.3, 0.5, 0.7, 0.9];
  for (let frac of bottomMinorMoleFracTicks) {
    const x = plotX + (frac * plotW);
    // Bottom plot minor ticks (bottom of bottom plot)
    stroke(0); // Black
    strokeWeight(0.25);
    line(x, bottomPlotY + bottomPlotH, x, bottomPlotY + bottomPlotH - tickLen);
    noStroke();
  }
  
  // Minor ticks for TOP PLOT Y-axis (fugacity) - purple
  stroke(128, 0, 128); // Purple
  strokeWeight(0.25);
  noStroke();
  textAlign(RIGHT, CENTER);
  
  // Add minor ticks between 0.0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1.0
  const topMinorFugacityTicks = [0.1, 0.3, 0.5, 0.7, 0.9];
  for (let fugacity of topMinorFugacityTicks) {
    const y = topPlotY + topPlotH - (fugacity / 1.0) * topPlotH;
    // Left minor ticks
    stroke(128, 0, 128); // Purple
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    // Right minor ticks
    stroke(128, 0, 128); // Purple
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  
  // Minor ticks for BOTTOM PLOT Y-axis (temperature) - black
  stroke(0); // Black
  strokeWeight(0.25);
  noStroke();
  textAlign(RIGHT, CENTER);
  
  // Add minor ticks between 80-90, 90-100, 100-110
  const bottomMinorTempTicks = [85, 95, 105];
  for (let temp of bottomMinorTempTicks) {
    const y = bottomPlotY + bottomPlotH - ((temp - 75) / (115 - 75) * bottomPlotH);
    // Left minor ticks
    stroke(0); // Black
    strokeWeight(0.25);
    line(plotX, y, plotX + tickLen, y);
    noStroke();
    // Right minor ticks
    stroke(0); // Black
    strokeWeight(0.25);
    line(plotX + plotW, y, plotX + plotW - tickLen, y);
    noStroke();
  }
  
  // === AXIS LABELS ===
  textStyle(NORMAL);
  textSize(3.5);
  noStroke();
  
  // X-axis labels
  textAlign(CENTER, BOTTOM);
  fill(128, 0, 128); // Purple text for top plot
  text("temperature (°C)", plotX + plotW / 2, topPlotY + topPlotH + 8); // Top plot x-axis - moved down
  fill(0); // Black text for bottom plot
  text("mole fraction benzene", plotX + plotW / 2, bottomPlotY + bottomPlotH + 10); // Bottom plot x-axis - moved down
  
  // Y-axis labels
  textAlign(CENTER, CENTER);
  push();
  translate(plotX - 10, topPlotY + topPlotH / 2); // Moved left from -8 to -12
  rotate(-HALF_PI);
  fill(128, 0, 128); // Purple text for top plot
  text("fugacity (bar)", 0, 0);
  pop();
  
  push();
  translate(plotX - 10, bottomPlotY + bottomPlotH / 2); // Moved left from -8 to -12
  rotate(-HALF_PI);
  fill(0); // Black text for bottom plot
  text("temperature (°C)", 0, 0);
  pop();
  
  // === REGION LABELS ===
  textSize(3.0);
  fill(100); // Grey
  noStroke();
  textAlign(CENTER, CENTER);
  text("liquid", plotX + plotW * 0.2, bottomPlotY + bottomPlotH * 0.8);
  text("vapor", plotX + plotW * 0.8, bottomPlotY + bottomPlotH * 0.2);
  
  // === TOP PLOT CURRENT POINTS (moved to end) ===
  if (window.currentState) {
    const state = window.currentState;
    const currentX = plotX + ((state.temperature - 75) / (115 - 75)) * plotW;
    const currentYB = topPlotY + topPlotH - (state.fB / 1.0) * topPlotH;
    const currentYT = topPlotY + topPlotH - (state.fT / 1.0) * topPlotH;
    
    // Draw current points
    fill(0);
    noStroke();
    ellipse(currentX, currentYB, 2.0, 2.0);
    ellipse(currentX, currentYT, 2.0, 2.0);
    
    // Add f_B and f_T labels
    textSize(3.5);
    textAlign(CENTER, CENTER);
    
    // Determine label positions
    let fBLabelY, fTLabelY;
    if (state.fB >= state.fT && state.moleFraction < 0.7) {
      fBLabelY = currentYB - 6;
      fTLabelY = currentYT + 6;
    } else {
      fBLabelY = currentYB + 6;
      fTLabelY = currentYT - 6;
    }
    
    // Determine label X offset based on temperature (smaller offsets)
    let labelXOffset = 0;
    if (state.temperature <= 76) {
      labelXOffset = 0.5; // Small right offset when near left edge
    } else if (state.temperature > 114) {
      labelXOffset = -0.5; // Small left offset when near right edge
    }
    
    // Calculate text dimensions for boundary checking
    const fBText = "f_B";
    const fBTextW = textWidth(fBText);
    const fTText = "f_T";
    const fTTextW = textWidth(fTText);
    const textHeight = 4;
    const padding = 0.5;
    const totalFBTWidth = fBTextW + 2*padding;
    const totalFTWidth = fTTextW + 2*padding;
    
    // Draw f_B label with boundary clipping (smaller offsets)
    let fBTextX = currentX + (labelXOffset * 8); // Reduced from 15 to 8
    
    // Ensure f_B label stays within plot boundaries (with smaller adjustments)
    if (fBTextX - totalFBTWidth/2 < plotX) {
      fBTextX = plotX + totalFBTWidth/2 + 1; // Smaller adjustment
    } else if (fBTextX + totalFBTWidth/2 > plotX + plotW) {
      fBTextX = plotX + plotW - totalFBTWidth/2 - 1; // Smaller adjustment
    }
    
    // Ensure f_B label Y position stays within plot boundaries
    let boundedFBY = Math.max(topPlotY + textHeight/2 + padding, Math.min(topPlotY + topPlotH - textHeight/2 - padding, fBLabelY));
    
    // White background for f_B label
    fill(255);
    noStroke();
    rect(fBTextX - totalFBTWidth/2, boundedFBY - textHeight/2 - padding, 
         totalFBTWidth, textHeight + 2*padding);
    
    // f_B text
    fill(0);
    noStroke();
    textSize(4.0); // Increased from 3.5
    textStyle(ITALIC); // Make f italic
    text("f", fBTextX - 1, boundedFBY);
    textStyle(NORMAL); // Reset to normal
    textSize(2.5);
    text("B", fBTextX + 1, boundedFBY + 1);
    textSize(3.5);
    
    // Draw f_T label with boundary clipping (smaller offsets)
    let fTTextX = currentX + (labelXOffset * 8); // Reduced from 15 to 8
    
    // Ensure f_T label stays within plot boundaries (with smaller adjustments)
    if (fTTextX - totalFTWidth/2 < plotX) {
      fTTextX = plotX + totalFTWidth/2 + 1; // Smaller adjustment
    } else if (fTTextX + totalFTWidth/2 > plotX + plotW) {
      fTTextX = plotX + plotW - totalFTWidth/2 - 1; // Smaller adjustment
    }
    
    // Ensure f_T label Y position stays within plot boundaries
    let boundedFTY = Math.max(topPlotY + textHeight/2 + padding, Math.min(topPlotY + topPlotH - textHeight/2 - padding, fTLabelY));
    
    // White background for f_T label
    fill(255);
    noStroke();
    rect(fTTextX - totalFTWidth/2, boundedFTY - textHeight/2 - padding, 
         totalFTWidth, textHeight + 2*padding);
    
    // f_T text
    fill(0);
    noStroke();
    textSize(4.0); // Increased from 3.5
    textStyle(ITALIC); // Make f italic
    text("f", fTTextX - 1, boundedFTY);
    textStyle(NORMAL); // Reset to normal
    textSize(2.5);
    text("T", fTTextX + 1, boundedFTY + 1);
    textSize(3.5);
  }
  
  // === BOTTOM PLOT TIE-LINE LABELS (drawn last to appear on top) ===
  // Draw labels after everything else (so they appear on top)
  if (window.xBLabelPosition) {
    drawXBLabel(window.xBLabelPosition.x, window.xBLabelPosition.plotY, window.xBLabelPosition.plotH, plotX, plotW);
    window.xBLabelPosition = null; // Clear for next frame
  }
  if (window.yBLabelPosition) {
    drawYBLabel(window.yBLabelPosition.x, window.yBLabelPosition.plotY, window.yBLabelPosition.plotH, plotX, plotW);
    window.yBLabelPosition = null; // Clear for next frame
  }
} 