import * as config from './config.js';
import { computeVolumeVsTime, volumeAtTime } from './calc.js';

// Simulation time scale: 1 second real time = 10 seconds simulated
const TIME_SCALE = 10;

let valve = null;
let verticalValveOpen = false;
let gasValveOpen = false;
let isHeaterOn = false;
let container = null;
let gasFlowRateDevice = null;
let gasFlowRateText = null;
let currentTemp = 15;
let changedTemp = 15; // track last changed temperature for heating/cooling
let timerId = null;
let elapsedSeconds = 0; // track elapsed time for gas flow
// let outletBubbleTimer = null;   // interval handle for outlet bubbles
// let outletBubbleLayer = null;   // SVG group to hold outlet bubbles
let readout = null; // temperature display text element
let switchGroup = null; // heater ON/OFF switch group
let ventIndicator = null; // red arrow + 'vent' label at leftPipe3 outlet
let ventMarker = null; // marker for arrowhead (red)
let ventLabel = null; // text label for vent indicator
// Create or hide a red east-pointing arrow with 'vent' text at end of leftPipe3
function updateVentIndicator(draw, show) {
  // Create or hide a red east-pointing arrow with 'vent' text at end of leftPipe3
  if (!window.leftPipe3 || !window.leftPipe3.node || typeof window.leftPipe3.node.getTotalLength !== 'function') {
    // If the pipe isn't ready, remove any indicator and return
    if (ventIndicator) { ventIndicator.remove(); ventIndicator = null; }
    return;
  }
  
  const totalLen = window.leftPipe3.node.getTotalLength();
  const pt = window.leftPipe3.node.getPointAtLength(totalLen);
  
  if (!show) {
    if (ventIndicator) { ventIndicator.hide(); }
    if (ventLabel) { ventLabel.hide(); }
    return;
  }
  
  // Ensure the indicator exists
  if (!ventIndicator) {
    ventIndicator = draw.group();
    
    // Create (or reuse) a marker for the arrowhead
    if (!ventMarker) {
      ventMarker = draw.marker(6, 6, function(add) {
        add.path('M0,0 L0,6 L6,3 Z').fill('#ff0000');
      });
      // Tip reference at the marker bounds and auto‑orientation
      ventMarker.ref(6, 3).orient('auto');
    }
    
    // A single red line pointing east with an arrowhead at the end
    ventIndicator.line(0, 0, 25, 0)
    .stroke({ color: '#ff0000', width: 1.6 })
    .marker('end', ventMarker);
    
    // Text label exactly aligned with the arrow line baseline, starting just after the arrow tip
    ventLabel = draw.text('vent')
    .font({ family: 'Arial', size: 12})
    .fill('#ff0000');
    // Align the text vertically to the line and anchor from the left
    ventLabel.attr({ 'text-anchor': 'start', 'dominant-baseline': 'middle', 'alignment-baseline': 'middle' });
    // Place the label so its vertical middle sits on y=0 and its left edge starts after the arrow tip
    ventLabel.move(770, 47.5);
    
    // Ensure it doesn't block clicks on other UI elements
    ventIndicator.attr({ 'pointer-events': 'none' });
  }
  
  // Position the group at the outlet point with a small offset so it sits just outside the pipe
  // The path ends at the outlet heading east, so offset a few pixels to the right.
  ventIndicator.show();
  ventLabel.show();
  ventIndicator.move(pt.x + 8, pt.y - 0);
  
  // Keep it above animated strokes
  if (typeof ventIndicator.front === 'function') ventIndicator.front();
}


// Save the SVG.js context so other functions can reuse it
export function drawFigure(svg) {
  svg.line(675, 175, 760, 210)
  .stroke({ color: '#000', width: 2 });
  
  svg.line(675, 350, 760, 320)
  .stroke({ color: '#000', width: 2 });
  svg.line(500, 100, 400, 120)
  .stroke({ color: '#000', width: 2 });
  drawGasCylinder(svg, 100, 350, 'N₂ gas cylinder');
  createVerticalValve(svg, 122.5, 250);
  drawPipes(svg);
  // Liquid column with vent, scale, temp controller, colored liquid and clear bubbles
  switchGroup = drawSwitch(svg, 750, 200, 80, 40);
  container = drawLiquidColumnWithVent(svg, 500, 80, switchGroup); // pass switch to control heaters & bubbles
  valve = drawValve(svg, 580, 450).rotate(90);
  gasFlowRateDevice = addSVGImage(svg, 'assets/gasFlowRateDevice.svg', 90, 145, 160, 120);
  gasFlowRateText = svg.text('0').center(174, 180).font({ size: 12, anchor: 'middle' });
  svg.text('cm³/min').stroke({ color: '#000', width: 0.05 }).center(172, 202.5).font({ size: 14 });
  const tempController = drawTemperatureController(svg, 745, 300, 20, 15, 25, 5);
  const tempReadOut = drawTemperatureReadOut(svg, 300, 100);
  // if (tempController && typeof tempController.front === 'function') tempController.front();
}

