import * as config from '../js/config.js';
import { solveThreeTanks } from '../js/flowSolver.js';  

const maxHeight = config.canvasHeight - 160  - 50;
const startX = config.canvasWidth / 2 - 100;
const startY = config.canvasHeight - 160 - maxHeight / 2 + 40;
let tankA = null;
let tankB = null;
let tankC = null;
let textB = null;
let pipeBElement = null;
let pipeGroup = null;
const elevationSlider = document.getElementById('elevationSlider');
// const lengthSlider = document.getElementById('lengthSlider');
let currenrtTankBHeight = elevationSlider.value;
let markerGroup = null;
let tankBDashedLine = null;
let tankBElevation = null;
let pipeBLength = Math.abs(currenrtTankBHeight - 50) / Math.sin(Math.PI / 3);
// console.log('pipeBLength', Math.asin(60));

let tankBX = startX + (startX - 165) * currenrtTankBHeight / 100 - 15;
let tankBY = startY + (maxHeight * (- currenrtTankBHeight + 50) / 100) - 40;

export function drawFigure(draw) {
  drawTank(draw);
  drawPipes(draw);
  adjustFigureWithEleveationSlider(draw);
  drawText(draw, '(40, 50)', startX, startY + 12, 14);
}


function drawTank(draw) {
  tankA = addSVGImage(draw, 'assets/tankA.svg', 0, 50, 175, 160);
  // drawDashedHorizontalLine(draw, 175, 80, 100, 'black', 1, '5,5');
  // drawText(draw, 'elevation = 100 ft', 175, 60, 14);
  drawText(draw, 'A', 85, 50, 20);
  // const x = startX + (startX - 165) * currenrtTankBHeight / 100 - 15
  // const y = startY + (maxHeight * (- currenrtTankBHeight + 50) / 100) - 40;
  tankB = addSVGImage(draw, 'assets/tankA.svg', tankBX, tankBY , 175, 160);
  textB = drawText(draw, 'B', tankBX + 85, tankBY, 20);
  tankBDashedLine = drawDashedHorizontalLine(draw, tankBX + 175, tankBY + 30, config.canvasWidth - tankBX + 175, 'black', 1, '5,5');
  tankBElevation = drawDashedLineWithArrows(draw, config.canvasWidth - 40, config.canvasHeight - 130 - 5, config.canvasWidth - 40, tankBY + 35, currenrtTankBHeight + ' ft', { color: 'black', width: 1, dashArray: '5,5' });
  tankC = addSVGImage(draw, 'assets/tankA.svg', 0, config.canvasHeight - 160, 175, 160);
  drawDashedHorizontalLine(draw, 175, config.canvasHeight - 130, 100, 'black', 1, '5,5');
  drawText(draw, 'elevation = 0 ft', 185, config.canvasHeight - 165 + 40, 14);
  drawText(draw, 'C', 85, config.canvasHeight - 160, 20);
  drawDashedLineWithArrows(draw, 10, 80 + 5  , 10, config.canvasHeight - 130 - 5, '100 ft');

  drawDashedHorizontalLine(draw, config.canvasWidth - 50, config.canvasHeight - 130, 50, 'black', 1, '5,5');
}

function drawPipeConnectors(draw) {
  markerGroup = draw.group();
  markerGroup.circle(50)
  .fill('#B4B4FF')
  .center(startX, startY)
  .stroke({ color: 'black', width: 1 });
  markerGroup.circle(20)
  .fill('white')
  .center(startX, startY)
  .stroke({ color: 'black', width: 1 });
  markerGroup.front();
}

