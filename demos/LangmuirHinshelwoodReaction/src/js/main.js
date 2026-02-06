const defaults = {
  mode: 'pressures',
  T: 298,
  ratio: 1
};

const zMax = 10;
const zPoints = 2001; // finer sampling along reactor to reduce numerical noise
const plotlyScriptUrl = 'assets/plotly.js';

let drawRef;
let plotlyRoot;
let plotlyLibRef;
let plotlyPromise;
let controlsReady = false;
let pendingResizeFrame;
const elements = {};
let selectedMode = defaults.mode;

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

  elements.modeButtons = document.querySelectorAll('#modeButtons button');
  elements.tempSlider = document.getElementById('tempSlider');
  elements.tempValue = document.getElementById('tempValue');
  elements.ratioSlider = document.getElementById('ratioSlider');
  elements.ratioValue = document.getElementById('ratioValue');

  syncControls(defaults);

  elements.modeButtons?.forEach((btn) => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      if (!mode || mode === selectedMode) return;
      selectedMode = mode;
      updateModeButtons();
      renderPlot();
    });
  });
  elements.tempSlider?.addEventListener('input', renderPlot);
  elements.ratioSlider?.addEventListener('input', renderPlot);

  updatePlotLayoutOffset();
  window.addEventListener('resize', handleWindowResize);
  controlsReady = true;
}

function syncControls(values) {
  if (!values) return;
  selectedMode = values.mode || defaults.mode;
  updateModeButtons();
  if (elements.tempSlider) elements.tempSlider.value = `${values.T}`;
  if (elements.ratioSlider) elements.ratioSlider.value = `${values.ratio}`;
  updateOutputs(values);
}

function getParams() {
  const Tval = parseFloat(elements.tempSlider?.value);
  const ratioVal = parseFloat(elements.ratioSlider?.value);
  return {
    mode: selectedMode || defaults.mode,
    // Use explicit NaN checks so valid 0 values are preserved
    T: Number.isFinite(Tval) ? Tval : defaults.T,
    ratio: Number.isFinite(ratioVal) ? ratioVal : defaults.ratio
  };
}

function updateOutputs({ T, ratio }) {
  if (elements.tempValue) elements.tempValue.textContent = `${Math.round(T)}`;
  if (elements.ratioValue) elements.ratioValue.textContent = `${Number(ratio).toFixed(1)}`;
}

async function renderPlot() {
  if (!plotlyRoot) plotlyRoot = document.getElementById('plotly-root');
  if (!plotlyRoot) return;

  const params = getParams();
  updateOutputs(params);

  const result = computeModel(params);
  let plotlyLib;
  try {
    plotlyLib = await loadPlotly();
  } catch (err) {
    showPlotPlaceholder('Plotly failed to load.');
    return;
  }
  plotlyLibRef = plotlyLib;

  const { data, layout } = buildPlot(result, params);
  const config = {
    displayModeBar: false,
    responsive: true,
    staticPlot: true
  };

  try {
    await plotlyLib.newPlot(plotlyRoot, data, layout, config);
  } catch (err) {
    showPlotPlaceholder('Unable to render the plot.');
  }
}

