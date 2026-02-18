const defaults = {
  R: 1.0,
  D0: 10,
  k: 15
};

const constants = {
  porosity: 0.4,
  sigma: 0.8,
  tau: 3,
  CAs: 0.04
};

const plotlyScriptUrl = 'assets/plotly.js';
// Margins tuned for larger (1.5x) plot fonts while keeping labels readable.
const PLOT_MARGIN_L = 100;
const PLOT_MARGIN_R = 30;
const PLOT_MARGIN_T = 0;
const PLOT_MARGIN_B = 100;
const samplePoints = 201;
const TARGET_PLOT_ASPECT = 680 / 470;
const VIEWPORT_INSET_PX = 40; // Matches CSS `calc(100vw - 40px)` / `calc(100vh - 40px)`.
const MAX_ASPECT_FIT_ITERS = 3;

let drawRef;
let plotlyRoot;
let plotlyLibRef;
let plotlyPromise;
let plotInitialized = false;
let controlsReady = false;
let pendingResizeFrame;
const elements = {};

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
  elements.plotLayout = document.querySelector('.plot-layout');
  elements.svgContainer = document.getElementById('svg-container');
  elements.controlBar = document.getElementById('control-bar');

  elements.radiusSlider = document.getElementById('radiusSlider');
  elements.diffusivitySlider = document.getElementById('diffusivitySlider');
  elements.rateSlider = document.getElementById('rateSlider');

  elements.radiusValue = document.getElementById('radiusValue');
  elements.diffusivityValue = document.getElementById('diffusivityValue');
  elements.rateValue = document.getElementById('rateValue');

  syncControls(defaults);

  elements.radiusSlider?.addEventListener('input', renderPlot);
  elements.diffusivitySlider?.addEventListener('input', renderPlot);
  elements.rateSlider?.addEventListener('input', renderPlot);

  fitSvgContainerToPlotAspect();
  window.addEventListener('resize', handleWindowResize);
  controlsReady = true;
}

function syncControls(values) {
  if (!values) return;
  if (elements.radiusSlider) elements.radiusSlider.value = `${values.R}`;
  if (elements.diffusivitySlider) elements.diffusivitySlider.value = `${values.D0}`;
  if (elements.rateSlider) elements.rateSlider.value = `${values.k}`;
  updateOutputs(values);
}

function getParams() {
  const radiusVal = parseFloat(elements.radiusSlider?.value);
  const diffusivityVal = parseFloat(elements.diffusivitySlider?.value);
  const rateVal = parseFloat(elements.rateSlider?.value);
  return {
    R: Number.isFinite(radiusVal) ? radiusVal : defaults.R,
    D0: Number.isFinite(diffusivityVal) ? diffusivityVal : defaults.D0,
    k: Number.isFinite(rateVal) ? rateVal : defaults.k
  };
}

function updateOutputs({ R, D0, k }) {
  if (elements.radiusValue) elements.radiusValue.textContent = Number(R).toFixed(1);
  if (elements.diffusivityValue) elements.diffusivityValue.textContent = `${Math.round(D0)}`;
  if (elements.rateValue) elements.rateValue.textContent = `${Math.round(k)}`;
}

async function renderPlot() {
  if (!plotlyRoot) plotlyRoot = document.getElementById('plotly-root');
  if (!plotlyRoot) return;

  const params = getParams();
  updateOutputs(params);

  const model = computeModel(params);
  let plotlyLib;
  try {
    plotlyLib = await loadPlotly();
  } catch (err) {
    showPlotPlaceholder('Plotly failed to load.');
    return;
  }
  plotlyLibRef = plotlyLib;

  const { data, layout } = buildPlot(model, params);
  const config = {
    displayModeBar: false,
    responsive: true,
    staticPlot: true
  };

  try {
    if (plotInitialized && plotlyLib.react) {
      await plotlyLib.react(plotlyRoot, data, layout, config);
    } else {
      await plotlyLib.newPlot(plotlyRoot, data, layout, config);
      plotInitialized = true;
    }
    window.requestAnimationFrame(() => updatePlotLayoutOffset());
  } catch (err) {
    showPlotPlaceholder('Unable to render the plot.');
  }
}

function computeModel({ R, D0, k }) {
  const { porosity, sigma, tau, CAs } = constants;
  const De = Math.max(1e-9, D0 * porosity * sigma / tau);
  const phi = R * Math.sqrt(Math.max(k, 0) / De);

  const r = linspace(0, R, Math.max(samplePoints, 3));
  const CA = [];

  if (Math.abs(phi) < 1e-6) {
    for (let i = 0; i < r.length; i += 1) CA.push(CAs);
  } else {
    const sinhPhi = Math.sinh(phi);
    const safeSinhPhi = Math.abs(sinhPhi) < 1e-10 ? phi : sinhPhi;
    const CA0 = CAs * (phi / safeSinhPhi);
    for (let i = 0; i < r.length; i += 1) {
      const ri = r[i];
      if (ri === 0) {
        CA.push(CA0);
      } else {
        const ratio = Math.sinh(phi * ri / R) / safeSinhPhi;
        CA.push(CAs * (R / ri) * ratio);
      }
    }
  }

  let phiCothMinusOne;
  if (Math.abs(phi) < 1e-4) {
    phiCothMinusOne = (phi * phi) / 3;
  } else {
    phiCothMinusOne = phi * (Math.cosh(phi) / Math.sinh(phi)) - 1;
  }

  const M = 4 * Math.PI * R * De * CAs * phiCothMinusOne;
  const eta = Math.abs(phi) < 1e-6 ? 1 : (3 / (phi * phi)) * phiCothMinusOne;

  return { r, CA, phi, M, eta, CAs };
}