function drawPipes(draw) {
  pipeGroup = draw.group();
  // Recalculate the B‐branch pipe length whenever the slider (hB) changes
  pipeBLength = (Math.abs(currenrtTankBHeight - 50) / Math.sin(Math.PI / 3)).toFixed(2);
  const result = solveThreeTanks(currenrtTankBHeight);
  const pipeA = `
      M ${startX} ${startY} 
      L ${165} ${95} 
    `;
  
  
  const directionA = result.dir1
  drawPipeWithCurves(pipeGroup, pipeA, 15, directionA, '#B4B4FF', 'black', '64 ft', 64);
  
  const pipeC = `
      M ${startX} ${startY} 
      L ${165} ${config.canvasHeight - 115} 
    `;
  const directionC = result.dir3
  drawPipeWithCurves(pipeGroup, pipeC, 15, directionC, '#B4B4FF', 'black', '64 ft', 64);
  
  const pipeB = `
      M ${startX} ${startY} 
      L ${ startX + (startX - 165) * currenrtTankBHeight / 100} ${startY + (maxHeight * (- currenrtTankBHeight + 50) / 100) + 20} 
    `;
  const directionB = result.dir2
  pipeBElement = drawPipeWithCurves(pipeGroup, pipeB, 15, directionB, '#B4B4FF', 'black', pipeBLength + 'ft', pipeBLength);

  // drawPipeConnectors(draw);
}

function adjustFigureWithEleveationSlider(draw) {
  const elevationDisplay = document.getElementById('elevationValue');
  elevationSlider.addEventListener('input', function () {
    elevationDisplay.textContent = this.value;
    adjustTankHeight(draw, this.value);
  });

  // const lengthDisplay = document.getElementById('lengthValue');
  // lengthSlider.addEventListener('input', function () {
  //   const newLength = parseFloat(this.value);
  //   lengthDisplay.textContent = newLength;
  //   const newPath = `
  //     M ${startX} ${startY} 
  //     L ${config.canvasWidth - 220} ${config.canvasHeight - 20 - (maxHeight * currenrtTankBHeight / 100)} 
  //   `;
  //   pipeBLength = newLength;
  //   pipeBElement.clear();
  //   pipeBElement = drawPipeWithCurves(pipeGroup, newPath, 15, 'down', '#B4B4FF', 'black', `length_b = ${newLength} ft`, newLength);
  //   pipeGroup.clear();
  //   drawPipes(draw);

  // });
}

function adjustTankHeight(draw, value) {
  currenrtTankBHeight = value
    const newY = config.canvasHeight - 20 - (maxHeight * currenrtTankBHeight / 100);
    
    pipeGroup.clear();
    drawPipes(draw);
    // startX + (startX - 165) * currenrtTankBHeight / 100} ${startY + (maxHeight * (- currenrtTankBHeight + 50) / 100)
    const x = startX + (startX - 165) * currenrtTankBHeight / 100 - 15
    const y = startY + (maxHeight * (- currenrtTankBHeight + 50) / 100) - 40;
    tankB.move(x, y);
    textB.move(x + 85, y);
    tankBDashedLine.clear();
    tankBDashedLine = drawDashedHorizontalLine(draw, x + 175, config.canvasHeight - 160 - (maxHeight * currenrtTankBHeight / 100) + 30, config.canvasWidth - (x + 175), 'black', 1, '5,5');
    tankBElevation.clear();
    tankBElevation = drawDashedLineWithArrows(draw, config.canvasWidth - 40, config.canvasHeight - 130 - 5, config.canvasWidth - 40, config.canvasHeight - 160 - (maxHeight * currenrtTankBHeight / 100) + 35, currenrtTankBHeight + ' ft', { color: 'black', width: 1, dashArray: '5,5' });
}


function addSVGImage(draw, url, x = 0, y = 0, width, height) {
  const img = draw.image(url)
  .size(width, height)                      // force the element to the given dimensions
  .move(x, y)
  .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
  return img;
}

