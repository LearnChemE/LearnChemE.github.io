// src/index.js
import Plotly from 'plotly.js-dist';      // the Plotly bundle
// or: import { create, sin, cos, tan } from 'mathjs';
import profilesData from '../assets/drop_profiles.json';

// Synchronously loaded profiles
const profiles = profilesData;


const d     = 1000;     // fluid mass density [kg/m³]
const gamma = 0.072;    // surface tension [N/m]
let volume = 10; // volume in mL
let syringe = null;
let angle = 10;

export function drawFigure(draw) {
    draw.line(-80, 230, 120, 230)
    .stroke({ color: '#000', width: 2 });
    syringe = drawSyringe(draw, 40, 250, 1.5, volume);
    drawSwitch(draw, -80, 200, 80, 40);
    selectVolume(draw);
    selectAngle(draw);
}

let syringeProgress = 0; // in mL
let plungerGroup = null; // group for moving parts
let handleGroup = null; // group for handle parts
let handleGroup1 = null; // group for handle parts
let handleGroup2 = null; // group for handle parts
const pipeLength = 100; // length of the syringe in pixels
// Modified drawSyringe function
export function drawSyringe(draw, x, y, scale, flowRate = 10, totalVolume = 10) {
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
    .move(x + 21 + 87 - 45 - 50 - ((flowRate - 10) / 10) * (100 - 25), y + 2.5 * width / 2 - 1);
    handleGroup2.back();
    
    const liquidRect = plungerGroup.rect(100 - 25 - ((10 - flowRate) / 10) * (100 - 25), 2.5 * width)
    .fill('#B4B4FF')
    .move(x + 27 + 87 - ((flowRate - 10) / 10) * (100 - 25), y);
    
    liquidRect.front();
    
    bodyGroup.rect(100, 2.5 * width)
    .fill('none')
    .stroke({
        color: '#d5d5d5',
        width: 4
    })
    .move(x + 87, y);
    
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
    
    handleGroup1.rect(5, 2.5 * width)
    .fill('grey')
    .stroke({
        color: 'grey',
        width: 0
    })
    .move(x + 21 + 89 + ((10 - flowRate) / 10) * (100 - 25), y);
    
    syringeGroup.liquid = liquidRect;
    syringeGroup.initialWidth = 100 - 25 - ((10 - flowRate) / 10) * (100 - 25);
    
    syringeGroup.rotate(90, x + 87 + 2.5 * width / 2, y + 2.5 * width / 2).scale(scale, scale);
    
    return syringeGroup;
}


function drawSwitch(draw, x, y, width, height, opacity = 1) {
    const switchGroup = draw.group();
    switchGroup.isOn = false;
    const handleWidth = 5;
    const handleHeight = height * 0.8;
    const handle = switchGroup.rect(handleWidth, handleHeight)
    .fill({
        color: '#aaa',
        opacity: opacity
    })
    .move(x + (width - handleWidth) / 2, y - height / 2);
    switchGroup.handle = handle;
    
    switchGroup.rect(width, height)
    .fill({
        color: '#555',
        opacity: opacity
    })
    .radius(height / 5)
    .move(x, y);
    switchGroup.text('OFF')
    .font({
        size: 12,
        anchor: 'middle',
        fill: '#fff'
    })
    .center(x + width * 0.25, y + height / 2);
    switchGroup.text('ON')
    .font({
        size: 12,
        anchor: 'middle',
        fill: '#fff'
    })
    .center(x + width * 0.75, y + height / 2);
    let isOn = false;
    handle.rotate(-20, x + width / 2, y + height / 2);
    switchGroup.click(() => {
        isOn = !isOn;
        switchGroup.isOn = isOn;
        if (isOn) {
            // pressure.show();
            handle.animate(200).rotate(40, x + width / 2, y + height / 2);
        } else {
            // pressure.hide();
            handle.animate(200).rotate(-40, x + width / 2, y + height / 2);
        }
        
        // Control syringe animation based on switch state
        if (switchGroup.isOn) {
            animateSyringe();
        }
    });
    // Remember pivot for reset
    switchGroup.pivot = {
        x,
        y,
        width,
        height
    };
    return switchGroup;
}


function selectVolume(draw) {
    document.addEventListener('DOMContentLoaded', () => {
        const volumeSelect = document.getElementById('volume-select');
        volumeSelect.addEventListener('change', (event) => {
            volume = Number(event.target.value);
            draw.clear();
            drawFigure(draw);
            // TODO: call your update logic here, e.g.:
            // updateSyringe({ totalVolume: newVolume });
            drawThetaPlot(volume, angle);
        });
    });
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


function updatePlungerPosition() {
    if (!syringe || !plungerGroup || !handleGroup1 || !handleGroup2) return;
    
    const progressPx = (syringeProgress * SYRINGE_STROKE_PX) / SYRINGE_TOTAL_VOLUME;
    plungerGroup.transform({
        translateX: progressPx
    });
    handleGroup1.transform({ translateX: progressPx });
    // handleGroup2.transform({ translateX: progressPx });
    // rectangle.transform({
    //     translateX: progressPx
    // });
    
    const remainingWidth = Math.max(0, syringe.initialWidth - progressPx);
    syringe.liquid.attr({
        width: remainingWidth
    });
}

function animateSyringe() {
  syringeProgress = 0;
  const totalVol = volume; // in mL
  const strokePx = syringe.initialWidth;
  const durationMs = totalVol * 1000; // duration based on volume
  const startTime = performance.now();
  function step(now) {
    let elapsed = now - startTime;
    if (elapsed > durationMs) elapsed = durationMs;
    syringeProgress = (elapsed / durationMs) * totalVol;
    const progressPx = (syringeProgress / totalVol) * strokePx;
    plungerGroup.transform({ translateX: progressPx });
    handleGroup1.transform({ translateX: progressPx });
    handleGroup2.transform({ translateX: progressPx });
    // update fluid width
    const remainingWidth = Math.max(0, strokePx - progressPx);
    syringe.liquid.attr({ width: remainingWidth });
    if (elapsed < durationMs) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
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
  const profile = getProfile(volume, angle);
  if (!profile) return;
  const theta = profile.theta;
  const r = profile.r;
  const xUpper = theta.map((t, i) => r[i] * Math.cos(t));
  const xLower = theta.map((t, i) => r[i] * Math.cos(Math.PI - t)).reverse();
  const yUpper = theta.map((t, i) => r[i] * Math.sin(t));
  const yLower = theta.map((t, i) => r[i] * Math.sin(Math.PI - t)).reverse();
  const x = xUpper.concat(xLower);
  const y = yUpper.concat(yLower);
  const trace = {
    x, y,
    mode: 'lines',
    line: { color: 'black' },
    fill: 'tozeroy',
    fillcolor: 'lightblue',
  };
  const layout = {
    xaxis: { range: [-1.01 * Math.max(...r), 1.01 * Math.max(...r)] },
    yaxis: { range: [-0.1 * r[r.length - 1], 1.01 * r[r.length - 1]] },
  };
  Plotly.newPlot('plotDiv', [trace], layout);
}
