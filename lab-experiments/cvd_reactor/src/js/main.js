import { off } from '@svgdotjs/svg.js';
import * as config from '../js/config.js';
import { massSiO2WithoutRecycle, massSiO2WithRecycle } from '../js/calc.js';

// Helper to pause execution in async functions
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const canvasWidth = config.canvasWidth;
const canvasHeight = config.canvasHeight;
export const mainCylWidth = 60;
export const mainCylHeight = 250;
export const nozzleRect1Width = 30;
export const nozzleRect1Height = 12;
export const nozzleRect2Width = 15;
export const nozzleRect2Height = 20;
export const nozzleRect3Width = 30;
export const nozzleRect3Height = 12;
export const valveBlockWidth = 20; // Horizontal Valve (Not used in final drawing?)
export const valveBlockHeight = 40;
export const verticalValveBlockWidth = 15;
export const verticalValveBlockHeight = 7.5;
export const verticalValveBodyWidth = 15;
export const verticalValveBodyHeight = 20;
export const verticalValveStemWidth = 5;
export const verticalValveStemHeight = 10;
export const verticalValveTrapezoidWidth = 5;
export const verticalValveTopExtent = 15;
let pipeGroup = null; // Global reference to pipe group for drawing pipes

let valve = null
let valve1 = null
let multiValvePosition = 270

let gasValveOpen = false;

let leftPipe = null;
let leftPipe1 = null;
let leftPipe2 = null;
let leftPipe3 = null;
let leftPipe4 = null;
let leftPipe5 = null;
let leftPipe6 = null;

let recycleRatio = 0;
let recycleValve = null;
let isPumpOn = false;

let accumulatedMass = 0;
let timerId = null;
let reactorIsOpen = false;
let gasFlowingToReactor = false;
let flowRate = null;
let gasFlowRateDevice = null;

export function startDepositionTimer(interval = 1000) {
  // If a timer is already running, clear it first
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  let elapsedSeconds = 0;
  let rate  = 0
  timerId = setInterval(() => {
    // Calculate mass rate [g/s] and update elapsed time
    if (gasFlowingToReactor && reactorIsOpen) {
      if (recycleRatio > 0) {
        rate = massSiO2WithRecycle(1, 0.002, 0.65, recycleRatio);
      } else {
        rate = massSiO2WithoutRecycle(1, 0.002, 0.65);
      }
      
      elapsedSeconds += interval / 1000;
      
      // Increment accumulated mass
      accumulatedMass += rate * (interval / 1000);
      
      window.massTextEl.text(`mass gain: ${accumulatedMass.toFixed(3)} g`);
      console.log(
        `Time: ${elapsedSeconds.toFixed(1)} s — Rate: ${rate.toFixed(5)} g/s — Accumulated: ${accumulatedMass.toFixed(5)} g`
      );
    }
    
    // Log formatted output
    
  }, interval);
  
  return timerId;
}


