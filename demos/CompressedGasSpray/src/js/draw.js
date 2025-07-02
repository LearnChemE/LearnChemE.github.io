import { runSimulation } from "./calcs.js";

// Global animation state
let showSpray = false;
let sprayTimer = null;
let playMoleculeFlag = false;
let pausedMolecule = false;
let currentIndex = 0;
let moleculeStartTs = 0;
let moleculeDuration = 0;
let rafId = null;

// Main draw function: runs simulation, draws cylinder + graph, and caches graph data
export function drawAll() {
  // 1) Read inputs & run simulation
  const f = parseFloat(document.getElementById("volumeFraction").value);
  const tMax = parseInt(document.getElementById("timeSprayed").value, 10);
  const mode = window.graphMode || "volume";
  const data = runSimulation(f, tMax);


  // 2) Canvas setup
  const wrapper = document.getElementById("p5-container");
  const canvas = document.getElementById("main-canvas");
  const W = wrapper.clientWidth;
  const H = wrapper.clientHeight;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  // 3) Draw cylinder on left
  drawCylinder(ctx, W * 0.10, H, f);

  // 4) Draw graph on right
  const gX = W * 0.30, gY = H * 0.05;
  const gW = W * 0.65, gH = H * 0.90;
  drawGraph(ctx, gX, gY, gW, gH, data, mode, tMax);

  // 5) Cache graph data for animation
  const times = data.time;
  const curves = {
    volume: data.vL,
    vapor: data.vV,
    moles: data.nL,
    molesVapor: data.nV,
    temperature: data.T.map(T => T - 273.15),
    pressure: data.P
  };

  // margin for full curve
  let allVals;
  if (mode === 'volume') {
    allVals = [...curves.volume, ...curves.vapor];
  } else if (mode === 'moles') {
    allVals = [...curves.moles, ...curves.molesVapor];
  } else {
    allVals = curves[mode];
  }
  const minY = Math.min(0, ...allVals) * 1.1;
  const maxY = Math.max(...allVals) * 1.1;

  const M = { left: gW * 0.10, right: gW * 0.10, top: gH * 0.10, bottom: gH * 0.10 };
  const plotW = gW - M.left - M.right;
  const plotH = gH - M.top - M.bottom;
  const xScale = t => gX + M.left + (t / tMax) * plotW;
  const yScale = v => gY + M.top + plotH - ((v - minY) / (maxY - minY)) * plotH;


  // true cylinder capacity (in L) = initial liquid volume ÷ initial fraction
  const capacity = data.vL[0] / f;

  // store for animation routines
  window.graphData = {
    rawData: data,       // for drawGraph
    curves,
    times: data.time,
    capacity,
    tMax,
    mode: window.graphMode || "volume",
    xScale,
    yScale,
    canvas: document.getElementById("main-canvas"),
    Praw: [...data.P],
    Traw: [...data.T]
  };
  drawFrame();

  // 6) Optionally overlay spray & moving dot (for non-RAF initial draw)
  if (showSpray) drawSpray();
  //if (playMoleculeFlag || pausedMolecule) 
  drawMovingDot(currentIndex);
}


