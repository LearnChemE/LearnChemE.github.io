import * as config from './config.js';

const defaults = {
  initialHeight: 600,
  parachuteRadius: 4,
  safeVelocity: 3.7
};

const physics = {
  mass: 71,
  gravity: 9.81,
  airDensity: 1.2,
  cDPerson: 1,
  cDParachute: 1.75,
  waistRadius: 1.07 / (2 * Math.PI)
};

const samples = 600;
const plotlyCdnUrl = 'assets/plotly.js';

let drawRef;
let controlsReady = false;
const elements = {};
let plotlyRoot;
let plotlyPromise;
let plotInitialized = false;

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
  elements.heightSlider = document.getElementById('heightSlider');
  elements.radiusSlider = document.getElementById('radiusSlider');
  elements.heightValue = document.getElementById('heightValue');
  elements.radiusValue = document.getElementById('radiusValue');
  elements.statusMessage = document.getElementById('statusMessage');

  if (!elements.heightSlider || !elements.radiusSlider) return;

  const handleInput = () => renderPlot();
  [elements.heightSlider, elements.radiusSlider].forEach((slider) => {
    slider.addEventListener('input', handleInput);
  });

  syncControls(defaults);
  controlsReady = true;
}

function syncControls(values) {
  if (elements.heightSlider) elements.heightSlider.value = values.initialHeight;
  if (elements.radiusSlider) elements.radiusSlider.value = values.parachuteRadius;
  updateOutputs(values);
}

function getParams() {
  return {
    initialHeight: parseFloat(elements.heightSlider?.value) || defaults.initialHeight,
    parachuteRadius: parseFloat(elements.radiusSlider?.value) || defaults.parachuteRadius,
    safeVelocity: defaults.safeVelocity
  };
}

function updateOutputs({ initialHeight, parachuteRadius }) {
  if (elements.heightValue) elements.heightValue.textContent = `${Math.round(initialHeight)}`;
  if (elements.radiusValue) elements.radiusValue.textContent = `${parachuteRadius.toFixed(2)}`;
}

async function renderPlot() {
  if (!elements.heightSlider) return;
  if (!plotlyRoot) plotlyRoot = document.getElementById('plotly-root');
  const params = getParams();
  updateOutputs(params);
  const result = computeTrajectory(params);

  if (!plotlyRoot) {
    setStatusMessage('Plot container not found.');
    return;
  }

  if (!result.success) {
    setStatusMessage(result.message);
    plotInitialized = false;
    showPlotPlaceholder(result.message);
    return;
  }

  if (!plotInitialized) showPlotPlaceholder('Loading plot...');

  let plotlyLib;
  try {
    plotlyLib = await loadPlotly();
  } catch (err) {
    setStatusMessage('Plotly failed to load. Please refresh the page.');
    showPlotPlaceholder('Plotly failed to load. Please refresh the page.');
    return;
  }

  if (!plotlyLib) {
    setStatusMessage('Plotly failed to load. Please refresh the page.');
    showPlotPlaceholder('Plotly failed to load. Please refresh the page.');
    return;
  }

  const { times, heights, velocities, tOpen, finalTime, terminalVelocity } = result;
  setStatusMessage(
    `Open the parachute at ${tOpen.toFixed(2)} s. Terminal velocity is ${terminalVelocity.toFixed(1)} m/s (target landing speed ${params.safeVelocity.toFixed(1)} m/s).`
  );

  const timeStats = buildAxisStats([finalTime]);
  const heightStats = buildAxisStats(heights);
  const velocityStats = buildAxisStats(
    velocities.concat([params.safeVelocity, terminalVelocity])
  );

  renderPlotlyFigure({
    plotlyLib,
    params,
    result,
    stats: { timeStats, heightStats, velocityStats },
    initialized: plotInitialized
  });
  plotInitialized = true;
}

function setStatusMessage(message) {
  if (elements.statusMessage) elements.statusMessage.textContent = message;
}

