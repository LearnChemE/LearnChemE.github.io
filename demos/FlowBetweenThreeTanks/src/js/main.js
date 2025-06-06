import * as config from '../js/config.js';
import { solveThreeTanks } from '../js/flowSolver.js';  

const maxHeight = config.canvasHeight - 160  - 50;
const startX = config.canvasWidth / 2 - 100;
const startY = config.canvasHeight / 2 + 200;
let tankA = null;
let tankB = null;
let tankC = null;
let textB = null;
let pipeBElement = null;
let pipeGroup = null;
const elevationSlider = document.getElementById('elevationSlider');
let currenrtTankBHeight = elevationSlider.value;
let markerGroup = null;

let tankBX = config.canvasWidth - 175;
let tankBY = config.canvasHeight - 160 - (maxHeight * currenrtTankBHeight / 100);

export function drawFigure(draw) {
  drawTank(draw);
  drawPipes(draw);
  adjustFigureWithEleveationSlider(draw);
  // drawDashedConnection(draw, 400, 100, 400, 400, 'YourLabel');
}


function drawTank(draw) {
  tankA = addSVGImage(draw, '/assets/tankA.svg', 0, 50, 175, 160);
  drawDashedHorizontalLine(draw, 175, 80, 100, 'black', 1, '5,5');
  drawText(draw, 'elevation = 100 ft', 175, 60, 14);
  drawText(draw, 'A', 85, 50, 20);
  tankB = addSVGImage(draw, '/assets/tankA.svg', tankBX, tankBY , 175, 160);
  textB = drawText(draw, 'B', tankBX + 85, tankBY, 20);
  tankC = addSVGImage(draw, '/assets/tankA.svg', 0, config.canvasHeight - 160, 175, 160);
  drawDashedHorizontalLine(draw, 175, config.canvasHeight - 130, 100, 'black', 1, '5,5');
  drawText(draw, 'elevation = 0 ft', 175, config.canvasHeight - 150, 14);
  drawText(draw, 'C', 85, config.canvasHeight - 160, 20);
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
  const result = solveThreeTanks(500, currenrtTankBHeight);
  const pipeA = `
      M ${startX} ${startY} 
      L ${165} ${200} 
    `;
  
  
  const directionA = result.dir1
  drawPipeWithCurves(pipeGroup, pipeA, 15, directionA, '#B4B4FF', 'black', 'length_a = 1000 ft');
  
  const pipeC = `
      M ${startX} ${startY} 
      L ${170} ${config.canvasHeight - 20} 
    `;
  const directionC = result.dir3
  drawPipeWithCurves(pipeGroup, pipeC, 15, directionC, '#B4B4FF', 'black', 'length_c = 400 ft');
  
  const pipeB = `
      M ${startX} ${startY} 
      L ${config.canvasWidth - 170} ${config.canvasHeight - 20 - (maxHeight * currenrtTankBHeight / 100)} 
    `;
  const directionB = result.dir2
  pipeBElement = drawPipeWithCurves(pipeGroup, pipeB, 15, directionB, '#B4B4FF', 'black', 'length_b = 500 ft');

  drawPipeConnectors(draw);
}

function adjustFigureWithEleveationSlider(draw) {
  const elevationDisplay = document.getElementById('elevationValue');
  elevationSlider.addEventListener('input', function () {
    elevationDisplay.textContent = this.value;
    adjustTankHeight(draw, this.value);
  });
}

function adjustTankHeight(draw, value) {
  currenrtTankBHeight = value
    const newY = config.canvasHeight - 20 - (maxHeight * currenrtTankBHeight / 100);
    
    const newPath = `
      M ${startX} ${startY}
      L ${config.canvasWidth - 170} ${newY}
    `;
    pipeGroup.clear();
    drawPipes(draw);
    tankB.move(config.canvasWidth - 175, config.canvasHeight - 160 - (maxHeight * currenrtTankBHeight / 100));
    textB.move(tankBX + 85, config.canvasHeight - 160 - (maxHeight * currenrtTankBHeight / 100));
}


function addSVGImage(draw, url, x = 0, y = 0, width, height) {
  const img = draw.image(url)
  .size(width, height)                      // force the element to the given dimensions
  .move(x, y)
  .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
  return img;
}

