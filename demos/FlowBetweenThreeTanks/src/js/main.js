import { off } from '@svgdotjs/svg.js';
import * as config from '../js/config.js';
import { solveThreeTanks } from '../js/flowSolver.js';  

const margin = 130;
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
let tankBBase = null;
let pipeBLength = Math.abs(currenrtTankBHeight - 50) / Math.sin(Math.PI / 3);
// console.log('pipeBLength', Math.asin(60));

let tankBX = margin + startX + (Math.abs(currenrtTankBHeight - 50) / Math.tan(Math.PI / 3)) * (startX - 165) / 50;//startX + (startX - 165) * currenrtTankBHeight / 100 - 15;
let tankBY = startY + (maxHeight * (- currenrtTankBHeight + 50) / 100) - 40;

let direction = 'above'

export function drawFigure(draw) {
  drawTank(draw);
  drawPipes(draw);
  adjustFigureWithEleveationSlider(draw);
  drawText(draw, '(40, 50)', margin + startX - 75, startY - 60 + 57.5, 14);
  drawDashedHorizontalLine(draw, startX + 102, startY, 30, 'black', 1, '5,5');
  draw.circle(5)
    .fill('black')
    .center(margin + 175, startY);
  drawText(draw, '(0, 50)', margin + 157.5, startY + 5, 14);
}


function drawTank(draw) {
  tankA = addSVGImage(draw, 'assets/tankA.svg', margin + 0, 50, 175, 160);
  drawText(draw, 'A', margin + 85, 50, 20);
  tankB = addSVGImage(draw, 'assets/tankA.svg', tankBX, tankBY , 175, 160);
  textB = drawText(draw, 'B',  tankBX + 85, tankBY, 20);
  tankBDashedLine = drawDashedHorizontalLine(draw, margin + tankBX + 45, tankBY + 30, 25, 'black', 1, '5,5');
  tankBBase = drawDashedHorizontalLine(draw, margin + tankBX + 55, config.canvasHeight - 130, 25, 'black', 1, '5,5');
  tankBElevation = drawDashedLineWithArrows(draw, margin + tankBX + 60, config.canvasHeight - 130 - 5, margin + tankBX + 60, tankBY + 35, currenrtTankBHeight + ' ft', { color: 'black', width: 1, dashArray: '5,5' });
  
  tankC = addSVGImage(draw, 'assets/tankA.svg', margin + 0, config.canvasHeight - 160, 175, 160);
  drawDashedHorizontalLine(draw, margin + 175, config.canvasHeight - 130, 150, 'black', 1, '5,5');
  drawText(draw, 'elevation = 0 ft', margin + 225, config.canvasHeight - 165 + 20, 14);
  drawText(draw, 'C', margin + 85, config.canvasHeight - 160, 20);
  drawDashedLineWithArrows(draw, margin + 10, 80 + 5  , margin + 10, config.canvasHeight - 130 - 5, '100 ft');
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
  pipeBLength = (Math.abs(currenrtTankBHeight - 50) / Math.sin(Math.PI / 3)).toFixed(1);
  tankBX = startX + (Math.abs(currenrtTankBHeight - 50) / Math.tan(Math.PI / 3)) * (startX - 165) / 50;//startX + (startX - 165) * currenrtTankBHeight / 100 - 15;
  tankBY = startY + (maxHeight * (- currenrtTankBHeight + 50) / 100) - 40;
  const result = solveThreeTanks(currenrtTankBHeight);
  
  const pipeB = `
      M ${margin + startX} ${startY} 
      L ${ margin + tankBX + 8} ${startY + (maxHeight * (- currenrtTankBHeight + 50) / 100) + 5} 
    `;
  const directionB = result.dir2
  pipeBElement = drawPipeWithCurves(pipeGroup, pipeB, 15, directionB, '#B4B4FF', 'black', pipeBLength + ' ft', pipeBLength, direction);
  
  const pipeA = `
      M ${margin + startX} ${startY} 
      L ${margin + 168} ${95} 
    `;
  const directionA = result.dir1
  const pipeAElement = drawPipeWithCurves(pipeGroup, pipeA, 15, directionA, '#B4B4FF', 'black', '64 ft', 64);
  
  const pipeC = `
      M ${margin + startX} ${startY} 
      L ${margin + 168} ${config.canvasHeight - 105} 
    `;
  const directionC = result.dir3
  const pipeCElement = drawPipeWithCurves(pipeGroup, pipeC, 15, directionC, '#B4B4FF', 'black', '64 ft', 64, 'below');

  drawPipeLengthIndicator(pipeGroup, pipeBElement, 15, pipeBLength + ' ft', pipeBLength, direction);
  drawPipeLengthIndicator(pipeGroup, pipeAElement, 15, '64 ft', 64, 'above');
  drawPipeLengthIndicator(pipeGroup, pipeCElement, 15, '64 ft', 64, 'below');
  // drawPipeLengthIndicator(pipeGroup, pipeBElement, 15, pipeBLength + ' ft', pipeBLength, direction);
  
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
    direction = currenrtTankBHeight > 50 ? 'above' : 'below';
    pipeGroup.clear();
    drawPipes(draw);
    // startX + (startX - 165) * currenrtTankBHeight / 100} ${startY + (maxHeight * (- currenrtTankBHeight + 50) / 100)
    const x = startX + (Math.abs(currenrtTankBHeight - 50) / Math.tan(Math.PI / 3)) * (startX - 165) / 50
    const y = startY + (maxHeight * (- currenrtTankBHeight + 50) / 100) - 40;
    tankB.move(margin + x, y);
    textB.move(margin + x + 85, y);
    tankBDashedLine.clear();
    margin + tankBX + 55,
    tankBDashedLine = drawDashedHorizontalLine(draw, margin + x + 160 + 12.5, config.canvasHeight - 160 - (maxHeight * currenrtTankBHeight / 100) + 30, 25, 'black', 1, '5,5');
    tankBElevation.clear();
    tankBElevation = drawDashedLineWithArrows(draw, margin + x + 25 + 160, config.canvasHeight - 130 - 5, margin + x + 25 + 160, config.canvasHeight - 160 - (maxHeight * currenrtTankBHeight / 100) + 35, currenrtTankBHeight + ' ft', { color: 'black', width: 1, dashArray: '5,5' });
    tankBBase.clear();
    tankBBase = drawDashedHorizontalLine(draw, margin + x + 160 + 12.5, config.canvasHeight - 130, 25, 'black', 1, '5,5');
}


