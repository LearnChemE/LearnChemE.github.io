import { off } from '@svgdotjs/svg.js';
import * as config from './config.js';
import { computePressure } from './flowSolver.js';  

const canvasHeight = config.canvasHeight;
const canvasWidth = config.canvasWidth;
let startX = canvasWidth / 2 - 150;
let startY = canvasHeight - 190;
let pipe = null;
let angle = 30;
const pipeLength = (3 / 8) * canvasWidth;
let pipeGroup;
let draw = null;
let pressure = null;
let valve = null;
let isRotated = false;
let dropInterval = null;
let tank = null;
let waterGroup = null;
let currentLiquidHeight = 0;    // in mL
let fillInterval = null;
const RATE_MAP = {
  flowHigh:   100,  // ml/s
  flowMedium:  60,  // ml/s
  flowLow:     30   // ml/s
};

const radios = document.querySelectorAll('input[name="flowRateOptions"]');

let flowRate = RATE_MAP[ document.querySelector('input[name="flowRateOptions"]:checked').id ];

// Tank drawing and scaling constants
const TANK_X = 800;
const TANK_Y = canvasHeight;
const TANK_WIDTH = 200;
const TANK_HEIGHT_PX = 125;
const TANK_SURFACE = 10;
const TANK_HOLDER = 20;
const TANK_MAX_ML = 1000;

// Save the SVG.js context so other functions can reuse it
export function drawFigure(svg) {
  draw = svg;
  waterGroup = draw.group();
  addSVGImage(
    draw,
    'assets/GFRDeviceDisplay.svg',
    900, 60,
    150, 150
  )
  pressure = draw.text('0 Pa')
    .font({ family: 'Arial', size: 20 })
    .center(975, 140)
    .fill('#000');
  drawPipe(draw);
  tank = drawBracket(TANK_X, TANK_Y, TANK_WIDTH, TANK_HEIGHT_PX, TANK_SURFACE, TANK_HOLDER, TANK_MAX_ML);
  drawDashedHorizontalLine(draw, canvasWidth / 2 - 150 - 150, canvasHeight - 100, 200);

  valve = drawValve(draw, startX + pipeLength - 40, startY);
}

function drawPipe(draw) {
  pipeGroup = draw.group();
  
  pipe = `
    M ${startX - pipeLength * Math.cos((angle * Math.PI) / 180)} ${startY - pipeLength * Math.sin((angle * Math.PI) / 180)} 
    L ${startX} ${startY}
    L ${startX + pipeLength} ${startY}
  `;
  drawPipeWithCurves(pipeGroup, pipe, (2.5 / 30 * pipeLength) , '#B4B4FF');

  // Animate continuous water flow horizontally from pipe outlet
  const margin = 30;
  drawDimensionLine(pipeGroup, 
                    {x: startX - pipeLength * Math.cos((angle * Math.PI) / 180) - margin * Math.sin((angle * Math.PI) / 180), y: startY - pipeLength * Math.sin((angle * Math.PI) / 180) + margin * Math.cos((angle * Math.PI) / 180)}, 
                    {x: startX - margin * Math.sin((angle * Math.PI) / 180), y: startY + margin * Math.cos((angle * Math.PI) / 180)}, 10, "30 cm");
  drawDimensionLine(pipeGroup,  
                    {x: startX, y: startY + margin}, 
                    {x: startX + pipeLength, y: startY + margin}, 10, "30 cm");
  const margin1 = 100
  drawAngleArc(pipeGroup,
               {x: startX - margin * Math.sin((angle * Math.PI) / 180), y: startY + margin * Math.cos((angle * Math.PI) / 180)},
               {x: startX - margin1 * Math.sin((angle * Math.PI) / 180), y: canvasHeight - 100},
               angle,
               {color: '#000', width: 2, arrowLen: 8});
const margin2 = 100
// Compute image position with a perpendicular offset
const angleRad = (angle * Math.PI) / 180;
const imageOffset = 85;  // adjust this value as needed
const imgX = startX - (pipeLength) * Math.cos(angleRad) + imageOffset * Math.sin(angleRad);
const imgY = startY - pipeLength * Math.sin(angleRad) - imageOffset * Math.cos(angleRad);
addSVGImage(
  pipeGroup,
  'assets/gasFlowRateDevice.svg',
  imgX - 45, imgY,
  150, 120
).rotate(
  angle,
  imgX,
  imgY
);

const newP = isRotated ? computePressure(flowRate, angle) : 0;
pressure.text(`${Math.round(newP)} Pa`).center(975, 140);
}

function drawPipeWithCurves(draw, pathString, pipeWidth = 15, strokeColor = '#f7f7f7', outlineColor = '#d5d5d5') {
  pipeGroup.clear();
  pipeGroup = draw.group();
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
  return pipe;
}

