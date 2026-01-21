const defaults = {
  profileId: 'linear-saddle',
  xCenter: 0,
  yCenter: 0,
  showFlow: 'yes'
};

const velocityProfiles = [
  {
    id: 'linear-saddle',
    label: 'x eₓ - y eᵧ',
    latex: String.raw`\vec{v} = x\,\hat{\mathbf{e}}_x - y\,\hat{\mathbf{e}}_y`,
    velocity: (x, y) => ({ u: x, v: -y })
  },
  {
    id: 'linear-source',
    label: 'x eₓ + y eᵧ',
    latex: String.raw`\vec{v} = x\,\hat{\mathbf{e}}_x + y\,\hat{\mathbf{e}}_y`,
    velocity: (x, y) => ({ u: x, v: y })
  },
  {
    id: 'rotation-cw',
    label: 'y/√(x² + y²) eₓ - x/√(x² + y²) eᵧ',
    latex: String.raw`\vec{v} = \frac{y}{\sqrt{x^{2}+y^{2}}}\,\hat{\mathbf{e}}_x - \frac{x}{\sqrt{x^{2}+y^{2}}}\,\hat{\mathbf{e}}_y`,
    velocity: (x, y) => {
      const denom = Math.max(Math.hypot(x, y), 1e-6);
      return { u: y / denom, v: -x / denom };
    }
  },
  {
    id: 'rotation-ccw',
    label: 'y/√(x² + y²) eₓ + x/√(x² + y²) eᵧ',
    latex: String.raw`\vec{v} = \frac{y}{\sqrt{x^{2}+y^{2}}}\,\hat{\mathbf{e}}_x + \frac{x}{\sqrt{x^{2}+y^{2}}}\,\hat{\mathbf{e}}_y`,
    velocity: (x, y) => {
      const denom = Math.max(Math.hypot(x, y), 1e-6);
      return { u: y / denom, v: x / denom };
    }
  },
  {
    id: 'polynomial',
    label: 'x/(x² + y²) eₓ + y/(x² + y²) eᵧ',
    latex: String.raw`\vec{v} = \frac{x}{x^{2}+y^{2}}\,\hat{\mathbf{e}}_x + \frac{y}{x^{2}+y^{2}}\,\hat{\mathbf{e}}_y`,
    velocity: (x, y) => {
      const denom = Math.max(x * x + y * y, 1e-6);
      return {
        u: x / denom,
        v: y / denom
      };
    }
  }
];

const sideLength = 2;
const gridExtent = sideLength * 2; // +/-4 about the origin
const gridCount = 20;
const plotlyCdnUrl = 'assets/plotly.js';

let drawRef;
let controlsReady = false;
let plotlyRoot;
let plotlyPromise;
let plotInitialized = false;
let selectedProfileId = defaults.profileId;
const elements = {};
let resizeObserverAttached = false;
let plotlyLibRef;
let pendingResizeFrame;

export function drawFigure(svg) {
  drawRef = svg;
  if (drawRef?.hide) drawRef.hide();
  plotlyRoot = document.getElementById('plotly-root');
  setupControls();
  renderPlot();
}

export function reset() {
  if (!controlsReady) return;
  syncControls(defaults);
  renderPlot();
}

function setupControls() {
  if (controlsReady) return;
  elements.profileList = document.getElementById('profileList');
  elements.plotLayout = document.querySelector('.plot-layout');
  elements.svgContainer = document.getElementById('svg-container');
  elements.controlBar = document.getElementById('control-bar');
  elements.xSlider = document.getElementById('xSlider');
  elements.ySlider = document.getElementById('ySlider');
  elements.xValue = document.getElementById('xValue');
  elements.yValue = document.getElementById('yValue');
  elements.flowRadios = document.querySelectorAll('input[name="flowToggle"]');

  populateProfileOptions();
  syncControls(defaults);

  elements.xSlider?.addEventListener('input', renderPlot);
  elements.ySlider?.addEventListener('input', renderPlot);
  elements.flowRadios?.forEach((radio) => {
    radio.addEventListener('change', renderPlot);
  });
  updatePlotLayoutOffset();
  if (!resizeObserverAttached) {
    window.addEventListener('resize', handleWindowResize);
    resizeObserverAttached = true;
  }

  controlsReady = true;
}

