import { off } from '@svgdotjs/svg.js';
import * as config from './config.js';
import { solveThreeTanks } from './flowSolver.js';  

const margin = 130;
const maxHeight = config.canvasHeight - 160  - 50;
const startX = config.canvasWidth / 2 - 100;
const startY = config.canvasHeight - 160 - maxHeight / 2 + 40;
let tankA = null;
let tankB = null;
let tankC = null;
let textA = null;
let textB = null;
let textC = null;
let pipeBElement = null;
let pipeGroup = null;
const elevationSlider = document.getElementById('elevationSlider');
const lengthSlider = document.getElementById('lengthSlider');
let currenrtTankBHeight = elevationSlider.value;
let markerGroup = null;
let tankBDashedLine = null;
let tankBElevation = null;
let tankBBase = null;
let pipeBLength = Math.abs(currenrtTankBHeight - 50) / Math.sin(Math.PI / 3);
// console.log('pipeBLength', Math.asin(60));

let tankBX = margin + startX + (Math.abs(100 - 50) / Math.tan(Math.PI / 3)) * (startX - 165) / 50;//startX + (startX - 165) * currenrtTankBHeight / 100 - 15;
let tankBY = startY + (maxHeight * 50 / 100) - 40  - (currenrtTankBHeight - 10) / 90 * 2*(maxHeight * 50 / 100);

let tankCX = margin + (100 - lengthSlider.value) / 100 * (startX - 175 + (Math.abs(100 - 50) / Math.tan(Math.PI / 3)) * (startX - 165) / 50)

let direction = 'above'

export function drawFigure(draw) {
  drawTank(draw);
  drawPipes(draw);
  adjustFigureWithEleveationSlider(draw);
  adjustFigureWithDistanceSlider(draw);
}


function drawTank(draw) {
  tankA = addSVGImage(draw, 'assets/tankA.svg', margin + 0, 50, 175, 160);
  textA = drawText(draw, 'A', margin + 85, 50, 20);
  tankB = addSVGImage(draw, 'assets/tankA.svg', tankBX, tankBY , 175, 160);
  textB = drawText(draw, 'B',  tankBX + 85, tankBY, 20);
  
  tankC = addSVGImage(draw, 'assets/tankA.svg', tankCX, config.canvasHeight - 160, 175, 160);
  textC = drawText(draw, 'C', tankCX + 85, config.canvasHeight - 160, 20);
  drawDashedLineWithArrows(draw, margin + 10, 80 + 5  , margin + 10, config.canvasHeight - 7, '100 ft');
}

function drawPipes(draw) {
  pipeGroup = draw.group();
  pipeBLength = (Math.abs(currenrtTankBHeight - 50) / Math.sin(Math.PI / 3)).toFixed(1);
  tankBY = startY + (maxHeight * 50 / 100) - 40  - (currenrtTankBHeight - 10) / 90 * 2*(maxHeight * 50 / 100);
  const result = solveThreeTanks(currenrtTankBHeight);
  
  const pipeA = `
      M ${tankBX + 2} ${tankBY + 38} 
      L ${margin + 170} ${88} 
    `;
  const directionA = result.dir1
  const lengthA = Math.sqrt(Math.pow(100, 2) + Math.pow((100 - elevationSlider.value), 2)).toFixed(1);
  const pipeAElement = drawPipeWithCurves(pipeGroup, pipeA, 15, directionA, '#B4B4FF', 'black', lengthA, 64);
  
  const pipeC = `
      M ${tankBX + 2} ${tankBY + 38}
      L ${tankCX + 170} ${config.canvasHeight - 122} 
    `;
  const directionC = result.dir3
  const lengthC = Math.sqrt(Math.pow(lengthSlider.value, 2) + Math.pow(elevationSlider.value - 10, 2)).toFixed(1);
  const pipeCElement = drawPipeWithCurves(pipeGroup, pipeC, 15, directionC, '#B4B4FF', 'black', '64 ft', 64, 'below');
  drawPipeLengthIndicator(pipeGroup, pipeAElement, 15, lengthA + ' ft', lengthA, 'above');
  drawPipeLengthIndicator(pipeGroup, pipeCElement, 15, lengthC + ' ft', lengthC, 'below');
  drawDashedHorizontalLine(pipeGroup, margin, config.canvasHeight - 2, (tankBX - 300) * (100 - lengthSlider.value) / 100, 'black', 1, '5,5');
  drawDashedLineWithArrows(pipeGroup, tankCX + 175 + 2, config.canvasHeight - 50, tankBX - 4, config.canvasHeight - 50, lengthSlider.value + ' ft', { color: 'black', width: 1, dashArray: '5,5' });
  drawDashedVerticalLine(pipeGroup, tankBX + 1.5, tankBY + 160, config.canvasHeight - 50 - (tankBY - 80), 'black', 1, '5,5');
  textA.front();
  textB.front();
  textC.front();
  calculateFlowRate(pipeGroup, lengthA, lengthC);

  const y = startY + (maxHeight * 50 / 100) - 40  - (elevationSlider.value - 10) / 90 * 2*(maxHeight * 50 / 100)
  drawDashedHorizontalLine(pipeGroup, tankBX + 160 + 12.5, y + 30, 25, 'black', 1, '5,5');
  drawDashedLineWithArrows(pipeGroup, tankBX + 25 + 160, config.canvasHeight - 7, tankBX + 25 + 160, y + 35, currenrtTankBHeight + ' ft', { color: 'black', width: 1, dashArray: '5,5' });
  drawDashedHorizontalLine(pipeGroup, tankBX + 160 + 12.5, config.canvasHeight - 2, 25, 'black', 1, '5,5');

  drawDashedLineWithArrows(pipeGroup, tankCX + 20, config.canvasHeight - 6, tankCX + 20, config.canvasHeight - 125, '10' + ' ft', { color: 'black', width: 1, dashArray: '5,5' });
  drawDashedVerticalLine(pipeGroup, tankBX + 1.5, 40, tankBY - 40, 'black', 1, '5,5');
}