function drawPipeWithCurves(draw, pathString, pipeWidth = 15, flowDirection = 'down', strokeColor = '#B4B4FF', outlineColor = 'black', pipeLabel = '') {
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
  const arrowSpacing = 40;
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
  
  draw.rect(rectLength, rectHeight)
  .fill(strokeColor)
  .center(endPoint.x, endPoint.y)
  .rotate(endAngle, endPoint.x, endPoint.y);

  const midIndex = length / 2;
  const midPoint = path.pointAt(midIndex);
  const nextPoint = path.pointAt(midIndex + 1);
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
  
  return pipe;
}

function drawText(draw, textString, x, y, fontSize = 16, fillColor = 'black') {
  const txt = draw.text(textString)
    .font({ size: fontSize, family: 'Arial', anchor: 'start' })
    .fill(fillColor)
    .move(x, y);
  return txt;
}

// 1) Define a helper that emits two tspans: one normal letter, one “shifted down” subscript
function drawTextWithSubscript(draw, mainStr, subStr, x, y, fontSize = 16, fillColor = 'black') {
  return draw.text(add => {
    // Primary character (ℓ)
    add.tspan(mainStr)
       .attr({ 'font-size': fontSize, fill: fillColor });
    // Subscript character (A), scaled + baseline-shift
    add.tspan(subStr)
       .attr({
         'font-size': Math.round(fontSize * 0.75),  // slightly smaller
         fill: fillColor,
         'baseline-shift': 'sub'
       });
  })
  .move(x, y);
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

// Draw a dashed connection with crosses at endpoints, a dashed arrow, and an optional label
function drawDashedConnection(draw, x1, y1, x2, y2, label = '') {
  const crossSize = 10;
  // Cross at point 1
  draw.line(x1 - crossSize, y1, x1 + crossSize, y1)
    .stroke({ color: 'black', width: 1, dasharray: '5,5' });
  draw.line(x1, y1 - crossSize, x1, y1 + crossSize)
    .stroke({ color: 'black', width: 1, dasharray: '5,5' });
  // Cross at point 2
  draw.line(x2 - crossSize, y2, x2 + crossSize, y2)
    .stroke({ color: 'black', width: 1, dasharray: '5,5' });
  draw.line(x2, y2 - crossSize, x2, y2 + crossSize)
    .stroke({ color: 'black', width: 1, dasharray: '5,5' });

  // Compute unit direction vector
  const dxTotal = x2 - x1;
  const dyTotal = y2 - y1;
  const totalLen = Math.sqrt(dxTotal * dxTotal + dyTotal * dyTotal);
  const ux = dxTotal / totalLen;
  const uy = dyTotal / totalLen;

  const offset = crossSize;
  const startLineX = x1 + ux * offset;
  const startLineY = y1 + uy * offset;
  const endLineX = x2 - ux * offset;
  const endLineY = y2 - uy * offset;

  // Main dashed line shortened to end at crosses
  draw.line(startLineX, startLineY, endLineX, endLineY)
    .stroke({ color: 'black', width: 1, dasharray: '5,5' });
  // Arrowhead
  const angle = Math.atan2(dyTotal, dxTotal) * (180 / Math.PI);
  const arrowTipX2 = x2 - ux * offset;
  const arrowTipY2 = y2 - uy * offset;
  const arrowPoly = draw.polygon('0,-5 10,0 0,5')
    .fill('black')
    .center(arrowTipX2, arrowTipY2)
    .rotate(angle, arrowTipX2, arrowTipY2);
  arrowPoly.front();

  // Draw arrowhead at the starting point, reversed direction
  const reverseAngle = angle + 180;
  const arrowTipX1 = x1 + ux * offset;
  const arrowTipY1 = y1 + uy * offset;
  const arrowPolyStart = draw.polygon('0,-5 10,0 0,5')
    .fill('black')
    .center(arrowTipX1, arrowTipY1)
    .rotate(reverseAngle, arrowTipX1, arrowTipY1);
  arrowPolyStart.front();

  // Label at midpoint, offset perpendicular to line
  if (label) {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;
    const offset = 15; // distance to offset text from line
    const labelX = midX + nx * offset;
    const labelY = midY + ny * offset;
    const txt = drawText(draw, label, labelX, labelY, 14, 'black')
      .font({ anchor: 'middle' });
    txt.front();
  }
}

// Draw a horizontal dashed line starting at (startX, startY) with the specified length
function drawDashedHorizontalLine(draw, startX, startY, length, color = 'black', width = 1, dashArray = '5,5') {
  draw.line(startX, startY, startX + length, startY)
    .stroke({ color: color, width: width, dasharray: dashArray });
}