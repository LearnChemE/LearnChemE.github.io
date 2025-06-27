import { off } from '@svgdotjs/svg.js';
import * as config from '../js/config.js';

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


export function drawFigure(draw) {
  draw.line(225, 265, 320, 280)
  .stroke({ color: '#444', width: 2, linecap: 'round' });
  addSVGImage(draw, 'assets/bubbler.svg', 20, 250, 250, 250);
  drawGasCylinder(draw, 0, canvasHeight - 250, 'Gas Cylinder');
  drawHorizontalCVDReactor(draw, 400, 50, 200, 60);
  createInteractiveValve(draw, 250, 80, true);
  createVerticalValve(draw, 22.5, 250);
  valve = createInteractiveValve(draw, 900, 80, false);
  valve.rotate(90, 900, 80);
  valve1 = createInteractiveValve(draw, 250, 280, false);
  valve1.rotate(180, 250, 280);
  drawPipes(draw);
  recycleValve = drawCutoffValve(draw, 900, 300, 40);
  drawHoodString(draw);
  drawPump(draw, 300, 275, 60, 30);
  drawSwitch(draw, 650, 20, 80, 40);
  draw.line(600, 20, 650, 30)
  .stroke({ color: '#444', width: 2, linecap: 'round' });
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
      animateWaterFlow(draw, window.leftPipe4El, 0, 100, undefined, undefined, undefined, 'reactor');
      await sleep(100);
      animateWaterFlow(draw, window.leftPipe5El, 0, 100, undefined, undefined, undefined, 'reactor');
    } else {
      draw.find('path')
      .filter(el => el.attr('data-pipe-side') === 'reactor')
      .forEach(el => el.remove());
      console.log("Stopping flow in pipes 4 and 5");
    }
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
        } else {
          [window.leftPipe1El, window.leftPipe2El].forEach(pipeEl => {
            if (pipeEl) {
              animateWaterFlow(draw, pipeEl, 0, 100, undefined, undefined, undefined, 'right');
            }
          });
          
          animateFLowToReactor(draw);
          animateRecycleFlow(draw);
          // console.log(multiValvePosition, gasValveOpen);
        }
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
    L ${startX + 163 + 24} ${startY - 27.5}
  `;
      window.leftPipe2El = drawPipeWithCurves(draw, leftPipe2Path, 4);
      
      leftPipe3 = `
    M ${startX + 220} ${startY - 59}
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
    L ${startX + 837} ${startY - 225}
  `;
      window.leftPipe5El = drawPipeWithCurves(draw, leftPipe5, 4);
      
      leftPipe6 = `
    M ${startX + 870} ${startY - 193}
    L ${startX + 870} ${startY + 225}
    L ${startX + 220} ${startY + 225}
    L ${startX + 220} ${startY + 7}
  `;
      window.leftPipe6El = drawPipeWithCurves(draw, leftPipe6, 4);
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
      let rateText = group.text(String(group.flowRate))
      .font({ family: 'Arial', size: 14, anchor: 'start' })
      .fill('#000')
      .move(x + size/2 + 8, y - 7);
      
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
          rateText.text(group.flowRate);
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
    animateWaterFlow(draw, window.leftPipe6El, 0, 100, undefined, undefined, undefined, 'recycle');
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
  } else {
    // Stop flow in pipes 4 and 5
    draw.find('path')
    .filter(el => el.attr('data-pipe-side') === 'pump')
    .forEach(el => el.remove());
  }
}
    
    function drawHoodString(draw) {
      draw.text("Hood")
      .font({ family: 'Arial', size: 14, anchor: 'start' })
      .fill('#000')
      .move(232.5,25);
      
      draw.text("Hood")
      .font({ family: 'Arial', size: 14, anchor: 'start' })
      .fill('#000')
      .move(940,72.5);
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
        } else {
          handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
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
      handle.animate(200).rotate(40, x + width / 2, y + height / 2);
    } else {
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