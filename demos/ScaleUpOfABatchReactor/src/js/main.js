const defaults = {
  Ta: 303,
  h: 50,
  adiabatic: false
};

const constants = {
  Cp: 125,
  T0: 323,
  tf: 60,
  deltaH: -25000,
  Ca0: 0.015,
  R: 8.314
};

const plotlyScriptUrl = 'assets/plotly.js';
const TARGET_PLOT_WIDTH = 680;
const TARGET_PLOT_HEIGHT = 470;
const TARGET_PLOT_ASPECT = TARGET_PLOT_WIDTH / TARGET_PLOT_HEIGHT;
const VIEWPORT_INSET_PX = 40;
const MAX_ASPECT_FIT_ITERS = 3;

const FONT_REF_WIDTH = TARGET_PLOT_WIDTH;
const FONT_SCALE_MIN = 0.6;
const FONT_SCALE_MAX = 1.2;
const PLOT_MARGIN_L = 100;
const PLOT_MARGIN_R = 30;
const PLOT_MARGIN_T = 0;

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

  elements.tempSlider = document.getElementById('tempSlider');
  elements.heightSlider = document.getElementById('heightSlider');
  elements.adiabaticToggle = document.getElementById('adiabaticToggle');

  elements.tempValue = document.getElementById('tempValue');
  elements.heightValue = document.getElementById('heightValue');

  syncControls(defaults);

  elements.tempSlider?.addEventListener('input', renderPlot);
  elements.heightSlider?.addEventListener('input', renderPlot);
  elements.adiabaticToggle?.addEventListener('change', renderPlot);

  fitSvgContainerToPlotAspect();
  window.addEventListener('resize', handleWindowResize);
  controlsReady = true;
  updateAdiabaticUI();
}

function syncControls(values) {
  if (!values) return;
  if (elements.tempSlider) elements.tempSlider.value = `${values.Ta}`;
  if (elements.heightSlider) elements.heightSlider.value = `${values.h}`;
  if (elements.adiabaticToggle) elements.adiabaticToggle.checked = Boolean(values.adiabatic);
  updateOutputs(values);
}

function getParams() {
  const tempVal = parseFloat(elements.tempSlider?.value);
  const heightVal = parseFloat(elements.heightSlider?.value);
  const adiabatic = Boolean(elements.adiabaticToggle?.checked);

  return {
    Ta: Number.isFinite(tempVal) ? tempVal : defaults.Ta,
    h: Number.isFinite(heightVal) ? heightVal : defaults.h,
    adiabatic
  };
}

function updateOutputs({ Ta, h }) {
  if (elements.tempValue) elements.tempValue.textContent = `${Math.round(Ta)}`;
  if (elements.heightValue) elements.heightValue.textContent = `${Math.round(h)}`;
}

function updateAdiabaticUI() {
  if (!elements.controlBar) return;
  const adiabatic = Boolean(elements.adiabaticToggle?.checked);
  elements.controlBar.classList.toggle('is-adiabatic', adiabatic);
}

async function renderPlot() {
  if (!plotlyRoot) plotlyRoot = document.getElementById('plotly-root');
  if (!plotlyRoot) return;

  updateAdiabaticUI();

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

  const plot = buildPlot(model);
  const config = {
    displayModeBar: false,
    responsive: true,
    staticPlot: true
  };

  try {
    if (plotInitialized && plotlyLib.react) {
      await plotlyLib.react(plotlyRoot, plot.data, plot.layout, config);
    } else {
      await plotlyLib.newPlot(plotlyRoot, plot.data, plot.layout, config);
      plotInitialized = true;
    }
    window.requestAnimationFrame(() => updatePlotLayoutOffset());
  } catch (err) {
    showPlotPlaceholder('Unable to render the plot.');
  }
}

function computeModel({ Ta, h, adiabatic }) {
  const U = adiabatic ? 0 : 1.8;
  const d = h;
  const { Cp, T0, tf, deltaH, Ca0, R } = constants;

  const V = (Math.PI / 4) * d * d * h;
  const A = (Math.PI / 4) * d * d + Math.PI * d * h;
  const Na0 = Ca0 * V;

  const dt = 0.1;
  const steps = Math.max(1, Math.round(tf / dt));
  const t = new Array(steps + 1);
  const T = new Array(steps + 1);

  let time = 0;
  let temp = T0;
  let Na = Na0;

  t[0] = time;
  T[0] = temp;

  const derivatives = (currentT, currentNa) => {
    const k = 3e3 * Math.exp(-(30000 / (R * currentT)));
    const ra = -k * currentNa / V;
    const dNadt = ra * V;
    const dTdt = (deltaH * ra * V + U * A * (Ta - currentT)) / (Na0 * Cp);
    return { dTdt, dNadt };
  };

  for (let i = 1; i <= steps; i += 1) {
    const k1 = derivatives(temp, Na);
    const k2 = derivatives(temp + 0.5 * dt * k1.dTdt, Na + 0.5 * dt * k1.dNadt);
    const k3 = derivatives(temp + 0.5 * dt * k2.dTdt, Na + 0.5 * dt * k2.dNadt);
    const k4 = derivatives(temp + dt * k3.dTdt, Na + dt * k3.dNadt);

    temp += (dt / 6) * (k1.dTdt + 2 * k2.dTdt + 2 * k3.dTdt + k4.dTdt);
    Na += (dt / 6) * (k1.dNadt + 2 * k2.dNadt + 2 * k3.dNadt + k4.dNadt);
    time = Math.min(tf, time + dt);

    if (!Number.isFinite(temp)) temp = T0;
    if (!Number.isFinite(Na)) Na = Na0;
    if (Na < 0) Na = 0;

    t[i] = time;
    T[i] = temp;
  }

  return { t, T, A, V, AtoV: A / V };
}