// helper: drawCylinder(ctx, centerX, canvasHeight, volumeFraction)
function drawCylinder(ctx, centerX, canvasHeight, volumeFraction) {
  const bodyHeight = canvasHeight * 0.45;
  const bodyWidth = bodyHeight * 0.4;
  const verticalOffset = canvasHeight * 0.1;
  const bodyTop = (canvasHeight - bodyHeight) / 2 + verticalOffset;
  const bodyBottom = bodyTop + bodyHeight;
  const ellipseRadiusY = bodyWidth / 2;

  // 1) Cylinder walls
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(centerX - bodyWidth / 2, bodyTop);
  ctx.lineTo(centerX - bodyWidth / 2, bodyBottom);
  ctx.lineTo(centerX + bodyWidth / 2, bodyBottom);
  ctx.lineTo(centerX + bodyWidth / 2, bodyTop);
  ctx.stroke();

  // 2) Dome (half‐ellipse)
  ctx.beginPath();
  ctx.ellipse(centerX, bodyTop, bodyWidth / 2, ellipseRadiusY, 0, Math.PI, 0);
  ctx.stroke();

  // 3) Liquid fill
  const liquidHeight = bodyHeight * volumeFraction;
  const liquidTopY = bodyBottom - liquidHeight;
  ctx.fillStyle = 'cyan';
  ctx.fillRect(
    centerX - bodyWidth / 2,
    liquidTopY,
    bodyWidth,
    liquidHeight
  );

  if (volumeFraction >= 1.0) {
    ctx.beginPath();
    ctx.ellipse(
      centerX,
      bodyTop,
      bodyWidth / 2,
      ellipseRadiusY,
      0,
      Math.PI,
      0
    );
    ctx.fillStyle = 'cyan';
    ctx.fill();
    ctx.stroke();  // redraw its border
  }
  // redraw fill border
  ctx.beginPath();
  ctx.moveTo(centerX - bodyWidth / 2, liquidTopY);
  ctx.lineTo(centerX - bodyWidth / 2, bodyBottom);
  ctx.lineTo(centerX + bodyWidth / 2, bodyBottom);
  ctx.lineTo(centerX + bodyWidth / 2, liquidTopY);
  ctx.stroke();

  // 4) **Pipe**: vertical line from dome peak up to valve head
  const domePeakY = bodyTop - ellipseRadiusY;
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(centerX, domePeakY - 8);
  ctx.lineTo(centerX, domePeakY);
  ctx.stroke();

  // 5) Valve body (upper rectangle) & gauge
  const valveWidth = bodyWidth * 0.33;
  const valveHeight = bodyHeight * 0.18;
  const valveX = centerX - valveWidth / 2;
  const valveBottomY = domePeakY - 8;
  const valveTopY = valveBottomY - valveHeight;

  // rectangle
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.rect(valveX, valveTopY, valveWidth, valveHeight);
  ctx.fill();
  ctx.stroke();

  // hatch lines in valve body
  ctx.beginPath();
  for (let x = valveX + 2; x <= valveX + valveWidth - 2; x += 3) {
    ctx.moveTo(x, valveTopY);
    ctx.lineTo(x, valveTopY + valveHeight);
  }
  ctx.stroke();

  // gauge circle
  const gaugeRadius = valveHeight * 0.2;
  const gaugeX = valveX + valveWidth - gaugeRadius - 4;
  const gaugeY = valveTopY + valveHeight / 2;
  ctx.beginPath();
  ctx.fillStyle = 'white';
  ctx.arc(gaugeX, gaugeY, gaugeRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.arc(gaugeX, gaugeY, gaugeRadius * 0.3, 0, 2 * Math.PI);
  ctx.fill();
}

// helper: drawGraph(ctx, x0, y0, w, h, data, mode, tMax)
function drawGraph(ctx, x0, y0, w, h, data, mode, tMax) {
  const M = { left: w * 0.10, right: w * 0.10, top: h * 0.10, bottom: h * 0.10 };
  const plotW = w - M.left - M.right;
  const plotH = h - M.top - M.bottom;

  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'black';
  ctx.strokeRect(
    x0 + M.left,
    y0 + M.top,
    plotW,
    plotH
  );

  // data curves
  let curves, colors, dashes, labels;
  if (mode === 'volume') {
    curves = [data.vL, data.vV]; colors = ['orange', 'orange']; dashes = [[], [5, 3]]; labels = ['liquid', 'vapor'];
  } else if (mode === 'moles') {
    curves = [data.nL, data.nV]; colors = ['purple', 'purple']; dashes = [[], [5, 3]]; labels = ['liquid', 'vapor'];
  } else if (mode === 'temperature') {
    curves = [data.T.map(T => T - 273.15)]; colors = ['blue']; dashes = [[]]; labels = [""];
  } else {
    curves = [data.P]; colors = ['blue']; dashes = [[]]; labels = [""];
  }

  const flat = curves.flat();
  const minY = Math.min(0, ...flat) * 1.1;
  const maxY = Math.max(...flat) * 1.1;

  const xS = t => x0 + M.left + (t / tMax) * plotW;
  const yS = v => y0 + M.top + plotH - ((v - minY) / (maxY - minY)) * plotH;

  // Y-ticks
  ctx.font = '16px sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = 'black';
  let yTickValues;
  if (mode === 'volume') {
    yTickValues = [];
    for (let v = 0.0; v <= maxY; v += 0.1) {
      yTickValues.push(v);
    }
  } else if (mode === 'temperature') {
    // only multiples of 5 inside [minY, maxY]
    const start = Math.ceil(minY / 5) * 5;
    const end = Math.floor(maxY / 5) * 5;
    yTickValues = [];
    for (let v = start; v <= end; v += 5) {
      yTickValues.push(v);

    }
  } else if (mode === 'pressure') {
    // simple integer ticks
    const start = Math.ceil(minY);
    const end = Math.floor(maxY);
    yTickValues = [];
    for (let v = start; v <= end; v += 1) {
      yTickValues.push(v);
    }
  } else {
    // moles or any other: 5 evenly spaced
    yTickValues = [];
    const step = (maxY - minY) / 5;
    for (let i = 0; i <= 5; i++) {
      yTickValues.push(minY + step * i);
    }
  }

  // Draw the ticks & labels
  yTickValues.forEach(v => {
    const yy = yS(v);

    // tick mark
    ctx.beginPath();
    ctx.moveTo(x0 + M.left - 5, yy);
    ctx.lineTo(x0 + M.left, yy);
    ctx.stroke();

    // label
    let label;
    if (mode === 'volume' || mode === 'temperature' || mode === 'pressure') {
      // they’re already “nice” increments, so just fix decimals or integer
      label = (mode === 'volume') ? v.toFixed(1) : v.toString();
    } else {
      label = v.toFixed(1);
    }

    ctx.fillText(label, x0 + M.left - 8, yy + 4);
  });

  // X-ticks
  let interval = tMax < 40 ? 5 : tMax < 80 ? 10 : tMax < 150 ? 20 : 50;
  ctx.textAlign = 'center';
  for (let t = 0; t <= tMax; t += interval) {
    const xx = xS(t), yy = yS(minY);
    ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx, yy + 5); ctx.stroke();
    ctx.fillText(t.toString(), xx, yy + 20);
  }

  // plot curves
  curves.forEach((arr, i) => {
    ctx.save(); ctx.strokeStyle = colors[i]; ctx.setLineDash(dashes[i]);
    ctx.beginPath(); ctx.moveTo(xS(data.time[0]), yS(arr[0]));
    arr.forEach((v, j) => ctx.lineTo(xS(data.time[j]), yS(v)));
    ctx.stroke();

    // mid label
    const mid = Math.floor(arr.length / 2);
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'left'; ctx.fillText(labels[i], xS(data.time[mid]) + 5, yS(arr[mid]) - 5);
    ctx.restore();
  });

  // Y-axis label
  const yLabel = mode === 'volume' ? 'volume (L)'
    : mode === 'moles' ? 'moles'
      : mode === 'temperature' ? 'temperature (°C)'
        : 'pressure (bar)';
  ctx.save();
  ctx.translate(x0 + 15, y0 + M.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center'; ctx.font = '18px sans-serif';
  ctx.fillStyle = 'black';
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  // X-axis label
  ctx.fillStyle = 'black'; ctx.font = '18px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('time (s)', x0 + M.left + plotW / 2, y0 + M.top + plotH + 40);
}

// Spray trigger and draw
export function triggerSpray(duration) {
  showSpray = true;
  clearTimeout(sprayTimer);
  sprayTimer = setTimeout(() => { showSpray = false; }, duration);
  if (!rafId) {
    rafId = requestAnimationFrame(animationLoop);
  }
}

export function drawSpray() {
  const { canvas } = window.graphData;
  const ctx = canvas.getContext("2d");
  const W = canvas.width;
  const H = canvas.height;

  const centerX = W * 0.10;
  const bodyHeight = H * 0.45;
  const verticalOffset = H * 0.10;
  const bodyTop = (H - bodyHeight) / 2 + verticalOffset;
  const domeRadiusY = (bodyHeight * 0.4) / 2;
  const domePeakY = bodyTop - domeRadiusY;
  const pipeTopY = domePeakY - 8;

  let nozzleX = centerX;
  let nozzleY = pipeTopY;

  const offsetX = 25;
  const offsetY = -20;
  nozzleX += offsetX;
  nozzleY += offsetY;

  // draw the fan of rays from (nozzleX, nozzleY) —
  ctx.save();
  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);

  const rays = 7;
  const spread = Math.PI / 3;
  const length = bodyHeight * 0.4;

  for (let i = 0; i < rays; i++) {
    const angle = -spread / 2 + (spread / (rays - 1)) * i;
    const x2 = nozzleX + Math.cos(angle) * length;
    const y2 = nozzleY + Math.sin(angle) * length;
    ctx.beginPath();
    ctx.moveTo(nozzleX, nozzleY);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

// Molecule animation controls
export function playMolecule() {
  //hidePfTf();
  playMoleculeFlag = true;
  pausedMolecule = false;
  currentIndex = 0;
  moleculeStartTs = performance.now();
  moleculeDuration = ((parseInt(document.getElementById('timeSprayed').value, 10)) / 20) * 1000;
  // spray the entire time the dot is moving
  triggerSpray(moleculeDuration);
  if (!rafId) {
    rafId = requestAnimationFrame(animationLoop);
  }
}

export function pauseMolecule() {
  playMoleculeFlag = false;
  pausedMolecule = true;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  drawFrame();
}

export function resetMolecule() {
  playMoleculeFlag = false;
  pausedMolecule = false;
  showSpray = false;
  currentIndex = 0;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  drawAll();
  const defaultPf = 6.8;
  const defaultTfRaw = 25.0 + 273.15;
  //showPfTf(defaultPf, defaultTfRaw);
}

export function resetMoleculeForSliderChange() {
  playMoleculeFlag = false;
  pausedMolecule = false;
  showSpray = false;
  currentIndex = 0;
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  drawAll();
}

// Core animation loop: redraws scene and overlays

function animationLoop(timestamp) {
  const gd = window.graphData;
  if (!gd || !Array.isArray(gd.times)) {
    // no data yet → stop
    rafId = null;
    return;
  }

  // update index if playing
  if (playMoleculeFlag) {
    const elapsed = timestamp - moleculeStartTs;
    const frac = Math.min(elapsed / moleculeDuration, 1);
    const N = gd.times.length;
    currentIndex = Math.floor(frac * (N - 1));
  }

  // redraw base frame + overlays
  drawFrame();
  if (showSpray) drawSpray();
  if (playMoleculeFlag || pausedMolecule) drawMovingDot(currentIndex);

  // continue or finish
  const keepMoving = playMoleculeFlag && currentIndex < gd.times.length - 1;
  const keepSpraying = showSpray;
  if (keepMoving || keepSpraying) {
    rafId = requestAnimationFrame(animationLoop);
  } else {
    //showPfTf(gd.Praw[currentIndex], gd.Traw[currentIndex]);
    rafId = null;
  }
}


// Draw the moving black dot on plots
export function drawMovingDot(idx) {
  const gd = window.graphData;
  if (!gd || !Array.isArray(gd.times) || !gd.curves) return;

  const { times, curves, xScale, yScale, mode, canvas } = gd;
  if (idx < 0 || idx >= times.length) return;

  const t = times[idx];
  const x = xScale(t);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = 'black';

  if (mode === 'volume') {
    // liquid dot
    const yL = yScale(curves.volume[idx]);
    ctx.beginPath(); ctx.arc(x, yL, 4, 0, 2 * Math.PI); ctx.fill();

    // vapor dot
    const yV = yScale(curves.vapor[idx]);
    ctx.beginPath(); ctx.arc(x, yV, 4, 0, 2 * Math.PI); ctx.fill();

  } else if (mode === 'moles') {
    // liquid‐moles dot
    const yL = yScale(curves.moles[idx]);
    ctx.beginPath(); ctx.arc(x, yL, 4, 0, 2 * Math.PI); ctx.fill();

    // vapor‐moles dot
    const yV = yScale(curves.molesVapor[idx]);
    ctx.beginPath(); ctx.arc(x, yV, 4, 0, 2 * Math.PI); ctx.fill();

  } else {
    // single dot for temp or pressure
    const arr = curves[mode];
    const y = yScale(arr[idx]);
    ctx.beginPath(); ctx.arc(x, y, 4, 0, 2 * Math.PI); ctx.fill();
  }
}

// function updatePfTf(pf, tf) {
//   const pfEl = document.getElementById("pfDisplay");
//   const tfEl = document.getElementById("tfDisplay");
//   if (pfEl) pfEl.innerHTML = `P<sub>f</sub> = ${pf.toFixed(1)} bar`;
//   if (tfEl) tfEl.innerHTML = `T<sub>f</sub> = ${(tf - 273.15).toFixed(1)} K`;
// }

// function hidePfTf() {
//   const sec = document.getElementById("mathsection");
//   if (sec) sec.style.display = "none";
// }

// function showPfTf(pf, tf) {
//   updatePfTf(pf, tf);
//   const sec = document.getElementById("mathsection");
//   if (sec) sec.style.display = "block";
// }

// Draws one full frame (cylinder + graph) at currentIndex
function drawFrame() {
  const gd = window.graphData;
  if (!gd) return;

  const { canvas, rawData, capacity, curves, times, xScale, yScale, mode, tMax } = gd;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;

  ctx.clearRect(0, 0, W, H);

  // figure out which index to use (0 if never played yet)
  const idx = Math.min(currentIndex, times.length - 1) || 0;

  // fraction = current liquid volume ÷ real capacity
  let frac = curves.volume[idx] / capacity;
  frac = Math.max(0, Math.min(1, frac));

  // 1) cylinder at that fraction
  drawCylinder(ctx, W * 0.10, H, frac);

  // 2) graph background + curves
  const gX = W * 0.30, gY = H * 0.05, gW = W * 0.65, gH = H * 0.90;
  drawGraph(ctx, gX, gY, gW, gH, rawData, mode, tMax);
}
