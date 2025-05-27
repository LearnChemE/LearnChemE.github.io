// draw.js
import { runSimulation } from './calcs.js';

export function drawAll() {
  const container = document.getElementById('drawing-area');
  container.innerHTML = '';
  console.log('current mode:')
  const volumeFraction = parseFloat(document.getElementById('volumeFraction').value);
  const sprayTime = parseInt(document.getElementById('timeSprayed').value);
  console.log(window.graphMode)
  const mode = window.graphMode || 'volume';  // using global state
  console.log('current mode:', window.graphMode);

  const result = runSimulation(volumeFraction, sprayTime);

  const canvas = document.createElement('canvas');
  container.appendChild(canvas);

  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  const totalWidth = canvas.width;
  const totalHeight = canvas.height;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const leftCenterX = totalWidth * 0.25;
  const rightCenterX = totalWidth * 0.725;

  drawCylinder(ctx, leftCenterX - 60, totalHeight, volumeFraction);
  drawGraph(ctx, rightCenterX, totalHeight, result, mode, sprayTime);
}

function drawCylinder(ctx, centerX, canvasHeight, volumeFraction) {
  const bodyHeight = canvasHeight * 0.45;
  const bodyWidth = bodyHeight * 0.4;
  const verticalOffset = canvasHeight * 0.1;
  const bodyTop = (canvasHeight - bodyHeight) / 2 + verticalOffset;
  const bodyBottom = bodyTop + bodyHeight;
  const ellipseHeight = bodyWidth / 2;

  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';

  // Draw side body only (no top line)
  ctx.beginPath();
  ctx.moveTo(centerX - bodyWidth / 2, bodyTop);
  ctx.lineTo(centerX - bodyWidth / 2, bodyBottom);
  ctx.lineTo(centerX + bodyWidth / 2, bodyBottom);
  ctx.lineTo(centerX + bodyWidth / 2, bodyTop);
  ctx.stroke();

  // Draw top dome (half ellipse)
  ctx.beginPath();
  ctx.ellipse(centerX, bodyTop, bodyWidth / 2, ellipseHeight, 0, Math.PI, 0);
  ctx.stroke();

  if (volumeFraction >= 1.0) {
    ctx.fillStyle = 'cyan';
    ctx.fill(); // only fill dome when completely full
  }
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // Liquid fill
  const liquidHeight = bodyHeight * volumeFraction;
  const liquidTopY = bodyBottom - liquidHeight;

  ctx.fillStyle = 'cyan';
  ctx.fillRect(centerX - bodyWidth / 2, liquidTopY, bodyWidth, bodyBottom - liquidTopY);

  ctx.beginPath();
  ctx.moveTo(centerX - bodyWidth / 2, liquidTopY);
  ctx.lineTo(centerX - bodyWidth / 2, bodyBottom);
  ctx.lineTo(centerX + bodyWidth / 2, bodyBottom);
  ctx.lineTo(centerX + bodyWidth / 2, liquidTopY);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.stroke();


  // Valve and gauge
  const valveWidth = bodyWidth * 0.33;
  const valveHeight = bodyHeight * 0.18;
  const valveX = centerX - valveWidth / 2;
  const valveY = bodyTop - valveHeight - 65;

  const archPeakY = bodyTop - ellipseHeight;

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.moveTo(centerX, valveY + valveHeight);  // bottom center of head
  ctx.lineTo(centerX, archPeakY);             // top center of body
  ctx.stroke();

  ctx.fillStyle = 'white';
  ctx.fillRect(valveX, valveY, valveWidth, valveHeight);
  ctx.strokeRect(valveX, valveY, valveWidth, valveHeight);

  ctx.beginPath();
  for (let x = valveX + 2; x <= valveX + valveWidth - 2; x += 3) {
    ctx.moveTo(x, valveY);
    ctx.lineTo(x, valveY + valveHeight);
  }
  ctx.stroke();

  const gaugeRadius = valveHeight * 0.2;
  const gaugeX = valveX + valveWidth - gaugeRadius - 4;
  const gaugeY = valveY + valveHeight / 2;

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


function drawGraph(ctx, centerX, canvasHeight, data, mode, sprayTime) {
  // 1) Match chart height to cylinder total height (body + dome)
  const bodyHeight = canvasHeight * 0.6;
  const bodyWidth = bodyHeight * 0.3;
  const domeRadiusY = bodyWidth / 2;
  const chartHeight = bodyHeight + domeRadiusY;
  // keep your original aspect ratio (0.7 wide per 0.5 tall)
  const chartWidth = chartHeight * (0.55 / 0.5);

  // 2) Margins & inner size
  const margin = { top: 50, left: 60, right: 60, bottom: 40 };
  const width = chartWidth - margin.left - margin.right;
  const height = chartHeight - margin.top - margin.bottom;

  // 3) Position the chart so it’s centered next to the cylinder
  const xBase = centerX - chartWidth / 2 - 10;
  const yBase = (canvasHeight - chartHeight) / 2;

  // 4) Choose which curves to draw
  const times = data.time;
  let curves = [], colors = [], styles = [], labels = [];
  if (mode === 'volume') {
    curves = [data.vL, data.vV];
    colors = ['orange', 'orange'];
    styles = ['solid', 'dashed'];
    labels = ['liquid', 'vapor'];
  } else if (mode === 'moles') {
    curves = [data.nL, data.nV];
    colors = ['purple', 'purple'];
    styles = ['solid', 'dashed'];
    labels = ['liquid', 'vapor'];
  } else if (mode === 'temperature') {
    curves = [data.T.map(t => t - 273.15)];
    colors = ['black'];
    styles = ['solid'];
    labels = ['temperature'];
  } else { // pressure
    curves = [data.P];
    colors = ['blue'];
    styles = ['solid'];
    labels = ['pressure'];
  }

  // 5) Build scales
  const maxY = Math.max(...curves.flat()) * 1.1;
  const maxX = Math.max(...times);
  const scaleX = width / maxX;
  const scaleY = height / maxY;
  const x = t => xBase + margin.left + t * scaleX;
  const y = v => yBase + margin.top + height - v * scaleY;

  // 6) Draw axes rectangle
  ctx.strokeStyle = 'black';
  ctx.strokeRect(xBase + margin.left, yBase + margin.top, width, height);

  // 7) Y-axis label
  ctx.save();
  ctx.translate(xBase + 15, yBase + margin.top + height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = 'black';
  ctx.font = '14px sans-serif';
  const yLabel = mode === 'volume' ? 'volume (L)'
    : mode === 'moles' ? 'moles'
      : mode === 'temperature' ? 'temperature (K)'
        : 'pressure (bar)';
  ctx.fillText(yLabel, 0, 0);
  ctx.restore();

  // 8) X-axis label (centered)
  ctx.fillStyle = 'black';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    'time (s)',
    xBase + margin.left + width / 2,
    yBase + margin.top + height + 30
  );

  // 9) Initial Pᵢ, Tᵢ annotation
  const Pi = data.P0.toFixed(2);
  const Ti = (data.T0 - 273.15).toFixed(1);

  ctx.font = 'italic 14px serif';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.fillText(
    `Pᵢ = ${Pi} bar   Tᵢ = ${Ti} °C`,
    xBase + chartWidth / 2,                         // horizontally centered
    yBase + margin.top - 10                       // just above the plot
  );

  // 10) Draw Y-ticks and labels
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  for (let v = 0; v <= maxY; v += maxY / 5) {
    const yy = y(v);
    ctx.beginPath();
    ctx.moveTo(xBase + margin.left - 5, yy);
    ctx.lineTo(xBase + margin.left, yy);
    ctx.stroke();
    ctx.fillText(v.toFixed(1), xBase + margin.left - 8, yy + 4);
  }

  // 11) Draw X-ticks and labels
  let interval = sprayTime < 40 ? 5
    : sprayTime < 80 ? 10
      : sprayTime < 150 ? 20
        : 50;
  ctx.textAlign = 'center';
  for (let t = 0; t <= sprayTime; t += interval) {
    const xx = x(t);
    ctx.beginPath();
    ctx.moveTo(xx, yBase + margin.top + height);
    ctx.lineTo(xx, yBase + margin.top + height + 5);
    ctx.stroke();
    ctx.fillText(t.toString(), xx, yBase + margin.top + height + 20);
  }

  // 12) Plot each curve
  curves.forEach((curve, idx) => {
    ctx.strokeStyle = colors[idx];
    ctx.setLineDash(styles[idx] === 'dashed' ? [5, 3] : []);
    ctx.beginPath();
    ctx.moveTo(x(times[0]), y(curve[0]));
    for (let i = 1; i < times.length; i++) {
      ctx.lineTo(x(times[i]), y(curve[i]));
    }
    ctx.stroke();

    // mid-curve label
    const mid = Math.floor(curve.length / 2);
    ctx.textAlign = 'left';
    ctx.fillText(labels[idx], x(times[mid]) + 5, y(curve[mid]) - 5);

    // starting dot
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x(times[0]), y(curve[0]), 4, 0, 2 * Math.PI);
    ctx.fill();
  });
}