function calculateFlowRate(draw, l_ab, l_bc) {
  const D  = 1.0;
  const g  = 32.17;
  const f  = 0.02;

  const u_bc = Math.sqrt((2 * g * (elevationSlider.value - 10) * D) / (f * l_bc)) * Math.PI * 0.25 * Math.pow(D, 2);
  const u_ab = Math.sqrt((2 * g * (100 - elevationSlider.value) * D) / (f * l_ab)) * Math.PI * 0.25 * Math.pow(D, 2);

  draw.rect(135, 25).fill('white').stroke({ color: 'black', width: 1 }).center(tankBX + 90, tankBY + 50);
  draw.rect(135, 25).fill('white').stroke({ color: 'black', width: 1 }).center(tankBX + 90, tankBY + 125);
  drawLabelWithSubscript(draw, `Q_in = ${u_ab.toFixed(1)} ft³/s`, tankBX + 30, tankBY + 40, 16, 'black');
  drawLabelWithSubscript(draw, `Q_out = ${u_bc.toFixed(1)} ft³/s`, tankBX + 30, tankBY + 115, 16, 'black');
  drawDashedLineWithArrows(pipeGroup, 308, 50, tankBX - 2, 50, '100 ft', { color: 'black', width: 1, dashArray: '5,5' });
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
    direction = currenrtTankBHeight > 50 ? 'above' : 'below';
    pipeGroup.clear();
    drawPipes(draw);
  
    const y = startY + (maxHeight * 50 / 100) - 40  - (value - 10) / 90 * 2*(maxHeight * 50 / 100)//-        (maxHeight * (- currenrtTankBHeight + 50) / 100);
    tankB.move(tankBX, y);
    textB.move(tankBX + 85, y);
}

function adjustFigureWithDistanceSlider(draw) {
  const elevationDisplay = document.getElementById('lengthValue');
  lengthSlider.addEventListener('input', function () {
    elevationDisplay.textContent = this.value;
    adjustTankLength(draw, this.value);
  });
}

function adjustTankLength(draw, value) {
  pipeGroup.clear();
  tankCX = margin + (100 - value) / 100 * (startX - 175 + (Math.abs(100 - 50) / Math.tan(Math.PI / 3)) * (startX - 165) / 50);
  drawPipes(draw);
  tankC.move(tankCX, config.canvasHeight - 160);
  textC.move(tankCX + 85, config.canvasHeight - 160);
}


function addSVGImage(draw, url, x = 0, y = 0, width, height) {
  const img = draw.image(url)
  .size(width, height)
  .move(x, y)
  .attr({ preserveAspectRatio: 'none' });
  return img;
}

function drawPipeArrows(draw, path, arrowSize = 10, arrowSpacing = 20, flowDirection = 'down') {
  const totalLength = path.length();
  for (let i = arrowSpacing; i < totalLength; i += arrowSpacing) {
    const p1 = path.pointAt(i);
    const p2 = path.pointAt(Math.min(i + 1, totalLength));
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const baseAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const angle = flowDirection === 'up' ? baseAngle + 180 : baseAngle;
    draw.polygon('0,-5 10,0 0,5')
      .fill('green')
      .center(p1.x, p1.y)
      .rotate(angle, p1.x, p1.y);
  }
}

