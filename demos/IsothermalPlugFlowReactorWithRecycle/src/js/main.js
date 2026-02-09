const defaults = {
  recycle: 1,
  volume: 285,
  CA0: 0.114
};

const constants = {
  vf: 50,
  P: 5.4,
  T: 325,
  R: 0.08314
};

const samplePoints = 201;
const plotlyScriptUrl = 'assets/plotly.js';

const LEFT_MARGIN = { l: 78, r: 18, t: 52, b: 64 };
const RIGHT_MARGIN = { l: 86, r: 28, t: 52, b: 64 };

let drawRef;
let plotlyLeftRoot;
let plotlyRightRoot;
let plotlyLibRef;
let plotlyPromise;
let leftInitialized = false;
let rightInitialized = false;
let controlsReady = false;
let pendingResizeFrame;
const elements = {};

export function drawFigure(svg) {
  drawRef = svg;
  if (drawRef?.hide) drawRef.hide();
  plotlyLeftRoot = document.getElementById('plotly-left');
  plotlyRightRoot = document.getElementById('plotly-right');
  setupControls();
  renderPlots();
}

export function reset() {
  if (!controlsReady) return;
  syncControls(defaults);
  renderPlots();
}

function setupControls() {
  if (controlsReady) return;
  elements.plotLayout = document.querySelector('.plot-layout');
  elements.svgContainer = document.getElementById('svg-container');
  elements.controlBar = document.getElementById('control-bar');

  elements.recycleSlider = document.getElementById('recycleSlider');
  elements.volumeSlider = document.getElementById('volumeSlider');
  elements.feedSlider = document.getElementById('feedSlider');

  elements.recycleValue = document.getElementById('recycleValue');
  elements.volumeValue = document.getElementById('volumeValue');
  elements.feedValue = document.getElementById('feedValue');

  syncControls(defaults);

  elements.recycleSlider?.addEventListener('input', renderPlots);
  elements.volumeSlider?.addEventListener('input', renderPlots);
  elements.feedSlider?.addEventListener('input', renderPlots);

  updatePlotLayoutOffset();
  window.addEventListener('resize', handleWindowResize);
  controlsReady = true;
}

function syncControls(values) {
  if (!values) return;
  if (elements.recycleSlider) elements.recycleSlider.value = `${values.recycle}`;
  if (elements.volumeSlider) elements.volumeSlider.value = `${values.volume}`;
  if (elements.feedSlider) elements.feedSlider.value = `${values.CA0}`;
  updateOutputs(values);
}

function getParams() {
  const recycleVal = parseFloat(elements.recycleSlider?.value);
  const volumeVal = parseFloat(elements.volumeSlider?.value);
  const feedVal = parseFloat(elements.feedSlider?.value);

  return {
    recycle: Number.isFinite(recycleVal) ? recycleVal : defaults.recycle,
    volume: Number.isFinite(volumeVal) ? volumeVal : defaults.volume,
    CA0: Number.isFinite(feedVal) ? feedVal : defaults.CA0
  };
}

function updateOutputs({ recycle, volume, CA0 }) {
  if (elements.recycleValue) elements.recycleValue.textContent = `${Number(recycle).toFixed(1)}`;
  if (elements.volumeValue) elements.volumeValue.textContent = `${Math.round(volume)}`;
  if (elements.feedValue) elements.feedValue.textContent = `${Number(CA0).toFixed(3)}`;
}

async function renderPlots() {
  if (!plotlyLeftRoot) plotlyLeftRoot = document.getElementById('plotly-left');
  if (!plotlyRightRoot) plotlyRightRoot = document.getElementById('plotly-right');
  if (!plotlyLeftRoot || !plotlyRightRoot) return;

  const params = getParams();
  updateOutputs(params);

  const model = computeModel(params);

  let plotlyLib;
  try {
    plotlyLib = await loadPlotly();
  } catch (err) {
    showPlotPlaceholder(plotlyLeftRoot, 'Plotly failed to load.');
    showPlotPlaceholder(plotlyRightRoot, 'Plotly failed to load.');
    return;
  }
  plotlyLibRef = plotlyLib;

  const leftPlot = buildLeftPlot(model);
  const rightPlot = buildRightPlot(model);
  const config = {
    displayModeBar: false,
    responsive: true,
    staticPlot: true
  };

  try {
    if (leftInitialized && plotlyLib.react) {
      await plotlyLib.react(plotlyLeftRoot, leftPlot.data, leftPlot.layout, config);
    } else {
      await plotlyLib.newPlot(plotlyLeftRoot, leftPlot.data, leftPlot.layout, config);
      leftInitialized = true;
    }

    if (rightInitialized && plotlyLib.react) {
      await plotlyLib.react(plotlyRightRoot, rightPlot.data, rightPlot.layout, config);
    } else {
      await plotlyLib.newPlot(plotlyRightRoot, rightPlot.data, rightPlot.layout, config);
      rightInitialized = true;
    }

    window.requestAnimationFrame(() => updatePlotLayoutOffset());
  } catch (err) {
    showPlotPlaceholder(plotlyLeftRoot, 'Unable to render the plot.');
    showPlotPlaceholder(plotlyRightRoot, 'Unable to render the plot.');
  }
}

