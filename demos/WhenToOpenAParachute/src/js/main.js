import Plotly from 'plotly.js/dist/plotly';

const defaults = {
  z0: 3000,
  dParachute: 10
};

const constants = {
  mass: 68,
  airDensity: 1,
  cDAperson: 0.93,
  cDparachute: 1.4,
  gravity: 9.8,
  deployTime: 30,
  safeVelocity: { min: 2.5, max: 3.5 },
  maxTime: 360,
  dt: 0.02
};

const elements = {
  plotRoot: null,
  sliders: {},
  sliderValues: {},
  landingSummary: null
};

const state = { ...defaults };

let initialized = false;
let plotInitialized = false;
let resizeBound = false;

export function drawFigure(draw) {
  if (draw?.hide) draw.hide();
  cacheElements();
  setupControls();
  renderSimulation();
  if (!resizeBound) {
    window.addEventListener('resize', handleResize, { passive: true });
    resizeBound = true;
  }
}

function cacheElements() {
  elements.plotRoot = document.getElementById('plotly-root');
  elements.sliders.z0 = document.getElementById('altitudeSlider');
  elements.sliders.dParachute = document.getElementById('diameterSlider');
  elements.sliderValues.z0 = document.getElementById('altitudeValue');
  elements.sliderValues.dParachute = document.getElementById('diameterValue');
  elements.landingSummary = document.getElementById('landingMessage');
}

function setupControls() {
  if (initialized) {
    syncControls(state);
    return;
  }

  const sliderConfig = [
    { key: 'z0', decimals: 0 },
    { key: 'dParachute', decimals: 1 }
  ];

  sliderConfig.forEach(({ key, decimals }) => {
    const slider = elements.sliders[key];
    if (!slider) return;
    slider.addEventListener('input', () => {
      const value = parseFloat(slider.value);
      if (!Number.isFinite(value)) return;
      state[key] = value;
      if (elements.sliderValues[key]) {
        elements.sliderValues[key].textContent = value.toFixed(decimals);
      }
      renderSimulation();
    });
  });

  syncControls(defaults);
  initialized = true;
}

function syncControls(values) {
  Object.entries(values).forEach(([key, value]) => {
    if (elements.sliders[key]) elements.sliders[key].value = value;
    if (elements.sliderValues[key]) {
      const decimals = key === 'z0' ? 0 : 1;
      elements.sliderValues[key].textContent = Number(value).toFixed(decimals);
    }
    state[key] = Number(value);
  });
}

function renderSimulation() {
  const result = integrateTrajectory(state);
  updateLandingSummary(result);
  renderPlot(result);
}

function handleResize() {
  if (plotInitialized && elements.plotRoot) {
    Plotly.Plots.resize(elements.plotRoot);
  }
}

function integrateTrajectory(params) {
  const dt = constants.dt;
  const maxSteps = Math.ceil(constants.maxTime / dt);
  const area = Math.PI * (params.dParachute ** 2) / 4;
  const times = [];
  const altitudes = [];
  const velocities = [];

  let z = params.z0;
  let U = 0;
  let t = 0;
  let groundEvent = null;

  for (let step = 0; step < maxSteps; step += 1) {
    const currentState = { t, z, U };
    times.push(t);
    altitudes.push(Math.max(z, 0));
    velocities.push(U);

    if (z <= 0) {
      groundEvent = { time: t, velocity: U };
      break;
    }

    const nextState = rk4Step(currentState, dt, area);

    if (nextState.z <= 0) {
      const landing = interpolateToAltitude(currentState, nextState, 0);
      if (landing) {
        times.push(landing.time);
        altitudes.push(0);
        velocities.push(landing.velocity);
        groundEvent = { time: landing.time, velocity: landing.velocity };
      } else {
        groundEvent = { time: nextState.t, velocity: nextState.U };
      }
      break;
    }

    t = nextState.t;
    z = nextState.z;
    U = nextState.U;
  }

  if (!groundEvent && times[times.length - 1] < t) {
    times.push(t);
    altitudes.push(Math.max(z, 0));
    velocities.push(U);
  }

  const maxVelocity = velocities.reduce((max, value) => Math.max(max, value), 0);

  return {
    times,
    altitudes,
    velocities,
    area,
    groundEvent,
    maxVelocity
  };
}

