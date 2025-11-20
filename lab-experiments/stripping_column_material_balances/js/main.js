// Gauge pressure update function
let windowWidth = window.innerWidth;
let windowHeight = windowWidth * 600 / 1000;

const draw = SVG().addTo('#svg-container').size(windowWidth, windowHeight);

const canvasWidth = 1000;
const canvasHeight = 600;
let feedLiquidElement = null;
let extractLiquidElement = null;
export const mainCylWidth = 60;
export const mainCylHeight = 250;
export const nozzleRect1Width = 30;
export const nozzleRect1Height = 12;
export const nozzleRect2Width = 15;
export const nozzleRect2Height = 20;
export const nozzleRect3Width = 30;
export const nozzleRect3Height = 12;
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

export const connectedGaugeSize = 50;
export const connectedGaugeSeparation = 0;
export const connectedGaugeVerticalOffset = 30;

export const gaugeSize = 30;
export const gaugeStrokeWidth = 4;

export const hexCircleSize = 30;
export const hexSize = 12;
export const hexInnerCircleSize = 10;

document.getElementsByTagName('svg')[0].setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

let pipeGroup, waterGroup, uiGroup, gasGroup;
let gasFlowText = null;
let gasImage = null;
let measureMode = false;
let densityTooltip, densityTooltipRect, densityTooltipText;
let moleFractionTooltip, tooltipRect, tooltipText;

let pump = null;
let toggle = null;
let gasValve = null;

let leftPipe = null;
let leftPipe1 = null;
let leftPipe2 = null;
let leftPipe3 = null;
let leftPipe4 = null;

let rightPipe = null;
let rightPipe2 = null;
let rightPipe3 = null;
let rightPipe4 = null;
let rightPipe5 = null;

let extractTankVolume = 0;
let raffinateTankVolume = 0;
const maxTankVolume = 1000; 
const maxRaffinateVolume = 300;
const maxSolventVolume = 500;
let feedHeightPx = 1000;
let extractHeightPx = 0;
let gasFlowRateText = null;
let isGasValveOpen = false;


let feedTankVolume = maxTankVolume;

const pump1StartX = 100;
const pump1StartY = 450;
const pump2StartX = 700;
const pump2StartY = 450;
let isPanning = false;
let panStart = { x: 0, y: 0 };

// --- Stripping column computations ---
const L = 1;              // Liquid flow (mol/s)
const V = 0.01;           // Vapor  flow (mol/s)
const x0 = 0.35;          // Bottom liquid comp.
const y4 = 1.0;           // Top vapor  comp.
const H = 150;            // Height of column (m)
const MEASUREMENT_NOISE = 0.01; // Small noise for simulated measurements
let P = 1.0;            // Pressure of column (bar)

function computeStageCompositions(L, V, x0, y4) {
  const K  = H / P;
  const VK = V * K;

  // 1) Middle‐stage: x2 = [L²·x0 + V²·K·y4] / [L² + (V·K)²]
  const x2 = (L*L * x0 + V*V * K * y4) / (L*L + VK*VK);

  // 2) Stage‐to‐stage: x1 = (L·x0 + V·K·x2) / (L + V·K)
  //                   x3 = (L·x2 + V·y4)      / (L + V·K)
  const D  = L + VK;
  const x1 = (L * x0 + VK * x2) / D;
  const x3 = (L * x2 + V  * y4) / D;

  // 3) Equilibrium: yi = K·xi
  const y1 = K * x1;
  const y2 = K * x2;
  const y3 = K * x3;

  return { x1, x2, x3, y1, y2, y3 };
}

// Example usage:
let result = computeStageCompositions(L, V, x0, y4);
console.log(result);

function applyMeasurementNoise(value, magnitude = MEASUREMENT_NOISE) {
  const noise = (Math.random() * 2 - 1) * magnitude;
  return Math.max(0, value + noise);
}

function buildStreamCompFromResult(res) {
  const format = (value, decimals) => applyMeasurementNoise(value).toFixed(decimals);
  return {
    Y1: format(res.y1, 1),
    Y2: format(res.y2, 1),
    Y3: format(res.y3, 1),
    Y4: format(y4, 1),
    X0: format(x0, 2),
    X1: format(res.x1, 2),
    X2: format(res.x2, 2),
    X3: format(res.x3, 2)
  };
}

let streamComp = buildStreamCompFromResult(result);

function getDisplayStreamValue(label) {
  if (!streamComp.hasOwnProperty(label)) return null;
  const liquidFlowing = pumpOn && nozzleOn;
  const gasFlowing = isGasValveOpen;
  const isXVal = label.startsWith('X');
  const isYVal = label.startsWith('Y');

  if (isXVal) {
    if (liquidFlowing && gasFlowing) {
      return streamComp[label];
    }
    if (liquidFlowing && !gasFlowing) {
      return '0.35';
    }
    return null;
  }

  if (isYVal) {
    if (liquidFlowing && gasFlowing) {
      return streamComp[label];
    }
    if (gasFlowing && !liquidFlowing) {
      return '1.0';
    }
    return null;
  }

  return streamComp[label];
}

function initTooltips() {
  moleFractionTooltip = uiGroup.group().hide();
  tooltipRect = moleFractionTooltip
  .rect(1, 1)
  .fill({ color: '#fff' })
  .stroke({ color: '#000', width: 1 });
  tooltipText = moleFractionTooltip
  .text('')
  .font({ size: 16, family: 'Arial' })
  .fill('#000');
}

