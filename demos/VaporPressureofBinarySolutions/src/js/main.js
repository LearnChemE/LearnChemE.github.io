import * as config from './config.js';

const padding = { top: 60, right: 90, bottom: 90, left: 110 };
const defaults = { paSat: 250, pbSat: 150, gamma: 0, showHenry: false };
const plotColors = {
  idealA: '#9cc3ff',
  idealB: '#a0e4ba',
  idealTotal: '#333333',
  actualA: '#4e88ff',
  actualB: '#27a659',
  actualTotal: '#111111',
  henry: '#cf2b2b'
};

let drawRef;
let axisLayer;
let plotLayer;
let hoverLayer;
let hoverMarker;
let tooltipEl;
let controlsReady = false;
let hoverState = { scales: null, params: null, area: null };
let hoverAttached = false;

const elements = {};

export function drawFigure(svg) {
  drawRef = svg;
  axisLayer = svg.group().id('axis-layer');
  plotLayer = svg.group().id('plot-layer');
  hoverLayer = svg.group().id('hover-layer');
  hoverMarker = hoverLayer.circle(10)
    .fill('#fff')
    .stroke({ color: '#000', width: 2 })
    .hide();
  hoverLayer.front();
  initTooltip();
  attachHoverHandlers();
  setupControls();
  renderPlot();
}

export function reset() {
  if (!controlsReady) return;
  syncControls(defaults);
}

function setupControls() {
  if (controlsReady) return;
  elements.paSlider = document.getElementById('paSatSlider');
  elements.pbSlider = document.getElementById('pbSatSlider');
  elements.gammaSlider = document.getElementById('gammaSlider');
  elements.henryToggle = document.getElementById('henryToggle');
  elements.paValue = document.getElementById('paSatValue');
  elements.pbValue = document.getElementById('pbSatValue');
  elements.gammaValue = document.getElementById('gammaValue');

  if (!elements.paSlider || !elements.pbSlider || !elements.gammaSlider) return;

  const handleInput = () => renderPlot();
  [elements.paSlider, elements.pbSlider].forEach((slider) => {
    slider.addEventListener('input', handleInput);
  });
  elements.gammaSlider.addEventListener('input', handleInput);
  elements.henryToggle.addEventListener('change', handleInput);

  syncControls(defaults);
  controlsReady = true;
}

function syncControls(values) {
  if (elements.paSlider) elements.paSlider.value = values.paSat;
  if (elements.pbSlider) elements.pbSlider.value = values.pbSat;
  if (elements.gammaSlider) elements.gammaSlider.value = values.gamma;
  if (elements.henryToggle) elements.henryToggle.checked = values.showHenry;
  updateOutputs(values);
}

function getParams() {
  return {
    paSat: parseFloat(elements.paSlider?.value ?? defaults.paSat),
    pbSat: parseFloat(elements.pbSlider?.value ?? defaults.pbSat),
    gamma: parseFloat(elements.gammaSlider?.value ?? defaults.gamma),
    showHenry: Boolean(elements.henryToggle?.checked)
  };
}

function updateOutputs({ paSat, pbSat, gamma }) {
  if (elements.paValue) elements.paValue.textContent = Math.round(paSat).toString();
  if (elements.pbValue) elements.pbValue.textContent = Math.round(pbSat).toString();
  if (elements.gammaValue) elements.gammaValue.textContent = gamma.toFixed(1);
}

function renderPlot() {
  if (!drawRef || !elements.paSlider) return;
  const params = getParams();
  updateOutputs(params);
  const chartArea = getChartArea();
  const maxVal = computeCurveMaximum(params);
  const { axisMax, tickStep } = buildYAxisScale(maxVal);
  const scales = buildScales(chartArea, axisMax);
  hoverState = { scales, params, area: chartArea };

  axisLayer.clear();
  plotLayer.clear();
  drawAxes(chartArea, scales, axisMax, tickStep);
  drawCurves(params, scales);
  drawHenryCurves(params, scales);
  drawSaturationMarkers(params, scales, chartArea);
  if (hoverLayer) hoverLayer.front();
  hideTooltip();
}

function getChartArea() {
  return {
    x: padding.left,
    y: padding.top,
    width: config.canvasWidth - padding.left - padding.right,
    height: config.canvasHeight - padding.top - padding.bottom
  };
}

function buildScales(area, axisMax) {
  return {
    x: (value) => area.x + value * area.width,
    y: (value) => area.y + area.height - (value / axisMax) * area.height,
    axisMax
  };
}

