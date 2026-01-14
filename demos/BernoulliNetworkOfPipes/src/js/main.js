const defaults = {
  pressure: 2,
  leftRadius: 0.2,
  rightRadius: 0.5
};

const constants = {
  rho: 997,
  inletRadius: 1,
  arrowScale: 0.5,
  minArrowLength: 0.15,
  baseBounds: {
    minX: -3,
    maxX: 3,
    minY: -2,
    maxY: 3.2
  },
  pAir: 0
};

const plotlyScriptUrl = 'assets/plotly.js';

let drawRef;
let initialized = false;
let plotlyRoot;
let plotlyPromise;
let plotInitialized = false;

const state = { ...defaults };

const elements = {
  sliders: {},
  sliderValues: {}
};

export function drawFigure(svg) {
  drawRef = svg;
  if (drawRef?.hide) drawRef.hide();
  plotlyRoot = document.getElementById('plotly-root');
  setupControls();
  renderPlot();
  window.addEventListener('resize', handleResize, { passive: true });
}

export function reset() {
  syncControls(defaults);
  renderPlot();
}

function handleResize() {
  if (window.Plotly && plotlyRoot) {
    window.Plotly.Plots.resize(plotlyRoot);
  }
}

function setupControls() {
  if (initialized) return;
  elements.sliders.pressure = document.getElementById('pressureSlider');
  elements.sliders.leftRadius = document.getElementById('leftRadiusSlider');
  elements.sliders.rightRadius = document.getElementById('rightRadiusSlider');

  elements.sliderValues.pressure = document.getElementById('pressureValue');
  elements.sliderValues.leftRadius = document.getElementById('leftRadiusValue');
  elements.sliderValues.rightRadius = document.getElementById('rightRadiusValue');

  const sliderConfig = [
    { key: 'pressure', decimals: 1 },
    { key: 'leftRadius', decimals: 2 },
    { key: 'rightRadius', decimals: 2 }
  ];

  sliderConfig.forEach(({ key, decimals }) => {
    const slider = elements.sliders[key];
    if (!slider) return;
    slider.addEventListener('input', () => {
      const value = parseFloat(slider.value);
      if (!Number.isFinite(value)) return;
      state[key] = value;
      if (elements.sliderValues[key]) elements.sliderValues[key].textContent = value.toFixed(decimals);
      renderPlot();
    });
  });

  syncControls(defaults);
  initialized = true;
}

function syncControls(values) {
  Object.entries(values).forEach(([key, value]) => {
    if (elements.sliders[key]) elements.sliders[key].value = value;
    if (elements.sliderValues[key]) {
      const decimals = key === 'pressure' ? 1 : 2;
      elements.sliderValues[key].textContent = value.toFixed(decimals);
    }
    state[key] = value;
  });
}

async function renderPlot() {
  if (!plotlyRoot) plotlyRoot = document.getElementById('plotly-root');
  if (!plotlyRoot) return;
  const model = computeNetwork(state);
  if (!model) {
    showPlotPlaceholder('Unable to compute the network. Adjust the sliders.');
    plotInitialized = false;
    return;
  }

  let plotlyLib;
  try {
    plotlyLib = await loadPlotly();
  } catch (error) {
    showPlotPlaceholder('Plotly failed to load. Please refresh the page.');
    plotInitialized = false;
    return;
  }

  const figure = buildFigure(model);
  const config = { displayModeBar: false, responsive: true };
  if (!plotInitialized) {
    plotlyRoot.innerHTML = '';
    plotlyLib.newPlot(plotlyRoot, figure.data, figure.layout, config);
    plotInitialized = true;
  } else {
    plotlyLib.react(plotlyRoot, figure.data, figure.layout, config);
  }
}