export function drawFigure(draw) {
  // Text box to display accumulated mass gain
  const massBoxGroup = draw.group();
  massBoxGroup.rect(160, 30)
  .fill('#ffffff')
  .stroke({ color: '#000000', width: 1 })
  .move(450, 200);
  const massText = massBoxGroup.text('mass gain: 0 g')
  .font({ family: 'Arial', size: 14, anchor: 'start' })
  .move(455, 205);
  // Store reference for future updates
  window.massTextEl = massText;
  // startDepositionTimer(1000)
  draw.line(350, 320, 400, 355)
  .stroke({ color: '#444', width: 2, linecap: 'round' });
  addSVGImage(draw, 'assets/bubbler.svg', 20, 250, 250, 250);
  drawGasCylinder(draw, 0, canvasHeight - 250, 'He gas cylinder');
  drawHorizontalCVDReactor(draw, 400, 50, 200, 60);
  createInteractiveValve(draw, 250, 80, true);
  createVerticalValve(draw, 22.5, 250);
  // valve = createInteractiveValve(draw, 900, 80, false);
  // valve.rotate(90, 900, 80);
  // valve1 = createInteractiveValve(draw, 250, 280, false);
  // valve1.rotate(90, 250, 280);
  drawPipes(draw);
  recycleValve = drawCutoffValve(draw, 900, 300, 40);
  drawHoodString(draw);
  drawPump(draw, 400, 350, 60, 30);
  drawSwitch(draw, 650, 120, 80, 40);
  draw.line(600, 120, 650, 130)
  .stroke({ color: '#444', width: 2, linecap: 'round' });
  draw.text('TEOS')
  .font({ family: 'Arial', size: 20, anchor: 'start', weight: 'bold', strokeColor: '#000' })
  .fill('black')
  .move(118, 350);
  drawPumpSVG(draw, 375, 247.5, 5, 5)
  const connector = drawThreeWayValve(draw, 860, 62.5);
  connector.rotate(180, 891.5, 81);
  
  const connector2 = drawThreeWayValve(draw, 220, 300);
  connector2.rotate(180, 257, 298.5);
  
  draw.text('furnace')
  .font({ family: 'Arial', size: 14, anchor: 'start', strokeColor: '#000' })
  .fill('black')
  .move(667.5, 160);
  
  gasFlowRateDevice = addSVGImage(draw, 'assets/gasFlowRateDevice.svg', 160, 208, 135, 100);
  gasFlowRate(draw, false); // Initially off
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
  
  function gasFlowRate(draw, on = True) {
    flowRate = draw.text(on ? '1 mol/s' : '0 mol/s')
    .font({ family: 'Arial', size: 10, anchor: 'start', strokeColor: '#000' })
    .fill('black')
    .move(211, 232.5);
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
  
  function addSVGImage(draw, url, x = 0, y = 0, width, height) {
    const img = draw.image(url)
    .size(width, height)                      // force the element to the given dimensions
    .move(x, y)
    .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
    return img;
  }
  
  export function drawHorizontalCVDReactor(parent, x, y, length = 200, diameter = 60) {
    const group = parent.group().move(x, y);
    
    // Create a linear heating gradient from red to yellow
    const heatGradient = parent.gradient('linear', add => {
      add.stop(0, '#0000ff');
      add.stop(0.5, '#00ffff');
      add.stop(1, '#0000ff');
    }).from(0, 0).to(1, 0);
    heatGradient.id('reactorGradient');             // Assign an ID
    window.reactorGradient = heatGradient;          // Expose globally
    
    // Main tube
    group.rect(length, diameter)
    .fill('#dddddd')
    .stroke({ color: '#444', width: 2 })
    .move(x, y);
    
    
    // Draw internal heating coil as a series of elliptical loops
    const coilCount = Math.floor(length / 15);
    const coilSpacing = length / coilCount;
    const coilHeight = diameter - 20;
    for (let i = 0; i < coilCount; i++) {
      group.ellipse(coilSpacing, coilHeight)
      .fill('#3399ff')
      .stroke({ color: '#333', width: 1 })
      .move(x + i * (coilSpacing - 4) + 25, y + (diameter - coilHeight) / 2)
    }
    
    const upperTube = group.rect(length, diameter / 2)
    .fill(heatGradient)
    .stroke({ color: '#444', width: 2 })
    .move(x, y - diameter / 1.7);
    window.reactorUpper = upperTube;
    
    const lowerTube = group.rect(length, diameter / 2)
    .fill(heatGradient)
    .stroke({ color: '#444', width: 2 })
    .move(x, y + diameter / 0.92);
    window.reactorLower = lowerTube;
    
    group.rect(length - 20, 4)
    .fill("yellow")
    .stroke({ color: '#444', width: 0.5 })
    .move(x + 10, y + diameter / 1.08);
    
    // Draw AC symbols at both ends of the yellow bar
    const barY = y + diameter / 1.08 + 70;
    const symR = 8;
    const leftX = x + 10;
    const rightX = x + length - 10;
    const centerX = (leftX + rightX) / 2;
    const symbolY = barY - symR - 2;
    // Draw AC symbols at both ends of the yellow bar
    // Wires from yellow bar endpoints to symbol
    
    drawConnectionCurve(group, 375, 150, centerX - symR, symbolY);
    group.line(410, 106, 375, 106)
    .stroke({ color: '#000', width: 1 });
    group.line(375, 106, 375, 150)
    .stroke({ color: '#000', width: 1 });
    drawConnectionCurve(group, 625, 150, centerX + symR, symbolY);
    group.line(590, 106, 625, 106)
    .stroke({ color: '#000', width: 1 });
    group.line(625, 106, 625, 150)
    .stroke({ color: '#000', width: 1 });
    
    // Draw the AC symbol circle
    group.circle(symR * 2)
    .fill('#fff')
    .stroke({ color: '#000', width: 1 })
    .center(centerX, symbolY);
    
    // Sine wave inside the circle
    group.path(
      `M${centerX - symR + 2},${symbolY} ` +
      `C${centerX - symR/2},${symbolY - 6} ` +
      `${centerX + symR/2},${symbolY + 4} ` +
      `${centerX + symR - 2},${symbolY}`
    )
    .fill('none')
    .stroke({ color: '#000', width: 1 });
    return group;
  }
  
  
  export function drawConnectionCurve(parent, x1, y1, x2, y2, opts = {}) {
    const strokeColor = opts.stroke || '#000';
    const strokeWidth = opts.strokeWidth || 2;
    // Control points for a smooth vertical arc
    const cx1 = x1;
    const cy1 = (y1 + y2) / 2;
    const cx2 = x2;
    const cy2 = (y1 + y2) / 2;
    const d = `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;
    return parent.path(d)
    .fill('none')
    .stroke({ color: strokeColor, width: strokeWidth });
  }
  
  export function createInteractiveValve(draw, x, y, controller = true, isThreeValve = false) {
    const group = draw.group();
    const radius = config.interactiveValveRadius;
    
    // Define initial entry positions (in degrees)
    // Tank positions: 1 at 180°, 2 at 90°, 3 at 0°, Outlet at 270°
    let entryAngles = [270, 0, 90, 180];
    const rotationSequence = isThreeValve ? [270, 0, 180] : [270, 0, 90, 180]; // Angles pointer stops at
    
    // Draw markers for each entry.
    entryAngles.forEach(angle => {
      const rad = angle * Math.PI / 180;
      const markerDistance = radius + config.interactiveValveMarkerOffset;
      const markerX = x + markerDistance * Math.cos(rad);
      const markerY = y + markerDistance * Math.sin(rad);
      if (angle === 90) {
        if (!isThreeValve) {
          group.rect(20, 10).fill('black').center(markerX, markerY);
        }
      } else if (angle === 270) {
        group.rect(20, 10).fill('gray').center(markerX, markerY);
      } else if (angle === 0) {
        group.rect(10, 20).fill('black').center(markerX, markerY);
      }
    });
    
    // Draw valve circle (outer and inner)
    group.circle(radius * 2)
    .fill('#b4b4ff')
    .stroke({ color: '#444', width: 2 })
    .center(x, y);
    group.circle(radius)
    .fill('white')
    .stroke({ color: '#444', width: 2 })
    .center(x, y);
    
    if (controller) {
      // Create pointer group
      const pointerGroup = group.group();
      const pointerLength = radius - config.interactiveValvePointerOffset;
      pointerGroup.polygon(`${pointerLength},0 0,-5 0,5`) // Arrow shape
      .fill('green')
      .stroke({ color: '#444', width: 1 });
      pointerGroup.center(x, y); // Position pivot point at valve center
      
      let currentAngleIndex = 1;
      pointerGroup.rotate(270, x, y); // Initialize to 270 degrees
      
      entryAngles = [0, 270];
      const entryAngles1 = [90, 270]; // Initialize to current state or default
      
      group.on('click', async function() {
        currentAngleIndex = (currentAngleIndex + 1) % entryAngles.length;
        const targetAngle = entryAngles[currentAngleIndex];
        multiValvePosition = targetAngle; // Update global state
        
        pointerGroup.animate(300).rotate(entryAngles1[currentAngleIndex], x, y);
        animateFLowToReactor(draw);
        animateRecycleFlow(draw);
        console.log(multiValvePosition, gasValveOpen);
      });
    }
    
    return group;
  }
  
  async function animateFLowToReactor(draw) {
    if (isPumpOn && multiValvePosition === 0 && gasValveOpen) {
      gasFlowingToReactor = true;
      animateWaterFlow(draw, window.leftPipe4El, 0, 100, undefined, undefined, undefined, 'reactor');
      startDepositionTimer(1000);
      await sleep(100);
      animateWaterFlow(draw, window.leftPipe5El, 0, 100, undefined, undefined, undefined, 'reactor');
      await sleep(100);
      animateWaterFlow(draw, window.leftPipe6El, 0, 100, undefined, undefined, undefined, 'reactor');
      recycleValve.front();
    } else {
      gasFlowingToReactor = false;
      clearInterval(timerId);
      timerId = null;
      draw.find('path')
      .filter(el => el.attr('data-pipe-side') === 'reactor')
      .forEach(el => el.remove());
      console.log("Stopping flow in pipes 4 and 5");
    }
    
    console.log("Gas flowing to reactor:", gasFlowingToReactor);
  }
  
  function createVerticalValve(draw, x, y) {
    
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
        gasValveOpen = group.isOpen;
        if (!group.isOpen) {
          // Stop all flows when vertical valve closes
          draw.find('path')
          .filter(el => !!el.attr('data-pipe-side'))
          .forEach(el => el.remove());
          flowRate.clear();
          gasFlowRate(draw, false);
        } else {
          [window.leftPipe1El, window.leftPipe2El, window.leftPipe2_1El].forEach(pipeEl => {
            if (pipeEl) {
              animateWaterFlow(draw, pipeEl, 0, 100, undefined, undefined, undefined, 'right');
              flowRate.clear();
              gasFlowRate(draw, true);
              gasFlowRateDevice.front();
              flowRate.front();
            }
          });
          // console.log(multiValvePosition, gasValveOpen);
        }
        animatePumpFlow(draw);
        animateRecycleFlow(draw);
        animateFLowToReactor(draw);
        if (knob && typeof knob.animate === 'function') { // Check if knob exists and is animatable
          const color = group.isOpen ? '#ffa500' : '#000000';
          knob.animate(300).fill(color);
        } else if (knob) {
          const color = group.isOpen ? '#ffa500' : '#000000';
          knob.fill(color);
        }
      });
      
      return group;
    }
    
    function drawPipes(draw) {
      pipeGroup = draw.group();
      let startX = 30;
      let startY = canvasHeight - 294;
      
      leftPipe = `
    M ${startX} ${startY} 
    L ${startX} ${startY - 20}
  `;
      drawPipeWithCurves(draw, leftPipe, 4, 'red');
      
      const leftPipe1Path = `
    M ${startX} ${startY - 56.5} 
    L ${startX} ${startY - 100}
    L ${startX + 30} ${startY - 100}
    L ${startX + 30} ${startY - 27.5}
    L ${startX + 67.5} ${startY - 27.5}
  `;
      window.leftPipe1El = drawPipeWithCurves(draw, leftPipe1Path, 4);
      
      const leftPipe2Path = `
    M ${startX + 163} ${startY - 27.5}
    L ${startX + 163 + 62} ${startY - 27.5}
  `;
      window.leftPipe2El = drawPipeWithCurves(draw, leftPipe2Path, 4);
      
      const leftPipe2_1Path = `
    M ${startX + 255} ${startY - 27.5}
    L ${startX + 250 + 26} ${startY - 27.5}
  `;
      window.leftPipe2_1El = drawPipeWithCurves(draw, leftPipe2_1Path, 4);
      
      leftPipe3 = `
    M ${startX + 297.5} ${startY - 82}
    L ${startX + 297.5} ${startY - 120}
    L ${startX + 220} ${startY - 120}
    L ${startX + 220} ${startY - 193}
  `;
      window.leftPipe3El = drawPipeWithCurves(draw, leftPipe3, 4);
      
      leftPipe4 = `
    M ${startX + 252.5} ${startY - 225}
    L ${startX + 175 + 194} ${startY - 225}
  `;
      window.leftPipe4El = drawPipeWithCurves(draw, leftPipe4, 4);
      
      leftPipe5 = `
    M ${startX + 571} ${startY - 225}
    L ${startX + 853} ${startY - 225}
  `;
      window.leftPipe5El = drawPipeWithCurves(draw, leftPipe5, 4);
      
      leftPipe6 = `
    M ${startX + 870} ${startY - 209}
    L ${startX + 870} ${startY + 10}
  `;
      window.leftPipe6El = drawPipeWithCurves(draw, leftPipe6, 4);
      
      const leftPipe7 = `
    M ${startX + 870} ${startY + 10}
    L ${startX + 870} ${startY + 225}
    L ${startX + 240} ${startY + 225}
    L ${startX + 240} ${startY - 11.5}
  `;
      window.leftPipe7El = drawPipeWithCurves(draw, leftPipe7, 4);
    }
    
    function drawPipeWithCurves(draw, pathString, pipeWidth = 15, strokeColor = '#f7f7f7', outlineColor = '#d5d5d5') {
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
    
    export function drawCutoffValve(draw, x, y, size = 40) {
      const half = size / 2;
      const group = draw.group().center(x, y);
      
      group.flowRate = group.flowRate || 0;
      // Display current flow rate
      let rateText = group.text("recycle ratio: " + String(group.flowRate))
      .font({ family: 'Arial', size: 14, anchor: 'start' })
      .fill('#000')
      .move(x - size/2 - 100, y - 7);
      
      // Outer circle for valve body
      group.circle(size)
      .fill('#eee')
      .stroke({ color: '#444', width: 2 })
      .center(x, y);
      
      // Diagonal bar across circle (closed position)
      group.line(-half * 0.7, -half * 0.7, half * 0.7, half * 0.7)
      .stroke({ color: '#a00', width: 2, linecap: 'round' })
      .center(x, y);
      
      // Valve handle perpendicular to diagonal
      group.line(-half * 0.7, half * 0.7, half * 0.7, -half * 0.7)
      .stroke({ color: '#a00', width: 2, linecap: 'round' })
      .center(x, y);
      
      group.line(0, half, 0, -half)
      .stroke({ color: '#444', width: 2, linecap: 'round' })
      .center(x, y);
      
      group.line(half, 0, -half, 0)
      .stroke({ color: '#444', width: 2, linecap: 'round' })
      .center(x, y);
      
      group.circle(size * 0.6)
      .fill('#ccc')
      .stroke({ color: '#444', width: 1 })
      .center(x, y);
      
      
      group.circle(size * 0.1)
      .fill('black')
      .stroke({ color: '#444', width: 2 })
      .center(x, y);
      
      // Interactive flow-rate selector on click
      group.on('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Remove existing control box
        const prev = document.getElementById('cutoff-valve-controls');
        if (prev) prev.remove();
        
        // Create control container
        const container = document.createElement('div');
        container.id = 'cutoff-valve-controls';
        Object.assign(container.style, {
          position: 'absolute',
          background: 'white',
          border: '1px solid #444',
          padding: '8px',
          'border-radius': '4px',
          'box-shadow': '0 2px 6px rgba(0,0,0,0.2)',
          'z-index': '1000',
          display: 'flex',
          'align-items': 'center'
        });
        
        // Build dropdown
        const select = document.createElement('select');
        [0,1,2,5].forEach(val => {
          const opt = document.createElement('option');
          opt.value = val;
          opt.text = val;
          select.appendChild(opt);
        });
        container.appendChild(select);
        if (group.flowRate !== undefined) {
          select.value = group.flowRate;
        }
        
        // Build set button
        const button = document.createElement('button');
        button.textContent = 'Set';
        button.style.marginLeft = '8px';
        container.appendChild(button);
        
        // Append to body before positioning to measure size
        document.body.appendChild(container);
        
        // Position container to the left of the valve icon
        const rect = this.node.getBoundingClientRect();
        const cw = container.offsetWidth;
        const ch = container.offsetHeight;
        container.style.left = (rect.left - cw - 10) + 'px';
        container.style.top = (rect.top + rect.height/2 - ch/2) + 'px';
        
        // Handle Set button
        button.addEventListener('click', () => {
          const rate = select.value;
          group.flowRate = rate;
          rateText.text("recycle ratio: " + String(group.flowRate));
          console.log('Valve flow-rate set to', rate);
          container.remove();
          recycleRatio = rate;
          
          if (rate != 0) {
            animateRecycleFlow(draw);
            group.front();
          } else {
            // Stop flow if rate is zero
            draw.find('path')
            .filter(el => el.attr('data-pipe-side') === 'recycle')
            .forEach(el => el.remove());
          }
        });
        
        // Close dropdown when clicking outside
        setTimeout(() => {
          function onDocClick(e) {
            if (!container.contains(e.target) && e.target !== this.node) {
              container.remove();
              document.removeEventListener('click', onDocClick);
            }
          }
          document.addEventListener('click', onDocClick);
        }, 0);
      });
      
      
      return group;
    }
    
    function animateRecycleFlow(draw) {
      if (recycleRatio != 0 && gasValveOpen && multiValvePosition === 0 && isPumpOn) {
        animateWaterFlow(draw, window.leftPipe7El, 0, 100, undefined, undefined, undefined, 'recycle');
      } else {
        // Stop flow if rate is zero
        draw.find('path')
        .filter(el => el.attr('data-pipe-side') === 'recycle')
        .forEach(el => el.remove());
      }
      recycleValve.front();
    }
    
    function animatePumpFlow(draw) {
      if (isPumpOn && gasValveOpen) {
        // Animate flow in pipes 4 and 5
        animateWaterFlow(draw, window.leftPipe3El, 0, 100, undefined, undefined, undefined, 'pump');
        // flowRate.clear();
        // gasFlowRate(draw, true);
        // gasFlowRateDevice.front();
        // flowRate.front();
      } else {
        // Stop flow in pipes 4 and 5
        draw.find('path')
        .filter(el => el.attr('data-pipe-side') === 'pump')
        .forEach(el => el.remove());
        // flowRate.clear();
        // gasFlowRate(draw, false);
      }
    }
    
    function drawHoodString(draw) {
      draw.text("hood")
      .font({ family: 'Arial', size: 14, anchor: 'start' })
      .fill('#000')
      .move(235,0);
      
      drawArrowLine(draw, 250, 45, 250, 20, {
        color: '#ff0000',
        width: 3,
        len: 12,
        base: 8
      });
      
      draw.text("hood")
      .font({ family: 'Arial', size: 14, anchor: 'start' })
      .fill('#000')
      .move(970,72.5);
      
      drawArrowLine(draw, 934, 80, 960, 80, {
        color: '#ff0000',
        width: 3,
        len: 12,
        base: 8
      });
    }
    
    function drawPump(draw, x, y, width, height, opacity = 1) {
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
      switchGroup.click(() => {
        isOn = !isOn;
        switchGroup.isOn = isOn;
        isPumpOn = !isPumpOn;
        animatePumpFlow(draw);
        animateFLowToReactor(draw);
        animateRecycleFlow(draw);
        if (isOn) {
          handle.animate(200).rotate(40, x + width / 2, y + height / 2);
          startDepositionTimer(1000);
        } else {
          handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
          clearInterval(timerId);
          timerId = null;
        }
      });
      return switchGroup;
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
      switchGroup.click(() => {
        isOn = !isOn;
        switchGroup.isOn = isOn;
        if (isOn) {
          reactorIsOpen = true;
          handle.animate(200).rotate(40, x + width / 2, y + height / 2);
        } else {
          reactorIsOpen = false;
          handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
        }
        // Update reactor gradient on switch toggle
        if (window.reactorGradient) {
          // Clear existing gradient stops
          window.reactorGradient.children().forEach(stop => stop.remove());
          if (isOn) {
            // Hot gradient: red → yellow → red
            window.reactorGradient.stop(0, '#ff0000');
            window.reactorGradient.stop(0.5, '#ffff00');
            window.reactorGradient.stop(1, '#ff0000');
          } else {
            // Cool gradient: blue → cyan → blue
            window.reactorGradient.stop(0, '#0000ff');
            window.reactorGradient.stop(0.5, '#00ffff');
            window.reactorGradient.stop(1, '#0000ff');
          }
        }
      });
      return switchGroup;
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
    
    /**
    * Draws a straight line with an arrowhead at the end using an SVG marker.
    * @param {SVG.Container} draw - The svg.js draw context.
    * @param {number} x1 - The x-coordinate of the start point.
    * @param {number} y1 - The y-coordinate of the start point.
    * @param {number} x2 - The x-coordinate of the end point.
    * @param {number} y2 - The y-coordinate of the end point.
    * @param {object} [options] - Optional styling parameters.
    * @param {string} [options.color='#000'] - Stroke and fill color.
    * @param {number} [options.width=2] - Stroke width.
    * @param {number} [options.arrowLength=10] - Length of the arrowhead.
    * @param {number} [options.arrowWidth=7] - Width of the arrowhead base.
    * @returns {SVG.Line} The line element with an arrow marker at the end.
    */
    function drawArrowLine(draw, x1, y1, x2, y2, options = {}) {
      const {
        color = '#000',
        width = 2,
        arrowLength = 4,
        arrowWidth = 4
      } = options;
      
      // Define an arrowhead marker
      const marker = draw.marker(arrowWidth, arrowLength, add => {
        // Draw a triangle pointing right; it will be rotated to match the line direction
        add.path(`M0,0 L ${arrowWidth} ${arrowLength/2} L0 ${arrowLength} Z`)
        .fill(color);
      });
      
      // Draw the main line and attach the marker at its end
      const line = draw
      .line(x1, y1, x2, y2)
      .stroke({ color, width, linecap: 'round' })
      .marker('end', marker);
      
      return line;
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
    
    
    /**
    * Draws a realistic 3-way pipe joint matching the provided SVG shape.
    * @param {SVG.Container} draw - The svg.js draw context.
    * @param {number} x - X-coordinate of the junction's top-left corner.
    * @param {number} y - Y-coordinate of the junction's top-left corner.
    * @param {number} width - Desired width of the joint.
    * @param {number} height - Desired height of the joint.
    * @param {object} [options] - Styling options.
    * @param {string} [options.color='#888'] - Stroke/fill color.
    * @param {number} [options.strokeWidth=2] - Stroke width for the main path.
    * @returns {SVG.G} The group containing the joint graphic.
    */
    export function drawThreeWayValve(draw, x, y, width = 64, height = 80, options = {}) {
      const {
        color = '#888',
        strokeWidth = 2
      } = options;
      
      // Create group and apply translation
      const g = draw.group().move(x, y);
      
      // Create a subtle metallic gradient for the pipe
      const pipeGradient = draw
      .gradient('linear', add => {
        add.stop(0, '#e0e0e0');
        add.stop(0.5, '#c0c0c0');
        add.stop(1, '#e0e0e0');
      })
      .from(0, 0)
      .to(1, 1);
      
      // Calculate scaling factors based on original SVG viewport (64x80)
      const scaleX = width / 64 * 0.5;
      const scaleY = height / 80 * 0.5;
      
      // Draw main joint outline
      g.path("m61,27l-4,0c-1.304,0 -2.416,0.836 -2.828,2l-8.172,0c-1.104,0 -2,-0.897 -2,-2l0,-8.171c1.164,-0.413 2,-1.525 2,-2.829l0,-4c0,-1.654 -1.346,-3 -3,-3l-22,0c-1.654,0 -3,1.346 -3,3l0,4c0,1.304 0.836,2.416 2,2.829l0,8.171c0,1.103 -0.898,2 -2,2l-8.172,0c-0.412,-1.164 -1.524,-2 -2.828,-2l-4,0c-1.654,0 -3,1.346 -3,3l0,22c0,1.654 1.346,3 3,3l4,0c1.304,0 2.416,-0.836 2.828,-2l44.344,0c0.412,1.164 1.524,2 2.828,2l4,0c1.654,0 3,-1.346 3,-3l0,-22c0,-1.654 -1.346,-3 -3,-3zm1,25c0,0.552 -0.449,1 -1,1l-4,0c-0.551,0 -1,-0.448 -1,-1l0,-12c0,-0.553 -0.447,-1 -1,-1c-0.553,0 -1,0.447 -1,1l0,11l-45,0c-0.553,0 -1,0.447 -1,1c0,0.552 -0.449,1 -1,1l-4,0c-0.551,0 -1,-0.448 -1,-1l0,-22c0,-0.552 0.449,-1 1,-1l4,0c0.551,0 1,0.448 1,1l0,12c0,0.553 0.447,1 1,1c0.553,0 1,-0.447 1,-1l0,-11l8,0c2.205,0 4,-1.794 4,-4l0,-9c0,-0.553 -0.447,-1 -1,-1c-0.551,0 -1,-0.448 -1,-1l0,-4c0,-0.552 0.449,-1 1,-1l22,0c0.551,0 1,0.448 1,1l0,4c0,0.552 -0.449,1 -1,1l-12,0c-0.553,0 -1,0.447 -1,1s0.447,1 1,1l11,0l0,8c0,2.206 1.795,4 4,4l9,0c0.553,0 1,-0.447 1,-1c0,-0.552 0.449,-1 1,-1l4,0c0.551,0 1,0.448 1,1l0,22z")
      .fill(pipeGradient)
      .stroke({ color, width: strokeWidth })
      .scale(scaleX, scaleY);
      
      // Draw the three small end circles
      const circlePaths = [
        "m8.29,45.29c-0.181,0.189 -0.29,0.439 -0.29,0.71c0,0.26 0.109,0.52 0.29,0.71c0.19,0.18 0.45,0.29 0.71,0.29c0.26,0 0.519,-0.11 0.71,-0.29c0.18,-0.19 0.29,-0.45 0.29,-0.71c0,-0.271 -0.11,-0.521 -0.29,-0.71c-0.37,-0.37 -1.05,-0.37 -1.42,0z",
        "m54.29,35.29c-0.181,0.189 -0.29,0.439 -0.29,0.71c0,0.27 0.109,0.52 0.29,0.71c0.19,0.18 0.45,0.29 0.71,0.29c0.26,0 0.519,-0.11 0.71,-0.29c0.18,-0.19 0.29,-0.45 0.29,-0.71s-0.11,-0.521 -0.29,-0.71c-0.38,-0.37 -1.05,-0.37 -1.42,0z",
        "m26.29,17.29c-0.181,0.189 -0.29,0.439 -0.29,0.71c0,0.27 0.109,0.52 0.29,0.71c0.19,0.18 0.45,0.29 0.71,0.29c0.26,0 0.519,-0.11 0.71,-0.29c0.18,-0.19 0.29,-0.45 0.29,-0.71s-0.11,-0.521 -0.29,-0.71c-0.38,-0.37 -1.05,-0.37 -1.42,0z"
      ];
      circlePaths.forEach(d => {
        g.path(d)
        .fill(pipeGradient)
        .stroke({ color, width: 0 })
        .scale(scaleX, scaleY);
      });
      g.move(x, y)
      return g;
    }
    
    export function reset(draw) {
      pipeGroup = null; // Global reference to pipe group for drawing pipes
      valve = null
      valve1 = null
      multiValvePosition = 270
      gasValveOpen = false;
      leftPipe = null;
      leftPipe1 = null;
      leftPipe2 = null;
      leftPipe3 = null;
      leftPipe4 = null;
      leftPipe5 = null;
      leftPipe6 = null;
      recycleRatio = 0;
      recycleValve = null;
      isPumpOn = false;
      accumulatedMass = 0;
      reactorIsOpen = false;
      gasFlowingToReactor = false;
      flowRate = null;
      let gasFlowRateDevice = null;
      clearInterval(timerId);
      timerId = null;
    }