function renderPlotlyFigure({ plotlyLib, params, result, stats, initialized }) {
  if (!plotlyRoot) return;
  const { times, heights, velocities, tOpen } = result;
  const { timeStats, heightStats, velocityStats } = stats;
  const containerHeight = Math.max((plotlyRoot.clientHeight || window.innerHeight || 0) - 20, 320);

  const heightTrace = {
    x: times,
    y: heights,
    mode: 'lines',
    name: 'height',
    line: { color: '#0d6efd', width: 3 },
    xaxis: 'x',
    yaxis: 'y',
    hovertemplate: 't: %{x:.2f} s<br>h: %{y:.0f} m<extra></extra>'
  };

  const velocityTrace = {
    x: times,
    y: velocities,
    mode: 'lines',
    name: 'velocity',
    line: { color: '#dc3545', width: 3 },
    xaxis: 'x2',
    yaxis: 'y2',
    hovertemplate: 't: %{x:.2f} s<br>U: %{y:.1f} m/s<extra></extra>'
  };

  const layout = {
    height: containerHeight,
    margin: { l: 80, r: 50, t: 12, b: 70 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hovermode: 'closest',
    grid: { rows: 1, columns: 2, pattern: 'independent', xgap: 0.18 },
    xaxis: createAxisOptions('time (s)', timeStats),
    xaxis2: createAxisOptions('time (s)', timeStats),
    yaxis: createAxisOptions('height (m)', heightStats),
    yaxis2: createAxisOptions('velocity (m/s)', velocityStats),
    showlegend: false,
    shapes: [
      { type: 'line', xref: 'x', yref: 'paper', x0: tOpen, x1: tOpen, y0: 0, y1: 1, line: { color: '#111', width: 2, dash: 'dot' } },
      { type: 'line', xref: 'x2', yref: 'paper', x0: tOpen, x1: tOpen, y0: 0, y1: 1, line: { color: '#111', width: 2, dash: 'dot' } },
      { type: 'line', xref: 'x2', yref: 'y2', x0: 0, x1: timeStats.max, y0: params.safeVelocity, y1: params.safeVelocity, line: { color: '#6c757d', width: 2, dash: 'dash' } }
    ],
    annotations: [
      {
        text: `safe velocity ${params.safeVelocity.toFixed(1)} m/s`,
        xref: 'x2',
        yref: 'y2',
        x: timeStats.max,
        y: params.safeVelocity,
        xanchor: 'right',
        yanchor: 'bottom',
        showarrow: false,
        font: { size: 12, color: '#6c757d' }
      }
    ]
  };

  const plotConfig = { responsive: true, displayModeBar: false };
  if (!initialized || !plotlyRoot.data) {
    plotlyRoot.innerHTML = '';
    plotlyLib.newPlot(plotlyRoot, [heightTrace, velocityTrace], layout, plotConfig);
  } else {
    plotlyLib.react(plotlyRoot, [heightTrace, velocityTrace], layout, plotConfig);
  }
  resetPlotZoom(plotlyLib);
}

function createAxisOptions(label, stats) {
  return {
    title: { text: label, standoff: 12 },
    range: [0, stats.max],
    tickvals: stats.ticks,
    ticktext: stats.ticks.map(formatAxisLabel),
    zeroline: false,
    mirror: true,
    linecolor: '#444',
    gridcolor: '#e4e4e4',
    ticks: 'outside',
    tickfont: { size: 13 },
    automargin: true
  };
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

function buildAxisStats(values) {
  const maxVal = Math.max(...values.map((val) => (Number.isFinite(val) ? val : 0)));
  const sanitized = Math.max(maxVal, 1);
  const ticks = buildTicks(sanitized);
  return { ticks, max: ticks[ticks.length - 1] };
}

function buildTicks(maxValue) {
  const sanitized = Math.max(maxValue, 1);
  const step = niceNumber(sanitized / 4);
  const ticks = [];
  for (let value = 0; value <= sanitized + step * 0.5; value += step) {
    ticks.push(parseFloat(value.toFixed(2)));
  }
  return ticks;
}

function niceNumber(value) {
  if (value <= 0 || !Number.isFinite(value)) return 1;
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;
  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;
  return niceFraction * Math.pow(10, exponent);
}

function formatAxisLabel(value) {
  let decimals;
  if (value >= 100) decimals = 0;
  else if (value >= 10) decimals = 0;
  else if (value >= 1) decimals = 1;
  else decimals = 2;
  const rounded = Number(value.toFixed(decimals));
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
}

function resetPlotZoom(plotlyLib) {
  if (!plotlyRoot || !plotlyLib) return;
  plotlyLib.relayout(plotlyRoot, {
    'xaxis.autorange': true,
    'xaxis2.autorange': true,
    'yaxis.autorange': true,
    'yaxis2.autorange': true
  }).catch(() => {});
}

function computeTrajectory(params) {
  const env = buildEnvironment(params);
  const terminalVelocity = Math.sqrt(physics.gravity / env.alphaAfter);
  if (params.safeVelocity <= terminalVelocity) {
    return {
      success: false,
      message: `Parachute is too small to reach ${params.safeVelocity.toFixed(1)} m/s. Terminal velocity is ${terminalVelocity.toFixed(1)} m/s.`
    };
  }

  const lowerBound = Math.max(0.1, Math.sqrt((2 * params.initialHeight) / physics.gravity));
  const upperBound = Math.max(lowerBound + 0.1, params.initialHeight * Math.sqrt(env.alphaAfter / physics.gravity));
  const landingFn = (tOpen) => landingHeight(tOpen, env, params.safeVelocity);
  const tOpen = findRootBisection(landingFn, lowerBound, upperBound);
  if (!Number.isFinite(tOpen)) {
    return {
      success: false,
      message: 'Unable to find a feasible deployment time with these settings.'
    };
  }

  const model = buildTrajectoryModel(env, tOpen, params.safeVelocity);
  if (!Number.isFinite(model.finalTime) || model.finalTime <= tOpen) {
    return {
      success: false,
      message: 'Unable to find a feasible deployment time with these settings.'
    };
  }

  const times = generateTimeArray(model.finalTime, samples);
  const heights = times.map((t) => Math.max(model.height(t), 0));
  const velocities = times.map((t) => Math.max(model.velocity(t), 0));
  return {
    success: true,
    times,
    heights,
    velocities,
    tOpen,
    finalTime: model.finalTime,
    terminalVelocity
  };
}

function buildEnvironment(params) {
  const personArea = Math.PI * physics.waistRadius * physics.waistRadius;
  const parachuteArea = Math.PI * Math.pow(Math.max(params.parachuteRadius, 0.1), 2);
  const dragBefore = physics.cDPerson * personArea;
  const dragAfter = dragBefore + physics.cDParachute * parachuteArea;
  const alphaBefore = (physics.airDensity * dragBefore) / (2 * physics.mass);
  const alphaAfter = (physics.airDensity * dragAfter) / (2 * physics.mass);
  return {
    h0: params.initialHeight,
    alphaBefore,
    alphaAfter,
    sqrtAlphaBg: Math.sqrt(alphaBefore * physics.gravity),
    sqrtAlphaAg: Math.sqrt(alphaAfter * physics.gravity)
  };
}

function landingHeight(tOpen, env, safeVelocity) {
  const model = buildTrajectoryModel(env, tOpen, safeVelocity);
  if (!Number.isFinite(model.finalTime)) return Number.NaN;
  return model.height(model.finalTime);
}

function buildTrajectoryModel(env, tOpen, safeVelocity) {
  const gamma = computeGamma(env, tOpen);
  const hb = (time) => env.h0 - Math.log((1 + Math.cosh(2 * env.sqrtAlphaBg * time)) / 2) / (2 * env.alphaBefore);
  const hOpen = hb(tOpen);
  const ha = (time) => {
    const delta = time - tOpen;
    const coshTerm = Math.cosh(2 * env.sqrtAlphaAg * delta);
    const sinhTerm = Math.sinh(2 * env.sqrtAlphaAg * delta);
    const numerator = 2 * gamma + (1 + gamma * gamma) * coshTerm + (1 - gamma * gamma) * sinhTerm;
    const denom = Math.pow(1 + gamma, 2);
    const ratio = Math.max(numerator / denom, 1e-12);
    return hOpen - Math.log(ratio) / (2 * env.alphaAfter);
  };

  const Ub = (time) => {
    const expTerm = Math.exp(-2 * env.sqrtAlphaBg * time);
    return Math.sqrt(physics.gravity / env.alphaBefore) * (1 - expTerm) / (1 + expTerm);
  };

  const Ua = (time) => {
    const expTerm = Math.exp(-2 * env.sqrtAlphaAg * (time - tOpen));
    return Math.sqrt(physics.gravity / env.alphaAfter) * (1 - gamma * expTerm) / (1 + gamma * expTerm);
  };

  const height = (time) => (time <= tOpen ? hb(time) : ha(time));
  const velocity = (time) => (time <= tOpen ? Ub(time) : Ua(time));
  const finalTime = computeFinalTime(env, gamma, tOpen, safeVelocity);

  return { height, velocity, finalTime };
}

function computeGamma(env, tOpen) {
  const expTerm = Math.exp(-2 * env.sqrtAlphaBg * tOpen);
  const numerator = Math.sqrt(env.alphaBefore) * (1 + expTerm) - Math.sqrt(env.alphaAfter) * (1 - expTerm);
  const denominator = Math.sqrt(env.alphaBefore) * (1 + expTerm) + Math.sqrt(env.alphaAfter) * (1 - expTerm);
  return numerator / denominator;
}

function computeFinalTime(env, gamma, tOpen, safeVelocity) {
  const ratio = safeVelocity * Math.sqrt(env.alphaAfter / physics.gravity);
  const logArgument = gamma * (1 + ratio) / (1 - ratio);
  if (logArgument <= 0) return Number.NaN;
  return tOpen + Math.log(logArgument) / (2 * env.sqrtAlphaAg);
}

function findRootBisection(fn, lower, upper, tolerance = 1e-5, maxIter = 100) {
  let a = lower;
  let b = upper;
  let fa = fn(a);
  let fb = fn(b);
  if (!Number.isFinite(fa) || !Number.isFinite(fb)) return Number.NaN;
  if (Math.sign(fa) === Math.sign(fb)) {
    for (let i = 0; i < 6; i += 1) {
      a = Math.max(1e-4, a * 0.8);
      b *= 1.2;
      fa = fn(a);
      fb = fn(b);
      if (!Number.isFinite(fa) || !Number.isFinite(fb)) return Number.NaN;
      if (Math.sign(fa) !== Math.sign(fb)) break;
    }
  }
  if (Math.sign(fa) === Math.sign(fb)) return Number.NaN;

  for (let i = 0; i < maxIter; i += 1) {
    const mid = 0.5 * (a + b);
    const fm = fn(mid);
    if (!Number.isFinite(fm)) return Number.NaN;
    if (Math.abs(fm) < tolerance) return mid;
    if (Math.sign(fm) === Math.sign(fa)) {
      a = mid;
      fa = fm;
    } else {
      b = mid;
      fb = fm;
    }
  }
  return 0.5 * (a + b);
}

function generateTimeArray(tf, count) {
  const steps = Math.max(count, 2);
  const dt = tf / (steps - 1);
  const arr = [];
  for (let i = 0; i < steps; i += 1) {
    arr.push(i * dt);
  }
  return arr;
}