function computeModel({ recycle, volume, CA0 }) {
  const vf = constants.vf;
  const CAf = constants.P / (constants.R * constants.T);
  const recycleRatio = Math.max(0, recycle);
  const Vr = Math.max(1, volume);
  const CA0Safe = Math.max(0, CA0);

  const vo = vf * (recycleRatio + 1);
  const k = 0.5 / vo;

  const V = linspace(0, Vr, Math.max(samplePoints, 2));
  const CA = V.map((v) => CA0Safe * Math.exp(-k * v));
  const CAe = CA.length ? CA[CA.length - 1] : CA0Safe;
  const CAfCalc = (recycleRatio + 1) * CA0Safe - recycleRatio * CAe;

  return {
    V,
    CA,
    CA0: CA0Safe,
    CAe,
    CAf,
    CAfCalc,
    recycleRatio,
    Vr
  };
}

function buildLeftPlot(model) {
  const { CAf, CAfCalc } = model;
  const axisLineW = 1.5;

  const ringTrace = {
    x: [0],
    y: [CAf],
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: 'rgb(0,153,0)',
      size: 18,
      line: { color: 'rgb(0,153,0)', width: 2 },
      symbol: 'circle-open'
    },
    hoverinfo: 'skip',
    showlegend: false
  };

  const targetTrace = {
    x: [0],
    y: [CAf],
    type: 'scatter',
    mode: 'markers',
    marker: {
      color: 'rgb(0,153,0)',
      size: 7
    },
    hoverinfo: 'skip',
    showlegend: false
  };

  const annotations = [
    {
      x: 0,
      y: CAfCalc,
      xref: 'x',
      yref: 'y',
      text: '',
      showarrow: true,
      arrowhead: 3,
      arrowsize: 1,
      arrowwidth: 2,
      arrowcolor: '#000',
      ax: 110,
      ay: 0,
      axref: 'pixel',
      ayref: 'pixel'
    },
    {
      x: 0,
      y: CAfCalc,
      xref: 'x',
      yref: 'y',
      text: 'calculated <i>C</i><sub>A,f</sub>',
      showarrow: false,
      font: { family: 'Arial, sans-serif', size: 16, color: '#000' },
      xanchor: 'center',
      yanchor: 'bottom',
      xshift: 62,
      yshift: -2
    },
    {
      x: 0,
      y: CAfCalc,
      xref: 'x',
      yref: 'y',
      text: `${formatNumber(CAfCalc, 3)} mol/L`,
      showarrow: false,
      font: { family: 'Arial, sans-serif', size: 16, color: '#000' },
      xanchor: 'center',
      yanchor: 'top',
      xshift: 55,
      yshift: 0
    }
  ];

  const layout = {
    margin: LEFT_MARGIN,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    showlegend: false,
    font: { family: 'Arial, sans-serif', size: 15, color: '#000' },
    title: {
      text: buildCAfLabel(CAf),
      x: 0.5,
      y: 0.98,
      xanchor: 'center',
      yanchor: 'top',
      font: { family: 'Arial, sans-serif', size: 16, color: '#000' }
    },
    xaxis: {
      range: [-0.02, 0.2],
      zeroline: false,
      showline: true,
      linecolor: '#000',
      linewidth: axisLineW,
      ticks: '',
      showticklabels: false,
      showgrid: false,
      fixedrange: true
    },
    yaxis: {
      title: {
        text: 'concentration of A (mol/L)',
        standoff: 12,
        font: { family: 'Arial, sans-serif', size: 16, color: '#111' }
      },
      range: [0.15, 0.4],
      autorange: false,
      zeroline: false,
      showline: true,
      linecolor: '#000',
      linewidth: axisLineW,
      ticks: 'outside',
      tickfont: { family: 'Arial, sans-serif', size: 14 },
      tickformat: '.2f',
      showgrid: false,
      fixedrange: true
    },
    annotations
  };

  return { data: [ringTrace, targetTrace], layout };
}

