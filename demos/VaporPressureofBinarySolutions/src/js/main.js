import * as config from './config.js';

const padding = { top: 80, right: 30, bottom: 80, left: 150 };
const defaults = { paSat: 250, pbSat: 150, gamma: 0, showHenry: false };
const plotColors = {
  idealA: '#9cc3ff',
  idealB: '#a0e4ba',
  idealTotal: '#333333',
  actualA: '#4e88ff',
  actualB: '#27a659',
  actualTotal: '#111111',
  henryB: '#cf2b2b',
  henryA: '#cf2b2b'
};
const labelSpecs = {
  P: { base: 'P', italic: true },
  PA: { base: 'P', sub: 'A', italic: true },
  PB: { base: 'P', sub: 'B', italic: true },
  'PA(ideal)': { base: 'P', sub: 'A', suffix: ' (ideal)', italic: true },
  'PB(ideal)': { base: 'P', sub: 'B', suffix: ' (ideal)', italic: true },
  'P(ideal)': { base: 'P', suffix: ' (ideal)', italic: true },
  "PB(Henry's law)": { base: 'P', sub: 'B', suffix: " (Henry's law)", italic: true },
  "PA(Henry's law)": { base: 'P', sub: 'A', suffix: " (Henry's law)", italic: true },
  PAsat: { base: 'P', sub: 'A', sup: 'sat', italic: true },
  PBsat: { base: 'P', sub: 'B', sup: 'sat', italic: true }
};

let drawRef;
let axisLayer;
let plotLayer;
let labelLayer;
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
  labelLayer = svg.group().id('label-layer');
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
  if (labelLayer) labelLayer.clear();
  drawAxes(chartArea, scales, axisMax, tickStep);
  drawCurves(params, scales);
  drawHenryCurves(params, scales);
  drawCurveAnnotations(params, scales, chartArea);
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
      { fn: (x) => henryB(params, x), start: 0, end: 0.3 },
      { fn: (x) => henryA(params, x), start: 0.7, end: 1 }
    );
  }

  let maxVal = 0;
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
    .stroke({ color: '#666', width: 1 })
    .move(area.x, area.y);
  axisLayer.line(area.x, area.y, area.x, area.y + area.height)
    .stroke({ color: '#000', width: 2 });
  axisLayer.line(area.x, area.y + area.height, area.x + area.width, area.y + area.height)
    .stroke({ color: '#000', width: 2 });
  axisLayer.line(area.x + area.width, area.y, area.x + area.width, area.y + area.height)
    .stroke({ color: '#000', width: 2 });

  // X-axis ticks
  const moleTicks = [0, 0.2, 0.4, 0.6, 0.8, 1];
  const axisNumberFont = 19;
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
      .font({ size: axisNumberFont, family: 'Helvetica, Arial, sans-serif', anchor: 'middle' });
    label.center(x, area.y + area.height + 26);
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
      .font({ size: axisNumberFont, family: 'Helvetica, Arial, sans-serif', anchor: 'end' })
      .center(area.x - 28, y);
    axisLayer.line(area.x, y, area.x + area.width, y)
      .stroke({ color: '#e0e0e0', width: 1 })
      .attr({ 'stroke-dasharray': '6,6' });
  });

  drawAxisLabels(area);
}

function drawAxisLabels(area) {
  const labelFont = { size: 22, family: 'Helvetica, Arial, sans-serif' };
  const xLabel = axisLayer.text((add) => {
    add.tspan('mole fraction ');
    add.tspan('x').font({ style: 'italic' });
    add.tspan('B').font({ size: 12 }).dy(6);
  }).font({ ...labelFont, anchor: 'middle' });
  const xPos = area.x + area.width / 2;
  xLabel.center(xPos, area.y + area.height + 60);

  const yLabel = axisLayer.text((add) => {
    add.tspan('vapor pressure (torr)');
  }).font({ ...labelFont, anchor: 'middle' });
  yLabel.center(area.x - 70, area.y + area.height / 2);
  const labelBox = yLabel.bbox();
  yLabel.rotate(-90, labelBox.cx, labelBox.cy);
}

function drawCurves(params, scales) {
  const showIdeal = hasDeviation(params);
  const curves = [];
  if (showIdeal) {
    curves.push(
      { fn: (x) => paIdeal(params, x), style: { color: plotColors.actualA, dash: '8,8', width: 1.5, opacity: 1 } },
      { fn: (x) => pbIdeal(params, x), style: { color: plotColors.actualB, dash: '8,8', width: 1.5, opacity: 1 } },
      {
        fn: (x) => paIdeal(params, x) + pbIdeal(params, x),
        style: { color: plotColors.idealTotal, dash: '8,8', width: 1.5, opacity: 1 }
      }
    );
  }
  curves.push(
    { fn: (x) => paActual(params, x), style: { color: plotColors.actualA, width: 1.5 } },
    { fn: (x) => pbActual(params, x), style: { color: plotColors.actualB, width: 1.5 } },
    { fn: (x) => paActual(params, x) + pbActual(params, x), style: { color: plotColors.actualTotal, width: 1.5 } }
  );

  curves.forEach(({ fn, style }) => drawCurve(fn, scales, style));
}

function drawHenryCurves(params, scales) {
  if (!params.showHenry) return;
  drawCurve((x) => henryB(params, x), scales, {
    color: plotColors.henryB,
    width: 2.5,
    dash: '6,6',
    opacity: 1
  }, 0, 0.3);
  drawCurve((x) => henryA(params, x), scales, {
    color: plotColors.henryA,
    width: 2.5,
    dash: '6,6',
    opacity: 1
  }, 0.7, 1);
}

