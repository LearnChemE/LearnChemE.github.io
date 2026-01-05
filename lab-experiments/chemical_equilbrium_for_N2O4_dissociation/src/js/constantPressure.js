import * as config from './config.js';
import { computePressureWithConstantVolume, computeVolumeWithConstantPressure } from './calc.js';
import {
  configureWeightControl,
  setWeightControlState,
  setWeightControlVisibility
} from './weightControl.js';
import { animate } from './helpers.js';
console.log(animate)

// Peak volume for 2.0 g at 75 °C is ~0.804 L (≈804 mL). Give students margin up to 850 mL.
const MAX_VOLUME_ML = 850;
const MIN_GAS_HEIGHT_PX = 10;
const MIN_INITIAL_VOLUME_L = 0; // no gas present before the first injection

let pressureGuage = null;
let pressureReliefValve = null;
let sleeve = null;
let syringeObj = null;
let reactorBounds = null;
let tempSwitch = null;
let thermoCouple = null;
let pistonAssembly = null;

let tempController = null;   // UI elements group for temperature control
let targetTempC = 25;       // °C setpoint user can change anytime
let currentTempC = 25;      // °C measured/thermocouple reading
let heaterOn = false;        // switch state
let pressure = null;        // current pressure in bar
let liquidWeight = 1.8;      // g of N2O4 in syringe (1.6 to 2.0 g)
let liquidPushed = false;   // has the syringe been pushed?

let temperatureText = null; // text element showing current temperature

let lastPressureTrue = null;
let lastPressureDisplayed = null;
let hasCoolDownOccurred = false;
let isTempRamping = false;
let pendingTargetTempC = null;
let isVolumeSettling = false;
let pendingVolumeUpdates = [];
let volumeSettleTimerId = null;
let deferredVolumeTimerIds = [];
let pendingTempRampTarget = null;

// --- measurement noise for pressure readout (display-only) ---
// Standard deviation of the noise added to the displayed pressure, in bar.
const PRESSURE_NOISE_STD = 0.02;

// Box–Muller transform to sample zero-mean Gaussian noise
function gaussianNoise(std = 1) {
  const u1 = Math.random() || 1e-12;
  const u2 = Math.random() || 1e-12;
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * std;
}

// Return the *measured* (noisy) pressure for the gauge text only.
// Underlying physics (computePressureWithConstantVolume) remains exact elsewhere.
function measuredPressureBar(mass_g, tempC) {
  if (!liquidPushed) {
    lastPressureTrue = null;
    lastPressureDisplayed = 0;
    return 0;
  }

  const pTrue = computePressureWithConstantVolume(mass_g, tempC);
  const prevTrue = lastPressureTrue;
  const prevDisplay = lastPressureDisplayed;

  if (!hasCoolDownOccurred) {
    lastPressureTrue = pTrue;
    lastPressureDisplayed = pTrue;
    return pTrue;
  }

  const EPS = 1e-4;
  let reading = pTrue + gaussianNoise(PRESSURE_NOISE_STD);

  if (prevTrue != null && prevDisplay != null) {
    const deltaTrue = pTrue - prevTrue;
    if (deltaTrue > EPS) {
      const upperBound = pTrue + PRESSURE_NOISE_STD;
      const rawStep = Math.max(Math.abs(deltaTrue) * 0.1, PRESSURE_NOISE_STD * 0.15);
      const maxAvail = Math.max(upperBound - prevDisplay, 0);
      const minStep = Math.min(rawStep, maxAvail);
      const base = Math.min(prevDisplay + minStep, upperBound);
      const jitterSpan = Math.max(upperBound - base, 0);
      reading = base + Math.random() * jitterSpan;
    } else if (deltaTrue < -EPS) {
      const lowerBound = Math.max(0, pTrue - PRESSURE_NOISE_STD);
      const rawStep = Math.max(Math.abs(deltaTrue) * 0.1, PRESSURE_NOISE_STD * 0.15);
      const maxAvail = Math.max(prevDisplay - lowerBound, 0);
      const minStep = Math.min(rawStep, maxAvail);
      const base = Math.max(prevDisplay - minStep, lowerBound);
      const jitterSpan = Math.max(base - lowerBound, 0);
      reading = base - Math.random() * jitterSpan;
    } else {
      const band = PRESSURE_NOISE_STD * 0.6;
      const lo = Math.max(0, pTrue - band);
      const hi = pTrue + band;
      const center = prevDisplay + gaussianNoise(band * 0.4);
      reading = Math.max(lo, Math.min(hi, center));
    }
  } else {
    const lo = Math.max(0, pTrue - PRESSURE_NOISE_STD);
    const hi = pTrue + PRESSURE_NOISE_STD;
    reading = Math.max(lo, Math.min(hi, reading));
  }

  const display = Math.max(0, reading);
  lastPressureTrue = pTrue;
  lastPressureDisplayed = display;
  return display;
}

