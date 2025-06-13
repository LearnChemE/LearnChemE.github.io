// src/js/draw.js
import { runSimulation } from "./calcs.js";

export function drawAll() {
  // 1) Read inputs & run sim
  const f = parseFloat(document.getElementById("volumeFraction").value);
  const tMax = parseInt(document.getElementById("timeSprayed").value, 10);
  const mode = window.graphMode || "volume";
  const data = runSimulation(f, tMax);

  // 2) grab the single canvas inside your #p5-container
  const wrapper = document.getElementById("p5-container");
  const canvas = document.getElementById("main-canvas");

  // 3) resize it to exactly fill #p5-container
  const W = wrapper.clientWidth;
  const H = wrapper.clientHeight;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);

  // 4) Draw cylinder on left 20% using original flow
  const centerX = W * 0.10;            // 10% in from left
  drawCylinder(ctx, centerX, H, f);

  // 5) Draw graph on right 65%
  const gphX = W * 0.30;
  const gphY = (H * 0.05);
  const gphW = W * 0.65;
  const gphH = H * 0.90;
  drawGraph(ctx, gphX, gphY, gphW, gphH, data, mode, tMax);

  // 6) Populate window.graphData for animation
  const times = data.time;
  const allY = mode === "volume" ? [...data.vL, ...data.vV]
    : mode === "moles" ? [...data.nL, ...data.nV]
      : mode === "temperature" ? data.T.map(t => t - 273.15)
        : data.P;
  const minY = Math.min(0, ...allY) * 1.1;
  const maxY = Math.max(...allY) * 1.1;

  const M = { left: gphW * 0.10, right: gphW * 0.10, top: gphH * 0.10, bottom: gphH * 0.10 };
  const plotW = gphW - M.left - M.right;
  const plotH = gphH - M.top - M.bottom;

  const xScale = t => gphX + M.left + (t / tMax) * plotW;
  const yScale = v => gphY + M.top + plotH
    - ((mode === "temperature" ? v - 273.15 : v) - minY) / (maxY - minY) * plotH;

  window.graphData = {
    times,
    curves: {
      volume: data.vL,
      vapor: data.vV,
      moles: data.nL,
      temperature: data.T,
      pressure: data.P
    },
    xScale,
    yScale,
    mode,
    canvas,
    start: (window.graphData && window.graphData.start) || null
  };
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
  // place it directly above the pipe:
  const valveX = centerX - valveWidth / 2;
  const valveBottomY = domePeakY - 8;    // small gap
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
    x0 + M.left,      // left
    y0 + M.top,       // top
    plotW,            // width
    plotH             // height
  );

  // data curves
  let curves, colors, dashes, labels;
  if (mode === 'volume') {
    curves = [data.vL, data.vV]; colors = ['orange', 'orange']; dashes = [[], [5, 3]]; labels = ['liquid', 'vapor'];
  } else if (mode === 'moles') {
    curves = [data.nL, data.nV]; colors = ['purple', 'purple']; dashes = [[], [5, 3]]; labels = ['liquid', 'vapor'];
  } else if (mode === 'temperature') {
    curves = [data.T.map(T => T - 273.15)]; colors = ['black']; dashes = [[]]; labels = ['temperature (°C)'];
  } else {
    curves = [data.P]; colors = ['blue']; dashes = [[]]; labels = ['pressure (bar)'];
  }

  const flat = curves.flat();
  const minY = Math.min(0, ...flat) * 1.1;
  const maxY = Math.max(...flat) * 1.1;

  const xS = t => x0 + M.left + (t / tMax) * plotW;
  const yS = v => y0 + M.top + plotH - ((v - minY) / (maxY - minY)) * plotH;

  // Y-ticks
  ctx.font = '12px sans-serif'; ctx.textAlign = 'right'; ctx.fillStyle = 'black';
  let yTickValues;
  if (mode === 'volume') {
    // from 0.0 up to maxY, in steps of 0.1
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



    // start dot
    ctx.fillStyle = 'black'; ctx.beginPath();
    ctx.arc(xS(data.time[0]), yS(arr[0]), 4, 0, 2 * Math.PI); ctx.fill();

    // mid label
    const mid = Math.floor(arr.length / 2);
    ctx.textAlign = 'left'; ctx.fillText(labels[i], xS(data.time[mid]) + 5, yS(arr[mid]) - 5);
    ctx.restore();
  });

  // axis labels
  // Y-axis label
  const yLabel = mode === 'volume' ? 'volume (L)'
    : mode === 'moles' ? 'moles'
      : mode === 'temperature' ? 'temperature (°C)'
        : 'pressure (bar)';
  ctx.save();
  ctx.translate(x0 + 15, y0 + M.top + plotH / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center'; ctx.font = '14px sans-serif';
  ctx.fillStyle = 'black';
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  // X-axis label
  ctx.fillStyle = 'black'; ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('time (s)', x0 + M.left + plotW / 2, y0 + M.top + plotH + 40);

  // Initial Pᵢ, Tᵢ annotation
  // const Pi = data.P0.toFixed(2);
  // const Ti = (data.T0 - 273.15).toFixed(1);

  // ctx.font = 'italic 14px serif';
  // ctx.fillText(`Pᵢ = ${Pi} bar   Tᵢ = ${Ti} °C`, x0 + M.left + plotW / 2, y0 + M.top - 10);
}