function buildRightPlot(model) {
  const { V, CA, CAf, CAe, Vr } = model;
  const axisLineW = 1.5;

  const trace = {
    x: V,
    y: CA,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#1f77b4', width: 3 },
    hoverinfo: 'skip',
    showlegend: false
  };

  const layout = {
    margin: RIGHT_MARGIN,
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    showlegend: false,
    font: { family: 'Arial, sans-serif', size: 15, color: '#000' },
    title: {
      text: buildCAfLabel(CAf),
      x: 0.5,
      y: 0.98,
      xanchor: 'center',
      yanchor: 'top',
      font: { family: 'Arial, sans-serif', size: 16, color: '#000' }
    },
    xaxis: {
      title: { text: 'reactor volume (L)', standoff: 12, font: { family: 'Arial, sans-serif', size: 16, color: '#111' } },
      range: [0, Vr],
      zeroline: false,
      showline: true,
      linecolor: '#000',
      linewidth: axisLineW,
      ticks: 'outside',
      tick0: 0,
      dtick: 100,
      tickfont: { family: 'Arial, sans-serif', size: 14 },
      showgrid: false,
      fixedrange: true
    },
    yaxis: {
      title: { text: 'concentration of A (mol/L)', standoff: 12, font: { family: 'Arial, sans-serif', size: 16, color: '#111' } },
      range: [0, 0.2],
      autorange: false,
      zeroline: false,
      showline: true,
      linecolor: '#000',
      linewidth: axisLineW,
      ticks: 'outside',
      tickfont: { family: 'Arial, sans-serif', size: 14 },
      tickformat: '.2f',
      showgrid: false,
      fixedrange: true
    },
    images: buildPfrInset(CAf, CAe)
  };

  return { data: [trace], layout };
}

function buildPfrInset(CAf, CAe) {
  const CAfText = formatNumber(CAf, 3);
  const CAeText = formatNumber(CAe, 3);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="360" height="140" viewBox="0 0 360 140">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L8,4 L0,8 Z" fill="#000"/>
        </marker>
      </defs>
      <line x1="40" y1="70" x2="150" y2="70" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="210" y1="70" x2="320" y2="70" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
      <path d="M130,70 L130,112 L230,112 L230,70" fill="none" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
      <rect x="150" y="55" width="60" height="30" fill="none" stroke="#000" stroke-width="2"/>
      <text x="180" y="74" font-size="12" font-family="Arial, sans-serif" text-anchor="middle">PFR</text>

      <text x="-30" y="58" font-size="16" font-family="Arial, sans-serif" text-anchor="start">
        <tspan font-style="italic">C</tspan><tspan font-size="8" dy="3">A,f</tspan><tspan dy="-3"> = ${CAfText} mol/L</tspan>
      </text>

      <text x="135" y="58" font-size="16" font-family="Arial, sans-serif" text-anchor="middle">
        <tspan font-style="italic">C</tspan><tspan font-size="8" dy="3">A,0</tspan>
      </text>

      <text x="180" y="130" font-size="16" font-family="Arial, sans-serif" text-anchor="middle">
        <tspan font-style="italic">C</tspan><tspan font-size="8" dy="3">A,e</tspan><tspan dy="-3"> = ${CAeText} mol/L</tspan>
      </text>

      <text x="278" y="58" font-size="16" font-family="Arial, sans-serif" text-anchor="middle">
        <tspan font-style="italic">C</tspan><tspan font-size="8" dy="3">A,e</tspan><tspan dy="-3"> = ${CAeText} mol/L</tspan>
      </text>
    </svg>
  `;

  return [
    {
      source: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      xref: 'paper',
      yref: 'paper',
      x: 0.5,
      y: 0.86,
      sizex: 0.72,
      sizey: 0.32,
      xanchor: 'center',
      yanchor: 'middle',
      layer: 'above'
    }
  ];
}

function buildCAfLabel(CAf) {
  return `<i>C</i><sub>A,f</sub> = ${formatNumber(CAf, 3)} mol/L`;
}

function updatePlotLayoutOffset() {
  if (!elements.plotLayout || !elements.svgContainer || !elements.controlBar) return;
  const containerRect = elements.svgContainer.getBoundingClientRect();
  const controlRect = elements.controlBar.getBoundingClientRect();
  const offset = Math.max(controlRect.bottom - containerRect.top + 8, 0);
  elements.plotLayout.style.setProperty('--plot-top', `${offset}px`);
}

function handleWindowResize() {
  if (pendingResizeFrame) cancelAnimationFrame(pendingResizeFrame);
  pendingResizeFrame = window.requestAnimationFrame(() => {
    pendingResizeFrame = null;
    updatePlotLayoutOffset();
    if (plotlyLibRef?.Plots) {
      if (plotlyLeftRoot) {
        try { plotlyLibRef.Plots.resize(plotlyLeftRoot); } catch (e) { }
      }
      if (plotlyRightRoot) {
        try { plotlyLibRef.Plots.resize(plotlyRightRoot); } catch (e) { }
      }
    }
  });
}

function showPlotPlaceholder(root, message) {
  if (!root) return;
  root.innerHTML = `<div class="plotly-placeholder">${message}</div>`;
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
  const out = new Array(count);
  for (let i = 0; i < count; i += 1) {
    out[i] = start + step * i;
  }
  return out;
}

function formatNumber(value, decimals) {
  if (!Number.isFinite(value)) return 'N/A';
  return Number(value).toFixed(decimals);
}