function populateProfileOptions() {
  if (!elements.profileList) return;
  elements.profileList.innerHTML = '';
  velocityProfiles.forEach((profile) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'profile-list__item';
    button.dataset.profileId = profile.id;
    button.innerHTML = `\\(${profile.latex || profile.label}\\)`;
    button.addEventListener('click', () => {
      if (selectedProfileId === profile.id) return;
      selectedProfileId = profile.id;
      updateProfileSelection();
      renderPlot();
    });
    elements.profileList.appendChild(button);
  });
  updateProfileSelection();
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([elements.profileList]).catch(() => { });
  }
}

function syncControls(values) {
  selectedProfileId = values.profileId;
  updateProfileSelection();
  if (elements.xSlider) elements.xSlider.value = values.xCenter;
  if (elements.ySlider) elements.ySlider.value = values.yCenter;
  elements.flowRadios?.forEach((radio) => {
    radio.checked = radio.value === values.showFlow;
  });
  updateOutputs(values);
}

function getParams() {
  return {
    profileId: selectedProfileId || defaults.profileId,
    xCenter: parseFloat(elements.xSlider?.value) || defaults.xCenter,
    yCenter: parseFloat(elements.ySlider?.value) || defaults.yCenter,
    showFlow: document.querySelector('input[name="flowToggle"]:checked')?.value || defaults.showFlow
  };
}

function updateOutputs({ xCenter, yCenter }) {
  if (elements.xValue) elements.xValue.textContent = `${xCenter.toFixed(2)}`;
  if (elements.yValue) elements.yValue.textContent = `${yCenter.toFixed(2)}`;
}

async function renderPlot() {
  if (!plotlyRoot) plotlyRoot = document.getElementById('plotly-root');
  const params = getParams();
  const profile = velocityProfiles.find((item) => item.id === params.profileId) || velocityProfiles[0];
  updateOutputs(params);

  if (!plotlyRoot) return;
  const result = computeField(params, profile);
  if (!result) {
    showPlotPlaceholder('Unable to compute the velocity field.');
    plotInitialized = false;
    return;
  }

  let plotlyLib;
  try {
    plotlyLib = await loadPlotly();
  } catch (error) {
    showPlotPlaceholder('Plotly failed to load. Please refresh the page.');
    return;
  }

  const showFlow = params.showFlow === 'yes';

  plotlyLibRef = plotlyLib;
  renderPlotlyFigure({
    plotlyLib,
    params,
    field: result,
    showFlow
  });
  plotInitialized = true;
}

function computeField(params, profile) {
  const targetProfile = profile || velocityProfiles[0];
  const velocityFn = targetProfile.velocity;
  const xGrid = linspace(-gridExtent, gridExtent, gridCount);
  const yGrid = linspace(-gridExtent, gridExtent, gridCount);
  const vectors = [];
  let maxMagnitude = 0;

  for (let yi = 0; yi < yGrid.length; yi += 1) {
    for (let xi = 0; xi < xGrid.length; xi += 1) {
      const x = xGrid[xi];
      const y = yGrid[yi];
      const { u, v } = velocityFn(x, y);
      if (!Number.isFinite(u) || !Number.isFinite(v)) continue;
      const magnitude = Math.hypot(u, v);
      maxMagnitude = Math.max(maxMagnitude, magnitude);
      vectors.push({ x, y, u, v, magnitude });
    }
  }

  const flowRates = computeFlowRates(params, velocityFn);
  return { vectors, maxMagnitude: Math.max(maxMagnitude, 1e-6), flowRates };
}

function updateProfileSelection() {
  if (!elements.profileList) return;
  const buttons = elements.profileList.querySelectorAll('.profile-list__item');
  buttons.forEach((button) => {
    button.classList.toggle('profile-list__item--active', button.dataset.profileId === selectedProfileId);
  });
}

function updatePlotLayoutOffset() {
  if (!elements.plotLayout || !elements.svgContainer || !elements.controlBar) return;
  const containerRect = elements.svgContainer.getBoundingClientRect();
  const controlRect = elements.controlBar.getBoundingClientRect();
  const offset = Math.max(controlRect.bottom - containerRect.top + 12, 0);
  elements.plotLayout.style.setProperty('--plot-top', `${offset}px`);
}

function handleWindowResize() {
  if (pendingResizeFrame) cancelAnimationFrame(pendingResizeFrame);
  pendingResizeFrame = window.requestAnimationFrame(() => {
    pendingResizeFrame = null;
    updatePlotLayoutOffset();
    if (plotlyLibRef?.Plots && plotlyRoot) {
      try {
        plotlyLibRef.Plots.resize(plotlyRoot);
      } catch (error) {
        // Ignore resize errors
      }
    }
  });
}