function showTooltip(label, event) {
  // If this is a column stream label, show the computed comp.
  if (streamComp.hasOwnProperty(label)) {
    const compVal = getDisplayStreamValue(label);
    if (compVal === null) return;

    tooltipText.clear().text(compVal + " ppm");
    // redraw tooltip background
    setTimeout(() => {
      const bbox = tooltipText.bbox();
      const padding = 5;
      tooltipRect.size(bbox.width + 2 * padding, bbox.height + 2 * padding)
      .move(bbox.x - padding, bbox.y - padding);
    }, 0);
    const pt = draw.node.createSVGPoint();
    pt.x = event.clientX; pt.y = event.clientY;
    const svgP = pt.matrixTransform(draw.node.getScreenCTM().inverse());
    moleFractionTooltip.attr({ opacity: 1 }).move(svgP.x + 10, svgP.y + 10).front().show();
    return;
  }
  const data = moleFractions[label];
  if (!data) return;
  
  tooltipText.clear().text(function(add) {
    add.plain("X");
    add.tspan("AA").attr({ style: "font-size:0.7em;" });
    add.plain(" = " + data.xAA + ", X");
    add.tspan("C").attr({ style: "font-size:0.7em;" });
    add.plain(" = " + data.xC + ", X");
    add.tspan("W").attr({ style: "font-size:0.7em;" });
    add.plain(" = " + data.xW);
  });
  
  setTimeout(() => {
    let bbox = tooltipText.bbox();
    const padding = 5;
    tooltipRect.size(bbox.width + 2 * padding, bbox.height + 2 * padding)
    .move(bbox.x - padding, bbox.y - padding);
  }, 0);
  
  const pt = draw.node.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(draw.node.getScreenCTM().inverse());
  moleFractionTooltip.attr({ opacity: 1 }).front();
  moleFractionTooltip.move(svgP.x + 10, svgP.y + 10).front().show();
}

function hideTooltip() {
  moleFractionTooltip.attr({ opacity: 0 });
}

function drawCanvas() {
  draw.clear();
  pipeGroup = draw.group();
  waterGroup = draw.group();
  uiGroup = draw.group();
  gasGroup = draw.group();
  initTooltips()
  drawRectangleWithThreeSquares(canvasWidth / 2, canvasHeight / 2 - 50, 150, 350);
  drawPipes();
  drawPumps();
  drawPumpSVG(draw, 200, 340, 4, 4);
  drawGasValves();
  drawTanks();
  drawTexts();
  // createConnectedGauges(655, 195, "1")
  gasImage = addSVGImage('./assets/gasFlowRateDevice.svg', 700, 247.5, 800/3, 200);
  gasFlowRateText = drawCenteredText(810, 280, `0 
    mol/s`, 20, 'black', 'Arial', 'black', 0.4, 'normal');
  drawCenteredText(795, 377, "gas flow rate", 12, 'white', 'Arial', 'white', 0.7)
  addOptionToDragAndZoom();
  
  // Set layering: pipes at bottom, water in middle, UI on top.
  pipeGroup.back();
  waterGroup.front();
  uiGroup.front();
}

function drawTanks() {
  feedLiquidElement = drawLiquidRectangle(100, canvasHeight, 125, 10, 125 - 20, '#c1c1ff', 0.7);
  pipeGroup.add(feedLiquidElement);
  drawBracket(100, canvasHeight, 125, 125, 10, 20, 1000);
  drawBracket(475, canvasHeight, 125, 125, 10, 20, 1000);
  extractLiquidElement = drawLiquidRectangle(475, canvasHeight, 125, 10, 0, '#c1c1ff', 0.7);
  pipeGroup.add(extractLiquidElement);
  drawGasCylinder(650, canvasHeight - mainCylHeight, "feed tank");
}

function drawBracket(startX, startY, width, height, surfaceWidth, holderLength, maxVolume, liquidColor = '#c1c1ff', liquidColorOpacity = 0.7) {
  const d = holderLength / Math.sqrt(2);
  
  const P0 = { x: startX, y: startY };
  const P1 = { x: startX - width / 2, y: startY };
  const P2 = { x: P1.x, y: startY - height };
  const P3 = { x: P2.x - d, y: P2.y - d };
  const P4 = { x: P3.x + surfaceWidth, y: P3.y - surfaceWidth };
  const P5 = { x: P4.x + d, y: P4.y + d };
  const P6 = { x: P5.x, y: startY - surfaceWidth };
  const P7 = { x: startX, y: P6.y };
  
  const Q1 = { x: startX + width / 2, y: startY };
  const Q2 = { x: Q1.x, y: startY - height };
  const Q3 = { x: Q2.x + d, y: Q2.y - d };
  const Q4 = { x: Q3.x - surfaceWidth, y: Q3.y - surfaceWidth };
  const Q5 = { x: Q4.x - d, y: Q4.y + d };
  const Q6 = { x: Q5.x, y: startY - surfaceWidth };
  const Q7 = { x: startX, y: Q6.y };
  
  const points = [P0, P1, P2, P3, P4, P5, P6, P7, Q6, Q5, Q4, Q3, Q2, Q1, P0];
  const pointString = points.map(pt => `${pt.x},${pt.y}`).join(" ");
  
  let bracket = draw.polyline(pointString)
  .fill('#e6e6e6')
  .stroke({ color: '#898989', width: 2 });
  pipeGroup.add(bracket);
  
  let tickInterval = 10;
  let index = 250;
  if (maxVolume === 1000) {
    index = 250;
    tickInterval = 20;
  } else if (maxVolume === 300) {
    index = 100;
    tickInterval = 10;
  } else if (maxVolume === 500) {
    index = 250;
    tickInterval = 10;
  }
  const numTicks = maxVolume / tickInterval;
  const liquidMaxHeight = height - 2 * surfaceWidth;
  const bottomY = startY - surfaceWidth;
  const leftX = startX - (width - 2 * surfaceWidth) / 2;
  
  for (let i = 0; i <= numTicks; i++) {
    const tickVolume = i * tickInterval;
    const tickLength = (tickVolume % 50 === 0) ? 20 : 10;
    const tickY = bottomY - (tickVolume / maxVolume) * liquidMaxHeight;
    let tick = draw.line(leftX, tickY, leftX + tickLength, tickY)
    .stroke({ color: '#000', width: 1 });
    pipeGroup.add(tick);
    
    if (tickVolume % index === 0 && tickVolume !== 0) {
      const textLabel = draw.text(tickVolume.toString() + " mL")
      .font({ family: 'Arial', size: 10 })
      .move(leftX + tickLength + 2, tickY - 5);
      textLabel.attr({ 'text-anchor': 'start' });
      uiGroup.add(textLabel);
    }
  }
}