function buildPlot(model, params) {
  const { r, CA, phi, M, eta, CAs } = model;
  // Scale fonts dynamically based on actual container width (reference: 680px).
  const containerW = plotlyRoot ? plotlyRoot.clientWidth : 680;
  const fontScale = Math.min(1.2, Math.max(0.6, containerW / 680));
  const baseFontSize = Math.round(16 * fontScale);
  const annotationFontSize = Math.round(17 * fontScale);
  const axisTitleFontSize = Math.round(18 * fontScale);
  const tickFontSize = Math.round(16 * fontScale);
  const axisTitleStandoff = Math.round(12 * fontScale);

  const lineW = 3;
  const axisLineW = 2;
  const axisLineColor = '#000';

  const curveTrace = {
    x: r,
    y: CA,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#000', width: lineW },
    hoverinfo: 'skip',
    showlegend: false
  };

  const labelPaperOffset = -0.085;

  const annotations = [];
  annotations.push({
    x: params.R * 0.98,
    y: CAs + 0.0005,
    xref: 'x',
    yref: 'y',
    showarrow: false,
    text: `<i>C</i><sub>A,s</sub> = ${CAs.toFixed(2)} mmol/cm<sup>3</sup>`,
    font: { family: 'Arial, sans-serif', size: annotationFontSize, color: '#000' },
    xanchor: 'right',
    yanchor: 'bottom',
    xshift: -6,
    yshift: 4,
    bgcolor: 'white',
    bordercolor: 'white',
    borderpad: 2
  });
  annotations.push({
    x: 0,
    y: labelPaperOffset,
    xref: 'x',
    yref: 'paper',
    showarrow: false,
    text: '<i>r</i> = 0',
    font: { family: 'Arial, sans-serif', size: annotationFontSize, color: '#000' },
    xanchor: 'center',
    yanchor: 'top'
  });
  annotations.push({
    x: params.R,
    y: labelPaperOffset,
    xref: 'x',
    yref: 'paper',
    showarrow: false,
    text: '<i>r</i> = <i>R</i>',
    font: { family: 'Arial, sans-serif', size: annotationFontSize, color: '#000' },
    xanchor: 'center',
    yanchor: 'top'
  });

  const infoText = [
    `overall rate = ${formatNumber(M, 2)} mmol/s`,
    `Thiele modulus = ${formatNumber(phi, 2)}`,
    `effectiveness factor = ${formatNumber(eta, 2)}`
  ].join('<br>');
  annotations.push({
    x: 0.25 * params.R,
    // Anchor the info box just above the CAs dashed line so it never intersects it.
    y: CAs,
    xref: 'x',
    yref: 'y',
    showarrow: false,
    text: infoText,
    align: 'left',
    yanchor: 'bottom',
    yshift: 8,
    font: { family: 'Arial, sans-serif', size: annotationFontSize, color: '#000' },
    bgcolor: 'white',
    bordercolor: 'white',
    borderpad: 4
  });

  const shapes = [
    {
      type: 'line',
      xref: 'x',
      yref: 'y',
      x0: 0,
      x1: params.R,
      y0: CAs,
      y1: CAs,
      layer: 'below',
      line: { color: '#000', width: 2, dash: 'dash' }
    },
    {
      type: 'line',
      xref: 'x',
      yref: 'paper',
      x0: 0,
      x1: 0,
      y0: 0,
      y1: labelPaperOffset,
      line: { color: '#000', width: 2 }
    },
    {
      type: 'line',
      xref: 'x',
      yref: 'paper',
      x0: params.R,
      x1: params.R,
      y0: 0,
      y1: labelPaperOffset,
      line: { color: '#000', width: 2 }
    }
  ];

  const layout = {
    margin: { l: PLOT_MARGIN_L, r: PLOT_MARGIN_R, t: PLOT_MARGIN_T, b: PLOT_MARGIN_B },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    showlegend: false,
    font: { family: 'Arial, sans-serif', size: baseFontSize, color: '#000' },
    xaxis: {
      title: { text: 'catalyst pellet radius (cm)', standoff: axisTitleStandoff, font: { family: 'Arial, sans-serif', size: axisTitleFontSize, color: '#111' } },
      range: [0, params.R],
      showgrid: false,
      zeroline: false,
      showline: true,
      linecolor: axisLineColor,
      linewidth: axisLineW,
      ticks: 'outside',
      dtick: 0.1,
      tickformat: '.1f',
      tickfont: { family: 'Arial, sans-serif', size: tickFontSize },
      mirror: false
    },
    yaxis: {
      title: { text: 'concentration (mmol/cm<sup>3</sup>)', standoff: axisTitleStandoff, font: { family: 'Arial, sans-serif', size: axisTitleFontSize, color: '#111' } },
      range: [0, CAs + 0.008],
      autorange: false,
      showgrid: false,
      zeroline: false,
      showline: true,
      linecolor: axisLineColor,
      linewidth: axisLineW,
      ticks: 'outside',
      dtick: 0.01,
      tickformat: '.2f',
      tickfont: { family: 'Arial, sans-serif', size: tickFontSize },
      mirror: false
    },
    annotations,
    shapes,
    images: buildParticleInset()
  };

  return { data: [curveTrace], layout };
}