function drawPipeWithCurves(draw, pathString, pipeWidth = 15, flowDirection = 'down', strokeColor = '#B4B4FF', outlineColor = 'black', pipeLabel = '', pipeLength = 1000) {
  let outline = draw.path(pathString)
  .fill('none')
  .stroke({
    color: outlineColor,
    width: pipeWidth + 2,
    linejoin: 'round'
  });
  
  let pipe = draw.path(pathString)
  .fill('none')
  .stroke({
    color: strokeColor,
    width: pipeWidth,
    linejoin: 'round'
  });
  
  const arrowSize = 10;
  const arrowSpacing = 20;
  const path = draw.path(pathString).hide();
  const length = path.length();
  
  for (let i = arrowSpacing; i < length; i += arrowSpacing) {
    const point1 = path.pointAt(i);
    const point2 = path.pointAt(i + 1);
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    // Adjust angle based on flow direction
    const adjustedAngle = flowDirection === 'up' ? angle + 180 : angle;
    
    draw.polygon('0,-5 10,0 0,5')
    .fill('green')
    .center(point1.x, point1.y)
    .rotate(adjustedAngle, point1.x, point1.y);
  }
  
  // Compute tangent angle at the very end of the path
  const endPoint = path.pointAt(length);
  const prevPoint = path.pointAt(length - 1);
  const dx_end = endPoint.x - prevPoint.x;
  const dy_end = endPoint.y - prevPoint.y;
  const endAngle = Math.atan2(dy_end, dx_end) * (180 / Math.PI);
  
  // Draw a rectangular cap: length = 1.5×pipeWidth, height = pipeWidth
  const rectLength = pipeWidth * 1.5;
  const rectHeight = pipeWidth;

  // Draw a rectangular cap at the start of the pipe (inside)
  const firstPoint = path.pointAt(0);
  let nextPoint = path.pointAt(1);
  const dxStart = nextPoint.x - firstPoint.x;
  const dyStart = nextPoint.y - firstPoint.y;
  const startAngle = Math.atan2(dyStart, dxStart) * 180 / Math.PI;
  const lenStart = Math.sqrt(dxStart * dxStart + dyStart * dyStart);
  const ux = dxStart / lenStart;
  const uy = dyStart / lenStart;
  // Center the cap half its length into the pipe
  const startCenterX = firstPoint.x + ux * (rectLength / 2);
  const startCenterY = firstPoint.y + uy * (rectLength / 2);

  draw.rect(rectLength, rectHeight)
  .fill(strokeColor)
  .center(endPoint.x, endPoint.y)
  .rotate(endAngle, endPoint.x, endPoint.y);

  const midIndex = length / 2;
  const midPoint = path.pointAt(midIndex);
  nextPoint = path.pointAt(midIndex + 1);
  const dxMid = nextPoint.x - midPoint.x;
  const dyMid = nextPoint.y - midPoint.y;
  const midAngle = Math.atan2(dyMid, dxMid) * (180 / Math.PI);

    // Adjust text angle to keep it right-side up
  let textAngle = midAngle;
  let offset = pipeWidth;
  if (textAngle > 90 || textAngle < -90) {
    textAngle = textAngle + 180;
    offset = pipeWidth + -30;
  }

  if (pipeLabel) {
    // Compute outward normal at midpoint
    const lenMid = Math.sqrt(dxMid * dxMid + dyMid * dyMid);
    const nx = -dyMid / lenMid;
    const ny = dxMid / lenMid;
    // Offset distance (pipeWidth + 5 pixels)
    const labelX = midPoint.x + nx * offset;
    const labelY = midPoint.y + ny * offset;
    const txt = drawLabelWithSubscript(draw, pipeLabel, labelX, labelY, 14, 'black')
                .rotate(textAngle, labelX, labelY);
  }
  
  // --- Draw dashed length indicator with arrows and label ---
  // Compute normal at midpoint for offsetting the dashed indicator outside the pipe
  const lenMidIndicator = Math.sqrt(dxMid * dxMid + dyMid * dyMid);
  const nxIndicator = -dyMid / lenMidIndicator;
  const nyIndicator = dxMid / lenMidIndicator;
  const offsetDist = pipeWidth / 2 + 5;

  // Create a dashed overlay of the same path
  const dashedIndicator = draw.path(pathString)
    .fill('none')
    .stroke({ color: 'black', width: 1, dasharray: '5,5', linecap: 'round' });
  // Offset the dashed path outward
  dashedIndicator.translate(nxIndicator * offsetDist, nyIndicator * offsetDist);

  // Compute start and end points and angle
  const startPoint = path.pointAt(0);
  // endPoint and endAngle already defined above
  // Helper to draw an arrowhead
  const drawArrow = (px, py, rotation) => {
    draw.polygon(`0,0 -7,4 -7,-4`)
      .fill('black')
      .center(px, py)
      .rotate(rotation, px, py);
  };
  // Offset arrow positions
  const endXOff = endPoint.x + nxIndicator * offsetDist;
  const endYOff = endPoint.y + nyIndicator * offsetDist;
  drawArrow(endXOff, endYOff, endAngle);

  const startXOff = startPoint.x + nxIndicator * offsetDist;
  const startYOff = startPoint.y + nyIndicator * offsetDist;
  drawArrow(startXOff, startYOff, endAngle + 180);

  // Draw cut markers (ticks) along the pipe based on real-world length
  const tickIntervalFt = 100;    // interval in real-world units (ft)
  // Use pipe diameter as tick length
  const halfTickPx = (pipeWidth + 10) / 2;
  const realLenFt = pipeLength;  // real pipe length passed in
  for (let ft = tickIntervalFt; ft < realLenFt; ft += tickIntervalFt) {
    const ratio = ft / realLenFt;
    const pixelDist = ratio * length;  // map to pixel distance along path
    const midPt = path.pointAt(pixelDist);
    const nextPt = path.pointAt(Math.min(pixelDist + 1, length));
    const dxB = nextPt.x - midPt.x;
    const dyB = nextPt.y - midPt.y;
    const segLen = Math.sqrt(dxB * dxB + dyB * dyB);
    const nxB = -dyB / segLen;
    const nyB = dxB / segLen;
    // Draw a small perpendicular tick centered at midPt
    draw.line(
      midPt.x + nxB * halfTickPx,
      midPt.y + nyB * halfTickPx,
      midPt.x - nxB * halfTickPx,
      midPt.y - nyB * halfTickPx
    ).stroke({ color: 'white', width: 5 });
  }

  draw.circle(18)
    .fill(strokeColor)
    .center(startX, startY)

    draw.circle(5)
    .fill('black')
    .center(startX, startY)

  return pipe;
}

