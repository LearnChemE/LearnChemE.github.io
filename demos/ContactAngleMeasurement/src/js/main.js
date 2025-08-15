// src/index.js
import Plotly from 'plotly.js-dist';      // the Plotly bundle
// or: import { create, sin, cos, tan } from 'mathjs';
import profilesData from '../assets/drop_profiles.json';

// Synchronously loaded profiles
const profiles = profilesData;


const d     = 1000;     // fluid mass density [kg/m³]
const gamma = 0.072;    // surface tension [N/m]
let volume = 1000; // volume in mL
let syringe = null;
let angle = 90;
let isAnimationComplete = false;

export function drawFigure(draw) {
    // draw.line(-80, 230, 120, 230)
    // .stroke({ color: '#000', width: 2 });
    // syringe = drawSyringe(draw, 40, 350, 1.5, volume);
    selectVolume(draw);
    selectAngle(draw);
    // draw.rect(300, 2)
    // .fill('none')
    // .stroke({ color: '#000', width: 2 })
    // .move(0, 600);
    drawThetaPlot(volume, angle);
    // animateSyringe(draw);
}

let syringeProgress = 0; // in mL
let plungerGroup = null; // group for moving parts
let handleGroup = null; // group for handle parts
let handleGroup1 = null; // group for handle parts
let handleGroup2 = null; // group for handle parts
const pipeLength = 100; // length of the syringe in pixels
// Modified drawSyringe function
export function drawSyringe(draw, x, y, scale, flowRate = 1000, totalVolume = 10) {
    const syringeGroup = draw.group();
    const width = (2.5 / 30 * pipeLength);
    
    // Body group (FIXED parts - syringe barrel)
    const bodyGroup = syringeGroup.group();
    plungerGroup = syringeGroup.group();
    handleGroup = syringeGroup.group();
    handleGroup1 = syringeGroup.group();
    handleGroup2 = syringeGroup.group();
    
    handleGroup2.rect(100, 2)
    .fill('grey')
    .stroke({
        color: 'grey',
        width: 0.25
    })
    .move(x + 21 + 87 - 45 - 50 - ((flowRate - 1000) / 1000) * (100 - 25), y + 2.5 * width / 2 - 1);
    handleGroup2.back();
    
    const liquidRect = plungerGroup.rect(100 - 25 - ((1000 - flowRate) / 1000) * (100 - 25), 2.5 * width)
    .fill('#B4B4FF')
    .move(x + 27 + 87 - ((flowRate - 1000) / 1000) * (100 - 25), y);
    
    liquidRect.front();
    
    bodyGroup.rect(100, 2.5 * width)
    .fill('none')
    .stroke({
        color: '#d5d5d5',
        width: 4
    })
    .move(x + 87, y);

    // Add mL tick marks along syringe barrel: small ticks every 1 mL, big ticks every 5 mL with labels
    
    
    bodyGroup.back();
    
    bodyGroup.rect(5, 2.5 * width)
    .fill('#d5d5d5')
    .stroke({
        color: '#d5d5d5',
        width: 4
    })
    .move(x + 100 + 87, y);
    
    bodyGroup.rect(50, 0.1)
    .fill('grey')
    .stroke({
        color: 'grey',
        width: 0.1
    })
    .move(x + 21 + 87 - 45 - 50 + 181, y + 2.5 * width / 2 - 1);

    const bubbleCircle = bodyGroup.circle(0)
    .fill('#B4B4FF')
    .stroke({ color: '#000', width: 0 })
    .center(x + 21 + 87 - 45 - 50 + 181 + 50, y + 2.5 * width / 2 - 1);
    
    handleGroup1.rect(5, 2.5 * width)
    .fill('grey')
    .stroke({
        color: 'grey',
        width: 0
    })
    .move(x + 21 + 88 + ((1000 - flowRate) / 1000) * (100 - 25), y);
    
    syringeGroup.liquid = liquidRect;
    syringeGroup.initialWidth = 100 - 25 - ((1000 - flowRate) / 1000) * (100 - 25);
    syringeGroup.bubble = bubbleCircle;
    
    syringeGroup.rotate(90, x + 87 + 2.5 * width / 2, y + 2.5 * width / 2).scale(scale, scale);

    // const maxVolume = totalVolume;
    // const barrelStartX = x + 88 + 25;
    // const barrelLengthPx = 75;
    // const barrelHeightPx = 2.5 * width;
    // for (let v = 0; v <= maxVolume; v+= 0.5) {
    //   const tx = barrelStartX + (v / maxVolume) * barrelLengthPx;
    //   if (v % 2.5 === 0) {
    //     // Big tick
    //     syringeGroup.line(tx, y + barrelHeightPx, tx, y + barrelHeightPx - 10)
    //       .stroke({ color: '#000', width: 1 });
    //     // Label every 5 mL
    //     //   .rotate(-90, tx, y + barrelHeightPx + 15);
    //   } else {
    //     // Small tick
    //     syringeGroup.line(tx, y + barrelHeightPx, tx, y + barrelHeightPx - 5)
    //       .stroke({ color: '#000', width: 1 });
    //   }

    //   if (v % 5 === 0) {
    //     syringeGroup.text(String(10 - v))
    //       .font({ size: 8, anchor: 'middle', fill: '#000' })
    //       .center(tx, y + barrelHeightPx - 15)
    //       .rotate(-90, tx, y + barrelHeightPx - 15);
    //   }
    // }
    
    return syringeGroup;
}