function computeCurveMaximum(params) {
  const curves = [
    { fn: (x) => paIdeal(params, x) },
    { fn: (x) => pbIdeal(params, x) },
    { fn: (x) => paIdeal(params, x) + pbIdeal(params, x) },
    { fn: (x) => paActual(params, x) },
    { fn: (x) => pbActual(params, x) },
    { fn: (x) => paActual(params, x) + pbActual(params, x) }
  ];

  if (params.showHenry) {
    curves.push(
      { fn: (x) => henryA(params, x), start: 0, end: 0.3 },
      { fn: (x) => henryB(params, x), start: 0.7, end: 1 }
    );
  }

  let maxVal = Math.max(params.paSat, params.pbSat);
  curves.forEach(({ fn, start = 0, end = 1, steps = 250 }) => {
    const val = sampleMax(fn, start, end, steps);
    if (Number.isFinite(val)) maxVal = Math.max(maxVal, val);
  });

  return maxVal;
}

function buildYAxisScale(maxValue) {
  const sanitizedMax = Math.max(maxValue, 1);
  const axisMax = sanitizedMax;
  const tickStep = niceNumber(axisMax / 5 || 1);
  return { axisMax, tickStep: tickStep || 1 };
}

function niceNumber(value) {
  if (value <= 0 || !Number.isFinite(value)) return 10;
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;
  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;
  return niceFraction * Math.pow(10, exponent);
}

function drawAxes(area, scales, axisMax, tickStep) {
  axisLayer.rect(area.width, area.height)
    .fill('none')
    .stroke({ color: '#000', width: 1 })
    .move(area.x, area.y);

  // X-axis ticks
  const moleTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
  moleTicks.forEach((value) => {
    const x = scales.x(value);
    axisLayer.line(x, area.y + area.height, x, area.y + area.height + 8)
      .stroke({ color: '#000', width: 1 });
    if (value > 0 && value < 1) {
      axisLayer.line(x, area.y, x, area.y + area.height)
        .stroke({ color: '#e0e0e0', width: 1 })
        .attr({ 'stroke-dasharray': '4,8' });
    }
    const label = axisLayer.text(formatFraction(value))
      .font({ size: 16, family: 'Helvetica, Arial, sans-serif', anchor: 'middle' })
      .move(x, area.y + area.height + 12);
    label.dy(8);
  });

  // Y-axis ticks
  const yTicks = [];
  for (let value = 0; value < axisMax - 1e-6; value += tickStep) {
    yTicks.push(value);
  }
  if (axisMax > 0) yTicks.push(axisMax);

  yTicks.forEach((value) => {
    const y = scales.y(value);
    axisLayer.line(area.x - 8, y, area.x, y).stroke({ color: '#000', width: 1 });
    axisLayer.text(value.toFixed(0))
      .font({ size: 16, family: 'Helvetica, Arial, sans-serif', anchor: 'end' })
      .move(area.x - 36, y - 10);
    axisLayer.line(area.x, y, area.x + area.width, y)
      .stroke({ color: '#e0e0e0', width: 1 })
      .attr({ 'stroke-dasharray': '6,6' });
  });

  drawAxisLabels(area);
}

function drawAxisLabels(area) {
  const labelFont = { size: 18, family: 'Helvetica, Arial, sans-serif' };
  const xLabel = axisLayer.text((add) => {
    add.tspan('mole fraction ');
    add.tspan('x').font({ style: 'italic' });
    add.tspan('B').font({ size: 12 }).dy(6);
  }).font({ ...labelFont, anchor: 'middle' });
  const xPos = area.x + area.width / 2;
  xLabel.center(xPos, area.y + area.height + 45);

  const yLabel = axisLayer.text((add) => {
    add.tspan('vapor pressure ');
    add.tspan('p').font({ style: 'italic' });
    add.tspan(' (torr)');
  }).font({ ...labelFont, anchor: 'middle' });
  yLabel.center(area.x - 70, area.y + area.height / 2);
  const labelBox = yLabel.bbox();
  yLabel.rotate(-90, labelBox.cx, labelBox.cy);
}

function drawCurves(params, scales) {
  const curves = [
    { fn: (x) => paIdeal(params, x), style: { color: plotColors.idealA, dash: '8,8', width: 2 } },
    { fn: (x) => pbIdeal(params, x), style: { color: plotColors.idealB, dash: '8,8', width: 2 } },
    { fn: (x) => paIdeal(params, x) + pbIdeal(params, x), style: { color: plotColors.idealTotal, dash: '6,6', width: 2.5 } },
    { fn: (x) => paActual(params, x), style: { color: plotColors.actualA, width: 3 } },
    { fn: (x) => pbActual(params, x), style: { color: plotColors.actualB, width: 3 } },
    { fn: (x) => paActual(params, x) + pbActual(params, x), style: { color: plotColors.actualTotal, width: 3.2 } }
  ];

  curves.forEach(({ fn, style }) => drawCurve(fn, scales, style));
}