/* ─── UI bindings for the angle slider + numeric input ─────────────── */
  const angleSlider = document.getElementById('angleSlider');
  const angleValue  = document.getElementById('angleValue');


  // keep <span> and numeric box in‑sync with the slider
  function updateUI(val) {
    angleValue.textContent = val;
  }

  // slider → numeric box
  angleSlider.addEventListener('input', e => {
    updateUI(e.target.value);
    angle = parseFloat(e.target.value);
    if (draw) {
      pipeGroup.clear();
      drawPipe(draw);
      valve.front();
    }
  });

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
  const liquidMaxHeight = height;
  const bottomY = startY - surfaceWidth;
  const leftX = startX - (width - 2 * surfaceWidth) / 2;
  
  for (let i = 0; i <= numTicks; i++) {
    const tickVolume = i * tickInterval;
    const tickLength = (tickVolume % 50 === 0) ? 20 : 10;
    const tickY = bottomY - (tickVolume / maxVolume) * liquidMaxHeight;
    let tick = draw.line(leftX, tickY, leftX + tickLength, tickY)
      .stroke({ color: '#000', width: 1 });

    if (tickVolume % index === 0 && tickVolume !== 0) {
      const textLabel = draw.text(tickVolume.toString() + " mL")
        .font({ family: 'Arial', size: 10 })
        .move(leftX + tickLength + 2, tickY - 5);
      textLabel.attr({ 'text-anchor': 'start' });
    }
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

export function drawDimensionLine(draw, start, end, arrowLen, textContent) {
  // Calculate basic geometry
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  const arrowAngle = Math.PI / 6; // 30 degrees

  // Draw dashed main line
  draw.line(start.x, start.y, end.x, end.y)
    .stroke({ color: '#000', width: 2, dasharray: '5,5' });

  // Draw arrowhead at start
  const startLeft = {
    x: start.x + arrowLen * Math.cos(angle - arrowAngle),
    y: start.y + arrowLen * Math.sin(angle - arrowAngle)
  };
  const startRight = {
    x: start.x + arrowLen * Math.cos(angle + arrowAngle),
    y: start.y + arrowLen * Math.sin(angle + arrowAngle)
  };
  draw.polygon([ start.x, start.y,
                 startLeft.x, startLeft.y,
                 startRight.x, startRight.y ])
      .fill('#000');

  // Draw arrowhead at end
  const endLeft = {
    x: end.x + arrowLen * Math.cos(angle + Math.PI - arrowAngle),
    y: end.y + arrowLen * Math.sin(angle + Math.PI - arrowAngle)
  };
  const endRight = {
    x: end.x + arrowLen * Math.cos(angle + Math.PI + arrowAngle),
    y: end.y + arrowLen * Math.sin(angle + Math.PI + arrowAngle)
  };
  draw.polygon([ end.x, end.y,
                 endLeft.x, endLeft.y,
                 endRight.x, endRight.y ])
      .fill('#000');

  // Draw text and background
  const textElem = draw.text(textContent)
    .font({ family: 'Arial', size: 12 })
    .center(midX, midY)
    .rotate(angle * 180 / Math.PI)
    .fill('#000');
  // Measure and draw white background behind text
  const bbox = textElem.bbox();
  draw.rect(bbox.width + 2, bbox.height + 4)
    .fill('#fff')
    .move(bbox.x - 1, bbox.y - 2)
    .rotate(angle * 180 / Math.PI)
    .insertBefore(textElem);
}

function drawDashedHorizontalLine(draw, startX, startY, length, color = 'black', width = 1, dashArray = '5,5') {
  const group = draw.group();
  group.line(startX, startY, startX + length, startY)
    .stroke({ color: color, width: width, dasharray: dashArray });
  return group;
}

export function drawAngleArc(draw, p1, p2, angleDeg, opts = {}) {
  // If angle is zero, draw a straight line instead
  if (Math.abs(angleDeg) < 1e-6) {
    // Draw straight line
    draw.line(p1.x, p1.y, p2.x, p2.y)
      .stroke({ color: opts.color || '#000', width: opts.width || 2 })
      .fill('none');
    // Place "0°" text at midpoint, rotated along the line
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    const lineAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
    draw.text('0°')
      .font({ family: 'Arial', size: 12 })
      .center(midX - 10, midY)
    return;
  }
  const { color = '#000', width = 2, sweep = true } = opts;
  const angle = angleDeg * Math.PI / 180;
  // Chord vector and length
  const dx = p2.x - p1.x, dy = p2.y - p1.y;
  const chord = Math.hypot(dx, dy);
  // Compute radius from chord and central angle
  const r = chord / (2 * Math.sin(angle / 2));
  // Midpoint of chord
  const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2;
  // Distance from midpoint to circle center
  const h = Math.sqrt(Math.max(0, r * r - (chord / 2) ** 2));
  // Unit normal to chord
  const ux = -dy / chord, uy = dx / chord;
  // Determine center side based on sweep direction
  const cx = mx + (sweep ? ux * h : -ux * h);
  const cy = my + (sweep ? uy * h : -uy * h);
  // Arc flags
  const largeArcFlag = Math.abs(angle) > Math.PI ? 1 : 0;
  const sweepFlag = sweep ? 0 : 1;
  // Draw SVG arc path
  draw
    .path(`M${p1.x},${p1.y} A${r},${r} 0 ${largeArcFlag} ${sweepFlag} ${p2.x},${p2.y}`)
    .stroke({ color, width })
    .fill('none');

  // Draw angle text at midpoint of arc
  const a1 = Math.atan2(p1.y - cy, p1.x - cx);
  const a2 = a1 + (sweep ? angle : -angle);
  const midAngle = (a1 + a2) / 2;
  const textRadius = r + 10;
  const textX = cx + textRadius * Math.cos(midAngle);
  const textY = cy + textRadius * Math.sin(midAngle);
  draw.text(`${Math.round(angleDeg)}°`)
    .font({ family: 'Arial', size: 12 })
    .center(textX, textY);
}

function addSVGImage(draw, url, x = 0, y = 0, width, height) {
    const img = draw.image(url)
    .size(width, height)                      // force the element to the given dimensions
    .move(x, y)
    .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
    return img;
  }

export function drawValve(draw, valveCenterX, valveCenterY) {
    let valveGroup = draw.group();
    valveGroup.circle(50)
    .fill('#b4b4ff')
    .stroke({ color: 'grey', width: 2 })
    .center(valveCenterX, valveCenterY)
    .front();
    const valve = valveGroup.rect(15, 54)
    .fill('black')
    .stroke({ color: 'grey', width: 2 })
    .center(valveCenterX, valveCenterY)
    .front();
    
    valveGroup.click(() => {
      // Determine new rotation
      const newRotation = isRotated ? 90 : -90;
      valve.animate(300).rotate(newRotation, valveCenterX, valveCenterY);

      // If we're opening the valve, animate water drop
      if (!isRotated) {
        // Start continuous drops
        const pipeDiameter = (2.5 / 30) * pipeLength - 10;
        const flowY = startY - 5;
        // Small droplet parameters
        const dropletSize = Math.max(8, pipeDiameter * 0.2);
        // Determine number of streams to fill the pipe diameter
        const streams = Math.max(5, Math.floor(pipeDiameter / (dropletSize * 2)));
        setInterval(() => {
          // Only emit flow when valve is open
          if (!isRotated) return;
          for (let i = 0; i < streams; i++) {
            const yOffset = i * (pipeDiameter / (streams - 1)) - (pipeDiameter / 2);
            const droplet = draw.circle(dropletSize)
              .fill('#B4B4FF')
              .move(startX + pipeLength - dropletSize / 2, flowY + yOffset)
              .front();
            {
              const duration = 2000;
              const startX0 = startX + pipeLength - dropletSize / 2;
              const startY0 = flowY + yOffset;
              const endX = canvasWidth + dropletSize;
              const vX = (endX - startX0) / (duration / 1000); // pixels per second
              const g = 400;

              // Manual parabolic motion using interval
              const startTime = Date.now();
              const intervalId = setInterval(() => {
                const t = (Date.now() - startTime) / 1000;
                const xPos = startX0 + vX * t;
                const yPos = startY0 + 0.5 * g * t * t;
                droplet.move(xPos, yPos);
                if (yPos > canvasHeight - 15) {
                  clearInterval(intervalId);
                  droplet.remove();
                }
                // drawLiquidRectangle(800, canvasHeight, 200, 10, flowRate * t)
              }, 16); // roughly 60fps
            }
          }
        }, 10); // emit every 50ms

        // Start filling the tank
        const intervalMs = 100; // update every 100ms
        const maxVolume = TANK_MAX_ML; // mL, as used in drawBracket
        const bracketHeightPx = TANK_HEIGHT_PX; // px, height passed to drawBracket
        const mlToPx = bracketHeightPx / maxVolume; 

        // Clear any existing fill interval
        clearInterval(fillInterval);
        fillInterval = setInterval(() => {
          // Increment current volume
          currentLiquidHeight = Math.min(maxVolume, currentLiquidHeight + flowRate * (intervalMs / 1000));
          // Convert to px
          const liquidPx = currentLiquidHeight * mlToPx;
          // Clear previous liquid and draw new level
          waterGroup.clear();
          drawLiquidRectangle(TANK_X, TANK_Y, TANK_WIDTH, TANK_SURFACE, liquidPx);
          if (currentLiquidHeight >= maxVolume) {
            clearInterval(fillInterval);
          }
        }, intervalMs);
      } else {
        // Stop continuous drops
        clearInterval(dropInterval);
        // Stop filling the tank
        clearInterval(fillInterval);
      }

      // Toggle state
      isRotated = !isRotated;

      // Update pressure display
      const newP = isRotated ? computePressure(flowRate, angle) : 0;
      pressure.text(`${Math.round(newP)} Pa`).center(975, 140);
    });
    return valveGroup;
}

radios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    if (!e.target.checked) return;
    flowRate = RATE_MAP[e.target.id];
    console.log('New flow rate:', flowRate, 'ml/s');
  });
});