function drawRectangleWithThreeSquares(centerX, centerY, rectWidth, rectHeight) {
  const startX = centerX - rectWidth / 2;
  const startYMain = centerY - rectHeight / 2;
  
  let mainRect = draw.rect(rectWidth, rectHeight)
  .move(startX, startYMain)
  .fill('none')
  .stroke({ color: '#000', width: 2 });
  pipeGroup.add(mainRect);
  
  const squareSize = rectWidth - 60;
  const gap = (rectHeight - 3 * squareSize) / 4;
  
  for (let i = 0; i < 3; i++) {
    const xPos = startX + (rectWidth - squareSize) / 2;
    const yPos = startYMain + gap + i * (squareSize + gap);
    let square = draw.rect(squareSize, squareSize)
    .move(xPos, yPos)
    .fill('#ccc')
    .stroke({ color: '#000', width: 1 });
    pipeGroup.add(square);
  }
}

function drawLiquidRectangle(startX, startY, width, surfaceWidth, liquidHeight, fillColor = '#c1c1ff', fillOpacity = 0.7) {
  const rectWidth = width - 2 * surfaceWidth;
  const rectX = startX - rectWidth / 2;
  const rectY = startY - surfaceWidth;
  
  const pathString = `
    M ${rectX} ${rectY}
    L ${rectX + rectWidth} ${rectY}
    L ${rectX + rectWidth} ${rectY - liquidHeight}
    L ${rectX} ${rectY - liquidHeight}
    Z
  `;
  
  let liquid = draw.path(pathString)
  .fill({ color: fillColor, opacity: fillOpacity });
  
  return liquid;
}

function drawPipeWithCurves(pathString, pipeWidth = 15, strokeColor = '#f7f7f7', outlineColor = '#d5d5d5') {
  let outline = draw.path(pathString)
  .fill('none')
  .stroke({
    color: outlineColor,
    width: pipeWidth + 4,
    linejoin: 'round'
  });
  pipeGroup.add(outline);
  let pipe = draw.path(pathString)
  .fill('none')
  .stroke({
    color: strokeColor,
    width: pipeWidth,
    linejoin: 'round'
  });
  pipeGroup.add(pipe);
}

function drawPipes() {
  let startX = 100;
  let startY = canvasHeight - 12;
  
  // Left pipe segments
  leftPipe = `
    M ${startX} ${startY} 
    L ${startX} ${372.5}
    L ${startX + 50} ${372.5}  
  `;
  drawPipeWithCurves(leftPipe);

  leftPipe1 = `
  M ${startX + 65} ${327}
  L ${startX + 65} ${50} 
  L ${startX + 375} ${50} 
  L ${startX + 375} ${73.5} 
  `;
  drawPipeWithCurves(leftPipe1);
  
  leftPipe2 = `
    M ${startX + 375} ${94.5 + 91} 
    L ${startX + 375} ${94.5 + 91 + 19} 
  `;
  drawPipeWithCurves(leftPipe2);
  
  leftPipe3 = `
    M ${startX + 375} ${94.5 + 91 + 19 + 91} 
    L ${startX + 375} ${94.5 + 91 + 19 + 91 + 19} 
  `;
  drawPipeWithCurves(leftPipe3);
  
  leftPipe4 = `
    M ${startX + 375} ${94.5 + 91 + 19 + 91 + 19 + 91} 
    L ${startX + 375} ${startY} 
  `;
  drawPipeWithCurves(leftPipe4);
  
  // Right pipe segments
  startX = 700;
  rightPipe = `
    M ${675 + 5} ${canvasHeight - mainCylHeight - 100} 
    L ${675 + 5} ${canvasHeight - mainCylHeight - 100 - 100} 
    L ${675 - 50} ${canvasHeight - mainCylHeight - 100 - 100}
    L ${675 - 50} ${startY - 130 - 17}
    L ${startX - 170} ${startY - 130 - 17} 
    L ${startX - 170} ${startY - 182.5}
  `;
  drawPipeWithCurves(rightPipe, 4);
  
  rightPipe2 = `
    M ${startX - 170} ${94.5 + 91 + 19 + 91 + 19}
    L ${startX - 170} ${94.5 + 91 + 19 + 91}  
  `;
  drawPipeWithCurves(rightPipe2, 4);
  
  rightPipe3 = `
    M ${startX - 170} ${94.5 + 91 + 19} 
    L ${startX - 170} ${94.5 + 91} 
  `;
  drawPipeWithCurves(rightPipe3, 4);
  
  rightPipe4 = `
    M ${startX - 170} ${94.5} 
    L ${startX - 170} ${50} 
    L ${startX + 50} ${50}
    L ${startX + 50} ${startY - 200}
    L ${startX + 200} ${startY - 200}
  `;
  drawPipeWithCurves(rightPipe4, 4);
  
  rightPipe5 = `
    M ${680} ${canvasHeight - mainCylHeight - 65} 
    L ${680} ${canvasHeight - mainCylHeight} 
  `;
  
  drawPipeWithCurves(rightPipe5, 4, 'red');
}

function drawTap(valveCenterX, valveCenterY, radius, opacity = 1) {
  const valveGroup = uiGroup.group();
  valveGroup.circle(40)
  .fill({ color: '#b4b4ff', opacity: opacity })
  .stroke({ color: 'black', opacity: opacity, width: 2 })
  .center(valveCenterX, valveCenterY)
  .front();
  valveGroup.rect(10, 44)
  .fill({ color: '#c8c8ff', opacity: opacity })
  .stroke({ color: 'black', opacity: opacity, width: 2, linecap: 'round' })
  .center(valveCenterX, valveCenterY)
  .front();
  return valveGroup;
}