function drawHenryCurves(params, scales) {
  if (!params.showHenry) return;
  drawCurve((x) => henryA(params, x), scales, {
    color: plotColors.henry,
    width: 2.5,
    dash: '6,6'
  }, 0, 0.3);
  drawCurve((x) => henryB(params, x), scales, {
    color: plotColors.henry,
    width: 2.5,
    dash: '6,6'
  }, 0.7, 1);
}

function drawCurve(fn, scales, style, start = 0, end = 1, steps = 250) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const x = start + (end - start) * (i / steps);
    const yVal = fn(x);
    if (!Number.isFinite(yVal)) continue;
    points.push([scales.x(x), scales.y(yVal)]);
  }
  if (!points.length) return;
  const pathData = points.map((point, idx) => `${idx === 0 ? 'M' : 'L'}${point[0]},${point[1]}`).join(' ');
  const path = plotLayer.path(pathData)
    .fill('none')
    .stroke({ color: style.color, width: style.width });
  if (style.dash) path.attr({ 'stroke-dasharray': style.dash });
}

function drawSaturationMarkers(params, scales, area) {
  const paPoint = { x: 0, y: params.paSat };
  const pbPoint = { x: 1, y: params.pbSat };

  [ { point: paPoint, color: plotColors.actualA }, { point: pbPoint, color: plotColors.actualB } ].forEach(({ point, color }) => {
    const circle = plotLayer.circle(12)
      .center(scales.x(point.x), scales.y(point.y))
      .fill(color)
      .stroke({ color: '#fff', width: 2 });
    circle.front();
  });

  const leftText = plotLayer.text((add) => {
    add.tspan('p').font({ style: 'italic' });
    add.tspan('A').font({ size: 14 }).dy(6);
    add.tspan('sat').font({ size: 14 }).dy(-10);
  }).font({ size: 16, family: 'Helvetica, Arial, sans-serif', anchor: 'start' });
  const leftY = clampLabelY(scales.y(paPoint.y), area);
  leftText.move(scales.x(0) + 12, leftY + 16);

  const rightText = plotLayer.text((add) => {
    add.tspan('p').font({ style: 'italic' });
    add.tspan('B').font({ size: 14 }).dy(6);
    add.tspan('sat').font({ size: 14 }).dy(-10);
  }).font({ size: 16, family: 'Helvetica, Arial, sans-serif', anchor: 'end' });
  const rightY = clampLabelY(scales.y(pbPoint.y), area);
  rightText.move(scales.x(1) - 42, rightY + 36);
}

function clampLabelY(y, area) {
  const topLimit = area.y + 10;
  const bottomLimit = area.y + area.height - 30;
  return Math.min(bottomLimit, Math.max(topLimit, y - 24));
}

function initTooltip() {
  if (tooltipEl) return;
  const container = document.getElementById('svg-container');
  if (!container) return;
  tooltipEl = document.createElement('div');
  tooltipEl.id = 'curve-tooltip';
  container.appendChild(tooltipEl);
}

function attachHoverHandlers() {
  if (hoverAttached || !drawRef || !drawRef.node) return;
  const node = drawRef.node;
  node.addEventListener('mousemove', handleHoverMove);
  node.addEventListener('mouseleave', hideTooltip);
  hoverAttached = true;
}

function handleHoverMove(event) {
  if (!hoverState.scales || !hoverState.area || !tooltipEl) return;
  const svgPoint = clientToSvgPoint(event);
  if (!svgPoint) return;
  const { area, params, scales } = hoverState;
  if (
    svgPoint.x < area.x ||
    svgPoint.x > area.x + area.width ||
    svgPoint.y < area.y ||
    svgPoint.y > area.y + area.height
  ) {
    hideTooltip();
    return;
  }
  const xFraction = (svgPoint.x - area.x) / area.width;
  const closest = findClosestCurve(params, xFraction, svgPoint, scales);
  if (!closest) {
    hideTooltip();
    return;
  }
  updateTooltip(closest);
}

function hideTooltip() {
  if (tooltipEl) {
    tooltipEl.classList.remove('curve-tooltip--visible');
  }
  if (hoverMarker) {
    hoverMarker.hide();
  }
}

function clientToSvgPoint(event) {
  if (!drawRef || !drawRef.node || !drawRef.node.getScreenCTM()) return null;
  const pt = drawRef.node.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  return pt.matrixTransform(drawRef.node.getScreenCTM().inverse());
}

function svgToClientCoords(x, y) {
  if (!drawRef || !drawRef.node || !drawRef.node.getScreenCTM()) return null;
  const pt = drawRef.node.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const transformed = pt.matrixTransform(drawRef.node.getScreenCTM());
  return { x: transformed.x, y: transformed.y };
}