function rk4Step(state, dt, area) {
  const k1 = derivatives(state.t, state.z, state.U, area);
  const k2 = derivatives(
    state.t + dt / 2,
    state.z + (dt / 2) * k1.dzdt,
    state.U + (dt / 2) * k1.dUdt,
    area
  );
  const k3 = derivatives(
    state.t + dt / 2,
    state.z + (dt / 2) * k2.dzdt,
    state.U + (dt / 2) * k2.dUdt,
    area
  );
  const k4 = derivatives(
    state.t + dt,
    state.z + dt * k3.dzdt,
    state.U + dt * k3.dUdt,
    area
  );

  const dzdt = (k1.dzdt + 2 * k2.dzdt + 2 * k3.dzdt + k4.dzdt) / 6;
  const dUdt = (k1.dUdt + 2 * k2.dUdt + 2 * k3.dUdt + k4.dUdt) / 6;

  return {
    t: state.t + dt,
    z: state.z + dzdt * dt,
    U: state.U + dUdt * dt
  };
}

function derivatives(t, _z, U, area) {
  const sign = Math.abs(U) < 1e-8 ? 1 : Math.sign(U);
  const base = 0.5 * constants.airDensity * (U ** 2) * sign / constants.mass;
  const dragPerson = base * constants.cDAperson;
  let dragParachute = 0;
  if (t >= constants.deployTime && area > 0) {
    dragParachute = base * constants.cDparachute * area;
  }

  return {
    dzdt: -U,
    dUdt: constants.gravity - dragPerson - dragParachute
  };
}

function interpolateToAltitude(start, end, targetAltitude) {
  const span = end.z - start.z;
  if (span === 0) return null;
  const fraction = (targetAltitude - start.z) / span;
  return {
    time: start.t + fraction * (end.t - start.t),
    altitude: targetAltitude,
    velocity: start.U + fraction * (end.U - start.U)
  };
}

function renderPlot(result) {
  if (!elements.plotRoot || !result) return;
  if (!result.times.length) {
    showPlotPlaceholder('Unable to compute the trajectory. Adjust the sliders.');
    plotInitialized = false;
    return;
  }

  const figure = buildFigure(result);
  const config = {
    displayModeBar: false,
    responsive: true
  };

  if (!plotInitialized) {
    Plotly.newPlot(elements.plotRoot, figure.data, figure.layout, config);
    plotInitialized = true;
  } else {
    Plotly.react(elements.plotRoot, figure.data, figure.layout, config);
  }
}