function drawTexts() {
  const offsetX = 10;
  let startX = 310;
  let startY = 450;

  // Number labels
  drawCenteredText(startX - 55 + 179.5 - 5 + 65 + offsetX, startY - 320, "1", 20);
  drawCenteredText(startX - 55 + 179.5 - 5 + 65 + offsetX, startY - 210, "2", 20);
  drawCenteredText(startX - 55 + 179.5 - 5 + 65 + offsetX, startY - 100, "3", 20);

  // X0
  let textF = draw.text(function(add) {
    add.plain("x");
    add.tspan("0").attr({ dy: 4, 'font-size': 12 });
  }).move(startX - 55 + 179.5 - 5 + offsetX, startY - 375)
    .font({ family: 'Arial', size: 16, anchor: 'middle' });
  uiGroup.add(textF);
  textF.on('mouseover', (event) => showTooltip("X0", event));
  textF.on('mouseout', hideTooltip);

  // X1
  let textR1 = draw.text(function(add) {
    add.plain("x");
    add.tspan("1").attr({ dy: 4, 'font-size': 12 });
  }).move(startX - 55 + 179.5 - 5 + offsetX, startY - 270)
    .font({ family: 'Arial', size: 16, anchor: 'middle' });
  uiGroup.add(textR1);
  textR1.on('mouseover', (event) => showTooltip("X1", event));
  textR1.on('mouseout', hideTooltip);

  // X2
  let textR2 = draw.text(function(add) {
    add.plain("x");
    add.tspan("2").attr({ dy: 4, 'font-size': 12 });
  }).move(startX - 55 + 179.5 - 5 + offsetX, startY - 160)
    .font({ family: 'Arial', size: 16, anchor: 'middle' });
  uiGroup.add(textR2);
  textR2.on('mouseover', (event) => showTooltip("X2", event));
  textR2.on('mouseout', hideTooltip);

  // X3
  let textR3 = draw.text(function(add) {
    add.plain("x");
    add.tspan("3").attr({ dy: 4, 'font-size': 12 });
  }).move(startX - 55 + 179.5 - 5 + offsetX, startY - 50)
    .font({ family: 'Arial', size: 16, anchor: 'middle' });
  uiGroup.add(textR3);
  textR3.on('mouseover', (event) => showTooltip("X3", event));
  textR3.on('mouseout', hideTooltip);

  // Y1
  let textE1 = draw.text(function(add) {
    add.plain("y");
    add.tspan("1").attr({ dy: 4, 'font-size': 12 });
  }).move(startX - 55 + 179.5 - 5 + 120 + offsetX, startY - 375)
    .font({ family: 'Arial', size: 16, anchor: 'middle' });
  uiGroup.add(textE1);
  textE1.on('mouseover', (event) => showTooltip("Y1", event));
  textE1.on('mouseout', hideTooltip);

  // Y2
  let textE2 = draw.text(function(add) {
    add.plain("y");
    add.tspan("2").attr({ dy: 4, 'font-size': 12 });
  }).move(startX - 55 + 179.5 - 5 + 120 + offsetX, startY - 270)
    .font({ family: 'Arial', size: 16, anchor: 'middle' });
  uiGroup.add(textE2);
  textE2.on('mouseover', (event) => showTooltip("Y2", event));
  textE2.on('mouseout', hideTooltip);

  // Y3
  let textE3 = draw.text(function(add) {
    add.plain("y");
    add.tspan("3").attr({ dy: 4, 'font-size': 12 });
  }).move(startX - 55 + 179.5 - 5 + 120 + offsetX, startY - 160)
    .font({ family: 'Arial', size: 16, anchor: 'middle' });
  uiGroup.add(textE3);
  textE3.on('mouseover', (event) => showTooltip("Y3", event));
  textE3.on('mouseout', hideTooltip);

  // Y4
  let textS = draw.text(function(add) {
    add.plain("y");
    add.tspan("4").attr({ dy: 4, 'font-size': 12 });
  }).move(startX - 55 + 179.5 - 5 + 120 + offsetX, startY - 50)
    .font({ family: 'Arial', size: 16, anchor: 'middle' });
  uiGroup.add(textS);
  textS.on('mouseover', (event) => showTooltip("Y4", event));
  textS.on('mouseout', hideTooltip);
}

function drawCenteredText(centerX, centerY, text, fontSize = 16, fillColor = '#000', fontFamily = 'Arial', strokeColor = null, strokeWidth = 0, fontWeight = 'normal') {
  const textElement = draw.text(text)
  .font({
    family: fontFamily,
    size: fontSize,
    anchor: 'middle',
    weight: fontWeight,
    leading: '1em'
  })
  .move(centerX, centerY)
  .fill(fillColor);
  textElement.attr('dominant-baseline', 'middle');
  if (strokeColor && strokeWidth > 0) {
    textElement.stroke({ color: strokeColor, width: strokeWidth });
  }
  uiGroup.add(textElement);
  return textElement;
}

// ======================================================
// FILLING FUNCTIONS & DISPLAY UPDATES
// ======================================================

function animateWaterFlow(pipePath, delay = 0, duration = 1000, waterColor, waterWidth = 16, opacity = 0.5, side) {
  const water = draw.path(pipePath)
  .fill('none')
  .stroke({
    color: waterColor,
    opacity: opacity,
    width: waterWidth,
    linejoin: 'round'
  });
  if (side == 'left') {
    waterGroup.add(water);
  } else {
    gasGroup.add(water);
  }
  const totalLength = water.node.getTotalLength();
  water.attr({
    'stroke-dasharray': totalLength,
    'stroke-dashoffset': totalLength
  });
  water.delay(delay).animate(duration).attr({ 'stroke-dashoffset': 0 });
  if (side) {
    water.attr('data-pipe-side', side);
  }
  pump.front();
  return water;
}

// --- FLOW CONTROL VARIABLES ---
let pumpOn = false;
let nozzleOn = false;
let flowInterval = null;
const FLOW_RATE = 18; // ml per second

function drawPumps() {
  const startX = pump1StartX;
  const startY = pump1StartY;
  drawLineBetweenPoints(draw, startX + 100, startY - 45, startX + 110, startY + 20, 1);
  toggle = drawTap(startX - 75, startY - 190, 30, 1);
  toggle.rotate(90, startX, startY - 125);
  // Make toggle group pointer-sensitive and show pointer cursor
  toggle.attr({ 'pointer-events': 'all', 'cursor': 'pointer' });
  pump = createToggleWithTextRect(draw, startX + 100, startY, 100, 40, 1);
  // Make pump group pointer-sensitive and show pointer cursor
  pump.attr({ 'pointer-events': 'all', 'cursor': 'pointer' });
  // Enable pump toggle and update flow when clicked
  pump.click(() => {
    pumpOn = !pumpOn;
    updateFlow();
    console.log("Pump is " + (pumpOn ? "ON" : "OFF"));
  });
  toggle.front();
  // Enable nozzle toggle and update flow when clicked
  toggle.isOpen = false;
  toggle.click(() => {
    toggle.isOpen = !toggle.isOpen;
    nozzleOn = toggle.isOpen;
    if (nozzleOn) {
      toggle.animate(300).rotate(90);
    } else {
      toggle.animate(300).rotate(-90);
    }
    updateFlow();
    console.log("Nozzle is " + (nozzleOn ? "ON" : "OFF"));
  });
}

