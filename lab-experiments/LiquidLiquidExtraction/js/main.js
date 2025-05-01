let windowWidth = window.innerWidth - 60;
let windowHeight = windowWidth * 600 / 1000;

const draw = SVG().addTo('#svg-container').size(windowWidth, windowHeight);

const canvasWidth = 1000;
const canvasHeight = 600;

// Change the viewport to 1000 x 600
document.getElementsByTagName('svg')[0].setAttribute('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

// Resize the canvas width and height when the window is resized
window.addEventListener('resize', function() {
  let windowWidth = window.innerWidth - 60;
  let windowHeight = windowWidth * 600 / 1000;
  draw.size(windowWidth, windowHeight);
});

// Global groups for layering (we declare them as let so we can reinitialize them on redraw)
let pipeGroup, waterGroup, uiGroup;

// GLOBAL FLAG FOR MEASURE MODE
let measureMode = false;

// ---------------------------
// TOOLTIP SETUP (placed in the UI group)
// ---------------------------
let densityTooltip, densityTooltipRect, densityTooltipText;
let moleFractionTooltip, tooltipRect, tooltipText;

function initTooltips() {
  densityTooltip = uiGroup.group().attr({ opacity: 0, pointerEvents: 'none' });
  densityTooltipRect = densityTooltip
    .rect(1, 1)
    .fill({ color: '#ffffcc' })  // light yellow background
    .stroke({ color: '#000', width: 1 });
  densityTooltipText = densityTooltip
    .text('')
    .font({ size: 12, family: 'Arial' })
    .fill('#000');

  moleFractionTooltip = uiGroup.group().hide();
  tooltipRect = moleFractionTooltip
    .rect(1, 1)
    .fill({ color: '#fff' })
    .stroke({ color: '#000', width: 1 });
  tooltipText = moleFractionTooltip
    .text('')
    .font({ size: 12, family: 'Arial' })
    .fill('#000');
}

// Functions to show/hide density tooltip
function showDensityTooltip(density, event) {
  densityTooltipText.clear().plain(density + " g/mL");
  setTimeout(() => {
    const padding = 5;
    let bbox = densityTooltipText.bbox();
    densityTooltipRect
      .size(bbox.width + 2 * padding, bbox.height + 2 * padding)
      .move(bbox.x - padding, bbox.y - padding);
  }, 0);

  // Position tooltip near the mouse pointer
  const pt = draw.node.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const svgP = pt.matrixTransform(draw.node.getScreenCTM().inverse());
  densityTooltip.move(svgP.x + 10, svgP.y + 10).attr({ opacity: 1 }).front();
}

function hideDensityTooltip() {
  densityTooltip.attr({ opacity: 0 });
}

// ---------------------------
// ADD INVISIBLE OVERLAYS ON TANKS
// ---------------------------
function addDensityOverlay(x, y, width, height, density) {
  // Add the overlay to the uiGroup so it appears on top
  let overlay = uiGroup.rect(width, height).move(x, y).fill({ color: '#fff', opacity: 0 });
  overlay.on('mousemove', (event) => {
    showDensityTooltip(density, event);
  });
  overlay.on('mouseout', hideDensityTooltip);
}

  

function addDensityOverlays() {
  // Based on drawBracket() parameters, we assume each tank's bounding box is:
  // x: centerX - (width/2), y: canvasHeight - 125, width: provided width, height: 125
  // Feed Tank: drawn with drawBracket(100, canvasHeight, 125, 125, ...);
  let feedX = 100 - 125 / 2;
  let feedY = canvasHeight - 125;
  addDensityOverlay(feedX, feedY, 125, 125, "1.24");

  // Raffinate Tank: drawn with drawBracket(475, canvasHeight, 125 * 0.58, 125, ...);
  let raffWidth = 125 * 0.58;
  let raffX = 475 - raffWidth / 2;
  let raffY = canvasHeight - 125;
  addDensityOverlay(raffX, raffY, raffWidth, 125, "1.48");

  // Extract Tank: drawn with drawBracket(canvasWidth - 100, canvasHeight, 125, 125, ...);
  let extractX = (canvasWidth - 100) - 125 / 2;
  let extractY = canvasHeight - 125;
  addDensityOverlay(extractX, extractY, 125, 125, "1.04");

  // Solvent Tank: drawn with drawBracket(canvasWidth - 300, canvasHeight, 125 * 0.7, 125, ...);
  let solvWidth = 125 * 0.7;
  let solvX = (canvasWidth - 300) - solvWidth / 2;
  let solvY = canvasHeight - 125;
  addDensityOverlay(solvX, solvY, solvWidth, 125, "1.00");
}

// ---------------------------
// GLOBAL VARIABLES FOR TABLE, PUMPS, TANKS, ETC.
// ---------------------------
const tableWidth = canvasWidth - 500;
const tableHeight = 20;
const legWidth = 20;
const legHeight = 80;
const tableX = (canvasWidth - tableWidth) / 2;
const tableY = canvasHeight - legHeight - tableHeight;

let pump1 = null;   // Feed pump (auto-controlled)
let pump2 = null;   // Solvent pump (manually toggled)
let isRotatedPump1 = false; // (Not used for manual control on feed pump)
let isRotatedPump2 = false; // For solvent pump

let pump12 = null;  // Feed valve (auto-controlled; manual clicks disabled)
let pump22 = null;  // Solvent valve (manually toggled)

let leftPipe = null;
let leftPipe2 = null;
let leftPipe3 = null;
let leftPipe4 = null;

let rightPipe = null;
let rightPipe2 = null;
let rightPipe3 = null;
let rightPipe4 = null;

// GLOBAL VARIABLES FOR TANK FILLING (in mL)
let extractTankVolume = 0;   // This volume is used for the raffinate tank display
let raffinateTankVolume = 0; // This volume is used for the extract tank display
const maxTankVolume = 1000; 
const maxRaffinateVolume = 300; // Raffinate tank max volume
const maxSolventVolume = 500;   // Solvent tank max volume

const extractFillRate = 1.2;  // mL/s for extract tank (displayed in raffinate tank)
const raffinateFillRate = 8.1; // mL/s for raffinate tank (displayed in extract tank)

// Global variables to store drawn liquid elements so they can be updated.
let extractLiquidElement = null;
let raffinateLiquidElement = null;

// Global timers for filling:
let extractFillTimer = null;
let raffinateFillTimer = null;

// GLOBAL VARIABLES FOR DRAINING (in mL)
let feedTankVolume = maxTankVolume;
let solventTankVolume = maxSolventVolume;

const feedDrainRate = 5.6;   // mL/s for feed tank
const solventDrainRate = 3.2; // mL/s for solvent tank

let feedDrainTimer = null;
let solventDrainTimer = null;

// To hold the drawn liquid elements for feed and solvent tanks
let feedLiquidElement = null;
let solventLiquidElement = null;

// Global timeout IDs for scheduled filling
let leftFillTimeout = null;
let rightFillTimeout = null;

// Global timer for auto-starting the feed pump (after 6 sec)
let feedAutoStartTimer = null;

// Starting coordinates for pump1 and pump2:
const pump1StartX = 100;
const pump1StartY = 450; // pump1 is drawn at (100,325)
const pump2StartX = 700;
const pump2StartY = 450;

// ***** MOLE FRACTION TOOLTIP SETUP WITH BACKGROUND & BORDER *****
const moleFractions = {
  "F":  { flow: 6.9, xAA: 0.52, xC: 0.43, xW: 0.05 },
  "S":  { flow: 3.2, xAA: 0.00, xC: 0.00, xW: 1.00 },
  "E2": { flow: 4.4, xAA: 0.13, xC: 0.03, xW: 0.84 },
  "R1": { flow: 2.9, xAA: 0.27, xC: 0.60, xW: 0.13 },
  "E1": { flow: 8.4, xAA: 0.39, xC: 0.16, xW: 0.45 },
  "E3": { flow: 3.4, xAA: 0.02, xC: 0.01, xW: 0.97 },
  "R2": { flow: 1.9, xAA: 0.09, xC: 0.87, xW: 0.05 },
  "R3": { flow: 1.8, xAA: 0.05, xC: 0.93, xW: 0.02 }
};

function showTooltip(label, event) {
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
  // Clear the drawing and reinitialize groups
  draw.clear();
  pipeGroup = draw.group();
  waterGroup = draw.group();
  uiGroup = draw.group();
  
  // Initialize tooltips (which are added to uiGroup)
  initTooltips();
  
  // Draw background elements, pipes, pumps, tanks, texts, and overlays
  drawRectangleWithThreeSquares(canvasWidth / 2, canvasHeight / 2 - 50, 150, 350);
  drawPipes();
  drawPumps();
  drawTanks();
  drawTexts();
  addDensityOverlays();
  addOptionToDragAndZoom();
  
  // Set layering: pipes at bottom, water in middle, UI on top.
  pipeGroup.back();
  waterGroup.front();
  uiGroup.front();
}

function drawTanks() {
  // Feed Tank (max 1000 mL)
  feedLiquidElement = drawLiquidRectangle(100, canvasHeight, 125, 10, 125 - 20, 'red', 0.7);
  // Solvent Tank (max 500 mL)
  solventLiquidElement = drawLiquidRectangle(canvasWidth - 300, canvasHeight, 125 * 0.7, 10, 125 - 20, '#c1c1ff', 0.7);
  
  // Brackets for tanks
  drawBracket(100, canvasHeight, 125, 125, 10, 20, 1000);
  drawBracket(475, canvasHeight, 125 * 0.58, 125, 10, 20, maxRaffinateVolume);
  drawBracket(canvasWidth - 100, canvasHeight, 125, 125, 10, 20, 1000);
  drawBracket(canvasWidth - 300, canvasHeight, 125 * 0.7, 125, 10, 20, maxSolventVolume);
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
  waterGroup.add(liquid);
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
    L ${startX} ${50} 
    L ${startX + 375} ${50} 
    L ${startX + 375} ${94.5} 
  `;
  drawPipeWithCurves(leftPipe);
  
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
    M ${startX} ${startY} 
    L ${startX} ${startY - 130 - 17} 
    L ${startX - 170} ${startY - 130 - 17} 
    L ${startX - 170} ${startY - 182.5}
  `;
  drawPipeWithCurves(rightPipe);
  
  rightPipe2 = `
    M ${startX - 170} ${94.5 + 91 + 19 + 91 + 19}
    L ${startX - 170} ${94.5 + 91 + 19 + 91}  
  `;
  drawPipeWithCurves(rightPipe2);
  
  rightPipe3 = `
    M ${startX - 170} ${94.5 + 91 + 19} 
    L ${startX - 170} ${94.5 + 91} 
  `;
  drawPipeWithCurves(rightPipe3);
  
  rightPipe4 = `
    M ${startX - 170} ${94.5} 
    L ${startX - 170} ${50} 
    L ${startX + 200} ${50}
    L ${startX + 200} ${startY}
  `;
  drawPipeWithCurves(rightPipe4);
}

function drawPump(valveCenterX, valveCenterY, radius, opacity = 1) {
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
  // Tank labels
  drawCenteredText(canvasWidth / 2 - 60, canvasHeight - 15, "raffinate tank", 12);
  drawCenteredText(canvasWidth / 2 + 170, canvasHeight - 15, "solvent tank", 12);
  
  let startX = 310;
  let startY = 450;
  
  // Number labels
  drawCenteredText(startX - 55 + 179.5 - 5 + 65, startY - 320, "1", 20);
  drawCenteredText(startX - 55 + 179.5 - 5 + 65, startY - 210, "2", 20);
  drawCenteredText(startX - 55 + 179.5 - 5 + 65, startY - 100, "3", 20);
  
  // Left column stream labels with tooltip events
  let textF = drawCenteredText(startX - 55 + 179.5 - 5, startY - 375, "F", 16);
  textF.on('mouseover', (event) => showTooltip("F", event));
  textF.on('mouseout', hideTooltip);
  
  let textR1 = drawCenteredText(startX - 55 + 179.5 - 5, startY - 270, "R1", 16);
  textR1.on('mouseover', (event) => showTooltip("R1", event));
  textR1.on('mouseout', hideTooltip);
  
  let textR2 = drawCenteredText(startX - 55 + 179.5 - 5, startY - 160, "R2", 16);
  textR2.on('mouseover', (event) => showTooltip("R2", event));
  textR2.on('mouseout', hideTooltip);
  
  let textR3 = drawCenteredText(startX - 55 + 179.5 - 5, startY - 50, "R3", 16);
  textR3.on('mouseover', (event) => showTooltip("R3", event));
  textR3.on('mouseout', hideTooltip);
  
  // Right column stream labels with tooltip events
  let textE1 = drawCenteredText(startX - 55 + 179.5 - 5 + 120, startY - 375, "E1", 16);
  textE1.on('mouseover', (event) => showTooltip("E1", event));
  textE1.on('mouseout', hideTooltip);
  
  let textE2 = drawCenteredText(startX - 55 + 179.5 - 5 + 120, startY - 270, "E2", 16);
  textE2.on('mouseover', (event) => showTooltip("E2", event));
  textE2.on('mouseout', hideTooltip);
  
  let textE3 = drawCenteredText(startX - 55 + 179.5 - 5 + 120, startY - 160, "E3", 16);
  textE3.on('mouseover', (event) => showTooltip("E3", event));
  textE3.on('mouseout', hideTooltip);
  
  let textS = drawCenteredText(startX - 55 + 179.5 - 5 + 120, startY - 50, "S", 16);
  textS.on('mouseover', (event) => showTooltip("S", event));
  textS.on('mouseout', hideTooltip);
  
  // Tank names for feed and extract tanks
  drawCenteredText(80, canvasHeight - 15, "feed tank", 12);
  drawCenteredText(canvasWidth - 125, canvasHeight - 15, "extract tank", 12);
}

function drawCenteredText(centerX, centerY, text, fontSize = 16, fillColor = '#000', fontFamily = 'Arial', strokeColor = null, strokeWidth = 0) {
  const textElement = draw.text(text)
    .font({
      family: fontFamily,
      size: fontSize,
      anchor: 'middle',
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
// HELPER FUNCTION FOR TANK FILLING
// ======================================================
function updateTankDisplay(liquidElement, centerX, startY, width, tankHeight, surfaceWidth, currentVolume, maxVolume, fillColor, fillOpacity) {
  const maxLiquidHeight = tankHeight - 2 * surfaceWidth;
  const liquidHeight = (currentVolume / maxVolume) * maxLiquidHeight;
  if (liquidElement) { liquidElement.remove(); }
  return drawLiquidRectangle(centerX, startY, width, surfaceWidth, liquidHeight, fillColor, fillOpacity);
}

// ======================================================
// FILLING FUNCTIONS & DISPLAY UPDATES
// ======================================================
function updateRaffinateTankDisplay() {
  extractLiquidElement = updateTankDisplay(
    extractLiquidElement,
    475,
    canvasHeight,
    125 * 0.58,
    125,
    10,
    extractTankVolume,
    maxRaffinateVolume,
    'red',
    0.2
  );
  extractLiquidElement.front();
  if (extractTankVolume >= maxRaffinateVolume) { clearInterval(extractFillTimer); extractFillTimer = null; }
  checkStopFlowConditions();
}

function updateExtractTankDisplay() {
  raffinateLiquidElement = updateTankDisplay(
    raffinateLiquidElement,
    canvasWidth - 100,
    canvasHeight,
    125,
    125,
    10,
    raffinateTankVolume,
    1000,
    'red',
    0.39
  );
  raffinateLiquidElement.front();
  if (raffinateTankVolume >= 1000) { clearInterval(raffinateFillTimer); raffinateFillTimer = null; }
  checkStopFlowConditions();
}

function updateFeedTankDisplay() {
  feedLiquidElement = updateTankDisplay(
    feedLiquidElement,
    100,
    canvasHeight,
    125,
    125,
    10,
    feedTankVolume,
    1000,
    'red',
    0.7
  );
  feedLiquidElement.front();
  if (feedTankVolume <= 0) { clearInterval(feedDrainTimer); feedDrainTimer = null; }
  checkStopFlowConditions();
}

function updateSolventTankDisplay() {
  solventLiquidElement = updateTankDisplay(
    solventLiquidElement,
    canvasWidth - 300,
    canvasHeight,
    125 * 0.7,
    125,
    10,
    solventTankVolume,
    maxSolventVolume,
    '#c1c1ff',
    0.7
  );
  solventLiquidElement.front();
  if (solventTankVolume <= 0) { clearInterval(solventDrainTimer); solventDrainTimer = null; }
  checkStopFlowConditions();
}

function startFillingRaffinate() {
  if (extractFillTimer) clearInterval(extractFillTimer);
  extractFillTimer = setInterval(() => {
    extractTankVolume += extractFillRate * 0.1;
    if (extractTankVolume >= maxRaffinateVolume) {
      extractTankVolume = maxRaffinateVolume;
      clearInterval(extractFillTimer); extractFillTimer = null;
    }
    updateRaffinateTankDisplay();
  }, 100);
}

function startFillingExtract() {
  if (raffinateFillTimer) clearInterval(raffinateFillTimer);
  raffinateFillTimer = setInterval(() => {
    raffinateTankVolume += raffinateFillRate * 0.1;
    if (raffinateTankVolume >= 1000) {
      raffinateTankVolume = 1000;
      clearInterval(raffinateFillTimer); raffinateFillTimer = null;
    }
    updateExtractTankDisplay();
  }, 100);
}

function startDrainingFeed() {
  if (feedDrainTimer) clearInterval(feedDrainTimer);
  feedDrainTimer = setInterval(() => {
    feedTankVolume -= feedDrainRate * 0.1;
    if (feedTankVolume < 0) { feedTankVolume = 0; }
    updateFeedTankDisplay();
  }, 100);
}

function startDrainingSolvent() {
  if (solventDrainTimer) clearInterval(solventDrainTimer);
  solventDrainTimer = setInterval(() => {
    solventTankVolume -= solventDrainRate * 0.1;
    if (solventTankVolume < 0) { solventTankVolume = 0; }
    updateSolventTankDisplay();
  }, 100);
}

// ======================================================
// FLOW & DRAINING FUNCTIONS
// ======================================================
function checkStopFlowConditions() {
  if (feedTankVolume <= 0 && leftWaterFlowing) {
    leftWaterFlowing = false;
    animateWaterStopForAllPipes(true, false);
  }
  if (solventTankVolume <= 0 && rightWaterFlowing) {
    rightWaterFlowing = false;
    animateWaterStopForAllPipes(false, true);
  }
  if ((extractTankVolume >= maxRaffinateVolume || raffinateTankVolume >= 1000) &&
      (leftWaterFlowing || rightWaterFlowing)) {
    leftWaterFlowing = false;
    rightWaterFlowing = false;
    animateWaterStopForAllPipes(true, true);
    pump2.animate(300).rotate(-90, pump2StartX - 100, pump2StartY - 10);
    pump22.handle.animate(300).rotate(-40, pump2StartX - 100 + 50, pump2StartY - 80 + 20);
    isRotatedPump1 = false;
    isRotatedPump2 = false;
    pump22.isOn = false; // Reset the pump state
    pump12.isOn = false; // Reset the pump state
    pump1.remove(); // Remove the pump from the drawing
    pump12.remove(); // Remove the valve from the drawing
    pump2.remove(); // Remove the pump from the drawing
    pump22.remove(); // Remove the valve from the drawing
    pump1 = null; // Reset the pump variable
    pump12 = null; // Reset the valve variable
    pump2 = null; // Reset the pump variable
    pump22 = null; // Reset the valve 
    drawPumps(); // Redraw the pumps and valves
  }
}

function animateWaterFlow(pipePath, delay = 0, duration = 1000, waterColor, waterWidth = 16, opacity = 0.5, side) {
  const water = draw.path(pipePath)
    .fill('none')
    .stroke({
      color: waterColor,
      opacity: opacity,
      width: waterWidth,
      linejoin: 'round'
    });
  waterGroup.add(water);
  const totalLength = water.node.getTotalLength();
  water.attr({
    'stroke-dasharray': totalLength,
    'stroke-dashoffset': totalLength
  });
  water.delay(delay).animate(duration).attr({ 'stroke-dashoffset': 0 });
  if (side) {
    water.attr('data-pipe-side', side);
  }
  pump1.front();
  pump2.front();
  return water;
}

function animateWaterFlowForAllPipes(left = false, right = false) {
  const flowRates = {
    rightPipe: 3.2,
    rightPipe2: 3.27,
    rightPipe3: 4.23,
    rightPipe4: 8.08,
    leftPipe: 5.75,
    leftPipe2: 1.96,
    leftPipe3: 1.28,
    leftPipe4: 1.22
  };
  const opacities = {
    rightPipe: 0.7,
    rightPipe2: 0.02,
    rightPipe3: 0.13,
    rightPipe4: 0.39,
    leftPipe: 0.7,
    leftPipe2: 0.6,
    leftPipe3: 0.4,
    leftPipe4: 0.2
  };
  const baseDuration = 800;
  const fastestFlowRate = Math.max(...Object.values(flowRates));
  const pipeSequence = {
    left: [
      { pipe: leftPipe, key: 'leftPipe' },
      { pipe: leftPipe2, key: 'leftPipe2' },
      { pipe: leftPipe3, key: 'leftPipe3' },
      { pipe: leftPipe4, key: 'leftPipe4' }
    ],
    right: [
      { pipe: rightPipe, key: 'rightPipe' },
      { pipe: rightPipe2, key: 'rightPipe2' },
      { pipe: rightPipe3, key: 'rightPipe3' },
      { pipe: rightPipe4, key: 'rightPipe4' }
    ]
  };
  let delay = 0;
  if (left) {
    pipeSequence.left.forEach(({ pipe, key }) => {
      const rate = flowRates[key];
      const opacity = opacities[key];
      const duration = Math.round((fastestFlowRate / rate) * baseDuration);
      animateWaterFlow(pipe, delay, duration, 'red', 16, opacity, 'left');
      delay += duration + 2000;
    });
    startDrainingFeed();
    leftFillTimeout = setTimeout(startFillingRaffinate, delay - 2000);
  }
  if (right) {
    delay = 0;
    pipeSequence.right.forEach(({ pipe, key }) => {
      const rate = flowRates[key];
      const duration = Math.round((fastestFlowRate / rate) * baseDuration);
      const opacity = opacities[key];
      if (key === 'rightPipe') {
        animateWaterFlow(pipe, delay, duration, '#c1c1ff', 16, 0.7, 'right');
      } else {
        animateWaterFlow(pipe, delay, duration, 'red', 16, opacity, 'right');
      }
      delay += duration + 2000;
    });
    startDrainingSolvent();
    rightFillTimeout = setTimeout(startFillingExtract, delay - 2000);
  }
}

function animateWaterStopForAllPipes(left = false, right = false) {
  if (left) {
    draw.find('path')
      .filter(el => el.attr('data-pipe-side') === 'left')
      .forEach(el => el.remove());
    pump1.front();
    if (extractFillTimer) { clearInterval(extractFillTimer); extractFillTimer = null; }
    if (feedDrainTimer) { clearInterval(feedDrainTimer); feedDrainTimer = null; }
    if (leftFillTimeout) { clearTimeout(leftFillTimeout); leftFillTimeout = null; }
    if (feedAutoStartTimer) { clearTimeout(feedAutoStartTimer); feedAutoStartTimer = null; }

    pump1.animate(300).rotate(90, pump1StartX, pump1StartY - 125);
    pump12.handle.animate(300).rotate(-40, pump1StartX + 100, pump1StartY - 130);
  }
  if (right) {
    draw.find('path')
      .filter(el => el.attr('data-pipe-side') === 'right')
      .forEach(el => el.remove());
    pump2.front();
    if (raffinateFillTimer) { clearInterval(raffinateFillTimer); raffinateFillTimer = null; }
    if (solventDrainTimer) { clearInterval(solventDrainTimer); solventDrainTimer = null; }
    if (rightFillTimeout) { clearTimeout(rightFillTimeout); rightFillTimeout = null; }
    if (solventLiquidElement) {
      solventLiquidElement.front();
    }
  }
}

// ======================================================
// PUMP SETUP & CLICK HANDLERS
// ======================================================
let leftWaterFlowing = false;
let rightWaterFlowing = false;

function drawPumps() {
  const startX = pump1StartX;
  const startY = pump1StartY;
  drawLineBetweenPoints(draw, startX, startY - 125, startX + 60, startY - 130, 0.8);
  pump1 = drawPump(startX, startY - 125, 30, 0.8);
  pump1.rotate(90, startX, startY - 125);
  pump1.autoOn = false;
  pump12 = createToggleWithTextRect(draw, startX + 50, startY - 150, 100, 40, 0.8);
  pump12.autoOn = false;
  pump12.attr({ 'pointer-events': 'none' });
  
  const startXP2 = pump2StartX;
  drawLineBetweenPoints(draw, startXP2 - 100, startY - 10, startXP2 - 50, startY - 80);
  pump2 = drawPump(startXP2 - 100, startY - 10, 30);
  pump2.on('click', () => {
    if (!pump22.isOn) { return; }
    isRotatedPump2 = !isRotatedPump2;
    if (isRotatedPump2) {
      pump2.animate(300).rotate(90, startXP2 - 100, startY - 10);
    } else {
      pump2.animate(300).rotate(-90, startXP2 - 100, startY - 10);
    }
    updateRightWaterFlow();
  });
  
  pump22 = createToggleWithTextRect(draw, startXP2 - 100, startY - 100, 100, 40);
  pump22.front();
  pump22.isOn = false;
  pump22.on('click', () => {
    console.log('pump22 clicked');
    updateRightWaterFlow();
    if (!pump22.isOn) {
      if (isRotatedPump2) {
        isRotatedPump2 = false;
        pump2.animate(300).rotate(-90, pump2StartX - 100, pump1StartY - 10);
      }
      if (rightWaterFlowing) {
        rightWaterFlowing = false;
        animateWaterStopForAllPipes(false, true);
      }
      if (feedAutoStartTimer) {
        clearTimeout(feedAutoStartTimer);
        feedAutoStartTimer = null;
      }
      return;
    }
  });
  
  pump1.front();
  pump2.front();
}

function updateLeftWaterFlow() {
  // Feed pump auto-start is controlled via the timer.
}

function autoStartFeedPump() {
  if (pump22.isOn && isRotatedPump2 && !pump1.autoOn) {
    pump1.autoOn = true;
    pump12.autoOn = true;
    pump1.animate(300).rotate(-90, pump1StartX, pump1StartY - 125);
    pump12.handle.animate(300).rotate(40, pump1StartX + 100, pump1StartY - 130);
    leftWaterFlowing = true;
    animateWaterFlowForAllPipes(true, false);
  }
  feedAutoStartTimer = null;
}

function updateRightWaterFlow() {
  if (!pump22.isOn) {
    if (isRotatedPump2) {
      isRotatedPump2 = false;
      pump2.animate(300).rotate(-90, pump2StartX - 100, pump1StartY - 10);
    }
    if (rightWaterFlowing) {
      rightWaterFlowing = false;
      animateWaterStopForAllPipes(false, true);
    }
    if (feedAutoStartTimer) {
      clearTimeout(feedAutoStartTimer);
      feedAutoStartTimer = null;
    }
    if (pump1.autoOn) {
      pump1.autoOn = false;
      pump12.autoOn = false;
      animateWaterStopForAllPipes(true, false);
    }
    return;
  }
  if (isRotatedPump2) {
    if (!rightWaterFlowing) {
      rightWaterFlowing = true;
      animateWaterFlowForAllPipes(false, true);
    }
    if (!pump1.autoOn && !feedAutoStartTimer) {
      feedAutoStartTimer = setTimeout(autoStartFeedPump, 6000);
    }
  } else {
    if (rightWaterFlowing) {
      rightWaterFlowing = false;
      animateWaterStopForAllPipes(false, true);
    }
    if (feedAutoStartTimer) {
      clearTimeout(feedAutoStartTimer);
      feedAutoStartTimer = null;
    }
    if (pump1.autoOn) {
      pump1.autoOn = false;
      pump12.autoOn = false;
      animateWaterStopForAllPipes(true, false);
    }
  }
}

function resetAll() {
  animateWaterStopForAllPipes(true, true);
  extractTankVolume = 0;
  raffinateTankVolume = 0;
  feedTankVolume = maxTankVolume;
  solventTankVolume = maxSolventVolume;
  if (extractFillTimer) { clearInterval(extractFillTimer); extractFillTimer = null; }
  if (raffinateFillTimer) { clearInterval(raffinateFillTimer); raffinateFillTimer = null; }
  if (feedDrainTimer) { clearInterval(feedDrainTimer); feedDrainTimer = null; }
  if (solventDrainTimer) { clearInterval(solventDrainTimer); solventDrainTimer = null; }
  if (extractLiquidElement) { extractLiquidElement.remove(); extractLiquidElement = null; }
  if (raffinateLiquidElement) { raffinateLiquidElement.remove(); raffinateLiquidElement = null; }
  if (feedLiquidElement) { feedLiquidElement.remove(); feedLiquidElement = null; }
  if (solventLiquidElement) { solventLiquidElement.remove(); solventLiquidElement = null; }
  isRotatedPump1 = false;
  isRotatedPump2 = false;
  leftWaterFlowing = false;
  rightWaterFlowing = false;
  if (feedAutoStartTimer) { clearTimeout(feedAutoStartTimer); feedAutoStartTimer = null; }
  updateExtractTankDisplay();
  updateRaffinateTankDisplay();
  updateFeedTankDisplay();
  updateSolventTankDisplay();
  drawCanvas();
}

document.getElementById('reset-button').addEventListener('click', resetAll);

// ======================================================
// DRAG & ZOOM FUNCTIONALITY
// ======================================================
let isPanning = false;
let panStart = { x: 0, y: 0 };

function addOptionToDragAndZoom() {
  uiGroup.add(
    draw.text("zoom with the scroll wheel")
      .move(canvasWidth / 2 - 100, 0)
      .font({ size: 16, anchor: 'left' })
  );
  uiGroup.add(
    draw.text("After zooming, drag mouse to move image")
      .move(canvasWidth / 2 - 150, 15)
      .font({ size: 16, anchor: 'left' })
  );
  const defaultViewbox = { x: 0, y: 0, width: canvasWidth, height: canvasHeight };
  draw.viewbox(defaultViewbox.x, defaultViewbox.y, defaultViewbox.width, defaultViewbox.height);
  
  const background = draw.rect(canvasWidth, canvasHeight)
    .fill({ color: '#fff', opacity: 0 });
  background.back();
  
  background.on('mousedown', function(event) {
    const vb = draw.viewbox();
    if (vb.width >= defaultViewbox.width) return;
    isPanning = true;
    panStart = { x: event.clientX, y: event.clientY };
    if (pump1) pump1.attr({ 'pointer-events': 'none' });
    if (pump2) pump2.attr({ 'pointer-events': 'none' });
  });
  
  background.on('mousemove', function(event) {
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
  
  background.on('mouseup', function() {
    isPanning = false;
    if (pump1) pump1.attr({ 'pointer-events': 'all' });
    if (pump2) pump2.attr({ 'pointer-events': 'all' });
  });
  
  document.addEventListener('mouseup', () => {
    isPanning = false;
    if (pump1) pump1.attr({ 'pointer-events': 'all' });
    if (pump2) pump2.attr({ 'pointer-events': 'all' });
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

// ======================================================
// TOGGLE SWITCH CREATION FUNCTION
// ======================================================
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
  let isOn = false;
  handle.rotate(-20, x + width / 2, y + height / 2);
  switchGroup.click(() => {
    isOn = !isOn;
    switchGroup.isOn = isOn;
    if (isOn) {
      handle.animate(200).rotate(40, x + width / 2, y + height / 2);
    } else {
      handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
    }
  });
  return switchGroup;
}

function drawLineBetweenPoints(draw, x1, y1, x2, y2, opacity = 1, color = '#000', width = 2) {
  let line = draw.line(x1, y1, x2, y2)
    .stroke({ color: color, opacity: opacity, width: width, linecap: 'round' });
  pipeGroup.add(line);
  return line;
}

drawCanvas();
