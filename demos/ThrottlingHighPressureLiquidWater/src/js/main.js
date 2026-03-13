import { computeThrottling } from './waterProps.js';

const DEFAULTS = Object.freeze({
  T1C: 227,
  P2MPa: 0.5
});

// Map the original Mathematica drawing coordinates:
// x ∈ [-1, 9.1], y ∈ [-3.5, 4]  →  SVG viewBox pixels (1100×700).
const DRAWING = Object.freeze({
  xMin: -1,
  yMax: 4,
  scale: 90,
  x0: 80,
  y0: 70
});

const PIPE_GEOMETRY = Object.freeze({
  // Reduce the visible pipe diameter by scaling y-values for y <= 0
  yCenter: -1.5,
  yScale: 0.5
});

const VALVE_GEOMETRY = Object.freeze({
  // Reduce the width of the valve throat/hole around x = 4
  holeCenterX: 4,
  holeWidth: 0.3,
  bodyWall: 0.3
});

const VALVE_MOTION = Object.freeze({
  // Overall stroke (smaller = less motion)
  stroke: 1
});

const TEMP_GAUGE = Object.freeze({
  leftX: 280,
  rightX: 780,
  y: 340 + DRAWING.y0,
  scale: 0.7,
  width: 200,
  height: 78,
  radius: 10,
  screenW: 130,
  screenH: 50,
  screenOffsetX: -20,
  valueTextSize: 34,
  unitTextSize: 40,
  valueColor: '#ffe94d'
});

const PRESSURE_GAUGE = Object.freeze({
  leftX: 120,
  rightX: 935,
  y: 300 + DRAWING.y0,
  scale: 0.7,
  min: 0.1,
  max: 2.0,
  step: 0.1,
  width: 170,
  height: 110,
  radius: 10,
  screenW: 90,
  screenH: 50,
  screenOffsetX: -30,
  valueTextSize: 34,
  unitTextSize: 26
});
function clampNumber(x, min, max) {
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, x));
}

function pipeY(y) {
  if (y > 0) return y;
  return PIPE_GEOMETRY.yCenter + (y - PIPE_GEOMETRY.yCenter) * PIPE_GEOMETRY.yScale;
}

function toPx(x, y) {
  const { xMin, yMax, scale, x0, y0 } = DRAWING;
  const px = x0 + scale * (x - xMin);
  const py = y0 + scale * (yMax - y);
  return [px, py];
}

function toPipePx(x, y) {
  return toPx(x, pipeY(y));
}