function buildParticleInset() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="230" height="230" viewBox="0 0 230 230">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L6,3 L0,6 Z" fill="#000"/>
        </marker>
      </defs>
      <circle cx="115" cy="115" r="68" fill="#e6e6e6" stroke="#000" stroke-width="2"/>
      <circle cx="115" cy="115" r="6" fill="#000"/>
      <circle cx="163" cy="67" r="6" fill="#000"/>
      <line x1="115" y1="115" x2="163" y2="67" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
      <line x1="115" y1="115" x2="162" y2="115" stroke="#000" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="120" y="85" font-size="24" font-style="italic" fill="#000" stroke="#fff" stroke-width="0.8" paint-order="stroke">R</text>
      <text x="148" y="132" font-size="24" font-style="italic" fill="#000" stroke="#fff" stroke-width="0.8" paint-order="stroke">r</text>
      <text x="172" y="66" font-size="18" fill="#000"><tspan font-style="italic">C</tspan><tspan font-size="11" dy="4">A,s</tspan></text>
    </svg>
  `;

  return [
    {
      source: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      xref: 'paper',
      yref: 'paper',
      x: 0.9,
      y: 0.18,
      sizex: 0.36,
      sizey: 0.36,
      xanchor: 'center',
      yanchor: 'middle',
      layer: 'above'
    }
  ];
}

function updatePlotLayoutOffset() {
  if (!elements.plotLayout || !elements.svgContainer || !elements.controlBar) return;
  const containerRect = elements.svgContainer.getBoundingClientRect();
  const controlRect = elements.controlBar.getBoundingClientRect();
  const offset = Math.max(controlRect.bottom - containerRect.top + 8, 0);
  elements.plotLayout.style.setProperty('--plot-top', `${offset}px`);
}

function fitSvgContainerToPlotAspect() {
  if (!elements.svgContainer || !elements.plotLayout || !elements.controlBar) return;

  const maxW = Math.max(0, window.innerWidth - VIEWPORT_INSET_PX);
  const maxH = Math.max(0, window.innerHeight - VIEWPORT_INSET_PX);
  if (maxW === 0 || maxH === 0) return;

  // Start from the max viewport-constrained size and shrink as needed.
  elements.svgContainer.style.width = `${Math.round(maxW)}px`;
  elements.svgContainer.style.height = `${Math.round(maxH)}px`;

  for (let i = 0; i < MAX_ASPECT_FIT_ITERS; i += 1) {
    updatePlotLayoutOffset();

    const containerRect = elements.svgContainer.getBoundingClientRect();
    const plotRect = elements.plotLayout.getBoundingClientRect();

    const extraW = containerRect.width - plotRect.width;
    const topOffset = plotRect.top - containerRect.top;
    const bottomGap = containerRect.bottom - plotRect.bottom;

    const maxPlotW = Math.max(0, maxW - extraW);
    const maxPlotH = Math.max(0, maxH - topOffset - bottomGap);
    const plotW = Math.min(maxPlotW, maxPlotH * TARGET_PLOT_ASPECT);
    const plotH = plotW / TARGET_PLOT_ASPECT;

    const nextW = Math.round(plotW + extraW);
    const nextH = Math.round(topOffset + plotH + bottomGap);

    const done = Math.abs(nextW - containerRect.width) < 1 && Math.abs(nextH - containerRect.height) < 1;
    elements.svgContainer.style.width = `${nextW}px`;
    elements.svgContainer.style.height = `${nextH}px`;
    if (done) break;
  }

  updatePlotLayoutOffset();
}

function handleWindowResize() {
  if (pendingResizeFrame) cancelAnimationFrame(pendingResizeFrame);
  pendingResizeFrame = window.requestAnimationFrame(() => {
    pendingResizeFrame = null;
    fitSvgContainerToPlotAspect();
    // Re-render the full plot so font sizes recalculate for the new size.
    renderPlot();
  });
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