function drawText(draw, textString, x, y, fontSize = 16, fillColor = 'black') {
  const txt = draw.text(textString)
    .font({ size: fontSize, family: 'Arial', anchor: 'start' })
    .fill(fillColor)
    .move(x, y);
  return txt;
}

function drawLabelWithSubscript(draw, label, x, y, fontSize = 16, fillColor = 'black') {
  // Regex: capture text before '_', the subscript letter, and any following text.
  const match = label.match(/^(.+?)_([A-Za-z])(.*)$/);
  if (match) {
    const mainStr = match[1];
    const subStr = match[2];
    const rest = match[3];
    return draw.text(add => {
      add.tspan(mainStr)
        .attr({ 'font-size': fontSize, fill: fillColor });
      add.tspan(subStr)
        .attr({
          'font-size': Math.round(fontSize * 0.75),
          fill: fillColor,
          'baseline-shift': 'sub'
        });
      if (rest) {
        add.tspan(rest)
          .attr({ 'font-size': fontSize, fill: fillColor });
      }
    })
    .move(x, y);
  } else {
    // No underscore pattern: fallback to regular drawText
    return drawText(draw, label, x, y, fontSize, fillColor);
  }
}

/**
 * Draws a horizontal dashed line and returns a group that can be cleared.
 */
function drawDashedHorizontalLine(draw, startX, startY, length, color = 'black', width = 1, dashArray = '5,5') {
  const group = draw.group();
  group.line(startX, startY, startX + length, startY)
    .stroke({ color: color, width: width, dasharray: dashArray });
  return group;
}

function drawDashedLineWithArrows(draw, x1, y1, x2, y2, textString, options = {}) {
  const group = draw.group();
  const {
    color = 'black',
    width = 1,
    dashArray = '5,5',
    arrowSize = 10,
    fontSize = 14,
    fontColor = 'black'
  } = options;

  // Draw the dashed line
  group.line(x1, y1, x2, y2).stroke({ color, width, dasharray: dashArray });

  // Compute angle for arrowheads
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  // Helper to draw an arrowhead
  const drawArrow = (px, py, rotation) => {
    group.polygon(`0,0 -${arrowSize},${arrowSize/2} -${arrowSize},-${arrowSize/2}`)
      .fill(color)
      .center(px, py)
      .rotate(rotation, px, py);
  };

  // Arrow at end
  drawArrow(x2, y2, angle);

  // Arrow at start (flip 180°)
  drawArrow(x1, y1, angle + 180);

  // Text at midpoint
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;
  group.text(textString)
    .font({ size: fontSize, family: 'Arial', anchor: 'middle' })
    .fill(fontColor)
    .move(midX, midY - fontSize / 2);

  return group;
}