function buildFigure(model) {
  const bounds = computeBounds(model);
  const fluidPolygon = getFluidPolygon(model);
  const wallCoords = getWallCoordinates(model);
  const xRange = zoomedRange(bounds.minX, bounds.maxX, 0.05, 0.8);
  const yRange = zoomedRange(bounds.minY, bounds.maxY, 0.05, 0.8);

  const fluidTrace = {
    type: 'scatter',
    mode: 'lines',
    x: fluidPolygon.map((pt) => pt.x),
    y: fluidPolygon.map((pt) => pt.y),
    fill: 'toself',
    fillcolor: 'rgba(13, 110, 253, 0.15)',
    line: { color: 'rgba(13, 110, 253, 0.5)', width: 2 },
    hoverinfo: 'skip'
  };

  const wallTrace = {
    type: 'scatter',
    mode: 'lines',
    x: wallCoords.x,
    y: wallCoords.y,
    line: { color: '#495057', width: 4 },
    hoverinfo: 'skip'
  };

  const layout = {
    margin: { l: 10, r: 10, t: 10, b: 10 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    xaxis: {
      range: xRange,
      visible: false,
      scaleanchor: 'y',
      scaleratio: 1
    },
    yaxis: {
      range: yRange,
      visible: false
    },
    annotations: buildAnnotations(model)
  };

  return { data: [fluidTrace, wallTrace], layout };
}

function getFluidPolygon(model) {
  const R1 = constants.inletRadius;
  const { diameters } = model;
  const points = [
    { x: R1, y: 0 },
    { x: R1, y: 1 + diameters.left - diameters.right },
    { x: R1 + 1, y: 1 + diameters.left - diameters.right },
    { x: R1 + 1, y: 1 + diameters.left },
    { x: -R1 - 1, y: 1 + diameters.left },
    { x: -R1 - 1, y: 1 },
    { x: -R1, y: 1 },
    { x: -R1, y: 0 }
  ];
  points.push(points[0]);
  return points;
}

function getWallCoordinates(model) {
  const R1 = constants.inletRadius;
  const { diameters } = model;
  const outlines = [
    [
      { x: R1, y: 0 },
      { x: R1, y: 1 + diameters.left - diameters.right },
      { x: R1 + 1, y: 1 + diameters.left - diameters.right }
    ],
    [
      { x: R1 + 1, y: 1 + diameters.left - diameters.right },
      { x: R1 + 1, y: 1 + diameters.left }
    ],
    [
      { x: R1 + 1, y: 1 + diameters.left },
      { x: -R1 - 1, y: 1 + diameters.left },
      { x: -R1 - 1, y: 1 },
      { x: -R1, y: 1 },
      { x: -R1, y: 0 }
    ]
  ];

  const x = [];
  const y = [];
  outlines.forEach((segment) => {
    segment.forEach((pt) => {
      x.push(pt.x);
      y.push(pt.y);
    });
    x.push(null);
    y.push(null);
  });
  return { x, y };
}

function buildAnnotations(model) {
  const R1 = constants.inletRadius;
  const { diameters, velocities, pressure } = model;
  const inletArrowLength = getArrowLength(velocities.inlet);
  const leftArrowLength = getArrowLength(velocities.left);
  const rightArrowLength = getArrowLength(velocities.right);

  const entries = [
    {
      text: `p<sub>air</sub><br>U<sub>3</sub> = ${formatNumber(velocities.right, 1)} m/s`,
      start: { x: 1 + R1, y: 1 + diameters.left - diameters.right / 2 },
      end: { x: 1 + R1 + rightArrowLength, y: 1 + diameters.left - diameters.right / 2 },
      textPosition: {
        x: 1 + R1 + rightArrowLength / 2,
        y: 1 + diameters.left - diameters.right / 2 + 0.25
      }
    },
    {
      text: `p<sub>air</sub><br>U<sub>2</sub> = ${formatNumber(velocities.left, 1)} m/s`,
      start: { x: -1 - R1, y: 1 + diameters.left / 2 },
      end: { x: -1 - R1 - leftArrowLength, y: 1 + diameters.left / 2 },
      textPosition: {
        x: -1 - R1 - leftArrowLength / 2,
        y: 1 + diameters.left / 2 + 0.25
      }
    },
    {
      text: `p<sub>1</sub> = ${formatNumber(pressure, 1)} kPa<br>U<sub>1</sub> = ${formatNumber(velocities.inlet, 1)} m/s`,
      start: { x: 0, y: -inletArrowLength },
      end: { x: 0, y: 0 },
      textPosition: {
        x: 0.3,
        y: -0.3
      }
    }
  ];

  const arrows = entries.map((entry) => ({
    x: entry.end.x,
    y: entry.end.y,
    ax: entry.start.x,
    ay: entry.start.y,
    xref: 'x',
    yref: 'y',
    axref: 'x',
    ayref: 'y',
    showarrow: true,
    arrowhead: 3,
    arrowcolor: '#111',
    arrowwidth: 2,
    arrowsize: 1,
    standoff: 4,
    arrowposition: 1,
    xanchor: 'center',
    yanchor: 'middle',
    opacity: 1,
    hovertext: entry.text,
    hoverinfo: 'text'
  }));

  const labels = entries.map((entry, index) => ({
    x: entry.textPosition.x,
    y: entry.textPosition.y,
    xref: 'x',
    yref: 'y',
    showarrow: false,
    text: entry.text,
    xanchor: index === 1 ? 'right' : 'left',
    yanchor: 'middle',
    bgcolor: 'rgba(255,255,255,0.95)',
    borderpad: 4,
    font: { size: 14, color: '#111' },
    align: index === 1 ? 'right' : 'left'
  }));

  return arrows.concat(labels);
}

function computeNetwork({ pressure, leftRadius, rightRadius }) {
  const rho = constants.rho;
  const p1 = Math.max(pressure * 1000, 0);
  const R1 = constants.inletRadius;
  const A1 = Math.PI * R1 * R1;
  const A2 = Math.PI * leftRadius * leftRadius;
  const A3 = Math.PI * rightRadius * rightRadius;
  const areaRatio = A1 / (A2 + A3);
  const denom = rho * (areaRatio * areaRatio - 1);
  if (denom <= 0) return null;
  const deltaP = Math.max(p1 - constants.pAir, 0);
  const base = (2 * deltaP) / denom;
  if (base < 0) return null;
  const U1 = Math.sqrt(base);
  const U2 = U1 * areaRatio;
  const U3 = U1 * areaRatio;

  const flows = {
    inlet: U1 * A1,
    left: U2 * A2,
    right: U3 * A3
  };

  return {
    pressure,
    leftRadius,
    rightRadius,
    diameters: {
      inlet: 2 * R1,
      left: 2 * leftRadius,
      right: 2 * rightRadius
    },
    velocities: { inlet: U1, left: U2, right: U3 },
    flows
  };
}

function computeBounds(model) {
  const { baseBounds } = constants;
  const R1 = constants.inletRadius;
  const leftArrowLength = getArrowLength(model.velocities.left);
  const rightArrowLength = getArrowLength(model.velocities.right);
  const inletArrowLength = getArrowLength(model.velocities.inlet);
  const leftExtent = -1 - R1 - leftArrowLength - 0.5;
  const rightExtent = 1 + R1 + rightArrowLength + 0.5;
  const inletExtent = -inletArrowLength - 0.5;
  return {
    minX: Math.min(baseBounds.minX, leftExtent),
    maxX: Math.max(baseBounds.maxX, rightExtent),
    minY: Math.min(baseBounds.minY, inletExtent),
    maxY: baseBounds.maxY
  };
}

function zoomedRange(min, max, padding = 0.05, scale = 0.8) {
  const paddedMin = min - padding;
  const paddedMax = max + padding;
  const span = Math.max(paddedMax - paddedMin, 1e-3);
  const center = (paddedMax + paddedMin) / 2;
  const halfSpan = (span * Math.min(Math.max(scale, 0.1), 1)) / 2;
  return [center - halfSpan, center + halfSpan];
}

function showPlotPlaceholder(message) {
  if (!plotlyRoot) return;
  plotlyRoot.innerHTML = `<div class="plotly-placeholder">${message}</div>`;
}

async function loadPlotly() {
  if (window.Plotly) return window.Plotly;
  if (!plotlyPromise) {
    plotlyPromise = new Promise((resolve, reject) => {
      let script = document.querySelector('script[data-plotly-loader="true"]');
      if (!script) {
        script = document.createElement('script');
        script.src = plotlyScriptUrl;
        script.async = true;
        script.dataset.plotlyLoader = 'true';
      }

      const handleLoad = () => {
        script.dataset.plotlyLoaded = 'true';
        if (window.Plotly) resolve(window.Plotly);
        else {
          plotlyPromise = null;
          reject(new Error('Plotly failed to expose API'));
        }
      };

      const handleError = () => {
        plotlyPromise = null;
        reject(new Error('Plotly failed to load'));
      };

      if (script.dataset.plotlyLoaded === 'true' && window.Plotly) {
        resolve(window.Plotly);
        return;
      }

      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener('error', handleError, { once: true });
      if (!script.parentNode) document.head.appendChild(script);
    });
  }
  return plotlyPromise;
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  return Number(value).toFixed(digits);
}

function getArrowLength(velocity) {
  const scale = constants.arrowScale;
  const minLength = constants.minArrowLength || 0;
  const scaled = Math.abs(velocity) * scale;
  if (scaled <= 0) return minLength;
  return Math.max(scaled, minLength);
}