function drawGasValves() {
  gasValve = createVerticalValve(675 - 2.5, canvasHeight - mainCylHeight - 100)
  
  const pipeSequence = {
    right: [
      { pipe: rightPipe, key: 'rightPipe' },
      { pipe: rightPipe2, key: 'rightPipe2' },
      { pipe: rightPipe3, key: 'rightPipe3' },
      { pipe: rightPipe4, key: 'rightPipe4' },
      { pipe: rightPipe5, key: 'rightPipe5' }
    ]
  };
  
  gasValve.click(() => {
    console.log(gasValve.isOpen);
    if (gasValve.isOpen) {
      // Remove any existing water animations
      const duration = 100;
      const pipeDelay = 0;     // animation duration per pipe (ms)
      let delay = 0;
      pipeSequence.right.forEach(({ pipe }) => {
        animateWaterFlow(pipe, delay, duration, "red", 4, 1, 'right');
        delay += duration + pipeDelay;
        if (pipe === rightPipe4) {
          setTimeout(() => {
            gasFlowRateText.text(`0.01 
              mol/s`);
            gasFlowRateText.front();
          }, duration * 8);
        }
      });
      isGasValveOpen = true;
    } else{
      gasFlowRateText.text(`0 
        mol/s`);
      gasGroup.clear();
      isGasValveOpen = false;
    }
  });
}


/**
* Start or stop the water flow based on pumpOn && nozzleOn.
*/
function updateFlow() {
  // Stop existing interval if flags are false
  const pipeSequence = {
    left: [
      { pipe: leftPipe, key: 'leftPipe' },
      { pipe: leftPipe1, key: 'leftPipe1' },
      { pipe: leftPipe2, key: 'leftPipe2' },
      { pipe: leftPipe3, key: 'leftPipe3' },
      { pipe: leftPipe4, key: 'leftPipe4' }
    ]
  };
  
  if (!pumpOn || !nozzleOn) {
    if (flowInterval) {
      clearInterval(flowInterval);
      flowInterval = null;
      console.log("Flow stopped");
    }
    // Remove any existing water animations
    waterGroup.clear();
    return;
  }
  // Start flow if both are on and not already flowing
  if (!flowInterval && (feedTankVolume > 0 || extractTankVolume < maxTankVolume)) {
    const intervalMs = 1000;
    const feedRate = 18;   // ml per second
    const extractRate = 18;   // ml per second
    const pipeDelay = 200;    // delay between pipes (ms)
    const duration = 100;     // animation duration per pipe (ms)
    let delay = 0;
    pipeSequence.left.forEach(({ pipe }) => {
      animateWaterFlow(pipe, delay, duration, "#c1c1ff", 16, 0.7, 'left');
      delay += duration + pipeDelay;
    });
    flowInterval = setInterval(() => {
      // Animate all left pipes
      // Decrease feed tank
      feedTankVolume = Math.max(0, feedTankVolume - feedRate * (intervalMs / 1000));
      feedLiquidElement.remove();
      feedHeightPx = (feedTankVolume / maxTankVolume) * (125 - 2 * 10);
      feedLiquidElement = drawLiquidRectangle(100, canvasHeight, 125, 10, feedHeightPx, '#c1c1ff', 0.7);
      pipeGroup.add(feedLiquidElement);
      // After water travels, increase extract tank
      setTimeout(() => {
        extractTankVolume = Math.min(maxTankVolume, extractTankVolume + extractRate * (intervalMs / 1000));
        extractLiquidElement.remove();
        extractHeightPx = (extractTankVolume / maxTankVolume) * (125 - 2 * 10);
        extractLiquidElement = drawLiquidRectangle(475, canvasHeight, 125, 10, extractHeightPx, '#c1c1ff', 0.7);
        pipeGroup.add(extractLiquidElement);
      }, delay);
      console.log(feedTankVolume, extractTankVolume);
      if (feedTankVolume <= 0 || extractTankVolume >= maxTankVolume) {
        console.log("Flow halted: tank limits reached");
        clearInterval(flowInterval);
        flowInterval = null;
        waterGroup.clear();
        // Turn off flags
        pumpOn = false;
        nozzleOn = false;
        // Reset pump UI
        if (pump && pump.handle) {
          pump.isOn = false;
          // startX + 50, startY - 150, 100, 40
          pump.handle.animate(200).rotate(-40, pump1StartX + 50 + 50, pump1StartY - 150 + 20);
        }
        // Reset nozzle UI
        if (toggle) {
          toggle.isOpen = false;
          toggle.animate(300).rotate(-90);
        }
        console.log("Flow halted: tank limits reached");
      }
    }, intervalMs);
    console.log("Flow started");
  }
}


function resetAll() {
  // Remove any open pressure modals
  document.querySelectorAll('.pressure-modal').forEach(m => m.remove());
  // Reset pressure to default
  P = 1.0;
  // Recompute and reset tooltip data
  const initRes = computeStageCompositions(L, V, x0, y4);
  result = initRes;
  streamComp = buildStreamCompFromResult(initRes);
  // Stop any ongoing flow interval
  if (flowInterval) {
    clearInterval(flowInterval);
    flowInterval = null;
  }
  // Reset pump and nozzle flags
  pumpOn = false;
  nozzleOn = false;
  // Reset tank volumes
  feedTankVolume = maxTankVolume;
  extractTankVolume = 0;
  isGasValveOpen = false;
  // Reset liquid elements
  if (feedLiquidElement) feedLiquidElement.remove();
  if (extractLiquidElement) extractLiquidElement.remove();
  // Clear water and gas animations/text
  if (waterGroup) waterGroup.clear();
  if (gasGroup) gasGroup.clear();
  if (gasFlowText) { gasFlowText.remove(); gasFlowText = null; }
  pump.isOn = false;
  toggle.isOpen = false;
  draw.clear();
  drawCanvas();
}

document.getElementById('reset-button').addEventListener('click', resetAll);