function computeModel({ T, ratio }) {
  // Parameters
  const R = 8.314;
  // Preserve valid 0-like values and only fallback if T is not a number
  const temperature = Math.max(1, Number.isFinite(T) ? T : 298);

  const k = 2.31e7 * Math.exp(-40000 / (R * temperature)); // mol CO/hr/mol catalyst
  const kO2 = 1.34e-2 * Math.exp(24830 / (R * temperature)); // 1/bar
  const kCO = 2.16 * Math.exp(10600 / (R * temperature)); // 1/bar

  const pO2i = 1.0;
  const pCOi = ratio * pO2i;

  const n = Math.max(4, zPoints);
  const h = zMax / (n - 1);
  const z = new Array(n);
  const pCO = new Array(n);
  const pO2 = new Array(n);
  const pCO2 = new Array(n);
  const thetaCO = new Array(n);
  const thetaO = new Array(n);
  const thetaV = new Array(n);
  const rate = new Array(n);

  // Initial conditions
  let y1 = pCOi;
  let y2 = pO2i;
  let y3 = 0.0;

  for (let i = 0; i < n; i += 1) {
    const zi = i * h;
    z[i] = zi;

    const sum = 1 + kCO * y1 + Math.sqrt(Math.max(0, kO2 * Math.max(y2, 0)));
    const thO = Math.sqrt(Math.max(0, kO2 * Math.max(y2, 0))) / Math.max(sum, 1e-12);
    const thCO = (kCO * y1) / Math.max(sum, 1e-12);
    const thV = Math.max(0, 1 - thO - thCO);
    const r = k * thO * thCO;
    pCO[i] = y1;
    pO2[i] = y2;
    pCO2[i] = y3;
    thetaCO[i] = thCO;
    thetaO[i] = thO;
    thetaV[i] = thV;
    rate[i] = r;

    if (i === n - 1) break;
    const derivs = (y1val, y2val) => {
      const sumD = 1 + kCO * y1val + Math.sqrt(Math.max(0, kO2 * Math.max(y2val, 0)));
      const thOD = Math.sqrt(Math.max(0, kO2 * Math.max(y2val, 0))) / Math.max(sumD, 1e-12);
      const thCOD = (kCO * y1val) / Math.max(sumD, 1e-12);
      const rD = k * thOD * thCOD;
      return [-rD, -rD / 2, rD];
    };

    const [k1a, k1b, k1c] = derivs(y1, y2);
    const [k2a, k2b, k2c] = derivs(y1 + 0.5 * h * k1a, y2 + 0.5 * h * k1b);
    const [k3a, k3b, k3c] = derivs(y1 + 0.5 * h * k2a, y2 + 0.5 * h * k2b);
    const [k4a, k4b, k4c] = derivs(y1 + h * k3a, y2 + h * k3b);

    y1 = y1 + (h / 6) * (k1a + 2 * k2a + 2 * k3a + k4a);
    y2 = y2 + (h / 6) * (k1b + 2 * k2b + 2 * k3b + k4b);
    y3 = y3 + (h / 6) * (k1c + 2 * k2c + 2 * k3c + k4c);

    // Avoid tiny negatives from numerical drift
    if (y1 < 0 && y1 > -1e-9) y1 = 0;
    if (y2 < 0 && y2 > -1e-9) y2 = 0;
    if (y3 < 0 && y3 > -1e-9) y3 = 0;
  }

  return { z, pCO, pO2, pCO2, thetaCO, thetaO, thetaV, rate };
}