function pointsToPath(points) {
  if (!points?.length) return '';
  const [x0, y0] = points[0];
  let d = `M ${x0} ${y0}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    d += ` L ${x} ${y}`;
  }
  return `${d} Z`;
}

function buildSpringPoints({ xCenter, yCenter, length = 3.1, amplitude = 0.1, segments = 100 }) {
  const yStart = yCenter - length / 2;
  const yEnd = yCenter + length / 2;
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const y = yStart + (yEnd - yStart) * t;
    const x = xCenter + amplitude * Math.sin(i * Math.PI / 2);
    pts.push(toPx(x, y));
  }
  return pts;
}

let controlsReady = false;
const dom = {};
const svgEls = {};
let outletPressureMPa = DEFAULTS.P2MPa;

export function drawFigure(draw) {
  svgEls.draw = draw;
  buildScene(draw);
  setupControls();
  updateSimulation();
}

function setupControls() {
  if (controlsReady) return;

  dom.inletTempSlider = document.getElementById('inletTempSlider');
  dom.inletTempValue = document.getElementById('inletTempValue');

  if (dom.inletTempSlider) dom.inletTempSlider.value = `${DEFAULTS.T1C}`;

  dom.inletTempSlider?.addEventListener('input', updateSimulation);

  controlsReady = true;
}

function getInputs() {
  const T1C = parseFloat(dom.inletTempSlider?.value);
  const P2MPa = outletPressureMPa;

  return {
    T1C: Number.isFinite(T1C) ? T1C : DEFAULTS.T1C,
    P2MPa: Number.isFinite(P2MPa) ? P2MPa : DEFAULTS.P2MPa
  };
}

function updateSimulation() {
  const { T1C, P2MPa } = getInputs();

  if (dom.inletTempValue) dom.inletTempValue.textContent = `${Math.round(T1C)}`;

  const model = computeThrottling({ T1C, P2MPa });
  updateDiagram(model);
}

function buildScene(draw) {
  const g = draw.group();
  svgEls.root = g;

  const holeHalf = VALVE_GEOMETRY.holeWidth / 2;
  const holeLeft = VALVE_GEOMETRY.holeCenterX - holeHalf;
  const holeRight = VALVE_GEOMETRY.holeCenterX + holeHalf;
  const bodyHalf = holeHalf + VALVE_GEOMETRY.bodyWall;
  const bodyLeft = VALVE_GEOMETRY.holeCenterX - bodyHalf;
  const bodyRight = VALVE_GEOMETRY.holeCenterX + bodyHalf;

  // Filled water region: split left/right so right side can change opacity.
  const waterLeft = [
    [-1, 0],
    [bodyLeft, 0],
    [bodyLeft, 1.5],
    [VALVE_GEOMETRY.holeCenterX + 0.05, 1.5],
    [VALVE_GEOMETRY.holeCenterX + 0.05, -3],
    [-1, -3]
  ].map(([x, y]) => toPipePx(x, y));

  const waterRight = [
    [VALVE_GEOMETRY.holeCenterX - 0.05, 1.5],
    [bodyRight, 1.5],
    [bodyRight, 0],
    [9, 0],
    [9, -3],
    [VALVE_GEOMETRY.holeCenterX - 0.05, -3]
  ].map(([x, y]) => toPipePx(x, y));

  svgEls.waterLeft = g.polygon(waterLeft).fill('#f77f7f').stroke({ width: 0 });
  svgEls.waterRight = g.polygon(waterRight).fill('#f77f7f').stroke({ width: 0 });

  function dataX(px) { return DRAWING.xMin + (px - DRAWING.x0) / DRAWING.scale; }
  const stemW = 25;
  const lsl = dataX(toPipePx(-1, 0)[0] + 30);
  const lsr = dataX(toPipePx(-1, 0)[0] + 30 + stemW);
  const rsl = dataX(toPipePx(9, 0)[0] - 30 - stemW);
  const rsr = dataX(toPipePx(9, 0)[0] - 30);

  // Pipe body left of left flange
  const pipeUpperLeft = [
    [-1, 0],
    [lsl, 0],
    [lsl, -0.5],
    [-1, -0.5]
  ].map(([x, y]) => toPipePx(x, y));

  // Pipe body between left and right flanges
  const pipeUpperMid = [
    [lsr, 0],
    [bodyLeft, 0],
    [bodyLeft, 1.5],
    [bodyRight, 1.5],
    [bodyRight, 0],
    [rsl, 0],
    [rsl, -0.5],
    [holeRight, -0.5],
    [holeRight, 1],
    [holeLeft, 1],
    [holeLeft, -1.5],
    [bodyLeft, -1.5],
    [bodyLeft, -0.5],
    [lsr, -0.5]
  ].map(([x, y]) => toPipePx(x, y));

  // Pipe body right of right flange
  const pipeUpperRight = [
    [rsr, 0],
    [9, 0],
    [9, -0.5],
    [rsr, -0.5]
  ].map(([x, y]) => toPipePx(x, y));

  const pipeStyle = { fill: '#b3b3b3', stroke: { color: '#000', width: 2 } };
  g.polygon(pipeUpperLeft).attr(pipeStyle);
  g.polygon(pipeUpperMid).attr(pipeStyle);
  g.polygon(pipeUpperRight).attr(pipeStyle);

  const pipeLower = [
    [-1, -3],
    [holeRight, -3],
    [holeRight, -1.5],
    [bodyRight, -1.5],
    [bodyRight, -3],
    [9, -3],
    [9, -3.5],
    [-1, -3.5],
    [-1, -3]
  ].map(([x, y]) => toPipePx(x, y));

  g.path(pointsToPath(pipeLower))
    .fill('#b3b3b3')
    .stroke({ color: '#000', width: 2 });

  addSideFlanges(g);

  // Static chart label.
  const [chartLabelX, chartLabelY] = toPx(7, 3.85);
  g.text('fraction of liquid and vapor exiting')
    .font({ size: 18, family: 'Arial', anchor: 'middle' })
    .center(chartLabelX, chartLabelY);

  buildBarChart(g);
  buildStateText(g);
  buildValveAssembly(g);
  buildTempGauges(g);
  buildPressureGauges(g);
}

function buildTempGauges(group) {
  svgEls.tempLeft = drawTempGauge(group, TEMP_GAUGE.leftX, TEMP_GAUGE.y, false);
  svgEls.tempRight = drawTempGauge(group, TEMP_GAUGE.rightX, TEMP_GAUGE.y, true);
}

function drawTempGauge(group, x, y, flip = false) {
  const g = group.group();
  g.translate(x, y);
  g.scale(TEMP_GAUGE.scale);
  // if (flip) g.scale(-1, 1);

  const {
    width,
    height,
    radius,
    screenW,
    screenH,
    screenOffsetX,
    valueTextSize,
    unitTextSize,
    valueColor
  } = TEMP_GAUGE;

  // Body
  g.rect(width, height)
    .center(0, 0)
    .fill('#8c8c8c')
    .radius(radius)
    .stroke({ color: '#000', width: 2 });

  // Screen
  g.rect(screenW, screenH)
    .center(screenOffsetX, 0)
    .fill('#111')
    .stroke({ color: '#000', width: 1.5 });

  const valueText = g.text('--')
    .font({ size: valueTextSize, family: 'Arial', anchor: 'middle' })
    .fill(valueColor)
    .center(screenOffsetX, 2);

  const unitText = g.text('°C')
    .font({ size: unitTextSize, family: 'Arial', anchor: 'middle' })
    .fill('#000')
    .center(screenOffsetX + screenW / 2 + 25, 4);

  // Wire + entry + probe (match reference style)
  const wire = g.group();
  wire.stroke({ color: '#000', width: 2 }).fill('none');
  // vertical down, bend, horizontal into entry
  wire.path('M -20 20 V 20 Q -80 100 -50 100 H -20 V 120');

  // Entry block on pipe top
  g.rect(34, 12)
    .center(-20, 120)
    .fill('#7f7f7f')
    .stroke({ color: '#000', width: 1.5 });

  // Probe stem
  g.line(-20, 62 + 60, -20, 120 + 60)
    .stroke({ color: '#000', width: 2 });

  // Probe tip (gold)
  g.rect(6, 26)
    .center(-20, 135 + 55)
    .fill('#bba53d')
    .radius(3)
    .stroke({ color: '#000', width: 1 });

  return { group: g, valueText, unitText };
}

function buildPressureGauges(group) {
  svgEls.pressureLeft = drawPressureGauge(group, PRESSURE_GAUGE.leftX, PRESSURE_GAUGE.y, false);
  svgEls.pressureRight = drawPressureGauge(group, PRESSURE_GAUGE.rightX, PRESSURE_GAUGE.y, true);
}

function drawPressureGauge(group, x, y, editable = false) {
  const g = group.group();
  g.translate(x, y);
  g.scale(PRESSURE_GAUGE.scale);

  const {
    width,
    height,
    radius,
    screenW,
    screenH,
    screenOffsetX,
    valueTextSize,
    unitTextSize
  } = PRESSURE_GAUGE;

  g.rect(width, height)
    .center(0, 0)
    .fill('#8c8c8c')
    .radius(radius)
    .stroke({ color: '#000', width: 2 });

  g.rect(screenW, screenH)
    .center(screenOffsetX, -6)
    .fill('#111')
    .stroke({ color: '#000', width: 1.5 });

  const valueText = g.text('--')
    .font({ size: valueTextSize, family: 'Arial', anchor: 'middle' })
    .fill('#ffe94d')
    .center(screenOffsetX, -6);

  const unitText = g.text('MPa')
    .font({ size: unitTextSize, family: 'Arial', anchor: 'middle' })
    .fill('#000')
    .center(screenOffsetX + screenW / 2 + 34, -6);

  if (editable) {
    const btnSize = 24;
    const btnY = 25;
    const btnGap = 15;
    const btnLeftX = -30;
    const btnRightX = btnLeftX + btnSize + btnGap;

    const downBtn = g.rect(btnSize, btnSize)
      .move(btnLeftX, btnY)
      .fill('#e22')
      .radius(4)
      .stroke({ color: '#000', width: 1.5 });
    g.polygon([[btnLeftX + btnSize / 2, btnY + btnSize - 6], [btnLeftX + 5, btnY + 7], [btnLeftX + btnSize - 5, btnY + 7]])
      .fill('#fff');

    const upBtn = g.rect(btnSize, btnSize)
      .move(btnRightX, btnY)
      .fill('#e22')
      .radius(4)
      .stroke({ color: '#000', width: 1.5 });
    g.polygon([[btnRightX + btnSize / 2, btnY + 6], [btnRightX + 5, btnY + btnSize - 7], [btnRightX + btnSize - 5, btnY + btnSize - 7]])
      .fill('#fff');

    upBtn.attr({ cursor: 'pointer' });
    downBtn.attr({ cursor: 'pointer' });
    upBtn.on('click', (evt) => {
      evt.preventDefault();
      nudgeOutletPressure(0.1);
    });
    downBtn.on('click', (evt) => {
      evt.preventDefault();
      nudgeOutletPressure(-0.1);
    });
  }

  return { group: g, valueText, unitText };
}

function nudgeOutletPressure(delta) {
  const min = PRESSURE_GAUGE.min;
  const max = PRESSURE_GAUGE.max;
  const step = PRESSURE_GAUGE.step;
  const next = clampNumber(outletPressureMPa + delta, min, max);
  const snapped = Math.round(next / step) * step;
  outletPressureMPa = snapped;
  updateSimulation();
}
function addSideFlanges(group) {
  const endOffsetPx = 30;
  const stemW = 25;
  const stemH = 70;
  const flangeW = 60;
  const flangeH = 14;
  const boltSize = 8;
  const waterFill = '#f77f7f';

  const pipeTopY = toPipePx(0, 0)[1];
  const leftEndX = toPipePx(-1, 0)[0];
  const rightEndX = toPipePx(9, 0)[0];

  const stemY = pipeTopY - stemH;
  const flangeY = stemY + 14;

  function drawFlange(stemX, storeFill) {
    group.polyline([
      [stemX, pipeTopY],
      [stemX, stemY],
      [stemX + stemW, stemY],
      [stemX + stemW, pipeTopY]
    ]).fill('#fff').stroke({ color: '#000', width: 2 });

    const waterStartY = pipeTopY - 50;
    const waterH = pipeTopY - waterStartY;

    const waterRect = group.rect(stemW, waterH + 0.3)
      .move(stemX, waterStartY)
      .fill(waterFill)
      .stroke({ width: 0 });

    if (storeFill) {
      svgEls.waterRightFlange = waterRect;
    } else {
      svgEls.waterLeftFlange = waterRect;
    }

    const flangeX = stemX - (flangeW - stemW) / 2;
    group.rect(flangeW, flangeH)
      .move(flangeX, flangeY)
      .fill('#b3b3b3')
      .stroke({ color: '#000', width: 2 });

    group.rect(flangeW, flangeH)
      .move(flangeX, flangeY - flangeH)
      .fill('#b3b3b3')
      .stroke({ color: '#000', width: 2 });

    group.rect(flangeW - 40, flangeH + 5)
      .move(flangeX + 20, flangeY - flangeH - 20)
      .fill('#000')
      .stroke({ color: '#000', width: 2 });

    const boltY = flangeY + (flangeH - boltSize) / 2;
    group.rect(boltSize, boltSize)
      .move(flangeX + 6, boltY + 0.9 * flangeH)
      .fill('#555')
      .stroke({ color: '#000', width: 1.5 });
    group.rect(boltSize, boltSize)
      .move(flangeX + flangeW - boltSize - 6, boltY + 0.9 * flangeH)
      .fill('#555')
      .stroke({ color: '#000', width: 1.5 });

    group.rect(boltSize, boltSize)
      .move(flangeX + 6, boltY - 1.8 * flangeH)
      .fill('#555')
      .stroke({ color: '#000', width: 1.5 });
    group.rect(boltSize, boltSize)
      .move(flangeX + flangeW - boltSize - 6, boltY - 1.8 * flangeH)
      .fill('#555')
      .stroke({ color: '#000', width: 1.5 });
  }

  const leftStemX = leftEndX + endOffsetPx;
  const rightStemX = rightEndX - endOffsetPx - stemW;

  drawFlange(leftStemX, false);
  drawFlange(rightStemX, true);
}

function buildBarChart(group) {
  const chartSize = 220;
  const [cx, cy] = toPx(7.2, 1.8);
  const x = cx - chartSize / 2;
  const y = cy - chartSize / 2 - 60;

  const chart = group.group();
  chart.rect(chartSize, chartSize).move(x, y).fill('#fff').stroke({ color: '#000', width: 2 });

  const pad = 18;
  const labelSpace = 44;
  const innerW = chartSize - pad * 2 - labelSpace;
  const innerH = chartSize - pad * 2;

  const barGap = innerW * 0.12;
  const barW = (innerW - barGap) / 2;
  const barBaseY = y + pad + innerH;
  const axisX = x + pad + labelSpace - 6;
  const leftX = axisX + 10;
  const rightX = leftX + barW + barGap;

  svgEls.chart = {
    pad,
    innerW,
    innerH,
    leftX,
    rightX,
    barW,
    barBaseY,
    axisX,
    chartTopY: y,
    chartLeftX: x
  };

  // Y-axis with ticks and labels (0.0 to 1.0)
  chart.line(axisX, y + pad, axisX, barBaseY)
    .stroke({ color: '#666', width: 2 });

  const tickValues = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  tickValues.forEach((val) => {
    const ty = barBaseY - val * innerH;
    chart.line(axisX, ty, axisX + 6, ty).stroke({ color: '#666', width: 2 });
    chart.text(val.toFixed(1))
      .font({ size: 18, family: 'Arial', anchor: 'end', weight: 600 })
      .fill('#000')
      .attr({ x: axisX - 8, y: ty + 6 });
  });

  svgEls.liquidBar = chart.rect(barW, 1).move(leftX, barBaseY - 1).fill('rgb(89,153,255)').stroke({ width: 0 });
  svgEls.vaporBar = chart.rect(barW, 1).move(rightX, barBaseY - 1).fill('rgb(0,153,0)').stroke({ width: 0 });

  svgEls.liquidBarLabel = chart.text('liquid')
    .font({ size: 16, family: 'Arial', anchor: 'middle' })
    .center(leftX + barW / 2, barBaseY - innerH / 2);

  svgEls.vaporBarLabel = chart.text('')
    .font({ size: 16, family: 'Arial', anchor: 'middle' })
    .center(rightX + barW / 2, barBaseY - innerH / 2);
}

function buildStateText(group) {
  const stateFont = { size: 22, family: 'Arial', anchor: 'middle' };
  const lineSpacing = 26;

  const [s1x, s1y] = toPx(1, -1.85);
  const s1 = group.group();
  // svgEls.state1P = s1.text('').font(stateFont).center(s1x, s1y - lineSpacing);
  // svgEls.state1T = s1.text('').font(stateFont).center(s1x, s1y);
  svgEls.state1Phase = s1.text('').font(stateFont).center(s1x, s1y);

  const [s2x, s2y] = toPx(7, -1.85);
  const s2 = group.group();
  // svgEls.state2P = s2.text('').font(stateFont).center(s2x, s2y - lineSpacing);
  // svgEls.state2T = s2.text('').font(stateFont).center(s2x, s2y);
  svgEls.state2Phase = s2.text('').font(stateFont).center(s2x, s2y);
}

function buildValveAssembly(group) {
  // Dynamic assembly parts that shift slightly with outlet pressure (to mimic the original Demonstration).
  const dyn = group.group();
  svgEls.valveGroup = dyn;

  svgEls.springPath = dyn.polyline([]).fill('none').stroke({ color: '#666', width: 3, linecap: 'round', linejoin: 'round' });

  svgEls.valvePlug = dyn.polygon('0,0 0,0 0,0').fill('#d9d9d9').stroke({ color: '#000', width: 2 });

  svgEls.pistonLine = dyn.line(0, 0, 0, 0).stroke({ color: '#666', width: 8, linecap: 'round' });
  svgEls.pistonPlate = dyn.polygon('0,0 0,0 0,0').fill('#d9d9d9').stroke({ color: '#000', width: 2 });
}

function updateDiagram(model) {
  const { P1MPa, T1C, P2MPa, T2C, quality, phase1, phase2 } = model;

  // State text
  if (svgEls.state1P) svgEls.state1P.text(`P₁ = ${Number(P1MPa).toFixed(0)} MPa`);
  if (svgEls.state1T) svgEls.state1T.text(`T₁ = ${Math.round(T1C)} °C`);
  if (svgEls.state1Phase) svgEls.state1Phase.text(phase1);

  if (svgEls.state2P) svgEls.state2P.text(`P₂ = ${Number(P2MPa).toFixed(1)} MPa`);
  if (svgEls.state2T) svgEls.state2T.text(`T₂ = ${Math.round(T2C)} °C`);
  if (svgEls.state2Phase) svgEls.state2Phase.text(phase2);

  // Bar chart
  const liquidFrac = clampNumber(1 - quality, 0, 1);
  const vaporFrac = clampNumber(quality, 0, 1);

  const { innerH, leftX, rightX, barW, barBaseY } = svgEls.chart;
  const liquidH = Math.max(1, liquidFrac * innerH);
  const vaporH = Math.max(1, vaporFrac * innerH);

  svgEls.liquidBar.height(liquidH).move(leftX, barBaseY - liquidH);
  svgEls.vaporBar.height(vaporH).move(rightX, barBaseY - vaporH);

  svgEls.liquidBarLabel.center(leftX + barW / 2, barBaseY - liquidH / 2);
  const vaporLabel = vaporFrac > 0.08 ? 'vapor' : '';
  svgEls.vaporBarLabel.text(vaporLabel);
  svgEls.vaporBarLabel.center(rightX + barW / 2, barBaseY - vaporH / 2);

  if (svgEls.waterRight) {
    const opacity = clampNumber(1 - vaporFrac, 0, 1);
    svgEls.waterRight.opacity(opacity);
  }
  if (svgEls.waterLeft) {
    svgEls.waterLeft.opacity(1);
  }
  if (svgEls.waterRightFlange) {
    const opacity = clampNumber(1 - vaporFrac, 0, 1);
    svgEls.waterRightFlange.opacity(opacity);
  }
  if (svgEls.waterLeftFlange) {
    svgEls.waterLeftFlange.opacity(1);
  }

  // Dynamic valve/piston shift with outlet pressure (small range, per original code rescaling).
  const step = clampNumber((P2MPa - 0.1) / (9 - 0.1), 0, 1);
  const yOffset = step * VALVE_MOTION.stroke;
  const plugYOffset = yOffset / PIPE_GEOMETRY.yScale;

  const holeHalf = VALVE_GEOMETRY.holeWidth / 2;
  const holeLeft = VALVE_GEOMETRY.holeCenterX - holeHalf;
  const holeRight = VALVE_GEOMETRY.holeCenterX + holeHalf;
  const bodyHalf = holeHalf + VALVE_GEOMETRY.bodyWall;
  const bodyLeft = VALVE_GEOMETRY.holeCenterX - bodyHalf;
  const bodyRight = VALVE_GEOMETRY.holeCenterX + bodyHalf;
  const plugBottomHalf = VALVE_GEOMETRY.holeWidth / 4;

  // Valve plug
  const plugPts = [
    [holeLeft, -0.75 + plugYOffset],
    [holeRight, -0.75 + plugYOffset],
    [VALVE_GEOMETRY.holeCenterX + plugBottomHalf, -1.5 + plugYOffset],
    [VALVE_GEOMETRY.holeCenterX - plugBottomHalf, -1.5 + plugYOffset]
  ].map(([x, y]) => toPipePx(x, y));
  svgEls.valvePlug.plot(plugPts);

  // Piston small line
  const [lx1, ly1] = toPx(4, 2.1 + yOffset);
  const [lx2, ly2] = toPx(4, 2.1 + yOffset);
  svgEls.pistonLine.plot(lx1, ly1, lx2, ly2);

  // Top plate
  const platePts = [
    [bodyLeft, 1.95 + yOffset],
    [bodyRight, 1.95 + yOffset],
    [bodyRight + 0.2, 2.1 + yOffset],
    [bodyLeft - 0.2, 2.1 + yOffset]
  ].map(([x, y]) => toPx(x, y));
  svgEls.pistonPlate.plot(platePts);

  // Spring
  const springPts = buildSpringPoints({ xCenter: 4, yCenter: yOffset + 0.4 });
  svgEls.springPath.plot(springPts);

  if (svgEls.tempLeft?.valueText) {
    svgEls.tempLeft.valueText.text(Math.round(T1C).toString());
  }
  if (svgEls.tempRight?.valueText) {
    svgEls.tempRight.valueText.text(Math.round(T2C).toString());
  }

  if (svgEls.pressureLeft?.valueText) {
    svgEls.pressureLeft.valueText.text(P1MPa.toFixed(1));
  }
  if (svgEls.pressureRight?.valueText) {
    svgEls.pressureRight.valueText.text(P2MPa.toFixed(1));
  }
}