function addOptionToDragAndZoom() {
  uiGroup.add(
    draw.text("Zoom with the scroll wheel.")
    .move(canvasWidth / 2 - 150, 0)
    .font({ size: 16, anchor: 'left' })
  );
  uiGroup.add(
    draw.text("After zooming, drag mouse to move image.")
    .move(canvasWidth / 2 - 150, 15)
    .font({ size: 16, anchor: 'left' })
  );
  const defaultViewbox = { x: 0, y: 0, width: canvasWidth, height: canvasHeight };
  draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
  
  const background = draw.rect(canvasWidth, canvasHeight)
  .fill({ color: '#fff', opacity: 0 });
  background.back();
  
  draw.on('mousedown', function(event) {
    const vb = draw.viewbox();
    if (vb.width >= defaultViewbox.width) return;
    isPanning = true;
    panStart = { x: event.clientX, y: event.clientY };
  });
  
  draw.on('mousemove', function(event) {
    if (!isPanning) return;
    event.preventDefault();
    const dx = event.clientX - panStart.x;
    const dy = event.clientY - panStart.y;
    const vb = draw.viewbox();
    if (vb.width < defaultViewbox.width) {
      draw.viewbox(vb.x - dx, vb.y - dy, vb.width, vb.height);
    }
    panStart = { x: event.clientX, y: event.clientY };
  });
  
  draw.on('mouseup', function() {
    isPanning = false;
  });
  
  document.addEventListener('mouseup', () => {
    isPanning = false;
  });
  
  draw.on('wheel', function(event) {
    event.preventDefault();
    const zoomStep = 0.02;
    const zoomFactor = event.deltaY < 0 ? (1 - zoomStep) : (1 + zoomStep);
    const vb = draw.viewbox();
    let newWidth = vb.width * zoomFactor;
    let newHeight = vb.height * zoomFactor;
    if (newWidth >= defaultViewbox.width) {
      draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
      return;
    }
    const pt = draw.node.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    const cursor = pt.matrixTransform(draw.node.getScreenCTM().inverse());
    let newX = cursor.x - (cursor.x - vb.x) * zoomFactor;
    let newY = cursor.y - (cursor.y - vb.y) * zoomFactor;
    newX = Math.max(0, Math.min(newX, canvasWidth - newWidth));
    newY = Math.max(0, Math.min(newY, canvasHeight - newHeight));
    draw.viewbox(newX, newY, newWidth, newHeight);
  });
}

function createConnectedGauges(x, y, gaugeId) {
  // Separate group for lines, added first to stay behind
  const lineGroup = draw.group();

  // Main group for gauges and hexagon
  const group = draw.group().attr({ id: gaugeId });

  const leftGaugeX = x;
  const rightGaugeX = x + connectedGaugeSize;
  const hexagonX = x + connectedGaugeSize / 2;
  const hexagonY = y + connectedGaugeVerticalOffset;

  // Draw lines in the background group
  lineGroup.line(hexagonX, hexagonY, leftGaugeX, y)
    .stroke({ color: '#666', width: 4 });

  lineGroup.line(hexagonX, hexagonY, rightGaugeX, y)
    .stroke({ color: '#666', width: 4 });

  // Create gauges and hexagon
  const leftGauge = createPressureGaugeView(draw, leftGaugeX, y);
  const rightGauge = createPressureGaugeView(draw, rightGaugeX, y);
  const hexagon = createHexagonalView(draw, hexagonX, hexagonY);

  // Add them to main group
  group.add(leftGauge);
  group.add(rightGauge);
  group.add(hexagon);

  group.click(event => {
    // Remove any existing pressure modals
    document.querySelectorAll('.pressure-modal').forEach(m => m.remove());
    const modal = document.createElement('div');
    modal.className = 'pressure-modal';
    // Position modal at click location
    modal.style.position = 'absolute';
    modal.style.left = `${event.clientX}px`;
    modal.style.top = `${event.clientY}px`;
    // modal.style.position = 'fixed';
    // modal.style.left = '50%';
    // modal.style.top = '50%';
    // modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = 'white';
    modal.style.border = '2px solid black';
    modal.style.padding = '20px';
    modal.style.zIndex = 1000;
    modal.style.borderRadius = '8px';

    const message = document.createElement('p');
    message.textContent = 'Select pressure (bar):';
    modal.appendChild(message);

    // Insert current pressure display here
    const currentDisplay = document.createElement('p');
    currentDisplay.textContent = `Current pressure: ${P.toFixed(0)} bar`;
    currentDisplay.style.fontWeight = 'bold';
    currentDisplay.style.marginBottom = '10px';
    modal.appendChild(currentDisplay);

    const option1 = document.createElement('button');
    option1.textContent = '1 bar';
    option1.className = 'btn btn-primary';
    option1.onclick = () => {
      updateGaugePressure(1);
      document.body.removeChild(modal);
    };

    const option4 = document.createElement('button');
    option4.textContent = '4 bar';
    option4.className = 'btn btn-primary';
    option4.onclick = () => {
      updateGaugePressure(4);
      document.body.removeChild(modal);
    };

    // Create a button container for spacing and alignment
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.marginTop = '10px';
    btnContainer.appendChild(option1);
    btnContainer.appendChild(option4);
    modal.appendChild(btnContainer);

    document.body.appendChild(modal);
    // Close modal on outside click
    setTimeout(() => {
      const outsideClickListener = (e) => {
        const m = document.querySelector('.pressure-modal');
        if (m && !m.contains(e.target)) {
          m.remove();
          document.removeEventListener('mousedown', outsideClickListener);
        }
      };
      document.addEventListener('mousedown', outsideClickListener);
    }, 0);
  });

  return group;
}

function updateGaugePressure(pressureValue) {
  P = pressureValue;
  // Recompute stage compositions with updated pressure
  const newRes = computeStageCompositions(L, V, x0, y4);
  // Update globals
  result = newRes;
  // Update streamComp so tooltips use fresh values with new noise
  streamComp = buildStreamCompFromResult(newRes);
}