function drawPipeLengthIndicator(draw, path, pipeWidth, pipeLabel, pipeLength, dashedSide) {
  // Compute normal offset for the dashed indicator
  const length = path.length();
  // Compute midpoint tangent
  const midIndex = length / 2;
  const midPoint = path.pointAt(midIndex);
  const nextMid = path.pointAt(midIndex + 1);
  const dxMid = nextMid.x - midPoint.x;
  const dyMid = nextMid.y - midPoint.y;
  const segLenMid = Math.sqrt(dxMid*dxMid + dyMid*dyMid);
  let nx = -dyMid / segLenMid;
  let ny = dxMid / segLenMid;
  let offset = pipeWidth / 2 + 5;
  // Flip normal based on side
  if ((dashedSide === 'above' && ny > 0) || (dashedSide === 'below' && ny < 0)) {
    nx = -nx; ny = -ny;
  }
  // Create dashed path offset
  const dashed = draw.path(path.attr('d'))
    .fill('none')
    .stroke({ color: 'red', width: 1, dasharray: '5,5', linecap: 'round' })
    .translate(nx * offset, ny * offset);
  // Draw arrowheads at ends
  const start = path.pointAt(0), end = path.pointAt(length);
  const prev = path.pointAt(length - 1);
  const angleEnd = Math.atan2(end.y - prev.y, end.x - prev.x) * 180/Math.PI;
  const drawArrow = (px, py, rot) => {
    draw.polygon('0,0 -7,4 -7,-4').fill('black')
      .center(px + nx*offset, py + ny*offset)
      .rotate(rot, px + nx*offset, py + ny*offset);
  };
  drawArrow(end.x + 2, end.y, angleEnd);
  drawArrow(start.x - 2, start.y, angleEnd + 180);
  // Draw label if provided
  if (pipeLabel) {
    // Position label at middle of dashed line
    const sx = start.x + nx*offset, sy = start.y + ny*offset;
    const ex = end.x + nx*offset, ey = end.y + ny*offset;
    const midX = (sx + ex)/2, midY = (sy + ey)/2;
    let labelAngle = Math.atan2(ey - sy, ex - sx) * 180/Math.PI;
    if (labelAngle > 90 || labelAngle < -90) labelAngle += 180;
    if (dashedSide === 'above') {
      offset += 20; // Adjust offset for above label
    }
    draw.text(pipeLabel)
      .font({ size: 14, family: 'Arial', anchor: 'middle' })
      .fill('black')
      .move(midX + nx*(offset - 5), midY + ny*(offset - 5))
      .rotate(labelAngle, midX, midY);
  }
}

function drawPipeWithCurves(draw, pathString, pipeWidth = 15, flowDirection = 'down', strokeColor = '#B4B4FF', outlineColor = 'black', pipeLabel = '', pipeLength = 1000, dashedSide = 'above') {
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
  drawPipeArrows(draw, path, arrowSize, arrowSpacing, flowDirection);
  
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
  if ((textAngle > 90 || textAngle < -90) || (dashedSide === 'below')) {
    // textAngle = textAngle + 180;
    offset = pipeWidth - 30;
  }


  const tickIntervalFt = 100;
  
  const halfTickPx = (pipeWidth + 10) / 2;
  const realLenFt = pipeLength;
  for (let ft = tickIntervalFt; ft < realLenFt; ft += tickIntervalFt) {
    const ratio = ft / realLenFt;
    const pixelDist = ratio * length;
    const midPt = path.pointAt(pixelDist);
    const nextPt = path.pointAt(Math.min(pixelDist + 1, length));
    const dxB = nextPt.x - midPt.x;
    const dyB = nextPt.y - midPt.y;
    const segLen = Math.sqrt(dxB * dxB + dyB * dyB);
    const nxB = -dyB / segLen;
    const nyB = dxB / segLen;

    draw.line(
      midPt.x + nxB * halfTickPx,
      midPt.y + nyB * halfTickPx,
      midPt.x - nxB * halfTickPx,
      midPt.y - nyB * halfTickPx
    ).stroke({ color: 'white', width: 5 });
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

function drawLabelWithSubscript(draw, label, x, y, fontSize = 16, fillColor = 'black') {

  const match = label.match(/^(.+?)_([A-Za-z]+)(.*)$/);
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

function drawDashedVerticalLine(draw, startX, startY, length, color = 'black', width = 1, dashArray = '5,5') {
  const group = draw.group();
  group.line(startX, startY, startX, startY + length)
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
  let midX = (x1 + x2) / 2;
  let midY = (y1 + y2) / 2;

  if (y1 == midY) {
    midY = midY - 10; // Adjust for horizontal line
  }

  if (x1 == midX) {
    midX = midX + 15; // Adjust for vertical line
  }
  group.text(textString)
    .font({ size: fontSize, family: 'Arial', anchor: 'middle' })
    .fill(fontColor)
    .move(midX, midY - fontSize / 2);

  return group;
}