function computeFlowRates(params, velocityFn) {
  const half = sideLength / 2;
  const xMin = params.xCenter - half;
  const xMax = params.xCenter + half;
  const yMin = params.yCenter - half;
  const yMax = params.yCenter + half;

  const Q_top = 0.1 * integrateSimpson((x) => velocityFn(x, params.yCenter + half).v, xMin, xMax) * sideLength;
  const Q_bottom = 0.1 * integrateSimpson((x) => -velocityFn(x, params.yCenter - half).v, xMin, xMax) * sideLength;
  const Q_right = 0.1 * integrateSimpson((y) => velocityFn(params.xCenter + half, y).u, yMin, yMax) * sideLength;
  const Q_left = 0.1 * integrateSimpson((y) => -velocityFn(params.xCenter - half, y).u, yMin, yMax) * sideLength;

  return {
    top: Q_top,
    bottom: Q_bottom,
    right: Q_right,
    left: Q_left
  };
}

function integrateSimpson(fn, a, b, segments = 256) {
  if (a === b) return 0;
  const n = segments % 2 === 0 ? segments : segments + 1;
  const h = (b - a) / n;
  let sum = 0;

  for (let i = 0; i <= n; i += 1) {
    const x = a + h * i;
    const weight = i === 0 || i === n ? 1 : i % 2 === 0 ? 2 : 4;
    sum += weight * fn(x);
  }

  return (sum * h) / 3;
}