function createPressureGaugeView(draw, x, y) {
  const group = draw.group();

  group.circle(gaugeSize)
    .fill('white')
    .stroke({ color: '#888', width: gaugeStrokeWidth })
    .center(x, y);

  const radius = (gaugeSize / 2) - gaugeStrokeWidth - 2;
  const startAngle = 220;
  const endAngle = -40;
  const startRad = startAngle * Math.PI / 180;
  const endRad = endAngle * Math.PI / 180;
  const startX = x + radius * Math.cos(startRad);
  const startY = y + radius * Math.sin(startRad);
  const endX = x + radius * Math.cos(endRad);
  const endY = y + radius * Math.sin(endRad);
  const arcPath = `M ${startX} ${startY} A ${radius} ${radius} 0 1 0 ${endX} ${endY}`;

  group.path(arcPath)
    .fill('none')
    .stroke({ color: 'black', width: 2 });

  const needleLength = radius - 2;
  const needleWidth = 4;
  group.path(`M ${x} ${y}
                L ${x - needleWidth/2} ${y}
                L ${x} ${y - needleLength}
                L ${x + needleWidth/2} ${y} Z`)
    .fill('black')
    .transform({ rotate: 45, cx: x, cy: y }); // Example rotation
  return group;
}

function createHexagonalView(draw, x, y) {
  const group = draw.group();

  group.circle(hexCircleSize)
    .fill('white')
    .stroke({ color: '#888', width: 4 })
    .center(x, y);

  const height = hexSize * Math.sqrt(3);
  const hexagonPath = `
        M ${x - hexSize} ${y}
        L ${x - hexSize/2} ${y - height/2}
        L ${x + hexSize/2} ${y - height/2}
        L ${x + hexSize} ${y}
        L ${x + hexSize/2} ${y + height/2}
        L ${x - hexSize/2} ${y + height/2}
        Z
    `;
  group.path(hexagonPath)
    .fill('black')
    .stroke({ color: 'black', width: 1 });

  group.circle(hexInnerCircleSize)
    .fill('white')
    .center(x, y);

  return group;
}

function createToggleWithTextRect(draw, x, y, width, height, opacity = 1) {
  const switchGroup = uiGroup.group();
  switchGroup.isOn = false;
  const handleWidth = 5;
  const handleHeight = height * 0.8;
  const handle = switchGroup.rect(handleWidth, handleHeight)
  .fill({ color: '#aaa', opacity: opacity })
  .move(x + (width - handleWidth) / 2, y - height / 2);
  switchGroup.handle = handle;
  
  switchGroup.rect(width, height)
  .fill({ color: '#555', opacity: opacity })
  .radius(height / 5)
  .move(x, y);
  switchGroup.text('OFF')
  .font({ size: 12, anchor: 'middle', fill: '#fff' })
  .center(x + width * 0.25, y + height / 2);
  switchGroup.text('ON')
  .font({ size: 12, anchor: 'middle', fill: '#fff' })
  .center(x + width * 0.75, y + height / 2);
  
  handle.rotate(-20, x + width / 2, y + height / 2);
  switchGroup.click(() => {
    switchGroup.isOn = !(switchGroup.isOn);
    if (switchGroup.isOn) {
      handle.animate(200).rotate(40, x + width / 2, y + height / 2);
    } else {
      handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
    }
  });
  // Make the switch group pointer-sensitive and show pointer cursor
  switchGroup.attr({ 'pointer-events': 'all', 'cursor': 'pointer' });
  return switchGroup;
}

function drawLineBetweenPoints(draw, x1, y1, x2, y2, opacity = 1, color = '#000', width = 2) {
  let line = draw.line(x1, y1, x2, y2)
  .stroke({ color: color, opacity: opacity, width: width, linecap: 'round' });
  pipeGroup.add(line);
  return line;
}

function drawGasCylinder(x, y, label) {
  const group = draw.group();
  
  // Create gradient for cylinder body
  const cylinderGradient = draw.gradient('linear', function(add) {
    add.stop(0, '#a3a3a3');
    add.stop(0.5, '#666666');
    add.stop(1, '#a3a3a3');
  });
  cylinderGradient.from(0, 0).to(1, 0);
  
  group.path(`
        M ${x} ${y + 20}
        L ${x} ${y + mainCylHeight - 20}
        Q ${x} ${y + mainCylHeight} ${x + 20} ${y + mainCylHeight}
        L ${x + mainCylWidth - 20} ${y + mainCylHeight}
        Q ${x + mainCylWidth} ${y + mainCylHeight} ${x + mainCylWidth} ${y + mainCylHeight - 20}
        L ${x + mainCylWidth} ${y + 20}
        Q ${x + mainCylWidth} ${y} ${x + mainCylWidth - 20} ${y}
        L ${x + 20} ${y}
        Q ${x} ${y} ${x} ${y + 20}
        Z
    `)
    .fill(cylinderGradient)
    .stroke({ color: '#444', width: 1 });
    
    // Add nozzle (centered horizontally)
    const nozzleX = x + (mainCylWidth - nozzleRect3Width) / 2;
    createNozzle(draw, group, nozzleX, y - 12); // Pass draw and group
    
    // Add vertical label on cylinder
    group.text(function(add) {
      add.tspan(label).dx(x + mainCylWidth / 2).dy(y + mainCylHeight / 2);
    })
    .font({
      family: 'Arial',
      size: 20,
      anchor: 'middle',
      weight: 'bold'
    })
    .fill('white')
    .transform({ rotate: -90, cx: x + mainCylWidth / 2, cy: y + mainCylHeight / 2 });
    
    return group;
  }
  
  function createNozzle(draw, group, x, y) {
    // First rectangle
    group.rect(nozzleRect1Width, nozzleRect1Height)
    .fill('#ebebeb')
    .stroke({ color: '#444', width: 1 })
    .move(x, y);
    // Second rectangle
    const secondRectX = x + (nozzleRect1Width - nozzleRect2Width) / 2;
    group.rect(nozzleRect2Width, nozzleRect2Height)
    .fill('#c69c6d')
    .stroke({ color: '#444', width: 1 })
    .move(secondRectX, y - nozzleRect2Height);
    // Third rectangle with rounded corners
    group.rect(nozzleRect3Width, nozzleRect3Height)
    .fill('#ebebeb')
    .radius(4)
    .stroke({ color: '#444', width: 1 })
    .move(x, y - nozzleRect2Height - nozzleRect3Height);
  }
  
  function createVerticalValve(x, y) {
    
    const group = draw.group();
    group.isOpen = false;
    // Create valve body parts
    group.rect( verticalValveBlockWidth,  verticalValveBlockHeight)
    .fill('#ccc')
    .stroke({ color: '#444', width: 1 })
    .move(x, y);
    
    group.rect( verticalValveBodyWidth,  verticalValveBodyHeight)
    .fill('#ddd')
    .stroke({ color: '#444', width: 1 })
    .radius(6)
    .move(x, y +  verticalValveBlockHeight);
    
    group.rect( verticalValveBlockWidth,  verticalValveBlockHeight)
    .fill('#ccc')
    .stroke({ color: '#444', width: 1 })
    .move(x, y +  verticalValveBlockHeight +  verticalValveBodyHeight);
    
    const stemX = x -  verticalValveStemWidth;
    const stemY = y +  verticalValveBlockHeight + ( verticalValveBodyHeight -  verticalValveStemHeight) / 2;
    group.rect( verticalValveStemWidth,  verticalValveStemHeight)
    .fill('#000')
    .move(stemX, stemY);
    
    const extra = ( verticalValveTopExtent -  verticalValveStemHeight) / 2;
    const knob = group.path(`
        M ${stemX} ${stemY}
        L ${stemX -  verticalValveTrapezoidWidth} ${stemY - extra}
        L ${stemX -  verticalValveTrapezoidWidth} ${stemY +  verticalValveStemHeight + extra}
        L ${stemX} ${stemY +  verticalValveStemHeight}
        Z
    `)
      .fill('#000') // Start closed (black)
      .stroke({ color: '#444', width: 1 });
      
      group.click(() => {
        group.isOpen = !(group.isOpen);
        if (knob && typeof knob.animate === 'function') { // Check if knob exists and is animatable
          const color = group.isOpen ? '#ffa500' : '#000000';
          knob.animate(300).fill(color);
        } else if (knob) { // Fallback if animate isn't available (e.g., during reset redraw)
          const color = group.isOpen ? '#ffa500' : '#000000';
          knob.fill(color);
        }
      });
      
      return group;
    }
    