function buildPlot(model) {
  const { t, T, A, V, AtoV } = model;
  const {
    fontScale,
    baseFontSize,
    axisTitleFontSize,
    tickFontSize,
    annotationFontSize,
    axisTitleStandoff
  } = getPlotFontMetrics();
  const plotMarginB = Math.max(0, Math.round(tickFontSize + axisTitleFontSize + axisTitleStandoff));

  const trace = {
    x: t,
    y: T,
    type: 'scatter',
    mode: 'lines',
    line: { color: '#1f4ed8', width: 3 },
    hoverinfo: 'skip',
    showlegend: false
  };

  const infoText = [
    `area to volume = ${formatSig(AtoV, 2)} cm<sup>-1</sup>`,
    `surface area = ${formatScientific(A, 2)} cm<sup>2</sup>`,
    `volume = ${formatScientific(V, 2)} cm<sup>3</sup>`
  ].join('<br>');

  const annotations = [
    {
      x: 0.98,
      y: 0.98,
      xref: 'paper',
      yref: 'paper',
      text: infoText,
      showarrow: false,
      align: 'right',
      xanchor: 'right',
      yanchor: 'top',
      font: { family: 'Arial, sans-serif', size: annotationFontSize, color: '#000' },
      bgcolor: '#fff',
      bordercolor: '#000',
      borderwidth: 1.5,
      borderpad: 6
    }
  ];


  const layout = {
    margin: { l: PLOT_MARGIN_L, r: PLOT_MARGIN_R, t: PLOT_MARGIN_T, b: plotMarginB },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    showlegend: false,
    font: { family: 'Arial, sans-serif', size: baseFontSize, color: '#000' },
    xaxis: {
      title: {
        text: 'time (min)',
        standoff: axisTitleStandoff,
        font: { family: 'Arial, sans-serif', size: axisTitleFontSize, color: '#000' }
      },
      range: [0, constants.tf],
      tick0: 0,
      dtick: 10,
      minor: { dtick: 2, ticklen: 4, tickwidth: 2, ticks: 'inside' },
      zeroline: false,
      showline: true,
      showgrid: false,
      linecolor: '#000',
      linewidth: 2,
      ticks: 'inside',
      ticklen: 6,
      tickwidth: 2,
      tickfont: { family: 'Arial, sans-serif', size: tickFontSize },
      showticklabels: true,
      mirror: false,
      fixedrange: true
    },
    yaxis: {
      title: {
        text: 'reactor temperature (K)',
        standoff: axisTitleStandoff,
        font: { family: 'Arial, sans-serif', size: axisTitleFontSize, color: '#000' }
      },
      range: [300, 525],
      tick0: 300,
      dtick: 50,
      minor: { dtick: 10, ticklen: 4, tickwidth: 2, ticks: 'inside' },
      zeroline: false,
      showline: true,
      showgrid: false,
      linecolor: '#000',
      linewidth: 2,
      ticks: 'inside',
      ticklen: 6,
      tickwidth: 2,
      tickfont: { family: 'Arial, sans-serif', size: tickFontSize },
      showticklabels: true,
      mirror: false,
      fixedrange: true
    },
    annotations
  };

  return { data: [trace], layout };
}

function getPlotFontMetrics() {
  const containerW = plotlyRoot ? plotlyRoot.clientWidth : FONT_REF_WIDTH;
  const fontScale = Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, containerW / FONT_REF_WIDTH));
  const baseFontSize = Math.round(16 * fontScale);
  const annotationFontSize = Math.round(17 * fontScale);
  const axisTitleFontSize = Math.round(18 * fontScale);
  const tickFontSize = Math.round(16 * fontScale);
  const axisTitleExtra = Math.round(10 * fontScale);
  const axisTitleStandoff = Math.round(12 * fontScale) + axisTitleExtra;

  return {
    fontScale,
    baseFontSize,
    axisTitleFontSize,
    tickFontSize,
    annotationFontSize,
    axisTitleStandoff
  };
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

function formatSig(value, digits) {
  if (!Number.isFinite(value)) return 'N/A';
  return Number(value).toPrecision(digits);
}

function formatScientific(value, digits) {
  if (!Number.isFinite(value)) return 'N/A';
  if (value === 0) return '0';
  const absVal = Math.abs(value);
  const exponent = Math.floor(Math.log10(absVal));
  const mantissa = value / Math.pow(10, exponent);
  const mantissaText = Number(mantissa).toPrecision(digits);
  return `${mantissaText} × 10<sup>${exponent}</sup>`;
}