function findClosestCurve(params, xFraction, svgPoint, scales) {
  const x = Math.min(1, Math.max(0, xFraction));
  const paActualVal = paActual(params, x);
  const pbActualVal = pbActual(params, x);
  const paIdealVal = paIdeal(params, x);
  const pbIdealVal = pbIdeal(params, x);

  const candidates = [
    { label: 'pA (actual)', color: plotColors.actualA, value: paActualVal },
    { label: 'pB (actual)', color: plotColors.actualB, value: pbActualVal },
    { label: 'total (actual)', color: plotColors.actualTotal, value: paActualVal + pbActualVal },
    { label: 'pA (ideal)', color: plotColors.idealA, value: paIdealVal },
    { label: 'pB (ideal)', color: plotColors.idealB, value: pbIdealVal },
    { label: 'total (ideal)', color: plotColors.idealTotal, value: paIdealVal + pbIdealVal }
  ];

  if (params.showHenry && x <= 0.3) {
    candidates.push({ label: 'pA (Henry)', color: plotColors.henry, value: henryA(params, x) });
  }
  if (params.showHenry && x >= 0.7) {
    candidates.push({ label: 'pB (Henry)', color: plotColors.henry, value: henryB(params, x) });
  }

  let closest = null;
  const sx = scales.x(x);
  candidates.forEach((candidate) => {
    if (!Number.isFinite(candidate.value) || candidate.value < 0) return;
    const sy = scales.y(candidate.value);
    const distance = Math.abs(svgPoint.y - sy);
    if (!closest || distance < closest.distance) {
      closest = {
        ...candidate,
        xValue: x,
        yValue: candidate.value,
        screenX: sx,
        screenY: sy,
        distance
      };
    }
  });

  return closest;
}

function updateTooltip(point) {
  if (!tooltipEl) return;
  tooltipEl.innerHTML = `${point.xValue.toFixed(2)}, ${point.yValue.toFixed(2)}`;
  tooltipEl.style.borderColor = point.color;
  tooltipEl.style.color = '#111';
  const clientCoords = svgToClientCoords(point.screenX, point.screenY);
  if (clientCoords) {
    positionTooltip(clientCoords.x, clientCoords.y);
  }
  tooltipEl.classList.add('curve-tooltip--visible');
  if (hoverMarker) {
    hoverMarker.center(point.screenX, point.screenY)
      .fill('#fff')
      .stroke({ color: point.color, width: 3 })
      .show();
  }
}

function positionTooltip(clientX, clientY) {
  if (!tooltipEl) return;
  const container = document.getElementById('svg-container');
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const tooltipRect = tooltipEl.getBoundingClientRect();
  let left = clientX - rect.left + 16;
  let top = clientY - rect.top + 16;

  if (left + tooltipRect.width > rect.width) {
    left = rect.width - tooltipRect.width - 8;
  }
  if (top + tooltipRect.height > rect.height) {
    top = rect.height - tooltipRect.height - 8;
  }

  tooltipEl.style.left = `${Math.max(8, left)}px`;
  tooltipEl.style.top = `${Math.max(8, top)}px`;
}

function paIdeal({ paSat }, x) {
  return Math.max(0, paSat * (1 - x));
}

function pbIdeal({ pbSat }, x) {
  return Math.max(0, pbSat * x);
}

function paActual({ paSat, gamma }, xRaw) {
  const x = clampComposition(xRaw);
  const correction = paSat * gamma * Math.pow(x, 3) * Math.log(x);
  return Math.max(0, paSat * (1 - x) - correction);
}

function pbActual({ pbSat, gamma }, xRaw) {
  const x = clampComposition(xRaw);
  const correction = pbSat * gamma * Math.pow(1 - x, 3) * Math.log(1 - x);
  return Math.max(0, pbSat * x - correction);
}

function henryA({ paSat, gamma }, x) {
  return Math.max(0, paSat * (gamma + 1) * x);
}

function henryB({ pbSat, gamma }, x) {
  return Math.max(0, pbSat * (gamma + 1) * (1 - x));
}

function clampComposition(value) {
  const eps = 1e-4;
  return Math.min(1 - eps, Math.max(eps, value));
}

function sampleMax(fn, start, end, steps) {
  let maxVal = 0;
  for (let i = 0; i <= steps; i += 1) {
    const x = start + (end - start) * (i / steps);
    const val = fn(x);
    if (Number.isFinite(val)) maxVal = Math.max(maxVal, val);
  }
  return maxVal;
}

function formatFraction(value) {
  const isInt = Math.abs(value - Math.round(value)) < 1e-6;
  return isInt ? Math.round(value).toString() : value.toFixed(1);
}