function addSVGImage(draw, url, x = 0, y = 0, width, height) {
  const img = draw.image(url)
  .size(width, height)                      // force the element to the given dimensions
  .move(x, y)
  .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
  return img;
}

/**
 * Draws arrowheads along a given hidden path.
 * @param {object} draw - The SVG drawing context.
 * @param {object} path - The hidden SVG path object.
 * @param {number} arrowSize - Size of each arrowhead.
 * @param {number} arrowSpacing - Distance (in pixels) between arrowheads.
 * @param {string} flowDirection - 'up' or 'down' to flip arrow orientation.
 */
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

/**
 * Draws a curved dashed length indicator for a pipe, with arrowheads and label.
 * @param {object} draw - The SVG drawing context.
 * @param {object} path - The hidden SVG path object.
 * @param {number} pipeWidth - Width of the pipe stroke.
 * @param {string} pipeLabel - Label text to display (e.g., '64 ft').
 * @param {number} pipeLength - Real-world length value for mapping ticks.
 * @param {string} dashedSide - 'above' or 'below' to choose side of offset.
 */
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
  drawArrow(end.x, end.y, angleEnd);
  drawArrow(start.x, start.y, angleEnd + 180);
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
  if ((textAngle > 90 || textAngle < -90) || (dashedSide === 'below')) {
    // textAngle = textAngle + 180;
    offset = pipeWidth - 30;
  }


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

  // Draw curved dashed length indicator with label
  // drawPipeLengthIndicator(draw, path, pipeWidth, pipeLabel, pipeLength, dashedSide);

  draw.circle(18)
    .fill(strokeColor)
    .center(margin + startX, startY)

  draw.circle(5)
    .fill('black')
    .center(margin + startX, startY)

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
    .move(midX + 15, midY - fontSize / 2);

  return group;
}