function selectVolume(draw) {
  const volumeSelect = document.getElementById('volume-select');
  if (!volumeSelect) return;

  // Prevent duplicate handlers if drawFigure is called again
  if (window._volumeHandler) {
    volumeSelect.removeEventListener('change', window._volumeHandler);
  }

  window._volumeHandler = (event) => {
    volume = Number(event.target.value);
    reset(draw);
    draw.clear();
    drawFigure(draw);
    // Start the syringe animation automatically on volume change
    // animateSyringe(draw);
    drawThetaPlot(volume, angle);
    // Intentionally not drawing theta here so it appears after animation completes
    // drawThetaPlot(volume, angle);
  };

  volumeSelect.addEventListener('change', window._volumeHandler);
}


function selectAngle(draw) {
  const angleSlider = document.getElementById('angleSlider');
  const angleValue = document.getElementById('angleValue');
  angleSlider.addEventListener('input', (event) => {
    angle = Number(event.target.value);
    angleValue.textContent = angle;
    drawThetaPlot(volume, angle);
    
  });
}

function animateSyringe(draw) {
  // Cancel any previous syringe animation frame
  if (window.syringeAnimFrame) {
    cancelAnimationFrame(window.syringeAnimFrame);
    window.syringeAnimFrame = null;
  }
  syringeProgress = 0;
  const totalVol = volume; // in mL
  const strokePx = syringe.initialWidth;
  const durationMs = (totalVol / 1000) * 5 * 1000; // duration based on volume
  const startTime = performance.now();
  // initialize bubble at syringe tip with zero radius
  let bubbleCircle = syringe.bubble;
  function step(now) {
    let elapsed = now - startTime;
    if (elapsed > durationMs) elapsed = durationMs;
    syringeProgress = (elapsed / durationMs) * totalVol;
    // animate bubble radius from 0 → 20 * volume / 10
    const maxRadius = 11 * (volume / 1000);
    const currentRadius = Math.min(maxRadius, (syringeProgress / totalVol) * maxRadius);
    bubbleCircle.radius(currentRadius);
    const progressPx = (syringeProgress / totalVol) * strokePx;
    plungerGroup.transform({ translateX: progressPx });
    handleGroup1.transform({ translateX: progressPx });
    handleGroup2.transform({ translateX: progressPx });
    // update fluid width
    const remainingWidth = Math.max(0, strokePx - progressPx);
    syringe.liquid.attr({ width: remainingWidth });
    if (elapsed < durationMs) {
      // Queue next frame
      window.syringeAnimFrame = requestAnimationFrame(step);
    }
      else {
      // After bubble reaches full size, animate drop falling by updating its center
      bubbleCircle.radius(maxRadius);
      const drop = syringe.bubble;

      // Current tip (bubble) center – accounts for all transforms on the syringe group
      const startX = drop.cx();
      const startY = drop.cy();

      // Move horizontally by a limited distance, clamped to the canvas right edge
      const canvasWidth = (typeof draw.width === 'function') ? draw.width() : ((draw.node && draw.node.clientWidth) ? draw.node.clientWidth : 800);
      const rightBound = canvasWidth - maxRadius - 10; // keep a small margin from the edge

      // Desired travel: at least 40px, or 3×radius — whichever is larger
      const desiredTravel = Math.max(40, 3 * maxRadius);
      const targetX = Math.min(startX + desiredTravel, rightBound);
      const finalX = Math.max(startX, targetX);

      const moveDistance = Math.max(0, finalX - startX);
      const moveDuration = Math.max(250, Math.min(900, 400 + 1.0 * moveDistance));

      drop
        .animate(moveDuration, '<>')
        .center(finalX, startY)
        .after(() => {
          isAnimationComplete = true;
          // Remove any previously drawn circle with our marker color
          if (draw.prevDropCircle && typeof draw.prevDropCircle.remove === 'function') {
            draw.prevDropCircle.remove();
          }
          draw.prevDropCircle = draw.circle(4 * maxRadius).center(140, 600).fill('#B4B4FF');
          
        });
    }

  }
  // Queue next frame
  window.syringeAnimFrame = requestAnimationFrame(step);
}


/**
 * Returns the stored profile for a given volume and contact angle.
 */
function getProfile(volume, angle) {
  const volKey = String(volume);
  const angKey = String(angle);
  if (!profiles[volKey] || !profiles[volKey][angKey]) {
    console.error(`Profile not found for volume ${volKey}, angle ${angKey}`);
    return null;
  }
  return profiles[volKey][angKey];
}

/**
 * Draws the drop profile from precomputed JSON data.
 * @param {number|string} volume - Volume in mm^3 (e.g., '1', '5', '10').
 * @param {number|string} angle  - Contact angle in degrees (e.g., '45').
 */
