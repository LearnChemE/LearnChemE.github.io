import * as config from './config.js';

let valve = null;
let verticalValveOpen = false;
let gasValveOpen = false;
let isHeaterOn = false;
let container = null;

// Save the SVG.js context so other functions can reuse it
export function drawFigure(svg) {
  svg.line(675, 175, 760, 210)
  .stroke({ color: '#000', width: 2 });
  drawGasCylinder(svg, 100, 350, 'N₂ gas cylinder');
  createVerticalValve(svg, 122.5, 250);
  drawPipes(svg);
  // Liquid column with vent, scale, temp controller, colored liquid and clear bubbles
  const switchGroup = drawSwitch(svg, 750, 200, 80, 40);
  container = drawLiquidColumnWithVent(svg, 500, 80, switchGroup); // pass switch to control heaters & bubbles
  valve = drawValve(svg, 580, 450).rotate(90);
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
      window.leftPipe3 = drawPipeWithCurves(draw, leftPipe3, 4);
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
    function drawLiquidColumnWithVent(draw, x, y, switchGroup) {
      const TANK_W = 160;
      const TANK_H = 300;
      const R = 12;         // corner radius
      const WALL = 6;       // wall thickness
      const FILL_FRAC = 61.5 / 70; // 65% full
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
        if (bubbling || !gasValveOpen ||!verticalValveOpen || !isHeaterOn) return;
        bubbling = true;
        for (let i = 0; i < 10; i++) {
          bubbleTimers.push(setTimeout(spawnBubble, i * 180));
        }
      }
      // Expose bubble controls to outside via returned group
      g.startBubbles = () => startBubbles();
      g.stopBubbles = () => stopBubbles();
      
      function spawnBubble() {
        if (!bubbling) return;
        const bx = Math.random() * (innerRight - innerLeft) + innerLeft;
        const r = 2 + 4; // 2–6 px
        const startY = innerBottom - Math.random() * (liquidH * 0.6); // start inside liquid
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
      
      // Helper: update heater gradient opacity based on temperature (50–650)
      function updateHeaterHeat(temp) {
        const t = Math.max(50, Math.min(650, temp));
        const frac = (t - 50) / (650 - 50);
        const base = 0.7  ;
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
      
      // --- Side heaters (left & right) and draggable temperature pointer on right ---
      const heaterW = 20;
      const heaterH = innerBottom - innerTop + 15;
      const leftHeaterX  = x + WALL - 21;
      const rightHeaterX = x + TANK_W - WALL - 2 - heaterW + 23;
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
      
      // Helpers to convert between y-position and temperature (50–650)
      function tempFromY(yy) {
        const frac = (innerBottom - yy) / (innerBottom - innerTop);
        return Math.round(50 + frac * (650 - 50));
      }
      function yFromTemp(temp) {
        const frac = (temp - 50) / (650 - 50);
        return innerBottom - frac * (innerBottom - innerTop);
      }
      
      // Draggable pointer (single arrow polygon: tail rectangle + tip triangle)
      const pointerH = 14;                 // total height of the arrow
      const pointerTip = 8;                // length of the triangular tip protruding into the liquid
      const tailW = Math.max(6, heaterW - 3); // width of tail that sits over the heater
      let targetTemp = 200;                // initial target
      let py = yFromTemp(targetTemp);
      
      updateHeaterHeat(targetTemp);
      
      function arrowPoints(atY) {
        const top = atY - pointerH / 2;
        const bottom = atY + pointerH / 2;
        const left = rightHeaterX + 1 + 5;          // align at the heater face
        const right = left + tailW + 15;             // tail extends to the right within heater
        const tipX = rightHeaterX - pointerTip + 5; // tip points left into the liquid
        const midY = atY;
        // Points ordered to create a rectangle with a left-pointing tip
        // Top-left -> Top-right -> Bottom-right -> Bottom-left -> Tip -> back to Top-left (auto-closed)
        return `${left},${top} ${right},${top} ${right},${bottom} ${left},${bottom} ${tipX},${midY}`;
      }
      
      const arrow = g.polygon(arrowPoints(py))
      .fill('#ff7f50')
      .stroke({ color: '#703c22', width: 1 });
      // Make the arrow show a vertical resize cursor for consistency
      arrow.style('cursor', 'ns-resize');
      
      // Optional: show the current set temperature near the pointer
      const tempLabel = g.text(String(targetTemp) + 'K')
      .font({ family: 'Arial', size: 11, anchor: 'start', weight: 600 })
      .move(rightHeaterX + heaterW - 13, py - 6)
      .fill(
        '#fff'
      );
      // Make the temp label draggable trigger as well
      tempLabel.style('cursor', 'ns-resize');
      tempLabel.on('mousedown', (ev) => { draggingPointer = true; ev.stopPropagation(); });
      tempLabel.on('touchstart', (ev) => { draggingPointer = true; ev.preventDefault(); });
      
      // Drag logic (mouse/touch) for the pointer
      let draggingPointer = false;
      function clamp(v, vmin, vmax) { return Math.max(vmin, Math.min(v, vmax)); }
      function updatePointer(toY) {
        py = clamp(toY, innerTop, innerBottom);
        targetTemp = Math.round(tempFromY(py) / 50) * 50;
        py = yFromTemp(targetTemp);
        arrow.plot(arrowPoints(py));
        tempLabel.text(String(targetTemp) + 'K').move(rightHeaterX + heaterW - 13, py - 6);
        g.targetTemperature = targetTemp;
        if (switchGroup && switchGroup.isOn) {
          updateHeaterHeat(targetTemp);
        }
      }
      // Mouse handlers
      arrow.on('mousedown', (ev) => { draggingPointer = true; ev.stopPropagation(); });
      draw.on('mousemove', (ev) => {
        if (!draggingPointer) return;
        const p = draw.point(ev.clientX, ev.clientY);
        updatePointer(p.y);
      });
      draw.on('mouseup', () => { draggingPointer = false; });
      // Touch handlers
      arrow.on('touchstart', (ev) => { draggingPointer = true; ev.preventDefault(); });
      draw.on('touchmove', (ev) => {
        if (!draggingPointer) return;
        const t = ev.touches[0];
        if (!t) return;
        const p = draw.point(t.clientX, t.clientY);
        updatePointer(p.y);
      });
      draw.on('touchend', () => { draggingPointer = false; });
      // Initialize heaters & bubbles based on switch state
      if (switchGroup && switchGroup.isOn) {
        isHeaterOn = true;
        updateHeaterHeat(targetTemp);
        startBubbles();
      } else {
        isHeaterOn = false;
        applyOffGradient();
        stopBubbles();
      }
      
      // React to switch toggles to swap gradients and bubbles
      if (switchGroup) {
        switchGroup.on('click', () => {
          isHeaterOn = switchGroup.isOn;
          if (switchGroup.isOn) {
            // Turned ON: heat based on current target temperature, start bubbles
            updateHeaterHeat(g.targetTemperature || targetTemp);
            startBubbles();
          } else {
            // Turned OFF: cool gradient, stop bubbles
            applyOffGradient();
            stopBubbles();
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
      switchGroup.click(() => {
        isOn = !isOn;
        switchGroup.isOn = isOn;
        if (isOn) {
          // reactorIsOpen = true;
          handle.animate(200).rotate(40, x + width / 2, y + height / 2);
        } else {
          // reactorIsOpen = false;
          handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
        }
      });
      return switchGroup;
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
    } else {
      valveGroup.animate(300).rotate(-90, valveCenterX, valveCenterY);
    }
    gasValveOpen = valveGroup.isRotated;
    animateGasFlow(draw);
  });
  return valveGroup;
}

function animateGasFlow(draw) {
  if (!verticalValveOpen) {
        // Stop all flows when vertical valve closes
        draw.find('path')
        .filter(el =>  el.attr('data-pipe-side') === 'gas' || el.attr('data-pipe-side') === 'valve')
        .forEach(el => el.remove());
      } else {
        [window.leftPipe1].forEach(pipeEl => {
          if (pipeEl) {
            animateWaterFlow(draw, pipeEl, 0, 100, undefined, undefined, undefined, 'gas');
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