function buildPlot(model, params) {
  const { z, pCO, pO2, pCO2, thetaCO, thetaO, thetaV, rate } = model;
  const mode = params.mode;

  const traces = [];
  let yTitle = '';
  let yRange = undefined;
  const lineW = 3;

  if (mode === 'pressures') {
    traces.push({ x: z, y: pCO, type: 'scatter', mode: 'lines', line: { color: '#1f77b4', width: lineW }, name: 'P_CO' });
    traces.push({ x: z, y: pO2, type: 'scatter', mode: 'lines', line: { color: 'rgb(0,179,0)', width: lineW }, name: 'P_O₂' });
    traces.push({ x: z, y: pCO2, type: 'scatter', mode: 'lines', line: { color: '#800080', width: lineW }, name: 'P_CO₂' });
    yTitle = 'pressure (bar)';
    yRange = [-0.2, 3.1];
  } else if (mode === 'coverage') {
    traces.push({ x: z, y: thetaCO, type: 'scatter', mode: 'lines', line: { color: '#1f77b4', width: lineW }, name: 'θ_CO' });
    traces.push({ x: z, y: thetaO, type: 'scatter', mode: 'lines', line: { color: 'rgb(255,51,128)', width: lineW }, name: 'θ_O' });
    traces.push({ x: z, y: thetaV, type: 'scatter', mode: 'lines', line: { color: 'rgb(255,77,0)', width: lineW }, name: 'θ_vacant' });
    yTitle = 'fractional surface coverage';
    yRange = [-0.05, 1.05];
  } else {
    traces.push({ x: z, y: rate, type: 'scatter', mode: 'lines', line: { color: '#000000', width: lineW }, name: 'rate' });
    yTitle = 'CO₂ formation rate (mol/[h g] catalyst)';
    yRange = [-0.05, 2.05];
  }

  const annotations = buildAnnotations(model, mode);
  const equationAnnotations = buildEquationAnnotations();
  annotations.push(...equationAnnotations);

  const layout = {
    margin: { l: 90, r: 30, t: 120, b: 70 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    showlegend: false,
    font: { family: 'Arial, sans-serif', size: 16, color: '#000' },
    xaxis: {
      title: { text: 'distance down reactor (m)', standoff: 12, font: { family: 'Arial, sans-serif', size: 18, color: '#111' } },
      range: [0, zMax],
      zeroline: false,
      ticks: 'outside',
      tickfont: { family: 'Arial, sans-serif', size: 16 },
      mirror: true
    },
    yaxis: {
      title: { text: yTitle, standoff: 12, font: { family: 'Arial, sans-serif', size: 18, color: '#111' } },
      range: yRange,
      autorange: false,
      zeroline: false,
      ticks: 'outside',
      tickfont: { family: 'Arial, sans-serif', size: 16 },
      mirror: true
    },
    annotations
  };

  return { data: traces, layout };
}

function updateModeButtons() {
  if (!elements.modeButtons) return;
  elements.modeButtons.forEach((btn) => {
    const active = btn.dataset.mode === selectedMode;
    btn.classList.toggle('btn-primary', active);
    btn.classList.toggle('btn-outline-primary', !active);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}

function buildAnnotations(model, mode) {
  const { z, pCO, pO2, pCO2, thetaCO, thetaO, thetaV } = model;
  const xs = [2.5, 5, 7.5];
  const anns = [];

  if (mode === 'pressures') {
    anns.push(
      makeCurveLabel(xs[0], interp(z, pCO, xs[0]), '<i>P</i><sub>CO</sub>', '#1f77b4', 0),
      makeCurveLabel(xs[1], interp(z, pO2, xs[1]), '<i>P</i><sub>O₂</sub>', 'rgb(0,179,0)', 0),
      makeCurveLabel(xs[2], interp(z, pCO2, xs[2]), '<i>P</i><sub>CO₂</sub>', '#800080', 0)
    );
  } else if (mode === 'coverage') {
    anns.push(
      makeCurveLabel(xs[0], interp(z, thetaCO, xs[0]), 'θ<sub>CO</sub>', '#1f77b4', 0),
      makeCurveLabel(xs[1], interp(z, thetaO, xs[1]), 'θ<sub>O</sub>', 'rgb(255,51,128)', 0),
      makeCurveLabel(xs[2], interp(z, thetaV, xs[2]), 'θ<sub>vacant</sub>', 'rgb(255,77,0)', 0)
    );
  }
  return anns;
}

function makeCurveLabel(x, y, text, color, yshift = 0) {
  return {
    x,
    y,
    xref: 'x',
    yref: 'y',
    text,
    showarrow: false,
    font: { family: 'Arial, sans-serif', size: 17, color },
    bgcolor: 'white',
    bordercolor: 'white',
    borderpad: 2,
    yshift,
    xanchor: 'center',
    yanchor: 'middle'
  };
}

function buildEquationAnnotations() {
  // Render the reaction with "catalyst" over the arrow
  return [
    // Left term: CO + 1/2 O2 (set to same baseline as arrow)
    {
      x: 0.47,
      y: 1.05,
      xref: 'paper',
      yref: 'paper',
      xanchor: 'right',
      text: 'CO + 1/2 O₂',
      showarrow: false,
      font: { family: 'Arial, sans-serif', size: 18, color: '#000' }
    },
    // Arrow only
    {
      x: 0.50,
      y: 1.05,
      xref: 'paper',
      yref: 'paper',
      text: '→',
      showarrow: false,
      font: { family: 'Arial, sans-serif', size: 24, color: '#000' }
    },
    // Catalyst directly on the arrow mark
    {
      x: 0.50,
      y: 1.029, // just above the arrow baseline (1.05)
      xref: 'paper',
      yref: 'paper',
      text: 'catalyst',
      showarrow: false,
      font: { family: 'Arial, sans-serif', size: 12, color: '#000' },
      bgcolor: 'white',
      bordercolor: 'white',
      borderpad: 1,
      xanchor: 'center',
      yanchor: 'bottom',
      align: 'center'
    },
    // Right term: CO2
    {
      x: 0.53,
      y: 1.05,
      xref: 'paper',
      yref: 'paper',
      xanchor: 'left',
      text: 'CO₂',
      showarrow: false,
      font: { family: 'Arial, sans-serif', size: 18, color: '#000' }
    }
  ];
}

function interp(xArr, yArr, x) {
  if (!Array.isArray(xArr) || !Array.isArray(yArr) || xArr.length !== yArr.length) return 0;
  if (x <= xArr[0]) return yArr[0];
  if (x >= xArr[xArr.length - 1]) return yArr[yArr.length - 1];
  let lo = 0;
  let hi = xArr.length - 1;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (xArr[mid] > x) hi = mid; else lo = mid;
  }
  const t = (x - xArr[lo]) / (xArr[hi] - xArr[lo]);
  return yArr[lo] * (1 - t) + yArr[hi] * t;
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
      try { plotlyLibRef.Plots.resize(plotlyRoot); } catch (e) {}
    }
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