function drawThetaPlot(volume, angle) {
    // if (!isAnimationComplete) { return };
  const profile = getProfile(volume, angle);
  if (!profile) return;
  const theta = profile.theta;
  const r = profile.r;
  // Convert r from mm to μm for range calculations
  const r_um = r.map(val => val * 1000);
  const xUpper = theta.map((t, i) => r[i] * Math.cos(t) * 1000);
  const xLower = theta.map((t, i) => r[i] * Math.cos(Math.PI - t) * 1000).reverse();
  const yUpper = theta.map((t, i) => r[i] * Math.sin(t) * 1000);
  const yLower = theta.map((t, i) => r[i] * Math.sin(Math.PI - t) * 1000).reverse();
  const x = xUpper.concat(xLower);
  const y = yUpper.concat(yLower);
  const yMax = 1.01 * r_um[r_um.length - 1];
  // Get container size
  const plotDivEl = document.getElementById('plotDiv');
  if (plotDivEl) {
    // Make sure the plot can receive mouse/touch events even if other layers overlap
    plotDivEl.style.pointerEvents = 'auto';
    plotDivEl.style.zIndex = '1000';
    plotDivEl.style.touchAction = 'auto';
  }
  const w = plotDivEl ? plotDivEl.clientWidth : 750;
  const h = plotDivEl ? plotDivEl.clientHeight : 750;
  const size = Math.min(w, h);

  // Format to exactly N significant figures with padding; switches to scientific when needed
  function formatSig(x, n = 3) {
    if (!isFinite(x)) return String(x);
    if (x === 0) return (0).toFixed(n - 1); // e.g., n=3 => "0.00"
    const ax = Math.abs(x);
    const exp = Math.floor(Math.log10(ax));
    // Use fixed-point when the number of integer digits <= n; otherwise scientific
    if (exp >= n || exp <= -4) {
      const mant = x / Math.pow(10, exp);
      return mant.toFixed(n - 1) + 'e' + (exp >= 0 ? '+' : '') + exp;
    }
    const decimals = Math.max(0, n - 1 - exp);
    return x.toFixed(decimals);
  }

  const customdata = x.map((xi, i) => [formatSig(xi, 3), formatSig(y[i], 3)]);

  const trace = {
    x, y,
    mode: 'lines',
    line: { color: 'black' },
    fill: 'tozeroy',
    fillcolor: '#B4B4FF',
    fillOpacity: 0.5,
    hoveron: 'fills+points',
    customdata: customdata,
    hovertemplate: 'x: %{customdata[0]} μm<br>y: %{customdata[1]} μm<extra></extra>'
  };
  const layout = {
    hovermode: 'closest',
    hoverdistance: 50,
    spikedistance: -1,
    dragmode: 'zoom',
    xaxis: {
      title: { text: 'x (μm)' },
      range: [-1.01 * Math.max(...r_um), 1.01 * Math.max(...r_um)],
      showspikes: true,
      spikemode: 'across',
      spikesnap: 'cursor',
      spikecolor: '#444',
      spikethickness: 1,
    },
    yaxis: {
      title: { text: 'y (μm)' },
      range: [0, yMax],
      showspikes: true,
      spikemode: 'across',
      spikesnap: 'cursor',
      spikecolor: '#444',
      spikethickness: 1,
      scaleanchor: 'x',
      scaleratio: 1,
      constrain: 'range',
      constraintoward: 'bottom'
    },
    width: size,
    height: size,
  };
  const config = { responsive: true, displayModeBar: false, scrollZoom: true, staticPlot: false };
  Plotly.newPlot('plotDiv', [trace], layout, config);
}

// Add window resize handler to redraw plot responsively
window.addEventListener('resize', () => {
  if (isAnimationComplete) {
    drawThetaPlot(volume, angle);
  }
});

export function reset(draw) {
  // Stop syringe animation
  if (window.syringeAnimFrame) {
    cancelAnimationFrame(window.syringeAnimFrame);
    window.syringeAnimFrame = null;
  }
  // Stop SVG.js bubble animation if in progress
  if (syringe && syringe.bubble && typeof syringe.bubble.stop === 'function') {
    syringe.bubble.stop();
  }

  // Reset animation completion flag
  isAnimationComplete = false;

  // Reset volume and update selector
//   volume = 10;
//   const volSelect = document.getElementById('volume-select');
//   if (volSelect) volSelect.value = String(volume);

  // Reset angle and update slider/value display
  // angle = 10;
  const angleSlider = document.getElementById('angleSlider');
  const angleValue = document.getElementById('angleValue');
  if (angleSlider) angleSlider.value = String(angle);
  if (angleValue) angleValue.textContent = String(angle);

  // Clear the Plotly graph
  const plotDiv = document.getElementById('plotDiv');
  if (plotDiv && window.Plotly && Plotly.purge) {
    Plotly.purge(plotDiv);
  }

  // Clear and redraw the SVG canvas
  if (draw && typeof draw.clear === 'function') {
    draw.clear();
    drawFigure(draw);
  }

  // Ensure animation flag remains false
  isAnimationComplete = false;
}