function addSVGImage(url, x = 0, y = 0, width, height) {
  const img = draw.image(url)
    .size(width, height)                      // force the element to the given dimensions
    .move(x, y)
    .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
  return img;
}
    
function drawPumpSVG(draw, x, y, scaleX, scaleY) {
      // create a grouped coordinate frame
      const g = draw.group()
      
      
      // colors
      const pumpColor     = '#b4b4ff'  // rgb(180,180,255)
      const pumpStroke    = 'black'  // rgb(140,140,225)
      const legColor      = '#a0a0f5'  // rgb(160,160,245)
      const heatFill      = '#c8c8ff'  // rgb(200,200,255)
      const heatStroke    = '#6464be'  // rgb(100,100,190)
      const baseColor     = '#a0a0f5'  // rgb(160,160,245)
      const outletColor   = '#aaaafa'  // rgb(170,170,250)
      const cableColor    = '#282828'  // rgb(40,40,40)
      
      // helper to draw a stroked polygon
      const poly = (pts, fillCol=pumpColor, strokeCol=pumpStroke, sw=0.15) =>
        g.polygon(pts).fill(fillCol).stroke({ color: strokeCol, width: sw })
      
      // 1) Pump nose
      poly([
        [-2,-4],[-3,-4],[-3,4],[-2,4],
        [-2,3.5],[4,3.5],[7,5],[7,6],
        [8,6],[8,-6],[7,-6],[7,-5],
        [4,-3.5],[-2,-3.5]
      ])
      // dividing lines
      g.line(-2,-4, -2,4).stroke({ color:pumpStroke, width:0.15 })
      g.line( 7,-6,  7,6).stroke({ color:pumpStroke, width:0.15 })
      
      // 2) Pump nose supports
      ;[ [4,-2, 7,-3],
      [-2,0, 7,0],
      [4,2, 7,3] ].forEach(l =>
        g.line(...l).stroke({ color:pumpStroke, width:0.4 })
      )
      
      // 3) Pump legs
      poly([[15,5],[12,8],[14,8],[17,5]], legColor, pumpStroke,0.15)
      poly([[28,5],[31,8],[29,8],[26,5]], legColor, pumpStroke,0.15)
      
      // 4) Pump body
      poly([
        [8,6],[9,6],[9,4],[10,4],[14,5.75],[15,6],
        [30,6],[30.5,5.5],[30.5,-5.5],[30,-6],[15,-6],
        [14,-5.75],[10,-4],[9,-4],[9,-6],[8,-6]
      ])
      g.line(9,6, 9,-6).stroke({ color:pumpStroke, width:0.15 })
      
      // 5) Pump heat sink
      for(let i=0; i<13; i++){
        g.rect(10, 0.25 + Math.abs(i-6)*0.075)
        .center(22.5, -6 + i)
        .fill(heatFill)
        .stroke({ color:heatStroke, width:0.1 })
      }
      
      // 6) Body supports
      ;[ [-3,  0, 11,  0],
      [ 9, -3, 11, -3],
      [ 9,  3, 11,  3] ].forEach(l=>
        g.line(...l).stroke({ color:pumpStroke, width:0.4 })
      )
      
      // 7) Pump base
      g.rect(34,2).move(-2,8).fill(baseColor).stroke({ color:pumpStroke, width:0.15 }).radius(0.25)
      
      // 8) Pump outlet
      g.rect(3.5,13).move(-0.5,-8).fill(outletColor).stroke({ color:outletColor, width:0.15 }).radius(2)
      g.line(-0.5,-8, 3,-8).stroke({ color: pumpStroke, width:0.15 })
      poly([[-0.5,-8],[-2,-10],[4.5,-10],[3,-8]], outletColor, pumpStroke,0.15)
      g.rect(9.5,1).move(-3.5,-11).fill(outletColor).stroke({ color:pumpStroke, width:0.15 })
      
      // 9) Power cable (a smooth poly‐bezier)
      // g.path('M30.5,0 Q33,0 35,-2 Q40,-8 35.5,-13 Q31,-18 18,-13')
      //  .fill('none')
      //  .stroke({ color:cableColor, width:0.3 })
      
      // 10) (Optional) your switch‐drawing helper
      // drawPumpSwitchSVG(g, /*…*/)
      g.move(x, y)
      .scale(scaleX, scaleY)
      .translate(0, 19)
      return g
    }
    drawCanvas();