// Centralized updater for the pressure text UI
function updatePressureText(temp = null) {
  if (pressure) {
    const p = measuredPressureBar(liquidWeight, temp ?? currentTempC);
    pressure.text(p.toFixed(2));
  }
}

function scheduleVolumeSettleCompletion(delayMs = 0) {
  throw new Error("scheduleVolumeSettleCompletion")
  if (volumeSettleTimerId) {
    clearTimeout(volumeSettleTimerId);
  }
  volumeSettleTimerId = setTimeout(() => {
    volumeSettleTimerId = null; // clear timer
    isVolumeSettling = false; // volume not settling (can handle elsewhere)
    if (pendingVolumeUpdates.length) { // handle pending updates (not needed)
      const queue = pendingVolumeUpdates;
      pendingVolumeUpdates = [];
      let accumulatedDelay = 0;
      clearDeferredVolumeTimers();
      queue.forEach(({ tempC, options }, idx) => {
        const nextOptions = { ...options, force: true };
        const stepDelay = Math.max(0, nextOptions.deferDelayMs ?? 0);
        if (idx === 0) {
          accumulatedDelay = 0;
        } else {
          accumulatedDelay += stepDelay;
        }
        const callOptions = { ...nextOptions };
        delete callOptions.deferDelayMs;
        const timerId = setTimeout(() => {
          deferredVolumeTimerIds = deferredVolumeTimerIds.filter((storedId) => storedId !== timerId);
          updatePistonVolume(tempC, callOptions);
        }, accumulatedDelay);
        deferredVolumeTimerIds.push(timerId);
      });
    }
    if (pendingTempRampTarget != null) { // pending (not needed)
      const target = pendingTempRampTarget;
      const origin = currentTempC;
      pendingTempRampTarget = null;
      // startTempPressureRamp(origin, target, { force: true });
      setTempRamp(target);
    }
  }, Math.max(0, delayMs));
}

function dropDeferredTemperatureVolumes() {
  if (!pendingVolumeUpdates.length) return;
  pendingVolumeUpdates = pendingVolumeUpdates.filter(({ options }) => options?.source !== 'temperature');
}

function clearDeferredVolumeTimers() {
  if (!deferredVolumeTimerIds.length) return;
  deferredVolumeTimerIds.forEach((id) => clearTimeout(id));
  deferredVolumeTimerIds = [];
}

let vapour = 0;
function updatePistonVolume(tempC = currentTempC, opts = {}) {
  // liquidPushed : whether syringe has been pushed
  // liquidWeight : amount of liquid injected/to inject
  if (!pistonAssembly) return;
  
  if (isVolumeSettling) return;
  isVolumeSettling = true;

  animate(_pistonVolumeFrame, () => isVolumeSettling = false);
}

function _pistonVolumeFrame(dt) {
  const r = Math.exp(-currentTempC/100);
  // Smooth lerp towards target
  if (liquidPushed) {
    vapour = (vapour - liquidWeight) * r ** dt + liquidWeight;
    if (Math.abs(vapour - liquidWeight) < .001) vapour = liquidWeight;
  } else {
    vapour = 0;
  }
  console.table({ vapour, liquidWeight });

  const volumeL = computeVolumeWithConstantPressure(vapour, currentTempC);

  const volumeML = volumeL * 1000;
  const frac = clamp(volumeML / MAX_VOLUME_ML, 0, 1);

  const { gasRect, pistonRect, lines, gasRegion, piston, inner, rod } = pistonAssembly;
  if (!gasRect || !pistonRect) return true;

  const maxHeight = gasRegion.maxHeight;
  const bottom = gasRegion.bottom;
  const targetHeight = frac * maxHeight;
  const gasHeightPx = frac <= 0 ? 0 : Math.max(MIN_GAS_HEIGHT_PX, targetHeight);
  const gasTop = bottom - gasHeightPx;
  const pistonTop = gasTop - piston.height;
  const highlightY = pistonTop + piston.highlightOffset;
  const rodBottom = pistonTop + piston.height / 2;

  gasRect.move(inner.x, gasTop).height(gasHeightPx);
  pistonRect.move(inner.x, pistonTop);

  if (lines?.gasSurface) {
    lines.gasSurface.plot(inner.x, gasTop, inner.x + inner.width, gasTop);
  }
  if (lines?.pistonHighlight) {
    lines.pistonHighlight.plot(inner.x, highlightY, inner.x + inner.width, highlightY);
  }

  if (rod?.rect) {
    const rodY = rodBottom - rod.height;
    rod.rect.move(rod.x, rodY);
  }


  return !(vapour === liquidWeight) || !liquidPushed;
}