function drawGasCylinder(draw, x, y, label) {
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
            L ${x} ${y + config.mainCylHeight - 20}
            Q ${x} ${y + config.mainCylHeight} ${x + 20} ${y + config.mainCylHeight}
            L ${x + config.mainCylWidth - 20} ${y + config.mainCylHeight}
            Q ${x + config.mainCylWidth} ${y + config.mainCylHeight} ${x + config.mainCylWidth} ${y + config.mainCylHeight - 20}
            L ${x + config.mainCylWidth} ${y + 20}
            Q ${x + config.mainCylWidth} ${y} ${x + config.mainCylWidth - 20} ${y}
            L ${x + 20} ${y}
            Q ${x} ${y} ${x} ${y + 20}
            Z
        `)
    .fill(cylinderGradient)
    .stroke({ color: '#444', width: 1 });
    
    // Add nozzle (centered horizontally)
    const nozzleX = x + (config.mainCylWidth - config.nozzleRect3Width) / 2;
    createNozzle(draw, group, nozzleX, y - 12); // Pass draw and group
    
    // Add vertical label on cylinder
    group.text(function(add) {
      add.tspan(label).dx(x + config.mainCylWidth / 2).dy(y + config.mainCylHeight / 2);
    })
    .font({
      family: 'Arial',
      size: 20,
      anchor: 'middle',
      weight: 'bold'
    })
    .fill('white')
    .transform({ rotate: -90, cx: x + config.mainCylWidth / 2, cy: y + config.mainCylHeight / 2 });
    
    return group;
  }
  
  function createNozzle(draw, group, x, y) {
    // First rectangle
    group.rect(config.nozzleRect1Width, config.nozzleRect1Height)
    .fill('#ebebeb')
    .stroke({ color: '#444', width: 1 })
    .move(x, y);
    // Second rectangle
    const secondRectX = x + (config.nozzleRect1Width - config.nozzleRect2Width) / 2;
    group.rect(config.nozzleRect2Width, config.nozzleRect2Height)
    .fill('#c69c6d')
    .stroke({ color: '#444', width: 1 })
    .move(secondRectX, y - config.nozzleRect2Height);
    // Third rectangle with rounded corners
    group.rect(config.nozzleRect3Width, config.nozzleRect3Height)
    .fill('#ebebeb')
    .radius(4)
    .stroke({ color: '#444', width: 1 })
    .move(x, y - config.nozzleRect2Height - config.nozzleRect3Height);
  }
  
  function createVerticalValve(draw, x, y) {
    
    const group = draw.group();
    // expose gas valve for cross-component checks
    window.gasValve = group;
    group.isOpen = false;
    // Create valve body parts
    group.rect( config.verticalValveBlockWidth,  config.verticalValveBlockHeight)
    .fill('#ccc')
    .stroke({ color: '#444', width: 1 })
    .move(x, y);
    
    group.rect( config.verticalValveBodyWidth,  config.verticalValveBodyHeight)
    .fill('#ddd')
    .stroke({ color: '#444', width: 1 })
    .radius(6)
    .move(x, y +  config.verticalValveBlockHeight);
    
    group.rect( config.verticalValveBlockWidth,  config.verticalValveBlockHeight)
    .fill('#ccc')
    .stroke({ color: '#444', width: 1 })
    .move(x, y +  config.verticalValveBlockHeight +  config.verticalValveBodyHeight);
    
    const stemX = x -  config.verticalValveStemWidth;
    const stemY = y +  config.verticalValveBlockHeight + ( config.verticalValveBodyHeight -  config.verticalValveStemHeight) / 2;
    group.rect( config.verticalValveStemWidth,  config.verticalValveStemHeight)
    .fill('#000')
    .move(stemX, stemY);
    
    const extra = ( config.verticalValveTopExtent -  config.verticalValveStemHeight) / 2;
    const knob = group.path(`
            M ${stemX} ${stemY}
            L ${stemX -  config.verticalValveTrapezoidWidth} ${stemY - extra}
            L ${stemX -  config.verticalValveTrapezoidWidth} ${stemY +  config.verticalValveStemHeight + extra}
            L ${stemX} ${stemY +  config.verticalValveStemHeight}
            Z
        `)
      .fill('#000') // Start closed (black)
      .stroke({ color: '#444', width: 1 });
      
      group.click(() => {
        group.isOpen = !(group.isOpen);
        verticalValveOpen = group.isOpen;
        
        if (knob && typeof knob.animate === 'function') { // Check if knob exists and is animatable
          const color = group.isOpen ? '#ffa500' : '#000000';
          knob.animate(300).fill(color);
        } else if (knob) {
          const color = group.isOpen ? '#ffa500' : '#000000';
          knob.fill(color);
        }
        
        animateGasFlow(draw);
        if (verticalValveOpen) {
          timerId = startTimer(draw, currentTemp);
        } else {
          clearInterval(timerId);
        }

        animateBubbleFlow(draw);


      });
      
      return group;
    }
    
    
    
    function drawPipes(draw) {
      config.setPipeGroup(draw.group());
      let startX = 130;
      let startY = config.canvasHeight - 295;
      
      const leftPipe = `
    M ${startX} ${startY} 
    L ${startX} ${startY - 20}
  `;
      drawPipeWithCurves(draw, leftPipe, 4, 'red');
      
      const leftPipe1 = `
      M ${startX} ${startY - 55}
      L ${startX} ${startY - 75}
      L ${startX + 75} ${startY - 75}
      L ${startX + 75} ${startY + 275}
      L ${startX + 450} ${startY + 275}
      L ${startX + 450} ${startY + 150}
      
      `
      window.leftPipe1 = drawPipeWithCurves(draw, leftPipe1, 4);
      
      const leftPipe2 = `
      M ${startX + 450} ${startY + 140}
      L ${startX + 450} ${startY + 70}
      `
      window.leftPipe2 = drawPipeWithCurves(draw, leftPipe2, 4);
      
      const leftPipe3 = `
      M ${startX + 450} ${startY - 226}
      L ${startX + 450} ${startY - 250}
      L ${startX + 600} ${startY - 250}
      `
      window.leftPipe3 = drawPipeWithCurves(draw, leftPipe3, 8);
    }
    
    function drawPipeWithCurves(draw, pathString, pipeWidth = 15, strokeColor = '#f7f7f7', outlineColor = '#d5d5d5') {
      let outline = draw.path(pathString)
      .fill('none')
      .stroke({
        color: outlineColor,
        width: pipeWidth + 4,
        linejoin: 'round'
      });
      config.getPipeGroup().add(outline);
      let pipe = draw.path(pathString)
      .fill('none')
      .stroke({
        color: strokeColor,
        width: pipeWidth,
        linejoin: 'round'
      });
      config.getPipeGroup().add(pipe);
      return pipe;
    }
    
    // ---------------------- Liquid column vessel ----------------------
    // Draws a rectangular vessel with rounded corners, a vent pipe, level scale,
    // a temperature controller, a light-blue liquid and clear bubbles
    function drawLiquidColumnWithVent(draw, x, y, switchGroup, FILL_FRAC = 61.5 / 70) {
      const TANK_W = 160;
      const TANK_H = 300;
      const R = 12;         // corner radius
      const WALL = 6;       // wall thickness
      const PADDING = 8;    // inner padding for bubbles/scale
      
      const g = draw.group();
      
      // Tank outer shell
      const outer = g.rect(TANK_W, TANK_H)
      .move(x, y)
      .radius(R)
      .fill('#f2f2f2')
      .stroke({ color: '#3a3a3a', width: 1.2 });
      
      // Inner cavity (gives wall look)
      const inner = g.rect(TANK_W - 2 * WALL, TANK_H - 2 * WALL)
      .move(x + WALL, y + WALL)
      // .radius(R - 4)
      .fill('#ffffff')
      .stroke({ color: '#d2d2d2', width: 0.8 });
      
      // Liquid (light blue gradient)
      const liquidH = (TANK_H - 5 - 2 * WALL) * FILL_FRAC;
      const liquidY = y + WALL + (TANK_H - 2 * WALL - liquidH);
      
      const liquid = g.rect(TANK_W - 2 * WALL, liquidH)
      .move(x + WALL, liquidY - 5)
      .fill('#9dd2ff')
      .stroke({ color: '#8cbfe9', width: 0.6 });
      g.liquid = liquid; // expose for updates
      
      const baseRectWidth = TANK_W - 2 * WALL;
      const baseRectHeight = 5;
      const baseRectX = x + WALL;
      const baseRectY = liquidY - 5 + liquidH;
      const baseRect = g.rect(baseRectWidth, baseRectHeight)
      .move(baseRectX, baseRectY)
      .fill('gray');
      const numCircles = 50;
      const circleRadius = 1;
      const spacing = baseRectWidth / (numCircles + 1);
      for (let i = 0; i < numCircles; i++) {
        const cx = baseRectX + spacing * (i + 1);
        const cy = baseRectY + baseRectHeight / 2;
        g.circle(circleRadius * 2)
        .center(cx, cy)
        .fill('white');
      }
      
      // Clear bubbles (transparent fill with white stroke)
      const bubbleLayer = g.group();
      const innerLeft = x + WALL + PADDING;
      const innerRight = x + TANK_W - WALL - PADDING;
      const innerTop = y + WALL + PADDING;
      const innerBottom = y + TANK_H - 5 - WALL - PADDING;
      
      // Bubbling control state and helpers
      let bubbling = false;
      let bubbleTimers = [];
      function clearAllBubbles() {
        bubbleTimers.forEach(t => clearTimeout(t));
        bubbleTimers = [];
        bubbleLayer.clear();
      }
      function stopBubbles() {
        bubbling = false;
        clearAllBubbles();
      }
      function startBubbles() {
        if (bubbling || !gasValveOpen ||!verticalValveOpen) return;
        bubbling = true;
        for (let i = 0; i < 100; i++) {
          bubbleTimers.push(setTimeout(spawnBubble, i * 100));
        }
      }
      // Expose bubble controls to outside via returned group
      g.startBubbles = () => startBubbles();
      g.stopBubbles = () => stopBubbles();
      
      function spawnBubble() {
        if (!bubbling) return;
        const bx = Math.random() * (innerRight - innerLeft) + innerLeft;
        const r = 2 + 4; // 2–6 px
        const startY = innerBottom; // start inside liquid
        const c = bubbleLayer.circle(r * 2)
        .center(bx, startY)
        .fill('none')
        .stroke({ color: '#ffffff', width: 1, opacity: 0.9 });
        
        const travel = (startY - (liquidY + PADDING));
        const dur = 2500 + Math.random() * 2000;
        
        c.animate(dur).dy(-travel).after(() => {
          c.remove();
          if (!bubbling) return;
          const t = setTimeout(spawnBubble, 400 + Math.random() * 900);
          bubbleTimers.push(t);
        });
      }
      
      // Level scale and numbers on the left inside wall
      
      // Centered volume scale (0 to 65 cm³)
      const volScale = g.group();
      // Ensure the scale does not block pointer interactions
      volScale.attr({ 'pointer-events': 'none' });
      const volMin = 0, volMax = 65, volStep = 5;
      const volTotal = volMax - volMin + 5;
      const volTicks = (volTotal) / volStep + 1;
      const centerX = x + TANK_W / 2;
      for (let i = 0; i < volTicks; i++) {
        if (i == 0 || i == 14) {continue};
        const volVal = volMin + i * volStep;          // 0, 5, 10, ... 65
        const frac = volVal / volTotal;               // fraction of full height
        const ty = liquidY - 5 + liquidH - frac * (TANK_H - 5 - 2 * WALL); // use requested effective height
        
        // Tick length: longer for every 10 cm³
        const tickLen = 50// (volVal % 10 === 0) ? 28 : 16;
        volScale.line(centerX - tickLen / 2, ty, centerX + tickLen / 2, ty)
        .stroke({ color: 'black', width: 2 });
        
        // Numeric label beside the tick (to the right)
        let volLabel = volScale.text(String(volVal))
        .font({ family: 'Arial', size: 12, anchor: 'middle' });
        
        let volLabelString = String(volVal)
        if (volVal == 65) {
          volLabelString = "65 cm³";
        }
        volScale.text(volLabelString)
        .font({ family: 'Arial', size: 12, anchor: 'middle' })
        .move(centerX + tickLen / 2 + 4, ty - 6);
      }
      
      
      // Create vertical gradients for heaters
      const leftHeaterGrad = draw.gradient('linear', add => {
        add.stop(0, '#ff0000', 0.25);
        add.stop(0.5, '#ffff00', 0.25);
        add.stop(1, '#ff0000', 0.25);
      }).from(0, 0).to(0, 1);
      
      const rightHeaterGrad = draw.gradient('linear', add => {
        add.stop(0, '#ff0000', 0.25);
        add.stop(0.5, '#ffff00', 0.25);
        add.stop(1, '#ff0000', 0.25);
      }).from(0, 0).to(0, 1);
      
      // Helper: update heater gradient opacity based on temperature (15–25 °C)
      function updateHeaterHeat(temp) {
        const t = Math.max(15, Math.min(25, temp));
        const frac = (t - 15) / (25 - 15);
        const base = 1  ;
        const addTop = 0.55;
        const addBot = 0.65;
        
        const topOpacity = base + addTop * frac;
        const midOpacity = topOpacity;
        const botOpacity = base + addBot * frac;
        
        leftHeaterGrad.update(add => {
          add.stop(0, '#ff0000', topOpacity);
          add.stop(0.5, '#ffff00', midOpacity);
          add.stop(1, '#ff0000', botOpacity);
        });
        rightHeaterGrad.update(add => {
          add.stop(0, '#ff0000', topOpacity);
          add.stop(0.5, '#ffff00', midOpacity);
          add.stop(1, '#ff0000', botOpacity);
        });
      }
      
      // Helper: apply "OFF" gradient (cool colors)
      function applyOffGradient() {
        leftHeaterGrad.update(add => {
          add.stop(0, '#0000ff');
          add.stop(0.5, '#00ffff');
          add.stop(1, '#0000ff');
        });
        rightHeaterGrad.update(add => {
          add.stop(0, '#0000ff');
          add.stop(0.5, '#00ffff');
          add.stop(1, '#0000ff');
        });
      }
      
      // Expose heater helpers on the container group
      g.updateHeaterHeat = updateHeaterHeat;
      g.applyOffGradient = applyOffGradient;
      
      // --- Side heaters (left & right) and draggable temperature pointer on right ---
      const heaterW = 20;
      const heaterH = innerBottom - innerTop + 15;
      const leftHeaterX  = x + WALL - 21;
      const rightHeaterX = x + TANK_W - WALL - 2 - heaterW + 23;
      const ALLOWED_TEMPS = [15, 20, 25];
      function snapTemp(t) {
        let best = ALLOWED_TEMPS[0];
        let bestDiff = Math.abs(t - best);
        for (let i = 1; i < ALLOWED_TEMPS.length; i++) {
          const diff = Math.abs(t - ALLOWED_TEMPS[i]);
          if (diff < bestDiff) {
            best = ALLOWED_TEMPS[i];
            bestDiff = diff;
          }
        }
        return best;
      }
      // Left heater bar
      const leftHeater = g.rect(heaterW, heaterH)
      .move(leftHeaterX, innerTop - 7.5)
      .fill(leftHeaterGrad) // replaced fill color with gradient
      .stroke({ color: '#b5865c', width: 0.8 });
      // Right heater bar (with draggable pointer)
      const rightHeater = g.rect(heaterW, heaterH)
      .move(rightHeaterX, innerTop - 7.5)
      .fill(rightHeaterGrad) // replaced fill color with gradient
      .stroke({ color: '#b5865c', width: 0.8 });
      // Heaters are visual only; don't let them block dragging
      leftHeater.attr({ 'pointer-events': 'none' });
      rightHeater.attr({ 'pointer-events': 'none' });
      
      // Helpers to convert between y-position and temperature (strictly discrete: 15, 20, 25 °C)
      function tempFromY(yy) {
        const frac = (innerBottom - yy) / (innerBottom - innerTop);
        const raw = 15 + frac * (25 - 15);
        return snapTemp(raw);
      }
      function yFromTemp(temp) {
        const t = snapTemp(temp);
        const frac = (t - 15) / (25 - 15);
        return innerBottom - frac * (innerBottom - innerTop);
      }
      
      // Draggable pointer (single arrow polygon: tail rectangle + tip triangle)
      const pointerH = 14;                 // total height of the arrow
      const pointerTip = 8;                // length of the triangular tip protruding into the liquid
      const tailW = Math.max(6, heaterW - 3); // width of tail that sits over the heater
      let targetTemp = 20;                 // initial target (°C)
      let py = yFromTemp(targetTemp);
      
      updateHeaterHeat(targetTemp);
      
      function arrowPoints(atY) {
        const top = atY - pointerH / 2;
        const bottom = atY + pointerH / 2;
        const left = rightHeaterX + 1 + 5;          // align at the heater face
        const right = left + tailW + 25;             // tail extends to the right within heater
        const tipX = rightHeaterX - pointerTip + 5; // tip points left into the liquid
        const midY = atY;
        // Points ordered to create a rectangle with a left-pointing tip
        // Top-left -> Top-right -> Bottom-right -> Bottom-left -> Tip -> back to Top-left (auto-closed)
        return `${left},${top} ${right},${top} ${right},${bottom} ${left},${bottom} ${tipX},${midY}`;
      }
      
      if (switchGroup && switchGroup.isOn) {
        isHeaterOn = true;
        updateHeaterHeat(targetTemp);
        // startBubbles();
        // animateBubbleFlow(draw);
      } else {
        isHeaterOn = false;
        applyOffGradient();
        // stopBubbles();
        // animateBubbleFlow(draw);
      }
      
      // React to switch toggles to swap gradients and bubbles
      if (switchGroup) {
        switchGroup.on('click', () => {
          isHeaterOn = switchGroup.isOn;
          if (switchGroup.isOn) {
            // Turned ON: heat based on current target temperature, start bubbles
            updateHeaterHeat(g.targetTemperature || targetTemp);
            // startBubbles();
            // timerId = startTimer(draw, currentTemp);
            // animateBubbleFlow(draw);
          } else {
            // Turned OFF: cool gradient, stop bubbles
            applyOffGradient();
            // stopBubbles();
            // clearInterval(timerId);
            // animateBubbleFlow(draw);
          }
        });
      }
      return g;
    }
    
    
    function drawSwitch(draw, x, y, width, height, opacity = 1) {
      const switchGroup = draw.group();
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
  switchGroup.on("click", () => {
    console.log("bro where am i")
    if (!(gasValveOpen && verticalValveOpen)) {
      isOn = !isOn;
      switchGroup.isOn = isOn;
      if (switchGroup.isOn) {
        // reactorIsOpen = true;
        handle.animate(200).rotate(40, x + width / 2, y + height / 2);
        currentTemp = changedTemp;
        if (readout && typeof readout.text === 'function') {
          readout.text(currentTemp + '°C');
          if (typeof readout.show === 'function') readout.show();
        }
      } else {
        // reactorIsOpen = false;
        handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
        currentTemp = 15;
        if (readout && typeof readout.text === 'function') {
          readout.text(currentTemp + '°C');
          // if (typeof readout.hide === 'function') readout.hide();
        }
      }
    }
  });
      return switchGroup;
    }
    
    function drawTemperatureController(draw, x, y, initialTemp = 20, minTemp = 15, maxTemp = 25, step = 5, onChange) {
      const g = draw.group();
      g.attr({ 'pointer-events': 'all' });
      
      // Container
      const W = 100, H = 50, R = 6;
      g.rect(W, H).move(x, y).radius(R).fill('#f0f0f0').stroke({ color: '#444', width: 1 });
      
      // Display background
      const dispW = 60, dispH = 28;
      const dispX = x + (W - dispW) / 2;
      const dispY = y + 5;
      g.rect(dispW, dispH).move(dispX, dispY).radius(4).fill('#222').stroke({ color: '#111', width: 0.6 });
      
      // Display text
      const readout1 = g.text(changedTemp + '°C')
      .font({ family: 'Arial', size: 16, anchor: 'middle'})
      .fill('#fff')
      .center(dispX + dispW / 2, dispY + dispH / 2);
      
      function updateDisplay() {
        // clamp
        // currentTemp = changedTemp;
        // Robustly refresh the text node (plain() avoids tspan quirks)
        if (readout1 && readout1.clear && readout1.plain) {
          readout1.clear().plain(changedTemp + '°C');
        } else {
          // fallback for older svg.js
          readout1.text(changedTemp + '°C');
        }
        // re-center and bring to front
        if (readout1.center) readout1.center(dispX + dispW / 2, dispY + dispH / 2);
        if (readout1.front) readout1.front();
        // notify listener
        if (typeof onChange === 'function') onChange(changedTemp);
      }
      
      // Buttons
      const btnSize = 20;
      const btnY = y + H - btnSize - 4;
      
      const minus = g.rect(btnSize, btnSize).move(x + 10, btnY).radius(4).fill('#e8e8e8').stroke({ color: '#666', width: 1 });
      const minusText = g.text('−')
      .font({ family: 'Arial', size: 16, anchor: 'middle', weight: 700 })
      .fill('#333')
      .center(x + 10 + btnSize / 2, btnY + btnSize / 2)
      .attr({ 'pointer-events': 'auto' });
      
      const plus = g.rect(btnSize, btnSize).move(x + W - btnSize - 10, btnY).radius(4).fill('#e8e8e8').stroke({ color: '#666', width: 1 });
      const plusText = g.text('+')
      .font({ family: 'Arial', size: 16, anchor: 'middle', weight: 700 })
      .fill('#333')
      .center(x + W - btnSize / 2 - 10, btnY + btnSize / 2)
      .attr({ 'pointer-events': 'auto' });
      
      function inc() {
        const next = changedTemp + step;
        if (next <= maxTemp && !isHeaterOn) {
          changedTemp = next;
          updateDisplay();
        } else {
          // still force a refresh in case UI got desynced
          // updateDisplay();
        }
      }
      function dec() {
        const next = changedTemp - step;
        if (next >= minTemp && !isHeaterOn) {
          changedTemp = next;
          updateDisplay();
        } else {
          // still force a refresh in case UI got desynced
          // updateDisplay();
        }
      }
      
      // Enable clicks on both the rect and the text and also listen to pointerdown (more reliable)
      [minus, minusText].forEach(el => {
        el.on('click', dec);
        // el.on('pointerdown', (e) => { e.preventDefault(); dec(); });
        el.style('cursor', 'pointer');
        if (typeof el.front === 'function') el.front();
      });
      [plus, plusText].forEach(el => {
        el.on('click', inc);
        // el.on('pointerdown', (e) => { e.preventDefault(); inc(); });
        el.style('cursor', 'pointer');
        if (typeof el.front === 'function') el.front();
      });
      
  // Ensure the readout is above the button layers
  if (readout && typeof readout.front === 'function') readout.front();
      
      // API
      g.getTemp = () => currentTemp;
      g.setTemp = (t) => { updateDisplay(); };
      
      if (typeof g.front === 'function') g.front();
      // updateDisplay();
      return g;
    }
    
    function drawTemperatureReadOut(draw, x, y, initialTemp = 20) {
      const g = draw.group();
      g.attr({ 'pointer-events': 'all' });
      
      // Container
      const W = 100, H = 50, R = 6;
      g.rect(W, H).move(x, y).radius(R).fill('black').stroke({ color: '#444', width: 1 });
      
      // Display background
      const dispW = 60, dispH = 28;
      const dispX = x + (W - dispW) / 2;
      const dispY = y + 10;
      g.rect(dispW, dispH).move(dispX, dispY).radius(4).fill('white').stroke({ color: '#111', width: 0.6 });
      
      // Display text
      readout = g.text(currentTemp + '°C')
      .font({ family: 'Arial', size: 16, anchor: 'middle'})
      .fill('black')
      .center(dispX + dispW / 2, dispY + dispH / 2);
      // updateDisplay();
      return g;
    }
    
    function drawValve(draw, valveCenterX, valveCenterY, radius, opacity = 1) {
      const valveGroup = draw.group();
      valveGroup.circle(40)
      .fill({ color: '#8cbfe9', opacity: opacity })
      .stroke({ color: 'black', opacity: opacity, width: 2 })
      .center(valveCenterX, valveCenterY)
      .front();
      valveGroup.rect(10, 44)
      .fill({ color: '#8cbfe9', opacity: opacity })
      .stroke({ color: 'black', opacity: opacity, width: 2, linecap: 'round' })
      .center(valveCenterX, valveCenterY)
      .front();
      
      valveGroup.on('click', () => {
        valveGroup.isRotated = !valveGroup.isRotated;
        if (valveGroup.isRotated) {
          valveGroup.animate(300).rotate(90, valveCenterX, valveCenterY);
          timerId = startTimer(draw, currentTemp);
          animateBubbleFlow(draw);
        } else {
          valveGroup.animate(300).rotate(-90, valveCenterX, valveCenterY);
          clearInterval(timerId);
          animateBubbleFlow(draw);
        }
        gasValveOpen = valveGroup.isRotated;
        animateGasFlow(draw);
        animateBubbleFlow(draw);
      });
      return valveGroup;
    }
    
    function animateGasFlow(draw) {
      if (!verticalValveOpen) {
        // Stop all flows when vertical valve closes
        draw.find('path')
        .filter(el =>  el.attr('data-pipe-side') === 'gas' || el.attr('data-pipe-side') === 'valve')
        .forEach(el => el.remove());
        // gasFlowRateText.text('0');
      } else {
        [window.leftPipe1].forEach(pipeEl => {
          if (pipeEl) {
            animateWaterFlow(draw, pipeEl, 0, 100, undefined, undefined, undefined, 'gas');
            // gasFlowRateText.text('35');
            gasFlowRateDevice.front();
            gasFlowRateText.front();
            valve.front();
          }
        });
        // console.log(multiValvePosition, gasValveOpen);
      }
      
      if (gasValveOpen && verticalValveOpen) {
        [window.leftPipe2].forEach(pipeEl => {
          if (pipeEl) {
            animateWaterFlow(draw, pipeEl, 0, 100, undefined, undefined, undefined, 'valve');
            if (container && typeof container.startBubbles === 'function') {
              container.startBubbles();
            }
            gasFlowRateText.text('35');
            valve.front();
            container.front();
          }
        });
      } else {
        draw.find('path')
        .filter(el => el.attr('data-pipe-side') === 'valve')
        .forEach(el => el.remove());
        if (container && typeof container.stopBubbles === 'function') {
          container.stopBubbles();
        }
        gasFlowRateText.text('0');
      }
    }
    
    function animateBubbleFlow(draw) {    
      if (gasValveOpen && verticalValveOpen) {
        // Keep the existing flow highlight along the pipe to the outlet
        [window.leftPipe3].forEach(pipeEl => {
          if (pipeEl) {
            animateWaterFlow(draw, pipeEl, 0, 100, '#9dd2ff', 8, 0.3, 'bubble');
            // emit(pipeEl);
          }
        });
        updateVentIndicator(draw, true);
      } else {
        // remove any animated flow strokes tagged for bubbles
        draw.find('path')
        .filter(el => el.attr('data-pipe-side') === 'bubble')
        .forEach(el => el.remove());
        // stopEmit();
        updateVentIndicator(draw, false);
      }
    }
    
    
    function animateWaterFlow(draw, pipeEl, delay = 0, duration = 100, waterColor = 'red', waterWidth = 4, opacity = 1, side) {
      const d = pipeEl.attr('d');
      const water = draw.path(d)
      .fill('none')
      .stroke({
        color: waterColor,
        opacity: opacity,
        width: waterWidth,
        linejoin: 'round'
      });
      // waterGroup.add(water);
      const totalLength = water.node.getTotalLength();
      water.attr({
        'stroke-dasharray': totalLength,
        'stroke-dashoffset': totalLength
      });
      
      water.delay(delay).animate(duration).attr({ 'stroke-dashoffset': 0 });
      if (side) {
        water.attr('data-pipe-side', side);
      }
      
      return water;
    }
    
    function addSVGImage(draw, url, x = 0, y = 0, width, height) {
      const img = draw.image(url)
      .size(width, height)                      // force the element to the given dimensions
      .move(x, y)
      .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
      return img;
    }
    
    
    function startTimer(draw, temp, interval = 1000) {
      console.log('Starting timer with temp:', temp);
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      // let elapsedSeconds = 0;
      let rate = 0;
      timerId = setInterval(() => {
        // Calculate mass rate [g/s] and update elapsed time
        if (gasValveOpen && verticalValveOpen) {
          // Advance simulated time at TIME_SCALE × real time
          const realDeltaSec = interval / 1000;
          const simDeltaSec = realDeltaSec * TIME_SCALE;
          elapsedSeconds += simDeltaSec;
          // Increment accumulated mass
          const simulatedMinutes = elapsedSeconds / 60; // seconds → minutes
          const volume = volumeAtTime(temp, simulatedMinutes, { useWorksheetFN2: true, useAntoine: true });
          console.log(volume, elapsedSeconds);
          const TANK_H = 300;
          const WALL = 6;
          const liquidH = (TANK_H - 5 - 2 * WALL) * (volume / 70);
          const liquidY = 80 + WALL + (TANK_H - 2 * WALL - liquidH);
          if (container && container.liquid) {
            // Update existing liquid rectangle without redrawing
            container.liquid.height(liquidH);
            container.liquid.y(liquidY - 5);
          }
          
          if (volume <= 0.2 * 61.5) {
            if (isHeaterOn) {
              isHeaterOn = false;
              switchGroup.clear();
              switchGroup = drawSwitch(draw, 750, 200, 80, 40);
              // readout.hide();
              if (container && typeof container.applyOffGradient === 'function') {
                container.applyOffGradient();
              }
              // stopBubbles();
              clearInterval(timerId);
              animateBubbleFlow(draw);
            }
            if (gasValveOpen) {
              gasValveOpen = false;
              if (valve) { valve.isRotated = false; }
              valve.animate(300).rotate(-90, 580, 450);
              animateGasFlow(draw);
              animateBubbleFlow(draw);
            }
          }
        }
        // Log formatted output
      }, interval);
      return timerId;
    }
    
    export function reset(draw) {
      // 1) Stop emission timers first
      // if (outletBubbleTimer) {
      //   clearInterval(outletBubbleTimer);
      //   outletBubbleTimer = null;
      // }
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      
      // 2) Clear outlet bubble layer and force fresh layer on next start
      // if (outletBubbleLayer) {
      //   outletBubbleLayer.clear();
      //   outletBubbleLayer = null; // allow animateBubbleFlow() to recreate cleanly
      // }
      
      // 3) Clear any animated overlay strokes
      if (draw && typeof draw.find === 'function') {
        draw.find('path')
        .filter(el => {
          const side = el.attr('data-pipe-side');
          return side === 'gas' || side === 'valve' || side === 'bubble';
        })
        .forEach(el => el.remove());
      }
      // Remove vent indicator so a fresh run recreates it
      if (ventIndicator) { ventIndicator.remove(); ventIndicator = null; }
      ventMarker = null;
      ventLabel = null;
      
      // 4) Reset core state flags (do not null DOM refs so handlers keep working)
      verticalValveOpen = false;
      gasValveOpen = false;
      isHeaterOn = false;
      elapsedSeconds = 0;
      
      // 5) Stop in-vessel bubbling if available and reset readouts
      if (container && typeof container.stopBubbles === 'function') {
        container.stopBubbles();
      }
      if (gasFlowRateText && typeof gasFlowRateText.text === 'function') {
        gasFlowRateText.text('0');
        if (typeof gasFlowRateText.front === 'function') gasFlowRateText.front();
      }

  // Intentionally do NOT change currentTemp or the controller/readout display on reset.
  // This preserves the last set temperature on the controller UI.
  currentTemp = 15;
    }