function renderPlotlyFigure({ plotlyLib, params, field, showFlow }) {
  if (!plotlyRoot || !plotlyLib) return;
  const vectorTrace = buildVectorTrace(field.vectors, field.maxMagnitude);
  const axisPadding = 0.15;
  const xPositiveExtra = 0.1;
  const xRange = [-gridExtent - axisPadding, gridExtent + axisPadding + xPositiveExtra];
  const yRange = [-gridExtent - axisPadding, gridExtent + axisPadding];

  const shapes = [
    {
      type: 'rect',
      xref: 'x',
      yref: 'y',
      x0: params.xCenter - sideLength / 2,
      x1: params.xCenter + sideLength / 2,
      y0: params.yCenter - sideLength / 2,
      y1: params.yCenter + sideLength / 2,
      line: { color: '#111', width: 2 },
      fillcolor: 'rgba(13, 110, 253, 0.08)'
    }
  ];

  const annotations = buildFlowAnnotations(params, field.flowRates, showFlow);

  const layout = {
    margin: { l: 70, r: 30, t: 12, b: 70 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    font: {
      family: 'Arial, sans-serif',
      size: 16,
      color: '#000'
    },
    xaxis: {
      title: { text: 'x<sub>center</sub> (m)', standoff: 12, font: { family: 'Arial, sans-serif', size: 18, color: '#111' } },
      range: xRange,
      zeroline: false,
      constrain: 'domain',
      autorange: false,
      ticks: 'outside',
      tickfont: { family: 'Arial, sans-serif', size: 16 },
      mirror: true
    },
    yaxis: {
      title: { text: 'y<sub>center</sub> (m)', standoff: 12, font: { family: 'Arial, sans-serif', size: 18, color: '#111' } },
      range: yRange,
      zeroline: false,
      scaleanchor: 'x',
      scaleratio: 1,
      constrain: 'domain',
      autorange: false,
      ticks: 'outside',
      tickfont: { family: 'Arial, sans-serif', size: 16 },
      mirror: true
    },
    shapes,
    annotations,
    showlegend: false
  };

  const plotConfig = {
    displayModeBar: false,
    responsive: true,
    staticPlot: true
  };
  if (!plotInitialized || !plotlyRoot.data) {
    plotlyRoot.innerHTML = '';
    plotlyLib.newPlot(plotlyRoot, [vectorTrace], layout, plotConfig);
  } else {
    plotlyLib.react(plotlyRoot, [vectorTrace], layout, plotConfig);
  }
}

function buildVectorTrace(vectors, maxMagnitude) {
  const x = [];
  const y = [];
  const scale = (sideLength * 0.2) / maxMagnitude;
  const arrowSpread = 0.35;
  const minArrowLength = sideLength * 0.06;

  vectors.forEach(({ x: x0, y: y0, u, v }) => {
    let dx = u * scale;
    let dy = v * scale;
    let x1 = x0 + dx;
    let y1 = y0 + dy;
    if (!Number.isFinite(x1) || !Number.isFinite(y1)) return;

    let length = Math.hypot(dx, dy);
    if (length > 0 && length < minArrowLength) {
      const boost = minArrowLength / length;
      dx *= boost;
      dy *= boost;
      x1 = x0 + dx;
      y1 = y0 + dy;
      length = Math.hypot(dx, dy);
    }

    x.push(x0, x1, null);
    y.push(y0, y1, null);

    if (length === 0) return;
    const headLength = Math.min(length * 0.3, 0.18);
    const angle = Math.atan2(dy, dx);
    const leftAngle = angle + Math.PI - arrowSpread;
    const rightAngle = angle + Math.PI + arrowSpread;
    const leftX = x1 + headLength * Math.cos(leftAngle);
    const leftY = y1 + headLength * Math.sin(leftAngle);
    const rightX = x1 + headLength * Math.cos(rightAngle);
    const rightY = y1 + headLength * Math.sin(rightAngle);
    x.push(x1, leftX, null, x1, rightX, null);
    y.push(y1, leftY, null, y1, rightY, null);
  });

  return {
    type: 'scatter',
    mode: 'lines',
    x,
    y,
    line: { color: '#0d6efd', width: 1.5 },
    hoverinfo: 'skip'
  };
}

function buildFlowAnnotations(params, flowRates, showFlow) {
  const half = sideLength / 2;
  const annotations = [];
  const entries = [
    {
      key: 'right',
      start: { x: params.xCenter + half, y: params.yCenter },
      end: { x: params.xCenter + half + flowRates.right, y: params.yCenter },
      value: flowRates.right,
      orientation: 'horizontal',
      anchor: anchorPos(half, 0, flowRates.right)
    },
    {
      key: 'left',
      start: { x: params.xCenter - half, y: params.yCenter },
      end: { x: params.xCenter - half - flowRates.left, y: params.yCenter },
      value: flowRates.left,
      orientation: 'horizontal',
      anchor: anchorPos(-half, 0, flowRates.left)
    },
    {
      key: 'top',
      start: { x: params.xCenter, y: params.yCenter + half },
      end: { x: params.xCenter, y: params.yCenter + half + flowRates.top },
      value: flowRates.top,
      orientation: 'vertical',
      anchor: anchorPos(0, half, flowRates.top)
    },
    {
      key: 'bottom',
      start: { x: params.xCenter, y: params.yCenter - half },
      end: { x: params.xCenter, y: params.yCenter - half - flowRates.bottom },
      value: flowRates.bottom,
      orientation: 'vertical',
      anchor: anchorPos(0, -half, flowRates.bottom)
    }
  ];

  entries.forEach((entry) => {
    annotations.push({
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
      arrowwidth: 2,
      arrowside: 'end',
      arrowcolor: '#111',
      standoff: 4,
      text: showFlow ? formatFlow(entry.value) : '',
      font: { family: 'Arial, sans-serif', size: 16, color: '#111' },
      bgcolor: showFlow ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0)',
      borderpad: showFlow ? 2 : 0,
      xanchor: entry.orientation === 'horizontal' ? entry.anchor : 'center',
      yanchor: entry.orientation === 'vertical' ? entry.anchor : 'middle',
      align: 'center'
    });
  });

  return annotations;
}

function anchorPos(dx, dy, flow) {
  if (dy === 0) {
    let anchor = 'left';
    if (Math.sign(flow) * Math.sign(dx) < 0) anchor = 'right';
    return anchor;
  }
  if (dx === 0) {
    let anchor = 'bottom';
    if (Math.sign(flow) * Math.sign(dy) < 0) anchor = 'top';
    return anchor;
  }
  return 'center';
}

function formatFlow(value) {
  if (!Number.isFinite(value)) return 'N/A';
  const formatted = Math.abs(value) < 1e-2 ? value.toExponential(2) : value.toFixed(2);
  return value > 0 ? `+${formatted}` : formatted;
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
        script.src = plotlyCdnUrl;
        script.async = true;
        script.dataset.plotlyLoader = 'true';
      }

      if (script.dataset.plotlyLoaded === 'true') {
        resolve(window.Plotly);
        return;
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

      script.addEventListener('load', handleLoad, { once: true });
      script.addEventListener('error', handleError, { once: true });
      if (!script.parentNode) document.head.appendChild(script);
    });
  }
  return plotlyPromise;
}

function linspace(start, end, count) {
  if (count <= 1) return [start];
  const step = (end - start) / (count - 1);
  const values = [];
  for (let i = 0; i < count; i += 1) {
    values.push(start + step * i);
  }
  return values;
}