// --- non-blocking temperature→pressure ramp (0.5 °C steps) ---
let tempRampTimerIds = [];
let tempSP = 25;
let tempAni = undefined;
function clearTempRampTimers() {
  for (const id of tempRampTimerIds) clearTimeout(id);
  tempRampTimerIds = [];
  isTempRamping = false;
  pendingTargetTempC = null;
  dropDeferredTemperatureVolumes();
  clearDeferredVolumeTimers();
}

const tr = Math.exp(-1 / 5);
function _rampTemp(dt) {
  // Smooth lerp towards target
  let temp = (currentTempC - tempSP) * tr ** dt + tempSP;
  // console.log(currentTempC, tempSP)
  if (Math.abs(currentTempC - tempSP) < .05) currentTempC = tempSP;

  // Update stuff
  currentTempC = temp;
  updatePressureText(currentTempC);
  updatePistonVolume(temp, {
        animate: false,
        source: 'temperature',
        deferDelayMs: 0
  });
  temperatureText && temperatureText.text(`${temp.toFixed(1)} °C`);

  return !(currentTempC === tempSP);
}

function setTempRamp(target) {
  tempSP = target;

  if (isTempRamping) return;
  isTempRamping = true;

  animate(_rampTemp, () => {isTempRamping = false});
  
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const step5 = (v) => 5 * Math.round(v / 5);

function setTemperature(newT) {
  // clamp 25–45 °C
  if (newT < 25) { targetTempC = 25; }
  else if (newT > 75) { targetTempC = 75; }
  else { targetTempC = newT; }

  refreshTempController(); // show new setpoint immediately in controller

  // Only heat (increase measured) when heater is ON; otherwise measurement stays where it is
  if (heaterOn) {
    setTempRamp(targetTempC);
  }
}

function setHeater(on) {
  const turningOn = !!on;
  heaterOn = turningOn;
  clearTempRampTimers();

  if (!heaterOn) {
    refreshTempController();
    // startTempPressureRamp(currentTempC, 25);
    setTempRamp(25)
    return;
  }

  refreshTempController();
  // startTempPressureRamp(currentTempC, targetTempC);
  setTempRamp(targetTempC)
}


function addSVGImage(draw, url, x = 0, y = 0, width, height) {
  const img = draw.image(url)
  .size(width, height)                      // force the element to the given dimensions
  .move(x, y)
  .attr({ preserveAspectRatio: 'none' });   // stretch to fill exactly
  return img;
}

// Save the SVG.js context so other functions can reuse it

export function drawConstantPressureSetup(draw) {
  // Geometry for the reactor container
  const width = 350
  const height = 450
  const x = config.canvasWidth / 2 - width / 2
  const y = config.canvasHeight / 2 - height / 2 + 65
  reactorBounds = { x, y, width, height };
  
  const g = draw.group();
  
  // pressureGuage = addSVGImage(g, 'assets/gasFlowRateDevice1.svg', x + 100, y - 67, 120 * 1.25, 90 * 1.25);
  syringeObj = drawSyringeHorizontal(g, x - 140, y + height - 30, 240, 50, { fillPct: 0.6, scale: 0.5 });
  thermoCouple = addSVGImage(g, 'assets/thermoCouple1.svg', x + width - 25, y + 300, 250, 200);
  updateSyringeFillFromWeight(syringeObj, false);
  
  // Reactor vessel with piston assembly (constant-pressure)
  pistonAssembly = drawPistonCylinder(g, x, y, width, height, {
    fillColor: '#d33530',
    fillOpacity: 0.55
  });

  drawScaleOnVolumeContainer(g, x, y, width, height, pistonAssembly ? pistonAssembly.gasRegion : null);
  setupWeightControlUI();

  draw.line(x + width, y + height - 375, x + width + 60, y + height - 380)
  .stroke({ width: 2, color: 'black', linecap: 'round', linejoin: 'round', opacity: 0.75 });
  // Temperature controller and readout (left side panel)
  // Controller shows setpoint (targetTempC). The side readout near reactor shows measured temp (currentTempC).
  drawTemperatureController(g, x + 410, y + 40);

  g.line(x - 50, y + height - 345, x, y + height - 325)
    .stroke({ width: 2, color: 'black', linecap: 'round', linejoin: 'round', opacity: 0.75 });

  // Heater switch
  tempSwitch = drawSwitch(g, x - 130, y + height - 370, 60 * 1.5, 30 * 1.5, 1);

  // Start disabled until liquid is injected
  if (tempSwitch && tempSwitch.setEnabled) tempSwitch.setEnabled(false);

  tempSwitch.toggle = (isOn) => {
    // Update sleeve color/gradient
    const leftHeaterGrad = draw.gradient('linear', add => {
      add.stop(0, '#ff0000');
      add.stop(0.5, '#ffff00');
      add.stop(1, '#ff0000');
    }).from(0, 0).to(0, 1);
    drawSleeve(g, x, y, width, height, isOn ? leftHeaterGrad : 'blue');

    // Update heater state and UI
    setHeater(isOn);
  };

  // pressure = g.text('0.00').center(x + width / 2, y - 35).font({ size: 16, weight: 'bold' });
  temperatureText = g.text(`${currentTempC} °C`).center(x + width + 180, y + 390).font({ size: 16, weight: 'bold' });
  // g.text('bar').center(x + width / 2, y - 15).font({ size: 13, weight: 'bold' });

  updatePistonVolume(currentTempC, { animate: false, force: true });
}

function drawScaleOnVolumeContainer(g, x, y, width, height, gasRegion = null) {
  
  // Scale parameters (0 to MAX_VOLUME_ML)
  const minML = 0;
  const maxML = MAX_VOLUME_ML;
  const majorStep = 50; // labeled ticks
  const minorStep = 10;  // shorter ticks
  
  const scaleTop = gasRegion ? gasRegion.top : y;
  const scaleBottom = gasRegion ? gasRegion.bottom : (y + height);
  const scaleSpan = scaleBottom - scaleTop;

  // Map mL value to Y coordinate (0 mL at bottom, MAX at top)
  const mlToY = (v) => scaleBottom - ((v - minML) / (maxML - minML)) * scaleSpan;
  
  // Position for the scale to the left of the reactor
  const scaleX = x;
  
  // Scale backbone line
  g.line(scaleX, scaleTop, scaleX, scaleBottom)
  .stroke({ width: 1 });
  
  // Draw ticks and labels
  for (let v = minML; v <= maxML; v += minorStep) {
    const y = mlToY(v);
    const isMajor = (v % majorStep === 0);
    const tickLen = isMajor ? 25 : 15;
    
    // Tick mark
    g.line(scaleX, y, scaleX + tickLen, y)
    .stroke({ width: 1, color: 'black' });
    
    // Label for major ticks
    let volumeText = `${v}`;
    
    if (v === maxML) {
      volumeText += " mL";
    }
    if (isMajor) {
      if (v != 0) {
        g.text(volumeText)
        .font({ size: 12 })
        .attr({ 'text-anchor': 'end', 'dominant-baseline': 'middle' })
        .move(scaleX + 30, y - 5);
      }
    }
  }

  drawSleeve(g, x, y, width, height,'blue');
}

function drawPistonCylinder(g, x, y, width, height, opts = {}) {
  const group = g.group();

  const wallThickness = opts.wallThickness ?? 6;
  const topGap = opts.topGap ?? 18;
  const pistonHeight = opts.pistonHeight ?? 36;
  const highlightOffset = 4;

  const innerInset = wallThickness / 2;
  const innerWidth = width - 2 * innerInset;
  const innerX = x + innerInset;
  const pistonY = y + topGap;
  const gasTop = pistonY + pistonHeight;
  const innerBottom = y + height - innerInset;
  const gasHeight = Math.max(12, innerBottom - gasTop);

  const gasRect = group.rect(innerWidth, gasHeight)
    .move(innerX, gasTop)
    .fill(opts.fillColor ?? '#d33530')
    .opacity(opts.fillOpacity ?? 0.55)
    .stroke({ width: 0 });

  const pistonRect = group.rect(innerWidth, pistonHeight)
    .move(innerX, pistonY)
    .fill('#d7d9dd')
    .stroke({ width: 1.5, color: '#8e939a' });

  const gasSurfaceLine = group.line(innerX, gasTop, innerX + innerWidth, gasTop)
    .stroke({ width: 3, color: '#b1b6bd' });
  const pistonHighlightLine = null;

  const rodWidth = opts.rodWidth ?? Math.min(32, innerWidth * 0.18);
  const rodHeight = opts.rodHeight ?? 70;
  const rodX = x + width / 2 - rodWidth / 2;
  const rodBottom = pistonY + pistonHeight / 2;
  const rodY = rodBottom - rodHeight;

  const rodRect = group.rect(rodWidth, rodHeight)
    .move(rodX, rodY)
    .fill('#c9cdd3')
    .stroke({ width: 1.5, color: '#878d93' })
    .radius(rodWidth / 3);

  group.rect(width, height)
    .move(x, y)
    .fill('none')
    .stroke({ width: wallThickness, color: '#6f7073' })
    // .radius(14);

  return {
    group,
    gasRect,
    pistonRect,
    lines: {
      gasSurface: gasSurfaceLine,
      pistonHighlight: pistonHighlightLine
    },
    gasRegion: {
      top: gasTop,
      bottom: innerBottom,
      maxHeight: gasHeight
    },
    piston: {
      height: pistonHeight,
      highlightOffset
    },
    rod: {
      rect: rodRect,
      width: rodWidth,
      height: rodHeight,
      x: rodX,
      centerX: x + width / 2
    },
    inner: {
      x: innerX,
      width: innerWidth
    }
  };
}

function drawSleeve(g, x, y, width, height, color) {
  // Remove any previous sleeve (path or group)
  if (sleeve && typeof sleeve.remove === 'function') {
    sleeve.remove();
  }

  // Create a fresh group to hold the sleeve runs
  sleeve = g.group();

  // Draw all arcs into the sleeve group
  drawGravityArc(sleeve, x, y + 25,  x + width, y + 75,        { sag: 20, tube: 4, color });
  drawGravityArc(sleeve, x, y + 125, x + width, y + 125 + 50,  { sag: 20, tube: 4, color });
  drawGravityArc(sleeve, x, y + 225, x + width, y + 225 + 50,  { sag: 20, tube: 4, color });
  drawGravityArc(sleeve, x, y + 325, x + width, y + 325 + 50,  { sag: 20, tube: 4, color });
}

function drawGravityArc(g, x1, y1, x2, y2, opts = {}) {
  const tube = opts.tube ?? 4;          
  const color = opts.color ?? '#d86f1f';      
  const dashed = !!opts.dashed;                
  const sagInput = opts.sag;                   
  
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  const sag = (sagInput != null) ? sagInput : Math.max(12, dist * 0.2);
  
  
  const c1x = x1 + dx / 3;
  const c1y = y1 + dy / 3 + sag;
  const c2x = x1 + 2 * dx / 3;
  const c2y = y1 + 2 * dy / 3 + sag;
  
  const d = `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`;
  const path = g.path(d)
  .fill('none')
  .stroke({ width: 15, color, linecap: 'round', linejoin: 'round', opacity: 0.75 });
  
  if (dashed) path.stroke({ dasharray: '6,6' });
  return path;
}

function drawSyringeHorizontal(g, hx, hy, L = 220, W = 50, opts = {}) {
  const s = Math.max(0.4, opts.scale ?? 1);
  const fillPct = Math.min(1, Math.max(0, opts.fillPct ?? 0.6));
  const syr = g.group();

  // Geometry (horizontal layout)
  const pad = 6 * s;
  const barrelL = L * s; // horizontal length
  const barrelW = W * s; // vertical height
  const innerL = barrelL - 2 * pad;
  const innerW = barrelW - 2 * pad;

  // Barrel (horizontal)
  const barrel = syr.rect(barrelL, barrelW)
    .move(hx, hy)
    .fill('#ffffff')
    .stroke({ width: 2, color: '#444' })
    .radius(6 * s);

  // Liquid should be adjacent to the RIGHT inner wall (near the needle)
  const liquidW0 = innerL * fillPct;
  const innerLeftX  = hx + pad;
  const innerRightX = hx + pad + innerL;
  const liquidX0 = innerRightX - liquidW0; // anchor right edge to innerRightX
  const liquid = syr.rect(liquidW0, innerW)
    .move(liquidX0, hy + pad)
    .fill('#5d1916')
    .opacity(0.7)
    .stroke({ width: 0 });

  // Plunger head sits immediately to the LEFT of the liquid
  const headW = Math.max(10 * s, innerW * 0.18);
  const plungerX0 = liquidX0 - headW;
  const plunger = syr.rect(headW, innerW)
    .move(plungerX0, hy + pad)
    .fill('#888')
    .stroke({ width: 1, color: '#666' });

  const rodW = 30 * s;
  const rodH = Math.max(6 * s, innerW * 0.18);
  const rod = syr.rect(rodW, rodH)
    .move(hx - rodW, hy + (barrelW - rodH) / 2)
    .fill('#bbb')
    .stroke({ width: 1, color: '#777' });

  // Nozzle and needle at RIGHT side
  const nozzleW = 18 * s;
  const nozzleH = Math.max(10 * s, barrelW * 0.22);
  const nozzle = syr.rect(nozzleW, nozzleH)
    .move(hx + barrelL, hy + (barrelW - nozzleH) / 2)
    .fill('#ccc')
    .stroke({ width: 2, color: '#444' })
    .radius(2 * s);

  const needleLen = 40 * s;
  const needleY = hy + barrelW / 2;
  const needleStartX = hx + barrelL + nozzleW;
  const needle = syr.line(needleStartX, needleY, needleStartX + needleLen, needleY)
    .stroke({ width: 2, color: '#444', linecap: 'round' });

  const obj = {
    vertical: false,
    group: syr,
    barrel, liquid, plunger, rod, nozzle, needle,
    // anchors & sizes
    anchorX: hx, anchorY: hy, L0: L, W0: W,
    scale: s,
    pad, innerW, innerL,
    headW,
    innerLeftX: innerLeftX,
    innerRightX: innerRightX,
    liquidX0: liquidX0,
    liquidW0: liquidW0,
    plungerX0: plungerX0,
    needleTip: { x: needleStartX + needleLen, y: needleY },
    filled: fillPct > 0,
    animating: false,
    initFillPct: fillPct
  };

  obj.liquidWeight = Math.min(2.0, Math.max(1.6, opts.liquidWeight ?? 1.8));
  obj.minWeight = 1.6;
  obj.maxWeight = 2.0;
  obj.weightStep = 0.1;

  return obj;
}

function animateSyringe(obj) {
  if (obj.animating || !obj.filled) return;
  console.log("Animating syringe");
  obj.animating = true;
  const dur = 1200;

  const w = obj.liquidWeight ?? 1.8;
  const factor = Math.max(0, Math.min(1, (w - 1.6) / 0.4));
  const jetLen = 90 * obj.scale + 90 * factor * obj.scale;  // ~90..180 px
  const jetWidth = 3 * obj.scale + 2 * factor * obj.scale;

  // Push: plunger moves to the right edge (right inner wall minus plunger width), liquid width -> 0, shrink from right
  const plungerFinalX = obj.innerRightX - obj.headW; // right inner wall minus plunger width
  const liquidFinalW = 0;
  const liquidFinalX = obj.innerRightX; // shrink towards fixed right edge

  obj.plunger.animate(dur, '<>').x(plungerFinalX);
  obj.liquid.animate(dur, '<>').x(liquidFinalX).width(liquidFinalW);

  const jet = obj.group.line(obj.needleTip.x, obj.needleTip.y, obj.needleTip.x, obj.needleTip.y)
    .stroke({ width: jetWidth, color: '#1e90ff', linecap: 'round', opacity: 0.95 });

  jet.animate(dur * 0.55, '<>').plot(
    obj.needleTip.x, obj.needleTip.y,
    obj.needleTip.x + jetLen, obj.needleTip.y
  ).after(() => {
    jet.animate(280).opacity(0).after(() => {
      jet.remove();
      obj.animating = false;
      obj.filled = false;          // stay empty; no auto-refill
      updateWeightControlUI();
      liquidWeight = w;
      hasCoolDownOccurred = false;
      lastPressureTrue = null;
      lastPressureDisplayed = null;
      updatePressureText();
      liquidPushed = true;
      updatePistonVolume(currentTempC, { animate: true, durationMs: 50000, source: 'injection' });

      if (tempSwitch && typeof tempSwitch.setEnabled === 'function') {
        tempSwitch.setEnabled(true);
      }
    });
  });
}

function setupWeightControlUI() {
  configureWeightControl({
    onDecrease: () => {
      if (!syringeObj || syringeObj.animating) return;
      const next = Math.max(syringeObj.minWeight, +(syringeObj.liquidWeight - 0.1).toFixed(1));
      if (next === syringeObj.liquidWeight) return;
      syringeObj.liquidWeight = next;
      updateSyringeFillFromWeight(syringeObj, true);
      updateWeightControlUI();
    },
    onIncrease: () => {
      if (!syringeObj || syringeObj.animating) return;
      const next = Math.min(syringeObj.maxWeight, +(syringeObj.liquidWeight + 0.1).toFixed(1));
      if (next === syringeObj.liquidWeight) return;
      syringeObj.liquidWeight = next;
      updateSyringeFillFromWeight(syringeObj, true);
      updateWeightControlUI();
    },
    onInject: () => {
      if (!syringeObj || syringeObj.animating || !syringeObj.filled) return;
      animateSyringe(syringeObj);
    }
  });

  setWeightControlVisibility(true);
  updateWeightControlUI();
}

function updateWeightControlUI() {
  const weight = syringeObj && typeof syringeObj.liquidWeight === 'number'
    ? syringeObj.liquidWeight
    : liquidWeight;
  const isFilled = !!(syringeObj && syringeObj.filled);
  const canInject = isFilled && !(syringeObj && syringeObj.animating);
  setWeightControlState({
    weight,
    canInject,
    label: isFilled ? 'inject N<sub>2</sub>O<sub>4</sub>' : 'empty'
  });
}

function updateSyringeFillFromWeight(obj, animateShapes) {
  if (!obj) return;
  const w = obj.liquidWeight ?? 1.8;
  const factor = Math.max(0, Math.min(1, (w - 1.6) / 0.4));
  const minFill = 0.30; // 30% at 1.6 g
  const maxFill = 0.90; // 90% at 2.0 g
  const fillPct = minFill + factor * (maxFill - minFill);

  const newLiquidW = obj.innerL * fillPct;
  const newLiquidX = obj.innerRightX - newLiquidW; // anchor right edge
  const newPlungerX = newLiquidX - obj.headW;

  // Update baselines
  obj.liquidW0 = newLiquidW;
  obj.liquidX0 = newLiquidX;
  obj.plungerX0 = newPlungerX;

  if (obj.filled && obj.liquid && obj.plunger) {
    if (animateShapes) {
      obj.liquid.animate(200, '<>').x(newLiquidX).width(newLiquidW);
      obj.plunger.animate(200, '<>').x(newPlungerX);
    } else {
      obj.liquid.x(newLiquidX).width(newLiquidW);
      obj.plunger.x(newPlungerX);
    }
  }
}

function drawSwitch(draw, x, y, width, height, opacity = 1, toggle = (isOn) => {}) {
  const switchGroup = draw.group();
  switchGroup.isEnabled = true;      // NEW: enable/disable flag
  switchGroup.isOn = false;
  switchGroup.toggle = toggle;

  const handleWidth = 5;
  const handleHeight = height * 0.8;
  const handle = switchGroup.rect(handleWidth, handleHeight)
    .fill({ color: '#aaa', opacity: opacity })
    .move(x + (width - handleWidth) / 2, y - height / 2);
  switchGroup.handle = handle;

  // Background body (make it explicitly clickable)
  const body = switchGroup.rect(width, height)
    .fill({ color: '#555', opacity: opacity })
    .radius(height / 5)
    .move(x, y)
    .css('cursor', 'pointer')
    .attr({ 'pointer-events': 'all' });
  switchGroup.body = body;       // NEW: expose for styling

  switchGroup.text('OFF')
    .font({ size: 12, anchor: 'middle', fill: '#fff' })
    .center(x + width * 0.25, y + height / 2);
  switchGroup.text('ON')
    .font({ size: 12, anchor: 'middle', fill: '#fff' })
    .center(x + width * 0.75, y + height / 2);

  // NEW: API to enable/disable the switch (dims visuals and changes cursor)
  switchGroup.setEnabled = (flag) => {
    switchGroup.isEnabled = !!flag;
    const dim = opacity * 0.5;
    body
      .fill({ color: flag ? '#555' : '#999', opacity: flag ? opacity : dim })
      .css('cursor', flag ? 'pointer' : 'default');
    handle.fill({ color: flag ? '#aaa' : '#ccc', opacity: flag ? opacity : dim });
  };

  handle.rotate(-20, x + width / 2, y + height / 2);

  const onToggle = () => {
    // NEW: ignore clicks when disabled
    if (!switchGroup.isEnabled) {
      console.log('[drawSwitch] click ignored; switch disabled');
      return;
    }

    // Flip persistent state on the group
    switchGroup.isOn = !switchGroup.isOn;
    console.log('[drawSwitch] clicked -> isOn:', switchGroup.isOn);

    // Rotate handle based on new state
    if (switchGroup.isOn) {
      handle.rotate(40, x + width / 2, y + height / 2);
    } else {
      handle.rotate(-40, x + width / 2, y + height / 2);
    }

    // Invoke external callback with the correct state
    if (typeof switchGroup.toggle === 'function') {
      try {
        switchGroup.toggle(switchGroup.isOn);
      } catch (e) {
        console.error('[drawSwitch] toggle callback error:', e);
      }
    } else {
      console.warn('[drawSwitch] No toggle callback set');
    }
  };

  // Bind clicks to the group (body and handle are inside)
  switchGroup.on('click', onToggle);

  return switchGroup;
}


function drawTemperatureController(g, px, py) {
  // Remove prior UI if it exists
  if (tempController && tempController.group) tempController.group.remove();

  const ui = g.group();

  // Panel
  const panelW = 170, panelH = 80;
  const panel = ui.rect(panelW, panelH)
    .move(px, py)
    .fill('#f8f8f8')
    .stroke({ width: 1, color: '#999' })
    .radius(8);

  // Title
  const title = ui.text('Temperature')
    .font({ size: 14, weight: 'bold' })
    .move(px + 10, py + 8);

  // Readout box
  const readoutBox = ui.rect(86, 32)
    .move(px + 10, py + 32)
    .fill('#ffffff')
    .stroke({ width: 1, color: '#bbb' })
    .radius(4);

  const readoutText = ui.text('25 °C')
    .font({ size: 16, weight: 'bold' })
    .move(px + 18, py + 36);

  // +/- buttons to change temperature (enabled only when heater is ON)
  const btnW = 28, btnH = 28;
  const minusBtn = ui.rect(btnW, btnH)
    .move(px + 104, py + 34)
    .fill('#efefef')
    .stroke({ width: 1, color: '#aaa' })
    .radius(6)
    .css('cursor', 'pointer');
  ui.text('−').font({ size: 18, weight: 'bold' }).move(px + 113, py + 34).css('pointer-events', 'none');

  const plusBtn = ui.rect(btnW, btnH)
    .move(px + 138, py + 34)
    .fill('#efefef')
    .stroke({ width: 1, color: '#aaa' })
    .radius(6)
    .css('cursor', 'pointer');
  ui.text('+').font({ size: 18, weight: 'bold' }).move(px + 145, py + 34).css('pointer-events', 'none');

  // Wire up interactions
  minusBtn.on('click', () => {
    setTemperature(targetTempC - 5);
  });
  plusBtn.on('click', () => {
    setTemperature(targetTempC + 5);
  });

  tempController = {
    group: ui,
    panel,
    readoutBox,
    readoutText,
    minusBtn,
    plusBtn
  };

  refreshTempController();
}

function refreshTempController() {
  if (!tempController) return;

  // Readout text
  tempController.readoutText.text(`${targetTempC} °C`);

  // Enabled/disabled styling for buttons based on heater state
  const activeFill = '#efefef';
  const inactiveFill = '#eeeeee';
  const activeStroke = '#aaa';
  const inactiveStroke = '#ddd';
  const cursor = heaterOn ? 'pointer' : 'default';

  tempController.minusBtn.fill(heaterOn ? activeFill : inactiveFill)
    .stroke({ width: 1, color: heaterOn ? activeStroke : inactiveStroke })
    .css('cursor', cursor);
  tempController.plusBtn.fill(heaterOn ? activeFill : inactiveFill)
    .stroke({ width: 1, color: heaterOn ? activeStroke : inactiveStroke })
    .css('cursor', cursor);

  // Readout box tint when heating
  tempController.readoutBox.fill(heaterOn ? '#fff7e6' : '#ffffff');
}

export function resetConstantPressureExperiment() {
  if (volumeSettleTimerId) {
    clearTimeout(volumeSettleTimerId);
    volumeSettleTimerId = null;
  }
  isVolumeSettling = false;
  pendingVolumeUpdates = [];
  pendingTempRampTarget = null;

  // If the switch still exists, ensure it is disabled on reset
  if (tempSwitch && typeof tempSwitch.setEnabled === 'function') {
    tempSwitch.setEnabled(false);
  }

  // Core state back to defaults
  pressureGuage = null;
  pressureReliefValve = null;
  sleeve = null;
  syringeObj = null;
  reactorBounds = null;
  tempSwitch = null;
  thermoCouple = null;

  tempController = null;   // UI elements group for temperature control
  tempSP = 25;       // setpoint back to ambient
  currentTempC = 25;      // measured back to ambient
  heaterOn = false;        // switch state
  pressure = null;        // current pressure in bar
  liquidWeight = 1.8;      // g of N2O4 in syringe (1.6 to 2.0 g)
  liquidPushed = false;   // has the syringe been pushed?
  temperatureText = null;
  lastPressureTrue = null;
  lastPressureDisplayed = null;
  hasCoolDownOccurred = false;
  // Reset temperature controller/readouts
  refreshTempController();
  if (temperatureText) {
    temperatureText.text(`${currentTempC} °C`);
  }
  // Reset pressure readout: no gas injected yet → 0.00 bar
  if (pressure) {
    pressure.text('0.00');
  }
  updatePistonVolume(25, { animate: false, force: true });
  // Refill syringe to default mass and snap geometry back to baseline
  if (syringeObj) {
    syringeObj.animating = false;
    syringeObj.filled = true;
    syringeObj.liquidWeight = 1.8;
    updateSyringeFillFromWeight(syringeObj, false);
    if (syringeObj.liquid && syringeObj.plunger) {
      syringeObj.liquid.x(syringeObj.liquidX0).width(syringeObj.liquidW0);
      syringeObj.plunger.x(syringeObj.plungerX0);
    }
  }
  // Refresh syringe controls (button label, weight text, disabled style, etc.)
  updateWeightControlUI();
}