function drawCurveAnnotations(params, scales, area) {
  if (!labelLayer) return;
  labelLayer.clear();
  drawSaturationAxisLabels(params, scales, area);
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
    .stroke({ color: style.color, width: style.width })
    .opacity(style.opacity ?? 1);
  if (style.dash) path.attr({ 'stroke-dasharray': style.dash });
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
    { labelKey: 'PA', color: plotColors.actualA, value: paActualVal },
    { labelKey: 'PB', color: plotColors.actualB, value: pbActualVal },
    { labelKey: 'P', color: plotColors.actualTotal, value: paActualVal + pbActualVal }
  ];
  const showIdeal = hasDeviation(params);
  if (showIdeal) {
    candidates.push(
      { labelKey: 'PA(ideal)', color: plotColors.actualA, value: paIdealVal },
      { labelKey: 'PB(ideal)', color: plotColors.actualB, value: pbIdealVal },
      { labelKey: 'P(ideal)', color: plotColors.idealTotal, value: paIdealVal + pbIdealVal }
    );
  }

  if (params.showHenry && x <= 0.3) {
    candidates.push({ labelKey: "PB(Henry's law)", color: plotColors.henryB, value: henryB(params, x) });
  }
  if (params.showHenry && x >= 0.7) {
    candidates.push({ labelKey: "PA(Henry's law)", color: plotColors.henryA, value: henryA(params, x) });
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
  const labelHtml = formatLabelHTML(point.labelKey);
  tooltipEl.innerHTML = labelHtml || '';
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
  const slope = -paSat * (gamma + 1);
  return Math.max(0, slope * (x - 1));
}

function henryB({ pbSat, gamma }, x) {
  const slope = pbSat * (gamma + 1);
  return Math.max(0, slope * x);
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

function hasDeviation({ gamma }) {
  return Math.abs(gamma) > 1e-4;
}

function computeTangentAngle(fn, x, scales, start = 0, end = 1) {
  const delta = Math.min(0.02, Math.max(0.002, (end - start) / 20));
  const x1 = clampWithinRange(x - delta, start, end);
  const x2 = clampWithinRange(x + delta, start, end);
  if (x2 <= x1) return 0;
  const y1 = fn(x1);
  const y2 = fn(x2);
  if (!Number.isFinite(y1) || !Number.isFinite(y2)) return 0;
  const p1 = { x: scales.x(x1), y: scales.y(y1) };
  const p2 = { x: scales.x(x2), y: scales.y(y2) };
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}

function clampWithinRange(value, min, max) {
  if (Number.isNaN(value)) return min;
  if (min > max) return min;
  return Math.min(Math.max(value, min), max);
}

function clampCoord(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function drawSaturationAxisLabels(params, scales, area) {
  if (!labelLayer) return;
  const fontBase = { size: 18, family: 'Helvetica, Arial, sans-serif' };
  const paY = clampCoord(scales.y(params.paSat), area.y + 16, area.y + area.height - 16);
  const paText = labelLayer.text((add) => renderSvgLabel(add, 'PAsat'))
    .font({ ...fontBase, anchor: 'end' })
    .fill(plotColors.actualA);
  paText.center(area.x - 30, paY);

  const pbY = clampCoord(scales.y(params.pbSat), area.y + 16, area.y + area.height - 16);
  const pbText = labelLayer.text((add) => renderSvgLabel(add, 'PBsat'))
    .font({ ...fontBase, anchor: 'start' })
    .fill(plotColors.actualB);
  pbText.center(area.x + area.width + 30, pbY);
}

function renderSvgLabel(add, labelKey) {
  const spec = labelSpecs[labelKey];
  if (!spec) {
    add.tspan(labelKey ?? '');
    return;
  }
  const base = add.tspan(spec.base ?? '');
  if (spec.italic) base.font({ style: 'italic' });

  const baseFontSize = getTspanFontSize(base);
  const applyOffsetSpan = (text, offset, { scale = 0.85, reset = true } = {}) => {
    const span = add.tspan(text).font({ size: baseFontSize * scale });
    span.dy(offset);
    if (reset) {
      // Reset baseline for subsequent characters
      add.tspan('').dy(-offset);
    }
  };

  if (spec.sub) {
    applyOffsetSpan(spec.sub, baseFontSize * 0.35);
  }
  if (spec.sup) {
    applyOffsetSpan(spec.sup, -baseFontSize * 0.85, { reset: Boolean(spec.suffix) });
  }
  if (spec.suffix) add.tspan(spec.suffix);
}

function getTspanFontSize(tspan) {
  const attrSize = tspan.attr('font-size');
  if (attrSize) {
    const parsed = parseFloat(attrSize);
    if (!Number.isNaN(parsed)) return parsed;
  }
  const fontSize = tspan.font().size;
  return typeof fontSize === 'number' ? fontSize : 16;
}

function formatLabelHTML(labelKey) {
  const spec = labelSpecs[labelKey];
  if (!spec) return escapeHtml(labelKey ?? '');
  const baseRaw = escapeHtml(spec.base ?? '');
  const base = spec.italic ? `<span style="font-style:italic;">${baseRaw}</span>` : baseRaw;
  const sub = spec.sub ? `<sub>${escapeHtml(spec.sub)}</sub>` : '';
  const sup = spec.sup ? `<sup>${escapeHtml(spec.sup)}</sup>` : '';
  const suffix = spec.suffix ? escapeHtml(spec.suffix) : '';
  return `${base}${sub}${sup}${suffix}`;
}

function escapeHtml(text) {
  return (text ?? '').replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });
}