function buildFigure(result) {
  const times = result.times;
  const altitudes = result.altitudes;
  const velocities = result.velocities;
  const lastTime = times[times.length - 1] || constants.maxTime;
  const xMax = Math.max(lastTime, constants.deployTime + 5);
  const vMax = Math.max(result.maxVelocity || 0, constants.safeVelocity.max * 1.2);
  const velocityRange = [0, vMax * 1.1];

  const altitudeTrace = {
    type: 'scatter',
    mode: 'lines',
    x: times,
    y: altitudes,
    name: 'altitude',
    line: { color: '#0d6efd', width: 3 },
    hovertemplate: 't = %{x:.1f} s<br>z = %{y:.0f} m<extra></extra>'
  };

  const velocityTrace = {
    type: 'scatter',
    mode: 'lines',
    x: times,
    y: velocities,
    name: 'downward speed',
    xaxis: 'x2',
    yaxis: 'y2',
    line: { color: '#ff7a18', width: 3 },
    hovertemplate: 't = %{x:.1f} s<br>U = %{y:.2f} m/s<extra></extra>'
  };

  const shapes = [
    {
      type: 'rect',
      xref: 'x2',
      yref: 'y2',
      x0: 0,
      x1: xMax,
      y0: constants.safeVelocity.min,
      y1: constants.safeVelocity.max,
      fillcolor: 'rgba(25, 135, 84, 0.18)',
      line: { width: 0 }
    },
    {
      type: 'line',
      xref: 'x2',
      yref: 'y2',
      x0: constants.deployTime,
      x1: constants.deployTime,
      y0: 0,
      y1: velocityRange[1],
      line: { color: '#6c757d', dash: 'dot', width: 2 }
    }
  ];

  const annotations = [
    {
      text: 'parachute opens',
      x: constants.deployTime + 1.5,
      xref: 'x2',
      y: Math.min(velocityRange[1] * 0.75, velocityRange[1] - 1),
      yref: 'y2',
      textangle: -90,
      showarrow: false,
      font: { size: 12, color: '#495057' }
    },
    {
      text: 'safe landing 2.5–3.5 m/s',
      x: xMax * 0.5,
      xref: 'x2',
      y: Math.min(constants.safeVelocity.max + 0.5, velocityRange[1] * 0.9),
      yref: 'y2',
      showarrow: false,
      align: 'center',
      font: { size: 18, color: '#0b2240', family: '"Helvetica Neue", Helvetica, Arial, sans-serif' }
    }
  ];

  if (result.groundEvent) {
    shapes.push({
      type: 'line',
      xref: 'x2',
      yref: 'paper',
      x0: result.groundEvent.time,
      x1: result.groundEvent.time,
      y0: 0,
      y1: 1,
      line: { color: '#adb5bd', width: 1 }
    });
  }

  shapes.push({
    type: 'line',
    xref: 'paper',
    yref: 'paper',
    x0: 0,
    x1: 1,
    y0: 0.5,
    y1: 0.5,
    line: { color: '#000', width: 2 }
  });
  shapes.push({
    type: 'line',
    xref: 'paper',
    yref: 'paper',
    x0: 0,
    x1: 1,
    y0: 1,
    y1: 1,
    line: { color: '#bfbfbf', width: 1 }
  });
  shapes.push({
    type: 'line',
    xref: 'paper',
    yref: 'paper',
    x0: 0,
    x1: 1,
    y0: 0,
    y1: 0,
    line: { color: '#bfbfbf', width: 1 }
  });

  const plotFont = {
    family: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    size: 16,
    color: '#0b2240'
  };

  const axisBorder = {
    mirror: true,
    linecolor: '#bfbfbf',
    linewidth: 1
  };

  const layout = {
    margin: { l: 90, r: 40, t: 18, b: 40 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    font: plotFont,
    grid: {
      rows: 2,
      columns: 1,
      pattern: 'independent',
      roworder: 'top to bottom',
      ygap: 0
    },
    xaxis: {
      range: [0, xMax],
      title: { text: '', standoff: 0 },
      showgrid: true,
      showticklabels: false,
      ticks: '',
      zeroline: false,
      automargin: true,
      showline: false
    },
    yaxis: {
      rangemode: 'tozero',
      title: { text: 'position (m)', standoff: 12 },
      showgrid: true,
      zeroline: false,
      automargin: true,
      ...axisBorder
    },
    xaxis2: {
      range: [0, xMax],
      title: { text: 'time (s)', standoff: 8 },
      showgrid: true,
      zeroline: false,
      automargin: true,
      showline: false,
      matches: 'x'
    },
    yaxis2: {
      range: velocityRange,
      title: { text: 'velocity (m/s)', standoff: 12 },
      showgrid: true,
      zeroline: false,
      automargin: true,
      ...axisBorder
    },
    shapes,
    annotations
  };

  return { data: [altitudeTrace, velocityTrace], layout };
}

function showPlotPlaceholder(message) {
  if (!elements.plotRoot) return;
  elements.plotRoot.innerHTML = `<div class="plotly-placeholder">${message}</div>`;
}

function updateLandingSummary(result) {
  if (!result || !elements.landingSummary) return;
  const landing = result.groundEvent;
  if (landing) {
    const v = Math.abs(landing.velocity);
    const t = landing.time;
    const safeMax = constants.safeVelocity.max;
    const opened = t >= constants.deployTime;

    let outcome;
    if (v <= safeMax) {
      outcome = 'safely landed';
    } else if (!opened) {
      outcome = 'hit the ground at unsafe speed since parachute never opened';
    } else {
      outcome = 'hit the ground at unsafe speed since parachute too small';
    }

    elements.landingSummary.textContent = outcome;
    return;
  }
  // Did not reach the ground within the simulation window.
  // Classify based on post-deployment terminal speed: if the eventual
  // terminal speed (with parachute) is within the safe range, treat as
  // "safely landed"; otherwise "too small".
  const tEnd = Array.isArray(result.times) && result.times.length ? result.times[result.times.length - 1] : 0;
  if (tEnd < constants.deployTime) {
    elements.landingSummary.textContent = 'hit the ground at unsafe speed since parachute never opened';
    return;
  }

  const dragTotal = constants.cDAperson + constants.cDparachute * (result.area || 0);
  const vt = Math.sqrt((2 * constants.mass * constants.gravity) / (constants.airDensity * Math.max(dragTotal, 1e-9)));
  elements.landingSummary.textContent = vt <= constants.safeVelocity.max
    ? 'safely landed'
    : 'hit the ground at unsafe speed since parachute too small';
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '—';
  return Number(value).toFixed(digits);
}
